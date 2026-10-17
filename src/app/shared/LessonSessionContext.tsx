import { createContext, useContext } from "react";

export interface LessonSessionNavigation {
  current: number;
  total: number;
  nextExercise: string;
  onExit: () => void;
}

export const LessonSessionContext = createContext<LessonSessionNavigation | null>(null);
export const useLessonSession = () => useContext(LessonSessionContext);
