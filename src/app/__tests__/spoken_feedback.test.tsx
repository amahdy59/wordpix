import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";

const speak = vi.fn();
const stop = vi.fn();
let isSupported = true;
let spokenFeedbackPref = true;

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({ speak, stop, isSupported, status: "idle", isPlaying: false, isError: false }),
}));

vi.mock("../shared/useAccessibilityPreferences", () => ({
  useAccessibility: () => ({
    accessibility: { spokenFeedback: spokenFeedbackPref },
    setAccessibility: vi.fn(),
  }),
}));

const { useSpokenFeedback, SPOKEN_ADVANCE_DELAY_MS } = await import("../shared/useSpokenFeedback");

describe("useSpokenFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    speak.mockClear();
    stop.mockClear();
    isSupported = true;
    spokenFeedbackPref = true;
  });
  afterEach(() => vi.useRealTimers());

  it("speaks the answer back, after the chime has cleared", () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));

    // Not immediately: starting on the same tick buries the first syllable
    // underneath the 350ms chime.
    expect(speak).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(400));
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toMatch(/This is a faucet\.$/);
  });

  it("names the wrong pick alongside the answer", () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() =>
      result.current.speakFeedback({
        correct: false,
        targetLabel: "Faucet",
        chosenLabel: "Mirror",
      })
    );
    act(() => void vi.advanceTimersByTime(400));

    expect(speak.mock.calls[0][0]).toBe("Not quite. That's a mirror. This is a faucet.");
  });

  it("says nothing when the learner has switched it off", () => {
    spokenFeedbackPref = false;
    const { result } = renderHook(() => useSpokenFeedback());

    expect(result.current.enabled).toBe(false);
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(2000));

    expect(speak).not.toHaveBeenCalled();
  });

  it("says nothing when the browser has no speech support", () => {
    isSupported = false;
    const { result } = renderHook(() => useSpokenFeedback());

    expect(result.current.enabled).toBe(false);
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(2000));

    expect(speak).not.toHaveBeenCalled();
  });

  it("drops a pending sentence when the next answer lands first", () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Mirror" }));
    act(() => void vi.advanceTimersByTime(400));

    // Only the newest one is spoken. Queued utterances would drift further
    // behind the screen with every fast answer.
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0]).toMatch(/mirror/);
  });

  it("silences a sentence already in flight on cancel", () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(400));
    speak.mockClear();

    act(() => result.current.cancel());
    expect(stop).toHaveBeenCalled();
  });

  it("does not talk over the next screen after unmount", () => {
    const { result, unmount } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    unmount();
    act(() => void vi.advanceTimersByTime(2000));

    expect(speak).not.toHaveBeenCalled();
  });

  it("holds feedback on screen long enough to finish the sentence", () => {
    const { result } = renderHook(() => useSpokenFeedback());

    // The silent delays were set for reading a word, not hearing one: 900ms
    // would cut "Correct! This is a faucet." off mid-word.
    expect(result.current.delayFor(true)).toBeGreaterThan(ADVANCE_DELAY_MS.correct);
    expect(result.current.delayFor(false)).toBeGreaterThan(ADVANCE_DELAY_MS.incorrect);
    expect(result.current.delayFor(true)).toBe(SPOKEN_ADVANCE_DELAY_MS.correct);
    expect(result.current.delayFor(false)).toBe(SPOKEN_ADVANCE_DELAY_MS.incorrect);
  });
});
