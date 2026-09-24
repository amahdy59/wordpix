import { useState } from "react";
import { BookOpen, Volume2, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ConversationUnit } from "../conversationTypes";
import { useI18n } from "../../../../i18n";
import { useLearner } from "../../../context/LearnerContext";
import { useAudio } from "../../../shared/useAudio";
import { PlaybackSpeedControl } from "../../../shared/PlaybackSpeedControl";

interface Props {
  unit: ConversationUnit;
  onNext: () => void;
  onPrev: () => void;
}

export function ReadingStage({ unit, onNext, onPrev }: Props) {
  const { t } = useI18n();
  const { state: learnerState } = useLearner();
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [manualAudioStatus, setManualAudioStatus] = useState("");
  const [playbackRate, setPlaybackRate] = useState(0.85);
  const [activeTrack, setActiveTrack] = useState<"full" | number | null>(null);
  const listeningEnabled = learnerState.accessibility.includeListening;
  const audio = useAudio({
    lang: "en-US",
    rate: playbackRate,
    preferLocal: true,
    onEnded: () => setActiveTrack(null),
    onError: () => setActiveTrack(null),
  });
  const isPlaying = audio.isPlaying;

  const audioStatus =
    manualAudioStatus ||
    (audio.status === "playing"
      ? t("conversation.audioPlaying")
      : audio.status === "error" || audio.status === "unsupported"
        ? t("conversation.audioUnavailable")
        : "");

  const playTrack = (track: "full" | number, text: string) => {
    if (!listeningEnabled || !audio.isSupported) {
      setManualAudioStatus(t("conversation.audioUnavailable"));
      return;
    }
    if (isPlaying && activeTrack === track) {
      audio.stop();
      setActiveTrack(null);
      return;
    }
    audio.stop();
    setManualAudioStatus("");
    setActiveTrack(track);
    audio.speak(text);
  };

  const handleToggleAudio = () =>
    playTrack("full", `${unit.reading.title}. ${unit.reading.paragraphs.join(" ")}`);

  const handleRateChange = (rate: number) => {
    audio.stop();
    setActiveTrack(null);
    setPlaybackRate(rate);
  };

  const selectedVocab = activeTerm
    ? unit.languageBank.find((i) => i.term.toLowerCase() === activeTerm.toLowerCase())
    : null;

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
      {/* Stage Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
          <BookOpen className="size-4" aria-hidden />
          {t("conversation.readingStage")}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <PlaybackSpeedControl
            value={playbackRate}
            onChange={handleRateChange}
            label={t("conversation.playbackSpeed")}
            options={[
              { value: 0.85, label: t("conversation.slowSpeed") },
              { value: 1, label: t("conversation.normalSpeed") },
            ]}
            disabled={!listeningEnabled}
          />
          <button
            type="button"
            onClick={handleToggleAudio}
            disabled={!listeningEnabled}
            aria-pressed={isPlaying && activeTrack === "full"}
            aria-busy={audio.status === "loading"}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${
              isPlaying && activeTrack === "full"
                ? "border-primary bg-primary text-primary-foreground shadow-wp-sm"
                : "border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            <Volume2 className="size-4.5" aria-hidden />
            <span>
              {isPlaying && activeTrack === "full"
                ? t("conversation.pauseNarration")
                : t("conversation.listenReading")}
            </span>
          </button>
        </div>
        <span className="sr-only" aria-live="polite">
          {audioStatus}
        </span>
      </div>

      {/* Reading Article Card */}
      <article
        className="rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-wp-sm flex flex-col gap-5"
        aria-labelledby="reading-title"
      >
        <header className="border-b border-border/60 pb-4">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {t("conversation.level", { level: unit.level })} · {unit.topic}
          </span>
          <h1
            id="reading-title"
            className="mt-1.5 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
          >
            {unit.reading.title}
          </h1>
        </header>

        {/* Paragraphs with bold target terms */}
        <div className="flex flex-col gap-4 text-base sm:text-lg leading-relaxed text-foreground font-normal">
          {unit.reading.paragraphs.map((paragraph, pIdx) => {
            const terms = unit.languageBank
              .map((item) => item.term)
              .filter((term) =>
                new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\b`, "i").test(
                  paragraph
                )
              )
              .sort((a, b) => b.length - a.length);
            const pattern = new RegExp(
              `(${terms.map((term) => term.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")).join("|")})`,
              "gi"
            );
            const paragraphIsPlaying = isPlaying && activeTrack === pIdx;
            return (
              <div
                key={pIdx}
                className={`relative rounded-2xl border p-4 pe-16 transition-colors ${paragraphIsPlaying ? "border-primary bg-primary/5 shadow-wp-xs" : "border-transparent hover:border-border hover:bg-muted/30"}`}
              >
                <p>
                  {terms.length > 0
                    ? paragraph.split(pattern).map((part, index) => {
                        const match = terms.find(
                          (term) => term.toLowerCase() === part.toLowerCase()
                        );
                        return match ? (
                          <button
                            key={`${pIdx}-${index}`}
                            type="button"
                            onClick={() => setActiveTerm(match)}
                            aria-label={t("conversation.learnWord", { word: match })}
                            className="rounded-md px-0.5 font-black text-primary underline decoration-primary/50 decoration-2 underline-offset-4 hover:bg-primary/10 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary"
                          >
                            {part}
                          </button>
                        ) : (
                          part
                        );
                      })
                    : paragraph}
                </p>
                <button
                  type="button"
                  onClick={() => playTrack(pIdx, paragraph)}
                  disabled={!listeningEnabled}
                  aria-pressed={paragraphIsPlaying}
                  aria-label={t("conversation.listenParagraph", { number: pIdx + 1 })}
                  className={`absolute end-3 top-3 flex size-11 items-center justify-center rounded-xl border transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${paragraphIsPlaying ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-primary hover:bg-primary hover:text-primary-foreground"}`}
                >
                  <Volume2 className="size-4" aria-hidden />
                </button>
              </div>
            );
          })}
        </div>

        {/* "In Short" Core Synthesis Box */}
        <div className="mt-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-wide">
            <CheckCircle2 className="size-4.5" aria-hidden />
            <span>{t("conversation.inShort")}</span>
          </div>
          <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-foreground">
            {unit.reading.inShort.summary}
          </p>

          <div className="mt-3 flex flex-wrap gap-2 pt-2 border-t border-primary/20">
            <span className="text-xs font-bold text-muted-foreground py-1">
              {t("conversation.targetTerms")}:
            </span>
            {unit.reading.inShort.targetTerms.map((term, tIdx) => (
              <button
                key={tIdx}
                type="button"
                onClick={() => setActiveTerm(term)}
                className="inline-flex min-h-[44px] items-center rounded-lg bg-card px-3 py-1.5 text-xs font-bold text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Vocab Helper Card */}
        {selectedVocab && (
          <div
            className="rounded-2xl border-2 border-primary/35 bg-primary/5 p-4 shadow-wp-xs animate-in fade-in slide-in-from-bottom-2"
            role="region"
            aria-live="polite"
            aria-label={t("conversation.learnWord", { word: selectedVocab.term })}
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-foreground text-sm">{selectedVocab.term}</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {selectedVocab.type}
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{selectedVocab.meaning}</p>
            <p className="mt-1.5 text-xs italic text-foreground bg-muted/40 p-2 rounded-lg">
              "{selectedVocab.example}"
            </p>
          </div>
        )}
      </article>

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
          <span>{t("conversation.continueLanguageBank")}</span>
          <ArrowRight className="size-5 rtl:rotate-180" aria-hidden />
        </button>
      </div>
    </div>
  );
}
