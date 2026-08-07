import { memo } from "react";
import { BackButton } from "./BackButton";
import { CloseButton } from "./CloseButton";

interface Props {
  title: string;
  /** 0-based current step index */
  step: number;
  /** Total number of exercise steps (default 6) */
  total?: number;
  onBack: () => void;
  onClose: () => void;
}

/**
 * Reusable header for all lesson/exercise screens.
 * Contains back arrow, centred title, ✕ close, and a rose progress bar.
 */
export const LessonHeader = memo(function LessonHeader({
  title,
  step,
  total = 6,
  onBack,
  onClose,
}: Props) {
  const pct = Math.round(((step + 1) / total) * 100);

  return (
    <div className="content-stretch flex flex-col gap-[12px] px-5 py-3 md:px-8 md:py-4 relative shrink-0 w-full">
      <div className="content-stretch flex items-center justify-between relative shrink-0 w-full gap-3">
        <div className="shrink-0">
          <BackButton onClick={onBack} />
        </div>
        <h1 className="font-sans font-semibold leading-[24px] not-italic text-foreground text-[16px] truncate text-center flex-1 min-w-0 px-2">
          {title}
        </h1>
        <div className="shrink-0">
          <CloseButton onClick={onClose} />
        </div>
      </div>

      {/* Progress bar */}
      <div
        role="progressbar"
        aria-label="Lesson progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="bg-muted h-[8px] relative rounded-full shrink-0 w-full overflow-hidden"
      >
        <div
          className="bg-primary h-full rounded-full motion-safe:transition-all motion-safe:duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
});
