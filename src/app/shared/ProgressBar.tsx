import { memo, type ReactNode } from "react";

export type ProgressBarVariant = "default" | "brand" | "success" | "teal" | "amber";
export type ProgressBarSize = "sm" | "md" | "lg";

export interface ProgressBarProps {
  progressPercent: number;
  label?: string;
  labelRight?: ReactNode;
  ariaLabel: string;
  ariaValueText?: string;
  variant?: ProgressBarVariant;
  size?: ProgressBarSize;
  className?: string;
}

const variantFillStyles: Record<ProgressBarVariant, string> = {
  default: "bg-gradient-to-r from-primary to-wp-teal",
  brand: "bg-primary",
  success: "bg-wp-green",
  teal: "bg-wp-teal",
  amber: "bg-wp-amber",
};

const sizeTrackStyles: Record<ProgressBarSize, string> = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

/**
 * Standardized progress bar component adhering to WAI-ARIA progressbar pattern.
 * Fully backward-compatible while offering semantic variants and size tokens.
 */
export const ProgressBar = memo(function ProgressBar({
  progressPercent,
  label,
  labelRight,
  ariaLabel,
  ariaValueText,
  variant = "default",
  size = "md",
  className = "",
}: ProgressBarProps) {
  const showLabels = label !== undefined || labelRight !== undefined;
  const clampedPercent = Math.max(0, Math.min(100, progressPercent));

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabels && (
        <div className="flex justify-between items-center text-xs font-sans font-semibold">
          <span className="text-muted-foreground">{label}</span>
          {labelRight && <span className="text-primary font-bold">{labelRight}</span>}
        </div>
      )}
      <div
        className={`bg-muted rounded-full ${sizeTrackStyles[size]} w-full overflow-hidden border border-border`}
        role="progressbar"
        aria-valuenow={clampedPercent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
        aria-valuetext={ariaValueText}
      >
        <div
          className={`${variantFillStyles[variant]} h-full rounded-full transition-all duration-500 motion-reduce:transition-none`}
          style={{ width: `${clampedPercent}%` }}
        />
      </div>
    </div>
  );
});
