import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useAudio } from "../../../shared/useAudio";
import { PlaybackSpeedControl } from "../../../shared/PlaybackSpeedControl";
import { LanguageToggle } from "../../../shared/BilingualText";
import { CurriculumVocabularyTable } from "../../../shared/CurriculumVocabularyTable";
import type { VocabularyTableItem } from "../../../shared/CurriculumVocabularyTable";
import { getCurriculumAudioKey } from "../../shared/curriculumAudioManifest";
import { useState } from "react";

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
  const [activeAudioText, setActiveAudioText] = useState<string | null>(null);
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
    setActiveAudioText(term);
    audio.speak(term, undefined, getCurriculumAudioKey(term) ?? undefined);
    setAudioStatus("");
  };

  // Map LanguageBankItem → VocabularyTableItem (unified shape)
  const tableItems: VocabularyTableItem[] = unit.languageBank.map((item) => ({
    id: item.id,
    term: item.term,
    termAr: item.termAr,
    type: item.type,
    definition: item.meaning,
    definitionAr: item.meaningAr,
    example: item.example,
    imageSrc: item.imageSrc ? resolveAssetUrl(item.imageSrc) : undefined,
  }));

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

      {/* Unified Vocabulary Table */}
      <CurriculumVocabularyTable
        items={tableItems}
        showArabic={showArabic}
        onPlayAudio={listeningEnabled && audio.isSupported ? handleSpeakTerm : undefined}
        activeAudioText={activeAudioText}
        isPlaying={audio.isPlaying}
        isAudioError={audio.isError}
      />

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
