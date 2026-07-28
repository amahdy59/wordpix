export interface SM2Item {
  wordId: string;
  repetition: number;
  interval: number; // in days
  easinessFactor: number;
  lastReviewed: string; // ISO date string
  nextReview: string; // ISO date string
}

export function calculateSM2(
  item: SM2Item,
  quality: number // 0 to 5 rating
): SM2Item {
  const q = Math.max(0, Math.min(5, Math.round(quality)));

  let { repetition, interval, easinessFactor } = item;

  if (q >= 3) {
    if (repetition === 0) {
      interval = 1;
    } else if (repetition === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easinessFactor);
    }
    repetition += 1;
  } else {
    repetition = 0;
    interval = 1;
  }

  // Update Easiness Factor (EF)
  easinessFactor = easinessFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easinessFactor < 1.3) easinessFactor = 1.3;

  const now = new Date();
  const nextDate = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);

  return {
    wordId: item.wordId,
    repetition,
    interval,
    easinessFactor: Number(easinessFactor.toFixed(2)),
    lastReviewed: now.toISOString(),
    nextReview: nextDate.toISOString(),
  };
}

export function createInitialSM2Item(wordId: string): SM2Item {
  const now = new Date();
  return {
    wordId,
    repetition: 0,
    interval: 0,
    easinessFactor: 2.5,
    lastReviewed: now.toISOString(),
    nextReview: now.toISOString(),
  };
}
