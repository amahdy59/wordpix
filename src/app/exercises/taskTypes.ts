import type { SkillCategory } from "../types";

/**
 * The exercise task model.
 *
 * The 35 hub screens were previously 35 bespoke components, most of them
 * presentational: a heading, a decorative panel, and a button that navigated
 * away without checking anything. Expressing them as data over a small set of
 * interaction patterns means one well-tested runner handles scoring, feedback,
 * keyboard support, and screen-reader announcements for all of them, instead of
 * each screen reimplementing (or omitting) that.
 */

export interface ChoiceOption {
  id: string;
  label: string;
  correct?: boolean;
}

interface BaseTask {
  id: string;
  /** The question, read to the learner. */
  prompt: string;
  /** Shown after answering, explaining why. */
  explanation: string;
  /** Vocabulary id whose picture accompanies the prompt. */
  imageWordId?: string;
  /** Spoken aloud when the task opens, and on replay. */
  audioText?: string;
}

/** Pick exactly one option. */
export interface ChoiceTask extends BaseTask {
  kind: "choice";
  options: ChoiceOption[];
  /** Render options as pictures rather than text. */
  optionsAreImages?: boolean;
}

/** Type the answer. */
export interface EntryTask extends BaseTask {
  kind: "entry";
  /** Any of these count as correct, compared case- and space-insensitively. */
  accept: string[];
}

/** Pick every option that applies. */
export interface MultiSelectTask extends BaseTask {
  kind: "multi";
  options: ChoiceOption[];
}

/** Arrange tokens into the correct order. */
export interface OrderTask extends BaseTask {
  kind: "order";
  /** The correct sequence; the runner shuffles them for display. */
  solution: string[];
}

/** Put each item into the right bucket. */
export interface SortTask extends BaseTask {
  kind: "sort";
  buckets: { id: string; label: string }[];
  items: { id: string; label: string; bucketId: string }[];
}

/**
 * Open practice with nothing to mark.
 *
 * Kept as a first-class kind so screens that genuinely cannot be graded — free
 * writing, spoken narration — say so honestly instead of faking a score.
 */
export interface PracticeTask extends BaseTask {
  kind: "practice";
  /** What a good answer looks like, since nothing is marked. */
  guidance: string[];
  /** Show a text area for the learner's own notes. */
  freeText?: boolean;
}

export type ExerciseTask =
  | ChoiceTask
  | EntryTask
  | MultiSelectTask
  | OrderTask
  | SortTask
  | PracticeTask;

export interface ExerciseDefinition {
  id: string;
  title: string;
  category: SkillCategory;
  /** Position in its category, 1-based, for the progress bar. */
  step: number;
  totalSteps: number;
  /** Seconds allowed, when the exercise is meant to be timed at all. */
  timeLimitSeconds?: number;
  intro?: string;
  tasks: ExerciseTask[];
}

/** True when a task can be marked right or wrong. */
export function isGraded(task: ExerciseTask): boolean {
  return task.kind !== "practice";
}

/** Case- and whitespace-insensitive answer comparison. */
export function normaliseAnswer(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?;:]$/, "");
}

export function isEntryCorrect(task: EntryTask, value: string): boolean {
  const given = normaliseAnswer(value);
  return task.accept.some((a) => normaliseAnswer(a) === given);
}

export function isChoiceCorrect(task: ChoiceTask, optionId: string): boolean {
  return task.options.some((o) => o.id === optionId && o.correct === true);
}

export function isMultiCorrect(task: MultiSelectTask, selected: string[]): boolean {
  const wanted = task.options.filter((o) => o.correct).map((o) => o.id).sort();
  const given = [...selected].sort();
  return wanted.length === given.length && wanted.every((id, i) => id === given[i]);
}

export function isOrderCorrect(task: OrderTask, arrangement: string[]): boolean {
  return (
    arrangement.length === task.solution.length &&
    arrangement.every((token, i) => token === task.solution[i])
  );
}

export function isSortCorrect(task: SortTask, placements: Record<string, string>): boolean {
  return task.items.every((item) => placements[item.id] === item.bucketId);
}
