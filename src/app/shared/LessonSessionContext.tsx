import { createContext, useContext } from "react";
import type { AnswerAttempt } from "../types";

export interface LessonSessionNavigation {
  current: number;
  total: number;
  nextExercise: string;
  onExit: () => void;
  sessionId?: string;
  unitId?: string;
  attempts?: AnswerAttempt[];
  activeItemId?: string;
  onActiveItem?: (wordId: string) => void;
  scaffolding?: "supported" | "guided" | "independent";
}

export const LessonSessionContext = createContext<LessonSessionNavigation | null>(null);
export const useLessonSession = () => useContext(LessonSessionContext);
