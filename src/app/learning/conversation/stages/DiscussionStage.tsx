import { useState } from "react";
import { MessageSquareText, ArrowRight, ArrowLeft, Mic } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { SpeechRecordCompare } from "../../../shared/SpeechRecordCompare";
import { BilingualTextBlock, LanguageToggle } from "../../../shared/BilingualText";

interface Props {
  unit: ConversationUnit;
  initialNotes: string;
  onSaveNotes: (notes: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function DiscussionStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const [showArabic, setShowArabic] = useState(false);
  const [practicePromptIndex, setPracticePromptIndex] = useState(0);
  const hasArabicTranslation = unit.discussion.some((item) =>
    /[\u0600-\u06ff]/.test(item.promptAr ?? "")
  );

  return (
    <div className="wp-container-reading flex flex-col gap-6 py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <MessageSquareText className="size-4" aria-hidden />
          {t("conversation.discussionStage")}
        </span>
        {hasArabicTranslation && (
          <LanguageToggle
            showArabic={showArabic}
            onToggle={() => setShowArabic((prev) => !prev)}
            showLabel={t("conversation.arabicTranslation")}
            hideLabel={t("conversation.englishOnly")}
          />
        )}
      </div>

      {/* 6 Discussion Prompts */}
      <div className="grid gap-4 sm:grid-cols-2">
        {unit.discussion.map((item, index) => (
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
              <BilingualTextBlock
                english={item.prompt}
                arabic={item.promptAr}
                showArabic={showArabic}
                className="mt-3"
                englishClassName="text-base font-semibold leading-relaxed text-foreground"
                arabicClassName="text-sm font-medium leading-relaxed text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setPracticePromptIndex(index)}
                aria-pressed={practicePromptIndex === index}
                className={`mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border px-3 text-sm font-black transition-colors active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  practicePromptIndex === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <Mic className="size-4" aria-hidden />
                {practicePromptIndex === index
                  ? t("conversation.speakingPromptSelected")
                  : t("conversation.practiceThisPrompt")}
              </button>
            </div>
          </article>
        ))}
      </div>

      <SpeechRecordCompare
        key={unit.discussion[practicePromptIndex]?.id}
        target={unit.discussion[practicePromptIndex]?.prompt ?? unit.discussion[0]?.prompt ?? ""}
        modelText={unit.toolkit.phrases.map((phrase) => phrase.example).join(" ")}
        title={t("conversation.discussionSpeakingStudio")}
        description={t("conversation.discussionSpeakingHelp")}
        maxDurationSeconds={90}
      />

      <p className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm font-semibold text-foreground">
        {t("conversation.discussionSpeakingHelp")}
      </p>

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
