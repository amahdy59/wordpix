import { useCallback, useEffect, useRef, useState } from "react";
import { useAccessibility } from "./useAccessibilityPreferences";
import { buildFeedbackSpeech } from "../exercises/feedbackSpeech";

/**
 * Speaks the answer back after each question.
 *
 * This talks to `speechSynthesis` directly rather than going through
 * `useAudio`, and that is the whole point of the file.
 *
 * `useAudio` is built for pronouncing a single vocabulary word as well as
 * possible, so it tries ElevenLabs, then a Google translate_tts endpoint, and
 * only reaches the browser's own voice after both have failed. For a word the
 * learner asked to hear, that is the right order. For feedback it is the wrong
 * one three times over: `translate_tts` sends no CORS headers so the fetch
 * throws, the `<audio>` fallback to the same URL fails too, and each failure
 * costs time the learner is sitting through. Worse, a mobile browser will only
 * honour `speechSynthesis.speak` for a short window after a real gesture — and
 * that window is long gone by the time the network has finished failing. It
 * also drove `useAudio` into its error state, which is what put "Audio
 * playback failed" on screen mid-drill.
 *
 * A feedback line is six words of stock phrasing. It does not need a neural
 * voice; it needs to actually play. So: no network, and a short delay.
 */

/** Just long enough for the 350ms chime to clear, and short enough that a
 *  mobile browser still counts the utterance as gesture-initiated. */
const CHIME_CLEARANCE_MS = 180;

/**
 * How long feedback stays on screen while a sentence is being spoken.
 *
 * These apply *only* when speech can really play. That distinction was missing
 * before: `enabled` was true whenever `window.speechSynthesis` merely existed,
 * so on a device with no installed voices the drill silently stretched every
 * answer to 2.4 and 3.6 seconds and then said nothing at all — slower and
 * mute, which is strictly worse than the chime on its own.
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
  /** True only when a voice is actually available to speak with. */
  enabled: boolean;
  speakFeedback: (input: SpeakInput) => void;
  cancel: () => void;
  /** The auto-advance delay to use, given whether speech will really play. */
  delayFor: (correct: boolean) => number;
}

function getSynth(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  return window.speechSynthesis ?? null;
}

/** An English voice if there is one, else any voice, else null. */
function pickVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices.length) return null;
  return voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ?? voices[0] ?? null;
}

export function useSpokenFeedback(): SpokenFeedback {
  const { accessibility } = useAccessibility();
  const wanted = accessibility.spokenFeedback !== false;

  // Chrome loads voices asynchronously and reports an empty list on first
  // paint, so this cannot be read once and cached — it has to track
  // `voiceschanged` or the feature would look unavailable on every cold load.
  const [hasVoice, setHasVoice] = useState(() => {
    const synth = getSynth();
    return synth ? synth.getVoices().length > 0 : false;
  });

  useEffect(() => {
    const synth = getSynth();
    if (!synth) return undefined;
    const update = () => setHasVoice(synth.getVoices().length > 0);
    update();
    synth.addEventListener("voiceschanged", update);
    return () => synth.removeEventListener("voiceschanged", update);
  }, []);

  const enabled = wanted && hasVoice;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Rotates the opener. A ref, not state: nothing renders from it, and setting
  // state here would re-render the whole drill on every answer.
  const variantRef = useRef(0);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    getSynth()?.cancel();
  }, []);

  const speakFeedback = useCallback(
    ({ correct, targetLabel, chosenLabel }: SpeakInput) => {
      if (!enabled) return;
      const synth = getSynth();
      if (!synth) return;

      // A fast learner can answer again before the previous sentence ends.
      // Without this the utterances queue and drift further behind the screen
      // until the narration describes a picture two questions back.
      cancel();

      const phrase = buildFeedbackSpeech({
        correct,
        targetLabel,
        chosenLabel,
        variant: variantRef.current++,
      });

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        try {
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.lang = "en-US";
          utterance.rate = 1;
          const voice = pickVoice(synth);
          if (voice) utterance.voice = voice;
          synth.speak(utterance);
        } catch {
          // Feedback is an enhancement; it must never break answering.
        }
      }, CHIME_CLEARANCE_MS);
    },
    [enabled, cancel]
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
