import { useCallback, useEffect, useRef, useState } from "react";

export type AudioStatus = "idle" | "loading" | "playing" | "error" | "unsupported";

interface Options {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

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
  const [status, setStatus] = useState<AudioStatus>("idle");
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setStatus("unsupported");
      return;
    }
    synthRef.current = window.speechSynthesis;
    // Trigger async voice load on browsers that need it (Chrome)
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
    return () => window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
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

      utterance.onstart = () => setStatus("playing");
      utterance.onend = () => setStatus("idle");
      utterance.onerror = (e) => {
        // "interrupted" / "canceled" are expected on cancel(); not real errors
        if (e.error !== "interrupted" && e.error !== "canceled") {
          setStatus("error");
        } else {
          setStatus("idle");
        }
      };

      activeUtteranceRef.current = utterance;
      synth.speak(utterance);
    },
    [lang, rate, pitch, volume]
  );

  const stop = useCallback(() => {
    synthRef.current?.cancel();
    setStatus("idle");
  }, []);

  useEffect(() => () => { synthRef.current?.cancel(); }, []);

  return {
    speak,
    stop,
    status,
    isPlaying: status === "playing" || status === "loading",
    isSupported: status !== "unsupported",
    isError: status === "error",
  };
}
