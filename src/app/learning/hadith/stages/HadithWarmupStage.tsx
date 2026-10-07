import { useState } from "react";
import {
  ArrowDown,
  BookOpen,
  ChevronDown,
  Lightbulb,
  MessageSquareQuote,
  Sparkles,
} from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { ParsedWarmup } from "../hadithLessonContent";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";

interface Props {
  warmup: ParsedWarmup;
  selectedChoice?: string | null;
  onChoiceSelect?: (choice: string) => void;
  onProceedToText?: () => void;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithWarmupStage({
  warmup,
  selectedChoice,
  onChoiceSelect,
  onProceedToText,
}: Props) {
  const { t } = useI18n();
  const [internalChoice, setInternalChoice] = useState<string | null>(null);
  const activeChoice = selectedChoice ?? internalChoice;

  const handleSelect = (choice: string) => {
    setInternalChoice(choice);
    onChoiceSelect?.(choice);
  };

  return (
    <section
      className="wp-container-content relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
      aria-labelledby="stage-warmup-heading"
    >
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" aria-hidden />
          {t("hadith.pilot.warmup.eyebrow") || "Notice Before Reading"}
        </span>

        {onProceedToText && (
          <button
            type="button"
            onClick={onProceedToText}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-background px-3.5 py-1.5 text-xs font-black text-foreground transition-colors hover:border-primary/40 hover:bg-muted ${focusRing}`}
          >
            <BookOpen className="size-3.5 text-primary" aria-hidden />
            <span>{t("hadith.proceedToText") || "Jump to Hadith Text"}</span>
            <ArrowDown className="size-3.5 text-muted-foreground" aria-hidden />
          </button>
        )}
      </div>

      <h2
        id="stage-warmup-heading"
        tabIndex={-1}
        className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
      >
        {warmup.title}
      </h2>

      <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-muted-foreground">
        {t("hadith.pilot.warmup.description") ||
          "Start with a familiar reflection. There is no score here—the goal is to activate your prior knowledge before reading."}
      </p>

      {/* Main Two-Column Grid on Desktop for Balanced Visual Density */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.15fr] lg:items-start">
        {/* Left Column: Scenario & Preview Terms */}
        <div className="space-y-5">
          <div className="flex gap-4 rounded-2xl border border-border border-s-4 border-s-primary bg-muted/40 p-5">
            <MessageSquareQuote className="mt-0.5 size-6 shrink-0 text-primary" aria-hidden />
            <div className="space-y-2">
              <p className="text-base font-black leading-snug text-foreground">{warmup.scenario}</p>
              {warmup.prompt && (
                <p className="text-sm font-semibold leading-relaxed text-muted-foreground">
                  {warmup.prompt}
                </p>
              )}
            </div>
          </div>

          {warmup.previewTerms.length > 0 && (
            <details
              open
              className="group overflow-hidden rounded-2xl border border-border bg-background transition-colors"
            >
              <summary
                className={`flex min-h-12 cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-black text-foreground transition-colors hover:bg-muted/50 ${focusRing}`}
              >
                <span className="inline-flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" aria-hidden />
                  {t("hadith.pilot.warmup.previewTitle") || "Preview key expressions"}
                </span>
                <ChevronDown
                  className="size-4 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none group-open:rotate-180"
                  aria-hidden
                />
              </summary>
              <div className="border-t border-border p-4">
                <dl className="grid gap-2.5">
                  {warmup.previewTerms.map((item) => (
                    <div
                      key={item.term}
                      className="flex flex-col gap-0.5 rounded-xl border border-border/80 bg-muted/30 px-3.5 py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3"
                    >
                      <dt className="shrink-0 text-sm font-black text-primary" lang="en" dir="ltr">
                        {item.term}
                      </dt>
                      <dd className="text-xs font-semibold leading-relaxed text-muted-foreground sm:text-end">
                        {item.meaning}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </details>
          )}
        </div>

        {/* Right Column: Interactive Self-Check Poll */}
        <div className="rounded-2xl border border-border bg-background/60 p-5 sm:p-6">
          <fieldset role="radiogroup" aria-labelledby="warmup-question-legend">
            <legend
              id="warmup-question-legend"
              className="text-base font-black leading-snug text-foreground sm:text-lg"
            >
              {warmup.question}
            </legend>

            <ChoiceOptionGroup
              label={warmup.question}
              value={activeChoice ?? undefined}
              onChange={handleSelect}
              options={warmup.choices.map((choice, idx) => ({
                value: choice,
                label: choice,
                accessibleLabel: `${String.fromCharCode(65 + idx)}: ${choice}`,
                prefix: String.fromCharCode(65 + idx),
              }))}
              className="mt-4 grid gap-2.5"
            />
          </fieldset>

          {/* Immediate Pedagogical Feedback */}
          {activeChoice && (
            <div
              role="status"
              className="mt-4 flex flex-col gap-3 rounded-2xl border border-feedback-success-border bg-feedback-success-surface p-4 text-feedback-success-foreground shadow-wp-xs sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <Lightbulb
                  className="mt-0.5 size-5 shrink-0 text-feedback-success-foreground"
                  aria-hidden
                />
                <p className="text-xs font-bold leading-relaxed sm:text-sm">
                  {warmup.feedback ||
                    t("hadith.pilot.warmup.feedback") ||
                    "The action can look identical while the intention changes. Keep that contrast in mind as you read and listen."}
                </p>
              </div>

              {onProceedToText && (
                <button
                  type="button"
                  onClick={onProceedToText}
                  className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-black text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 ${focusRing}`}
                >
                  <span>{t("hadith.proceedToText") || "Read Hadith"}</span>
                  <ArrowDown className="size-3.5" aria-hidden />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
