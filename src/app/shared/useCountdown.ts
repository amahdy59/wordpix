import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Seconds of warning before expiry during which extending must be possible.
 * WCAG 2.2.1 requires at least 20 seconds.
 */
export const WARNING_THRESHOLD_SECONDS = 20;

/** Seconds added per extension. WCAG 2.2.1 allows at least ten extensions. */
export const EXTENSION_SECONDS = 30;
export const MAX_EXTENSIONS = 10;

export interface CountdownState {
  /** Whole seconds left. */
  remaining: number;
  isRunning: boolean;
  isPaused: boolean;
  hasExpired: boolean;
  /** True once inside the warning window, while extension is still possible. */
  isWarning: boolean;
  extensionsUsed: number;
  canExtend: boolean;
  start: () => void;
  pause: () => void;
  resume: () => void;
  extend: () => void;
  reset: () => void;
}

interface Options {
  /** Starting duration in seconds. */
  seconds: number;
  /**
   * When false the countdown never runs at all — the learner has turned time
   * limits off, which is what satisfies WCAG 2.2.3 (No Timing, AAA).
   */
  enabled?: boolean;
  /** Begin counting as soon as the hook mounts. */
  autoStart?: boolean;
  onExpire?: () => void;
}

/**
 * A pausable, extendable countdown.
 *
 * Deadline-based rather than decrement-based: browsers throttle timers in
 * background tabs, so counting down by one each tick drifts badly. Tracking an
 * absolute deadline and deriving the remainder keeps the clock honest however
 * the interval is throttled.
 *
 * Accessibility contract (WCAG 2.2.1 Timing Adjustable):
 *   - `enabled: false` turns the limit off entirely, before it is encountered.
 *   - `pause` is available at any time.
 *   - `extend` adds 30s, up to ten times, and stays available throughout the
 *     20-second warning window.
 */
export function useCountdown({
  seconds,
  enabled = true,
  autoStart = false,
  onExpire,
}: Options): CountdownState {
  const [rawRemaining, setRemaining] = useState(seconds);
  const [rawRunning, setIsRunning] = useState(autoStart && enabled);
  const [rawPaused, setIsPaused] = useState(false);
  const [extensionsUsed, setExtensionsUsed] = useState(0);

  const deadlineRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);
  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  /*
    Turning time limits off must release the learner immediately, including
    mid-exercise. That is derived here rather than synced through an effect:
    an effect that calls setState when `enabled` flips causes a cascading
    render, and leaves a frame in which the timer is off but still reads as
    running. Deriving means there is no such frame.
  */
  const remaining = enabled ? rawRemaining : seconds;
  const isRunning = enabled && rawRunning;
  const isPaused = enabled && rawPaused;
  const hasExpired = enabled && rawRemaining <= 0;

  const start = useCallback(() => {
    if (!enabled) return;
    deadlineRef.current = Date.now() + remaining * 1000;
    setIsPaused(false);
    setIsRunning(true);
  }, [enabled, remaining]);

  const pause = useCallback(() => {
    if (deadlineRef.current !== null) {
      setRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
    }
    deadlineRef.current = null;
    setIsRunning(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!enabled) return;
    deadlineRef.current = Date.now() + remaining * 1000;
    setIsPaused(false);
    setIsRunning(true);
  }, [enabled, remaining]);

  const extend = useCallback(() => {
    setExtensionsUsed((used) => {
      if (used >= MAX_EXTENSIONS) return used;
      if (deadlineRef.current !== null) {
        deadlineRef.current += EXTENSION_SECONDS * 1000;
        setRemaining(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
      } else {
        setRemaining((r) => r + EXTENSION_SECONDS);
      }
      return used + 1;
    });
  }, []);

  const reset = useCallback(() => {
    deadlineRef.current = null;
    setRemaining(seconds);
    setExtensionsUsed(0);
    setIsPaused(false);
    setIsRunning(false);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning || !enabled) return undefined;
    if (deadlineRef.current === null) deadlineRef.current = Date.now() + remaining * 1000;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (deadline === null) return;
      const left = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        deadlineRef.current = null;
        setIsRunning(false);
        onExpireRef.current?.();
      }
    };

    // 250ms so the displayed second changes promptly after a pause or extend,
    // without the cost of a rAF loop.
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
    // `remaining` is deliberately excluded: it changes every tick, and the
    // deadline ref already carries the authoritative value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, enabled]);

  return {
    remaining,
    isRunning,
    isPaused,
    hasExpired,
    isWarning: isRunning && remaining > 0 && remaining <= WARNING_THRESHOLD_SECONDS,
    extensionsUsed,
    canExtend: enabled && extensionsUsed < MAX_EXTENSIONS,
    start,
    pause,
    resume,
    extend,
    reset,
  };
}
