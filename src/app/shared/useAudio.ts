import { useCallback, useEffect, useRef, useState } from "react";
import { useLearner } from "../context/LearnerContext";
import { getCachedAudio, saveCachedAudio } from "../../lib/persistence/db";

export type AudioStatus = "idle" | "loading" | "playing" | "error" | "unsupported";

interface Options {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/** How long to wait for onstart before treating the utterance as failed. */
const SPEECH_START_TIMEOUT_MS = 4000;

function pickVoice(synth: SpeechSynthesis, targetLang: string): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (voices.length === 0) return null;

  const prefix = targetLang.split("-")[0].toLowerCase();
  const langLower = targetLang.toLowerCase();

  // 1. Natural / Neural online voices (Edge/Chrome/Azure highest-fidelity TTS)
  const naturalVoice = voices.find(
    (v) =>
      (v.name.includes("Natural") || v.name.includes("Online") || v.name.includes("Neural")) &&
      (v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(prefix))
  );
  if (naturalVoice) return naturalVoice;

  // 2. Google neural voices (Chrome/Android)
  const googleVoice = voices.find(
    (v) =>
      v.name.includes("Google") &&
      (v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(prefix))
  );
  if (googleVoice) return googleVoice;

  // 3. Apple Enhanced / Premium voices (macOS / iOS)
  const premiumVoice = voices.find(
    (v) =>
      (v.name.includes("Premium") || v.name.includes("Enhanced")) &&
      (v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(prefix))
  );
  if (premiumVoice) return premiumVoice;

  // 4. Non-local network-backed synthesis voices
  const remoteVoice = voices.find(
    (v) =>
      !v.localService &&
      (v.lang.toLowerCase() === langLower || v.lang.toLowerCase().startsWith(prefix))
  );
  if (remoteVoice) return remoteVoice;

  // 5. Higher clarity female voices (Zira / Samantha / Jenny) over robotic David
  const clearFemaleVoice = voices.find(
    (v) =>
      (v.name.includes("Zira") || v.name.includes("Samantha") || v.name.includes("Jenny")) &&
      v.lang.toLowerCase().startsWith(prefix)
  );
  if (clearFemaleVoice) return clearFemaleVoice;

  // 6. Exact language match or prefix fallback
  return (
    voices.find((v) => v.lang.toLowerCase() === langLower) ??
    voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ??
    voices[0] ??
    null
  );
}

const audioCache = new Map<string, string>();

export function useAudio({ lang = "en-US", rate, pitch = 1, volume = 1 }: Options = {}) {
  // The learner's Settings speech rate is the default; an explicit `rate` prop
  // still wins so individual drills can slow playback further.
  const { state } = useLearner();
  const effectiveRate = rate ?? state.accessibility.speechRate;
  // Support is knowable at first render, so it is the initial state rather than
  // a setState fired from inside an effect (which causes a cascading render).
  const [status, setStatus] = useState<AudioStatus>(() =>
    typeof window === "undefined" || !window.speechSynthesis ? "unsupported" : "idle"
  );
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== "undefined" && window.speechSynthesis ? window.speechSynthesis : null
  );
  const stallTimerRef = useRef<number | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return undefined;

    // Chrome populates voices asynchronously; the first call primes that load.
    synth.getVoices();
    const onVoicesChanged = () => synth.getVoices();
    synth.addEventListener("voiceschanged", onVoicesChanged);
    return () => synth.removeEventListener("voiceschanged", onVoicesChanged);
  }, []);

  const speak = useCallback(
    (text: string, overrideLang?: string) => {
      const cleanText = text.replace(/[-_]/g, " ").trim();
      const targetLang = overrideLang ?? lang;

      const clearStall = () => {
        if (stallTimerRef.current !== null) {
          clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
      };

      const fallbackToSynthesis = (fallbackText: string, fallbackLang: string) => {
        const synth = synthRef.current;
        if (!synth) {
          setStatus("unsupported");
          return;
        }

        synth.cancel();
        setStatus("loading");

        const utterance = new SpeechSynthesisUtterance(fallbackText);
        utterance.lang = fallbackLang;
        utterance.rate = effectiveRate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        const voice = pickVoice(synth, fallbackLang);
        if (voice) utterance.voice = voice;

        utterance.onstart = () => {
          clearStall();
          setStatus("playing");
        };
        utterance.onend = () => {
          clearStall();
          setStatus("idle");
        };
        utterance.onerror = (e) => {
          clearStall();
          if (e.error !== "interrupted" && e.error !== "canceled") {
            setStatus("error");
          } else {
            setStatus("idle");
          }
        };

        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS);

        synth.speak(utterance);
      };

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const apiKey =
        import.meta.env?.VITE_ELEVENLABS_API_KEY ||
        (typeof window !== "undefined" ? localStorage.getItem("wordpix_elevenlabs_key") : null);
      if (apiKey) {
        const voiceId =
          import.meta.env?.VITE_ELEVENLABS_VOICE_ID ||
          (typeof window !== "undefined"
            ? localStorage.getItem("wordpix_elevenlabs_voice_id")
            : null) ||
          "Xb7hH8MSUJpSbSDYk0k2";
        const cacheKey = `${voiceId}:${cleanText}`;

        const playBlobUrl = (blobUrl: string) => {
          const audio = new Audio(blobUrl);
          audio.onplay = () => {
            clearStall();
            setStatus("playing");
          };
          audio.onended = () => {
            clearStall();
            setStatus("idle");
          };
          audio.onerror = () => {
            clearStall();
            setStatus("error");
          };

          currentAudioRef.current = audio;
          audio.play().catch(() => {
            clearStall();
            setStatus("error");
          });
        };

        if (audioCache.has(cacheKey)) {
          setStatus("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return;
        }

        setStatus("loading");

        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS * 2); // Give API more time than local TTS

        // 1. Check permanent IndexedDB offline cache first
        getCachedAudio(cacheKey)
          .then((storedBlob) => {
            if (storedBlob) {
              const url = URL.createObjectURL(storedBlob);
              audioCache.set(cacheKey, url);
              playBlobUrl(url);
              return;
            }

            // 2. Not in IndexedDB cache, fetch from ElevenLabs API
            fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "xi-api-key": apiKey,
              },
              body: JSON.stringify({
                text: cleanText,
                model_id: "eleven_turbo_v2_5",
                voice_settings: {
                  stability: 0.7,
                  similarity_boost: 0.75,
                },
              }),
            })
              .then((res) => {
                if (!res.ok) throw new Error(`ElevenLabs API error: ${res.status}`);
                return res.blob();
              })
              .then((blob) => {
                // Permanently persist to IndexedDB for future runs/offline use
                saveCachedAudio(cacheKey, blob);
                const url = URL.createObjectURL(blob);
                audioCache.set(cacheKey, url);
                playBlobUrl(url);
              })
              .catch((err) => {
                console.error("ElevenLabs error, falling back to synthesis", err);
                fallbackToSynthesis(cleanText, targetLang);
              });
          })
          .catch((err) => {
            console.warn("IndexedDB audio cache lookup error", err);
            fallbackToSynthesis(cleanText, targetLang);
          });

        return;
      }

      fallbackToSynthesis(cleanText, targetLang);
    },
    [lang, effectiveRate, pitch, volume]
  );

  const stop = useCallback(() => {
    if (stallTimerRef.current !== null) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    synthRef.current?.cancel();
    setStatus("idle");
  }, []);

  useEffect(
    () => () => {
      if (stallTimerRef.current !== null) clearTimeout(stallTimerRef.current);
      synthRef.current?.cancel();
    },
    []
  );

  return {
    speak,
    stop,
    status,
    isPlaying: status === "playing" || status === "loading",
    isSupported: status !== "unsupported",
    isError: status === "error",
  };
}
