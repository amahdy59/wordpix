import { useMemo, useState } from "react";
import { BookOpen, ArrowRight, UserCheck, MessageSquareQuote, Volume2, Users } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";
import { TimedPassageText } from "../../../shared/TimedPassageText";
import { getBusinessReadingAudio } from "../businessReadingAudio";
import { useLearner } from "../../../context/LearnerContext";
import { PlaybackSpeedControl } from "../../../shared/PlaybackSpeedControl";
import { VocabularyDetailModal } from "../../../shared/VocabularyDetailModal";
import type { VocabularyTableItem } from "../../../shared/CurriculumVocabularyTable";
import { resolveAssetUrl } from "../../../../utils/assetUrl";
import { useAudio } from "../../../shared/useAudio";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessInputStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const [playingIdx, setPlayingIdx] = useState<number | "full" | null>(null);
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [mediaTime, setMediaTime] = useState(0);
  const [hasMediaTiming, setHasMediaTiming] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(0.85);
  const { state: learnerState } = useLearner();
  const listeningEnabled = learnerState.accessibility.includeListening;
  const fullText = `${unit.mainInput.title}. ${unit.mainInput.context} ${unit.mainInput.dialogue.map((line) => line.text).join(" ")}`;
  const fullRecording = getBusinessReadingAudio(unit.id, fullText);

  const audio = useAudio({
    lang: "en-US",
    rate: playbackRate,
    onEnded: () => setPlayingIdx(null),
    onError: () => setPlayingIdx(null),
    onTimeUpdate: (time, duration) => {
      setMediaTime(time);
      setHasMediaTiming(duration > 0);
    },
  });

  // Extract unique speakers (excluding Narrator)
  const speakers = useMemo(() => {
    const set = new Set<string>();
    unit.mainInput.dialogue.forEach((d) => {
      if (d.speaker && d.speaker.toLowerCase() !== "narrator") {
        set.add(d.speaker.trim());
      }
    });
    return Array.from(set);
  }, [unit.mainInput.dialogue]);

  // Set of target vocabulary terms for visual highlight
  const vocabTerms = useMemo(() => {
    return unit.languageBank.map((item) => item.term);
  }, [unit.languageBank]);

  const selectedVocabItem = useMemo<VocabularyTableItem | null>(() => {
    if (!activeTerm) return null;
    const norm = (s: string) => s.toLowerCase().trim().replace(/[-_]/g, " ");
    const targetNorm = norm(activeTerm);

    const match = unit.languageBank.find((i) => {
      const bNorm = norm(i.term);
      return (
        bNorm === targetNorm ||
        bNorm + "s" === targetNorm ||
        targetNorm + "s" === bNorm ||
        (bNorm.length >= 4 && targetNorm.includes(bNorm)) ||
        (targetNorm.length >= 4 && bNorm.includes(targetNorm))
      );
    });

    if (match) {
      return {
        id: match.id,
        term: match.term,
        type: match.type,
        definition: match.definition,
        example: match.example,
        imageSrc: match.imageSrc ? resolveAssetUrl(match.imageSrc) : undefined,
      };
    }
    return null;
  }, [activeTerm, unit.languageBank]);

  const handleSpeak = (text: string, idx: number | "full") => {
    if (!listeningEnabled || !audio.isSupported) return;
    if (playingIdx === idx && audio.isPlaying) {
      audio.stop();
      setPlayingIdx(null);
      return;
    }
    setPlayingIdx(idx);
    setMediaTime(0);
    setHasMediaTiming(false);
    audio.speak(text, "en-US", getBusinessReadingAudio(unit.id, text)?.key);
  };

  return (
    <div className="wp-container-reading flex flex-col gap-6 py-2">
      {/* Header Tag */}
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <BookOpen className="size-4" aria-hidden />
          {t("business.input.stageTag")}
        </span>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {t("business.input.scenarioTag", { level: unit.level })}
        </span>
      </div>

      {/* Case Header Card */}
      <section
        className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-wp-sm"
        aria-labelledby="case-study-title"
      >
        <p className="text-xs font-black uppercase tracking-widest text-primary">
          {t("business.input.executiveBriefing")}
        </p>
        <h2
          id="case-study-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.mainInput.title}
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleSpeak(fullText, "full")}
            disabled={!listeningEnabled || !audio.isSupported}
            aria-pressed={playingIdx === "full" && audio.isPlaying}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold text-foreground disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Volume2 className="size-4" aria-hidden />
            {playingIdx === "full" && audio.isPlaying
              ? t("conversation.pauseNarration")
              : t("conversation.listenReading")}
          </button>
          <PlaybackSpeedControl
            value={playbackRate}
            onChange={(rate) => {
              audio.stop();
              setPlayingIdx(null);
              setPlaybackRate(rate);
            }}
            label={t("conversation.playbackSpeed")}
            disabled={!listeningEnabled}
            options={[
              { value: 0.85, label: t("conversation.slowSpeed") },
              { value: 1, label: t("conversation.normalSpeed") },
            ]}
          />
        </div>
        {(audio.status === "error" || audio.status === "unsupported") && (
          <p role="status" className="mt-2 text-sm text-foreground">
            {t("conversation.audioUnavailable")}
          </p>
        )}

        {unit.mainInput.context && (
          <div className="mt-4 rounded-2xl bg-muted/40 border border-border/80 p-4 sm:p-5">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-1">
              {t("business.input.contextAndSetting")}
            </span>
            <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
              <TimedPassageText
                text={unit.mainInput.context}
                spans={fullRecording?.spans}
                time={playingIdx === "full" && audio.isPlaying && hasMediaTiming ? mediaTime : null}
                offset={unit.mainInput.title.length + 2}
              />
            </p>
          </div>
        )}

        {/* Participant Roster */}
        {speakers.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
              <Users className="size-3.5" aria-hidden />
              {t("business.input.participantsLabel")}
            </span>
            {speakers.map((spk, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary"
              >
                <UserCheck className="size-3" aria-hidden />
                {spk}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Dialogue / Case Transcript Section */}
      <section
        className="rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-wp-sm"
        aria-label="Conversation Interaction"
      >
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="size-5 text-primary" aria-hidden />
            <h2 className="text-lg font-black text-foreground">
              {t("business.input.executiveTranscript")}
            </h2>
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {t("business.input.targetPhrasesNote")}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {unit.mainInput.dialogue.map((line, idx) => {
            const isNarrator = line.speaker.toLowerCase() === "narrator";
            const speakerIndex = speakers.indexOf(line.speaker.trim());
            const isAltSpeaker = speakerIndex % 2 === 1;

            const isPlaying = playingIdx === idx && audio.isPlaying;
            const recording =
              playingIdx === "full" ? fullRecording : getBusinessReadingAudio(unit.id, line.text);
            const offset =
              playingIdx === "full"
                ? unit.mainInput.title.length +
                  2 +
                  unit.mainInput.context.length +
                  1 +
                  unit.mainInput.dialogue
                    .slice(0, idx)
                    .reduce((sum, previous) => sum + previous.text.length + 1, 0)
                : 0;
            return (
              <div
                key={idx}
                aria-current={isPlaying ? "true" : undefined}
                className={`flex flex-col gap-2 p-4 sm:p-5 rounded-2xl transition-all ${
                  isNarrator
                    ? "bg-muted/30 border border-dashed border-border text-muted-foreground"
                    : isAltSpeaker
                      ? "bg-secondary/40 border border-border hover:border-primary/40"
                      : "bg-muted/50 border border-border hover:border-primary/40"
                } ${isPlaying ? "ring-2 ring-primary border-primary bg-primary/10 shadow-wp-sm" : ""}`}
              >
                {!isNarrator && (
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex size-7 items-center justify-center rounded-lg text-xs font-black ${
                          isAltSpeaker ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                        }`}
                      >
                        {line.speaker.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-xs font-black uppercase tracking-wider text-foreground">
                        {line.speaker}
                      </span>
                    </div>

                    {listeningEnabled && (
                      <button
                        type="button"
                        onClick={() => handleSpeak(line.text, idx)}
                        aria-label={`Listen to ${line.speaker}: "${line.text.slice(0, 30)}..."`}
                        aria-pressed={isPlaying}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <Volume2
                          className={`size-4 ${playingIdx === idx ? "text-primary motion-safe:animate-pulse" : ""}`}
                          aria-hidden
                        />
                      </button>
                    )}
                  </div>
                )}

                <p
                  className={`text-base leading-relaxed ${
                    isNarrator ? "italic font-normal" : "font-medium text-foreground"
                  }`}
                >
                  <TimedPassageText
                    text={line.text}
                    spans={recording?.spans}
                    time={
                      audio.isPlaying &&
                      hasMediaTiming &&
                      (playingIdx === "full" || playingIdx === idx)
                        ? mediaTime
                        : null
                    }
                    offset={offset}
                    vocabTerms={vocabTerms}
                    onTermClick={(term) => setActiveTerm(term)}
                  />
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Action Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-wp-sm hover:brightness-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <span>{t("business.input.continueToVocab")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>

      {/* Accessible Interactive Word Inspector Modal */}
      <VocabularyDetailModal
        item={selectedVocabItem}
        isOpen={Boolean(activeTerm && selectedVocabItem)}
        onClose={() => setActiveTerm(null)}
      />
    </div>
  );
}
