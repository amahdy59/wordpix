import { useCallback, useEffect, useRef, useState } from "react";

/**
 * How long feedback stays on screen before the drill moves on by itself.
 *
 * A correct answer needs only long enough to register as a success. A wrong one
 * has to be readable: the learner has to see which answer was right, and that
 * is the whole reason the delay is not the same for both.
 */
export const ADVANCE_DELAY_MS = {
  correct: 900,
  incorrect: 2200,
} as const;

interface Options {
  /**
   * When false, nothing is scheduled and the caller is expected to render a
   * Continue control instead.
   *
   * This is what keeps the auto-advancing flow compliant with WCAG 2.2.1
   * (Timing Adjustable): the moving-on is a time limit on reading the feedback,
   * so it has to be possible to turn off before it is ever met.
   */
  enabled: boolean;
  onAdvance: () => void;
}

export interface AutoAdvance {
  /** Schedules the advance. Calling again replaces any pending one. */
  schedule: (delayMs: number) => void;
  /** Cancels a pending advance — e.g. the learner pressed Continue first. */
  cancel: () => void;
  /** True while an advance is pending, for progress affordances. */
  isPending: boolean;
}

export function useAutoAdvance({ enabled, onAdvance }: Options): AutoAdvance {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Held in a ref so a re-created callback does not restart a running timer,
  // which would silently extend the delay every time the parent re-rendered.
  const onAdvanceRef = useRef(onAdvance);
  const enabledRef = useRef(enabled);
  useEffect(() => {
    onAdvanceRef.current = onAdvance;
    enabledRef.current = enabled;
  }, [onAdvance, enabled]);

  const cancel = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPending(false);
  }, []);

  const schedule = useCallback((delayMs: number) => {
    if (!enabledRef.current) return;
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    setIsPending(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setIsPending(false);
      if (enabledRef.current) onAdvanceRef.current();
    }, delayMs);
  }, []);

  // Cancel on preference changes as well as unmount, before a stale timer can fire.
  useEffect(() => cancel, [enabled, cancel]);

  return { schedule, cancel, isPending };
}
