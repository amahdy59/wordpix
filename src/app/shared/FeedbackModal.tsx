import { memo } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, Sparkles, Flame } from "lucide-react";
import { XP_RULES } from "../../features/gamification/xp";
import { useModalA11y } from "./useModalA11y";

interface Props {
  isOpen: boolean;
  isCorrect: boolean;
  title?: string;
  explanation?: string;
  wordLabel?: string;
  xpBonus?: number;
  streakCount?: number;
  onContinue: () => void;
  onTryAgain?: () => void;
}

export const FeedbackModal = memo(function FeedbackModal({
  isOpen,
  isCorrect,
  title,
  explanation,
  wordLabel,
  // Single source of truth: this must match what LearnerContext actually
  // credits per correct attempt, or the running XP total will not add up.
  xpBonus = XP_RULES.PER_CORRECT_ANSWER,
  streakCount,
  onContinue,
  onTryAgain,
}: Props) {
  // Dismissing means acknowledging the result, which is what both buttons do.
  const containerRef = useModalA11y({ isOpen, onDismiss: isCorrect ? onContinue : onTryAgain ?? onContinue });

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-200">
      <div
        ref={containerRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        aria-describedby={explanation ? "feedback-explanation" : undefined}
        tabIndex={-1}
        className={`w-full max-w-md rounded-3xl border-2 p-6 sm:p-7 shadow-2xl flex flex-col gap-5 items-center text-center motion-safe:animate-in motion-safe:zoom-in-95 motion-safe:duration-200 bg-wp-card outline-none ${
          isCorrect ? "border-wp-green shadow-wp-green/20" : "border-wp-rose shadow-wp-rose/20"
        }`}
      >
        {/* Status Icon Header */}
        <div
          aria-hidden
          className={`size-16 sm:size-20 rounded-full flex items-center justify-center shadow-lg ${
            isCorrect ? "bg-wp-green text-wp-text-on-green" : "bg-wp-rose text-wp-text-on-rose"
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="size-10 sm:size-12 motion-safe:animate-bounce" />
          ) : (
            <XCircle className="size-10 sm:size-12 motion-safe:animate-wp-shake" />
          )}
        </div>

        {/* Title & XP Badge */}
        <div className="flex flex-col items-center gap-1.5">
          {isCorrect && (
            <div className="flex items-center gap-2 bg-wp-amber/10 text-wp-amber px-3 py-1 rounded-full border border-wp-amber/20 text-xs font-sans font-bold shadow-xs">
              <Sparkles className="size-3.5" aria-hidden />
              <span>+{xpBonus} XP Earned</span>
              {streakCount && streakCount > 1 && (
                <span className="flex items-center gap-1 text-wp-amber border-s border-wp-amber/30 ps-2">
                  <Flame className="size-3" aria-hidden />
                  {streakCount} Streak!
                </span>
              )}
            </div>
          )}

          <h2 id="feedback-title" className="font-sans font-black text-foreground text-2xl sm:text-3xl leading-tight mt-1">
            {title || (isCorrect ? "Excellent!" : "Not Quite")}
          </h2>

          {wordLabel && (
            <p className="font-sans text-xs font-bold text-primary bg-secondary px-3 py-0.5 rounded-full border border-primary/20">
              Word: {wordLabel}
            </p>
          )}

          {explanation && (
            <p
              id="feedback-explanation"
              className="font-sans text-sm sm:text-base text-muted-foreground font-medium max-w-sm mt-1 leading-relaxed"
            >
              {explanation}
            </p>
          )}
        </div>

        {/* Primary Action Button */}
        <div className="w-full pt-2">
          {isCorrect ? (
            <button
              type="button"
              onClick={onContinue}
              className="w-full py-4 px-6 min-h-[44px] rounded-2xl bg-wp-green text-wp-text-on-green font-sans font-black text-base sm:text-lg shadow-lg hover:bg-wp-green/90 transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-green"
            >
              <span>Continue</span>
              <ArrowRight className="size-5" aria-hidden />
            </button>
          ) : (
            <button
              type="button"
              onClick={onTryAgain || onContinue}
              className="w-full py-4 px-6 min-h-[44px] rounded-2xl bg-wp-rose text-wp-text-on-rose font-sans font-black text-base sm:text-lg shadow-lg hover:bg-wp-rose/90 transition-all flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-wp-rose"
            >
              <RotateCcw className="size-5" aria-hidden />
              <span>Try Again</span>
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});
