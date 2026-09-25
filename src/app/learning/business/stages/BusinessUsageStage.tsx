import { Layers, ArrowRight, CheckCircle2 } from "lucide-react";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessUsageStage({ unit, onNext }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Layers className="size-4" aria-hidden />
          Stage 4 · Usage Focus
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {unit.level} · Functional Pattern
        </span>
      </div>

      {/* Hero Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="usage-focus-title"
      >
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          Linguistic Framework
        </p>
        <h1
          id="usage-focus-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.usageFocus.title}
        </h1>
        {unit.usageFocus.description && (
          <p className="mt-3 text-base font-medium text-muted-foreground leading-relaxed">
            {unit.usageFocus.description}
          </p>
        )}
      </section>

      {/* Framework Matrix Details */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-wp-sm"
        aria-label="Framework Matrix Rules"
      >
        <div className="flex flex-col gap-3.5">
          {unit.usageFocus.details.map((detail, idx) => {
            const isHeading = detail.length < 25 && !detail.includes(".") && !detail.includes("-");
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl transition-all ${
                  isHeading
                    ? "bg-primary/10 border-l-4 border-primary font-black text-primary text-base mt-2 first:mt-0"
                    : "bg-muted/40 border border-border/80 font-medium text-foreground text-sm sm:text-base leading-relaxed"
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {!isHeading && (
                    <CheckCircle2 className="size-4 text-primary shrink-0 mt-1" aria-hidden />
                  )}
                  <span>{detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>Continue to Practice Exercises</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
