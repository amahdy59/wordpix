import { useEffect, useState } from "react";
import { loadLessonUsage } from "./usageRegistry";
import type { LessonUsageData } from "./usageTypes";

export type LessonUsageState =
  | { status: "loading"; lessonId: string }
  | { status: "ready"; lessonId: string; data: LessonUsageData | null };

export function useLessonUsage(lessonId: string): LessonUsageState {
  const [state, setState] = useState<LessonUsageState>({ status: "loading", lessonId });

  useEffect(() => {
    let cancelled = false;
    void loadLessonUsage(lessonId).then((data) => {
      if (!cancelled) setState({ status: "ready", lessonId, data });
    });
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  return state.lessonId === lessonId ? state : { status: "loading", lessonId };
}
