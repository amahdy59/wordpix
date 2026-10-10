import { useState } from "react";
import { MessageSquareText, ArrowRight, HelpCircle } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { groupDiscussionPrompts } from "../../../shared/discussionPrompts";
import { RichPassageText } from "../../../shared/RichPassageText";
import { DiscussionPromptSelect } from "../../../shared/DiscussionPromptSelect";
import { SpeechRecordCompare } from "../../../shared/SpeechRecordCompare";

interface Props {
  unit: BusinessUnit;
  savedNotes?: Record<string, string>;
  onSaveNote: (promptId: string, note: string) => void;
  onNext: () => void;
}

export function BusinessDiscussionStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const [selectedPrompt, setSelectedPrompt] = useState(0);
  const prompts = unit.discussion.prompts.filter(
    (prompt) => !/^Write down your personal insights/i.test(prompt.prompt)
  );

  const groups = groupDiscussionPrompts(prompts);
  const speakingPrompts = groups.map((group) => group.question);

  return (
    <div className="wp-stage-flow wp-container-content flex flex-col gap-4 py-2">
      <section
        className="flex items-center justify-between gap-3 border-b border-border pb-3"
        aria-labelledby="discussion-stage-title"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="size-5 text-primary" aria-hidden />
          <h2
            id="discussion-stage-title"
            className="wp-type-stage-title font-black text-foreground"
          >
            {unit.discussion.title}
          </h2>
        </div>
        <span className="shrink-0 rounded-lg bg-secondary px-2 py-1 text-sm font-bold text-primary">
          {unit.level}
        </span>
      </section>

      {/* Discussion Prompts */}
      <ol
        className="divide-y divide-border rounded-xl border border-border bg-card"
        aria-labelledby="discussion-stage-title"
      >
        {groups.map(({ question: prompt, guidance }, idx) => (
          <li key={prompt.id} className="px-4 py-3">
            <div className="flex items-start gap-3 text-base font-bold text-foreground">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-secondary font-black text-sm text-primary">
                {idx + 1}
              </span>
              <span className="min-w-0 leading-relaxed" lang="en" dir="ltr">
                <RichPassageText text={prompt.prompt} />
              </span>
            </div>
            {guidance.length > 0 && (
              <details className="mt-2 ms-10 group">
                <summary className="min-h-11 cursor-pointer rounded-lg py-2 text-sm font-semibold text-primary focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary">
                  {t("courseLesson.showDiscussionGuidance")}
                </summary>
                <ul className="space-y-2 border-s-2 border-border ps-3">
                  {guidance.map((item) => (
                    <li
                      key={item.id}
                      className="text-base leading-relaxed text-foreground"
                      lang="en"
                      dir="ltr"
                    >
                      <RichPassageText text={item.prompt} />
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </li>
        ))}
      </ol>

      {prompts.length > 0 && (
        <div className="space-y-4">
          <DiscussionPromptSelect
            prompts={speakingPrompts}
            selectedIndex={selectedPrompt}
            onSelect={setSelectedPrompt}
          />
          <SpeechRecordCompare
            key={speakingPrompts[selectedPrompt]?.id}
            target={speakingPrompts[selectedPrompt]?.prompt ?? speakingPrompts[0].prompt}
            modelText={unit.languageBank.map((item) => item.example).join(" ")}
            title={t("conversation.discussionSpeakingStudio")}
            description={t("conversation.discussionSpeakingHelp")}
          />
        </div>
      )}
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

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 motion-safe:active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.discussion.continueToSpeaking")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
