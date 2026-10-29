import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, XCircle } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { recallChoices } from "../businessRecallChoices";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
  onComplete?: () => void;
  savedAnswers?: Record<string, string>;
  onSaveAnswer?: (id: string, answer: string) => void;
  onRecordSrsConfidence?: (term: string, confidence: "again" | "hard" | "easy") => void;
}
const button =
  "min-h-11 rounded-xl px-4 py-2 font-bold focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function BusinessRecallStage({
  unit,
  onNext,
  onComplete,
  savedAnswers = {},
  onSaveAnswer,
  onRecordSrsConfidence,
}: Props) {
  const { t } = useI18n();
  const prompts = unit.recall?.prompts ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(savedAnswers);
  const [selection, setSelection] = useState<string>();
  const [showHint, setShowHint] = useState(false);
  const [ratings, setRatings] = useState<Record<string, string>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const current = prompts[activeIdx];
  const options = current ? recallChoices(current, unit) : [];
  const submitted = current ? answers[current.id] : undefined;
  const correctAnswer = current?.correctAnswer ?? current?.targetWord;
  const correct = submitted === correctAnswer;
  const answeredCount = prompts.filter((prompt) => answers[prompt.id] !== undefined).length;
  useEffect(() => {
    heading.current?.focus();
  }, [activeIdx]);
  const move = (index: number) => {
    setActiveIdx(index);
    setSelection(undefined);
    setShowHint(false);
  };
  const check = () => {
    if (!current || !selection || submitted !== undefined) return;
    const next = { ...answers, [current.id]: selection };
    setAnswers(next);
    onSaveAnswer?.(current.id, selection);
    if (prompts.every((prompt) => next[prompt.id] !== undefined)) onComplete?.();
  };
  if (!current || !unit.recall)
    return (
      <div className="space-y-4 py-4">
        <h2 className="text-xl font-bold">{t("business.recall.noRecallTitle")}</h2>
        <button
          type="button"
          className={`min-h-11 ${button} bg-primary text-primary-foreground`}
          onClick={onNext}
        >
          {t("business.recall.beginWarmup")}
        </button>
      </div>
    );
  return (
    <div className="wp-container-content flex flex-col gap-5 py-2">
      <header className="space-y-2">
        <h2 className="wp-type-stage-title text-foreground">
          {t("business.recall.heading", {
            number: unit.recall.sourceUnitNumber,
            title: unit.recall.sourceUnitTitle,
          })}
        </h2>
        <p className="text-base text-muted-foreground">{t("business.recall.simpleInstructions")}</p>
      </header>
      <div className="wp-quiz-progress sticky top-[var(--wp-course-nav-height,4.5rem)] z-30 space-y-2 bg-background py-2">
        <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold">
          <span>{t("quiz.questionOf", { current: activeIdx + 1, total: prompts.length })}</span>
          <span>{t("quiz.answeredCount", { answered: answeredCount, total: prompts.length })}</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={prompts.length}
          aria-label={t("quiz.answeredCount", { answered: answeredCount, total: prompts.length })}
          className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        >
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${(answeredCount / prompts.length) * 100}%` }}
          />
        </div>
      </div>
      <section aria-labelledby={`recall-${current.id}`} className="space-y-4">
        <h3
          ref={heading}
          tabIndex={-1}
          id={`recall-${current.id}`}
          className="text-xl font-bold leading-relaxed text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
        >
          {t("business.recall.chooseMeaning")}
        </h3>
        <p className="max-w-2xl text-lg leading-relaxed text-foreground" lang="en" dir="ltr">
          {current.definition ?? current.question}
        </p>
        <ChoiceOptionGroup
          label={t("business.recall.choicesLabel")}
          value={submitted ?? selection}
          onChange={setSelection}
          disabled={submitted !== undefined}
          correctValue={correctAnswer}
          revealFeedback={submitted !== undefined}
          className="grid gap-3 sm:grid-cols-2"
          options={options.map((option) => ({
            value: option,
            label: (
              <bdi lang="en" dir="ltr">
                {option}
              </bdi>
            ),
            accessibleLabel: option,
          }))}
        />
        {submitted === undefined && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            {current.hint ? (
              <button
                type="button"
                aria-expanded={showHint}
                aria-controls={`hint-${current.id}`}
                onClick={() => setShowHint(!showHint)}
                className={`min-h-11 ${button} inline-flex items-center gap-2 text-primary hover:bg-secondary`}
              >
                <HelpCircle className="size-4" aria-hidden />
                {t("business.recall.needHint")}
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              onClick={check}
              disabled={!selection}
              className={`min-h-11 ${button} bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {t("business.recall.checkAnswer")}
            </button>
          </div>
        )}
        {current.hint && (
          <p
            hidden={!showHint}
            id={`hint-${current.id}`}
            className="text-base text-muted-foreground"
          >
            {t("business.recall.hintText", { hint: current.hint })}
          </p>
        )}
        {submitted !== undefined && (
          <div className="space-y-3 border-t border-border pt-4">
            <p role="status" className="flex items-center gap-2 font-bold text-foreground">
              {correct ? (
                <CheckCircle2 className="size-5" aria-hidden />
              ) : (
                <XCircle className="size-5" aria-hidden />
              )}
              {correct
                ? t("practice.correct")
                : t("business.recall.correctAnswerIs", { answer: correctAnswer })}
            </p>
            {current.modelSentence && (
              <p lang="en" dir="ltr" className="text-base leading-relaxed text-foreground">
                {current.modelSentence}
              </p>
            )}
            <details>
              <summary
                className={`min-h-11 ${button} flex cursor-pointer items-center text-primary`}
              >
                {t("business.recall.optionalRating")}
              </summary>
              <p className="py-2 text-sm text-muted-foreground">
                {t("business.recall.selfRatingPrompt")}
              </p>
              <div className="flex flex-wrap gap-2">
                {(["again", "hard", "easy"] as const).map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    aria-pressed={ratings[current.id] === rating}
                    className={`min-h-11 ${button} border border-border text-foreground hover:bg-secondary`}
                    onClick={() => {
                      setRatings({ ...ratings, [current.id]: rating });
                      onRecordSrsConfidence?.(current.targetWord, rating);
                    }}
                  >
                    {t(`business.recall.rating${rating[0].toUpperCase()}${rating.slice(1)}`)}
                  </button>
                ))}
              </div>
            </details>
          </div>
        )}
      </section>
      <nav
        aria-label={t("courseLesson.questionNavigation")}
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
      >
        <button
          type="button"
          disabled={activeIdx === 0}
          onClick={() => move(activeIdx - 1)}
          className={`min-h-11 ${button} inline-flex items-center gap-2 border border-border text-foreground disabled:opacity-50`}
        >
          <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
          {t("quiz.previousQuestion")}
        </button>
        {activeIdx < prompts.length - 1 && (
          <button
            type="button"
            onClick={() => move(activeIdx + 1)}
            className={`min-h-11 ${button} inline-flex items-center gap-2 bg-primary text-primary-foreground`}
          >
            {submitted === undefined ? t("quiz.skipQuestion") : t("quiz.nextQuestion")}
            <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
          </button>
        )}
      </nav>
      <button
        type="button"
        className={`min-h-11 ${button} self-end text-primary underline underline-offset-4 hover:bg-secondary`}
        onClick={onNext}
      >
        {t("business.recall.beginLessonWarmup")}
      </button>
    </div>
  );
}
