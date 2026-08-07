// Learner progress data layer & persistence hook
import { useState, useEffect, useCallback } from "react";

export type MasteryLevel = 0 | 1 | 2 | 3; // 0=unseen, 1=recognized, 2=practiced, 3=mastered

export interface LearnerProgress {
  xp: number;
  streak: number;
  lastStudiedDate: string | null;
  daysActive: number;
  englishLevel: "A1" | "A2" | "B1";
  dailyGoalMinutes: number;
  wordMastery: Record<string, MasteryLevel>;
  sessionsCompleted: number;
}

const STORAGE_KEY = "wordpix:progress:v2";

const DEFAULT_PROGRESS: LearnerProgress = {
  xp: 120,
  streak: 5,
  lastStudiedDate: new Date().toISOString().split("T")[0],
  daysActive: 12,
  englishLevel: "A1",
  dailyGoalMinutes: 10,
  wordMastery: {
    pillow: 2,
    bed: 3,
    nightstand: 1,
    dresser: 1,
    blanket: 2,
  },
  sessionsCompleted: 4,
};

function loadProgress(): LearnerProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(saved);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: LearnerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save learner progress", e);
  }
}

export function useProgress() {
  const [progress, setProgressState] = useState<LearnerProgress>(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const addXP = useCallback((amount: number) => {
    setProgressState((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  }, []);

  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setProgressState((prev) => {
      if (prev.lastStudiedDate === today) return prev;
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const isConsecutive = prev.lastStudiedDate === yesterday;
      return {
        ...prev,
        streak: isConsecutive ? prev.streak + 1 : 1,
        daysActive: prev.daysActive + (prev.lastStudiedDate === today ? 0 : 1),
        lastStudiedDate: today,
      };
    });
  }, []);

  const setWordMastery = useCallback((wordId: string, level: MasteryLevel) => {
    setProgressState((prev) => ({
      ...prev,
      wordMastery: {
        ...prev.wordMastery,
        [wordId]: Math.max(prev.wordMastery[wordId] || 0, level) as MasteryLevel,
      },
    }));
  }, []);

  const recordCompletedBatch = useCallback((words: string[], xpEarned: number) => {
    const today = new Date().toISOString().split("T")[0];
    setProgressState((prev) => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const isConsecutive = prev.lastStudiedDate === yesterday;
      const updatedMastery = { ...prev.wordMastery };

      words.forEach((id) => {
        const current = updatedMastery[id] || 0;
        updatedMastery[id] = Math.min(3, current + 1) as MasteryLevel;
      });

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        sessionsCompleted: prev.sessionsCompleted + 1,
        wordMastery: updatedMastery,
        streak: prev.lastStudiedDate === today ? prev.streak : (isConsecutive ? prev.streak + 1 : 1),
        daysActive: prev.lastStudiedDate === today ? prev.daysActive : prev.daysActive + 1,
        lastStudiedDate: today,
      };
    });
  }, []);

  const setPreferences = useCallback((level: "A1" | "A2" | "B1", dailyGoalMinutes: number) => {
    setProgressState((prev) => ({
      ...prev,
      englishLevel: level,
      dailyGoalMinutes,
    }));
  }, []);

  return {
    progress,
    addXP,
    updateStreak,
    setWordMastery,
    recordCompletedBatch,
    setPreferences,
  };
}
