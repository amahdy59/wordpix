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

// Legacy type alias for backwards compatibility
export interface SM2Item {
  wordId: string;
  repetition: number;
  interval: number;
  easinessFactor: number;
  lastReviewed: string;
  nextReview: string;
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

export function createInitialSM2Item(wordId: string): SM2Item {
  const now = new Date().toISOString();
  return {
    wordId,
    repetition: 0,
    interval: 0,
    easinessFactor: 2.5,
    lastReviewed: now,
    nextReview: now,
  };
}

export function calculateSM2(item: SM2Item, quality: number): SM2Item {
  const state = createInitialWordState(item.wordId);
  state.intervalDays = item.interval;
  state.easeFactor = item.easinessFactor;
  state.currentStreak = item.repetition;

  const res = calculateSM2State(state, quality);
  return {
    wordId: item.wordId,
    repetition: res.currentStreak,
    interval: res.intervalDays,
    easinessFactor: res.easeFactor,
    lastReviewed: res.lastReviewedAt || new Date().toISOString(),
    nextReview: res.nextReviewAt || new Date().toISOString(),
  };
}

export function calculateSM2State(
  state: WordLearningState,
  quality: number,
  now: Date = new Date()
): WordLearningState {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
  let { intervalDays, easeFactor, currentStreak, lapses, correctRecalls, incorrectRecalls, exposures } = state;

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
