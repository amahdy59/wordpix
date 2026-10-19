import { useEffect, useRef } from "react";
import type { Screen } from "../types";
import { emitLearningEvent } from "./learningAnalytics";

export function useLearningDiagnostics(state: Screen) {
  const previous = useRef<Screen | null>(null);
  const started = useRef(0);
  useEffect(() => {
    const before = previous.current;
    if (
      before?.id === "lesson" &&
      (state.id !== "lesson" || state.sessionId !== before.sessionId)
    ) {
      const elapsed = performance.now() - started.current;
      emitLearningEvent({
        name: state.id === "lesson-complete" ? "lesson_completed" : "lesson_abandoned",
        properties: {
          mode: before.mode,
          stage: before.step + 1,
          durationBucket: elapsed < 120000 ? "short" : elapsed < 600000 ? "medium" : "long",
        },
      });
      if (state.id === "lesson-complete" && before.mode === "SMART_REVIEW")
        emitLearningEvent({
          name: "delayed_recall",
          properties: {
            correct: before.attempts.filter((attempt) => attempt.correct).length,
            total: before.attempts.length,
          },
        });
    }
    if (
      state.id === "lesson" &&
      (before?.id !== "lesson" || before.sessionId !== state.sessionId)
    ) {
      started.current = performance.now();
      emitLearningEvent({
        name: state.attempts.length || state.activeItemId ? "lesson_resumed" : "lesson_started",
        properties: { mode: state.mode, stage: state.step + 1 },
      });
    }
    previous.current = state;
  }, [state]);
}
