import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";
import { WordImage } from "./WordImage";
import { useI18n } from "../context/I18nContext";
import type { VocabularyItem } from "../data/lessons";

export interface ImageChoiceCardProps {
  option: VocabularyItem;
  index: number;
  totalOptions: number;
  isSelected: boolean;
  feedback: "correct" | "incorrect" | null;
  isRevealedAnswer?: boolean;
  disabled?: boolean;
  onClick: () => void;
  reduceMotion?: boolean;
  showShortcut?: boolean;
  ariaLabel?: string;
  className?: string;
}

/**
 * Reusable full-image choice card for recognition and recall exercises.
 * Preserves essential learning clues, hides inactive shortcuts on touch,
 * and renders a solid-surface feedback overlay that satisfies WCAG AAA (7:1) contrast.
 */
export const ImageChoiceCard = memo(function ImageChoiceCard({
  option,
  index,
  totalOptions,
  isSelected,
  feedback,
  isRevealedAnswer = false,
  disabled = false,
  onClick,
  reduceMotion = false,
  showShortcut = false,
  ariaLabel,
  className = "",
}: ImageChoiceCardProps) {
  const { t } = useI18n();

  let borderStyle = "border-border hover:border-primary/60";
  if (isSelected && feedback === "correct") {
    borderStyle = "border-feedback-success-border bg-feedback-success-surface/30";
  } else if (isSelected && feedback === "incorrect") {
    borderStyle = "border-feedback-error-border bg-feedback-error-surface/30";
  } else if (isRevealedAnswer) {
    borderStyle = "border-feedback-success-border bg-feedback-success-surface/30";
  }

  const showCorrectOverlay = isSelected && feedback === "correct";
  const showIncorrectOverlay = isSelected && feedback === "incorrect";

  const defaultAriaLabel =
    ariaLabel ??
    `Option ${index + 1} of ${totalOptions}.${
      showShortcut ? ` Shortcut: press ${index + 1}.` : ""
    } ${option.description || option.label}`;

  return (
    <motion.button
      type="button"
      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 17 }}
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      aria-label={defaultAriaLabel}
      aria-pressed={isSelected}
      aria-disabled={disabled || feedback !== null}
      onClick={() => {
        if (!disabled && feedback === null) onClick();
      }}
      className={`group relative flex flex-col min-h-[44px] h-full w-full overflow-hidden rounded-2xl border-2 shadow-wp-sm transition-colors duration-200 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary sm:rounded-3xl ${borderStyle} ${className}`}
    >
      {/* Option / Keyboard shortcut badge — only rendered when shortcuts are active */}
      {showShortcut && (
        <span
          aria-hidden
          className="absolute top-2 start-2 z-10 size-8 sm:size-9 md:size-11 flex items-center justify-center bg-wp-card text-foreground text-sm sm:text-base font-bold rounded-lg border border-border shadow-sm pointer-events-none"
        >
          {index + 1}
        </span>
      )}

      {/* Image Container with full-bleed cover presentation */}
      <div className="size-full relative bg-muted overflow-hidden flex-1">
        <WordImage
          word={option}
          altMode="assessment"
          optionIndex={index}
          checked={isSelected || isRevealedAnswer}
          className="relative z-0 size-full object-cover object-center block"
          loading="eager"
        />
      </div>

      {/* Feedback overlay with solid surface guaranteeing WCAG AAA 7:1 contrast */}
      <AnimatePresence>
        {(showCorrectOverlay || showIncorrectOverlay) && (
          <motion.div
            key={`overlay-${option.id}`}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.18 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-3 pointer-events-none bg-background/80 backdrop-blur-xs"
          >
            <motion.div
              initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 450, damping: 20, delay: 0.05 }
              }
              className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border-2 px-4 py-2.5 shadow-xl text-center ${
                showIncorrectOverlay
                  ? "bg-feedback-error-surface border-feedback-error-border text-feedback-error-foreground"
                  : "bg-feedback-success-surface border-feedback-success-border text-feedback-success-foreground"
              }`}
            >
              {showIncorrectOverlay ? (
                <>
                  <XCircle
                    className="size-8 sm:size-10 shrink-0 text-feedback-error-foreground"
                    aria-hidden
                  />
                  <span className="font-sans font-bold text-sm sm:text-base leading-snug">
                    {t("exercise.notQuiteTitle")}
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2
                    className="size-8 sm:size-10 shrink-0 text-feedback-success-foreground"
                    aria-hidden
                  />
                  <span className="font-sans font-bold text-sm sm:text-base leading-snug">
                    {t("exercise.correctTitle")}
                  </span>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
});
