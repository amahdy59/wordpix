import { useMemo, useState } from "react";
import { BookOpen, ArrowRight, UserCheck, MessageSquareQuote, Volume2, Users } from "lucide-react";
import { useI18n } from "../../../../i18n";
import type { BusinessUnit } from "../businessTypes";

interface Props {
  unit: BusinessUnit;
  onNext: () => void;
}

export function BusinessInputStage({ unit, onNext }: Props) {
  const { t } = useI18n();
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);

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
  const targetTerms = useMemo(() => {
    return unit.languageBank.map((item) => item.term.trim().toLowerCase());
  }, [unit.languageBank]);

  const handleSpeak = (text: string, idx: number) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    setPlayingIdx(idx);
    utterance.onend = () => setPlayingIdx(null);
    utterance.onerror = () => setPlayingIdx(null);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to highlight target vocabulary inside text
  const renderHighlightedText = (text: string) => {
    if (!targetTerms.length) return text;

    // Build regex of longer terms first to prevent partial match collisions
    const sortedTerms = [...targetTerms]
      .filter((t) => t.length > 2)
      .sort((a, b) => b.length - a.length);

    if (!sortedTerms.length) return text;

    const escaped = sortedTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`\\b(${escaped.join("|")})\\b`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) => {
      const isTarget = sortedTerms.includes(part.toLowerCase());
      if (isTarget) {
        return (
          <mark
            key={i}
            className="rounded bg-primary/20 px-1 py-0.5 font-bold text-foreground underline decoration-primary decoration-2 underline-offset-2"
          >
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full py-2">
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
        <h1
          id="case-study-title"
          className="mt-2 text-2xl sm:text-3xl font-black text-foreground tracking-tight"
        >
          {unit.mainInput.title}
        </h1>

        {unit.mainInput.context && (
          <div className="mt-4 rounded-2xl bg-muted/40 border border-border/80 p-4 sm:p-5">
            <span className="text-xs font-black uppercase tracking-wider text-muted-foreground block mb-1">
              {t("business.input.contextAndSetting")}
            </span>
            <p className="text-sm sm:text-base font-medium text-foreground leading-relaxed">
              {unit.mainInput.context}
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

            return (
              <div
                key={idx}
                className={`flex flex-col gap-2 p-4 sm:p-5 rounded-2xl transition-all ${
                  isNarrator
                    ? "bg-muted/30 border border-dashed border-border text-muted-foreground"
                    : isAltSpeaker
                      ? "bg-secondary/40 border border-border hover:border-primary/40"
                      : "bg-muted/50 border border-border hover:border-primary/40"
                }`}
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

                    <button
                      type="button"
                      onClick={() => handleSpeak(line.text, idx)}
                      aria-label={`Listen to ${line.speaker}: "${line.text.slice(0, 30)}..."`}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <Volume2
                        className={`size-4 ${playingIdx === idx ? "text-primary animate-pulse" : ""}`}
                        aria-hidden
                      />
                    </button>
                  </div>
                )}

                <p
                  className={`text-base leading-relaxed ${
                    isNarrator ? "italic font-normal" : "font-medium text-foreground"
                  }`}
                >
                  {renderHighlightedText(line.text)}
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
    </div>
  );
}
