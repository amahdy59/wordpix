import type { ReactNode } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { useI18n } from "../context/I18nContext";
import { ChoiceOptionGroup, type ChoiceOption } from "./ChoiceOptionGroup";
import { playCorrectSound, playIncorrectSound } from "./useSound";
import { answerLayout } from "./answerLayout";

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
      className="rounded-2xl border border-border bg-card"
      aria-labelledby={headingId}
    >
      <div
        className={`p-4 sm:p-5 ${media ? "grid items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(12rem,30%)]" : ""}`}
      >
        <div className="contents">
          <div className="flex items-start gap-3 md:col-start-1">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-black text-primary">
              {index + 1}
            </span>
            <h3
              id={headingId}
              className="pt-1 text-base font-black leading-6 text-foreground sm:text-lg"
            >
              {question}
            </h3>
          </div>

          <ChoiceOptionGroup
            className={`md:col-start-1 md:row-start-2 mt-3 sm:mt-5 ${
              options.every((option) => !option.secondary && option.accessibleLabel.length <= 18)
                ? answerLayout(options.map((option) => option.accessibleLabel))
                : `grid gap-2 ${optionColumns === "two" ? "sm:grid-cols-2" : ""}`
            }`}
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
        {media && (
          <div className="row-start-2 min-w-0 self-start md:col-start-2 md:row-start-1 md:row-span-2">
            {media}
          </div>
        )}
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
