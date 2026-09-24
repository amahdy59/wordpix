import { useState } from "react";
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  unit: ConversationUnit;
  savedScore?: number;
  onSaveScore: (score: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function QuizStage({ unit, savedScore, onSaveScore, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const [userAnswers, setUserAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({});

  const handleSelectOption = (qIdx: number, key: "A" | "B" | "C" | "D") => {
    if (userAnswers[qIdx] !== undefined) return; // already answered
    const nextAnswers = { ...userAnswers, [qIdx]: key };
    setUserAnswers(nextAnswers);

    // If all 10 are answered, compute and save score
    if (Object.keys(nextAnswers).length === unit.quiz.length) {
      let correctCount = 0;
      unit.quiz.forEach((q, idx) => {
        if (nextAnswers[idx] === q.correctAnswer) correctCount++;
      });
      onSaveScore(correctCount);
    }
  };

  const handleReset = () => {
    setUserAnswers({});
  };

  const answeredCount = Object.keys(userAnswers).length;
  const currentScore = unit.quiz.reduce((acc, q, idx) => {
    return userAnswers[idx] === q.correctAnswer ? acc + 1 : acc;
  }, 0);
  const canContinue = answeredCount === unit.quiz.length || savedScore !== undefined;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <HelpCircle className="size-4" aria-hidden />
          {t("conversation.quizStage")}
        </span>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-muted-foreground">
            {t("conversation.score", { score: currentScore, total: unit.quiz.length })}
            {savedScore !== undefined && (
              <span className="ms-1 font-medium text-muted-foreground/80">
                ({t("conversation.bestScore", { score: savedScore, total: unit.quiz.length })})
              </span>
            )}
          </span>
          {answeredCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              <RotateCcw className="size-3.5" aria-hidden />
              <span>{t("conversation.retry")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Questions List */}
      <div className="flex flex-col gap-5">
        {unit.quiz.map((q, qIdx) => {
          const selected = userAnswers[qIdx];
          const hasAnswered = selected !== undefined;
          const isCorrect = selected === q.correctAnswer;

          return (
            <article
              key={q.id}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs"
              aria-labelledby={`quiz-q-${qIdx}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h2
                    id={`quiz-q-${qIdx}`}
                    className="text-base sm:text-lg font-bold text-foreground leading-snug"
                  >
                    {q.question}
                  </h2>
                </div>

                {hasAnswered && (
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full ${
                      isCorrect ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive"
                    }`}
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="size-3.5" aria-hidden />
                        {t("conversation.correct")}
                      </>
                    ) : (
                      <>
                        <XCircle className="size-3.5" aria-hidden />
                        {t("conversation.incorrect")}
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Options */}
              <ChoiceOptionGroup
                className="mt-2 grid gap-2.5 sm:grid-cols-2"
                label={t("conversation.questionOptions", { number: qIdx + 1 })}
                value={selected}
                onChange={(option) => handleSelectOption(qIdx, option)}
                disabled={hasAnswered}
                correctValue={q.correctAnswer}
                revealFeedback={hasAnswered}
                options={q.options.map((option) => ({
                  value: option.key,
                  label: option.text,
                  prefix: option.key,
                  accessibleLabel: t("conversation.answerOption", {
                    key: option.key,
                    text: option.text,
                  }),
                }))}
              />

              {/* Rationale feedback */}
              {hasAnswered && !isCorrect && (
                <p className="mt-1 text-xs font-semibold text-muted-foreground">
                  {t("conversation.correctAnswer", { answer: q.correctAnswer })}
                  {q.explanation && <span> {q.explanation}</span>}
                </p>
              )}
            </article>
          );
        })}
      </div>

      {/* Stage Navigation Footer */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-muted active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.previous")}</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          aria-describedby={!canContinue ? "quiz-completion-requirement" : undefined}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t("conversation.continueDiscussion")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      {!canContinue && (
        <p
          id="quiz-completion-requirement"
          className="text-center text-sm font-semibold text-muted-foreground"
          aria-live="polite"
        >
          {t("conversation.answerAll")}
        </p>
      )}
    </div>
  );
}
