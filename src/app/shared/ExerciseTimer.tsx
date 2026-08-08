import { memo, useEffect, useRef, useState } from "react";
import { Pause, Play, Plus, TimerOff } from "lucide-react";
import type { CountdownState } from "./useCountdown";
import { EXTENSION_SECONDS } from "./useCountdown";

interface Props {
  countdown: CountdownState;
  /** False when the learner has turned time limits off in Settings. */
  enabled: boolean;
  label?: string;
}

function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Milestones worth interrupting a screen reader for. */
const ANNOUNCE_AT = new Set([60, 30, 20, 10, 5]);

/**
 * Countdown display with the controls WCAG 2.2.1 requires.
 *
 * The visible clock is aria-hidden and mirrored through a polite live region
 * that speaks only at milestones. A `role="timer"` element that updates every
 * second makes a screen reader unusable — it re-reads on every tick and the
 * learner can hear nothing else.
 */
export const ExerciseTimer = memo(function ExerciseTimer({
  countdown,
  enabled,
  label = "Time remaining",
}: Props) {
  const { remaining, isRunning, isPaused, isWarning, canExtend, pause, resume, extend } = countdown;
  const [announcement, setAnnouncement] = useState("");
  const lastAnnouncedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !isRunning) return;
    if (ANNOUNCE_AT.has(remaining) && lastAnnouncedRef.current !== remaining) {
      lastAnnouncedRef.current = remaining;
      setAnnouncement(
        remaining <= 20
          ? `${remaining} seconds left. Add ${EXTENSION_SECONDS} seconds, or pause, using the timer controls.`
          : `${remaining} seconds left.`
      );
    }
  }, [remaining, isRunning, enabled]);

  useEffect(() => {
    if (enabled && remaining === 0) setAnnouncement("Time is up.");
  }, [remaining, enabled]);

  if (!enabled) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
        <TimerOff className="size-4 text-muted-foreground shrink-0" aria-hidden />
        <span className="font-sans text-xs font-semibold text-muted-foreground">
          Untimed — take as long as you need
        </span>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 ${
        isWarning ? "border-wp-rose bg-wp-rose/10" : "border-border bg-wp-card"
      }`}
    >
      {/* Polite, milestone-only. A live clock ticking every second would make
          the rest of the exercise impossible to hear. */}
      <p aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </p>

      <span
        aria-hidden
        className={`font-mono text-sm font-bold tabular-nums ${
          isWarning ? "text-wp-rose" : "text-foreground"
        }`}
      >
        {formatClock(remaining)}
      </span>
      <span className="sr-only">
        {label}: {formatClock(remaining)}
      </span>

      <button
        type="button"
        onClick={isPaused || !isRunning ? resume : pause}
        aria-label={isPaused || !isRunning ? "Resume the timer" : "Pause the timer"}
        className="flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-lg border border-border bg-wp-card text-xs font-sans font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isPaused || !isRunning ? (
          <Play className="size-3.5" aria-hidden />
        ) : (
          <Pause className="size-3.5" aria-hidden />
        )}
        <span>{isPaused || !isRunning ? "Resume" : "Pause"}</span>
      </button>

      <button
        type="button"
        onClick={extend}
        disabled={!canExtend}
        aria-label={`Add ${EXTENSION_SECONDS} seconds to the timer`}
        className="flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-lg border border-border bg-wp-card text-xs font-sans font-bold text-foreground hover:bg-muted disabled:opacity-40 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        <span>{EXTENSION_SECONDS}s</span>
      </button>
    </div>
  );
});
