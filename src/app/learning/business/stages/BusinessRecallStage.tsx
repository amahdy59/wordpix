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
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = prompts[activeIdx];
  const options = current ? recallChoices(current, unit) : [];
  const submitted = current ? answers[current.id] : undefined;
  const correctAnswer = current?.correctAnswer ?? current?.targetWord;
  const correct = submitted === correctAnswer;
  const answeredCount = prompts.filter((prompt) => answers[prompt.id] !== undefined).length;

  useEffect(() => {
    heading.current?.focus();
  }, [activeIdx]);

  useEffect(() => {
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  const move = (index: number) => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    setActiveIdx(index);
    setSelection(undefined);
    setShowHint(false);
  };

  const handleSelectAnswer = (value: string) => {
    if (!current || submitted !== undefined) return;
    setSelection(value);
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    onSaveAnswer?.(current.id, value);
    if (prompts.every((prompt) => next[prompt.id] !== undefined)) onComplete?.();

    const isCorrect = value === correctAnswer;
    if (isCorrect) {
      if (autoTimer.current) clearTimeout(autoTimer.current);
      autoTimer.current = setTimeout(() => {
        if (activeIdx < prompts.length - 1) {
          move(activeIdx + 1);
        } else if (prompts.every((prompt) => next[prompt.id] !== undefined)) {
          onNext();
        } else {
          const firstUnanswered = prompts.findIndex((p) => next[p.id] === undefined);
          if (firstUnanswered !== -1) {
            move(firstUnanswered);
          } else {
            onNext();
          }
        }
      }, 500);
    }
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
          onChange={handleSelectAnswer}
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
            <div className="pt-2">
              <span className="block text-sm font-semibold text-primary mb-1">
                {t("business.recall.optionalRating")}
              </span>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">
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
            </div>
          </div>
        )}
      </section>
      <nav
        aria-label={t("courseLesson.questionNavigation")}
        className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={activeIdx === 0}
            onClick={() => move(activeIdx - 1)}
            aria-label={t("quiz.previousQuestion")}
            className={`min-h-11 ${button} inline-flex items-center gap-2 border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:pointer-events-none`}
          >
            <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden />
            <span>{t("quiz.previousQuestion")}</span>
          </button>
          {current.hint && (
            <button
              type="button"
              aria-expanded={showHint}
              aria-controls={`hint-${current.id}`}
              onClick={() => setShowHint(!showHint)}
              className={`min-h-11 ${button} inline-flex items-center gap-1.5 text-primary transition-colors hover:bg-secondary/60`}
            >
              <HelpCircle className="size-4" aria-hidden />
              <span>{t("business.recall.needHint")}</span>
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            type="button"
            className={`min-h-11 ${button} text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground`}
            onClick={() => {
              if (autoTimer.current) clearTimeout(autoTimer.current);
              onNext();
            }}
          >
            {t("business.recall.beginLessonWarmup")}
          </button>
          {activeIdx < prompts.length - 1 ? (
            <button
              type="button"
              onClick={() => move(activeIdx + 1)}
              className={`min-h-11 ${button} inline-flex items-center gap-2 transition-all ${
                submitted === undefined
                  ? "border border-border bg-card text-foreground hover:bg-muted"
                  : "bg-primary text-primary-foreground shadow-wp-xs hover:bg-primary/90 motion-safe:active:scale-[0.98]"
              }`}
            >
              <span>
                {submitted === undefined ? t("quiz.skipQuestion") : t("quiz.nextQuestion")}
              </span>
              <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
            </button>
          ) : (
            submitted !== undefined && (
              <button
                type="button"
                onClick={() => {
                  if (autoTimer.current) clearTimeout(autoTimer.current);
                  onNext();
                }}
                className={`min-h-11 ${button} inline-flex items-center gap-2 bg-primary text-primary-foreground shadow-wp-xs transition-all hover:bg-primary/90 motion-safe:active:scale-[0.98]`}
              >
                <span>{t("business.recall.beginLessonWarmup")}</span>
                <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
              </button>
            )
          )}
        </div>
      </nav>
    </div>
  );
}
