import { useMemo } from "react";
import { Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

interface UsageMatrixCard {
  pattern: string;
  context?: string;
  example: string;
}

function parseUsageCards(details: string[]): UsageMatrixCard[] {
  const cleaned = details.filter((d) => d.trim() && d.trim().toLowerCase() !== "examples");
  if (cleaned.length === 0) return [];

  // Pattern A: 4-tuples with "CONTEXT" marker (e.g. ["work for", "CONTEXT", "Organisation / Employer", "I work for a training company."])
  if (cleaned.some((d) => d.toUpperCase() === "CONTEXT")) {
    const cards: UsageMatrixCard[] = [];
    for (let i = 0; i < cleaned.length; i += 4) {
      if (cleaned[i + 1]?.toUpperCase() === "CONTEXT") {
        cards.push({
          pattern: cleaned[i] || "",
          context: cleaned[i + 2] || "",
          example: cleaned[i + 3] || "",
        });
      }
    }
    if (cards.length > 0) return cards;
  }

  // Pattern B: 3-tuples (e.g. ["Level 1: Repeat", "Could you say that again?", "Use when you miss key vocabulary."])
  if (
    cleaned.length % 3 === 0 &&
    cleaned.length >= 6 &&
    cleaned[0].length < 30 &&
    cleaned[2].endsWith(".")
  ) {
    const cards: UsageMatrixCard[] = [];
    for (let i = 0; i < cleaned.length; i += 3) {
      cards.push({
        pattern: cleaned[i],
        context: cleaned[i + 1],
        example: cleaned[i + 2],
      });
    }
    return cards;
  }

  // Pattern C: 2-tuples [pattern, example] (e.g. ["Signpost", "Let's start with the testing update."])
  if (cleaned.length % 2 === 0 && cleaned[0].length < 45) {
    const cards: UsageMatrixCard[] = [];
    for (let i = 0; i < cleaned.length; i += 2) {
      cards.push({
        pattern: cleaned[i],
        example: cleaned[i + 1],
      });
    }
    return cards;
  }

  // Fallback: single-item rules
  return cleaned.map((item, idx) => ({
    pattern: `Pattern ${idx + 1}`,
    example: item,
  }));
}

export function BusinessUsageStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const matrixCards = useMemo(
    () => parseUsageCards(unit.usageFocus.details),
    [unit.usageFocus.details]
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Layers className="size-4" aria-hidden />
          {t("business.usage.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {t("business.usage.functionalPatternTag", { level: unit.level })}
        </span>
      </div>

      {/* Hero Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="usage-focus-title"
      >
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          {t("business.usage.linguisticFramework")}
        </p>
        <h1
          id="usage-focus-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.usageFocus.title.replace(/^4\.\s*Usage Focus\s*[-—]?\s*/i, "") ||
            t("business.stages.usage")}
        </h1>
        {unit.usageFocus.description && (
          <p className="mt-3 text-base font-medium text-muted-foreground leading-relaxed whitespace-pre-line">
            {unit.usageFocus.description}
          </p>
        )}
      </section>

      {/* Framework Matrix Grid / Cards */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-wp-sm"
        aria-label="Framework Matrix Rules"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {matrixCards.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary/40 transition-all shadow-wp-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                    {card.pattern}
                  </span>
                  <CheckCircle2 className="size-4 text-primary/70 shrink-0" aria-hidden />
                </div>

                {card.context && (
                  <div className="mt-3">
                    <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {t("business.usage.contextFunctionLabel")}
                    </span>
                    <p className="mt-0.5 text-sm font-bold text-foreground">{card.context}</p>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-card p-3.5 border border-border/70 text-sm font-medium text-foreground/90 italic font-serif leading-relaxed">
                {`“${card.example}”`}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.usage.continueToExercises")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
