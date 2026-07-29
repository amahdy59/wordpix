import { describe, expect, it } from "vitest";
import { reducer } from "../App";
import type { Screen } from "../types";

describe("WordPix navigation and lesson reducer", () => {
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

  it("preserves the selected word while moving forward and backward", () => {
    let state = reducer({ id: "lesson-entry" }, { type: "START_LESSON", wordId: "lamp" });
    expect(state).toMatchObject({ id: "lesson", step: 0, selectedWordId: "lamp", attempts: [] });

    state = reducer(state, { type: "LESSON_NEXT" });
    expect(state).toMatchObject({ id: "lesson", step: 1, selectedWordId: "lamp" });

    state = reducer(state, { type: "LESSON_PREVIOUS" });
    expect(state).toMatchObject({ id: "lesson", step: 0, selectedWordId: "lamp" });

    state = reducer(state, { type: "LESSON_PREVIOUS" });
    expect(state).toMatchObject({ id: "lesson", step: 0 });
  });

  it("records attempts and carries them into real completion results", () => {
    let state = reducer({ id: "lesson-entry" }, { type: "START_LESSON", wordId: "wardrobe" });
    state = reducer(state, { type: "LESSON_NEXT" });
    state = reducer(state, { type: "LESSON_ATTEMPT", correct: false });
    state = reducer(state, { type: "LESSON_ATTEMPT", correct: true });

    expect(state).toMatchObject({
      id: "lesson",
      attempts: [
        { exerciseStep: 1, wordId: "wardrobe", correct: false },
        { exerciseStep: 1, wordId: "wardrobe", correct: true },
      ],
    });

    for (let step = 1; step <= 5; step += 1) state = reducer(state, { type: "LESSON_NEXT" });
    expect(state).toMatchObject({ id: "lesson-complete", selectedWordId: "wardrobe" });
    if (state.id === "lesson-complete") expect(state.attempts).toHaveLength(2);
  });
});
