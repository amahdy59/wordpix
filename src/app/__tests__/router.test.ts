import { describe, expect, it } from "vitest";
import { hashToRoute, screenToHash, hashToScreen } from "../router/useHashRouter";
import { reducer } from "../store/reducer";
import type { Screen } from "../types";
import { unitIdForScreen } from "../router/UnitVocabularyGate";

function lessonAt(step: number): Screen {
  return {
    id: "lesson",
    mode: "NEW_LESSON",
    sessionId: "sess_1",
    lessonId: "essential-furniture",
    wordQueue: ["bed", "lamp"],
    step,
    attempts: [
      { exerciseStep: 0, wordId: "bed", correct: true, answeredAt: "2026-01-01T00:00:00Z" },
    ],
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
      { id: "library" },
      { id: "practice" },
      { id: "review" },
      { id: "profile" },
      { id: "lesson-entry" },
      { id: "skill-hub" },
      { id: "pronunciation-curriculum" },
      { id: "figma-pronunciation-lesson", lessonNumber: 68 },
      { id: "hadith-curriculum" },
      { id: "hadith-lesson", lessonId: "hadith-42" },
      { id: "conversation-curriculum" },
      { id: "conversation-lesson", unitId: "unit-01" },
      { id: "conversation-lesson", unitId: "unit-01", stage: "quiz" },
      { id: "business-curriculum" },
      { id: "business-lesson", unitId: "unit-01" },
      { id: "business-lesson", unitId: "unit-01", stage: "exercises" },
      lessonAt(0),
      lessonAt(3),
      lessonAt(4),
      {
        id: "lesson-complete",
        mode: "NEW_LESSON",
        sessionId: "s",
        lessonId: "g",
        wordQueue: [],
        attempts: [],
      },
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
      title: expect.stringContaining("4/5"),
    });
  });

  it("rejects an out-of-range step rather than jumping somewhere wrong", () => {
    expect(hashToRoute("#/learn/bedroom/step-0")).toBeNull();
    expect(hashToRoute("#/learn/bedroom/step-6")).toBeNull();
    expect(hashToRoute("#/learn/bedroom/step-abc")).toBeNull();
  });

  it("returns null for an unknown hash", () => {
    expect(hashToRoute("#/nowhere")).toBeNull();
  });

  it("keeps shared pronunciation lesson aliases working", () => {
    expect(hashToScreen("#/foundations/pronunciation-minimal-pairs")?.screen).toEqual({
      id: "figma-pronunciation-lesson",
      lessonNumber: 17,
    });
    expect(hashToScreen("#/foundations/pronunciation-word-stress")?.screen).toEqual({
      id: "figma-pronunciation-lesson",
      lessonNumber: 41,
    });
    expect(hashToScreen("#/foundations/pronunciation-portfolio")?.screen).toEqual({
      id: "figma-pronunciation-lesson",
      lessonNumber: 68,
    });
  });

  it("exposes dedicated pronunciation and Hadith curriculum indexes", () => {
    expect(hashToScreen("#/pronunciation")?.screen).toEqual({
      id: "pronunciation-curriculum",
    });
    expect(hashToScreen("#/hadith")?.screen).toEqual({ id: "hadith-curriculum" });
    expect(hashToScreen("#/conversation")?.screen).toEqual({ id: "conversation-curriculum" });
    expect(hashToScreen("#/conversation/unit-01")?.screen).toEqual({
      id: "conversation-lesson",
      unitId: "unit-01",
      stage: undefined,
    });
    expect(hashToScreen("#/conversation/unit-01/quiz")?.screen).toEqual({
      id: "conversation-lesson",
      unitId: "unit-01",
      stage: "quiz",
    });
  });

  it("rejects invalid conversation units and stages", () => {
    expect(hashToScreen("#/conversation/unit-41")).toBeNull();
    expect(hashToScreen("#/conversation/unit-01/not-a-stage")).toBeNull();
  });

  it("does not route conversation lessons through the vocabulary data gate", () => {
    expect(unitIdForScreen({ id: "conversation-lesson", unitId: "unit-01" })).toBeNull();
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
    expect(reducer(state, { type: "ONBOARD_NEXT" })).toEqual(
      reducer(state, { type: "ONBOARD_NEXT" })
    );
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
