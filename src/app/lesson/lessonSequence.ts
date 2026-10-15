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

export const CANONICAL_STAGE_COUNT = 6;
export const MAX_LESSON_STAGE_COUNT = 30;
export const FOCUSED_LESSON_WORD_LIMIT = 5;

export interface InterleavedStep {
  stepIndex: number;
  exercise: ExerciseStep;
  wordIds: string[];
  chunkIndex: number;
  totalChunks: number;
  chunkRange?: {
    start: number;
    end: number;
    total: number;
  };
  isSynthesis: boolean;
}

/**
 * Divides words into balanced chunks of at most `maxChunkSize` words (default 5).
 * E.g.:
 * - 8 words -> 2 chunks of 4
 * - 10 words -> 2 chunks of 5
 * - 12 words -> 3 chunks of 4
 * - 14 words -> 3 chunks of 5, 5, 4
 * - 16 words -> 4 chunks of 4
 */
export function partitionWordsIntoChunks(
  wordIds: string[],
  maxChunkSize = FOCUSED_LESSON_WORD_LIMIT
): string[][] {
  if (wordIds.length === 0) return [];
  if (wordIds.length <= maxChunkSize) return [wordIds.slice()];

  const numChunks = Math.ceil(wordIds.length / maxChunkSize);
  const baseSize = Math.floor(wordIds.length / numChunks);
  const remainder = wordIds.length % numChunks;

  const chunks: string[][] = [];
  let startIndex = 0;
  for (let i = 0; i < numChunks; i++) {
    const chunkSize = baseSize + (i < remainder ? 1 : 0);
    chunks.push(wordIds.slice(startIndex, startIndex + chunkSize));
    startIndex += chunkSize;
  }
  return chunks;
}

/**
 * Builds an interleaved lesson plan dividing vocabulary into micro-cycles
 * (presentation -> active retrieval -> context application) of 4-5 words,
 * followed by a synthesis phase (sentence building -> checkpoint -> story/transfer)
 * across the entire lesson set.
 *
 * This anti-drill architecture prevents working-memory overload while guaranteeing
 * that 100% of questions across all words are preserved with zero loss.
 */
export function buildInterleavedLessonPlan(
  wordIds: string[],
  _level?: LearnerPreferences["englishLevel"],
  includeListening = true
): InterleavedStep[] {
  if (wordIds.length === 0) return [];

  const chunks = partitionWordsIntoChunks(wordIds);
  const plan: InterleavedStep[] = [];
  let runningStep = 0;
  let wordOffset = 0;

  const chunkDrills: ExerciseStep[] = includeListening
    ? ["listen", "recall", "fill"]
    : ["recall", "fill"];

  chunks.forEach((chunkWords, chunkIdx) => {
    const range = {
      start: wordOffset + 1,
      end: wordOffset + chunkWords.length,
      total: wordIds.length,
    };
    wordOffset += chunkWords.length;

    for (const exercise of chunkDrills) {
      plan.push({
        stepIndex: runningStep++,
        exercise,
        wordIds: chunkWords,
        chunkIndex: chunkIdx,
        totalChunks: chunks.length,
        chunkRange: range,
        isSynthesis: false,
      });
    }
  });

  const synthesisDrills: ExerciseStep[] = ["builder", "quiz", "story"];
  for (const exercise of synthesisDrills) {
    plan.push({
      stepIndex: runningStep++,
      exercise,
      wordIds: [...wordIds],
      chunkIndex: Math.max(0, chunks.length - 1),
      totalChunks: chunks.length,
      chunkRange: {
        start: 1,
        end: wordIds.length,
        total: wordIds.length,
      },
      isSynthesis: true,
    });
  }

  return plan;
}

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
