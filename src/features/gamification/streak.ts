export interface StreakState {
  currentStreak: number;
  lastActiveDate: string | null; // YYYY-MM-DD local format
  freezeAvailable?: number;
  freezeUsed?: boolean;
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

export interface WeekDayActivity {
  /** Single-letter weekday initial, e.g. "M" */
  initial: string;
  /** Full weekday name for screen readers, e.g. "Monday" */
  name: string;
  /** YYYY-MM-DD local date */
  date: string;
  /** True when at least one session was completed on this date */
  done: boolean;
  isToday: boolean;
}

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Builds the trailing 7-day activity strip ending today, from real session
 * completion timestamps. Never reports a day as done without a session on it.
 */
export function getWeekActivity(
  completedAtIsoDates: string[],
  today: Date = new Date()
): WeekDayActivity[] {
  const activeDates = new Set<string>();
  completedAtIsoDates.forEach((iso) => {
    const parsed = new Date(iso);
    if (!Number.isNaN(parsed.getTime())) activeDates.add(getLocalDateString(parsed));
  });

  const todayStr = getLocalDateString(today);

  return Array.from({ length: 7 }, (_, offset) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (6 - offset));
    const dateStr = getLocalDateString(d);
    const name = WEEKDAY_NAMES[d.getDay()];
    return {
      initial: name.charAt(0),
      name,
      date: dateStr,
      done: activeDates.has(dateStr),
      isToday: dateStr === todayStr,
    };
  });
}

/**
 * Canonical streak updater using local calendar date.
 * Supports streak freeze protection when missing a single day.
 */
export function updateStreak(state: StreakState, today: Date = new Date()): StreakState {
  const todayStr = getLocalDateString(today);

  if (!state.lastActiveDate) {
    return { ...state, currentStreak: 1, lastActiveDate: todayStr, freezeUsed: false };
  }

  if (state.lastActiveDate === todayStr) {
    return state; // Already active today
  }

  const diffDays = calculateDaysBetween(state.lastActiveDate, todayStr);

  if (diffDays === 1) {
    return {
      ...state,
      currentStreak: state.currentStreak + 1,
      lastActiveDate: todayStr,
      freezeUsed: false,
    };
  } else if (diffDays === 2 && (state.freezeAvailable ?? 0) > 0) {
    // Single missed day saved by streak freeze shield!
    return {
      ...state,
      currentStreak: state.currentStreak + 1,
      lastActiveDate: todayStr,
      freezeAvailable: (state.freezeAvailable ?? 1) - 1,
      freezeUsed: true,
    };
  } else if (diffDays > 1) {
    // Reset streak if missed 1+ days and no shield available
    return {
      ...state,
      currentStreak: 1,
      lastActiveDate: todayStr,
      freezeUsed: false,
    };
  }

  return state;
}
