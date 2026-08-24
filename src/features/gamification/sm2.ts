export type MasteryCategory = "new" | "learning" | "familiar" | "strong";

export interface WordLearningState {
  wordId: string;
  exposures: number;
  correctRecalls: number;
  incorrectRecalls: number;
  currentStreak: number;
  lapses: number;
  lastSeenAt: string | null;
  lastReviewedAt: string | null;
  nextReviewAt: string | null; // ISO date string
  intervalDays: number;
  easeFactor: number;
  mastery: MasteryCategory;
}

export function getMasteryCategory(
  correctRecalls: number,
  incorrectRecalls: number,
  intervalDays: number
): MasteryCategory {
  const total = correctRecalls + incorrectRecalls;
  if (total === 0) return "new";
  const accuracy = correctRecalls / total;
  if (intervalDays >= 14 && accuracy >= 0.85) return "strong";
  if (intervalDays >= 3 && accuracy >= 0.7) return "familiar";
  return "learning";
}

export function createInitialWordState(wordId: string): WordLearningState {
  const now = new Date().toISOString();
  return {
    wordId,
    exposures: 0,
    correctRecalls: 0,
    incorrectRecalls: 0,
    currentStreak: 0,
    lapses: 0,
    lastSeenAt: null,
    lastReviewedAt: null,
    nextReviewAt: now,
    intervalDays: 0,
    easeFactor: 2.5,
    mastery: "new",
  };
}

export function calculateSM2State(
  state: WordLearningState,
  quality: number,
  now: Date = new Date()
): WordLearningState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let {
    intervalDays,
    easeFactor,
    currentStreak,
    lapses,
    correctRecalls,
    incorrectRecalls,
    exposures,
  } = state;

  exposures += 1;

  if (q >= 3) {
    correctRecalls += 1;
    currentStreak += 1;
    if (intervalDays === 0) {
      intervalDays = 1;
    } else if (intervalDays === 1) {
      intervalDays = 6;
    } else {
      intervalDays = Math.round(intervalDays * easeFactor);
    }
  } else {
    incorrectRecalls += 1;
    currentStreak = 0;
    lapses += 1;
    intervalDays = 1; // reset interval on lapse
  }

  // Update Easiness Factor (EF)
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  const nextDate = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const mastery = getMasteryCategory(correctRecalls, incorrectRecalls, intervalDays);

  return {
    ...state,
    exposures,
    correctRecalls,
    incorrectRecalls,
    currentStreak,
    lapses,
    lastSeenAt: now.toISOString(),
    lastReviewedAt: now.toISOString(),
    nextReviewAt: nextDate.toISOString(),
    intervalDays,
    easeFactor: Number(easeFactor.toFixed(2)),
    mastery,
  };
}

/**
 * Filters and prioritizes words due for spaced-repetition retention review.
 * Prioritizes:
 * 1. Words with lapses (incorrect attempts)
 * 2. Words whose scheduled review date has passed (earliest first)
 * 3. Words with lower ease factor (harder words)
 */
export function getDueWordsForReview(
  wordMemory: Record<string, WordLearningState>,
  now: Date = new Date()
): WordLearningState[] {
  const nowIso = now.toISOString();
  return Object.values(wordMemory)
    .filter((state) => {
      if (!state.nextReviewAt) return state.mastery === "learning" || state.mastery === "familiar";
      return state.nextReviewAt <= nowIso;
    })
    .sort((a, b) => {
      if (a.lapses !== b.lapses) return b.lapses - a.lapses;
      const aTime = a.nextReviewAt ? new Date(a.nextReviewAt).getTime() : 0;
      const bTime = b.nextReviewAt ? new Date(b.nextReviewAt).getTime() : 0;
      if (aTime !== bTime) return aTime - bTime;
      return a.easeFactor - b.easeFactor;
    });
}
