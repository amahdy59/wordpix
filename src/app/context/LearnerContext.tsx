import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
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

export type TextSize = "standard" | "large" | "xlarge";
export type NumeralSystem = "western" | "arabic";

/**
 * Accessibility settings.
 *
 * Every one of these was previously a `useState` local to SettingsModal that
 * nothing read: the controls looked functional, moved when clicked, and did
 * absolutely nothing — and were discarded the moment the modal closed. They now
 * live in persisted state and are applied by real consumers.
 */
export interface AccessibilityPreferences {
  textSize: TextSize;
  highContrast: boolean;
  /** SpeechSynthesis rate for vocabulary playback. */
  speechRate: number;
  numeralSystem: NumeralSystem;
  includeSpeaking: boolean;
  includeListening: boolean;
  /**
   * When false, no exercise imposes a time limit at all.
   *
   * This is the control that satisfies WCAG 2.2.3 (No Timing, AAA): the limit
   * can be turned off before it is ever encountered. WCAG 2.2.1 (Level A) is
   * met separately by the pause and extend controls on the timer itself.
   */
  timedExercises: boolean;
}

export const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  textSize: "standard",
  highContrast: false,
  speechRate: 0.75,
  numeralSystem: "western",
  includeSpeaking: true,
  includeListening: true,
  timedExercises: true,
};

/** Root font-size multiplier per text-size step. */
export const TEXT_SIZE_SCALE: Record<TextSize, number> = {
  standard: 1,
  large: 1.25,
  xlarge: 1.5,
};

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
  accessibility: AccessibilityPreferences;
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
  accessibility: DEFAULT_ACCESSIBILITY,
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

/** Shape of whatever came out of localStorage: unknown until validated. */
type PersistedShape = Partial<Record<keyof LearnerStateSchema, unknown>>;

function migrateState(savedData: unknown): LearnerStateSchema {
  if (!savedData || typeof savedData !== "object") return INITIAL_LEARNER_STATE;

  const saved = savedData as PersistedShape;
  const rawMemory: Record<string, unknown> =
    saved.wordMemory && typeof saved.wordMemory === "object"
      ? (saved.wordMemory as Record<string, unknown>)
      : {};
  const normalizedMemory: Record<string, WordLearningState> = {};

  Object.keys(rawMemory).forEach((wordId) => {
    const val = rawMemory[wordId];
    if (val && typeof val === "object" && "wordId" in val) {
      normalizedMemory[wordId] = val as WordLearningState;
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
      ...(saved.preferences as Partial<LearnerPreferences> | undefined),
    },
    accessibility: {
      ...DEFAULT_ACCESSIBILITY,
      ...(saved.accessibility as Partial<AccessibilityPreferences> | undefined),
    },
    learnerProgress: {
      ...INITIAL_LEARNER_STATE.learnerProgress,
      ...(saved.learnerProgress as Partial<LearnerProgressStats> | undefined),
    },
    wordMemory: normalizedMemory,
    sessionHistory: Array.isArray(saved.sessionHistory) ? (saved.sessionHistory as SessionRecord[]) : [],
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
  setAccessibility: (patch: Partial<AccessibilityPreferences>) => void;
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

  const setAccessibility = useCallback((patch: Partial<AccessibilityPreferences>) => {
    setState((prev) => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...patch },
    }));
  }, []);

  const resetToZero = useCallback(() => {
    // Accessibility settings are assistive, not progress. Wiping someone's text
    // size or contrast preference because they reset their streak would be a
    // hostile surprise.
    setState((prev) => ({ ...INITIAL_LEARNER_STATE, accessibility: prev.accessibility }));
  }, []);

  // Memoised: an inline object literal here is a new reference on every render,
  // which pushes a re-render through every consumer and defeats the memo() on
  // components downstream of it.
  const value = useMemo<LearnerContextType>(
    () => ({ state, addXP, recordSessionCompletion, setPreferences, setAccessibility, resetToZero }),
    [state, addXP, recordSessionCompletion, setPreferences, setAccessibility, resetToZero]
  );

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

export function useLearner() {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error("useLearner must be used within a LearnerProvider");
  }
  return context;
}
