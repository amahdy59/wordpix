import feedbackPhrases from "./feedbackPhrases.json";

/**
 * Short spoken outcome feedback after an answer.
 *
 * Vocabulary pronunciation belongs to the prompt and Replay controls. Repeating
 * a full identification sentence after every answer made the interaction slow
 * and unnatural, especially when the learner had already heard the word. Keep
 * this channel to a brief, encouraging outcome; the visual result can still
 * identify a missed target without forcing extra speech on every learner.
 */

/** Shared with the audio corpus builder so text and content hashes cannot drift. */
export const CORRECT_FEEDBACK = feedbackPhrases.correct;
export const INCORRECT_FEEDBACK = feedbackPhrases.incorrect;

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

export function buildFeedbackSpeech({ correct, variant = 0 }: FeedbackSpeechInput): string {
  const pick = <T>(list: readonly T[]): T => list[Math.abs(Math.floor(variant)) % list.length] as T;
  return correct ? pick(CORRECT_FEEDBACK) : pick(INCORRECT_FEEDBACK);
}

export function buildFeedbackSequence({ correct, variant = 0 }: FeedbackSpeechInput): string[] {
  const pick = <T>(list: readonly T[]): T => list[Math.abs(Math.floor(variant)) % list.length] as T;
  return [correct ? pick(CORRECT_FEEDBACK) : pick(INCORRECT_FEEDBACK)];
}
