import { useCallback, useEffect, useRef, useState } from "react";
import { emitLearningEvent } from "../analytics/learningAnalytics";
import { useLearner } from "../context/LearnerContext";
import { getCachedAudio, saveCachedAudio } from "../../lib/persistence/db";
import { assetUrl, audioKey, audioUrls, AUDIO_PROFILE_V4, hasAssetHost } from "./assetUrls";
import { resolveAssetUrl } from "../../utils/assetUrl";
import { getPronunciationAssetSpec, hasPronunciationOverride } from "./pronunciationOverrides";
import { additionalRecordingKey } from "./additionalRecording";
import { edgeRecordingKey } from "./edgeRecording";
import { isEdgeRecordingAvailable } from "./edgeRecordingAvailability";

export type AudioStatus =
  "idle" | "loading" | "buffering" | "playing" | "paused" | "error" | "unsupported";
export type AudioSource = "recording" | null;
// One owner across narration, vocabulary inspectors and other audio hooks.
let activeAudioOwner: symbol | null = null;
let pauseActiveAudio: (() => void) | null = null;

interface Options {
  onEnded?: () => void;
  onError?: () => void;
  lang?: string;
  rate?: number;
  volume?: number;
  /** Prefer a matching content-addressed clip bundled in public/audio. */
  preferLocal?: boolean;
  /** Reports native media progress for synchronized transcript highlighting. */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

/** Stop waiting for media that cannot start; callers can offer Retry. */
const MEDIA_STREAM_TIMEOUT_MS = 15000;

const MAX_AUDIO_CACHE_SIZE = 64;
const audioCache = new Map<string, string>();

/** Ensures natural vocal frequencies without robotic pitch drops at slower playback rates. */
function applyPlaybackRate(audio: HTMLAudioElement, rate: number): void {
  audio.playbackRate = rate;
  const audioAny = audio as unknown as Record<string, boolean>;
  audioAny.preservesPitch = true;
  audioAny.mozPreservesPitch = true;
  audioAny.webkitPreservesPitch = true;
}

let audioUnlocked = false;

export function unlockAudio(): void {
  if (audioUnlocked || typeof window === "undefined") return;
  audioUnlocked = true;
  try {
    const silentAudio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA="
    );
    silentAudio.volume = 0;
    const playPromise = silentAudio.play();
    if (playPromise) {
      playPromise.catch(() => {
        audioUnlocked = false;
      });
    }
  } catch {
    audioUnlocked = false;
  }
}

if (typeof window !== "undefined") {
  const onFirstInteraction = () => {
    unlockAudio();
    window.removeEventListener("pointerdown", onFirstInteraction, true);
    window.removeEventListener("keydown", onFirstInteraction, true);
  };
  window.addEventListener("pointerdown", onFirstInteraction, { capture: true, once: true });
  window.addEventListener("keydown", onFirstInteraction, { capture: true, once: true });
}

export function isRecordingObjectKey(key: string): boolean {
  return (
    /^audio\/[a-f0-9]{2}\/[a-f0-9]{64}\.mp3$/.test(key) ||
    /^audio\/edge-v1\/(?:en-US-JennyNeural|ar-SA-ZariyahNeural)\/[a-f0-9]{64}\.mp3$/.test(key) ||
    /^assets\/audio\/scenarios\/[a-z0-9_-]+(?:\/[a-z0-9_-]+)*\.mp3$/.test(key)
  );
}

export function preloadAudioClip(urlOrKey: string): void {
  if (typeof window === "undefined" || !urlOrKey) return;
  const isKey = isRecordingObjectKey(urlOrKey);
  const primaryUrl = isKey ? (assetUrl(urlOrKey) ?? resolveAssetUrl(`/${urlOrKey}`)) : urlOrKey;
  if (!primaryUrl) return;
  const cacheKey = `cdn:${primaryUrl}`;
  if (audioCache.has(cacheKey)) return;

  const audio = new Audio();
  audio.preload = "auto";
  audio.src = primaryUrl;
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
  volume = 1,
  preferLocal = false,
  onEnded,
  onError,
  onTimeUpdate,
}: Options = {}) {
  const endedRef = useRef(onEnded);
  const errorRef = useRef(onError);
  const timeUpdateRef = useRef(onTimeUpdate);
  useEffect(() => {
    endedRef.current = onEnded;
    errorRef.current = onError;
    timeUpdateRef.current = onTimeUpdate;
  }, [onEnded, onError, onTimeUpdate]);
  // The learner's Settings speech rate is the default; an explicit `rate` prop
  // still wins so individual drills can slow playback further.
  const { state } = useLearner();
  const effectiveRate = rate ?? state.accessibility.speechRate;
  // Support is knowable at first render, so it is the initial state rather than
  // a setState fired from inside an effect (which causes a cascading render).
  const [status, setStatus] = useState<AudioStatus>(() =>
    typeof window === "undefined" || typeof window.Audio !== "function" ? "unsupported" : "idle"
  );
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
  const ownerIdRef = useRef(Symbol("audio-owner"));
  const [source, setSource] = useState<AudioSource>(null);
  const [progress, setProgress] = useState({ currentTime: 0, duration: 0 });
  const rateRef = useRef(effectiveRate);
  useEffect(() => {
    rateRef.current = effectiveRate;
    if (currentAudioRef.current) applyPlaybackRate(currentAudioRef.current, effectiveRate);
  }, [effectiveRate]);

  const stop = useCallback(() => {
    requestRef.current += 1;
    if (stallTimerRef.current !== null) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    // An inactive inspector must not stop another player on unmount.
    if (activeAudioOwner === ownerIdRef.current) {
      activeAudioOwner = null;
      pauseActiveAudio = null;
    }
    setStatus("idle");
    setSource(null);
    setProgress({ currentTime: 0, duration: 0 });
  }, []);

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
    (text: string, overrideLang?: string, objectKey?: string) => {
      if (activeAudioOwner === ownerIdRef.current) stop();
      else pauseActiveAudio?.();
      activeAudioOwner = ownerIdRef.current;
      pauseActiveAudio = () => {
        const media = currentAudioRef.current;
        if (media && Number.isFinite(media.duration) && media.duration > 0) {
          media.pause();
          setStatus("paused");
          activeAudioOwner = null;
          pauseActiveAudio = null;
        } else stop();
      };
      setSource(null);
      setProgress({ currentTime: 0, duration: 0 });
      const targetLang = overrideLang ?? lang;
      const cleanText = text.replace(/[-_]/g, " ").trim();
      const pronunciationAsset = getPronunciationAssetSpec(cleanText);
      const usesPronunciationOverride = hasPronunciationOverride(cleanText);

      const generation = ++requestRef.current;
      /** True while this call is still the one the learner is waiting on. */
      const isCurrent = () =>
        isMountedRef.current &&
        requestRef.current === generation &&
        activeAudioOwner === ownerIdRef.current;
      const reportProgress = (audio: HTMLAudioElement) => {
        if (!isCurrent() || currentAudioRef.current !== audio) return;
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        setProgress({ currentTime: audio.currentTime, duration });
        timeUpdateRef.current?.(audio.currentTime, duration);
      };
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
          if (next === "error" || next === "unsupported") {
            emitLearningEvent({ name: "media_failed", properties: { category: "audio" } });
            errorRef.current?.();
          }
        }
      };

      const clearStall = () => {
        if (stallTimerRef.current !== null) {
          window.clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
      };

      const reportUnavailable = () => {
        if (!isCurrent()) return;
        clearStall();
        currentAudioRef.current?.pause();
        currentAudioRef.current = null;
        setSource(null);
        setProgress({ currentTime: 0, duration: 0 });
        timeUpdateRef.current?.(0, 0);
        publish(typeof window.Audio === "function" ? "error" : "unsupported");
        if (requestRef.current === generation) requestRef.current += 1;
      };

      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      const playBlobUrl = (blobUrl: string) => {
        if (!isCurrent()) return;
        const audio = new Audio(blobUrl);
        applyPlaybackRate(audio, rateRef.current);
        audio.volume = volume;
        audio.ontimeupdate = () => {
          reportProgress(audio);
        };
        audio.onloadedmetadata = () => reportProgress(audio);
        audio.onwaiting = () => publish("buffering");
        audio.onplaying = () => {
          if (!isCurrent()) {
            audio.pause();
            return;
          }
          setSource("recording");
          reportProgress(audio);
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
          if (!isCurrent()) return;
          clearStall();
          reportUnavailable();
        };

        currentAudioRef.current = audio;
        clearStall();
        stallTimerRef.current = window.setTimeout(() => {
          if (isCurrent()) reportUnavailable();
        }, MEDIA_STREAM_TIMEOUT_MS);
        audio.play().catch((err: unknown) => {
          if (!isCurrent()) return;
          clearStall();
          const isAbort = err instanceof Error && err.name === "AbortError";
          const isNotAllowed = err instanceof Error && err.name === "NotAllowedError";
          if (isAbort) return;
          if (isNotAllowed) {
            publish("idle");
            return;
          }
          reportUnavailable();
        });
      };

      /** Exact references win. Otherwise resolve verified takes before speculative hashes. */
      const playPregenerated = async (): Promise<boolean> => {
        const explicitKey = objectKey && isRecordingObjectKey(objectKey) ? objectKey : null;
        const explicitUrl = explicitKey ? assetUrl(explicitKey) : null;
        const localExplicitUrl = explicitKey ? resolveAssetUrl(`/${explicitKey}`) : null;
        const urls: string[] = [];
        if (explicitKey) {
          if (preferLocal && localExplicitUrl) urls.push(localExplicitUrl);
          if (explicitUrl) urls.push(explicitUrl);
          if (localExplicitUrl) urls.push(localExplicitUrl);
        } else {
          if (hasAssetHost() && !usesPronunciationOverride) {
            const additional = await additionalRecordingKey(text, targetLang).catch(() => null);
            if (additional) {
              const url = assetUrl(additional);
              if (url) urls.push(url);
            }
            const edge = await edgeRecordingKey(text, targetLang).catch(() => null);
            if (edge && (await isEdgeRecordingAvailable(edge).catch(() => false))) {
              const url = assetUrl(edge);
              if (url) urls.push(url);
            }
          }
          if (hasAssetHost()) {
            urls.push(
              ...(await audioUrls(text.includes(" ") ? text : pronunciationAsset.text, [
                pronunciationAsset.profile,
                AUDIO_PROFILE_V4,
              ]))
            );
            if (cleanText !== text)
              urls.push(
                ...(await audioUrls(text.includes(" ") ? pronunciationAsset.text : text, [
                  pronunciationAsset.profile,
                  AUDIO_PROFILE_V4,
                ]))
              );
            const capitalized =
              pronunciationAsset.text.charAt(0).toUpperCase() + pronunciationAsset.text.slice(1);
            if (capitalized !== pronunciationAsset.text)
              urls.push(
                ...(await audioUrls(capitalized, [pronunciationAsset.profile, AUDIO_PROFILE_V4]))
              );
          } else if (preferLocal || usesPronunciationOverride) {
            urls.push(
              resolveAssetUrl(
                `/${await audioKey(pronunciationAsset.text, pronunciationAsset.profile)}`
              )
            );
          }
        }
        for (const url of new Set(urls)) {
          if (!isCurrent()) return true;
          const cacheKey = `cdn:${url}`;
          const memory = audioCache.get(cacheKey);
          if (memory) {
            publish("loading");
            playBlobUrl(memory);
            return true;
          }
          const stored = await getCachedAudio(cacheKey).catch(() => null);
          if (!isCurrent()) return true;
          if (stored && stored.size > 0) {
            const objectUrl = URL.createObjectURL(stored);
            cacheAudioUrl(cacheKey, objectUrl);
            publish("loading");
            playBlobUrl(objectUrl);
            return true;
          }
          if (await playStreamed(url)) {
            cacheInBackground(url, cacheKey);
            return true;
          }
        }
        return false;
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
          const ownsMedia = () => isCurrent() && currentAudioRef.current === audio;
          audio.preload = "auto";
          applyPlaybackRate(audio, rateRef.current);
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
            if (!ownsMedia() || (settled && !started)) {
              audio.pause();
              settle(true);
              return;
            }
            started = true;
            setSource("recording");
            reportProgress(audio);
            clearStall();
            publish("playing");
            settle(true);
          };
          audio.ontimeupdate = () => {
            reportProgress(audio);
          };
          audio.onloadedmetadata = () => reportProgress(audio);
          audio.onwaiting = () => {
            if (ownsMedia() && started) publish("buffering");
          };
          audio.onended = () => {
            if (!ownsMedia()) return;
            clearStall();
            publish("idle");
            endedRef.current?.();
          };
          audio.onerror = () => {
            if (!ownsMedia()) {
              settle(true);
              return;
            }
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
            if (!started) {
              audio.pause();
              audio.onplaying = () => audio.pause();
              settle(false);
            }
          }, MEDIA_STREAM_TIMEOUT_MS);

          audio.play().catch((err: unknown) => {
            if (!ownsMedia()) {
              settle(true);
              return;
            }
            clearStall();
            const isAbort = err instanceof Error && err.name === "AbortError";
            const isNotAllowed = err instanceof Error && err.name === "NotAllowedError";
            if (isAbort) {
              settle(true);
              return;
            }
            if (isNotAllowed) {
              publish("idle");
              settle(true);
              return;
            }
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

      if (!text.trim() || (!hasAssetHost() && !preferLocal && !usesPronunciationOverride)) {
        reportUnavailable();
        return;
      }
      publish("loading");

      playPregenerated()
        .catch(() => false)
        .then((played) => {
          if (!played) reportUnavailable();
        });
    },
    [lang, volume, preferLocal, stop]
  );

  const pause = useCallback(() => {
    if (status !== "playing" && status !== "buffering") return;
    if (currentAudioRef.current) currentAudioRef.current.pause();
    setStatus("paused");
  }, [status]);

  const resume = useCallback(() => {
    if (status !== "paused") return;
    if (activeAudioOwner !== ownerIdRef.current) pauseActiveAudio?.();
    activeAudioOwner = ownerIdRef.current;
    pauseActiveAudio = () => {
      const media = currentAudioRef.current;
      if (media && Number.isFinite(media.duration) && media.duration > 0) {
        media.pause();
        setStatus("paused");
        activeAudioOwner = null;
        pauseActiveAudio = null;
      } else stop();
    };
    const audio = currentAudioRef.current;
    if (audio) {
      setStatus("loading");
      void audio.play().catch(() => {
        if (isMountedRef.current && activeAudioOwner === ownerIdRef.current) {
          setStatus("error");
          emitLearningEvent({ name: "media_failed", properties: { category: "audio" } });
          errorRef.current?.();
        }
      });
    } else {
      setStatus("error");
      errorRef.current?.();
    }
  }, [status, stop]);

  const seek = useCallback((time: number) => {
    const audio = currentAudioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || !Number.isFinite(time)) return;
    const currentTime = Math.max(0, Math.min(time, audio.duration));
    audio.currentTime = currentTime;
    setProgress({ currentTime, duration: audio.duration });
    timeUpdateRef.current?.(currentTime, audio.duration);
  }, []);

  useEffect(
    () => () => {
      if (stallTimerRef.current !== null) clearTimeout(stallTimerRef.current);
      requestRef.current += 1;
      currentAudioRef.current?.pause();
      if (activeAudioOwner === ownerIdRef.current) {
        activeAudioOwner = null;
        pauseActiveAudio = null;
      }
    },
    [stop]
  );

  return {
    speak,
    stop,
    pause,
    resume,
    seek,
    source,
    ...progress,
    status,
    isPlaying: status === "playing" || status === "loading" || status === "buffering",
    isPaused: status === "paused",
    isLoading: status === "loading",
    isSupported: status !== "unsupported",
    isError: status === "error",
  };
}

export type AudioController = ReturnType<typeof useAudio>;
