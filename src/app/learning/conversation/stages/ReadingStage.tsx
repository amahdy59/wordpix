import { useState, useMemo } from "react";
import { Pause, Volume2, ArrowRight, ArrowLeft } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { getConversationReadingAudioKey } from "../conversationReadingAudio";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import { useAudio } from "../../../shared/useAudio";
import { getPassageVocabularyTerms, RichPassageText } from "../../../shared/RichPassageText";
import { VocabularyDetailModal } from "../../../shared/VocabularyDetailModal";
import type { VocabularyTableItem } from "../../../shared/CurriculumVocabularyTable";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import timing from "../conversationTranscriptTiming.json";
import { TimedPassageText, type TranscriptSpan } from "../../../shared/TimedPassageText";
import { ReadingAudioPlayer } from "../../../shared/ReadingAudioPlayer";
import { ReadingVocabulary } from "../../../shared/ReadingVocabulary";

interface Props {
  unit: ConversationUnit;
  onNext: () => void;
  onPrev: () => void;
}

export function ReadingStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const { state } = useLearner();
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(0.85);
  const [activeTrack, setActiveTrack] = useState<"full" | number | null>(null);
  const listeningEnabled = state.accessibility.includeListening;
  const unitTiming: Partial<Record<string, TranscriptSpan[][]>> = timing;
  const fullText = `${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`;
  const audio = useAudio({
    lang: "en-US",
    rate: playbackRate,
    preferLocal: true,
    preserveText: true,
    onEnded: () => setActiveTrack(null),
  });
  const vocabTerms = useMemo(() => unit.languageBank.map((item) => item.term), [unit.languageBank]);
  const presentTerms = useMemo(
    () => getPassageVocabularyTerms(`${fullText} ${unit.reading.inShort.summary}`, vocabTerms),
    [fullText, unit.reading.inShort.summary, vocabTerms]
  );
  const selectedVocabItem = useMemo<VocabularyTableItem | null>(() => {
    const item = unit.languageBank.find((entry) => entry.term === activeTerm);
    return item
      ? {
          id: item.id,
          term: item.term,
          termAr: item.termAr,
          type: item.type,
          definition: item.meaning,
          definitionAr: item.meaningAr,
          example: item.example,
          imageSrc: item.imageSrc ? resolveAssetUrl(item.imageSrc) : undefined,
        }
      : null;
  }, [activeTerm, unit.languageBank]);
  const startTrack = (track: "full" | number, text: string) => {
    if (!listeningEnabled || !audio.isSupported) return;
    setActiveTrack(track);
    audio.speak(text, "en-US", getConversationReadingAudioKey(unit.id, track, text));
  };
  const playParagraph = (index: number, text: string) => {
    if (activeTrack === index && audio.isPaused) audio.resume();
    else if (activeTrack === index && audio.isPlaying) {
      if (audio.isLoading) audio.stop();
      else audio.pause();
    } else startTrack(index, text);
  };
  const openTerm = (term: string) => {
    if (audio.isLoading) audio.stop();
    else audio.pause();
    setActiveTerm(term);
  };
  const time =
    audio.source === "recording" && (audio.isPlaying || audio.isPaused) ? audio.currentTime : null;
  return (
    <div className="wp-container-reading space-y-6 py-2">
      <article
        aria-labelledby="reading-title"
        className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-8"
      >
        <div className="wp-prose mx-auto space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              {t("conversation.level", { level: unit.level })} · <bdi>{unit.topic}</bdi>
            </p>
            <h2
              id="reading-title"
              className="wp-type-stage-title text-foreground"
              lang="en"
              dir="ltr"
            >
              <RichPassageText
                text={unit.reading.title}
                vocabTerms={vocabTerms}
                interactiveVocabulary={false}
              />
            </h2>
          </header>
          <ReadingAudioPlayer
            audio={audio}
            active={activeTrack !== null}
            enabled={listeningEnabled}
            onPlay={() => startTrack("full", fullText)}
            onRestart={() => startTrack("full", fullText)}
            rate={playbackRate}
            onRateChange={setPlaybackRate}
          />
          <div
            className="space-y-6 text-base leading-relaxed text-foreground sm:text-lg"
            lang="en"
            dir="ltr"
          >
            {unit.reading.paragraphs.map((paragraph, index) => {
              const selected = activeTrack === index;
              const key = getConversationReadingAudioKey(
                unit.id,
                activeTrack === "full" ? "full" : index,
                activeTrack === "full" ? fullText : paragraph
              );
              const spans = key
                ? unitTiming[unit.id]?.[activeTrack === "full" ? 0 : selected ? index + 1 : -1]
                : undefined;
              const offset =
                activeTrack === "full"
                  ? unit.reading.title.length +
                    2 +
                    unit.reading.paragraphs
                      .slice(0, index)
                      .reduce((sum, text) => sum + text.length + 1, 0)
                  : 0;
              return (
                <div key={index} className="flex min-w-0 items-start gap-2 sm:gap-4">
                  <p className="min-w-0 flex-1">
                    <TimedPassageText
                      text={paragraph}
                      spans={spans}
                      offset={offset}
                      time={activeTrack === "full" || selected ? time : null}
                      vocabTerms={vocabTerms}
                      interactiveVocabulary={false}
                    />
                  </p>
                  <button
                    type="button"
                    onClick={() => playParagraph(index, paragraph)}
                    disabled={!listeningEnabled || !audio.isSupported}
                    aria-pressed={selected && audio.isPlaying}
                    aria-label={t(
                      selected && audio.isPaused
                        ? "readingPlayer.resumeParagraph"
                        : selected && audio.isPlaying
                          ? "readingPlayer.pauseParagraph"
                          : "conversation.listenParagraph",
                      { number: index + 1 }
                    )}
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    {selected && audio.isPlaying ? (
                      <Pause className="size-4" aria-hidden />
                    ) : (
                      <Volume2 className="size-4" aria-hidden />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          <section
            className="space-y-3 border-t border-border pt-5"
            aria-labelledby="reading-summary-title"
          >
            <h3 id="reading-summary-title" className="text-base font-semibold text-foreground">
              {t("conversation.inShort")}
            </h3>
            <p className="text-base text-foreground" lang="en" dir="ltr">
              <RichPassageText
                text={unit.reading.inShort.summary}
                vocabTerms={vocabTerms}
                interactiveVocabulary={false}
              />
            </p>
          </section>
          <ReadingVocabulary terms={presentTerms} onSelect={openTerm} />
        </div>
      </article>
      <VocabularyDetailModal
        item={selectedVocabItem}
        isOpen={Boolean(selectedVocabItem)}
        onClose={() => setActiveTerm(null)}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            audio.stop();
            onPrev();
          }}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 font-semibold text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft className="size-5 rtl:rotate-180" aria-hidden />
          {t("conversation.previous")}
        </button>
        <button
          type="button"
          onClick={() => {
            audio.stop();
            onNext();
          }}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("conversation.continueLanguageBank")}
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
