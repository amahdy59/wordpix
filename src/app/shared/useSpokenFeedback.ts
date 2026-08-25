import { useCallback, useEffect, useRef } from "react";
import { useAudio } from "./useAudio";
import { useAccessibility } from "./useAccessibilityPreferences";
import { buildFeedbackSpeech } from "../exercises/feedbackSpeech";

/**
 * Speaks the answer back after each question, layered over the earcon.
 *
 * The two sounds are staggered rather than mixed. Starting speech on the same
 * tick as the chime buries the first syllable underneath it — the C5/E5 ping
 * runs 350ms — so the sentence waits for the chime to clear. That gap is also
 * roughly how long the correct/incorrect animation takes to land, so the
 * spoken word arrives with the word on screen rather than ahead of it.
 */
const CHIME_CLEARANCE_MS = 380;

/**
 * How long feedback must stay on screen for a sentence to finish.
 *
 * The silent delays (900ms correct, 2200ms incorrect) were set for reading a
 * word, not hearing one. "Correct! This is a faucet." runs past two seconds at
 * the default 0.75 speech rate, so auto-advance would cut its own narration
 * off mid-word. These apply only while spoken feedback is on.
 */
export const SPOKEN_ADVANCE_DELAY_MS = {
  correct: 2400,
  incorrect: 3600,
} as const;

interface SpeakInput {
  correct: boolean;
  targetLabel: string;
  chosenLabel?: string | null;
}

export interface SpokenFeedback {
  /** True when the learner has spoken feedback switched on and it can play. */
  enabled: boolean;
  /** Speaks the sentence for this answer. Safe to call when disabled. */
  speakFeedback: (input: SpeakInput) => void;
  /** Silences anything pending or in flight. */
  cancel: () => void;
  /** The auto-advance delay to use, accounting for narration length. */
  delayFor: (correct: boolean) => number;
}

export function useSpokenFeedback(): SpokenFeedback {
  const { accessibility } = useAccessibility();
  const { speak, stop, isSupported } = useAudio({ lang: "en-US" });

  const enabled = accessibility.spokenFeedback && isSupported;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Rotates the opener. A ref rather than state: nothing renders from it, and
  // bumping state here would re-render the whole drill on every answer.
  const variantRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    clearTimer();
    stop();
  }, [clearTimer, stop]);

  const speakFeedback = useCallback(
    ({ correct, targetLabel, chosenLabel }: SpeakInput) => {
      if (!enabled) return;

      // A fast learner can answer again before the previous sentence ends.
      // Without this the utterances queue and drift further behind each
      // question until the narration is describing a picture two screens back.
      cancel();

      const phrase = buildFeedbackSpeech({
        correct,
        targetLabel,
        chosenLabel,
        variant: variantRef.current++,
      });

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        speak(phrase);
      }, CHIME_CLEARANCE_MS);
    },
    [enabled, cancel, speak]
  );

  const delayFor = useCallback(
    (correct: boolean) =>
      correct ? SPOKEN_ADVANCE_DELAY_MS.correct : SPOKEN_ADVANCE_DELAY_MS.incorrect,
    []
  );

  // Leaving mid-sentence must not leave a voice talking over the next screen.
  useEffect(() => cancel, [cancel]);

  return { enabled, speakFeedback, cancel, delayFor };
}
