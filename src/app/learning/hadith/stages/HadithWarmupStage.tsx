import { useState } from "react";
import { ChevronDown, Lightbulb, MessageSquareQuote, Sparkles } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { ParsedWarmup } from "../hadithLessonContent";

interface Props {
  warmup: ParsedWarmup;
  selectedChoice?: string | null;
  onChoiceSelect?: (choice: string) => void;
}

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithWarmupStage({ warmup, selectedChoice, onChoiceSelect }: Props) {
  const { t } = useI18n();
  const [internalChoice, setInternalChoice] = useState<string | null>(null);
  const activeChoice = selectedChoice ?? internalChoice;

  const handleSelect = (choice: string) => {
    setInternalChoice(choice);
    onChoiceSelect?.(choice);
  };

  return (
    <section
      className="mx-auto w-full max-w-4xl rounded-3xl border border-border bg-card p-6 shadow-wp-sm sm:p-8"
      aria-labelledby="stage-warmup-heading"
    >
      {/* Eyebrow and Title */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
          <Sparkles className="size-3.5" aria-hidden />
          {t("hadith.pilot.warmup.eyebrow") || "Notice Before Reading"}
        </span>
      </div>

      <h2
        id="stage-warmup-heading"
        tabIndex={-1}
        className="mt-3 text-2xl font-black tracking-tight text-foreground outline-none sm:text-3xl"
      >
        {warmup.title}
      </h2>

      <p className="mt-2 text-sm font-semibold leading-relaxed text-muted-foreground">
        {t("hadith.pilot.warmup.description") ||
          "Start with a familiar situation. There is no score here—the goal is to activate your thinking."}
      </p>

      {/* Scenario / Real World Context */}
      <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-muted/60 p-5 sm:p-6">
        <MessageSquareQuote className="size-6 shrink-0 text-primary" aria-hidden />
        <div className="space-y-2">
          <p className="text-base font-black leading-snug text-foreground">{warmup.scenario}</p>
          {warmup.prompt && (
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              {warmup.prompt}
            </p>
          )}
        </div>
      </div>

      {/* Interactive Question with Radio Group */}
      <fieldset className="mt-7" role="radiogroup" aria-labelledby="warmup-question-legend">
        <legend id="warmup-question-legend" className="text-base font-black text-foreground">
          {warmup.question}
        </legend>

        <div className="mt-4 grid gap-3">
          {warmup.choices.map((choice) => {
            const isSelected = activeChoice === choice;
            return (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(choice)}
                className={`flex min-h-12 w-full items-center justify-between rounded-2xl border-2 px-5 py-3 text-start text-sm font-bold transition-all active:scale-[0.99] ${focusRing} ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
                }`}
              >
                <span>{choice}</span>
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                  aria-hidden
                >
                  {isSelected && <span className="size-2 rounded-full bg-primary-foreground" />}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* Immediate Pedagogical Feedback */}
      {activeChoice && (
        <div
          role="status"
          className="mt-6 flex gap-3.5 rounded-2xl border border-feedback-success-border bg-feedback-success-surface p-4 text-feedback-success-foreground shadow-sm"
        >
          <Lightbulb className="size-5 shrink-0 text-feedback-success-foreground" aria-hidden />
          <p className="text-sm font-semibold leading-relaxed">
            {warmup.feedback ||
              t("hadith.pilot.warmup.feedback") ||
              "The action can look identical while the intention changes. Keep that contrast in mind as you read and listen."}
          </p>
        </div>
      )}

      {/* Preview Key Ideas Drawer */}
      {warmup.previewTerms.length > 0 && (
        <details className="group mt-6 overflow-hidden rounded-2xl border border-border bg-background transition-colors open:bg-card">
          <summary
            className={`flex min-h-12 cursor-pointer list-none items-center justify-between p-4 font-black text-foreground transition-colors hover:bg-muted/50 ${focusRing}`}
          >
            <span>{t("hadith.pilot.warmup.previewTitle") || "Preview key expressions"}</span>
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="border-t border-border p-4">
            <dl className="grid gap-3 sm:grid-cols-3">
              {warmup.previewTerms.map((item) => (
                <div key={item.term} className="rounded-xl border border-border bg-muted/50 p-3.5">
                  <dt className="text-sm font-black text-primary" lang="en" dir="ltr">
                    {item.term}
                  </dt>
                  <dd className="mt-1 text-xs font-semibold leading-relaxed text-muted-foreground">
                    {item.meaning}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </details>
      )}
    </section>
  );
}
