import { contrastSentence, identifySentence } from "../content/wordGrammar";

/**
 * The sentence spoken back after an answer.
 *
 * A chime tells a learner *that* they were right. It cannot tell them *what*
 * the thing was called, which is the entire point of a vocabulary drill — so
 * the earcon stays and this is said on top of it, naming the word every time.
 *
 * Three rules shape the wording.
 *
 * It always names the target, on right answers and wrong ones alike. Hearing
 * "faucet" spoken in a full sentence is the repetition that builds the word,
 * and a learner who guessed correctly still needs to hear it.
 *
 * A wrong answer names both words, in the order wrong-then-right. Naming only
 * the correct one leaves the mistake unaddressed; naming both draws the
 * contrast that makes the next attempt better. Saying it in that order ends
 * the sentence on the word worth remembering.
 *
 * And the opener rotates. This plays after every single question — the same
 * five words several hundred times a session stops being encouragement and
 * starts being noise, so praise varies while the informative half does not.
 *
 * The naming half is built by `wordGrammar`, not here. It used to be a
 * lowercase label with `a` or `an` glued on, which is right for `Lamp` and
 * wrong for most of the corpus: "Correct! This is a pliers." was read aloud to
 * learners, as were "a water", "a run" and "a Monday". Pass `targetTopic` and
 * `chosenTopic` wherever the caller has them — the topic is what tells the
 * classifier that `Slides` are sandals in one unit and glass plates in another.
 */

/** Openers for a correct answer, rotated so repetition does not grate. */
const PRAISE = ["Correct!", "Well done!", "That's right.", "Nice work!", "Exactly."] as const;

/** Openers for a wrong answer. Kind, brief, and never scolding. */
const CORRECTION = ["Not quite.", "Close.", "Almost."] as const;

export interface FeedbackSpeechInput {
  correct: boolean;
  /** The word the picture actually shows. */
  targetLabel: string;
  /** The target's unit id, which sharpens the grammar classification. */
  targetTopic?: string;
  /** What the learner picked. Omitted when they ran out of time. */
  chosenLabel?: string | null;
  /** The chosen word's unit id. Defaults to the target's, since distractors
   *  are drawn from the same lesson. */
  chosenTopic?: string;
  /**
   * Which opener to use. Callers pass a counter that advances per question;
   * taking it as an argument keeps this function pure and testable rather than
   * reaching for Math.random.
   */
  variant?: number;
}

export function buildFeedbackSpeech({
  correct,
  targetLabel,
  targetTopic,
  chosenLabel,
  chosenTopic,
  variant = 0,
}: FeedbackSpeechInput): string {
  const target = identifySentence(targetLabel, targetTopic);
  // A negative or fractional counter would index out of the array; floor and
  // take the absolute value so any caller's counter is safe.
  const pick = <T>(list: readonly T[]): T => list[Math.abs(Math.floor(variant)) % list.length] as T;

  if (correct) return `${pick(PRAISE)} ${target}`;

  // The learner picked the right word but the drill scored it wrong, or the
  // chosen label is simply unknown — either way there is no contrast to draw.
  const sameWord =
    chosenLabel != null && chosenLabel.toLowerCase().trim() === targetLabel.toLowerCase().trim();
  if (!chosenLabel || sameWord) return `${pick(CORRECTION)} ${target}`;

  const chosen = contrastSentence(chosenLabel, chosenTopic ?? targetTopic);
  return `${pick(CORRECTION)} ${chosen} ${target}`;
}
