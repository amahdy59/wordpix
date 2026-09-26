import { useState } from "react";
import { MessageSquare, ArrowRight, HelpCircle, CheckCircle2 } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  savedNotes?: Record<string, string>;
  onSaveNote: (promptId: string, note: string) => void;
  onNext: () => void;
}

export function BusinessWarmupStage({ unit, savedNotes = {}, onSaveNote, onNext }: Props) {
  const { t } = useI18n();
  const [notes, setNotes] = useState<Record<string, string>>(savedNotes);

  const handleNoteChange = (id: string, text: string) => {
    setNotes((prev) => ({ ...prev, [id]: text }));
    onSaveNote(id, text);
  };

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

      {/* Essential Question Hero Card */}
      <section
        className="overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card shadow-wp-sm"
        aria-labelledby="big-question-heading"
      >
        {unit.heroImageSrc && (
          <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-muted/40">
            <img
              src={unit.heroImageSrc}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-center"
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

      {/* Instructions & Prompts */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-wp-xs"
        aria-labelledby="reflection-prompts-title"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" aria-hidden />
          <h2 id="reflection-prompts-title" className="text-lg font-black text-foreground">
            {t("business.warmup.reflectHeading")}
          </h2>
        </div>
        <p className="mt-2 text-sm text-muted-foreground font-medium">{unit.warmup.instructions}</p>

        <div className="mt-6 flex flex-col gap-5">
          {unit.warmup.prompts.map((prompt, idx) => (
            <div
              key={prompt.id}
              className="flex flex-col gap-2 rounded-2xl border border-border/80 bg-muted/30 p-4 transition-colors focus-within:border-primary/60 focus-within:bg-card"
            >
              <label
                htmlFor={prompt.id}
                className="flex items-start gap-2.5 text-sm sm:text-base font-bold text-foreground"
              >
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary/15 font-black text-xs text-primary">
                  {idx + 1}
                </span>
                <span>{prompt.question}</span>
              </label>

              <textarea
                id={prompt.id}
                rows={2}
                value={notes[prompt.id] || ""}
                onChange={(e) => handleNoteChange(prompt.id, e.target.value)}
                placeholder="Type your reflection notes or key takeaways here..."
                className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          ))}
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
