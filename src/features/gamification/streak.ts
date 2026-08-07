export interface StreakState {
  currentStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD local format
}

/**
 * Returns YYYY-MM-DD string using local calendar date (not UTC).
 */
export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Calculates calendar day difference between two YYYY-MM-DD local date strings.
 */
export function calculateDaysBetween(dateStr1: string, dateStr2: string): number {
  const [y1, m1, d1] = dateStr1.split("-").map(Number);
  const [y2, m2, d2] = dateStr2.split("-").map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Canonical streak updater using local calendar date.
 */
export function updateStreak(
  state: StreakState,
  today: Date = new Date()
): StreakState {
  const todayStr = getLocalDateString(today);

  if (!state.lastActiveDate) {
    return { currentStreak: 1, lastActiveDate: todayStr };
  }

  if (state.lastActiveDate === todayStr) {
    return state; // Already active today
  }

  const diffDays = calculateDaysBetween(state.lastActiveDate, todayStr);

  if (diffDays === 1) {
    return {
      currentStreak: state.currentStreak + 1,
      lastActiveDate: todayStr,
    };
  } else if (diffDays > 1) {
    // Reset streak if missed 1+ days
    return {
      currentStreak: 1,
      lastActiveDate: todayStr,
    };
  }

  return state;
}
