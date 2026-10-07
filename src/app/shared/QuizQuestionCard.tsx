import type { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "../context/I18nContext";
import { ChoiceOptionGroup, type ChoiceOption } from "./ChoiceOptionGroup";
import { playCorrectSound, playIncorrectSound } from "./useSound";

interface Props<T extends string> {
  id: string;
  index: number;
  question: ReactNode;
  options: readonly ChoiceOption<T>[];
  value?: T;
  correctValue: T;
  onChange: (value: T) => void;
  feedback?: ReactNode;
  media?: ReactNode;
  optionColumns?: "one" | "two";
}

export function QuizQuestionCard<T extends string>({
  id,
  index,
  question,
  options,
  value,
  correctValue,
  onChange,
  feedback,
  media,
  optionColumns = "one",
}: Props<T>) {
  const { t } = useI18n();
  const answered = value !== undefined;
  const correct = value === correctValue;
  const headingId = `quiz-question-${id.replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  return (
    <article
      data-quiz-question
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs"
      aria-labelledby={headingId}
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-black text-primary">
            {index + 1}
          </span>
          <h3
            id={headingId}
            className="pt-1 text-base font-black leading-6 text-foreground sm:text-lg"
          >
            {question}
          </h3>
        </div>

        {media && <div className="mt-5">{media}</div>}

        <ChoiceOptionGroup
          className={`mt-5 grid gap-3 ${optionColumns === "two" ? "sm:grid-cols-2" : ""}`}
          label={typeof question === "string" ? question : t("help.chooseAnswer")}
          options={options}
          value={value}
          onChange={(val) => {
            if (val === correctValue) {
              playCorrectSound();
            } else {
              playIncorrectSound();
            }
            onChange(val);
          }}
          disabled={answered}
          correctValue={correctValue}
          revealFeedback={answered}
        />
      </div>

      {answered && (
        <div
          role="status"
          aria-live="polite"
          className={`flex flex-wrap gap-3 border-t px-5 py-4 text-sm font-semibold leading-6 sm:px-6 ${
            correct
              ? "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground"
              : "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground"
          }`}
        >
          {correct ? (
            <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden />
          ) : (
            <XCircle className="mt-0.5 size-5 shrink-0" aria-hidden />
          )}
          <p>
            <span className="font-black">
              {correct ? t("practice.correct") : t("practice.notYet")}
            </span>
          </p>
          {feedback && <div className="w-full text-sm leading-relaxed">{feedback}</div>}
        </div>
      )}
    </article>
  );
}
