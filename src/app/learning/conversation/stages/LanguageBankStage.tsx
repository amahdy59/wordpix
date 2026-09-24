import { useState } from "react";
import { Sparkles, Volume2, ArrowRight, ArrowLeft, Image as ImageIcon } from "lucide-react";
import type { ConversationUnit, LanguageBankItem } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useAudio } from "../../../shared/useAudio";
import { PlaybackSpeedControl } from "../../../shared/PlaybackSpeedControl";
import { LanguageToggle } from "../../../shared/BilingualText";

interface Props {
  unit: ConversationUnit;
  onNext: () => void;
  onPrev: () => void;
}

export function LanguageBankStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [showArabic, setShowArabic] = useState(false);
  const [audioStatus, setAudioStatus] = useState("");
  const [playbackRate, setPlaybackRate] = useState(0.85);
  const listeningEnabled = learnerState.accessibility.includeListening;
  const audio = useAudio({ lang: "en-US", rate: playbackRate, preferLocal: true });
  const hasArabicTranslation = unit.languageBank.some((item) =>
    /[\u0600-\u06ff]/.test(`${item.termAr ?? ""}${item.meaningAr ?? ""}`)
  );

  const handleSpeakTerm = (term: string) => {
    if (!listeningEnabled || !audio.isSupported) {
      setAudioStatus(t("conversation.audioUnavailable"));
      return;
    }
    audio.speak(term);
    setAudioStatus("");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <Sparkles className="size-4" aria-hidden />
          {t("conversation.languageBankStage")}
        </span>
        <div className="flex flex-wrap items-center gap-2">
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
          {hasArabicTranslation && (
            <LanguageToggle
              showArabic={showArabic}
              onToggle={() => setShowArabic((prev) => !prev)}
              showLabel={t("conversation.arabicTranslation")}
              hideLabel={t("conversation.englishOnly")}
            />
          )}
        </div>
      </div>

      {/* Intro Note */}
      <div className="rounded-2xl border border-border bg-muted/20 p-4 text-xs sm:text-sm font-medium text-muted-foreground">
        {t("conversation.languageBankIntro")}
      </div>

      {/* 10 Vocabulary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {unit.languageBank.map((item: LanguageBankItem, idx: number) => {
          return (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-3xl border border-border bg-card p-5 sm:p-6 shadow-wp-xs transition-all hover:border-primary/40 focus-within:border-primary"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-muted-foreground uppercase">
                      #{idx + 1}
                    </span>
                    <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                      {item.term}
                    </h2>
                    {showArabic && (
                      <span dir="rtl" className="text-sm font-bold text-primary font-arabic mt-0.5">
                        {item.termAr}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-black text-primary">
                      {item.type}
                    </span>
                    <button
                      type="button"
                      aria-label={t("conversation.pronounce", { term: item.term })}
                      onClick={() => handleSpeakTerm(item.term)}
                      disabled={!listeningEnabled}
                      className="flex size-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-xl bg-muted text-foreground hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Volume2 className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>

                {/* Image Section: App Image or Description Card */}
                {item.imageSrc ? (
                  <div className="mt-3.5 aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted">
                    <img
                      src={resolveAssetUrl(item.imageSrc)}
                      alt={item.imageDescription}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <div className="mt-3.5 flex items-center gap-2 rounded-xl bg-muted/30 px-3 py-2 text-xs text-muted-foreground border border-border/50">
                    <ImageIcon className="size-4 text-primary shrink-0" aria-hidden />
                    <span className="line-clamp-2 italic">{item.imageDescription}</span>
                  </div>
                )}

                {/* Definition */}
                <p className="mt-3.5 text-sm font-medium leading-relaxed text-foreground">
                  <span className="font-bold text-muted-foreground">
                    {t("conversation.meaning")}:{" "}
                  </span>
                  {item.meaning}
                </p>
                {showArabic && (
                  <p
                    dir="rtl"
                    className="mt-1 text-xs font-semibold text-muted-foreground font-arabic leading-relaxed"
                  >
                    {item.meaningAr}
                  </p>
                )}
              </div>

              {/* Example */}
              <div className="mt-4 rounded-xl bg-muted/40 p-3 text-xs sm:text-sm font-medium leading-relaxed text-foreground">
                <span className="font-bold text-primary">{t("conversation.example")}: </span>"
                {item.example}"
              </div>
            </article>
          );
        })}
      </div>
      <span className="sr-only" aria-live="polite">
        {audioStatus}
      </span>

      {/* Stage Navigation Footer */}
      <div className="mt-4 flex items-center justify-between">
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
          <span>{t("conversation.continueToolkit")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
