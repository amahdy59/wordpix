import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AnswerAttempt } from "../types";
import { updateStreak, getLocalDateString } from "../../features/gamification/streak";

export type MasteryLevel = 0 | 1 | 2 | 3;

export interface LearnerPreferences {
  englishLevel: "A1" | "A2" | "B1";
  dailyGoalMinutes: number;
}

export interface LearnerProgressStats {
  xp: number;
  streak: number;
  lastStudiedDate: string | null;
  daysActive: number;
  sessionsCompleted: number;
  completedSessionIds: string[];
}

export interface SessionRecord {
  sessionId: string;
  completedAt: string;
  score: number;
  totalWords: number;
}

export interface LearnerStateSchema {
  version: number;
  preferences: LearnerPreferences;
  learnerProgress: LearnerProgressStats;
  wordMemory: Record<string, MasteryLevel>;
  sessionHistory: SessionRecord[];
}

const STORAGE_KEY = "wordpix:learner:v1";

export const INITIAL_LEARNER_STATE: LearnerStateSchema = {
  version: 1,
  preferences: {
    englishLevel: "A1",
    dailyGoalMinutes: 10,
  },
  learnerProgress: {
    xp: 0,
    streak: 0,
    lastStudiedDate: null,
    daysActive: 0,
    sessionsCompleted: 0,
    completedSessionIds: [],
  },
  wordMemory: {},
  sessionHistory: [],
};

/**
 * Migration engine: converts older storage schemas to current version safely.
 */

function migrateState(savedData: any): LearnerStateSchema {
  if (!savedData || typeof savedData !== "object") return INITIAL_LEARNER_STATE;

  // If unversioned v2/v3 legacy data exists from early prototypes
  if (!savedData.version) {
    const legacyXP = typeof savedData.xp === "number" ? savedData.xp : 0;
    const legacyStreak = typeof savedData.streak === "number" ? savedData.streak : 0;
    const legacyMastery = savedData.wordMastery && typeof savedData.wordMastery === "object" ? savedData.wordMastery : {};
    return {
      ...INITIAL_LEARNER_STATE,
      learnerProgress: {
        ...INITIAL_LEARNER_STATE.learnerProgress,
        xp: legacyXP,
        streak: legacyStreak,
      },
      wordMemory: legacyMastery,
    };
  }

  // Current Version 1 Schema Validation
  if (savedData.version === 1) {
    return {
      version: 1,
      preferences: {
        ...INITIAL_LEARNER_STATE.preferences,
        ...savedData.preferences,
      },
      learnerProgress: {
        ...INITIAL_LEARNER_STATE.learnerProgress,
        ...savedData.learnerProgress,
      },
      wordMemory: savedData.wordMemory && typeof savedData.wordMemory === "object" ? savedData.wordMemory : {},
      sessionHistory: Array.isArray(savedData.sessionHistory) ? savedData.sessionHistory : [],
    };
  }

  return INITIAL_LEARNER_STATE;
}

function loadLearnerState(): LearnerStateSchema {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_LEARNER_STATE;
    const parsed = JSON.parse(saved);
    return migrateState(parsed);
  } catch (e) {
    console.error("Corrupted local storage detected. Falling back safely.", e);
    return INITIAL_LEARNER_STATE;
  }
}

function saveLearnerState(state: LearnerStateSchema) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save learner state to localStorage.", e);
  }
}

interface LearnerContextType {
  state: LearnerStateSchema;
  addXP: (amount: number) => void;
  setWordMastery: (wordId: string, level: MasteryLevel) => void;
  recordSessionCompletion: (sessionId: string, attempts: AnswerAttempt[], wordQueue: string[]) => void;
  setPreferences: (level: "A1" | "A2" | "B1", dailyGoalMinutes: number) => void;
  resetToZero: () => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearnerStateSchema>(loadLearnerState);

  useEffect(() => {
    saveLearnerState(state);
  }, [state]);

  const addXP = useCallback((amount: number) => {
    if (amount <= 0) return;
    setState((prev) => ({
      ...prev,
      learnerProgress: {
        ...prev.learnerProgress,
        xp: prev.learnerProgress.xp + amount,
      },
    }));
  }, []);

  const setWordMastery = useCallback((wordId: string, level: MasteryLevel) => {
    setState((prev) => ({
      ...prev,
      wordMemory: {
        ...prev.wordMemory,
        [wordId]: level,
      },
    }));
  }, []);

  const recordSessionCompletion = useCallback((
    sessionId: string,
    attempts: AnswerAttempt[],
    wordQueue: string[]
  ) => {
    setState((prev) => {
      // Idempotency check
      if (prev.learnerProgress.completedSessionIds.includes(sessionId)) {
        return prev;
      }

      const todayStr = getLocalDateString(new Date());

      // Canonical streak calculation
      const streakRes = updateStreak(
        {
          currentStreak: prev.learnerProgress.streak,
          lastActiveDate: prev.learnerProgress.lastStudiedDate,
        },
        new Date()
      );

      const isFirstSessionToday = prev.learnerProgress.lastStudiedDate !== todayStr;

      // XP calculation: 10 XP per correct attempt (0 correct = 0 XP)
      const correctAttempts = attempts.filter((a) => a.correct);
      const xpEarned = correctAttempts.length * 10;

      // Group attempts by wordId to calculate per-word accuracy
      const wordAttempts: Record<string, { correct: number; total: number }> = {};
      attempts.forEach((a) => {
        if (!wordAttempts[a.wordId]) {
          wordAttempts[a.wordId] = { correct: 0, total: 0 };
        }
        wordAttempts[a.wordId].total += 1;
        if (a.correct) wordAttempts[a.wordId].correct += 1;
      });

      const updatedMemory = { ...prev.wordMemory };

      wordQueue.forEach((wordId) => {
        const perf = wordAttempts[wordId];
        const currentLevel = updatedMemory[wordId] || 0;

        if (!perf || perf.total === 0) {
          updatedMemory[wordId] = Math.max(currentLevel, 1) as MasteryLevel;
        } else {
          const accuracy = perf.correct / perf.total;
          if (accuracy >= 0.8) {
            updatedMemory[wordId] = Math.min(3, Math.max(1, currentLevel + 1)) as MasteryLevel;
          } else if (accuracy >= 0.5) {
            updatedMemory[wordId] = Math.max(currentLevel, 2) as MasteryLevel;
          } else {
            updatedMemory[wordId] = Math.min(currentLevel, 1) as MasteryLevel;
          }
        }
      });

      const newSessionRecord: SessionRecord = {
        sessionId,
        completedAt: new Date().toISOString(),
        score: correctAttempts.length,
        totalWords: wordQueue.length,
      };

      return {
        ...prev,
        learnerProgress: {
          ...prev.learnerProgress,
          xp: prev.learnerProgress.xp + xpEarned,
          sessionsCompleted: prev.learnerProgress.sessionsCompleted + 1,
          streak: streakRes.currentStreak,
          daysActive: isFirstSessionToday ? prev.learnerProgress.daysActive + 1 : prev.learnerProgress.daysActive,
          lastStudiedDate: todayStr,
          completedSessionIds: [...prev.learnerProgress.completedSessionIds, sessionId],
        },
        wordMemory: updatedMemory,
        sessionHistory: [newSessionRecord, ...prev.sessionHistory].slice(0, 50),
      };
    });
  }, []);

  const setPreferences = useCallback((level: "A1" | "A2" | "B1", dailyGoalMinutes: number) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        englishLevel: level,
        dailyGoalMinutes,
      },
    }));
  }, []);

  const resetToZero = useCallback(() => {
    setState(INITIAL_LEARNER_STATE);
  }, []);

  return (
    <LearnerContext.Provider
      value={{
        state,
        addXP,
        setWordMastery,
        recordSessionCompletion,
        setPreferences,
        resetToZero,
      }}
    >
      {children}
    </LearnerContext.Provider>
  );
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within a LearnerProvider");
  }
  return context;
}
