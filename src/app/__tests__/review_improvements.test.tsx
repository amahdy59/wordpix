import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react";
import { z } from "zod";
import { useStageCheckpoint } from "../shared/useStageCheckpoint";
import { hashToScreen, screenToHash, useHashRouter } from "../router/useHashRouter";
import { getReviewSchedule } from "../review/reviewSchedule";
import { createInitialWordState } from "../../features/gamification/sm2";
import { searchVocabulary, type SearchEntry } from "../data/vocabularySearch";
import { recommendFromEvidence, recommendPlacement } from "../onboarding/placementRecommendation";
import { LibraryWordCard } from "../core/LibraryWordCard";
import { LessonSessionContext, type LessonSessionNavigation } from "../shared/LessonSessionContext";
import { useDrillQueue } from "../exercises/useDrillQueue";
import { getLessonScaffolding } from "../lesson/lessonScaffolding";
import { recordDiagnostic, readDiagnostics } from "../analytics/localDiagnostics";
import { setDevicePreference } from "../shared/devicePreferences";

const speak = vi.fn();
vi.mock("../shared/useAudio", () => ({ useAudio: () => ({ speak, isPlaying: false }) }));
const words = ["bed", "chair"].map((id) => ({
  id,
  label: id,
  img: "",
  description: id,
  phonetic: "",
  topic: "bedroom",
}));
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
it("round trips the word browser URL and rejects a group from another unit", () => {
  const screenState = { id: "learn-words" as const, lessonId: "numbers-counting-1" };
  const route = screenToHash(screenState);
  expect(route.hash).toBe("#/learn/numbers-counting/words/numbers-counting-1");
  expect(hashToScreen(route.hash)?.screen).toEqual(screenState);
  expect(hashToScreen("#/learn/bathroom/words/numbers-counting-1")).toBeNull();
});
it("keeps keyboard focus when only the current vocabulary item changes", () => {
  const main = document.createElement("main");
  main.id = "main-content";
  document.body.append(main);
  const focus = vi.spyOn(main, "focus");
  const lesson = {
    id: "lesson" as const,
    mode: "NEW_LESSON" as const,
    sessionId: "focus",
    lessonId: "numbers-counting-1",
    unitId: "numbers-counting",
    wordQueue: ["one", "two"],
    step: 0,
    attempts: [],
    startedAt: new Date().toISOString(),
  };
  const { rerender, unmount } = renderHook(
    ({ item }) => useHashRouter({ ...lesson, activeItemId: item }, vi.fn()),
    { initialProps: { item: "one" } }
  );
  expect(focus).toHaveBeenCalledOnce();
  rerender({ item: "two" });
  expect(focus).toHaveBeenCalledOnce();
  unmount();
  main.remove();
});

describe("review scheduling", () => {
  it("never treats a future timestamp today as due and retains lapse priority", () => {
    const now = new Date("2026-10-19T21:01:00Z");
    const past = { ...createInitialWordState("past"), nextReviewAt: "2026-10-18T20:00:00Z" };
    const future = { ...createInitialWordState("future"), nextReviewAt: "2026-10-19T23:00:00Z" };
    const lapse = {
      ...createInitialWordState("lapse"),
      nextReviewAt: now.toISOString(),
      lapses: 2,
    };
    const schedule = getReviewSchedule({ past, future, lapse }, now);
    expect(schedule.due.map((word) => word.wordId)).toEqual(["lapse", "past"]);
    expect(schedule.overdue.map((word) => word.wordId)).toContain("past");
    expect(schedule.today.some((word) => word.wordId === "future")).toBe(false);
  });
});

describe("bilingual word search", () => {
  const entries: SearchEntry[] = [
    ["bedroom", "bookshelf", "Bookshelf", "رف كتب", "A1"],
    ["living-room", "book", "Book", "كتاب", "A1"],
    ["classroom", "book", "Book", "كِتاب", "A1"],
  ];
  it("ranks exact matches before substrings and preserves each unit's sense", () => {
    expect(searchVocabulary(entries, "book").map((row) => row[0])).toEqual([
      "living-room",
      "classroom",
      "bedroom",
    ]);
    expect(searchVocabulary(entries, "كِتاب")).toHaveLength(2);
  });
  it("does not truncate a full result count at 36", () => {
    expect(
      searchVocabulary(
        Array.from(
          { length: 80 },
          (_, index) => [`unit-${index}`, "book", "Book", "كتاب", "A1"] as SearchEntry
        ),
        "book"
      )
    ).toHaveLength(80);
  });
});

it("audio keyboard activation cannot open Library word details", () => {
  const inspect = vi.fn();
  render(
    <LibraryWordCard
      word={words[0]}
      unitId="bedroom"
      unitName="The Bedroom"
      onInspect={inspect}
      onGoToUnit={vi.fn()}
    />
  );
  const button = screen.getByRole("button", { name: /Listen to pronunciation/ });
  fireEvent.keyDown(button, { key: "Enter" });
  fireEvent.click(button);
  expect(speak).toHaveBeenCalledOnce();
  expect(inspect).not.toHaveBeenCalled();
  expect(button.closest('[role="button"]')).toBeNull();
});

it("resumes the unanswered drill item and retains the bounded missed-word retry", () => {
  const session: LessonSessionNavigation = {
    current: 2,
    total: 6,
    nextExercise: "fill",
    onExit: vi.fn(),
    attempts: [
      { exerciseStep: 1, wordId: "bed", correct: false, answeredAt: new Date().toISOString() },
    ],
  };
  const { result } = renderHook(() => useDrillQueue(words), {
    wrapper: ({ children }) => (
      <LessonSessionContext.Provider value={session}>{children}</LessonSessionContext.Provider>
    ),
  });
  expect(result.current.current?.id).toBe("chair");
  expect(result.current.next?.id).toBe("bed");
  expect(result.current.position).toBe(2);
});

it("does not infer advanced ability from three answers or skip unsupported bands", () => {
  expect(recommendPlacement(3).level).toBe("A1");
  expect(recommendFromEvidence(Array(15).fill(true)).level).toBe("C1");
  expect(recommendFromEvidence([false, false, false, ...Array(12).fill(true)]).level).toBe("A1");
  expect(recommendFromEvidence(Array(15).fill(true), true).listeningAssessed).toBe(false);
});

it("restores valid partial work only for its own unit and session", () => {
  let session: LessonSessionNavigation = {
    current: 4,
    total: 6,
    nextExercise: "quiz",
    onExit: vi.fn(),
    unitId: "bedroom",
    sessionId: "one",
  };
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LessonSessionContext.Provider value={session}>{children}</LessonSessionContext.Provider>
  );
  const first = renderHook(
    () => useStageCheckpoint<string[]>("builder-bed", [], z.array(z.string())),
    { wrapper }
  );
  act(() => first.result.current[1](["The", "bed"]));
  first.unmount();
  const resumed = renderHook(
    () => useStageCheckpoint<string[]>("builder-bed", [], z.array(z.string())),
    { wrapper }
  );
  expect(resumed.result.current[0]).toEqual(["The", "bed"]);
  session = { ...session, sessionId: "different" };
  resumed.rerender();
  expect(resumed.result.current[0]).toEqual([]);
});

it("keeps support until production evidence exists regardless of the target level", () => {
  expect(getLessonScaffolding("C1", ["bed"], {})).toBe("guided");
  expect(getLessonScaffolding("A1", ["bed"], {})).toBe("supported");
});

it("diagnostics require consent and remove unapproved properties", () => {
  const value = {
    version: 1,
    occurredAt: new Date().toISOString(),
    event: {
      name: "search_timing",
      properties: { milliseconds: 12, query: "private learner answer", url: "private-url" },
    },
  };
  recordDiagnostic(value);
  expect(readDiagnostics()).toEqual([]);
  setDevicePreference("diagnostics-consent", true);
  recordDiagnostic(value);
  expect(readDiagnostics()[0].event.properties).toEqual({ milliseconds: 12 });
  expect(JSON.stringify(readDiagnostics())).not.toContain("private");
});
