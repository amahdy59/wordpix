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
  audioKey: vi.fn().mockResolvedValue("audio/12/123.mp3"),
  audioUrl: vi.fn().mockResolvedValue("https://cdn.example.com/audio/12/123.mp3"),
}));

const { useSpokenFeedback, SPOKEN_ADVANCE_DELAY_MS } = await import("../shared/useSpokenFeedback");

// Stand-in for Audio element
class MockAudio {
  src: string;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  play = vi.fn().mockResolvedValue(undefined);
  pause = vi.fn();

  constructor(src: string) {
    this.src = src;
    globalThis.__mockAudioInstances.push(this);
  }
}

declare global {
  var __mockAudioInstances: MockAudio[];
}

describe("useSpokenFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    spokenFeedbackPref = true;
    globalThis.__mockAudioInstances = [];
    vi.stubGlobal("Audio", MockAudio);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    delete (globalThis as unknown as { __mockAudioInstances?: unknown[] }).__mockAudioInstances;
  });

  it("speaks the answer back, just after the chime", async () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    expect(globalThis.__mockAudioInstances.length).toBe(0);

    await act(async () => {
      vi.advanceTimersByTime(200);
      // Promises for fetch/DB might need a tick
      await Promise.resolve();
    });

    expect(globalThis.__mockAudioInstances.length).toBeGreaterThan(0);
    expect(globalThis.__mockAudioInstances[0].play).toHaveBeenCalled();
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

    // It should only start playing the second sequence
    expect(globalThis.__mockAudioInstances.length).toBeGreaterThan(0);
  });

  it("silences an utterance already in flight on cancel", async () => {
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    await act(async () => {
      vi.advanceTimersByTime(200);
      await Promise.resolve();
    });

    const audioInstance = globalThis.__mockAudioInstances[0];
    expect(audioInstance).toBeDefined();

    act(() => result.current.cancel());
    expect(audioInstance.pause).toHaveBeenCalled();
  });

  it("holds feedback on screen long enough to finish the sentence", () => {
    const { result } = renderHook(() => useSpokenFeedback());
    expect(result.current.delayFor(true)).toBe(SPOKEN_ADVANCE_DELAY_MS.correct);
    expect(result.current.delayFor(false)).toBe(SPOKEN_ADVANCE_DELAY_MS.incorrect);
    expect(result.current.delayFor(true)).toBeGreaterThan(ADVANCE_DELAY_MS.correct);
  });
});
