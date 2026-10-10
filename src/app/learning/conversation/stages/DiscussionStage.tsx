import { useState } from "react";
import { MessageSquareText, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { DiscussionPromptSelect } from "../../../shared/DiscussionPromptSelect";
import { RichPassageText } from "../../../shared/RichPassageText";
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
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
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
      <div className="grid gap-3 sm:grid-cols-2">
        {unit.discussion.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-2xl border border-border bg-card p-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-md bg-secondary font-black text-sm text-primary">
                  {item.id}
                </span>
                <h2 className="text-base font-bold text-foreground">{item.title}</h2>
              </div>
              <BilingualTextBlock
                english={<RichPassageText text={item.prompt} />}
                arabic={item.promptAr}
                showArabic={showArabic}
                className="mt-2"
                englishClassName="text-base font-semibold leading-relaxed text-foreground"
                arabicClassName="text-base font-medium leading-relaxed text-muted-foreground"
              />
            </div>
          </article>
        ))}
      </div>

      <DiscussionPromptSelect
        prompts={unit.discussion}
        selectedIndex={practicePromptIndex}
        onSelect={setPracticePromptIndex}
      />
      <SpeechRecordCompare
        key={unit.discussion[practicePromptIndex]?.id}
        target={unit.discussion[practicePromptIndex]?.prompt ?? unit.discussion[0]?.prompt ?? ""}
        modelText={unit.toolkit.phrases.map((phrase) => phrase.example).join(" ")}
        title={t("conversation.discussionSpeakingStudio")}
        description={t("conversation.discussionSpeakingHelp")}
        maxDurationSeconds={90}
      />

      <div className="grid gap-3 md:grid-cols-3" aria-label={t("hadith.discussionLabel")}>
        {["discussionReason", "discussionAlternative", "discussionRole"].map((key) => (
          <article key={key} className="rounded-2xl border border-primary/25 bg-secondary p-4">
            <MessageSquareText className="mb-3 size-6 text-primary" aria-hidden />
            <h3 className="text-base font-bold leading-7 text-foreground">
              {t(`courseLesson.${key}`)}
            </h3>
          </article>
        ))}
      </div>

      {/* Stage Navigation Footer */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-3 font-bold text-foreground hover:bg-muted motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          <span>{t("conversation.previous")}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onNext();
          }}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("conversation.continueChallenge")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
