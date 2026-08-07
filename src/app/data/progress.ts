// Learner progress data layer & persistence hook
import { useState, useEffect, useCallback } from "react";
import type { AnswerAttempt } from "../types";

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
  completedSessionIds: string[];
}

const STORAGE_KEY = "wordpix:progress:v3";

export const INITIAL_ZERO_PROGRESS: LearnerProgress = {
  xp: 0,
  streak: 0,
  lastStudiedDate: null,
  daysActive: 0,
  englishLevel: "A1",
  dailyGoalMinutes: 10,
  wordMastery: {},
  sessionsCompleted: 0,
  completedSessionIds: [],
};

function loadProgress(): LearnerProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_ZERO_PROGRESS;
    const parsed = JSON.parse(saved);
    return { ...INITIAL_ZERO_PROGRESS, ...parsed };
  } catch {
    return INITIAL_ZERO_PROGRESS;
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
    if (amount <= 0) return;
    setProgressState((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  }, []);

  const setWordMastery = useCallback((wordId: string, level: MasteryLevel) => {
    setProgressState((prev) => ({
      ...prev,
      wordMastery: {
        ...prev.wordMastery,
        [wordId]: level,
      },
    }));
  }, []);

  /**
   * Idempotent session completion recorder.
   * Calculates XP strictly based on correct attempts (0 XP for 0 correct).
   * Bumps word mastery strictly per-word based on individual word performance.
   */
  const recordSessionCompletion = useCallback((
    sessionId: string,
    attempts: AnswerAttempt[],
    wordQueue: string[]
  ) => {
    setProgressState((prev) => {
      // Prevent duplicate completion processing (idempotent)
      if (prev.completedSessionIds.includes(sessionId)) {
        return prev;
      }

      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const isConsecutive = prev.lastStudiedDate === yesterday;

      // Calculate XP: 10 XP per correct attempt (0 correct = 0 XP)
      const correctAttempts = attempts.filter((a) => a.correct);
      const xpEarned = correctAttempts.length * 10;

      // Group attempts by wordId to calculate per-word performance
      const wordAttempts: Record<string, { correct: number; total: number }> = {};
      attempts.forEach((a) => {
        if (!wordAttempts[a.wordId]) {
          wordAttempts[a.wordId] = { correct: 0, total: 0 };
        }
        wordAttempts[a.wordId].total += 1;
        if (a.correct) wordAttempts[a.wordId].correct += 1;
      });

      const updatedMastery = { ...prev.wordMastery };

      wordQueue.forEach((wordId) => {
        const perf = wordAttempts[wordId];
        const currentLevel = updatedMastery[wordId] || 0;

        if (!perf || perf.total === 0) {
          // Unanswered word in queue becomes Recognized (Level 1) if unseen
          updatedMastery[wordId] = Math.max(currentLevel, 1) as MasteryLevel;
        } else {
          const accuracy = perf.correct / perf.total;
          if (accuracy >= 0.8) {
            // High performance: upgrade level up to 3 (Mastered)
            updatedMastery[wordId] = Math.min(3, Math.max(1, currentLevel + 1)) as MasteryLevel;
          } else if (accuracy >= 0.5) {
            // Moderate performance: promote to Level 2 (Practiced)
            updatedMastery[wordId] = Math.max(currentLevel, 2) as MasteryLevel;
          } else {
            // Struggling word: hold at current level or max Level 1 (Recognized)
            updatedMastery[wordId] = Math.min(currentLevel, 1) as MasteryLevel;
          }
        }
      });

      const isFirstSessionToday = prev.lastStudiedDate !== today;

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        sessionsCompleted: prev.sessionsCompleted + 1,
        wordMastery: updatedMastery,
        streak: isFirstSessionToday ? (isConsecutive ? prev.streak + 1 : 1) : prev.streak,
        daysActive: isFirstSessionToday ? prev.daysActive + 1 : prev.daysActive,
        lastStudiedDate: today,
        completedSessionIds: [...prev.completedSessionIds, sessionId],
      };
    });
  }, []);

  const resetToZero = useCallback(() => {
    setProgressState(INITIAL_ZERO_PROGRESS);
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
    setWordMastery,
    recordSessionCompletion,
    resetToZero,
    setPreferences,
  };
}
