import { useCallback, useEffect, useRef, useState } from "react";
import { useLearner } from "../context/LearnerContext";
import { getCachedAudio, saveCachedAudio } from "../../lib/persistence/db";
import { audioUrl, hasAssetHost } from "./assetUrls";

export type AudioStatus = "idle" | "loading" | "playing" | "error" | "unsupported";

interface Options {
  onEnded?: () => void;
  onError?: () => void;
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

const MAX_AUDIO_CACHE_SIZE = 64;
const audioCache = new Map<string, string>();

/**
 * Whether `speechSynthesis` has been unlocked by a real user gesture yet.
 *
 * Mobile Safari and Chrome only honour `speak()` inside the short window that
 * follows a tap. Every path in `speak` below is asynchronous before it reaches
 * synthesis — a SHA-256 digest, a CDN fetch, possibly an ElevenLabs round trip
 * — and by the time any of them resolves the window has closed, so the
 * fallback ran and produced silence. That is the whole of the "audio does not
 * work on my phone" report: not an error, just nothing.
 *
 * The fix is to spend the gesture immediately on a silent utterance, which
 * unlocks the engine for the rest of the session. Module scope, not a ref:
 * the unlock is per document, and every `useAudio` instance shares it.
 */
let synthesisUnlocked = false;

function unlockSynthesis(synth: SpeechSynthesis): void {
  if (synthesisUnlocked) return;
  synthesisUnlocked = true;
  try {
    const primer = new SpeechSynthesisUtterance(" ");
    primer.volume = 0;
    synth.speak(primer);
  } catch {
    // An engine that refuses the primer will refuse the real utterance too;
    // there is nothing to recover here and nothing to report.
  }
}

function cacheAudioUrl(key: string, url: string) {
  if (audioCache.has(key)) return;
  if (audioCache.size >= MAX_AUDIO_CACHE_SIZE) {
    const oldestKey = audioCache.keys().next().value;
    if (oldestKey) {
      const oldUrl = audioCache.get(oldestKey);
      if (oldUrl && oldUrl.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(oldUrl);
        } catch {
          // ignore revocation error
        }
      }
      audioCache.delete(oldestKey);
    }
  }
  audioCache.set(key, url);
}

export function useAudio({
  lang = "en-US",
  rate,
  pitch = 1,
  volume = 1,
  onEnded,
  onError,
}: Options = {}) {
  const endedRef = useRef(onEnded);
  const errorRef = useRef(onError);
  useEffect(() => {
    endedRef.current = onEnded;
    errorRef.current = onError;
  }, [onEnded, onError]);
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
  /**
   * Which `speak` call is allowed to make noise.
   *
   * Tapping two words in quick succession used to start two chains of
   * promises, and whichever CDN fetch happened to finish last won — so the
   * voice could name the previous card. Every async continuation checks its
   * own generation against this before touching audio or state.
   */
  const requestRef = useRef(0);

  useEffect(() => {
    // Set on mount, not only cleared on unmount.
    //
    // A ref survives StrictMode's deliberate mount-unmount-remount in
    // development, so the cleanup left this `false` for the rest of the
    // session and every audio path bailed on its first guard: no speech, and a
    // "Playing sound…" chip that never cleared because the chain stopped
    // halfway. Assigning on mount restores the flag for the remount, and is
    // what makes this correct under any future remount too.
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const speak = useCallback(
    (text: string, overrideLang?: string) => {
      const targetLang = overrideLang ?? lang;
      const cleanText = text.replace(/[-_]/g, " ").trim();

      const generation = ++requestRef.current;
      /** True while this call is still the one the learner is waiting on. */
      const isCurrent = () => isMountedRef.current && requestRef.current === generation;
      /**
       * Publishes status only while this call still owns the player.
       *
       * Every step below is separated from the last by an `await`, and a
       * `stop()` or a newer `speak()` can land in any of those gaps. A raw
       * `setStatus` then wrote *after* the newer owner had already settled the
       * UI, and "loading" — written by a request that had since been
       * abandoned — stuck permanently: the drill showed "Playing sound…" for
       * the rest of the session and the replay button did nothing.
       */
      const publish = (next: AudioStatus) => {
        if (isCurrent()) {
          setStatus(next);
          if (next === "error" || next === "unsupported") errorRef.current?.();
        }
      };

      // Spend the gesture now, before the first `await`. See `unlockSynthesis`.
      if (synthRef.current) unlockSynthesis(synthRef.current);

      const clearStall = () => {
        if (stallTimerRef.current !== null) {
          window.clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
      };

      const fallbackToSynthesis = (fallbackText: string, fallbackLang: string) => {
        if (!isCurrent()) return;
        const synth = synthRef.current;
        if (!synth) {
          publish("unsupported");
          return;
        }

        synth.cancel();
        publish("loading");

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
          publish("playing");
        };
        utterance.onend = () => {
          if (!isCurrent()) return;
          if (!isMountedRef.current) return;
          clearStall();
          publish("idle");
          endedRef.current?.();
        };
        utterance.onerror = (e) => {
          if (!isMountedRef.current) return;
          clearStall();
          publish(e.error !== "interrupted" && e.error !== "canceled" ? "error" : "idle");
        };

        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          if (!isCurrent()) return;
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS);

        synth.speak(utterance);
      };

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const playBlobUrl = (blobUrl: string) => {
        if (!isCurrent()) return;
        const audio = new Audio(blobUrl);
        audio.playbackRate = effectiveRate;
        audio.onplaying = () => {
          clearStall();
          publish("playing");
        };
        audio.onended = () => {
          if (!isCurrent()) return;
          clearStall();
          publish("idle");
          endedRef.current?.();
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
          publish("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return true;
        }

        const stored = await getCachedAudio(cacheKey).catch(() => null);
        if (stored) {
          const objectUrl = URL.createObjectURL(stored);
          cacheAudioUrl(cacheKey, objectUrl);
          publish("loading");
          playBlobUrl(objectUrl);
          return true;
        }

        // Stream the clip straight from the CDN rather than fetching its bytes.
        //
        // `fetch` is subject to CORS and the asset bucket sends no
        // `Access-Control-Allow-Origin`, so every one of these requests failed
        // and every word in the app quietly fell through to the robot voice —
        // the pre-generated audio was never heard at all. A media element has
        // no such restriction: `<audio>` may play a cross-origin file, it just
        // may not let script read the samples. Playing is all this needs.
        //
        // A missing clip still 404s, `onerror` fires, and the caller falls
        // through to synthesis exactly as before.
        const played = await playStreamed(url);
        if (played) cacheInBackground(url, cacheKey);
        return played;
      };

      /**
       * Plays a URL through a media element, resolving to whether it started.
       *
       * Resolving on `play` rather than on `ended` matters: the caller only
       * needs to know whether to fall through to another source, and waiting
       * for the clip to finish would hold that decision for its whole duration.
       */
      const playStreamed = (url: string): Promise<boolean> =>
        new Promise((resolve) => {
          if (!isCurrent()) {
            resolve(true);
            return;
          }
          const audio = new Audio(url);
          audio.playbackRate = effectiveRate;
          audio.volume = volume;
          let started = false;
          let settled = false;
          const settle = (ok: boolean) => {
            if (settled) return;
            settled = true;
            resolve(ok);
          };

          // `playing`, not `play`.
          //
          // `play` fires the moment `play()` is called and the element is no
          // longer paused — before the browser has looked at the response. A
          // 404 therefore announced itself as a successful start, the caller
          // skipped its fallback, and the status stayed on "playing" for good
          // because a clip that never began also never ends. `playing` fires
          // only once frames are actually being rendered.
          audio.onplaying = () => {
            started = true;
            clearStall();
            publish("playing");
            settle(true);
          };
          audio.onended = () => {
            if (!isCurrent()) return;
            clearStall();
            publish("idle");
            endedRef.current?.();
          };
          audio.onerror = () => {
            clearStall();
            // An error after playback began is the end of the clip as far as
            // the UI is concerned; before it, it is a miss to fall through on.
            if (started) publish("error");
            else settle(false);
          };
          currentAudioRef.current = audio;
          publish("loading");

          // Nothing guarantees either event arrives — a request can hang on a
          // dead connection. Without this the drill would wait for it forever.
          clearStall();
          stallTimerRef.current = window.setTimeout(() => {
            if (!started) settle(false);
          }, SPEECH_START_TIMEOUT_MS);

          audio.play().catch(() => {
            clearStall();
            settle(false);
          });
        });

      /**
       * Warms the offline cache without holding up playback.
       *
       * This is the only thing the old `fetch` was really for. It stays a
       * fetch — IndexedDB needs the bytes — but it now runs after the learner
       * is already hearing the word, and its failure is invisible. Once the
       * bucket sends CORS headers this starts succeeding and offline playback
       * comes back; until then the app is merely online-only, not silent.
       */
      const cacheInBackground = (url: string, cacheKey: string): void => {
        if (audioCache.has(cacheKey)) return;
        // The media request may have cached a response without CORS headers.
        // Re-fetch with Origin so IndexedDB receives readable audio bytes.
        void fetch(url, { cache: "reload" })
          .then((res) => (res.ok ? res.blob() : null))
          .then((blob) => {
            if (!blob || blob.size === 0) return;
            saveCachedAudio(cacheKey, blob);
            cacheAudioUrl(cacheKey, URL.createObjectURL(blob));
          })
          .catch(() => {
            // No CORS on the bucket, or the learner went offline mid-clip.
            // Either way the word already played; there is nothing to say.
          });
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
        fallbackToSynthesis(cleanText, targetLang);
      };

      const playWithLearnerKey = (apiKey: string) => {
        const voiceId =
          (typeof window !== "undefined"
            ? localStorage.getItem("wordpix_elevenlabs_voice_id")
            : null) || "Xb7hH8MSUJpSbSDYk0k2";
        const cacheKey = `eleven:${voiceId}:${cleanText.toLowerCase()}`;

        if (audioCache.has(cacheKey)) {
          publish("loading");
          playBlobUrl(audioCache.get(cacheKey)!);
          return;
        }

        publish("loading");
        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          if (!isCurrent()) return;
          setStatus((current) => (current === "loading" ? "error" : current));
        }, SPEECH_START_TIMEOUT_MS * 2);

        getCachedAudio(cacheKey)
          .then((storedBlob) => {
            if (storedBlob) {
              const url = URL.createObjectURL(storedBlob);
              cacheAudioUrl(cacheKey, url);
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
                cacheAudioUrl(cacheKey, url);
                playBlobUrl(url);
              })
              .catch(() => {
                fallbackToSynthesis(cleanText, targetLang);
              });
          })
          .catch(() => {
            fallbackToSynthesis(cleanText, targetLang);
          });

        return;
      };

      // With no bucket configured there is no clip to look for, and going
      // through the async chain anyway would only delay the voice — on a phone,
      // past the point where it can still play at all.
      if (!hasAssetHost() && !apiKey) {
        fallbackToSynthesis(cleanText, targetLang);
        return;
      }

      playPregenerated()
        .catch(() => false)
        .then((played) => {
          if (!played) playRemainingFallbacks();
        });
    },
    [lang, effectiveRate, pitch, volume]
  );

  const stop = useCallback(() => {
    // Retiring the generation stops any fetch still in flight from playing
    // after the learner has asked for silence.
    requestRef.current += 1;
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
      requestRef.current += 1;
      currentAudioRef.current?.pause();
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
