import { MessageCircle, Volume2, ArrowRight, ArrowLeft, MessagesSquare } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useState } from "react";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import { useAudio } from "../../../shared/useAudio";
import { PlaybackSpeedControl } from "../../../shared/PlaybackSpeedControl";
import { SpeechRecordCompare } from "../../../shared/SpeechRecordCompare";

interface Props {
  unit: ConversationUnit;
  onNext: () => void;
  onPrev: () => void;
}

export function ToolkitStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [audioStatus, setAudioStatus] = useState("");
  const [playbackRate, setPlaybackRate] = useState(0.88);
  const [practiceFrameIndex, setPracticeFrameIndex] = useState<number | null>(null);
  const listeningEnabled = learnerState.accessibility.includeListening;
  const audio = useAudio({ lang: "en-US", rate: playbackRate, preferLocal: true });
  const handleSpeakPhrase = (phrase: string) => {
    if (!listeningEnabled || !audio.isSupported) {
      setAudioStatus(t("conversation.audioUnavailable"));
      return;
    }
    audio.speak(phrase);
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
        <PlaybackSpeedControl
          value={playbackRate}
          onChange={(rate) => {
            audio.stop();
            setPlaybackRate(rate);
          }}
          label={t("conversation.playbackSpeed")}
          options={[
            { value: 0.85, label: t("conversation.slowSpeed") },
            { value: 1, label: t("conversation.normalSpeed") },
          ]}
          disabled={!listeningEnabled}
        />
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

      <section
        className="rounded-3xl border border-border bg-card p-5 shadow-wp-sm sm:p-7"
        aria-labelledby="turn-taking-title"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <MessagesSquare className="size-5" aria-hidden />
          </span>
          <div>
            <h2 id="turn-taking-title" className="text-lg font-black text-foreground">
              {t("conversation.turnTakingTitle")}
            </h2>
            <p className="text-sm font-semibold text-muted-foreground">
              {t("conversation.turnTakingHelp")}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-primary/25 bg-primary/5 p-4">
          <p className="text-xs font-black uppercase tracking-wider text-primary">
            {t("conversation.partnerPrompt")}
          </p>
          <p className="mt-2 text-base font-bold leading-relaxed text-foreground">
            {unit.warmup.bigQuestion}
          </p>
          <button
            type="button"
            onClick={() => handleSpeakPhrase(unit.warmup.bigQuestion)}
            disabled={!listeningEnabled}
            className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary bg-card px-4 text-sm font-black text-primary hover:bg-primary/10 active:scale-[0.98] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Volume2 className="size-4" aria-hidden />
            {t("conversation.listenPartnerPrompt")}
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-black text-foreground">
            {t("conversation.chooseResponseFrame")}
          </legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {unit.toolkit.phrases.map((phrase, index) => (
              <label
                key={phrase.template}
                className={`flex min-h-11 cursor-pointer items-center rounded-xl border px-4 py-3 text-sm font-bold transition-colors focus-within:outline focus-within:outline-[3px] focus-within:outline-offset-2 focus-within:outline-primary ${
                  practiceFrameIndex === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-muted"
                }`}
              >
                <input
                  type="radio"
                  name="toolkit-response-frame"
                  checked={practiceFrameIndex === index}
                  onChange={() => setPracticeFrameIndex(index)}
                  className="sr-only"
                />
                {phrase.template}
              </label>
            ))}
          </div>
        </fieldset>

        {practiceFrameIndex !== null && (
          <div className="mt-5">
            <SpeechRecordCompare
              key={practiceFrameIndex}
              target={unit.warmup.bigQuestion}
              modelText={unit.toolkit.phrases[practiceFrameIndex].example}
              title={t("conversation.tryYourResponse")}
              description={t("conversation.tryYourResponseHelp")}
              maxDurationSeconds={60}
              defaultOpen={false}
            />
          </div>
        )}
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
