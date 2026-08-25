import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { ADVANCE_DELAY_MS } from "../shared/useAutoAdvance";

let spokenFeedbackPref = true;

vi.mock("../shared/useAccessibilityPreferences", () => ({
  useAccessibility: () => ({
    accessibility: { spokenFeedback: spokenFeedbackPref },
    setAccessibility: vi.fn(),
  }),
}));

const { useSpokenFeedback, SPOKEN_ADVANCE_DELAY_MS } = await import("../shared/useSpokenFeedback");

/** A stand-in for the browser's speech engine, with a controllable voice list. */
function installSynth(voices: Array<{ lang: string; name: string }>) {
  const speak = vi.fn();
  const cancel = vi.fn();
  const listeners: Record<string, Array<() => void>> = {};
  const synth = {
    speak,
    cancel,
    getVoices: () => voices,
    addEventListener: (t: string, fn: () => void) => {
      (listeners[t] ??= []).push(fn);
    },
    removeEventListener: () => {},
    fire: (t: string) => listeners[t]?.forEach((fn) => fn()),
  };
  vi.stubGlobal("speechSynthesis", synth);
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      text: string;
      lang = "";
      rate = 1;
      voice: unknown = null;
      constructor(text: string) {
        this.text = text;
      }
    }
  );
  return { synth, speak, cancel };
}

const EN_VOICE = [{ lang: "en-US", name: "Test English" }];

describe("useSpokenFeedback", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    spokenFeedbackPref = true;
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("speaks the answer back, just after the chime", () => {
    const { speak } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    expect(speak).not.toHaveBeenCalled();

    act(() => void vi.advanceTimersByTime(200));
    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0].text).toMatch(/This is a faucet\.$/);
  });

  it("goes straight to the browser voice, with no network call", () => {
    // The whole reason this hook does not use useAudio: its network-first
    // chain (ElevenLabs, then a CORS-blocked translate_tts) failed slowly and
    // missed the mobile gesture window that lets speech play at all.
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    const { speak } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(200));

    expect(speak).toHaveBeenCalledTimes(1);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("names the wrong pick alongside the answer", () => {
    const { speak } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    act(() =>
      result.current.speakFeedback({ correct: false, targetLabel: "Faucet", chosenLabel: "Mirror" })
    );
    act(() => void vi.advanceTimersByTime(200));

    expect(speak.mock.calls[0][0].text).toBe("Not quite. That's a mirror. This is a faucet.");
  });

  describe("when no voice can actually speak", () => {
    // The regression this guards. `enabled` used to be true whenever
    // `window.speechSynthesis` merely existed. On a device with no installed
    // voices that stretched every answer to 2.4s / 3.6s and then said nothing:
    // slower drills and silence, strictly worse than the chime alone.
    it("reports itself disabled", () => {
      installSynth([]);
      const { result } = renderHook(() => useSpokenFeedback());
      expect(result.current.enabled).toBe(false);
    });

    it("does not hold feedback on screen for narration that will not happen", () => {
      installSynth([]);
      const { result } = renderHook(() => useSpokenFeedback());
      expect(result.current.enabled).toBe(false);
      // Callers use `enabled` to choose the delay, so a disabled hook must
      // leave them on the silent timings.
      expect(ADVANCE_DELAY_MS.correct).toBeLessThan(SPOKEN_ADVANCE_DELAY_MS.correct);
    });

    it("stays silent", () => {
      const { speak } = installSynth([]);
      const { result } = renderHook(() => useSpokenFeedback());
      act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
      act(() => void vi.advanceTimersByTime(1000));
      expect(speak).not.toHaveBeenCalled();
    });
  });

  it("becomes available when the browser finishes loading voices", () => {
    // Chrome reports an empty voice list on first paint and fills it in later.
    // Reading it once would leave the feature permanently off on a cold load.
    const voices: Array<{ lang: string; name: string }> = [];
    const { synth } = installSynth(voices);
    const { result } = renderHook(() => useSpokenFeedback());
    expect(result.current.enabled).toBe(false);

    voices.push(...EN_VOICE);
    act(() => (synth as unknown as { fire: (t: string) => void }).fire("voiceschanged"));

    expect(result.current.enabled).toBe(true);
  });

  it("says nothing when the learner has switched it off", () => {
    spokenFeedbackPref = false;
    const { speak } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    expect(result.current.enabled).toBe(false);
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(1000));
    expect(speak).not.toHaveBeenCalled();
  });

  it("drops a pending sentence when the next answer lands first", () => {
    const { speak } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Mirror" }));
    act(() => void vi.advanceTimersByTime(200));

    expect(speak).toHaveBeenCalledTimes(1);
    expect(speak.mock.calls[0][0].text).toMatch(/mirror/);
  });

  it("silences an utterance already in flight on cancel", () => {
    const { cancel } = installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    act(() => void vi.advanceTimersByTime(200));
    cancel.mockClear();

    act(() => result.current.cancel());
    expect(cancel).toHaveBeenCalled();
  });

  it("does not talk over the next screen after unmount", () => {
    const { speak } = installSynth(EN_VOICE);
    const { result, unmount } = renderHook(() => useSpokenFeedback());

    act(() => result.current.speakFeedback({ correct: true, targetLabel: "Faucet" }));
    unmount();
    act(() => void vi.advanceTimersByTime(1000));

    expect(speak).not.toHaveBeenCalled();
  });

  it("holds feedback on screen long enough to finish the sentence", () => {
    installSynth(EN_VOICE);
    const { result } = renderHook(() => useSpokenFeedback());
    expect(result.current.delayFor(true)).toBe(SPOKEN_ADVANCE_DELAY_MS.correct);
    expect(result.current.delayFor(false)).toBe(SPOKEN_ADVANCE_DELAY_MS.incorrect);
    expect(result.current.delayFor(true)).toBeGreaterThan(ADVANCE_DELAY_MS.correct);
  });
});
