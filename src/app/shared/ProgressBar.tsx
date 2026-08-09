import { memo } from "react";

interface Props {
  progressPercent: number;
  label: string;
  labelRight?: React.ReactNode;
  ariaLabel: string;
  className?: string;
}

/**
 * A standardized progress bar component.
 */
export const ProgressBar = memo(function ProgressBar({ progressPercent, label, labelRight, ariaLabel, className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex justify-between items-center text-xs font-sans font-semibold">
        <span className="text-muted-foreground">{label}</span>
        {labelRight && <span className="text-primary font-bold">{labelRight}</span>}
      </div>
      <div
        className="bg-muted rounded-full h-3 w-full overflow-hidden border border-border"
        role="progressbar"
        aria-valuenow={progressPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <div
          className="bg-gradient-to-r from-primary to-wp-teal h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
});
