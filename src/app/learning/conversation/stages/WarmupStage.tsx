import { useState } from "react";
import { MessageSquare, Vote, ArrowRight } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { ChoiceOptionGroup } from "../../../shared/ChoiceOptionGroup";
import { BilingualTextBlock, LanguageToggle } from "../../../shared/BilingualText";
import { PracticePollSnapshot } from "../PracticePollSnapshot";

interface Props {
  unit: ConversationUnit;
  savedVote?: string;
  onVote: (optionId: string) => void;
  onNext: () => void;
}

export function WarmupStage({ unit, savedVote, onVote, onNext }: Props) {
  const { t } = useI18n();
  const [selectedVote, setSelectedVote] = useState<string | undefined>(savedVote);
  const [showArabic, setShowArabic] = useState(false);
  const hasArabicTranslation = /[\u0600-\u06ff]/.test(unit.warmup.bigQuestionAr ?? "");

  const handleSelectVote = (optionId: string) => {
    setSelectedVote(optionId);
    onVote(optionId);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <MessageSquare className="size-4" aria-hidden />
          {t("conversation.warmupStage")}
        </span>
        {hasArabicTranslation && (
          <LanguageToggle
            showArabic={showArabic}
            onToggle={() => setShowArabic((previous) => !previous)}
            showLabel={t("conversation.arabicTranslation")}
            hideLabel={t("conversation.englishOnly")}
          />
        )}
      </div>

      {/* Big Question Hero Card */}
      <section
        className="rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="big-question-heading"
      >
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          {t("conversation.centralQuestion")}
        </p>
        <h1
          id="big-question-heading"
          className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-snug"
        >
          <BilingualTextBlock
            english={`“${unit.warmup.bigQuestion}”`}
            arabic={`“${unit.warmup.bigQuestionAr}”`}
            showArabic={showArabic}
            arabicClassName="text-primary"
          />
        </h1>
      </section>

      {/* Discussion Activation Prompts */}
      <section
        className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-wp-xs"
        aria-labelledby="discussion-prompts-title"
      >
        <h2 id="discussion-prompts-title" className="text-base font-black text-foreground">
          {t("conversation.reflectBeforeReading")}
        </h2>
        <ol className="mt-4 flex flex-col gap-3">
          {unit.warmup.prompts.map((prompt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl bg-muted/40 p-3.5 text-sm sm:text-base font-medium text-foreground leading-relaxed"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary">
                {idx + 1}
              </span>
              <BilingualTextBlock
                english={prompt.en}
                arabic={prompt.ar}
                showArabic={showArabic}
                arabicClassName="text-sm font-semibold text-muted-foreground"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* Quick Vote Interactive Poll */}
      <section
        className="rounded-2xl border-2 border-primary/30 bg-card p-5 sm:p-7 shadow-wp-xs"
        aria-labelledby="quick-vote-title"
      >
        <div className="flex items-center gap-2">
          <Vote className="size-5 text-primary" aria-hidden />
          <h2 id="quick-vote-title" className="text-base font-black text-foreground">
            {t("conversation.quickVote")}
          </h2>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
          {t("conversation.quickVoteDescription")}
        </p>

        <ChoiceOptionGroup
          className="mt-5 grid gap-3 sm:grid-cols-3"
          label={t("conversation.quickVoteOptions")}
          value={selectedVote}
          onChange={handleSelectVote}
          options={unit.warmup.quickVote.options.map((option) => ({
            value: option.id,
            label: option.text,
            accessibleLabel: t("conversation.voteOption", {
              id: option.id,
              text: option.text,
            }),
            prefix: option.id,
            secondary: showArabic ? (
              <bdi dir="rtl" lang="ar" className="font-arabic text-[1.15em] text-muted-foreground">
                {option.textAr}
              </bdi>
            ) : undefined,
          }))}
        />

        {selectedVote && (
          <PracticePollSnapshot
            unitNumber={unit.unitNumber}
            options={unit.warmup.quickVote.options}
            selectedOptionId={selectedVote}
          />
        )}
      </section>

      {/* Action Footer */}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          disabled={!selectedVote}
          aria-describedby="warmup-vote-requirement"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t("conversation.continueReading")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      <p
        id="warmup-vote-requirement"
        className="text-end text-sm font-semibold text-muted-foreground"
        aria-live="polite"
      >
        {selectedVote ? t("conversation.voteRecorded") : t("conversation.chooseVote")}
      </p>
    </div>
  );
}
