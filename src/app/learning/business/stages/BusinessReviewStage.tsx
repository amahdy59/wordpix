import { useState } from "react";
import { Award, ArrowRight, RefreshCw, Calendar, CheckCircle2 } from "lucide-react";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  nextUnitId?: string;
  savedConfidence?: "not-yet" | "almost" | "ready";
  onSaveConfidence: (rating: "not-yet" | "almost" | "ready") => void;
  onCompleteUnit: () => void;
  onGoToUnit?: (unitId: string) => void;
}

export function BusinessReviewStage({
  unit,
  nextUnitId,
  savedConfidence,
  onSaveConfidence,
  onCompleteUnit,
  onGoToUnit,
}: Props) {
  const [confidence, setConfidence] = useState<"not-yet" | "almost" | "ready" | undefined>(
    savedConfidence
  );

  const handleSelectConfidence = (rating: "not-yet" | "almost" | "ready") => {
    setConfidence(rating);
    onSaveConfidence(rating);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Award className="size-4" aria-hidden />
          Stage 8 · Review & Recycling
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {unit.level} · Long-Term Retention
        </span>
      </div>

      {/* Completion Celebration Hero */}
      <section
        className="rounded-3xl border-2 border-accent/30 bg-gradient-to-br from-accent/15 via-card to-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="congrats-title"
      >
        <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-accent">
          <CheckCircle2 className="size-4" aria-hidden /> Lesson Completed
        </span>
        <h1
          id="congrats-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          Congratulations! You've Completed {unit.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-muted-foreground">
          You have mastered {unit.languageBank.length} high-impact professional vocabulary items,
          practiced real-world business dialogue, and applied targeted functional frameworks.
        </p>
      </section>

      {/* Recycled Language Points */}
      {unit.review.recycledPoints.length > 0 && (
        <section
          className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
          aria-labelledby="recycled-heading"
        >
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="size-5 text-primary" aria-hidden />
            <h2 id="recycled-heading" className="text-lg font-black text-foreground">
              Key Grammar & Phrasals Recycled
            </h2>
          </div>

          <ul className="flex flex-col gap-2.5">
            {unit.review.recycledPoints.map((point, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 rounded-xl bg-muted/40 p-3 text-sm sm:text-base font-semibold text-foreground"
              >
                <span className="size-2 rounded-full bg-primary mt-2 shrink-0" aria-hidden />
                <span>{point.replace(/^[•-]\s*/, "")}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Spaced Repetition Confidence Rating */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-7 shadow-wp-sm"
        aria-labelledby="spaced-rep-heading"
      >
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="size-5 text-primary" aria-hidden />
          <h2 id="spaced-rep-heading" className="text-lg font-black text-foreground">
            Spaced Repetition & Self-Rating
          </h2>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-4">
          Rate your confidence in applying this unit's language at work:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["not-yet", "almost", "ready"] as const).map((level) => {
            const isSelected = confidence === level;
            const labels = {
              "not-yet": "Not Yet · Needs Review",
              almost: "Almost · Comfortable",
              ready: "Ready · Ready to Use",
            };
            return (
              <button
                key={level}
                type="button"
                onClick={() => handleSelectConfidence(level)}
                className={`p-4 rounded-2xl border text-center font-bold text-sm sm:text-base transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-wp-xs"
                    : "border-border bg-muted/20 hover:border-primary/50 text-foreground"
                }`}
              >
                {labels[level]}
              </button>
            );
          })}
        </div>
      </section>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={onCompleteUnit}
          className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-muted/30 px-6 py-3 font-bold text-foreground hover:bg-muted/60 transition-all"
        >
          <span>Return to Curriculum Hub</span>
        </button>

        {nextUnitId && onGoToUnit && (
          <button
            type="button"
            onClick={() => onGoToUnit(nextUnitId)}
            className="w-full sm:w-auto inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <span>Proceed to Next Unit</span>
            <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
