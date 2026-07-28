export const XP_RULES = {
  PER_CORRECT_ANSWER: 10,
  LESSON_COMPLETE_BONUS: 20,
  STREAK_DAY_BONUS: 15,
  PERFECT_SESSION_BONUS: 25,
} as const;

export function calculateXP(
  correctCount: number,
  totalCount: number,
  streakDays: number
): number {
  let xp = correctCount * XP_RULES.PER_CORRECT_ANSWER;
  if (correctCount === totalCount && totalCount > 0) {
    xp += XP_RULES.PERFECT_SESSION_BONUS;
  }
  xp += XP_RULES.LESSON_COMPLETE_BONUS;
  if (streakDays > 0) {
    xp += Math.min(streakDays * XP_RULES.STREAK_DAY_BONUS, 100);
  }
  return xp;
}
