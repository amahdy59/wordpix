import { describe, expect, it } from "vitest";
import { reducer } from "../store/reducer";
import type { Screen } from "../types";

describe("35 Multimodal Skill Exercises Suite", () => {
  it("transitions state correctly when OPEN_SKILL_EXERCISE action is dispatched", () => {
    const startState: Screen = { id: "explore" };
    const nextState = reducer(startState, {
      type: "OPEN_SKILL_EXERCISE",
      exerciseId: "listen-word-match",
    });

    expect(nextState).toEqual({
      id: "skill-exercise",
      exerciseId: "listen-word-match",
    });
  });

  it("handles GO action to skill-hub", () => {
    const startState: Screen = { id: "home" };
    const nextState = reducer(startState, {
      type: "GO",
      to: "skill-hub",
    });

    expect(nextState).toEqual({ id: "skill-hub" });
  });
});
