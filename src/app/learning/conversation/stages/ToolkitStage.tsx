import { MessageCircle, Volume2, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useState } from "react";
import { useI18n } from "../../../context/I18nContext";
import { useLearner } from "../../../context/LearnerContext";

interface Props {
  unit: ConversationUnit;
  onNext: () => void;
  onPrev: () => void;
}

export function ToolkitStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [audioStatus, setAudioStatus] = useState("");
  const listeningEnabled = learnerState.accessibility.includeListening;
  const handleSpeakPhrase = (phrase: string) => {
    if (!listeningEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
      setAudioStatus(t("conversation.audioUnavailable"));
      return;
    }
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setAudioStatus("");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <MessageCircle className="size-4" aria-hidden />
          {t("conversation.toolkitStage")}
        </span>
      </div>

      {/* Function Description Banner */}
      <section
        className="rounded-3xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="toolkit-title"
      >
        <span className="text-xs font-black uppercase tracking-wider text-primary">
          {t("conversation.targetSpeakingSkill")}
        </span>
        <h1 id="toolkit-title" className="mt-2 text-2xl sm:text-3xl font-black text-foreground">
          {unit.toolkit.title}
        </h1>
        <p className="mt-2 text-sm sm:text-base font-medium text-muted-foreground leading-relaxed">
          {unit.speakingSkill}
        </p>
      </section>

      {/* Functional Phrase Frames */}
      <div className="flex flex-col gap-4">
        {unit.toolkit.phrases.map((phrase, idx) => (
          <article
            key={idx}
            className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs transition-all hover:border-primary/40"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-black text-xs text-primary">
                  {idx + 1}
                </span>
                <h2 className="text-base sm:text-lg font-black text-foreground">
                  {phrase.template}
                </h2>
              </div>
              <button
                type="button"
                aria-label={t("conversation.listenPhrase", { phrase: phrase.template })}
                onClick={() => handleSpeakPhrase(phrase.example)}
                disabled={!listeningEnabled}
                className="flex size-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <Volume2 className="size-4" aria-hidden />
              </button>
            </div>

            <div className="rounded-xl border-s-4 border-primary bg-muted/40 p-4 text-sm sm:text-base font-medium text-foreground">
              <span className="font-bold text-xs uppercase tracking-wide text-primary block mb-1">
                {t("conversation.modelDialogue")}:
              </span>
              "{phrase.example}"
            </div>
          </article>
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {audioStatus}
      </span>

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
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-black text-primary-foreground shadow-wp-md hover:opacity-95 active:scale-[0.99] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("conversation.continueQuiz")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
