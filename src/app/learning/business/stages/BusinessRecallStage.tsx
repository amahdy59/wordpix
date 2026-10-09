import { useState } from "react";
import { Zap, HelpCircle, CheckCircle2, ArrowRight, Star, RotateCcw } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit, BusinessRecallPrompt } from "../businessTypes";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
  onRecordSrsConfidence?: (term: string, confidence: "again" | "hard" | "easy") => void;
}

export function BusinessRecallStage({ unit, onNext, onRecordSrsConfidence }: Props) {
  const { t } = useI18n();
  const recallConfig = unit.recall;
  const prompts: BusinessRecallPrompt[] = recallConfig?.prompts || [];

  const [activeIdx, setActiveIdx] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [submittedPromptIds, setSubmittedPromptIds] = useState<Set<string>>(new Set());
  const [confidenceRatings, setConfidenceRatings] = useState<
    Record<string, "again" | "hard" | "easy">
  >({});

  if (!recallConfig || prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-xl mx-auto gap-4">
        <Zap className="size-10 text-primary" aria-hidden />
        <h2 className="wp-type-stage-title font-black text-foreground">
          {t("business.recall.noRecallTitle")}
        </h2>
        <p className="text-base text-muted-foreground">{t("business.recall.noRecallBody")}</p>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105"
        >
          <span>{t("business.recall.beginWarmup")}</span>
          <ArrowRight className="size-4 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    );
  }

  const currentPrompt = prompts[activeIdx];
  const isSubmitted = currentPrompt ? submittedPromptIds.has(currentPrompt.id) : false;
  const totalCompleted = submittedPromptIds.size;
  const isAllCompleted = totalCompleted === prompts.length;

  const handleCheck = () => {
    if (!currentPrompt) return;
    setSubmittedPromptIds((prev) => new Set(prev).add(currentPrompt.id));
  };

  const handleRateConfidence = (rating: "again" | "hard" | "easy") => {
    if (!currentPrompt) return;
    setConfidenceRatings((prev) => ({ ...prev, [currentPrompt.targetWord]: rating }));
    onRecordSrsConfidence?.(currentPrompt.targetWord, rating);

    if (activeIdx < prompts.length - 1) {
      setActiveIdx((prev) => prev + 1);
      setTypedAnswer("");
      setSelectedOption(null);
      setShowHint(false);
    }
  };

  const handleReset = () => {
    setActiveIdx(0);
    setTypedAnswer("");
    setSelectedOption(null);
    setShowHint(false);
    setSubmittedPromptIds(new Set());
  };

  const progressPercent = Math.round((totalCompleted / prompts.length) * 100);

  return (
    <div className="wp-container-content flex flex-col gap-6 py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-primary">
          <Zap className="size-4" aria-hidden />
          {t("business.recall.stageTag")}
        </span>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-sm font-black text-primary uppercase">
            {t("business.recall.srBadge")}
          </span>
          <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">
            {t("business.recall.sourceUnitLang", { number: recallConfig.sourceUnitNumber })}
          </span>
        </div>
      </div>

      {/* Hero Meta Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        aria-labelledby="recall-header-heading"
      >
        <div>
          <div className="flex items-center gap-2">
            <h2
              id="recall-header-heading"
              className="wp-type-stage-title font-black text-foreground"
            >
              {t("business.recall.heading", {
                number: recallConfig.sourceUnitNumber,
                title: recallConfig.sourceUnitTitle,
              })}
            </h2>
          </div>
          <p className="mt-1 text-base text-muted-foreground font-medium">
            {t("business.recall.estimatedNote", { minutes: recallConfig.estimatedMinutes || 3 })}
          </p>
        </div>

        {/* Progress Display */}
        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <span className="text-sm font-black text-foreground">
            {t("business.recall.promptsCompleted", {
              completed: totalCompleted,
              total: prompts.length,
            })}
          </span>
          <div className="w-36 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Active Prompt Card */}
      {!isAllCompleted && currentPrompt && (
        <section
          className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-card p-6 sm:p-8 shadow-wp-sm"
          aria-labelledby={`prompt-title-${currentPrompt.id}`}
        >
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-secondary px-2.5 py-0.5 text-sm font-black text-primary uppercase">
                {currentPrompt.promptTypeLabel}
              </span>
              <span className="text-sm font-bold text-muted-foreground">
                {t("business.recall.promptProgress", {
                  current: activeIdx + 1,
                  total: prompts.length,
                })}
              </span>
            </div>

            {isSubmitted && (
              <span className="inline-flex items-center gap-1 text-sm font-black uppercase text-feedback-success-foreground bg-feedback-success-surface px-2.5 py-1 rounded-full">
                <CheckCircle2 className="size-3.5" aria-hidden />
                {t("business.recall.answerRevealed")}
              </span>
            )}
          </div>

          <h2
            id={`prompt-title-${currentPrompt.id}`}
            className="wp-type-stage-title font-black text-foreground tracking-tight leading-snug"
          >
            {currentPrompt.question}
          </h2>

          {/* User Response Area */}
          <div className="mt-6 flex flex-col gap-4">
            {/* Multiple Choice Mode */}
            {currentPrompt.options && currentPrompt.options.length > 0 ? (
              <ChoiceOptionGroup
                label={t("business.recall.choicesLabel")}
                value={selectedOption ?? undefined}
                onChange={(value) => {
                  setSelectedOption(value);
                  setTypedAnswer(value);
                }}
                disabled={isSubmitted}
                correctValue={currentPrompt.correctAnswer}
                revealFeedback={isSubmitted}
                className="grid gap-3 sm:grid-cols-2"
                options={currentPrompt.options.map((option, index) => ({
                  value: option,
                  label: option,
                  accessibleLabel: `${index + 1}: ${option}`,
                  prefix: String(index + 1),
                }))}
              />
            ) : (
              /* Open Text Input Mode */
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={`input-${currentPrompt.id}`}
                  className="text-sm font-black uppercase text-muted-foreground"
                >
                  {t("business.recall.yourAnswerLabel")}
                </label>
                <input
                  id={`input-${currentPrompt.id}`}
                  type="text"
                  disabled={isSubmitted}
                  value={typedAnswer}
                  onChange={(e) => setTypedAnswer(e.target.value)}
                  placeholder={t("business.recall.inputPlaceholder")}
                  className="w-full min-h-[44px] rounded-xl border border-input bg-background p-3.5 text-base font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            )}

            {/* Hint Display */}
            {showHint && currentPrompt.hint && (
              <div className="flex items-start gap-2 rounded-xl bg-secondary p-3.5 text-sm sm:text-base font-semibold text-primary border border-primary/20">
                <HelpCircle className="size-4 shrink-0 mt-0.5" aria-hidden />
                <span>{t("business.recall.hintText", { hint: currentPrompt.hint })}</span>
              </div>
            )}

            {/* Action Bar */}
            {!isSubmitted ? (
              <div className="flex items-center justify-between gap-3 pt-2">
                {currentPrompt.hint ? (
                  <button
                    type="button"
                    onClick={() => setShowHint(true)}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="size-4" aria-hidden />
                    <span>{t("business.recall.needHint")}</span>
                  </button>
                ) : (
                  <span />
                )}

                <button
                  type="button"
                  disabled={!typedAnswer.trim() && !selectedOption}
                  onClick={handleCheck}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-bold text-primary-foreground shadow-wp-xs hover:brightness-105 motion-safe:active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span>{t("business.recall.checkAnswer")}</span>
                </button>
              </div>
            ) : (
              /* Answer Feedback & Confidence Rating */
              <div className="flex flex-col gap-4 rounded-2xl bg-card border border-border p-5 mt-2 shadow-wp-xs">
                <div>
                  <span className="text-sm font-black uppercase tracking-wider text-primary block">
                    {t("business.recall.targetExpressionLabel")}
                  </span>
                  <p className="text-xl font-black text-foreground capitalize mt-0.5">
                    {`“${currentPrompt.targetWord}”`}
                  </p>
                  {currentPrompt.definition && (
                    <p className="text-base font-medium text-muted-foreground mt-1">
                      <span className="font-bold text-foreground">
                        {t("business.recall.definitionPrefix")}
                      </span>
                      {currentPrompt.definition}
                    </p>
                  )}
                  {currentPrompt.modelSentence && (
                    <div className="mt-2 rounded-xl bg-secondary border border-primary/10 p-3 text-sm sm:text-base font-semibold italic text-primary">
                      {currentPrompt.modelSentence}
                    </div>
                  )}
                </div>

                {/* Spaced Repetition Confidence Buttons */}
                <div className="pt-3 border-t border-border/80">
                  <p className="text-sm font-black uppercase tracking-wider text-muted-foreground mb-2">
                    {t("business.recall.selfRatingPrompt")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleRateConfidence("again")}
                      className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-sm font-bold text-destructive hover:bg-destructive/20 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-destructive"
                    >
                      <span className="font-black text-base">
                        {t("business.recall.ratingAgain")}
                      </span>
                      <span className="text-sm font-semibold opacity-80">
                        {t("business.recall.reviewSoon")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateConfidence("hard")}
                      className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-secondary bg-secondary/30 px-3 py-2 text-center text-sm font-bold text-foreground hover:bg-secondary/50 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className="font-black text-base">
                        {t("business.recall.ratingHard")}
                      </span>
                      <span className="text-sm font-semibold opacity-80">
                        {t("business.recall.reviewSoon")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRateConfidence("easy")}
                      className="inline-flex min-h-[44px] flex-col items-center justify-center rounded-xl border border-accent/30 bg-feedback-success-surface px-3 py-2 text-center text-sm font-bold text-feedback-success-foreground hover:bg-feedback-success-surface transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                    >
                      <span className="font-black text-base">
                        {t("business.recall.ratingEasy")}
                      </span>
                      <span className="text-sm font-semibold opacity-80">
                        {t("business.recall.reviewLater")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Completion Card */}
      {isAllCompleted && (
        <section
          className="rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-accent/15 via-card to-card p-6 sm:p-8 shadow-wp-sm flex flex-col gap-4"
          aria-labelledby="spaced-mastery-title"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-feedback-success-surface text-feedback-success-foreground">
              <Star className="size-6" aria-hidden />
            </div>
            <div>
              <h2
                id="spaced-mastery-title"
                className="wp-type-stage-title font-black text-foreground"
              >
                {t("business.recall.masteryCompletedTitle")}
              </h2>
              <p className="text-base font-semibold text-muted-foreground">
                {t("business.recall.masteryCompletedSubtitle", {
                  count: prompts.length,
                  number: recallConfig.sourceUnitNumber,
                })}
              </p>
            </div>
          </div>

          <p className="wp-prose text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
            {t("business.recall.masteryCompletedNote")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/80">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border px-4 py-2 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <RotateCcw className="size-4" aria-hidden />
              <span>{t("business.recall.reviewAgain")}</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto inline-flex min-h-[44px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 motion-safe:active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <span>{t("business.recall.beginLessonWarmup")}</span>
              <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
            </button>
          </div>
        </section>
      )}

      {/* Queued Prompts Preview */}
      {!isAllCompleted && prompts.length > 1 && (
        <section
          className="rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs"
          aria-labelledby="queued-prompts-heading"
        >
          <div className="flex items-center justify-between mb-3">
            <h3
              id="queued-prompts-heading"
              className="text-sm font-black uppercase tracking-wider text-muted-foreground"
            >
              {t("business.recall.remainingPrompts", { count: prompts.length - totalCompleted })}
            </h3>
            <span className="text-sm font-bold text-muted-foreground">
              {t("business.unitNumber", { number: recallConfig.sourceUnitNumber })}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {prompts.map((p, idx) => {
              const isDone = submittedPromptIds.has(p.id);
              const isCurrent = idx === activeIdx;
              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isCurrent
                      ? "border-primary/50 bg-secondary"
                      : isDone
                        ? "border-border/60 bg-muted/20 opacity-70"
                        : "border-border bg-muted/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-sm font-black text-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-foreground truncate">
                      {p.promptTypeLabel}
                    </span>
                  </div>

                  {isDone ? (
                    <span className="text-sm font-black text-feedback-success-foreground uppercase">
                      {confidenceRatings[p.targetWord]
                        ? `Rated ${confidenceRatings[p.targetWord]}`
                        : "Completed"}
                    </span>
                  ) : isCurrent ? (
                    <span className="text-sm font-black text-primary uppercase">
                      {t("business.recall.statusActive")}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">
                      {t("business.recall.statusQueued")}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
