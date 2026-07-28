export interface StreakState {
  currentStreak: number;
  lastActiveDate: string; // YYYY-MM-DD format
}

export function updateStreak(
  currentStreak: StreakState,
  today: Date = new Date()
): StreakState {
  const todayStr = today.toISOString().split("T")[0];
  if (!currentStreak.lastActiveDate) {
    return { currentStreak: 1, lastActiveDate: todayStr };
  }

  if (currentStreak.lastActiveDate === todayStr) {
    return currentStreak; // Already recorded today
  }

  const lastDate = new Date(currentStreak.lastActiveDate);
  const currentDate = new Date(todayStr);

  const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    return {
      currentStreak: currentStreak.currentStreak + 1,
      lastActiveDate: todayStr,
    };
  } else {
    // Streak reset if missed more than 1 day
    return {
      currentStreak: 1,
      lastActiveDate: todayStr,
    };
  }
}
