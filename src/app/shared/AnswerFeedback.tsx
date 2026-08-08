import { memo } from "react";
import { CheckCircle2, XCircle, ArrowRight, Sparkles, Flame } from "lucide-react";
import { XP_RULES } from "../../features/gamification/xp";

interface Props {
  /** null while the learner is still choosing. */
  result: "correct" | "incorrect" | null;
  /** The word the question was about. */
  wordLabel: string;
  /** One line explaining the answer. Shown for both outcomes. */
  explanation: string;
  streakCount?: number;
  /**
   * When false the drill will not move on by itself, so a Continue control is
   * rendered instead.
   */
  autoAdvancing: boolean;
  onContinue: () => void;
}

/**
 * Inline result banner shown under an exercise.
 *
 * This replaces a full-screen `alertdialog` that appeared after *every* answer
 * and had to be dismissed before the next question would load — two clicks per
 * item, and a modal covering the picture the learner was meant to be learning
 * from. Feedback belongs next to the thing it is about, not on top of it.
 *
 * It keeps a live region so the outcome still reaches a screen reader, which is
 * the one thing the modal genuinely did well: `role="status"` announces without
 * stealing focus, so the flow is not interrupted for keyboard users either.
 */
export const AnswerFeedback = memo(function AnswerFeedback({
  result,
  wordLabel,
  explanation,
  streakCount,
  autoAdvancing,
  onContinue,
}: Props) {
  const isCorrect = result === "correct";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      // Reserves its own height so the options above do not jump when feedback
      // appears — a layout shift under the pointer is how mis-taps happen.
      className="min-h-[76px] w-full flex items-center"
    >
      {result && (
        <div
          className={`w-full rounded-2xl border-2 px-4 py-3 flex items-center gap-3.5 shadow-wp-xs motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 ${
            isCorrect
              ? "border-wp-green bg-wp-green-light/40"
              : "border-wp-rose bg-wp-rose-light/40"
          }`}
        >
          <div
            aria-hidden
            className={`size-10 rounded-full flex items-center justify-center shrink-0 ${
              isCorrect ? "bg-wp-green text-wp-text-on-green" : "bg-wp-rose text-wp-text-on-rose"
            }`}
          >
            {isCorrect ? <CheckCircle2 className="size-6" /> : <XCircle className="size-6" />}
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-sans font-black text-foreground text-base leading-tight">
                {isCorrect ? "Correct" : wordLabel}
              </span>
              {isCorrect && (
                <span className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-wp-amber bg-wp-amber/10 px-2 py-0.5 rounded-full border border-wp-amber/20">
                  <Sparkles className="size-3" aria-hidden />
                  +{XP_RULES.PER_CORRECT_ANSWER} XP
                  {streakCount && streakCount > 1 ? (
                    <span className="flex items-center gap-0.5 border-s border-wp-amber/30 ps-1.5 ms-0.5">
                      <Flame className="size-3" aria-hidden />
                      {streakCount}
                    </span>
                  ) : null}
                </span>
              )}
            </div>
            <p className="font-sans text-sm text-muted-foreground font-medium leading-snug">
              {explanation}
            </p>
          </div>

          {/*
            Only rendered when auto-advance is switched off. When it is on there
            is deliberately no button: the whole point is that the learner never
            has to click to see the next question.

            Deliberately not autofocused either. The answer controls keep their
            focus when a result appears (they are aria-disabled, not disabled),
            so moving focus here would yank it away from where the learner left
            it — the same interruption the old modal caused.
          */}
          {!autoAdvancing && (
            <button
              type="button"
              onClick={onContinue}
              className={`shrink-0 min-h-[44px] px-4 rounded-xl font-sans font-bold text-sm flex items-center gap-1.5 shadow-sm transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 ${
                isCorrect
                  ? "bg-wp-green text-wp-text-on-green focus-visible:outline-wp-green"
                  : "bg-wp-rose text-wp-text-on-rose focus-visible:outline-wp-rose"
              }`}
            >
              <span>Next</span>
              <ArrowRight className="size-4" aria-hidden />
            </button>
          )}
        </div>
      )}
    </div>
  );
});
