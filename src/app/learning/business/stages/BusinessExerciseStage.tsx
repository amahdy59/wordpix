import { useState } from "react";
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Award } from "lucide-react";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  savedScore?: number;
  onCompleteExercises: (score: number) => void;
  onNext: () => void;
}

export function BusinessExerciseStage({ unit, savedScore, onCompleteExercises, onNext }: Props) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, "A" | "B" | "C">>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [activeIdx, setActiveIdx] = useState(0);

  const questions = unit.exercises;
  const currentQ = questions[activeIdx];

  const handleSelectOption = (qId: string, key: "A" | "B" | "C") => {
    if (submitted[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: key }));
  };

  const handleCheckAnswer = (qId: string) => {
    if (!selectedAnswers[qId]) return;
    const newSubmitted = { ...submitted, [qId]: true };
    setSubmitted(newSubmitted);

    // If all submitted, calculate score
    if (Object.keys(newSubmitted).length === questions.length) {
      const correctCount = questions.filter(
        (q) => selectedAnswers[q.id] === q.correctAnswer
      ).length;
      onCompleteExercises(correctCount);
    }
  };

  const totalSubmitted = Object.keys(submitted).length;
  const correctCount = questions.filter(
    (q) => submitted[q.id] && selectedAnswers[q.id] === q.correctAnswer
  ).length;
  const isFinished = totalSubmitted === questions.length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <HelpCircle className="size-4" aria-hidden />
          Stage 5 · Practice Exercise Set
        </span>
        <div className="flex items-center gap-3">
          {savedScore !== undefined && (
            <span className="text-xs font-bold text-accent">
              Best: {savedScore}/{questions.length}
            </span>
          )}
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {totalSubmitted} / {questions.length} Completed
          </span>
        </div>
      </div>

      {/* Progress Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1" role="tablist">
        {questions.map((q, idx) => {
          const isDone = submitted[q.id];
          const isCorrect = isDone && selectedAnswers[q.id] === q.correctAnswer;
          const isCurrent = idx === activeIdx;

          return (
            <button
              key={q.id}
              type="button"
              role="tab"
              aria-selected={isCurrent}
              aria-label={`Question ${idx + 1}`}
              onClick={() => setActiveIdx(idx)}
              className={`flex min-h-[44px] min-w-[44px] size-11 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                isCurrent
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary text-primary-foreground"
                  : isDone
                    ? isCorrect
                      ? "bg-accent/20 text-accent border border-accent/30"
                      : "bg-destructive/20 text-destructive border border-destructive/30"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      {currentQ && (
        <section
          className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
          aria-labelledby={`q-title-${currentQ.id}`}
        >
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className="text-xs font-black uppercase tracking-wider text-primary">
              Question {activeIdx + 1} of {questions.length}
            </span>
            {submitted[currentQ.id] && (
              <span
                className={`inline-flex items-center gap-1 text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                  selectedAnswers[currentQ.id] === currentQ.correctAnswer
                    ? "bg-accent/15 text-accent"
                    : "bg-destructive/15 text-destructive"
                }`}
              >
                {selectedAnswers[currentQ.id] === currentQ.correctAnswer ? (
                  <>
                    <CheckCircle className="size-3.5" aria-hidden /> Correct
                  </>
                ) : (
                  <>
                    <XCircle className="size-3.5" aria-hidden /> Needs Review
                  </>
                )}
              </span>
            )}
          </div>

          <h2
            id={`q-title-${currentQ.id}`}
            className="text-xl sm:text-2xl font-black text-foreground"
          >
            {currentQ.question}
          </h2>

          {/* Options */}
          <div
            className="mt-6 flex flex-col gap-3"
            role="radiogroup"
            aria-labelledby={`q-title-${currentQ.id}`}
          >
            {currentQ.options.map((option) => {
              const isSelected = selectedAnswers[currentQ.id] === option.key;
              const isChecked = submitted[currentQ.id];
              const isCorrect = option.key === currentQ.correctAnswer;

              let style =
                "border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50 text-foreground";
              if (isSelected && !isChecked) {
                style = "border-primary bg-primary/10 text-primary shadow-wp-xs";
              } else if (isChecked) {
                if (isCorrect) {
                  style = "border-accent bg-accent/10 text-accent font-bold";
                } else if (isSelected) {
                  style = "border-destructive bg-destructive/10 text-destructive";
                } else {
                  style = "opacity-50 border-border bg-muted/20 text-muted-foreground";
                }
              }

              return (
                <button
                  key={option.key}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={isChecked}
                  onClick={() => handleSelectOption(currentQ.id, option.key)}
                  className={`flex items-start gap-3.5 p-4 rounded-2xl border text-start transition-all ${style}`}
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-background border border-border font-black text-xs text-foreground">
                    {option.key}
                  </span>
                  <span className="text-base leading-relaxed pt-0.5">{option.text}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation & Action */}
          <div className="mt-6 flex flex-col gap-4">
            {!submitted[currentQ.id] ? (
              <button
                type="button"
                disabled={!selectedAnswers[currentQ.id]}
                onClick={() => handleCheckAnswer(currentQ.id)}
                className="w-full sm:w-auto self-end inline-flex min-h-[44px] items-center justify-center rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all"
              >
                Check Answer
              </button>
            ) : (
              <div className="rounded-2xl bg-muted/50 border border-border p-4 sm:p-5 flex flex-col gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Explanation & Context
                </span>
                <p className="text-sm sm:text-base font-medium text-foreground">
                  {currentQ.explanation || "Correct answer based on the Language Bank."}
                </p>
                {activeIdx < questions.length - 1 && (
                  <button
                    type="button"
                    onClick={() => setActiveIdx((prev) => prev + 1)}
                    className="self-end mt-2 inline-flex min-h-[44px] items-center gap-1.5 px-3 py-2 text-xs font-black uppercase text-primary hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary rounded-lg"
                  >
                    <span>Next Question</span>
                    <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden />
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Completion Banner */}
      {isFinished && (
        <section className="rounded-3xl border-2 border-accent/30 bg-accent/10 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="size-8 text-accent shrink-0" aria-hidden />
            <div>
              <h3 className="text-lg font-black text-foreground">Exercise Set Completed!</h3>
              <p className="text-sm font-semibold text-muted-foreground">
                Score: {correctCount} / {questions.length} correct (
                {Math.round((correctCount / questions.length) * 100)}%)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNext}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 transition-all"
          >
            <span>Proceed to Discussion</span>
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        </section>
      )}
    </div>
  );
}
