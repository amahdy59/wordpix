import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, render, screen } from "@testing-library/react";
import {
  useCountdown,
  EXTENSION_SECONDS,
  MAX_EXTENSIONS,
  WARNING_THRESHOLD_SECONDS,
} from "../shared/useCountdown";
import { ExerciseTimer } from "../shared/ExerciseTimer";

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

/** Advances both the wall clock and the interval scheduler together. */
function advance(seconds: number) {
  act(() => {
    vi.advanceTimersByTime(seconds * 1000);
  });
}

describe("useCountdown", () => {
  it("starts at the given duration and does not run until started", () => {
    const { result } = renderHook(() => useCountdown({ seconds: 60 }));
    expect(result.current.remaining).toBe(60);
    expect(result.current.isRunning).toBe(false);
  });

  it("counts down while running", () => {
    const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
    advance(10);
    expect(result.current.remaining).toBe(50);
  });

  /**
   * Browsers throttle timers in background tabs, so a decrement-per-tick clock
   * drifts badly. The hook tracks an absolute deadline instead.
   */
  it("stays accurate when ticks are delayed", () => {
    const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
    // One very late tick, as a throttled background tab would produce.
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(result.current.remaining).toBe(30);
  });

  it("fires onExpire exactly once at zero", () => {
    const onExpire = vi.fn();
    renderHook(() => useCountdown({ seconds: 5, autoStart: true, onExpire }));
    advance(10);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  describe("WCAG 2.2.1 — Timing Adjustable", () => {
    it("can be paused, holding the remaining time", () => {
      const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
      advance(10);
      act(() => result.current.pause());

      const held = result.current.remaining;
      advance(20);

      expect(result.current.isPaused).toBe(true);
      expect(result.current.remaining).toBe(held);
    });

    it("resumes from where it was paused", () => {
      const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
      advance(10);
      act(() => result.current.pause());
      advance(30);
      act(() => result.current.resume());
      advance(5);

      expect(result.current.remaining).toBe(45);
    });

    it("extends by 30 seconds", () => {
      const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
      advance(50);
      act(() => result.current.extend());
      expect(result.current.remaining).toBe(10 + EXTENSION_SECONDS);
    });

    it("allows at least ten extensions", () => {
      const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
      for (let i = 0; i < MAX_EXTENSIONS; i += 1) {
        expect(result.current.canExtend).toBe(true);
        act(() => result.current.extend());
      }
      expect(result.current.extensionsUsed).toBe(MAX_EXTENSIONS);
      expect(result.current.canExtend).toBe(false);
    });

    it("warns with at least 20 seconds left, while extending is still possible", () => {
      const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
      advance(39);
      expect(result.current.isWarning).toBe(false);

      advance(1);
      expect(result.current.remaining).toBe(WARNING_THRESHOLD_SECONDS);
      expect(result.current.isWarning).toBe(true);
      expect(result.current.canExtend).toBe(true);
    });
  });

  describe("WCAG 2.2.3 — No Timing", () => {
    /**
     * The learner can turn time limits off entirely, which is what takes this
     * from Level A (adjustable) to AAA (no timing at all).
     */
    it("never runs when disabled", () => {
      const onExpire = vi.fn();
      const { result } = renderHook(() =>
        useCountdown({ seconds: 30, enabled: false, autoStart: true, onExpire })
      );
      advance(120);

      expect(result.current.isRunning).toBe(false);
      expect(result.current.remaining).toBe(30);
      expect(result.current.hasExpired).toBe(false);
      expect(onExpire).not.toHaveBeenCalled();
    });

    it("releases the learner immediately when switched off mid-exercise", () => {
      const { result, rerender } = renderHook(
        ({ enabled }) => useCountdown({ seconds: 60, enabled, autoStart: true }),
        { initialProps: { enabled: true } }
      );
      advance(55);
      expect(result.current.isRunning).toBe(true);

      rerender({ enabled: false });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.isWarning).toBe(false);
      expect(result.current.hasExpired).toBe(false);
    });

    it("cannot expire after being switched off", () => {
      const onExpire = vi.fn();
      const { rerender } = renderHook(
        ({ enabled }) => useCountdown({ seconds: 10, enabled, autoStart: true, onExpire }),
        { initialProps: { enabled: true } }
      );
      rerender({ enabled: false });
      advance(60);
      expect(onExpire).not.toHaveBeenCalled();
    });
  });

  it("resets to the original duration", () => {
    const { result } = renderHook(() => useCountdown({ seconds: 60, autoStart: true }));
    advance(20);
    act(() => result.current.extend());
    act(() => result.current.reset());

    expect(result.current.remaining).toBe(60);
    expect(result.current.extensionsUsed).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });
});

describe("ExerciseTimer", () => {
  function Harness({ enabled = true, seconds = 60 }: { enabled?: boolean; seconds?: number }) {
    const countdown = useCountdown({ seconds, enabled, autoStart: true });
    return <ExerciseTimer countdown={countdown} enabled={enabled} />;
  }

  it("offers pause and extend controls", () => {
    render(<Harness />);
    expect(screen.getByRole("button", { name: /pause the timer/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /add 30 seconds/i })).toBeTruthy();
  });

  it("says the exercise is untimed when limits are off", () => {
    render(<Harness enabled={false} />);
    expect(screen.getByText(/untimed/i)).toBeTruthy();
    expect(screen.queryByRole("button", { name: /pause/i })).toBeNull();
  });

  /**
   * A role="timer" that updates every second re-reads on every tick and makes
   * the rest of the exercise impossible to hear. The visible clock is
   * aria-hidden; announcements are polite and milestone-only.
   */
  it("does not announce every tick", () => {
    // 47 is deliberately not a milestone; ticking down to 42 must stay silent.
    const { container } = render(<Harness seconds={47} />);
    const live = container.querySelector('[aria-live="polite"]');
    expect(live).not.toBeNull();
    expect(live?.textContent).toBe("");

    advance(5);
    expect(live?.textContent).toBe("");
  });

  it("announces at milestones, and offers more time inside the warning window", () => {
    const { container } = render(<Harness seconds={35} />);
    const live = container.querySelector('[aria-live="polite"]');

    advance(5);
    expect(live?.textContent).toContain("30 seconds left");

    advance(10);
    expect(live?.textContent).toContain("20 seconds left");
    expect(live?.textContent).toMatch(/add 30 seconds/i);
  });

  it("exposes the remaining time to screen readers without the ticking clock", () => {
    render(<Harness seconds={90} />);
    expect(screen.getByText(/time remaining: 1:30/i)).toBeTruthy();
  });
});
