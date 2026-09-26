import { useState } from "react";
import {
  MessageSquare,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Lightbulb,
  Check,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { resolveAssetUrl } from "../../../../utils/assetUrl";

interface Props {
  unit: BusinessUnit;
  savedNotes?: Record<string, string>;
  onSaveNote: (promptId: string, note: string) => void;
  onNext: () => void;
}

export function BusinessWarmupStage({ unit, savedNotes = {}, onSaveNote, onNext }: Props) {
  const { t } = useI18n();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(savedNotes);

  const handleSelectOption = (promptId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [promptId]: optionKey }));
    onSaveNote(promptId, optionKey);
  };

  const prompts = unit.warmup?.prompts || [];
  const answeredCount = prompts.filter((p) => Boolean(selectedAnswers[p.id])).length;
  const allAnswered = prompts.length > 0 && answeredCount === prompts.length;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <MessageSquare className="size-4" aria-hidden />
          {t("business.warmup.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
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
          <p className="text-xs font-black uppercase tracking-widest text-primary">
            {t("business.warmup.essentialQuestion")}
          </p>
          <h1
            id="big-question-heading"
            className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-snug"
          >
            {`“${unit.essentialQuestion}”`}
          </h1>
          {unit.speakingGoal && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-primary/10 p-3.5 text-sm font-semibold text-primary">
              <CheckCircle2 className="size-5 shrink-0 mt-0.5" aria-hidden />
              <div>
                <span className="font-black uppercase tracking-wide me-1.5">
                  {t("business.warmup.speakingGoalLabel")}
                </span>
                <span>{unit.speakingGoal}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Multiple-Choice Warm-up Workplace Scenarios */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-wp-xs"
        aria-labelledby="reflection-prompts-title"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
          <div>
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-primary" aria-hidden />
              <h2
                id="reflection-prompts-title"
                className="text-lg sm:text-xl font-black text-foreground"
              >
                {t("business.warmup.reflectHeading")}
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground font-medium">
              {t("business.warmup.instructionsFallback")}
            </p>
          </div>

          <span
            className={`self-start sm:self-auto shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black transition-colors ${
              allAnswered
                ? "bg-accent/15 text-accent border border-accent/30"
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

        <div className="mt-6 flex flex-col gap-8">
          {prompts.map((prompt, idx) => {
            const hasOptions = Array.isArray(prompt.options) && prompt.options.length > 0;
            const selectedKey = selectedAnswers[prompt.id];
            const isAnswered = Boolean(selectedKey);
            const isCorrect = selectedKey === prompt.correctAnswer;

            return (
              <div
                key={prompt.id}
                className="flex flex-col gap-4 rounded-2xl border border-border/80 bg-muted/20 p-4 sm:p-6 transition-all focus-within:border-primary/60 focus-within:bg-card"
              >
                {/* Question Prompt */}
                <div className="flex items-start gap-3">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary mt-0.5">
                    {idx + 1}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                    {prompt.question}
                  </h3>
                </div>

                {hasOptions ? (
                  /* Multiple-choice option group */
                  <div
                    role="radiogroup"
                    aria-label={`Question ${idx + 1}: ${prompt.question}`}
                    className="flex flex-col gap-2.5 pt-1"
                  >
                    {prompt.options!.map((option) => {
                      const isOptionSelected = selectedKey === option.key;
                      const isOptionRecommended = option.key === prompt.correctAnswer;

                      let buttonClasses =
                        "group relative flex min-h-[52px] w-full items-start gap-3.5 rounded-2xl border p-3.5 sm:p-4 text-start transition-all cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ";

                      if (!isOptionSelected) {
                        buttonClasses +=
                          "border-border bg-card hover:border-primary/50 hover:bg-muted/40 text-foreground";
                      } else if (isOptionRecommended) {
                        buttonClasses +=
                          "border-accent bg-accent/10 text-foreground ring-2 ring-accent/30 shadow-wp-xs";
                      } else {
                        buttonClasses +=
                          "border-primary bg-primary/10 text-foreground ring-2 ring-primary/30 shadow-wp-xs";
                      }

                      return (
                        <button
                          key={option.key}
                          type="button"
                          role="radio"
                          aria-checked={isOptionSelected}
                          onClick={() => handleSelectOption(prompt.id, option.key)}
                          className={buttonClasses}
                        >
                          {/* Option Prefix Badge: A, B, C */}
                          <span
                            className={`flex size-7 shrink-0 items-center justify-center rounded-xl font-black text-xs transition-colors ${
                              isOptionSelected
                                ? isOptionRecommended
                                  ? "bg-accent text-accent-foreground shadow-wp-xs"
                                  : "bg-primary text-primary-foreground shadow-wp-xs"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                            }`}
                          >
                            {isOptionSelected && isOptionRecommended ? (
                              <Check className="size-4 stroke-[3]" aria-hidden />
                            ) : (
                              option.key
                            )}
                          </span>

                          {/* Option Content */}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm sm:text-base font-semibold text-foreground leading-relaxed block">
                              {option.text}
                            </span>

                            {/* Status badge when selected */}
                            {isOptionSelected && (
                              <div className="mt-1.5 flex items-center gap-1.5">
                                {isOptionRecommended ? (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-accent/20 px-2 py-0.5 text-[11px] font-black text-accent uppercase tracking-wider">
                                    <CheckCircle2 className="size-3" aria-hidden />
                                    {t("business.warmup.recommendedBadge")}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-primary/20 px-2 py-0.5 text-[11px] font-black text-primary uppercase tracking-wider">
                                    {t("business.warmup.alternativeBadge")}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  /* Fallback open textarea if no options */
                  <textarea
                    id={prompt.id}
                    rows={2}
                    value={selectedKey || ""}
                    onChange={(e) => handleSelectOption(prompt.id, e.target.value)}
                    placeholder="Type your reflection notes or key takeaways here..."
                    className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                        <h4 className="font-black text-xs sm:text-sm text-foreground uppercase tracking-wider">
                          {t("business.warmup.feedbackTitle")}
                        </h4>
                        {prompt.correctAnswer && (
                          <span className="rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-black text-primary uppercase tracking-wide">
                            {isCorrect
                              ? t("business.warmup.recommendedBadge")
                              : `Best Practice: Option ${prompt.correctAnswer}`}
                          </span>
                        )}
                      </div>
                      <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
                        {prompt.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Continue Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.warmup.continueToScenario")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
