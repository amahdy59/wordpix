import { memo, useEffect, useRef, useState } from "react";
import { Pause, Play, Plus, TimerOff } from "lucide-react";
import { useI18n } from "../context/I18nContext";
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
 * so screen readers hear milestones rather than an update every second.
 * Extends the timer by a configurable block with a visible countdown.
 */
export const ExerciseTimer = memo(function ExerciseTimer({
  countdown,
  enabled,
  label = "Time remaining",
}: Props) {
  const { t } = useI18n();
  const { remaining, isRunning, isPaused, isWarning, pause, resume, extend, canExtend } = countdown;

  const [announcement, setAnnouncement] = useState("");
  const lastAnnounced = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || !isRunning || isPaused) return;
    if (ANNOUNCE_AT.has(remaining) && lastAnnounced.current !== remaining) {
      lastAnnounced.current = remaining;
      setAnnouncement(
        remaining <= 20
          ? t("timer.warningAnnouncement", { seconds: remaining, extension: EXTENSION_SECONDS })
          : t("timer.secondsLeft", { seconds: remaining })
      );
    }
  }, [remaining, enabled, isRunning, isPaused, t]);

  useEffect(() => {
    if (enabled && remaining === 0) setAnnouncement(t("timer.timeIsUp"));
  }, [remaining, enabled, t]);

  if (!enabled) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-muted px-3 py-2">
        <TimerOff className="size-4 text-muted-foreground shrink-0" aria-hidden />
        <span className="font-sans text-xs font-semibold text-muted-foreground">
          {t("timer.untimed")}
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
        aria-label={isPaused || !isRunning ? t("timer.resumeAria") : t("timer.pauseAria")}
        className="flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-lg border border-border bg-wp-card text-xs font-sans font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {isPaused || !isRunning ? (
          <Play className="size-3.5" aria-hidden />
        ) : (
          <Pause className="size-3.5" aria-hidden />
        )}
        <span>{isPaused || !isRunning ? t("timer.resume") : t("timer.pause")}</span>
      </button>

      <button
        type="button"
        onClick={extend}
        disabled={!canExtend}
        aria-label={t("timer.addSecondsAria", { seconds: EXTENSION_SECONDS })}
        className="flex items-center gap-1.5 min-h-[44px] px-2.5 rounded-lg border border-border bg-wp-card text-xs font-sans font-bold text-foreground hover:bg-muted disabled:opacity-40 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Plus className="size-3.5" aria-hidden />
        <span>{`${EXTENSION_SECONDS}s`}</span>
      </button>
    </div>
  );
});
