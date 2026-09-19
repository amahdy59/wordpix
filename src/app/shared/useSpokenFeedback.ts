import { useCallback, useEffect, useRef } from "react";
import { useAccessibility } from "./useAccessibilityPreferences";
import { buildFeedbackSequence } from "../exercises/feedbackSpeech";
import { useAudio } from "./useAudio";
import { audioUrl } from "./assetUrls";

const CHIME_CLEARANCE_MS = 180;

export const SPOKEN_ADVANCE_DELAY_MS = {
  correct: 1200,
  incorrect: 1500,
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
  const isPlayingRef = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const nextAudioTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestRef = useRef(0);

  const onCompleteRef = useRef<(() => void) | null>(null);

  const { speak, stop } = useAudio({
    onEnded: () => {
      isPlayingRef.current = false;
      const onComplete = onCompleteRef.current;
      onCompleteRef.current = null;
      if (onComplete) onComplete();
    },
    onError: () => {
      isPlayingRef.current = false;
      const onComplete = onCompleteRef.current;
      onCompleteRef.current = null;
      if (onComplete) onComplete();
    },
  });

  const cancel = useCallback(() => {
    requestRef.current += 1;
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (nextAudioTimerRef.current !== null) {
      clearTimeout(nextAudioTimerRef.current);
      nextAudioTimerRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
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

      const generation = requestRef.current;
      const isCurrent = () => requestRef.current === generation;

      onCompleteRef.current = onComplete || null;

      const sequence = buildFeedbackSequence({
        correct: input.correct,
        targetLabel: input.targetLabel,
        targetTopic: input.targetTopic,
        chosenLabel: input.chosenLabel,
        chosenTopic: input.chosenTopic,
        variant: variantRef.current++,
      });

      // Aggressively resolve URLs for gapless overlap
      Promise.all(sequence.map(audioUrl)).then((urls) => {
        if (!isCurrent()) return;

        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          if (!isCurrent()) return;
          isPlayingRef.current = true;

          let currentIndex = 0;

          const playNext = () => {
            if (!isCurrent()) return;
            if (currentIndex >= sequence.length) {
              isPlayingRef.current = false;
              const complete = onCompleteRef.current;
              onCompleteRef.current = null;
              if (complete) complete();
              return;
            }

            const url = urls[currentIndex];

            if (!url) {
              // CDN hash miss: fallback to useAudio TTS for the remainder of the sentence
              speak(sequence.slice(currentIndex).join(" "));
              return;
            }

            const audio = new Audio(url);
            currentAudioRef.current = audio;

            let triggeredNext = false;
            const triggerNext = () => {
              if (triggeredNext) return;
              triggeredNext = true;
              currentIndex++;
              playNext();
            };

            audio.onplaying = () => {
              if (!isCurrent()) return;
              if (currentIndex < sequence.length - 1) {
                // Overlap the next audio to hide silence padding at the end of the stem
                // Increased to 350ms (0.35) for a tighter, more natural merge
                const overlap = 0.35;
                let delay = audio.duration - overlap;
                if (!Number.isFinite(delay) || delay < 0) delay = 0;

                nextAudioTimerRef.current = setTimeout(() => {
                  nextAudioTimerRef.current = null;
                  triggerNext();
                }, delay * 1000);
              }
            };

            audio.onended = () => {
              if (!isCurrent()) return;
              triggerNext();
            };

            audio.onerror = () => {
              if (!isCurrent()) return;
              // File missing on CDN, fallback to useAudio TTS
              speak(sequence.slice(currentIndex).join(" "));
            };

            audio.play().catch(() => {
              if (!isCurrent()) return;
              speak(sequence.slice(currentIndex).join(" "));
            });
          };

          playNext();
        }, CHIME_CLEARANCE_MS);
      });
    },
    [enabled, cancel, speak]
  );

  const delayFor = useCallback(
    (correct: boolean) =>
      correct ? SPOKEN_ADVANCE_DELAY_MS.correct : SPOKEN_ADVANCE_DELAY_MS.incorrect,
    []
  );

  useEffect(() => cancel, [cancel]);

  return { enabled, speakFeedback, cancel, delayFor };
}
