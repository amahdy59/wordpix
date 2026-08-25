import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useDrillQueue } from "../exercises/useDrillQueue";
import { useAutoAdvance, ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";
import { DEFAULT_ACCESSIBILITY } from "../context/LearnerContext";
import { getWords } from "../data/vocabulary";

const WORDS = getWords(["bed", "nightstand", "dresser"]);

describe("useDrillQueue", () => {
  it("asks each word once when every answer is right", () => {
    const { result } = renderHook(() => useDrillQueue(WORDS));

    const asked: string[] = [];
    for (let i = 0; i < WORDS.length; i += 1) {
      asked.push(result.current.current!.id);
      act(() => result.current.submit(true));
    }

    expect(asked).toEqual(WORDS.map((w) => w.id));
    expect(result.current.isComplete).toBe(true);
    expect(result.current.masteredCount).toBe(WORDS.length);
  });

  it("re-asks a missed word later in the same drill", () => {
    const { result } = renderHook(() => useDrillQueue(WORDS));

    const missed = result.current.current!.id;
    act(() => result.current.submit(false));

    // It must not be the very next question — that would just be "try again".
    expect(result.current.current!.id).not.toBe(missed);
    expect(result.current.isComplete).toBe(false);

    act(() => result.current.submit(true));
    act(() => result.current.submit(true));

    // Now it comes back round.
    expect(result.current.current!.id).toBe(missed);
    expect(result.current.isRetry).toBe(true);
  });

  it("never blocks: a word missed twice still ends the drill", () => {
    const { result } = renderHook(() => useDrillQueue(WORDS));

    // Miss everything, twice over. Without the re-queue cap this loops forever.
    let guard = 0;
    while (!result.current.isComplete && guard < 50) {
      act(() => result.current.submit(false));
      guard += 1;
    }

    expect(result.current.isComplete).toBe(true);
    // Three words, each re-queued at most once.
    expect(guard).toBe(WORDS.length * 2);
  });

  it("counts a word as mastered only once however often it is asked", () => {
    const { result } = renderHook(() => useDrillQueue(WORDS));

    act(() => result.current.submit(false)); // bed missed, re-queued
    act(() => result.current.submit(true));
    act(() => result.current.submit(true));
    act(() => result.current.submit(true)); // bed, second look

    expect(result.current.masteredCount).toBe(WORDS.length);
  });

  it("grows the reported total when a word is re-queued", () => {
    const { result } = renderHook(() => useDrillQueue(WORDS));
    expect(result.current.total).toBe(WORDS.length);

    act(() => result.current.submit(false));
    expect(result.current.total).toBe(WORDS.length + 1);
  });
});

describe("useAutoAdvance", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("advances by itself once the delay elapses", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useAutoAdvance({ enabled: true, onAdvance }));

    act(() => result.current.schedule(ADVANCE_DELAY_MS.correct));
    expect(onAdvance).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(ADVANCE_DELAY_MS.correct));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("leaves a wrong answer on screen longer than a right one", () => {
    expect(ADVANCE_DELAY_MS.incorrect).toBeGreaterThan(ADVANCE_DELAY_MS.correct);
  });

  it("schedules nothing when the learner has turned auto-advance off", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useAutoAdvance({ enabled: false, onAdvance }));

    act(() => result.current.schedule(ADVANCE_DELAY_MS.correct));
    act(() => vi.advanceTimersByTime(60_000));

    expect(onAdvance).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(false);
  });

  it("cancels a pending advance", () => {
    const onAdvance = vi.fn();
    const { result } = renderHook(() => useAutoAdvance({ enabled: true, onAdvance }));

    act(() => result.current.schedule(ADVANCE_DELAY_MS.incorrect));
    act(() => result.current.cancel());
    act(() => vi.advanceTimersByTime(60_000));

    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("does not fire into an unmounted exercise", () => {
    const onAdvance = vi.fn();
    const { result, unmount } = renderHook(() => useAutoAdvance({ enabled: true, onAdvance }));

    act(() => result.current.schedule(ADVANCE_DELAY_MS.incorrect));
    unmount();
    act(() => vi.advanceTimersByTime(60_000));

    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("re-rendering with a new callback does not restart the running timer", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onAdvance }) => useAutoAdvance({ enabled: true, onAdvance }),
      { initialProps: { onAdvance: first } }
    );

    act(() => result.current.schedule(1000));
    act(() => vi.advanceTimersByTime(600));
    rerender({ onAdvance: second });
    act(() => vi.advanceTimersByTime(400));

    // Fires on time, and calls the current callback rather than a stale one.
    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });
});

describe("auto-advance is defeatable", () => {
  it("is on by default", () => {
    expect(DEFAULT_ACCESSIBILITY.autoAdvance).toBe(true);
  });

  it("exists as a preference, so the timing can be switched off (WCAG 2.2.1)", () => {
    expect(DEFAULT_ACCESSIBILITY).toHaveProperty("autoAdvance");
  });
});
