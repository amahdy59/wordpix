import { useCallback, useEffect, useRef, useState } from "react";
import { useAudio } from "./useAudio";

/** Speak the context around a missing phrase, with one pause for the gap. */
export function useSentenceAudio(text: string) {
  const pending = useRef<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const next = useRef<() => void>(() => {});
  const [playingText, setPlayingText] = useState<string | null>(null);
  const [previousText, setPreviousText] = useState(text);
  // Returning to a previous question must not revive its stopped playback state.
  if (previousText !== text) {
    setPreviousText(text);
    setPlayingText(null);
  }
  const audio = useAudio({
    lang: "en-US",
    onEnded: () => {
      if (pending.current.length > 0) {
        timer.current = setTimeout(() => {
          timer.current = null;
          next.current();
        }, 650);
      } else {
        setPlayingText(null);
      }
    },
    onError: () => {
      pending.current = [];
      setPlayingText(null);
    },
  });
  const { speak, stop } = audio;
  const clearPlayback = useCallback(() => {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
    pending.current = [];
    stop();
  }, [stop]);
  const cancel = () => {
    clearPlayback();
    setPlayingText(null);
  };

  useEffect(() => {
    next.current = () => {
      const fragment = pending.current.shift();
      if (fragment) speak(fragment, undefined, undefined, { synthesisOnly: true });
    };
  }, [speak]);

  useEffect(() => {
    clearPlayback();
    return clearPlayback;
  }, [text, clearPlayback]);

  const play = () => {
    cancel();
    const fragments = text
      .split(/(?:_{2,}\s*)+/u)
      .map((part) => part.trim())
      .filter((part) => /[\p{L}\p{N}]/u.test(part));
    if (fragments.length === 0) return;
    setPlayingText(text);
    if (!/_{2,}/u.test(text)) {
      speak(text);
    } else {
      pending.current = fragments;
      next.current();
    }
  };

  return { ...audio, isPlaying: playingText === text || audio.isPlaying, play, stop: cancel };
}
