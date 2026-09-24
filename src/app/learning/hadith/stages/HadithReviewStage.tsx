import { CheckCircle2, ChevronDown, HelpCircle, Lightbulb, Target } from "lucide-react";
import { useI18n } from "../../../../i18n";
import { getHadithReviewIntervalDays, type HadithConfidence } from "../hadithProgress";
import type { ParsedReviewItem } from "../hadithLessonContent";

interface Props {
  reviewItems: ParsedReviewItem[];
  confidence: HadithConfidence | null;
  practiceScore: number;
  onSelectConfidence: (confidence: HadithConfidence) => void;
  confidenceError?: boolean;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithReviewStage({
  reviewItems,
  confidence,
  practiceScore,
  onSelectConfidence,
  confidenceError,
}: Props) {
  const { t } = useI18n();

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6" aria-labelledby="stage-review-heading">
      <header className="rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
            <Target className="size-3.5" aria-hidden />
            {t("hadith.reviewTitle") || "Check Your Understanding"}
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
            "Answer from memory before opening each model answer. This active retrieval strengthens recall more than passive rereading."}
        </p>

        {/* Active Retrieval Cards */}
        <div className="mt-6 space-y-3.5">
          {reviewItems.map((item, index) => (
            <details
              key={index}
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-colors open:bg-muted/30"
            >
              <summary
                className={`flex min-h-12 cursor-pointer list-none items-center justify-between p-4 font-black text-foreground transition-colors hover:bg-muted/40 ${focusRing}`}
              >
                <div className="flex items-start gap-3 pe-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-foreground sm:text-base">
                    {item.question}
                  </span>
                </div>
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
                  aria-hidden
                />
              </summary>

              <div className="space-y-3 border-t border-border p-5">
                {item.hint && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <HelpCircle className="size-4 text-primary" aria-hidden />
                    <span>
                      <strong className="text-foreground">{t("hadith.hintLabel")}</strong>{" "}
                      {item.hint}
                    </span>
                  </div>
                )}

                {item.feedback && (
                  <div className="flex items-start gap-2 text-xs font-medium text-muted-foreground">
                    <Lightbulb className="size-4 shrink-0 text-primary" aria-hidden />
                    <span>{item.feedback}</span>
                  </div>
                )}

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs font-black uppercase tracking-wider text-primary">
                    {t("hadith.modelLabel") || "Model Answer"}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-relaxed text-foreground">
                    {item.answer}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>

        {/* Metacognitive Confidence Rating */}
        <fieldset
          className="mt-8 rounded-3xl border-2 border-primary/20 bg-background p-6 shadow-sm"
          role="radiogroup"
          aria-labelledby="confidence-heading"
        >
          <legend
            id="confidence-heading"
            className="flex items-center gap-2 px-2 text-xs font-black uppercase tracking-wider text-primary"
          >
            <CheckCircle2 className="size-4" aria-hidden />
            {t("hadith.confidenceHeading") || "How ready do you feel?"}
          </legend>

          <p className="mt-1 text-xs text-muted-foreground">{t("hadith.confidenceDescription")}</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["again", "supported", "ready"] as const).map((value) => {
              const isSelected = confidence === value;
              const reviewDays = getHadithReviewIntervalDays(practiceScore, value);
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onSelectConfidence(value)}
                  className={`flex min-h-12 items-center justify-center rounded-2xl border-2 px-4 py-3 text-center text-sm font-black transition-all active:scale-[0.98] ${focusRing} ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <span>
                    <span className="block">
                      {t(`hadith.confidence.${value}`) ||
                        (value === "again"
                          ? "I need more practice"
                          : value === "supported"
                            ? "I can continue with support"
                            : "I feel ready")}
                    </span>
                    <span
                      className={`mt-1 block text-xs ${isSelected ? "text-primary-foreground/90" : "text-muted-foreground"}`}
                    >
                      {reviewDays === 1
                        ? t("hadith.reviewTomorrow")
                        : t("hadith.reviewInDays", { days: reviewDays })}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {confidenceError && (
            <p className="mt-3 text-sm font-bold text-feedback-error-foreground" role="alert">
              {t("hadith.chooseConfidence") ||
                "Choose a confidence level before completing the lesson."}
            </p>
          )}
          {confidence && (
            <p
              className="mt-4 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-sm font-bold text-foreground"
              role="status"
            >
              {getHadithReviewIntervalDays(practiceScore, confidence) === 1
                ? t("hadith.reviewPlanTomorrowConfirmed")
                : t("hadith.reviewPlanConfirmed", {
                    days: getHadithReviewIntervalDays(practiceScore, confidence),
                  })}
            </p>
          )}
        </fieldset>
      </header>
    </section>
  );
}
