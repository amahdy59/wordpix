import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, Check, HelpCircle } from "lucide-react";
import type { SessionPhase } from "./types";
import { useI18n } from "../../../context/I18nContext";
import { formatNumber } from "../../../shared/useAccessibilityPreferences";
import { useLearner } from "../../../context/LearnerContext";

interface Props {
  itemId: string;
  question: React.ReactNode;
  options: string[];
  correctIndex: number;
  phase: SessionPhase;
  onAnswerCorrect: (pickedIndex: number) => void;
  onAnswerWrong: (pickedIndex: number) => void;
  onGiveUp: () => void;
  onRetry: () => void;
}

export function MultipleChoiceQuiz({
  itemId,
  question,
  options,
  correctIndex,
  phase,
  onAnswerCorrect,
  onAnswerWrong,
  onGiveUp,
  onRetry,
}: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const { numeralSystem, reduceMotion } = learnerState.accessibility;

  // Local pick state (what the user clicked) — separate from session phase
  const [localPick, setLocalPick] = useState<number | null>(null);

  // Reset when moving to a new item
  const prevId = useRef(itemId);
  useEffect(() => {
    if (prevId.current !== itemId) {
      prevId.current = itemId;
      setLocalPick(null);
    }
  }, [itemId]);

  const isAnswered =
    phase === "answered_correct" || phase === "answered_wrong" || phase === "gave_up";

  const isInRetry = phase === "retrying";

  const handlePick = useCallback(
    (i: number) => {
      // Accept picks only in idle or retrying states
      if (phase !== "idle" && phase !== "retrying") return;
      setLocalPick(i);
      if (i === correctIndex) {
        onAnswerCorrect(i);
      } else {
        onAnswerWrong(i);
      }
    },
    [phase, correctIndex, onAnswerCorrect, onAnswerWrong]
  );

  // Number-key shortcuts (1–4) scoped to this exercise
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable)
      )
        return;
      if (!/^[1-9]$/.test(e.key)) return;
      const index = Number(e.key) - 1;
      if (index < options.length) {
        e.preventDefault();
        handlePick(index);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [options.length, handlePick]);

  const questionId = `question-label-${itemId}`;

  return (
    <div
      className={`rounded-3xl border border-border p-6 sm:p-7 bg-card shadow-xs h-full flex flex-col justify-center ${
        reduceMotion ? "" : "animate-in fade-in duration-200"
      }`}
    >
      {/* Question — English learning content always carries explicit lang+dir */}
      <div
        id={questionId}
        className="mb-6 font-extrabold text-lg sm:text-xl text-foreground leading-relaxed"
        lang="en"
        dir="ltr"
      >
        {question}
      </div>

      {/* Answer choices — grouped for screen readers */}
      <div role="group" aria-labelledby={questionId} className="grid gap-3">
        {options.map((opt, i) => {
          const isPickedCorrect = phase === "answered_correct" && localPick === i;
          const isPickedWrong = phase === "answered_wrong" && localPick === i;
          const isRevealedCorrect =
            (phase === "answered_wrong" || phase === "gave_up") && i === correctIndex;

          const visualState: "correct" | "wrong" | "neutral" =
            isPickedCorrect || isRevealedCorrect ? "correct" : isPickedWrong ? "wrong" : "neutral";

          // aria-disabled: preserves focus, prevents activation — correct a11y pattern
          const isDisabled = isAnswered && !isInRetry;

          return (
            <button
              key={i}
              type="button"
              aria-disabled={isDisabled ? "true" : undefined}
              onClick={() => !isDisabled && handlePick(i)}
              className={`w-full text-start p-4 rounded-2xl border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary text-sm sm:text-base min-h-[56px] ${
                visualState === "correct"
                  ? "border-wp-green bg-wp-green-light/10 text-wp-green font-bold shadow-xs"
                  : visualState === "wrong"
                    ? "border-destructive/40 bg-destructive/5 text-destructive font-semibold"
                    : isDisabled
                      ? "border-border opacity-60 font-medium cursor-default"
                      : "border-border hover:border-primary/50 hover:bg-secondary/40 font-medium active:scale-[0.99]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`size-6 rounded-full border flex items-center justify-center shrink-0 text-xs font-bold ${
                    visualState === "correct"
                      ? "border-wp-green bg-wp-green text-white"
                      : visualState === "wrong"
                        ? "border-destructive/40 bg-destructive/10 text-destructive"
                        : "border-border text-muted-foreground bg-secondary/50"
                  }`}
                >
                  {visualState === "correct" ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : visualState === "wrong" ? (
                    <XCircle className="size-3.5" />
                  ) : (
                    formatNumber(i + 1, numeralSystem)
                  )}
                </div>
                {/* English vocabulary options always carry lang/dir */}
                <span className="flex-1" lang="en" dir="ltr">
                  {opt}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Feedback text — live region contains only text, NOT interactive controls */}
      {isAnswered && (
        <div role="status" aria-live="polite" aria-atomic="true" className="mt-4">
          {phase === "answered_correct" ? (
            <p className="text-sm font-bold text-wp-green flex items-center gap-2 bg-wp-green-light/20 p-3 rounded-xl border border-wp-green/30">
              <CheckCircle2 className="size-5 shrink-0" aria-hidden />
              {t("practice.correct")}
            </p>
          ) : (
            <div className="p-3 rounded-xl bg-secondary/30 border border-border text-sm">
              <p className="font-semibold text-foreground mb-0.5">{t("practice.notYet")}</p>
              <p className="text-muted-foreground">
                {t("practice.correctAnswer", { answer: options[correctIndex] })}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Try Again — interactive control OUTSIDE the live region */}
      {(phase === "answered_wrong" || phase === "gave_up") && (
        <div className="mt-3">
          <button
            type="button"
            onClick={onRetry}
            className="px-3.5 py-1.5 border border-primary/50 text-primary rounded-xl text-xs hover:bg-primary/10 transition-colors min-h-[44px] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {t("practice.tryAgain")}
          </button>
        </div>
      )}

      {/* I don't know — only available before answering */}
      {phase === "idle" && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onGiveUp}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
          >
            <HelpCircle className="size-4" aria-hidden />
            <span>{t("practice.iDontKnow")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
