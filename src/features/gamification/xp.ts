export const XP_RULES = {
  PER_CORRECT_ANSWER: 10,
  LESSON_COMPLETE_BONUS: 20,
  STREAK_DAY_BONUS: 15,
  PERFECT_SESSION_BONUS: 25,
  /** Ceiling on the streak bonus so a long streak cannot dwarf the session itself. */
  STREAK_BONUS_CAP: 100,
} as const;

export interface XPBreakdown {
  correctAnswers: number;
  lessonComplete: number;
  perfectSession: number;
  streak: number;
  total: number;
}

/**
 * Itemised XP for one completed session.
 *
 * `streakDays` should be 0 for any session after the first of the day —
 * STREAK_DAY_BONUS is a daily bonus, and paying it on every session would let a
 * learner farm it by replaying lessons.
 */
export function calculateXPBreakdown(
  correctCount: number,
  totalCount: number,
  streakDays: number
): XPBreakdown {
  const correctAnswers = Math.max(0, correctCount) * XP_RULES.PER_CORRECT_ANSWER;
  const perfectSession =
    totalCount > 0 && correctCount === totalCount ? XP_RULES.PERFECT_SESSION_BONUS : 0;
  const lessonComplete = XP_RULES.LESSON_COMPLETE_BONUS;
  const streak =
    streakDays > 0
      ? Math.min(streakDays * XP_RULES.STREAK_DAY_BONUS, XP_RULES.STREAK_BONUS_CAP)
      : 0;

  return {
    correctAnswers,
    lessonComplete,
    perfectSession,
    streak,
    total: correctAnswers + lessonComplete + perfectSession + streak,
  };
}

export function calculateXP(
  correctCount: number,
  totalCount: number,
  streakDays: number
): number {
  return calculateXPBreakdown(correctCount, totalCount, streakDays).total;
}
