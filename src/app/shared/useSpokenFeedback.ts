import { useCallback, useEffect, useRef } from "react";
import { useAccessibility } from "./useAccessibilityPreferences";
import { buildFeedbackSequence } from "../exercises/feedbackSpeech";
import { useAudio } from "./useAudio";
import { audioUrl } from "./assetUrls";

const CHIME_CLEARANCE_MS = 180;

export const SPOKEN_ADVANCE_DELAY_MS = {
  correct: 2400,
  incorrect: 3600,
} as const;

interface SpeakInput {
  correct: boolean;
  targetLabel: string;
  targetTopic?: string;
  chosenLabel?: string | null;
  chosenTopic?: string;
}

export interface SpokenFeedback {
  enabled: boolean;
  speakFeedback: (input: SpeakInput, onComplete?: () => void) => void;
  cancel: () => void;
  delayFor: (correct: boolean) => number;
}

export function useSpokenFeedback(): SpokenFeedback {
  const { accessibility } = useAccessibility();
  // Feedback is always enabled if accessibility preferences allow it
  const enabled = accessibility.spokenFeedback !== false;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const variantRef = useRef(0);
  const sequenceQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  const onCompleteRef = useRef<(() => void) | null>(null);

  const playNextInSequenceRef = useRef<() => void>();

  const { speak, stop } = useAudio({
    onEnded: () => playNextInSequenceRef.current?.(),
    onError: () => playNextInSequenceRef.current?.(),
  });

  const playNextInSequence = useCallback(() => {
    if (sequenceQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      const onComplete = onCompleteRef.current;
      onCompleteRef.current = null;
      if (onComplete) onComplete();
      return;
    }

    const nextText = sequenceQueueRef.current.shift();
    if (nextText) speak(nextText);
  }, [speak]);

  useEffect(() => {
    playNextInSequenceRef.current = playNextInSequence;
  }, [playNextInSequence]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    sequenceQueueRef.current = [];
    isPlayingRef.current = false;
    onCompleteRef.current = null;
    stop();
  }, [stop]);

  const speakFeedback = useCallback(
    (input: SpeakInput, onComplete?: () => void) => {
      if (!enabled) {
        if (onComplete) onComplete();
        return;
      }

      cancel();

      onCompleteRef.current = onComplete || null;

      const sequence = buildFeedbackSequence({
        correct: input.correct,
        targetLabel: input.targetLabel,
        targetTopic: input.targetTopic,
        chosenLabel: input.chosenLabel,
        chosenTopic: input.chosenTopic,
        variant: variantRef.current++,
      });

      sequenceQueueRef.current = sequence;

      // Aggressively preload the sequence URLs so the browser fetches the media
      // during the 180ms chime clearance, eliminating the gap between sentences.
      sequence.forEach(async (text) => {
        const url = await audioUrl(text);
        if (url) {
          const audio = new Audio(url);
          audio.preload = "auto";
        }
      });

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        isPlayingRef.current = true;
        playNextInSequence();
      }, CHIME_CLEARANCE_MS);
    },
    [enabled, cancel, playNextInSequence]
  );

  const delayFor = useCallback(
    (correct: boolean) =>
      correct ? SPOKEN_ADVANCE_DELAY_MS.correct : SPOKEN_ADVANCE_DELAY_MS.incorrect,
    []
  );

  useEffect(() => cancel, [cancel]);

  return { enabled, speakFeedback, cancel, delayFor };
}
