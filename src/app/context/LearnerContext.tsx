import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { AnswerAttempt } from "../types";
import { updateStreak, getLocalDateString } from "../../features/gamification/streak";
import {
  calculateSM2State,
  createInitialWordState,
  type WordLearningState,
} from "../../features/gamification/sm2";
import { calculateXPBreakdown, type XPBreakdown } from "../../features/gamification/xp";
import { getLearnerState, saveLearnerState, queueMutation } from "../../lib/persistence/db";

export type MasteryLevel = 0 | 1 | 2 | 3;
export type LearnerGoal = "everyday" | "travel" | "work" | "school" | "conversation" | "kids";

export type ThemePreference = "system" | "light" | "dark";
export type LearnerExpression = "child" | "adult";

export interface LearnerPreferences {
  englishLevel: "A1" | "A2" | "B1";
  dailyGoalMinutes: number;
  goal: LearnerGoal;
  theme: ThemePreference;
  expression: LearnerExpression;
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
  /**
   * When true, a drill moves to the next question by itself a moment after
   * each answer, instead of waiting to be told to.
   *
   * The delay before it moves on is a time limit on reading the feedback, so
   * WCAG 2.2.1 (Timing Adjustable) requires it be possible to switch off before
   * it is ever encountered — which is what this does. Turning it off puts a
   * Next button on the feedback instead.
   */
  autoAdvance: boolean;
  reduceMotion: boolean;
}

export const DEFAULT_ACCESSIBILITY: AccessibilityPreferences = {
  textSize: "standard",
  highContrast: false,
  speechRate: 0.75,
  numeralSystem: "western",
  includeSpeaking: true,
  includeListening: true,
  timedExercises: true,
  autoAdvance: true,
  reduceMotion: false,
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
    theme: "system",
    expression: "adult",
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
      englishLevel: (saved.preferences as Partial<LearnerPreferences>)?.englishLevel ?? "A1",
      dailyGoalMinutes: (saved.preferences as Partial<LearnerPreferences>)?.dailyGoalMinutes ?? 10,
      goal: (saved.preferences as Partial<LearnerPreferences>)?.goal ?? "everyday",
      theme: (saved.preferences as Partial<LearnerPreferences>)?.theme ?? "system",
      expression: (saved.preferences as Partial<LearnerPreferences>)?.expression ?? "adult",
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
    sessionHistory: Array.isArray(saved.sessionHistory)
      ? (saved.sessionHistory as SessionRecord[])
      : [],
  };
}

interface LearnerContextType {
  state: LearnerStateSchema;
  addXP: (amount: number) => void;
  recordSessionCompletion: (
    sessionId: string,
    attempts: AnswerAttempt[],
    wordQueue: string[]
  ) => void;
  recordUnitAssessmentCompletion: (passed: boolean, unitWordIds: string[]) => void;
  setPreferences: (patch: Partial<LearnerPreferences>) => void;
  setAccessibility: (patch: Partial<AccessibilityPreferences>) => void;
  resetToZero: () => void;
}

const LearnerContext = createContext<LearnerContextType | undefined>(undefined);

type MutationType =
  "update_preferences" | "update_accessibility" | "session_completed" | "add_xp" | "reset";

let testStateCache: LearnerStateSchema | null = null;

export function __clearTestStateCache() {
  testStateCache = null;
}

export function LearnerProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LearnerStateSchema | null>(() => {
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
      return testStateCache || INITIAL_LEARNER_STATE;
    }
    if (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") {
      return testStateCache || INITIAL_LEARNER_STATE;
    }
    return null;
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (typeof process !== "undefined" && process.env.NODE_ENV === "test") return;
      if (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") return;

      try {
        let dbState = await getLearnerState();
        if (!dbState) {
          try {
            const ls = localStorage.getItem(STORAGE_KEY);
            if (ls) {
              dbState = migrateState(JSON.parse(ls));
              localStorage.removeItem(STORAGE_KEY);
            }
          } catch (e) {
            console.warn("Legacy localStorage read failed", e);
          }
          if (!dbState) {
            dbState = INITIAL_LEARNER_STATE;
          }
          await saveLearnerState(dbState);
        }

        if (mounted) setState(dbState);
      } catch (err) {
        console.error("Failed to load state", err);
        if (mounted) setState(INITIAL_LEARNER_STATE);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const updateStateAndPersist = useCallback(
    (
      updater: (prev: LearnerStateSchema) => {
        nextState: LearnerStateSchema;
        mutationType?: MutationType;
        mutationPayload?: unknown;
      }
    ) => {
      setState((prev) => {
        if (!prev) return prev;
        const { nextState, mutationType, mutationPayload } = updater(prev);

        if (typeof process !== "undefined" && process.env.NODE_ENV === "test") {
          testStateCache = nextState;
        }
        if (typeof import.meta !== "undefined" && import.meta.env?.MODE === "test") {
          testStateCache = nextState;
        }

        saveLearnerState(nextState).catch((e) => console.error("Failed to persist state", e));

        if (mutationType && mutationPayload) {
          // @ts-expect-error TS2345: TypeScript cannot infer that mutationPayload matches mutationType here
          queueMutation(mutationType, mutationPayload).catch((e) =>
            console.error("Failed to queue mutation", e)
          );
        }

        return nextState;
      });
    },
    []
  );

  const addXP = useCallback(
    (amount: number) => {
      if (amount <= 0) return;
      updateStateAndPersist((prev) => {
        const nextXp = prev.learnerProgress.xp + amount;
        return {
          nextState: {
            ...prev,
            learnerProgress: {
              ...prev.learnerProgress,
              xp: nextXp,
            },
          },
          mutationType: "add_xp",
          mutationPayload: { xp: nextXp },
        };
      });
    },
    [updateStateAndPersist]
  );

  const recordSessionCompletion = useCallback(
    (sessionId: string, attempts: AnswerAttempt[], wordQueue: string[]) => {
      updateStateAndPersist((prev) => {
        if (prev.learnerProgress.completedSessionIds.includes(sessionId)) {
          return { nextState: prev };
        }

        const todayStr = getLocalDateString(new Date());

        const streakRes = updateStreak(
          {
            currentStreak: prev.learnerProgress.streak,
            lastActiveDate: prev.learnerProgress.lastStudiedDate,
          },
          new Date()
        );

        const isFirstSessionToday = prev.learnerProgress.lastStudiedDate !== todayStr;
        const correctAttempts = attempts.filter((a) => a.correct);
        const xpBreakdown = calculateXPBreakdown(
          correctAttempts.length,
          attempts.length,
          isFirstSessionToday ? streakRes.currentStreak : 0
        );
        const xpEarned = xpBreakdown.total;

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
            updatedMemory[wordId] = {
              ...existingState,
              exposures: existingState.exposures + 1,
              lastSeenAt: new Date().toISOString(),
            };
          } else {
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

        const nextLearnerProgress = {
          ...prev.learnerProgress,
          xp: prev.learnerProgress.xp + xpEarned,
          sessionsCompleted: prev.learnerProgress.sessionsCompleted + 1,
          streak: streakRes.currentStreak,
          daysActive: isFirstSessionToday
            ? prev.learnerProgress.daysActive + 1
            : prev.learnerProgress.daysActive,
          lastStudiedDate: todayStr,
          completedSessionIds: [...prev.learnerProgress.completedSessionIds, sessionId],
        };

        const payload = {
          sessionId,
          completedAt: newSessionRecord.completedAt,
          score: newSessionRecord.score,
          totalWords: newSessionRecord.totalWords,
          xp: newSessionRecord.xp,
          learnerProgress: nextLearnerProgress,
          wordMemory: updatedMemory,
        };

        return {
          nextState: {
            ...prev,
            learnerProgress: nextLearnerProgress,
            wordMemory: updatedMemory,
            sessionHistory: [newSessionRecord, ...prev.sessionHistory].slice(0, 50),
          },
          mutationType: "session_completed",
          mutationPayload: payload,
        };
      });
    },
    [updateStateAndPersist]
  );

  const recordUnitAssessmentCompletion = useCallback(
    (passed: boolean, unitWordIds: string[]) => {
      if (!passed) return; // If failed, we could record standard XP, but let's keep it simple and just exit or just let them get XP from the normal `recordSessionCompletion`?
      // Wait, if they pass, we want to force all words in the unit to 'strong'.
      updateStateAndPersist((prev) => {
        const updatedMemory = { ...prev.wordMemory };

        unitWordIds.forEach((wordId) => {
          const existingState = updatedMemory[wordId] || createInitialWordState(wordId);
          updatedMemory[wordId] = {
            ...existingState,
            exposures: existingState.exposures + 1,
            lastSeenAt: new Date().toISOString(),
            mastery: "strong",
            intervalDays: 14,
          };
        });

        // Add a bonus XP for testing out?
        const bonusXp = 50;
        const nextXp = prev.learnerProgress.xp + bonusXp;

        return {
          nextState: {
            ...prev,
            learnerProgress: {
              ...prev.learnerProgress,
              xp: nextXp,
            },
            wordMemory: updatedMemory,
          },
          mutationType: "session_completed", // Reusing this mutation type for sync
          mutationPayload: { wordMemory: updatedMemory, xp: nextXp },
        };
      });
    },
    [updateStateAndPersist]
  );

  const setPreferences = useCallback(
    (patch: Partial<LearnerPreferences>) => {
      updateStateAndPersist((prev) => {
        const prefs = { ...prev.preferences, ...patch };
        return {
          nextState: { ...prev, preferences: prefs },
          mutationType: "update_preferences",
          mutationPayload: prefs,
        };
      });
    },
    [updateStateAndPersist]
  );

  const setAccessibility = useCallback(
    (patch: Partial<AccessibilityPreferences>) => {
      updateStateAndPersist((prev) => {
        const nextAcc = { ...prev.accessibility, ...patch };
        return {
          nextState: { ...prev, accessibility: nextAcc },
          mutationType: "update_accessibility",
          mutationPayload: nextAcc,
        };
      });
    },
    [updateStateAndPersist]
  );

  const resetToZero = useCallback(() => {
    updateStateAndPersist((prev) => {
      return {
        nextState: { ...INITIAL_LEARNER_STATE, accessibility: prev.accessibility },
        mutationType: "reset",
        mutationPayload: {},
      };
    });
  }, [updateStateAndPersist]);

  const value = useMemo<LearnerContextType>(() => {
    if (!state) {
      return {
        state: INITIAL_LEARNER_STATE,
        addXP,
        recordSessionCompletion,
        recordUnitAssessmentCompletion,
        setPreferences,
        setAccessibility,
        resetToZero,
      };
    }
    return {
      state,
      addXP,
      recordSessionCompletion,
      recordUnitAssessmentCompletion,
      setPreferences,
      setAccessibility,
      resetToZero,
    };
  }, [
    state,
    addXP,
    recordSessionCompletion,
    recordUnitAssessmentCompletion,
    setPreferences,
    setAccessibility,
    resetToZero,
  ]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
}

const DEFAULT_FALLBACK_CONTEXT: LearnerContextType = {
  state: INITIAL_LEARNER_STATE,
  addXP: () => {},
  recordSessionCompletion: () => {},
  recordUnitAssessmentCompletion: () => {},
  setPreferences: () => {},
  setAccessibility: () => {},
  resetToZero: () => {},
};

export function useLearner() {
  const context = useContext(LearnerContext);
  return context ?? DEFAULT_FALLBACK_CONTEXT;
}
