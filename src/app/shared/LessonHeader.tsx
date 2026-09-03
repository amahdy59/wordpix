import { memo } from "react";
import { BackButton } from "./BackButton";
import { CloseButton } from "./CloseButton";

interface Props {
  title: string;
  /**
   * Optional one-line subtitle rendered between the title row and progress bar.
   * Use for group name + question count so individual exercises don't need their own header row.
   */
  subtitle?: React.ReactNode;
  /**
   * 1-based position in the flow, e.g. 3 for "step 3 of 9".
   *
   * This was previously `step`, documented as a 0-based index but passed
   * 1-based by all 35 suite screens. The result was `step={9} total={9}` ->
   * aria-valuenow=111 against aria-valuemax=100, and every suite opening at
   * 22% instead of 11%. Renamed so the compiler forces each call site to be
   * re-read rather than silently inheriting the wrong convention.
   */
  current: number;
  /** Total number of steps in the flow (default 6) */
  total?: number;
  /** Noun announced for this progress value. */
  progressLabel?: string;
  onBack: () => void;
  onClose: () => void;
}

/**
 * Reusable header for all lesson/exercise screens.
 * Contains back arrow, centred title, ✕ close, and a progress bar.
 */
export const LessonHeader = memo(function LessonHeader({
  title,
  subtitle,
  current,
  total = 6,
  progressLabel = "Step",
  onBack,
  onClose,
}: Props) {
  const safeTotal = Math.max(1, total);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const pct = Math.round((safeCurrent / safeTotal) * 100);

  return (
    // A `header`, not a `div`. The exercise screens do not go through AppShell,
    // so this row — the title, the back and close buttons, and the progress
    // bar — was the only content on the page outside any landmark, which axe
    // flags and which leaves a screen-reader user unable to jump to it.
    <header
      aria-label="Lesson"
      className="content-stretch flex flex-col gap-[8px] px-5 py-3 md:px-8 md:py-4 relative shrink-0 w-full"
    >
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-3">
        <div className="shrink-0">
          <BackButton onClick={onBack} />
        </div>
        <h1 className="wp-type-body-emphasis truncate text-center flex-1 min-w-0 px-2">{title}</h1>
        <div className="shrink-0">
          <CloseButton onClick={onClose} />
        </div>
      </div>

      {/* Optional subtitle row — group name + question/sentence counter */}
      {subtitle && (
        <div className="flex items-center justify-between text-xs font-sans font-bold text-muted-foreground px-1">
          {subtitle}
        </div>
      )}

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label={`${progressLabel} progress`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${progressLabel} ${safeCurrent} of ${safeTotal}`}
        className="bg-primary/20 h-[8px] relative rounded-full shrink-0 w-full overflow-hidden"
      >
        <div
          className="bg-primary h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </header>
  );
});
