import { useCallback, useEffect, useRef, useState } from "react";

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
  const prefix = targetLang.split("-")[0];
  return (
    voices.find((v) => v.lang === targetLang) ??
    voices.find((v) => v.lang.startsWith(prefix) && !v.localService) ??
    voices.find((v) => v.lang.startsWith(prefix)) ??
    null
  );
}

export function useAudio({
  lang = "en-US",
  rate = 0.82,
  pitch = 1,
  volume = 1,
}: Options = {}) {
  // Support is knowable at first render, so it is the initial state rather than
  // a setState fired from inside an effect (which causes a cascading render).
  const [status, setStatus] = useState<AudioStatus>(() =>
    typeof window === "undefined" || !window.speechSynthesis ? "unsupported" : "idle"
  );
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== "undefined" && window.speechSynthesis ? window.speechSynthesis : null
  );
  const stallTimerRef = useRef<number | null>(null);

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
      const synth = synthRef.current;
      if (!synth) {
        setStatus("unsupported");
        return;
      }

      synth.cancel();
      setStatus("loading");

      const targetLang = overrideLang ?? lang;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = targetLang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;

      const voice = pickVoice(synth, targetLang);
      if (voice) utterance.voice = voice;

      const clearStall = () => {
        if (stallTimerRef.current !== null) {
          clearTimeout(stallTimerRef.current);
          stallTimerRef.current = null;
        }
      };

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
        // "interrupted" / "canceled" are expected on cancel(); not real errors
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setStatus("error");
        } else {
          setStatus("idle");
        }
      };

      // If no voice is installed, speak() can resolve to silence: onstart never
      // fires, nor does onerror. Without this the hook stays "loading" forever,
      // and isPlaying (which counts "loading") leaves the UI showing a
      // permanent "Playing sound…" state.
      clearStall();
      stallTimerRef.current = window.setTimeout(() => {
        setStatus((current) => (current === "loading" ? "error" : current));
      }, SPEECH_START_TIMEOUT_MS);

      synth.speak(utterance);
    },
    [lang, rate, pitch, volume]
  );

  const stop = useCallback(() => {
    if (stallTimerRef.current !== null) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
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
