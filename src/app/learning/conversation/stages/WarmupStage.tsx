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
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      {/* Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
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
        className="rounded-2xl border border-border bg-card p-4 sm:p-5"
        aria-labelledby="big-question-heading"
      >
        <p className="text-sm font-semibold text-primary">{t("conversation.centralQuestion")}</p>
        <h2
          id="big-question-heading"
          className="wp-type-stage-title mt-2 font-black text-foreground tracking-tight leading-snug"
        >
          <BilingualTextBlock
            english={`“${unit.warmup.bigQuestion}”`}
            arabic={`“${unit.warmup.bigQuestionAr}”`}
            showArabic={showArabic}
            arabicClassName="text-primary"
          />
        </h2>
        {unit.speakingSkill && (
          <p className="mt-3 border-s-2 border-primary ps-3 text-base font-semibold text-primary">
            {t("conversation.skill", { skill: unit.speakingSkill })}
          </p>
        )}
      </section>

      {/* Discussion Activation Prompts */}
      <section className="border-b border-border pb-3" aria-labelledby="discussion-prompts-title">
        <h2
          id="discussion-prompts-title"
          className="wp-type-stage-title text-base font-black text-foreground"
        >
          {t("conversation.reflectBeforeReading")}
        </h2>
        <ol className="mt-3 flex flex-col divide-y divide-border">
          {unit.warmup.prompts.map((prompt, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 py-3 text-base sm:text-base font-medium text-foreground leading-relaxed"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-black text-sm text-primary">
                {idx + 1}
              </span>
              <BilingualTextBlock
                english={prompt.en}
                arabic={prompt.ar}
                showArabic={showArabic}
                arabicClassName="text-base font-semibold text-muted-foreground"
              />
            </li>
          ))}
        </ol>
      </section>

      {/* Quick Vote Interactive Poll */}
      <section
        className="rounded-2xl border border-border bg-card p-4 sm:p-5"
        aria-labelledby="quick-vote-title"
      >
        <div className="flex items-center gap-2">
          <Vote className="size-5 text-primary" aria-hidden />
          <h2
            id="quick-vote-title"
            className="wp-type-stage-title text-base font-black text-foreground"
          >
            {t("conversation.quickVote")}
          </h2>
        </div>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground font-medium">
          {t("conversation.quickVoteDescription")}
        </p>

        <ChoiceOptionGroup
          className="mt-3 grid gap-2 sm:grid-cols-3"
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
          aria-describedby="warmup-vote-guidance"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>{t("conversation.continueReading")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      <p
        id="warmup-vote-guidance"
        className="text-end text-base font-semibold text-muted-foreground"
        aria-live="polite"
      >
        {selectedVote ? t("conversation.voteRecorded") : t("conversation.optionalVote")}
      </p>
    </div>
  );
}
