import { describe, expect, it } from "vitest";
import { reducer } from "../store/reducer";
import type { Screen } from "../types";

describe("WordPix navigation and group lesson reducer", () => {
  it("advances through onboarding", () => {
    let state: Screen = { id: "onboarding", step: "splash" };
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "language" });
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "ready" });
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "home" });
  });

  it("moves between tabs", () => {
    expect(reducer({ id: "home" }, { type: "GO", to: "explore" })).toEqual({ id: "explore" });
  });

  it("starts a group lesson and advances/regresses step-by-step", () => {
    let state = reducer({ id: "lesson-entry" }, { type: "START_LESSON", lessonId: "bedroom-1" });
    expect(state).toMatchObject({ id: "lesson", lessonId: "bedroom-1", step: 0, attempts: [] });

    state = reducer(state, { type: "LESSON_NEXT" });
    expect(state).toMatchObject({ id: "lesson", step: 1, lessonId: "bedroom-1" });

    state = reducer(state, { type: "LESSON_PREVIOUS" });
    expect(state).toMatchObject({ id: "lesson", step: 0, lessonId: "bedroom-1" });

    // Calling LESSON_PREVIOUS on step 0 returns to lesson-entry overview
    state = reducer(state, { type: "LESSON_PREVIOUS" });
    expect(state).toEqual({ id: "lesson-entry", unitId: "bedroom" });
  });

  it("records attempts and carries them into group completion results", () => {
    let state = reducer({ id: "lesson-entry" }, { type: "START_LESSON", lessonId: "bedroom-1" });
    state = reducer(state, { type: "LESSON_NEXT" });
    state = reducer(state, { type: "LESSON_ATTEMPT", correct: false });
    state = reducer(state, { type: "LESSON_ATTEMPT", correct: true });

    expect(state).toMatchObject({
      id: "lesson",
      attempts: [
        { exerciseStep: 1, correct: false },
        { exerciseStep: 1, correct: true },
      ],
    });

    for (let step = 1; step <= 5; step += 1) state = reducer(state, { type: "LESSON_NEXT" });
    expect(state).toMatchObject({ id: "lesson-complete", lessonId: "bedroom-1" });
    if (state.id === "lesson-complete") expect(state.attempts).toHaveLength(2);
  });
});
