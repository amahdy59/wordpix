import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AnswerAttempt } from "../types";
import { updateStreak, getLocalDateString } from "../../features/gamification/streak";
import { calculateSM2State, createInitialWordState, type WordLearningState } from "../../features/gamification/sm2";
import { calculateXPBreakdown, type XPBreakdown } from "../../features/gamification/xp";

export type MasteryLevel = 0 | 1 | 2 | 3;
export type LearnerGoal = "everyday" | "travel" | "work" | "school" | "conversation" | "kids";

export interface LearnerPreferences {
  englishLevel: "A1" | "A2" | "B1";
  dailyGoalMinutes: number;
  goal: LearnerGoal;
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
  /** Itemised XP actually credited for this session. */
  xp: XPBreakdown;
}

export interface LearnerStateSchema {
  version: number;
  preferences: LearnerPreferences;
  learnerProgress: LearnerProgressStats;
  wordMemory: Record<string, WordLearningState>;
  sessionHistory: SessionRecord[];
}

const STORAGE_KEY = "wordpix:learner:v2";

export const INITIAL_LEARNER_STATE: LearnerStateSchema = {
  version: 1,
  preferences: {
    englishLevel: "A1",
    dailyGoalMinutes: 10,
    goal: "everyday",
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

function migrateState(savedData: any): LearnerStateSchema {
  if (!savedData || typeof savedData !== "object") return INITIAL_LEARNER_STATE;

  const rawMemory = savedData.wordMemory && typeof savedData.wordMemory === "object" ? savedData.wordMemory : {};
  const normalizedMemory: Record<string, WordLearningState> = {};

  Object.keys(rawMemory).forEach((wordId) => {
    const val = rawMemory[wordId];
    if (typeof val === "object" && val.wordId) {
      normalizedMemory[wordId] = val;
    } else if (typeof val === "number") {
      // Migrate legacy numeric mastery levels (1, 2, 3) to SM-2 WordLearningState
      const base = createInitialWordState(wordId);
      base.intervalDays = val === 3 ? 14 : val === 2 ? 6 : 1;
      base.mastery = val === 3 ? "strong" : val === 2 ? "familiar" : "learning";
      normalizedMemory[wordId] = base;
    }
  });

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
    wordMemory: normalizedMemory,
    sessionHistory: Array.isArray(savedData.sessionHistory) ? savedData.sessionHistory : [],
  };
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
  recordSessionCompletion: (sessionId: string, attempts: AnswerAttempt[], wordQueue: string[]) => void;
  setPreferences: (level: "A1" | "A2" | "B1", dailyGoalMinutes: number, goal?: LearnerGoal) => void;
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

      // XP now runs through the shared calculator, so the completion, perfect
      // session, and streak bonuses defined in XP_RULES are actually paid out.
      // Previously this inlined `correct * 10` and calculateXP was dead code
      // referenced only by its own test.
      //
      // The streak bonus is a *daily* bonus, so it is only offered on the first
      // session of the day — otherwise replaying a lesson would farm it.
      const correctAttempts = attempts.filter((a) => a.correct);
      const xpBreakdown = calculateXPBreakdown(
        correctAttempts.length,
        attempts.length,
        isFirstSessionToday ? streakRes.currentStreak : 0
      );
      const xpEarned = xpBreakdown.total;

      // Group attempts by wordId to calculate SM-2 recall quality
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
        const existingState = updatedMemory[wordId] || createInitialWordState(wordId);

        if (!perf || perf.total === 0) {
          // Unanswered word: mark exposed once
          updatedMemory[wordId] = {
            ...existingState,
            exposures: existingState.exposures + 1,
            lastSeenAt: new Date().toISOString(),
          };
        } else {
          // Convert accuracy to SM-2 quality rating (0 to 5)
          const accuracy = perf.correct / perf.total;
          const quality = accuracy >= 0.9 ? 5 : accuracy >= 0.7 ? 4 : accuracy >= 0.5 ? 3 : 1;

          updatedMemory[wordId] = calculateSM2State(existingState, quality);
        }
      });

      const newSessionRecord: SessionRecord = {
        sessionId,
        completedAt: new Date().toISOString(),
        score: correctAttempts.length,
        totalWords: wordQueue.length,
        xp: xpBreakdown,
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

  const setPreferences = useCallback((level: "A1" | "A2" | "B1", dailyGoalMinutes: number, goal: LearnerGoal = "everyday") => {
    setState((prev) => ({
      ...prev,
      preferences: {
        englishLevel: level,
        dailyGoalMinutes,
        goal,
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
