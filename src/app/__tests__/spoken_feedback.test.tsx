import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";

let spokenFeedbackPref = true;

vi.mock("../shared/useAccessibilityPreferences", () => ({
  useAccessibility: () => ({
    accessibility: { spokenFeedback: spokenFeedbackPref },
    setAccessibility: vi.fn(),
  }),
}));

vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: vi.fn().mockResolvedValue(null),
}));

vi.mock("../shared/assetUrls", () => ({
  hasAssetHost: vi.fn().mockReturnValue(true),
  audioKey: vi.fn().mockResolvedValue("audio/12/123.mp3"),
  audioUrl: vi.fn().mockResolvedValue("https://cdn.example.com/audio/12/123.mp3"),
}));

const mockSpeak = vi.fn();
const mockStop = vi.fn();

vi.mock("../shared/useAudio", () => ({
  useAudio: vi.fn(() => ({
    speak: mockSpeak,
    stop: mockStop,
  })),
}));

const { useSpokenFeedback, SPOKEN_ADVANCE_DELAY_MS } = await import("../shared/useSpokenFeedback");

describe("useSpokenFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    spokenFeedbackPref = true;
    mockSpeak.mockClear();
    mockStop.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("speaks the answer back, just after the chime", async () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    expect(mockSpeak).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(200);
      await Promise.resolve();
    });

    expect(mockSpeak).toHaveBeenCalled();
  });

  it("reports itself disabled if preferences say so", () => {
    spokenFeedbackPref = false;
    const { result } = renderHook(() => useSpokenFeedback());
    expect(result.current.enabled).toBe(false);
  });

  it("drops a pending sentence when the next answer lands first", async () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Mirror" }));

    await act(async () => {
      vi.advanceTimersByTime(200);
      await Promise.resolve();
    });

    // It should only start playing the second sequence (Mirror's opener)
    expect(mockSpeak).toHaveBeenCalledTimes(1);
    expect(mockSpeak.mock.calls[0][0]).not.toMatch(/Faucet/i);
  });

  it("silences an utterance already in flight on cancel", async () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    await act(async () => {
      vi.advanceTimersByTime(200);
      await Promise.resolve();
    });

    expect(mockSpeak).toHaveBeenCalled();

    act(() => result.current.cancel());
    expect(mockStop).toHaveBeenCalled();
  });

  it("holds feedback on screen long enough to finish the sentence", () => {
    const { result } = renderHook(() => useSpokenFeedback());
    expect(result.current.delayFor(true)).toBe(SPOKEN_ADVANCE_DELAY_MS.correct);
    expect(result.current.delayFor(false)).toBe(SPOKEN_ADVANCE_DELAY_MS.incorrect);
    expect(result.current.delayFor(true)).toBeGreaterThan(ADVANCE_DELAY_MS.correct);
  });
});
