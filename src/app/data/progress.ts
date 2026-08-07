import { useLearner, INITIAL_LEARNER_STATE, type MasteryLevel, type LearnerStateSchema } from "../context/LearnerContext";

export type { MasteryLevel };
export const INITIAL_ZERO_PROGRESS = INITIAL_LEARNER_STATE.learnerProgress;

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

export function useProgress() {
  const { state, addXP, setWordMastery, recordSessionCompletion, setPreferences, resetToZero } = useLearner();

  const progress: LearnerProgress = {
    xp: state.learnerProgress.xp,
    streak: state.learnerProgress.streak,
    lastStudiedDate: state.learnerProgress.lastStudiedDate,
    daysActive: state.learnerProgress.daysActive,
    englishLevel: state.preferences.englishLevel,
    dailyGoalMinutes: state.preferences.dailyGoalMinutes,
    wordMastery: state.wordMemory,
    sessionsCompleted: state.learnerProgress.sessionsCompleted,
  };

  return {
    progress,
    addXP,
    setWordMastery,
    recordSessionCompletion,
    setPreferences,
    resetToZero,
  };
}
