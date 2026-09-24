import { describe, expect, it } from "vitest";
import { getLessonProgressState } from "../shared/useLessonProgress";

describe("lesson progress state", () => {
  const stages = ["warmup", "practice", "review"] as const;

  it("clamps a saved stage to the unlocked boundary", () => {
    const state = getLessonProgressState({
      stageIds: stages,
      currentStage: 2,
      completedStages: ["warmup"],
      lockFutureStages: true,
    });
    expect(state.initialIndex).toBe(1);
    expect(state.maxUnlockedIndex).toBe(1);
  });

  it("opens every stage after mastery", () => {
    const state = getLessonProgressState({
      stageIds: stages,
      currentStage: 0,
      isMastered: true,
      lockFutureStages: true,
    });
    expect(state.maxUnlockedIndex).toBe(2);
  });

  it("supports review flows without locking future stages", () => {
    const state = getLessonProgressState({ stageIds: stages, currentStage: 99 });
    expect(state.initialIndex).toBe(2);
    expect(state.maxUnlockedIndex).toBe(2);
  });
});
