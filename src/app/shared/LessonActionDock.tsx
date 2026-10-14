import { memo } from "react";
import { Volume2, ArrowRight } from "lucide-react";

export interface LessonActionDockProps {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  audioLabel?: string;
  onAudio?: () => void;
  isAudioPlaying?: boolean;
  currentStep?: number;
  totalSteps?: number;
  secondaryAction?: React.ReactNode;
}

/**
 * Anchored bottom action bar for active lessons and drills.
 * Protects against keyboard layout shifts and provides an unambiguous primary CTA.
 */
export const LessonActionDock = memo(function LessonActionDock({
  primaryLabel,
  onPrimary,
  disabled = false,
  isLoading = false,
  audioLabel,
  onAudio,
  isAudioPlaying = false,
  currentStep,
  totalSteps,
  secondaryAction,
}: LessonActionDockProps) {
  return (
    <aside
      aria-label="Lesson actions"
      className="sticky bottom-0 inset-x-0 z-30 w-full border-t border-border/80 bg-background/95 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 px-4 sm:px-6 shadow-wp-sm"
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        {/* Left: Audio replay or secondary action */}
        <div className="flex items-center gap-2">
          {onAudio && audioLabel && (
            <button
              type="button"
              onClick={onAudio}
              aria-label={audioLabel}
              title={audioLabel}
              className={`flex size-12 shrink-0 items-center justify-center rounded-2xl border transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isAudioPlaying
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary"
              }`}
            >
              <Volume2 className="size-5" aria-hidden />
            </button>
          )}
          {secondaryAction}
        </div>

        {/* Center: Step indicator if provided */}
        {currentStep !== undefined && totalSteps !== undefined && (
          <div
            role="status"
            className="hidden sm:flex items-center gap-1 font-sans text-sm font-semibold text-muted-foreground"
          >
            <span>{`Step ${currentStep} of ${totalSteps}`}</span>
          </div>
        )}

        {/* Right: Primary action CTA */}
        <div className="flex flex-1 sm:flex-initial items-center justify-end">
          <button
            type="button"
            onClick={onPrimary}
            disabled={disabled || isLoading}
            aria-busy={isLoading}
            className="flex min-h-[48px] w-full sm:w-auto sm:min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 font-sans font-bold text-base text-primary-foreground shadow-wp-xs transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>{primaryLabel}</span>
            <ArrowRight className="size-4 shrink-0 rtl:rotate-180" aria-hidden />
          </button>
        </div>
      </div>
    </aside>
  );
});
