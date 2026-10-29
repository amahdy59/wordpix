import type { LearnerPreferences } from "../context/LearnerContext";
import type { WordLearningState } from "../../features/gamification/sm2";

export type ExerciseStep = "listen" | "recall" | "fill" | "builder" | "quiz" | "story";

export interface LessonStepLabel {
  step: number;
  exercise: ExerciseStep;
  icon: string;
  name: string;
  description: string;
}

const STEP_META: Record<ExerciseStep, Omit<LessonStepLabel, "step" | "exercise">> = {
  listen: { icon: "🎧", name: "Listen & pronounce", description: "Sound, stress, and meaning" },
  recall: {
    icon: "🧠",
    name: "Recall & match",
    description: "Active retrieval from audio and images",
  },
  fill: { icon: "🧩", name: "Use in context", description: "Complete a meaningful sentence" },
  builder: { icon: "✍️", name: "Build a sentence", description: "Produce connected language" },
  quiz: { icon: "✅", name: "Checkpoint", description: "Check the lesson outcome" },
  story: { icon: "📖", name: "Story & transfer", description: "Apply language in a new context" },
};

/**
 * The upper bound used by navigation and persistence guards.
 *
 * The learner-facing sequence can be shorter (for example A1 omits the
 * sentence-builder stage), so UI copy should use `getLessonSequence(...).length`
 * rather than presenting this maximum as the learner's current total.
 */
export const MAX_LESSON_STAGE_COUNT = Object.keys(STEP_META).length;
export const FOCUSED_LESSON_WORD_LIMIT = 5;

export function getLessonSequence(
  _level: LearnerPreferences["englishLevel"],
  includeListening = true
): ExerciseStep[] {
  const sequence: ExerciseStep[] = ["listen", "recall", "fill", "builder", "quiz", "story"];
  return includeListening ? sequence : sequence.filter((step) => step !== "listen");
}

export function getLessonStepLabels(
  level: LearnerPreferences["englishLevel"],
  includeListening = true
): LessonStepLabel[] {
  return getLessonSequence(level, includeListening).map((exercise, step) => ({
    step,
    exercise,
    ...STEP_META[exercise],
  }));
}

export function getStoryStepIndex(
  level: LearnerPreferences["englishLevel"],
  includeListening = true
): number {
  return Math.max(0, getLessonSequence(level, includeListening).indexOf("story"));
}

/** Selects a manageable, adaptive practice set while preserving authored order. */
export function selectPracticeWordQueue(
  wordIds: string[],
  wordMemory: Record<string, WordLearningState>,
  limit = FOCUSED_LESSON_WORD_LIMIT,
  now = new Date()
): string[] {
  const nowIso = now.toISOString();
  const priority = (wordId: string) => {
    const memory = wordMemory[wordId];
    if (!memory || memory.exposures === 0) return 0;
    if (memory.nextReviewAt && memory.nextReviewAt <= nowIso) return 1;
    if (memory.mastery === "learning") return 2;
    if (memory.mastery === "familiar") return 3;
    return 4;
  };

  return wordIds
    .map((wordId, index) => ({ wordId, index, priority: priority(wordId) }))
    .sort((a, b) => a.priority - b.priority || a.index - b.index)
    .slice(0, Math.max(1, limit))
    .map(({ wordId }) => wordId);
}
