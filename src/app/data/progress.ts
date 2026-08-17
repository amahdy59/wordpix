import { useMemo } from "react";
import { useLearner, type LearnerGoal, type SessionRecord } from "../context/LearnerContext";
import type { WordLearningState, MasteryCategory } from "../../features/gamification/sm2";

export type { WordLearningState, MasteryCategory, LearnerGoal };

export interface LearnerProgress {
  xp: number;
  streak: number;
  lastStudiedDate: string | null;
  daysActive: number;
  englishLevel: "A1" | "A2" | "B1";
  dailyGoalMinutes: number;
  goal: LearnerGoal;
  wordMemory: Record<string, WordLearningState>;
  wordMastery: Record<string, number>; // Legacy numeric mapping: 0, 1, 2, 3 for UI components
  sessionsCompleted: number;
  sessionHistory: SessionRecord[];
}

const MASTERY_TO_LEGACY_LEVEL: Record<MasteryCategory, number> = {
  new: 0,
  learning: 1,
  familiar: 2,
  strong: 3,
};

export function useProgress() {
  const { state, addXP, recordSessionCompletion, recordUnitAssessmentCompletion, setPreferences, resetToZero } = useLearner();

  // Both of these were rebuilt on every render, so `progress` was a fresh
  // object each time and every memo() downstream of it was defeated. They only
  // change when the underlying state does.
  const wordMastery = useMemo(() => {
    const legacy: Record<string, number> = {};
    Object.entries(state.wordMemory).forEach(([wordId, item]) => {
      if (item) legacy[wordId] = MASTERY_TO_LEGACY_LEVEL[item.mastery] ?? 0;
    });
    return legacy;
  }, [state.wordMemory]);

  const progress = useMemo<LearnerProgress>(
    () => ({
      xp: state.learnerProgress.xp,
      streak: state.learnerProgress.streak,
      lastStudiedDate: state.learnerProgress.lastStudiedDate,
      daysActive: state.learnerProgress.daysActive,
      englishLevel: state.preferences.englishLevel,
      dailyGoalMinutes: state.preferences.dailyGoalMinutes,
      goal: state.preferences.goal,
      wordMemory: state.wordMemory,
      wordMastery,
      sessionsCompleted: state.learnerProgress.sessionsCompleted,
      sessionHistory: state.sessionHistory,
    }),
    [state, wordMastery]
  );

  return useMemo(
    () => ({ progress, addXP, recordSessionCompletion, recordUnitAssessmentCompletion, setPreferences, resetToZero }),
    [progress, addXP, recordSessionCompletion, recordUnitAssessmentCompletion, setPreferences, resetToZero]
  );
}
