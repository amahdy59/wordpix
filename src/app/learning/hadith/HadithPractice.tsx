import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { useI18n } from "../../../i18n";
import type { HadithExerciseSet } from "./hadithExerciseCatalog";

interface Props {
  exerciseSet: HadithExerciseSet;
  onScoreChange: (scorePercent: number) => void;
}

export function HadithPractice({ exerciseSet, onScoreChange }: Props) {
  const { t } = useI18n();
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [sequences, setSequences] = useState<Record<string, string[]>>({});

  const results = useMemo(
    () =>
      exerciseSet.exercises.map((exercise) => {
        if (exercise.type === "single-choice") {
          const answer = choices[exercise.id];
          return { answered: Boolean(answer), correct: answer === exercise.answerId };
        }
        const answer = sequences[exercise.id] ?? [];
        return {
          answered: answer.length === exercise.answerOrder.length,
          correct:
            answer.length === exercise.answerOrder.length &&
            answer.every((itemId, index) => itemId === exercise.answerOrder[index]),
        };
      }),
    [choices, exerciseSet.exercises, sequences]
  );
  const correct = results.filter((result) => result.correct).length;
  const scorePercent = Math.round((correct / exerciseSet.exercises.length) * 100);
  const answered = results.filter((result) => result.answered).length;

  const publishScore = (
    nextChoices: Record<string, string>,
    nextSequences: Record<string, string[]>
  ) => {
    const nextCorrect = exerciseSet.exercises.filter((exercise) => {
      if (exercise.type === "single-choice") return nextChoices[exercise.id] === exercise.answerId;
      const answer = nextSequences[exercise.id] ?? [];
      return (
        answer.length === exercise.answerOrder.length &&
        answer.every((itemId, index) => itemId === exercise.answerOrder[index])
      );
    }).length;
    onScoreChange(Math.round((nextCorrect / exerciseSet.exercises.length) * 100));
  };

  return (
    <section
      className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-8"
      aria-labelledby="hadith-practice-heading"
    >
      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
        {t("hadith.practiceLabel")}
      </p>
      <h2 id="hadith-practice-heading" className="mt-2 text-2xl font-black">
        {t("hadith.practiceTitle")}
      </h2>
      <p className="mt-3 text-sm font-semibold text-muted-foreground">
        {t("hadith.practiceInstructions")}
      </p>

      <div className="mt-7 space-y-7">
        {exerciseSet.exercises.map((exercise, exerciseIndex) => {
          const result = results[exerciseIndex];
          if (exercise.type === "single-choice") {
            return (
              <fieldset key={exercise.id} className="rounded-2xl border border-border p-4 sm:p-5">
                <legend className="px-2 text-sm font-black">
                  {exerciseIndex + 1}. {exercise.prompt}
                </legend>
                <div className="mt-4 grid gap-3">
                  {exercise.options.map((option) => {
                    const selected = choices[exercise.id] === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          const nextChoices = { ...choices, [exercise.id]: option.id };
                          setChoices(nextChoices);
                          publishScore(nextChoices, sequences);
                        }}
                        className={`min-h-12 rounded-xl border-2 px-4 text-start text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${selected ? "border-primary bg-primary/10" : "border-border hover:border-primary active:bg-muted"}`}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                {result.answered && (
                  <p
                    className={`mt-4 flex gap-2 rounded-xl p-3 text-sm font-semibold ${result.correct ? "bg-feedback-success-surface text-feedback-success-foreground" : "bg-feedback-warning-surface text-feedback-warning-foreground"}`}
                    role="status"
                  >
                    {result.correct ? (
                      <Check className="size-5 shrink-0" aria-hidden />
                    ) : (
                      <X className="size-5 shrink-0" aria-hidden />
                    )}
                    <span>{exercise.feedback}</span>
                  </p>
                )}
              </fieldset>
            );
          }

          const selectedOrder = sequences[exercise.id] ?? [];
          const available = exercise.items.filter((item) => !selectedOrder.includes(item.id));
          return (
            <fieldset key={exercise.id} className="rounded-2xl border border-border p-4 sm:p-5">
              <legend className="px-2 text-sm font-black">
                {exerciseIndex + 1}. {exercise.prompt}
              </legend>
              <ol className="mt-4 space-y-2" aria-label={t("hadith.selectedSequence")}>
                {selectedOrder.map((itemId, index) => {
                  const item = exercise.items.find((candidate) => candidate.id === itemId);
                  if (!item) return null;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => {
                          const nextSequences = {
                            ...sequences,
                            [exercise.id]: selectedOrder.filter((id) => id !== item.id),
                          };
                          setSequences(nextSequences);
                          publishScore(choices, nextSequences);
                        }}
                        className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-primary bg-primary/10 px-4 text-start text-sm font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-black text-primary-foreground">
                          {index + 1}
                        </span>
                        <span>{item.label}</span>
                        <X className="ms-auto size-4" aria-hidden />
                      </button>
                    </li>
                  );
                })}
              </ol>
              {available.length > 0 && (
                <div
                  className="mt-4 flex flex-wrap gap-2"
                  aria-label={t("hadith.availableSequenceItems")}
                >
                  {available.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const nextSequences = {
                          ...sequences,
                          [exercise.id]: [...selectedOrder, item.id],
                        };
                        setSequences(nextSequences);
                        publishScore(choices, nextSequences);
                      }}
                      className="min-h-11 rounded-xl border border-border px-3 text-sm font-bold hover:border-primary active:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
              {selectedOrder.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const nextSequences = { ...sequences, [exercise.id]: [] };
                    setSequences(nextSequences);
                    publishScore(choices, nextSequences);
                  }}
                  className="mt-4 min-h-11 rounded-xl px-3 text-sm font-black text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <RotateCcw className="me-2 inline size-4" aria-hidden />
                  {t("hadith.resetOrder")}
                </button>
              )}
              {result.answered && (
                <p
                  className={`mt-4 rounded-xl p-3 text-sm font-semibold ${result.correct ? "bg-feedback-success-surface text-feedback-success-foreground" : "bg-feedback-warning-surface text-feedback-warning-foreground"}`}
                  role="status"
                >
                  {exercise.feedback}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <p className="mt-6 font-black text-primary" role="status" aria-live="polite">
        {t("hadith.practiceProgress", {
          answered,
          total: exerciseSet.exercises.length,
          score: scorePercent,
        })}
      </p>
    </section>
  );
}
