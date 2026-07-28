import { describe, it, expect } from "vitest";
import type { Screen, Action, OnboardStep } from "../types";

const ONBOARD_STEPS: OnboardStep[] = ["splash", "language", "interests", "ready"];

function reducer(state: Screen, action: Action): Screen {
  if (action.type === "ONBOARD_NEXT") {
    if (state.id !== "onboarding") return state;
    const i = ONBOARD_STEPS.indexOf(state.step);
    return i < ONBOARD_STEPS.length - 1
      ? { id: "onboarding", step: ONBOARD_STEPS[i + 1] }
      : { id: "home" };
  }
  if (action.type === "GO") {
    if (action.to === "lesson-entry") return { id: "lesson-entry" };
    if (action.to === "lesson-complete") return { id: "lesson-complete" };
    return { id: action.to };
  }
  if (action.type === "START_LESSON") return { id: "lesson", step: 0 };
  if (action.type === "LESSON_NEXT") {
    if (state.id !== "lesson") return state;
    return state.step >= 5 ? { id: "lesson-complete" } : { id: "lesson", step: state.step + 1 };
  }
  return state;
}

describe("WordPix Navigation Reducer State Machine", () => {
  it("should advance through adult onboarding steps correctly", () => {
    let state: Screen = { id: "onboarding", step: "splash" };

    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "language" });

    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "interests" });

    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "ready" });

    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "home" });
  });

  it("should transition tabs on GO action", () => {
    const initialState: Screen = { id: "home" };

    const exploreState = reducer(initialState, { type: "GO", to: "explore" });
    expect(exploreState).toEqual({ id: "explore" });

    const profileState = reducer(exploreState, { type: "GO", to: "profile" });
    expect(profileState).toEqual({ id: "profile" });
  });

  it("should start and advance through lesson steps", () => {
    let state: Screen = { id: "lesson-entry" };

    state = reducer(state, { type: "START_LESSON" });
    expect(state).toEqual({ id: "lesson", step: 0 });

    for (let step = 0; step < 5; step++) {
      state = reducer(state, { type: "LESSON_NEXT" });
      expect(state).toEqual({ id: "lesson", step: step + 1 });
    }

    state = reducer(state, { type: "LESSON_NEXT" });
    expect(state).toEqual({ id: "lesson-complete" });
  });
});
