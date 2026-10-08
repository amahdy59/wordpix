import { useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Eye,
  HelpCircle,
  Lightbulb,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { useI18n } from "../../../../i18n";
import { getHadithReviewIntervalDays, type HadithConfidence } from "../hadithProgress";
import type { ParsedReviewItem, ParsedSpeakTask } from "../hadithLessonContent";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  reviewItems: ParsedReviewItem[];
  speakTask?: ParsedSpeakTask;
  lessonTitle: string;
  translation: string;
  confidence: HadithConfidence | null;
  practiceScore: number;
  onSelectConfidence: (confidence: HadithConfidence) => void;
  confidenceError?: boolean;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithReviewStage({
  reviewItems,
  speakTask,
  lessonTitle,
  translation,
  confidence,
  practiceScore,
  onSelectConfidence,
  confidenceError,
}: Props) {
  const { t } = useI18n();

  // Track which active retrieval items have had their model answer revealed
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});
  // Self-rating tracker: index -> "got-it" | "need-review"
  const [selfRatings, setSelfRatings] = useState<Record<number, "got-it" | "need-review">>({});
  const [questionIndex, setQuestionIndex] = useState(0);

  const toggleReveal = (index: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleSelfRating = (index: number, rating: "got-it" | "need-review") => {
    setSelfRatings((prev) => ({ ...prev, [index]: rating }));
  };

  const sourceExcerpt = `${translation.split(/(?<=[.!?])\s+/)[0] ?? translation}`;
  const discussionQuestion =
    speakTask?.description && speakTask.description.length > 25
      ? speakTask.description
      : t("hadith.discussionApplyQuestion", { title: lessonTitle }) ||
        `How does the core teaching of "${lessonTitle}" guide practical everyday decisions?`;

  const discussionAnswer =
    (speakTask?.modelDialogue?.length ? speakTask.modelDialogue.join("\n\n") : undefined) ??
    t("hadith.discussionExplainAnswer", { excerpt: sourceExcerpt }) ??
    "Reflect on applying this guidance with clear intention in personal and community interactions.";

  return (
    <section className="wp-container-reading space-y-8" aria-labelledby="stage-review-heading">
      {/* Stage Header */}
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
            <Target className="size-3.5" aria-hidden />
            {t("hadith.stageLabels.review") || "Review & Apply"}
          </span>
        </div>

        <h2
          id="stage-review-heading"
          tabIndex={-1}
          className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
        >
          {t("hadith.pilot.review.title") || "Retrieve, check, and plan your review"}
        </h2>

        <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
          {t("hadith.pilot.review.description") ||
            "Answer from memory before revealing each model answer. This active retrieval strengthens recall more than passive rereading."}
        </p>
      </header>

      {/* Part 1: Active Retrieval Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black uppercase tracking-wider text-muted-foreground">
            {t("hadith.retrievalQuestions") || "Part 1 · Active Retrieval"}
          </h3>
          <span className="text-xs font-bold text-muted-foreground">
            {t("hadith.checkedCount", {
              checked: Object.keys(selfRatings).length,
              total: reviewItems.length,
            }) || `${Object.keys(selfRatings).length} / ${reviewItems.length}`}
          </span>
        </div>

        <div className="space-y-4">
          {reviewItems.slice(questionIndex, questionIndex + 1).map((item) => {
            const index = questionIndex;
            const isRevealed = Boolean(revealedAnswers[index]);
            const rating = selfRatings[index];

            return (
              <article
                key={index}
                className="overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-wp-xs transition-colors sm:p-6"
              >
                {/* Question Row */}
                <div className="flex items-start gap-3.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-black text-foreground leading-snug sm:text-lg">
                      {item.question}
                    </p>

                    {item.hint && (
                      <details className="group mt-2">
                        <summary
                          className={`inline-flex min-h-11 cursor-pointer list-none items-center gap-1.5 text-xs font-bold text-primary hover:underline ${focusRing}`}
                        >
                          <HelpCircle className="size-3.5" aria-hidden />
                          <span>{t("hadith.hintLabel") || "Need a hint?"}</span>
                        </summary>
                        <p className="mt-1.5 rounded-xl bg-muted/60 p-3 text-xs font-medium text-foreground">
                          {item.hint}
                        </p>
                      </details>
                    )}
                  </div>
                </div>

                {/* Model Answer Toggle */}
                <div className="mt-4 border-t border-border pt-4">
                  {!isRevealed ? (
                    <button
                      type="button"
                      onClick={() => toggleReveal(index)}
                      className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-4 py-2 text-xs font-black text-foreground transition-all hover:border-primary/50 hover:bg-muted active:scale-[0.98] ${focusRing}`}
                    >
                      <Eye className="size-4 text-primary" aria-hidden />
                      <span>{t("hadith.revealModelAnswer") || "Check Model Answer"}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <p className="text-xs font-black uppercase tracking-wider text-primary">
                          {t("hadith.modelLabel") || "Model Answer"}
                        </p>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground">
                          {item.answer}
                        </p>
                        {item.feedback && (
                          <div className="mt-2.5 flex items-start gap-2 border-t border-primary/10 pt-2.5 text-xs font-medium text-muted-foreground">
                            <Lightbulb className="size-4 shrink-0 text-primary" aria-hidden />
                            <span>{item.feedback}</span>
                          </div>
                        )}
                      </div>

                      {/* Self-Rating Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-xs font-bold text-muted-foreground me-2">
                          {t("hadith.howDidYouDo") || "How did you do?"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelfRating(index, "got-it")}
                          aria-pressed={rating === "got-it"}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${focusRing} ${
                            rating === "got-it"
                              ? "bg-feedback-success-surface text-feedback-success-foreground border border-feedback-success-border font-black"
                              : "border border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          <Check className="size-3.5" aria-hidden />
                          <span>{t("hadith.gotIt") || "I knew it"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelfRating(index, "need-review")}
                          aria-pressed={rating === "need-review"}
                          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-black transition-colors ${focusRing} ${
                            rating === "need-review"
                              ? "bg-feedback-warning-surface text-feedback-warning-foreground border border-feedback-warning-border font-black"
                              : "border border-border bg-background text-foreground hover:bg-muted"
                          }`}
                        >
                          <RotateCcw className="size-3.5" aria-hidden />
                          <span>{t("hadith.needReview") || "Need review"}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <nav
          className="flex flex-wrap justify-between gap-3"
          aria-label={t("hadith.retrievalQuestions")}
        >
          <button
            type="button"
            disabled={questionIndex === 0}
            onClick={() => setQuestionIndex((index) => index - 1)}
            className={`min-h-11 rounded-xl border border-border px-4 font-bold text-foreground disabled:opacity-50 ${focusRing}`}
          >
            {t("quiz.previousQuestion")}
          </button>
          <span className="self-center text-sm font-bold text-muted-foreground" role="status">
            {t("quiz.questionOf", { current: questionIndex + 1, total: reviewItems.length })}
          </span>
          <button
            type="button"
            disabled={questionIndex >= reviewItems.length - 1}
            onClick={() => setQuestionIndex((index) => index + 1)}
            className={`min-h-11 rounded-xl border border-border px-4 font-bold text-foreground disabled:opacity-50 ${focusRing}`}
          >
            {t("quiz.nextQuestion")}
          </button>
        </nav>
      </div>

      {/* Part 2: Practical Application & Reflection */}
      <section
        className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-7"
        aria-labelledby="discussion-apply-heading"
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="size-5 text-primary" aria-hidden />
          <h3 id="discussion-apply-heading" className="text-lg font-black text-foreground">
            {t("hadith.discussionLabel") || "Part 2 · Practical Application & Discussion"}
          </h3>
        </div>

        <p className="mt-3 text-sm font-semibold leading-relaxed text-foreground">
          {discussionQuestion}
        </p>

        {speakTask?.frames && speakTask.frames.length > 0 && (
          <div className="mt-4 rounded-xl border border-border bg-background/80 p-4">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
              {t("hadith.sentenceFrame") || "Useful sentence starter"}
            </span>
            <p className="mt-1 font-mono text-xs font-bold text-primary">
              {speakTask.frames.join(" / ")}
            </p>
          </div>
        )}

        <details className="group mt-4 rounded-xl border border-border bg-background/50">
          <summary
            className={`flex min-h-11 cursor-pointer list-none items-center justify-between px-4 py-2.5 text-xs font-black text-primary transition-colors hover:bg-muted ${focusRing}`}
          >
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5" aria-hidden />
              {t("hadith.showSampleAnswer") || "View sample reflection"}
            </span>
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-border p-4 text-xs font-medium leading-relaxed text-foreground">
            {discussionAnswer}
          </div>
        </details>
      </section>

      {/* Part 3: Metacognitive Confidence Rating */}
      <fieldset
        id="confidence-section"
        tabIndex={-1}
        aria-describedby={confidenceError ? "confidence-error-message" : undefined}
        className="rounded-3xl border-2 border-primary/25 bg-card p-6 shadow-wp-sm sm:p-8"
        aria-labelledby="confidence-heading"
      >
        <legend
          id="confidence-heading"
          className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-wider text-primary"
        >
          <CheckCircle2 className="size-4" aria-hidden />
          {t("hadith.confidenceHeading") || "How ready do you feel?"}
        </legend>

        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          {t("hadith.confidenceDescription") ||
            "Your rating schedules your next spaced-repetition review."}
        </p>

        <ChoiceOptionGroup
          label={t("hadith.confidenceHeading") || "How ready do you feel?"}
          value={confidence ?? undefined}
          onChange={onSelectConfidence}
          className="mt-5 grid gap-3 sm:grid-cols-3"
          options={(["again", "supported", "ready"] as const).map((value) => {
            const reviewDays = getHadithReviewIntervalDays(practiceScore, value);
            return {
              value,
              label:
                t(`hadith.confidence.${value}`) ||
                (value === "again"
                  ? "I need more practice"
                  : value === "supported"
                    ? "I can continue with support"
                    : "I feel ready"),
              accessibleLabel: t(`hadith.confidence.${value}`) || value,
              secondary:
                reviewDays === 1
                  ? t("hadith.reviewTomorrow") || "Review tomorrow"
                  : t("hadith.reviewInDays", { days: reviewDays }) ||
                    `Review in ${reviewDays} days`,
            };
          })}
        />

        {confidenceError && (
          <p
            id="confidence-error-message"
            className="mt-4 rounded-xl border border-feedback-error-border bg-feedback-error-surface p-3 text-sm font-bold text-feedback-error-foreground"
            role="alert"
          >
            {t("hadith.chooseConfidence") ||
              "Choose a confidence level before completing the lesson."}
          </p>
        )}

        {confidence && (
          <p
            className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm font-bold text-foreground"
            role="status"
          >
            {getHadithReviewIntervalDays(practiceScore, confidence) === 1
              ? t("hadith.reviewPlanTomorrowConfirmed") ||
                "Review scheduled for tomorrow. We'll prioritize this Hadith in your daily reviews."
              : t("hadith.reviewPlanConfirmed", {
                  days: getHadithReviewIntervalDays(practiceScore, confidence),
                }) ||
                `Review scheduled in ${getHadithReviewIntervalDays(
                  practiceScore,
                  confidence
                )} days. You can revisit this anytime from your curriculum.`}
          </p>
        )}
      </fieldset>
    </section>
  );
}
