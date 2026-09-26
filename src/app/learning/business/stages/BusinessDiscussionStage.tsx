import { useState } from "react";
import { MessageSquareText, ArrowRight, HelpCircle } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  savedNotes?: Record<string, string>;
  onSaveNote: (promptId: string, note: string) => void;
  onNext: () => void;
}

export function BusinessDiscussionStage({ unit, savedNotes = {}, onSaveNote, onNext }: Props) {
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
          <MessageSquareText className="size-4" aria-hidden />
          {t("business.discussion.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {t("business.discussion.analysisTag", { level: unit.level })}
        </span>
      </div>

      {/* Hero Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="discussion-stage-title"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" aria-hidden />
          <h1 id="discussion-stage-title" className="text-2xl font-black text-foreground">
            {unit.discussion.title}
          </h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground font-medium">
          {t("business.discussion.subtitle")}
        </p>
      </section>

      {/* Discussion Prompts */}
      <section className="flex flex-col gap-4" aria-label="Discussion Questions List">
        {unit.discussion.prompts.map((prompt, idx) => (
          <div
            key={prompt.id}
            className="flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-5 shadow-wp-xs hover:border-primary/40 transition-colors"
          >
            <label
              htmlFor={prompt.id}
              className="flex items-start gap-3 text-base font-bold text-foreground"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary">
                {idx + 1}
              </span>
              <span className="leading-snug pt-0.5">{prompt.prompt}</span>
            </label>

            <textarea
              id={prompt.id}
              rows={2}
              value={notes[prompt.id] || ""}
              onChange={(e) => handleNoteChange(prompt.id, e.target.value)}
              placeholder="Your perspective / notes on this question..."
              className="mt-1 w-full rounded-xl border border-input bg-muted/20 p-3 text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        ))}
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.discussion.continueToSpeaking")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
