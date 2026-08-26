import { useCallback, useEffect, useRef, useState } from "react";
import { useLearner } from "../context/LearnerContext";
import { getCachedAudio, saveCachedAudio } from "../../lib/persistence/db";
import { audioUrl } from "./assetUrls";

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
  useEffect(() => {
    const synth = synthRef.current;
    if (!synth) return undefined;

    // Chrome populates voices asynchronously; the first call primes that load.
    synth.getVoices();
    const onVoicesChanged = () => synth.getVoices();
    synth.addEventListener("voiceschanged", onVoicesChanged);
    return () => synth.removeEventListener("voiceschanged", onVoicesChanged);
  }, []);

  const stallTimerRef = useRef<number | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const speak = useCallback(
    (text: string, overrideLang?: string) => {
      const targetLang = overrideLang ?? lang;
      const cleanText = text.replace(/[-_]/g, " ").trim();

      const clearStall = () => {
        if (stallTimerRef.current !== null) {
          window.clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
      };

      const fallbackToSynthesis = (fallbackText: string, fallbackLang: string) => {
        if (!isMountedRef.current) return;
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
          if (!isMountedRef.current) return;
          clearStall();
          setStatus("playing");
        };
        utterance.onend = () => {
          if (!isMountedRef.current) return;
          clearStall();
          setStatus("idle");
        };
        utterance.onerror = (e) => {
          if (!isMountedRef.current) return;
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

      const playBlobUrl = (blobUrl: string) => {
        const audio = new Audio(blobUrl);
        audio.playbackRate = effectiveRate;
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
          fallbackToSynthesis(cleanText, targetLang);
        };

        currentAudioRef.current = audio;
        audio.play().catch(() => {
          clearStall();
          fallbackToSynthesis(cleanText, targetLang);
        });
      };

      const playNeuralCloudStream = (phrase: string, speechLang: string) => {
        const cacheKey = `neural_v2:${speechLang}:${phrase.toLowerCase()}`;

        if (audioCache.has(cacheKey)) {
          setStatus("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return;
        }

        setStatus("loading");
        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS * 2);

        getCachedAudio(cacheKey)
          .then((storedBlob) => {
            if (storedBlob) {
              const url = URL.createObjectURL(storedBlob);
              audioCache.set(cacheKey, url);
              playBlobUrl(url);
              return;
            }

            const langParam = speechLang.toLowerCase().startsWith("ar") ? "ar" : "en";
            const neuralUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langParam}&client=tw-ob&q=${encodeURIComponent(phrase)}`;

            fetch(neuralUrl)
              .then((res) => {
                if (!res.ok) throw new Error(`Neural CDN status ${res.status}`);
                return res.blob();
              })
              .then((blob) => {
                saveCachedAudio(cacheKey, blob);
                const url = URL.createObjectURL(blob);
                audioCache.set(cacheKey, url);
                playBlobUrl(url);
              })
              .catch(() => {
                const directAudio = new Audio(neuralUrl);
                directAudio.playbackRate = effectiveRate;
                directAudio.onplay = () => {
                  clearStall();
                  setStatus("playing");
                };
                directAudio.onended = () => {
                  clearStall();
                  setStatus("idle");
                };
                directAudio.onerror = () => {
                  clearStall();
                  fallbackToSynthesis(phrase, speechLang);
                };
                currentAudioRef.current = directAudio;
                directAudio.play().catch(() => {
                  clearStall();
                  fallbackToSynthesis(phrase, speechLang);
                });
              });
          })
          .catch(() => {
            fallbackToSynthesis(phrase, speechLang);
          });
      };

      /**
       * A clip the build already generated and uploaded.
       *
       * This is the normal path. The vocabulary and the learning materials are
       * synthesised once by scripts/generate_audio.cjs and served as immutable
       * static files, so playback costs nothing and needs no credentials. The
       * object key is a hash of the text, derived identically here and in the
       * generator, so no manifest of what exists has to ship with the app — a
       * miss simply 404s and falls through to the paths below.
       */
      const playPregenerated = async (): Promise<boolean> => {
        const url = await audioUrl(cleanText);
        if (!url) return false;
        const cacheKey = `cdn:${url}`;

        if (audioCache.has(cacheKey)) {
          setStatus("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return true;
        }

        const stored = await getCachedAudio(cacheKey).catch(() => null);
        if (stored) {
          const objectUrl = URL.createObjectURL(stored);
          audioCache.set(cacheKey, objectUrl);
          setStatus("loading");
          playBlobUrl(objectUrl);
          return true;
        }

        const res = await fetch(url);
        if (!res.ok) return false;
        const blob = await res.blob();
        saveCachedAudio(cacheKey, blob);
        const objectUrl = URL.createObjectURL(blob);
        audioCache.set(cacheKey, objectUrl);
        setStatus("loading");
        playBlobUrl(objectUrl);
        return true;
      };

      /**
       * Only a key the learner supplied themselves.
       *
       * This used to fall back to import.meta.env.VITE_ELEVENLABS_API_KEY.
       * Vite inlines every VITE_* value into the client bundle, so the shared
       * account key was served to every visitor in plain JavaScript and could
       * be lifted straight out of the deployed site. Pre-generated clips (see
       * scripts/generate_audio.cjs) cover the vocabulary without any key at
       * all; a learner who wants neural audio for arbitrary text can still
       * paste their own, which stays in their browser.
       */
      const apiKey =
        typeof window !== "undefined" ? localStorage.getItem("wordpix_elevenlabs_key") : null;

      const playRemainingFallbacks = () => {
        if (apiKey) {
          playWithLearnerKey(apiKey);
          return;
        }
        playNeuralCloudStream(cleanText, targetLang);
      };

      const playWithLearnerKey = (apiKey: string) => {
        const voiceId =
          (typeof window !== "undefined"
            ? localStorage.getItem("wordpix_elevenlabs_voice_id")
            : null) || "Xb7hH8MSUJpSbSDYk0k2";
        const cacheKey = `eleven:${voiceId}:${cleanText.toLowerCase()}`;

        if (audioCache.has(cacheKey)) {
          setStatus("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return;
        }

        setStatus("loading");
        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS * 2);

        getCachedAudio(cacheKey)
          .then((storedBlob) => {
            if (storedBlob) {
              const url = URL.createObjectURL(storedBlob);
              audioCache.set(cacheKey, url);
              playBlobUrl(url);
              return;
            }

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
                saveCachedAudio(cacheKey, blob);
                const url = URL.createObjectURL(blob);
                audioCache.set(cacheKey, url);
                playBlobUrl(url);
              })
              .catch((err) => {
                console.error("ElevenLabs error, falling back to neural stream", err);
                playNeuralCloudStream(cleanText, targetLang);
              });
          })
          .catch(() => {
            playNeuralCloudStream(cleanText, targetLang);
          });

        return;
      };

      playPregenerated()
        .catch(() => false)
        .then((played) => {
          if (!played) playRemainingFallbacks();
        });
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
