import { useMemo, useState } from "react";
import { Columns2, Rows3 } from "lucide-react";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import type { AudioController } from "../../../shared/useAudio";
import { ReadingAudioPlayer } from "../../../shared/ReadingAudioPlayer";
import { RichPassageText, getPassageVocabularyTerms } from "../../../shared/RichPassageText";
import { ReadingVocabulary } from "../../../shared/ReadingVocabulary";
import { VocabularyDetailModal } from "../../../shared/VocabularyDetailModal";
import { parseHadithVocabulary } from "../hadithVocabularyContent";

interface Props {
  source: { arabic: string; translation: string; citation: string };
  onPlayAudio: (track: "ar" | "en") => void;
  audio: AudioController;
  activeTrack: "ar" | "en" | null;
  playbackRate: number;
  onRateChange: (rate: number) => void;
  vocabularyLines: readonly string[];
  lessonNumber: number;
}
const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function HadithReadListenStage({
  source,
  onPlayAudio,
  audio,
  activeTrack,
  playbackRate,
  onRateChange,
  vocabularyLines,
  lessonNumber,
}: Props) {
  const { t } = useI18n();
  const { state } = useLearner();
  const [parallelReading, setParallelReading] = useState(true);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const vocabulary = useMemo(
    () => parseHadithVocabulary(vocabularyLines, lessonNumber),
    [vocabularyLines, lessonNumber]
  );
  const terms = useMemo(() => vocabulary.map((item) => item.term), [vocabulary]);
  const presentTerms = useMemo(
    () => getPassageVocabularyTerms(source.translation, terms),
    [source.translation, terms]
  );
  const selected = vocabulary.find((item) => item.term === activeTerm);
  const item = selected
    ? {
        id: `hadith-${lessonNumber}-${selected.term}`,
        term: selected.term,
        termAr: selected.arabic,
        type: selected.partOfSpeech,
        definition: selected.definition,
        example: selected.example ?? "",
      }
    : null;
  return (
    <section
      id="hadith-read-listen-section"
      aria-labelledby="stage-readlisten-heading"
      className="wp-container-content min-w-0 space-y-6 rounded-2xl border border-border bg-card p-4 sm:p-8"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2
          id="stage-readlisten-heading"
          tabIndex={-1}
          className={`wp-type-stage-title text-foreground ${focusRing}`}
        >
          {t("hadith.completeText")}
        </h2>
        <div role="group" aria-label={t("hadith.readingLayout")} className="flex flex-wrap gap-1">
          <button
            type="button"
            aria-pressed={!parallelReading}
            onClick={() => setParallelReading(false)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-semibold ${focusRing} ${!parallelReading ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
          >
            <Rows3 className="size-4" aria-hidden />
            {t("hadith.stackedReading")}
          </button>
          <button
            type="button"
            aria-pressed={parallelReading}
            onClick={() => setParallelReading(true)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl px-3 font-semibold ${focusRing} ${parallelReading ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"}`}
          >
            <Columns2 className="size-4" aria-hidden />
            {t("hadith.parallelReading")}
          </button>
        </div>
      </header>
      <div className={parallelReading ? "grid min-w-0 gap-8 lg:grid-cols-2" : "space-y-8"}>
        <article aria-labelledby="hadith-arabic-heading" className="min-w-0 space-y-5">
          <h3 id="hadith-arabic-heading" className="text-base font-semibold text-foreground">
            {t("hadith.arabic")}
          </h3>
          <ReadingAudioPlayer
            audio={audio}
            active={activeTrack === "ar"}
            onPlay={() => onPlayAudio("ar")}
            onRestart={() => onPlayAudio("ar")}
            rate={playbackRate}
            onRateChange={onRateChange}
            enabled={state.accessibility.includeListening}
            label={t("hadith.listenArabic")}
          />
          <p
            className="wp-prose whitespace-pre-line font-arabic text-2xl leading-loose text-foreground"
            lang="ar"
            dir="rtl"
          >
            {source.arabic}
          </p>
        </article>
        <article aria-labelledby="hadith-english-heading" className="min-w-0 space-y-5">
          <h3 id="hadith-english-heading" className="text-base font-semibold text-foreground">
            {t("hadith.englishTranslation")}
          </h3>
          <ReadingAudioPlayer
            audio={audio}
            active={activeTrack === "en"}
            onPlay={() => onPlayAudio("en")}
            onRestart={() => onPlayAudio("en")}
            rate={playbackRate}
            onRateChange={onRateChange}
            enabled={state.accessibility.includeListening}
            label={t("hadith.listenTranslation")}
          />
          <div
            className="wp-prose space-y-6 text-base text-foreground sm:text-lg"
            lang="en"
            dir="ltr"
          >
            {source.translation
              .split(/\n+/)
              .filter(Boolean)
              .map((paragraph, index) => (
                <p key={index}>
                  <RichPassageText
                    text={paragraph}
                    vocabTerms={terms}
                    interactiveVocabulary={false}
                  />
                </p>
              ))}
          </div>
          <p className="text-sm text-foreground">
            <bdi>{source.citation}</bdi>
          </p>
          <ReadingVocabulary
            terms={presentTerms}
            onSelect={(term) => {
              if (audio.status === "loading") audio.stop();
              else audio.pause();
              setActiveTerm(term);
            }}
          />
        </article>
      </div>
      <VocabularyDetailModal
        item={item}
        isOpen={Boolean(item)}
        onClose={() => setActiveTerm(null)}
      />
    </section>
  );
}
