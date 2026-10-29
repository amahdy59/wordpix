import { useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { useI18n } from "../../../i18n";
import type { HadithExerciseSet } from "./hadithExerciseCatalog";
import { QuizQuestionCard } from "../../shared/QuizQuestionCard";
import { playCorrectSound, playIncorrectSound } from "../../shared/useSound";
import { ScenePlaceholder } from "../../shared/SentenceQuestionSupport";
import { QuestionImage } from "../../shared/QuestionImage";

function HadithImageClue({ imageRef, clue, alt }: { imageRef: string; clue: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed || !imageRef ? (
    <ScenePlaceholder clue={clue} />
  ) : (
    <QuestionImage
      media={{ imagePath: `hadith/v1/images/${imageRef}.png`, imageAlt: alt }}
      onExhausted={() => setFailed(true)}
      className="block h-auto w-full"
      loading="eager"
    />
  );
}

interface Props {
  exerciseSet: HadithExerciseSet;
  onScoreChange: (scorePercent: number) => void;
}

export function HadithPractice({ exerciseSet, onScoreChange }: Props) {
  const { t } = useI18n();
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [sequences, setSequences] = useState<Record<string, string[]>>({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const questionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    questionRef.current?.focus();
  }, [questionIndex]);

  const results = useMemo(
    () =>
      exerciseSet.exercises.map((exercise) => {
        if (exercise.type === "single-choice" || exercise.type === "image-choice") {
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
      if (exercise.type === "single-choice" || exercise.type === "image-choice") {
        return nextChoices[exercise.id] === exercise.answerId;
      }
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
      className="wp-container-content py-3 sm:py-5"
      aria-labelledby="hadith-practice-heading"
    >
      <p className="sr-only">{t("hadith.practiceLabel")}</p>
      <h2
        id="hadith-practice-heading"
        tabIndex={-1}
        className="wp-type-stage-title mt-2 text-foreground outline-none"
      >
        {t("hadith.practiceTitle")}
      </h2>
      <p className="mt-3 text-base font-semibold text-muted-foreground">
        {t("courseLesson.quizHelp")}
      </p>

      <div className="wp-quiz-progress sticky top-[var(--wp-course-nav-height,4.5rem)] z-30 mt-3 bg-background py-2">
        <div className="flex items-center justify-between gap-3 text-base font-black">
          <span>
            {t("quiz.questionOf", {
              current: questionIndex + 1,
              total: exerciseSet.exercises.length,
            })}
          </span>
          <span>{t("quiz.answeredCount", { answered, total: exerciseSet.exercises.length })}</span>
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-label={t("hadith.practiceCompletion")}
          aria-valuemin={0}
          aria-valuemax={exerciseSet.exercises.length}
          aria-valuenow={answered}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none"
            style={{ width: `${(answered / exerciseSet.exercises.length) * 100}%` }}
          />
        </div>
      </div>

      <div ref={questionRef} tabIndex={-1} className="mt-3 space-y-3 outline-none">
        {exerciseSet.exercises.slice(questionIndex, questionIndex + 1).map((exercise) => {
          const exerciseIndex = questionIndex;
          const result = results[exerciseIndex];
          if (exercise.type === "single-choice" || exercise.type === "image-choice") {
            return (
              <QuizQuestionCard
                key={exercise.id}
                id={exercise.id}
                index={exerciseIndex}
                question={exercise.prompt}
                value={choices[exercise.id]}
                correctValue={exercise.answerId}
                feedback={exercise.feedback}
                onChange={(optionId) => {
                  const nextChoices = { ...choices, [exercise.id]: optionId };
                  setChoices(nextChoices);
                  publishScore(nextChoices, sequences);
                }}
                options={exercise.options.map((option) => ({
                  value: option.id,
                  label: option.label,
                  accessibleLabel: option.label,
                }))}
                media={
                  exercise.type === "image-choice" ? (
                    <figure className="mx-auto w-full max-w-64 overflow-hidden rounded-2xl border border-border bg-muted shadow-wp-sm">
                      <HadithImageClue
                        key={exercise.id}
                        imageRef={exercise.imageRef}
                        clue={
                          exercise.options.find((option) => option.id === exercise.answerId)
                            ?.label ?? exercise.prompt
                        }
                        alt={t("hadith.practiceImageAlt")}
                      />
                    </figure>
                  ) : undefined
                }
              />
            );
          }

          const selectedOrder = sequences[exercise.id] ?? [];
          const available = exercise.items.filter((item) => !selectedOrder.includes(item.id));
          return (
            <fieldset
              key={exercise.id}
              data-quiz-question
              className="rounded-2xl border border-border p-4 sm:p-5"
            >
              <legend className="px-2 text-base font-black">
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
                        className="flex min-h-12 w-full items-center gap-3 rounded-xl border border-primary bg-secondary px-4 text-start text-base font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                        const newOrder = [...selectedOrder, item.id];
                        const nextSequences = {
                          ...sequences,
                          [exercise.id]: newOrder,
                        };
                        setSequences(nextSequences);
                        publishScore(choices, nextSequences);
                        if (newOrder.length === exercise.answerOrder.length) {
                          const isCorrect = exercise.answerOrder.every(
                            (id, idx) => id === newOrder[idx]
                          );
                          if (isCorrect) playCorrectSound();
                          else playIncorrectSound();
                        }
                      }}
                      className="min-h-11 rounded-xl border border-border px-3 text-base font-bold hover:border-primary active:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
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
                  className="mt-4 min-h-11 rounded-xl px-3 text-base font-black text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <RotateCcw className="me-2 inline size-4" aria-hidden />
                  {t("hadith.resetOrder")}
                </button>
              )}
              {result.answered && (
                <p
                  className={`mt-4 rounded-xl p-3 text-base font-semibold ${result.correct ? "bg-feedback-success-surface text-feedback-success-foreground" : "bg-feedback-warning-surface text-feedback-warning-foreground"}`}
                  role="status"
                >
                  {exercise.feedback}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap justify-between gap-3">
        <button
          type="button"
          disabled={questionIndex === 0}
          onClick={() => setQuestionIndex((index) => index - 1)}
          className="min-h-11 rounded-xl border border-border px-4 py-2 font-bold text-foreground disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("quiz.previousQuestion")}
        </button>
        {questionIndex < exerciseSet.exercises.length - 1 && (
          <button
            type="button"
            onClick={() => setQuestionIndex((index) => index + 1)}
            className="min-h-11 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("quiz.nextQuestion")}
          </button>
        )}
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
