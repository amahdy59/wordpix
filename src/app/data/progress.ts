import { useLearner, type LearnerGoal, type LearnerStateSchema } from "../context/LearnerContext";
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
}

export function useProgress() {
  const { state, addXP, recordSessionCompletion, setPreferences, resetToZero } = useLearner();

  // Legacy numeric mastery map (1=learning, 2=familiar, 3=strong) for backwards-compatible UI widgets
  const legacyMasteryMap: Record<string, number> = {};
  Object.keys(state.wordMemory).forEach((wordId) => {
    const item = state.wordMemory[wordId];
    if (item) {
      legacyMasteryMap[wordId] = item.mastery === "strong" ? 3 : item.mastery === "familiar" ? 2 : 1;
    }
  });

  const progress: LearnerProgress = {
    xp: state.learnerProgress.xp,
    streak: state.learnerProgress.streak,
    lastStudiedDate: state.learnerProgress.lastStudiedDate,
    daysActive: state.learnerProgress.daysActive,
    englishLevel: state.preferences.englishLevel,
    dailyGoalMinutes: state.preferences.dailyGoalMinutes,
    goal: state.preferences.goal,
    wordMemory: state.wordMemory,
    wordMastery: legacyMasteryMap,
    sessionsCompleted: state.learnerProgress.sessionsCompleted,
  };

  return {
    progress,
    addXP,
    recordSessionCompletion,
    setPreferences,
    resetToZero,
  };
}
