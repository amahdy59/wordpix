export type MasteryCategory = "new" | "learning" | "familiar" | "strong";

export const MASTERY_DIMENSIONS = [
  "visual-recognition",
  "listening-recognition",
  "contextual-comprehension",
  "controlled-production",
  "spoken-production",
  "independent-transfer",
] as const;

export type MasteryDimension = (typeof MASTERY_DIMENSIONS)[number];

export interface SkillMasteryState {
  attempts: number;
  correct: number;
  lastAttemptAt: string | null;
  mastery: MasteryCategory;
}

export type SkillMastery = Record<MasteryDimension, SkillMasteryState>;

export interface SkillMasterySummary {
  dimension: MasteryDimension;
  attempts: number;
  correct: number;
  practicedWords: number;
  establishedWords: number;
  accuracy: number;
}

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
  /** Optional only for compatibility with learner records saved before v3. */
  skillMastery?: SkillMastery;
}

function createInitialSkillState(): SkillMasteryState {
  return { attempts: 0, correct: 0, lastAttemptAt: null, mastery: "new" };
}

export function createInitialSkillMastery(): SkillMastery {
  return Object.fromEntries(
    MASTERY_DIMENSIONS.map((dimension) => [dimension, createInitialSkillState()])
  ) as SkillMastery;
}

export function summarizeSkillMastery(states: readonly WordLearningState[]): SkillMasterySummary[] {
  return MASTERY_DIMENSIONS.map((dimension) => {
    const facets = states
      .map((state) => state.skillMastery?.[dimension])
      .filter((facet): facet is SkillMasteryState => Boolean(facet));
    const attempts = facets.reduce((total, facet) => total + facet.attempts, 0);
    const correct = facets.reduce((total, facet) => total + facet.correct, 0);
    return {
      dimension,
      attempts,
      correct,
      practicedWords: facets.filter((facet) => facet.attempts > 0).length,
      establishedWords: facets.filter((facet) => ["familiar", "strong"].includes(facet.mastery))
        .length,
      accuracy: attempts === 0 ? 0 : Math.round((correct / attempts) * 100),
    };
  });
}

function getSkillMasteryCategory(attempts: number, correct: number): MasteryCategory {
  if (attempts === 0) return "new";
  const accuracy = correct / attempts;
  if (attempts >= 6 && accuracy >= 0.85) return "strong";
  if (attempts >= 3 && accuracy >= 0.7) return "familiar";
  return "learning";
}

export function normalizeWordLearningState(
  wordId: string,
  value: Partial<WordLearningState>
): WordLearningState {
  const initial = createInitialWordState(wordId);
  const rawSkills = value.skillMastery;
  const skillMastery = createInitialSkillMastery();

  if (rawSkills) {
    MASTERY_DIMENSIONS.forEach((dimension) => {
      const raw = rawSkills[dimension];
      if (!raw) return;
      skillMastery[dimension] = {
        attempts: Number.isFinite(raw.attempts) ? Math.max(0, raw.attempts) : 0,
        correct: Number.isFinite(raw.correct) ? Math.max(0, raw.correct) : 0,
        lastAttemptAt: raw.lastAttemptAt ?? null,
        mastery: raw.mastery ?? "new",
      };
    });
  }

  return { ...initial, ...value, wordId, skillMastery };
}

export function recordMasteryEvidence(
  state: WordLearningState,
  dimension: MasteryDimension,
  correct: number,
  total: number,
  now: Date = new Date()
): WordLearningState {
  const skillMastery = { ...(state.skillMastery ?? createInitialSkillMastery()) };
  const previous = skillMastery[dimension] ?? createInitialSkillState();
  const attempts = previous.attempts + Math.max(0, total);
  const correctAttempts = previous.correct + Math.max(0, Math.min(correct, total));

  skillMastery[dimension] = {
    attempts,
    correct: correctAttempts,
    lastAttemptAt: total > 0 ? now.toISOString() : previous.lastAttemptAt,
    mastery: getSkillMasteryCategory(attempts, correctAttempts),
  };

  return { ...state, skillMastery };
}

/**
 * Recognition alone cannot establish durable word mastery. Strong status is
 * capped until the learner has contextual comprehension and production proof.
 */
export function getBalancedMasteryCategory(state: WordLearningState): MasteryCategory {
  if (state.mastery !== "strong") return state.mastery;
  const skills = state.skillMastery;
  if (!skills) return "familiar";
  const required: MasteryDimension[] = [
    "contextual-comprehension",
    "controlled-production",
    "independent-transfer",
  ];
  const hasTransferEvidence = required.every((dimension) =>
    ["familiar", "strong"].includes(skills[dimension].mastery)
  );
  return hasTransferEvidence ? "strong" : "familiar";
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
    skillMastery: createInitialSkillMastery(),
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
