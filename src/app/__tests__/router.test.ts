import { describe, expect, it } from "vitest";
import { hashToRoute, screenToHash, hashToScreen } from "../router/useHashRouter";
import { reducer } from "../App";
import type { Screen } from "../types";

function lessonAt(step: number): Screen {
  return {
    id: "lesson",
    sessionId: "sess_1",
    groupId: "essential-furniture",
    wordQueue: ["bed", "lamp"],
    step,
    attempts: [{ exerciseStep: 0, wordId: "bed", correct: true, answeredAt: "2026-01-01T00:00:00Z" }],
    startedAt: "2026-01-01T00:00:00Z",
  };
}

describe("Hash round-tripping", () => {
  /**
   * The regression: screenToHash wrote `#/learn/bedroom/step-N` and
   * `#/learn/bedroom/complete`, but the route table had no entries for either.
   * hashToScreen returned null, popstate did nothing, and browser Back inside a
   * lesson silently failed while each step pushed another dead history entry.
   */
  it("resolves every hash it writes", () => {
    const screens: Screen[] = [
      { id: "onboarding", step: "splash" },
      { id: "home" },
      { id: "explore" },
      { id: "practice" },
      { id: "profile" },
      { id: "lesson-entry" },
      { id: "skill-hub" },
      lessonAt(0),
      lessonAt(3),
      lessonAt(5),
      { id: "lesson-complete", sessionId: "s", groupId: "g", wordQueue: [], attempts: [] },
    ];

    screens.forEach((screen) => {
      const { hash } = screenToHash(screen);
      expect(hashToRoute(hash), `no route resolves ${hash}`).not.toBeNull();
    });
  });

  it("maps a lesson step hash back to the same 0-based step", () => {
    const route = hashToRoute("#/learn/bedroom/step-4");
    expect(route).toEqual({
      kind: "lesson-step",
      step: 3,
      title: expect.stringContaining("4/6"),
    });
  });

  it("rejects an out-of-range step rather than jumping somewhere wrong", () => {
    expect(hashToRoute("#/learn/bedroom/step-0")).toBeNull();
    expect(hashToRoute("#/learn/bedroom/step-7")).toBeNull();
    expect(hashToRoute("#/learn/bedroom/step-abc")).toBeNull();
  });

  it("returns null for an unknown hash", () => {
    expect(hashToRoute("#/nowhere")).toBeNull();
  });

  it("gives onboarding its required step, not a bare id", () => {
    const resolved = hashToScreen("#/onboarding");
    expect(resolved?.screen).toEqual({ id: "onboarding", step: "splash" });
  });
});

describe("LESSON_GOTO_STEP", () => {
  it("moves to the requested step while preserving session state", () => {
    const next = reducer(lessonAt(4), { type: "LESSON_GOTO_STEP", step: 2 });
    expect(next).toMatchObject({ id: "lesson", step: 2, sessionId: "sess_1" });
    // Attempts and queue must survive: this is Back within one session, not a
    // fresh start.
    expect(next).toMatchObject({ wordQueue: ["bed", "lamp"] });
    expect((next as Extract<Screen, { id: "lesson" }>).attempts).toHaveLength(1);
  });

  it("is a no-op outside a lesson", () => {
    const home: Screen = { id: "home" };
    expect(reducer(home, { type: "LESSON_GOTO_STEP", step: 2 })).toBe(home);
  });

  it("rejects out-of-range steps", () => {
    const state = lessonAt(2);
    expect(reducer(state, { type: "LESSON_GOTO_STEP", step: -1 })).toBe(state);
    expect(reducer(state, { type: "LESSON_GOTO_STEP", step: 6 })).toBe(state);
  });

  it("returns the same object when already on that step", () => {
    const state = lessonAt(2);
    expect(reducer(state, { type: "LESSON_GOTO_STEP", step: 2 })).toBe(state);
  });
});

describe("GO to onboarding", () => {
  // `{ id: "onboarding" }` with no step matches none of the render branches, so
  // it produced a blank page. The `as TabId` cast in App.tsx is what allowed it.
  it("produces a complete onboarding screen", () => {
    expect(reducer({ id: "home" }, { type: "GO", to: "onboarding" })).toEqual({
      id: "onboarding",
      step: "splash",
    });
  });
});

describe("Reducer purity", () => {
  /**
   * ONBOARD_NEXT used to call ariaLiveAnnounce, a DOM write, from inside the
   * reducer. React double-invokes reducers in StrictMode and may replay them.
   */
  it("does not touch the DOM", () => {
    const live = document.createElement("div");
    live.id = "a11y-live-region";
    document.body.appendChild(live);

    reducer({ id: "onboarding", step: "splash" }, { type: "ONBOARD_NEXT" });

    expect(live.textContent).toBe("");
    live.remove();
  });

  it("returns the same result when invoked twice with the same input", () => {
    const state: Screen = { id: "onboarding", step: "splash" };
    expect(reducer(state, { type: "ONBOARD_NEXT" })).toEqual(reducer(state, { type: "ONBOARD_NEXT" }));
  });

  it("advances onboarding through every step to home", () => {
    let state: Screen = { id: "onboarding", step: "splash" };
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "language" });
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "onboarding", step: "ready" });
    state = reducer(state, { type: "ONBOARD_NEXT" });
    expect(state).toEqual({ id: "home" });
  });
});
