import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Pause, Volume2 } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { TimedPassageText } from "../../../shared/TimedPassageText";
import { getBusinessReadingAudio } from "../businessReadingAudio";
import { useLearner } from "../../../context/LearnerContext";
import { VocabularyDetailModal } from "../../../shared/VocabularyDetailModal";
import type { VocabularyTableItem } from "../../../shared/CurriculumVocabularyTable";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useAudio } from "../../../shared/useAudio";
import { getBusinessInputPresentation } from "../businessInputPresentation";
import { ReadingAudioPlayer } from "../../../shared/ReadingAudioPlayer";
import { ReadingVocabulary } from "../../../shared/ReadingVocabulary";
import { getPassageVocabularyTerms, RichPassageText } from "../../../shared/RichPassageText";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessInputStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const [playingIdx, setPlayingIdx] = useState<number | "full" | null>(null);
  const [fullStep, setFullStep] = useState<number | null>(null);
  const fullStepRef = useRef<number | null>(null);
  useEffect(() => {
    fullStepRef.current = fullStep;
  }, [fullStep]);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(0.85);
  const { state } = useLearner();
  const listeningEnabled = state.accessibility.includeListening;
  // Preserve authored text and original offsets: existing R2 takes are immutable.
  const fullText = `${unit.mainInput.title}. ${unit.mainInput.context} ${unit.mainInput.dialogue.map((line) => line.text).join(" ")}`;
  const fullRecording = getBusinessReadingAudio(unit.id, fullText);
  const presentation = useMemo(
    () => getBusinessInputPresentation(unit.mainInput),
    [unit.mainInput]
  );
  const scenarioQueue = useMemo(() => {
    const items: { idx: number | "context"; text: string }[] = [];
    if (presentation.showContext && unit.mainInput.context.trim()) {
      items.push({ idx: "context", text: unit.mainInput.context });
    }
    unit.mainInput.dialogue.forEach((line, idx) => {
      if (presentation.visibleLineIndices.has(idx)) {
        items.push({ idx, text: line.text });
      }
    });
    return items;
  }, [presentation, unit.mainInput]);

  const playFullScenario = (stepIndex: number = 0) => {
    if (!listeningEnabled || !audio.isSupported) return;
    if (fullRecording) {
      setPlayingIdx("full");
      setFullStep(null);
      audio.speak(fullText, "en-US", fullRecording.key);
      return;
    }
    if (stepIndex >= scenarioQueue.length) {
      setPlayingIdx(null);
      setFullStep(null);
      return;
    }
    setPlayingIdx("full");
    setFullStep(stepIndex);
    const item = scenarioQueue[stepIndex];
    audio.speak(item.text, "en-US", getBusinessReadingAudio(unit.id, item.text)?.key);
  };

  const audio = useAudio({
    lang: "en-US",
    rate: playbackRate,

    onEnded: () => {
      if (fullStepRef.current !== null) {
        const nextStep = fullStepRef.current + 1;
        if (nextStep < scenarioQueue.length) {
          playFullScenario(nextStep);
          return;
        }
      }
      setPlayingIdx(null);
      setFullStep(null);
    },
  });
  const vocabTerms = useMemo(() => unit.languageBank.map((item) => item.term), [unit.languageBank]);
  const presentTerms = useMemo(
    () => getPassageVocabularyTerms(fullText, vocabTerms),
    [fullText, vocabTerms]
  );
  const selectedVocabItem = useMemo<VocabularyTableItem | null>(() => {
    if (!activeTerm) return null;
    const match = unit.languageBank.find(
      (item) => item.term.toLowerCase() === activeTerm.toLowerCase()
    );
    return match
      ? {
          id: match.id,
          term: match.term,
          type: match.type,
          definition: match.definition,
          example: match.example,
          imageSrc: match.imageSrc ? resolveAssetUrl(match.imageSrc) : undefined,
        }
      : null;
  }, [activeTerm, unit.languageBank]);
  const startTrack = (text: string, idx: number | "full") => {
    if (!listeningEnabled || !audio.isSupported) return;
    setFullStep(null);
    setPlayingIdx(idx);
    audio.speak(text, "en-US", getBusinessReadingAudio(unit.id, text)?.key);
  };
  const playParagraph = (text: string, idx: number) => {
    setFullStep(null);
    if (playingIdx === idx && audio.isPaused) audio.resume();
    else if (playingIdx === idx && audio.isPlaying) {
      if (audio.isLoading) audio.stop();
      else audio.pause();
    } else startTrack(text, idx);
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
        aria-labelledby="case-study-title"
        className="min-w-0 rounded-2xl border border-border bg-card p-4 sm:p-8"
      >
        <div className="wp-prose mx-auto space-y-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold text-foreground">
              {t("business.input.scenarioTag", { level: unit.level })}
            </p>
            <h2
              id="case-study-title"
              className="wp-type-stage-title text-foreground"
              lang="en"
              dir="ltr"
            >
              <RichPassageText
                text={presentation.title}
                vocabTerms={vocabTerms}
                onTermClick={openTerm}
                interactiveVocabulary={true}
              />
            </h2>
          </header>
          <ReadingAudioPlayer
            audio={audio}
            active={playingIdx !== null}
            onPlay={() => playFullScenario(0)}
            onRestart={() => playFullScenario(0)}
            rate={playbackRate}
            onRateChange={setPlaybackRate}
            enabled={listeningEnabled}
          />
          <div
            className="space-y-6 text-base leading-relaxed text-foreground sm:text-lg"
            lang="en"
            dir="ltr"
          >
            {presentation.showContext && (
              <p>
                <TimedPassageText
                  text={unit.mainInput.context}
                  spans={
                    fullRecording
                      ? fullRecording.spans
                      : getBusinessReadingAudio(unit.id, unit.mainInput.context)?.spans
                  }
                  time={
                    fullRecording
                      ? playingIdx === "full"
                        ? time
                        : null
                      : playingIdx === "full" &&
                          fullStep !== null &&
                          scenarioQueue[fullStep]?.idx === "context"
                        ? time
                        : null
                  }
                  offset={fullRecording ? unit.mainInput.title.length + 2 : 0}
                  vocabTerms={vocabTerms}
                  onTermClick={openTerm}
                  interactiveVocabulary={true}
                />
              </p>
            )}
            {unit.mainInput.dialogue.map((line, idx) => {
              if (!presentation.visibleLineIndices.has(idx)) return null;
              const narrator = line.speaker.trim().toLowerCase() === "narrator";
              const selected = playingIdx === idx;
              const isLineActiveInFull =
                playingIdx === "full" &&
                !fullRecording &&
                fullStep !== null &&
                scenarioQueue[fullStep]?.idx === idx;
              const isFullMonolithic = playingIdx === "full" && Boolean(fullRecording);
              const recording = isFullMonolithic
                ? fullRecording
                : getBusinessReadingAudio(unit.id, line.text);
              const offset = isFullMonolithic
                ? unit.mainInput.title.length +
                  2 +
                  unit.mainInput.context.length +
                  1 +
                  unit.mainInput.dialogue
                    .slice(0, idx)
                    .reduce((sum, previous) => sum + previous.text.length + 1, 0)
                : 0;
              return (
                <div key={idx} className="flex min-w-0 items-start gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    {!narrator && (
                      <p className="mb-1 text-sm font-semibold text-foreground">{line.speaker}</p>
                    )}
                    <p>
                      <TimedPassageText
                        text={line.text}
                        spans={recording?.spans}
                        time={isFullMonolithic || isLineActiveInFull || selected ? time : null}
                        offset={offset}
                        vocabTerms={vocabTerms}
                        onTermClick={openTerm}
                        interactiveVocabulary={true}
                      />
                    </p>
                  </div>
                  {listeningEnabled && (
                    <button
                      type="button"
                      onClick={() => playParagraph(line.text, idx)}
                      disabled={!audio.isSupported}
                      aria-pressed={(selected || isLineActiveInFull) && audio.isPlaying}
                      aria-label={t(
                        (selected || isLineActiveInFull) && audio.isPaused
                          ? "readingPlayer.resumeParagraph"
                          : (selected || isLineActiveInFull) && audio.isPlaying
                            ? "readingPlayer.pauseParagraph"
                            : "conversation.listenParagraph",
                        { number: idx + 1 }
                      )}
                      className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-foreground hover:bg-secondary disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {(selected || isLineActiveInFull) && audio.isPlaying ? (
                        <Pause className="size-4" aria-hidden />
                      ) : (
                        <Volume2 className="size-4" aria-hidden />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <ReadingVocabulary terms={presentTerms} onSelect={openTerm} />
        </div>
      </article>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            audio.stop();
            onNext();
          }}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {t("business.input.continueToVocab")}
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
      <VocabularyDetailModal
        item={selectedVocabItem}
        isOpen={Boolean(selectedVocabItem)}
        onClose={() => setActiveTerm(null)}
        audioKey={
          selectedVocabItem
            ? getBusinessReadingAudio(unit.id, selectedVocabItem.term)?.key
            : undefined
        }
      />
    </div>
  );
}
