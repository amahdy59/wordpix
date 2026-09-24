import { useState } from "react";
import { MessageSquareText, Globe2, ArrowRight, ArrowLeft, PenLine } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../context/I18nContext";

interface Props {
  unit: ConversationUnit;
  initialNotes: string;
  onSaveNotes: (notes: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function DiscussionStage({ unit, initialNotes, onSaveNotes, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const [showArabic, setShowArabic] = useState(false);
  const [notes, setNotes] = useState<string>(initialNotes);
  const hasArabicTranslation = unit.discussion.some((item) =>
    /[\u0600-\u06ff]/.test(item.promptAr ?? "")
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <MessageSquareText className="size-4" aria-hidden />
          {t("conversation.discussionStage")}
        </span>
        {hasArabicTranslation && (
          <button
            type="button"
            onClick={() => setShowArabic((prev) => !prev)}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border bg-card px-3.5 py-1.5 text-xs font-bold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Globe2 className="size-4" aria-hidden />
            {showArabic ? t("conversation.englishOnly") : t("conversation.arabicTranslation")}
          </button>
        )}
      </div>

      {/* 6 Discussion Prompts */}
      <div className="grid gap-4 sm:grid-cols-2">
        {unit.discussion.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs hover:border-primary/40"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-primary/10 font-black text-xs text-primary">
                  {item.id}
                </span>
                <h2 className="text-sm font-black uppercase tracking-wide text-primary">
                  {item.title}
                </h2>
              </div>
              <p className="mt-3 text-base font-semibold leading-relaxed text-foreground">
                {item.prompt}
              </p>
              {showArabic && (
                <p
                  dir="rtl"
                  className="mt-2 text-sm font-medium text-muted-foreground font-arabic leading-relaxed"
                >
                  {item.promptAr}
                </p>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Reflection Notes Scratchpad */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs"
        aria-labelledby="notes-scratchpad-title"
      >
        <div className="flex items-center gap-2">
          <PenLine className="size-4 text-primary" aria-hidden />
          <h2 id="notes-scratchpad-title" className="text-sm font-black text-foreground">
            {t("conversation.notesLabel")}
          </h2>
        </div>
        <textarea
          aria-labelledby="notes-scratchpad-title"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => onSaveNotes(notes)}
          placeholder={t("conversation.notesPlaceholder")}
          className="mt-3 w-full min-h-[100px] rounded-xl border border-border bg-background p-3.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary"
        />
      </section>

      {/* Stage Navigation Footer */}
      <div className="mt-2 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-muted active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.previous")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onSaveNotes(notes);
            onNext();
          }}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("conversation.continueChallenge")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
