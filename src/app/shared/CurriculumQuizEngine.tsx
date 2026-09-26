import { useState, useId, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, RotateCcw, Trophy, ArrowLeft, ArrowRight } from "lucide-react";
import { useI18n } from "../../i18n";
import { ChoiceOptionGroup, type ChoiceOption } from "./ChoiceOptionGroup";

// ─── Public Types ────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  stem: string;
  options?: readonly ChoiceOption<string>[];
  correctValue: string;
  /** Shown immediately after the learner answers. */
  explanation?: string;
  /** Optional image/media rendered above the options. */
  media?: React.ReactNode;
  /** 1-col or 2-col option grid. Defaults to "one". */
  optionColumns?: "one" | "two";
  /** Optional custom interactive body for special exercise types like sequence ordering. */
  customBody?: (props: {
    answered: boolean;
    currentAnswer?: string;
    onAnswer: (value: string) => void;
  }) => React.ReactNode;
}

export interface QuizResult {
  correct: number;
  total: number;
}

interface Props {
  questions: readonly QuizQuestion[];
  onComplete?: (result: QuizResult) => void;
  onAnswerChange?: (result: QuizResult) => void;
  className?: string;
}

// ─── Pill status type ────────────────────────────────────────────────────────

type PillStatus = "unanswered" | "correct" | "incorrect" | "active";

function getPillStatus(
  index: number,
  current: number,
  answers: Record<string, string>,
  questions: readonly QuizQuestion[]
): PillStatus {
  const q = questions[index];
  if (!q) return "unanswered";
  if (index === current) return "active";
  const answer = answers[q.id];
  if (answer === undefined) return "unanswered";
  return answer === q.correctValue ? "correct" : "incorrect";
}

// ─── Pill colours ────────────────────────────────────────────────────────────

const PILL_STYLES: Record<PillStatus, string> = {
  active:
    "border-primary bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
  correct:
    "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground",
  incorrect:
    "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground",
  unanswered: "border-border bg-muted text-muted-foreground hover:bg-muted/80",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function CurriculumQuizEngine({
  questions,
  onComplete,
  onAnswerChange,
  className = "",
}: Props) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const completionRef = useRef<HTMLHeadingElement>(null);
  const engineId = useId();

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = question ? answers[question.id] : undefined;
  const answered = currentAnswer !== undefined;
  const isCorrect = question ? currentAnswer === question.correctValue : false;

  // Focus management: move focus to question heading on navigation
  useEffect(() => {
    if (!completed) {
      headingRef.current?.focus();
    } else {
      completionRef.current?.focus();
    }
  }, [currentIndex, completed]);

  const handleAnswer = (value: string) => {
    if (!question || answered) return;
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);
    if (onAnswerChange) {
      const correct = questions.reduce((acc, q) => {
        return nextAnswers[q.id] === q.correctValue ? acc + 1 : acc;
      }, 0);
      onAnswerChange({ correct, total: questions.length });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Compute result and fire callback
      const correct = questions.reduce((acc, q) => {
        return answers[q.id] === q.correctValue ? acc + 1 : acc;
      }, 0);
      setCompleted(true);
      onComplete?.({ correct, total: questions.length });
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setCompleted(false);
  };

  // ── Completion Screen ─────────────────────────────────────────────────────

  if (completed) {
    const correct = questions.reduce(
      (acc, q) => (answers[q.id] === q.correctValue ? acc + 1 : acc),
      0
    );
    const total = questions.length;
    const pct = Math.round((correct / total) * 100);

    return (
      <div
        className={`space-y-6 ${className}`}
        role="region"
        aria-label={t("quiz.completedTitle") || "Quiz Completed"}
      >
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-border bg-card p-8 text-center shadow-wp-xs">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-feedback-success-surface">
            <Trophy className="size-8 text-feedback-success-foreground" aria-hidden />
          </div>
          <div>
            <h2
              ref={completionRef}
              tabIndex={-1}
              className="text-2xl font-black text-foreground focus-visible:outline-none"
            >
              {t("quiz.completedTitle") || "Quiz Completed!"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("quiz.completedSubtitle") || "Great job completing this practice exercise."}
            </p>
          </div>

          {/* Score ring */}
          <div
            aria-label={`${t("quiz.score") || "Score"}: ${correct} out of ${total}`}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-5xl font-black text-primary">{pct}%</span>
            <span className="text-sm font-semibold text-muted-foreground">
              {t("quiz.scoreSummary", { correct, total })}
            </span>
          </div>

          {/* Per-question summary pills */}
          <div className="flex flex-wrap justify-center gap-2" aria-label="Results summary">
            {questions.map((q, i) => {
              const ans = answers[q.id];
              const ok = ans === q.correctValue;
              return (
                <span
                  key={q.id}
                  className={`inline-flex size-9 items-center justify-center rounded-xl border-2 text-sm font-black transition-colors ${
                    ok
                      ? "border-feedback-success-border bg-feedback-success-surface text-feedback-success-foreground"
                      : "border-feedback-error-border bg-feedback-error-surface text-feedback-error-foreground"
                  }`}
                  aria-label={`Question ${i + 1}: ${ok ? "correct" : "incorrect"}`}
                >
                  {ok ? (
                    <CheckCircle2 className="size-4" aria-hidden />
                  ) : (
                    <XCircle className="size-4" aria-hidden />
                  )}
                </span>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <RotateCcw className="size-4" aria-hidden />
            {t("quiz.restart") || "Restart Quiz"}
          </button>
        </div>
      </div>
    );
  }

  if (!question) return null;

  const questionHeadingId = `${engineId}-q${question.id}`;
  const feedbackId = `${engineId}-feedback-${question.id}`;

  // ── Active Question ───────────────────────────────────────────────────────

  return (
    <div className={`space-y-5 ${className}`}>
      {/* Interactive Progress Pills */}
      <ol aria-label="Question progress" className="flex flex-wrap gap-2">
        {questions.map((q, i) => {
          const status = getPillStatus(i, currentIndex, answers, questions);
          return (
            <li key={q.id}>
              <button
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={t("quiz.questionPillLabel", { number: i + 1 }) || `Question ${i + 1}`}
                aria-current={status === "active" ? "step" : undefined}
                className={`flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border-2 text-sm font-black transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${PILL_STYLES[status]}`}
              >
                {status === "correct" ? (
                  <CheckCircle2 className="size-4" aria-hidden />
                ) : status === "incorrect" ? (
                  <XCircle className="size-4" aria-hidden />
                ) : (
                  i + 1
                )}
              </button>
            </li>
          );
        })}
      </ol>

      {/* Question Card */}
      <article
        className="overflow-hidden rounded-3xl border border-border bg-card shadow-wp-xs"
        aria-labelledby={questionHeadingId}
      >
        <div className="p-5 sm:p-6">
          {/* Counter label */}
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t("quiz.questionOf", {
              current: currentIndex + 1,
              total: questions.length,
            }) || `Question ${currentIndex + 1} of ${questions.length}`}
          </p>

          {/* Question stem */}
          <h2
            ref={headingRef}
            id={questionHeadingId}
            tabIndex={-1}
            className="text-lg font-black leading-snug text-foreground focus-visible:outline-none sm:text-xl"
          >
            {question.stem}
          </h2>

          {/* Optional media */}
          {question.media && <div className="mt-5">{question.media}</div>}

          {/* Options or Custom Body */}
          {question.customBody ? (
            <div className="mt-5">
              {question.customBody({
                answered,
                currentAnswer,
                onAnswer: handleAnswer,
              })}
            </div>
          ) : question.options ? (
            <ChoiceOptionGroup
              className={`mt-5 grid gap-3 ${question.optionColumns === "two" ? "sm:grid-cols-2" : ""}`}
              label={question.stem}
              options={question.options}
              value={currentAnswer}
              onChange={handleAnswer}
              disabled={answered}
              correctValue={question.correctValue}
              revealFeedback={answered}
            />
          ) : null}
        </div>

        {/* Feedback Panel */}
        {answered && (
          <div
            id={feedbackId}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className={`border-t px-5 py-4 sm:px-6 ${
              isCorrect
                ? "border-feedback-success-border bg-feedback-success-surface"
                : "border-feedback-error-border bg-feedback-error-surface"
            }`}
          >
            <div className="flex gap-3">
              {isCorrect ? (
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-feedback-success-foreground"
                  aria-hidden
                />
              ) : (
                <XCircle
                  className="mt-0.5 size-5 shrink-0 text-feedback-error-foreground"
                  aria-hidden
                />
              )}
              <p
                className={`text-sm font-semibold leading-6 ${
                  isCorrect ? "text-feedback-success-foreground" : "text-feedback-error-foreground"
                }`}
              >
                <span className="font-black">
                  {isCorrect
                    ? t("quiz.correctFeedback") || "Correct! Excellent work."
                    : t("quiz.incorrectFeedback") || "Incorrect. Review the explanation below."}
                </span>
              </p>
            </div>

            {question.explanation && (
              <div className="mt-3 rounded-xl border border-border/60 bg-card p-3.5">
                <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  {t("quiz.explanation") || "Explanation"}
                </p>
                <p className="mt-1.5 text-sm font-medium leading-relaxed text-foreground">
                  {question.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </article>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        {currentIndex > 0 ? (
          <button
            type="button"
            onClick={handlePrev}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span>{t("quiz.previousQuestion") || "Previous Question"}</span>
          </button>
        ) : (
          <div />
        )}

        {answered && (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-wp-sm transition-all hover:bg-primary/90 active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>
              {isLastQuestion
                ? t("quiz.viewResults") || "View Results"
                : t("quiz.nextQuestion") || "Next Question"}
            </span>
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
