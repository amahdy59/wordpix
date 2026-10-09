import { useEffect, useRef, useState } from "react";
import {
  MessageSquare,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  unit: BusinessUnit;
  savedNotes?: Record<string, string>;
  onSaveNote: (promptId: string, note: string) => void;
  onNext: () => void;
  onComplete?: () => void;
}

export function BusinessWarmupStage({
  unit,
  savedNotes = {},
  onSaveNote,
  onNext,
  onComplete,
}: Props) {
  const { t } = useI18n();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(savedNotes);

  const [activeIdx, setActiveIdx] = useState(0);
  const questionRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    questionRef.current?.focus();
  }, [activeIdx]);

  const handleSelectOption = (promptId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [promptId]: optionKey }));
    onSaveNote(promptId, optionKey);
    const next = { ...selectedAnswers, [promptId]: optionKey };
    if (unit.warmup.prompts.every((prompt) => next[prompt.id])) onComplete?.();
  };

  const prompts = unit.warmup?.prompts || [];
  const answeredCount = prompts.filter((p) => Boolean(selectedAnswers[p.id])).length;
  const allAnswered = prompts.length > 0 && answeredCount === prompts.length;

  return (
    <div className="wp-container-content flex flex-col gap-6 py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-primary">
          <MessageSquare className="size-4" aria-hidden />
          {t("business.warmup.stageTag")}
        </span>
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          {`${unit.level} · ${unit.sectionTitle}`}
        </span>
      </div>

      {/* Essential Question Hero Card with Thumbnail */}
      <section
        className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card shadow-wp-sm"
        aria-labelledby="big-question-heading"
      >
        {unit.heroImageSrc && (
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-muted/40">
            <img
              src={resolveAssetUrl(unit.heroImageSrc)}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = "none";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-widest text-primary">
            {t("business.warmup.essentialQuestion")}
          </p>
          <h2
            id="big-question-heading"
            lang="en"
            dir="ltr"
            className="wp-type-stage-title mt-3 lg:text-4xl font-black text-foreground tracking-tight leading-snug"
          >
            {`“${unit.essentialQuestion}”`}
          </h2>
          {unit.speakingGoal && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-secondary p-3.5 text-base font-semibold text-primary">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" aria-hidden />
              <div>
                <span className="font-black uppercase tracking-wide me-1.5">
                  {t("business.warmup.speakingGoalLabel")}
                </span>
                <bdi lang="en" dir="ltr">
                  {unit.speakingGoal}
                </bdi>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Multiple-Choice Warm-up Workplace Scenarios */}
      <section className="space-y-4 py-3" aria-labelledby="reflection-prompts-title">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" aria-hidden />
              <h2
                id="reflection-prompts-title"
                className="wp-type-stage-title text-lg font-black text-foreground"
              >
                {t("business.warmup.reflectHeading")}
              </h2>
            </div>
            <p className="mt-1 text-base text-muted-foreground font-medium">
              {t("business.warmup.instructionsFallback")}
            </p>
          </div>

          <span
            className={`self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-black transition-colors ${
              allAnswered
                ? "bg-feedback-success-surface text-feedback-success-foreground border border-accent/30"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {allAnswered && <Sparkles className="size-3.5" aria-hidden />}
            <span>
              {t("business.warmup.questionsProgress", {
                answered: answeredCount,
                total: prompts.length,
              })}
            </span>
          </span>
        </div>

        <p className="mt-4 text-sm font-semibold text-muted-foreground">
          {t("quiz.questionOf", { current: activeIdx + 1, total: prompts.length })}
        </p>
        <div className="mt-4 flex flex-col gap-4">
          {prompts.slice(activeIdx, activeIdx + 1).map((prompt) => {
            const idx = activeIdx;
            const hasOptions = Array.isArray(prompt.options) && prompt.options.length > 0;
            const selectedKey = selectedAnswers[prompt.id];
            const isAnswered = Boolean(selectedKey);
            const isCorrect = selectedKey === prompt.correctAnswer;

            return (
              <div key={prompt.id} className="flex flex-col gap-4">
                {/* Question Prompt */}
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-black text-sm text-primary mt-0.5">
                    {idx + 1}
                  </span>
                  <h3
                    lang="en"
                    dir="ltr"
                    ref={questionRef}
                    tabIndex={-1}
                    className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary text-base sm:text-lg font-bold text-foreground leading-snug"
                  >
                    {prompt.question}
                  </h3>
                </div>

                {hasOptions ? (
                  /* Multiple-choice option group */
                  <ChoiceOptionGroup
                    label={prompt.question}
                    value={selectedKey}
                    onChange={(value) => handleSelectOption(prompt.id, value)}
                    correctValue={prompt.correctAnswer}
                    revealFeedback={isAnswered}
                    options={prompt.options!.map((option) => ({
                      value: option.key,
                      label: (
                        <bdi lang="en" dir="ltr">
                          {option.text}
                        </bdi>
                      ),
                      accessibleLabel: option.text,
                      prefix: option.key,
                    }))}
                  />
                ) : (
                  <ChoiceOptionGroup
                    label={prompt.question}
                    value={selectedKey}
                    onChange={(value) => handleSelectOption(prompt.id, value)}
                    options={[
                      {
                        value: "agree",
                        label: t("business.choiceAgree"),
                        accessibleLabel: t("business.choiceAgree"),
                      },
                      {
                        value: "unsure",
                        label: t("business.choiceUnsure"),
                        accessibleLabel: t("business.choiceUnsure"),
                      },
                      {
                        value: "disagree",
                        label: t("business.choiceDisagree"),
                        accessibleLabel: t("business.choiceDisagree"),
                      },
                    ]}
                    className="grid gap-2 sm:grid-cols-3"
                  />
                )}

                {/* Instant Feedback Card with Strategic Rationale */}
                {isAnswered && prompt.explanation && (
                  <div
                    aria-live="polite"
                    className="mt-2 flex items-start gap-3 rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4 sm:p-5 shadow-wp-xs"
                  >
                    <Lightbulb className="size-5 shrink-0 text-primary mt-0.5" aria-hidden />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h4 className="font-black text-sm sm:text-base text-foreground uppercase tracking-wider">
                          {t("business.warmup.feedbackTitle")}
                        </h4>
                        {prompt.correctAnswer && (
                          <span className="rounded-md bg-secondary px-2 py-0.5 text-sm font-black text-primary uppercase tracking-wide">
                            {isCorrect
                              ? t("business.warmup.recommendedBadge")
                              : t("business.warmup.bestPracticeOption", {
                                  option: prompt.correctAnswer,
                                })}
                          </span>
                        )}
                      </div>
                      <p className="wp-prose text-base sm:text-base font-medium text-foreground leading-relaxed">
                        <bdi lang="en" dir="ltr">
                          {prompt.explanation}
                        </bdi>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <nav
        aria-label={t("courseLesson.questionNavigation")}
        className="flex flex-wrap justify-between gap-3"
      >
        <button
          type="button"
          disabled={activeIdx === 0}
          onClick={() => setActiveIdx(activeIdx - 1)}
          className="min-h-11 rounded-xl border border-border px-4 py-2 font-bold disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("quiz.previousQuestion")}
        </button>
        {activeIdx < prompts.length - 1 && (
          <button
            type="button"
            onClick={() => setActiveIdx(activeIdx + 1)}
            className="min-h-11 rounded-xl bg-primary px-4 py-2 font-bold text-primary-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {t("quiz.nextQuestion")}
          </button>
        )}
      </nav>
      {/* Continue Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 motion-safe:active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.warmup.continueToScenario")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
