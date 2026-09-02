import { useState } from "react";
import type { VocabularyItem } from "../../data/lessons";
import type { WordMetaEntry, UnitLearningMaterials } from "../types";
import { useAudio } from "../../shared/useAudio";
import { Volume2, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { WordImage } from "../../shared/WordImage";

interface Props {
  word: VocabularyItem;
  meta?: WordMetaEntry;
  materials: UnitLearningMaterials;
  isRevealed: boolean;
  onReveal: () => void;
  immersionMode?: boolean;
}

export function VocabularyCard({
  word,
  meta,
  materials,
  isRevealed,
  onReveal,
  immersionMode = false,
}: Props) {
  const [speechRate, setSpeechRate] = useState<0.8 | 1.0 | 1.2>(1.0);
  const { speak, stop } = useAudio({ lang: "en-US", rate: speechRate });
  const [showDetails, setShowDetails] = useState(false);
  const [showImmersionArabic, setShowImmersionArabic] = useState(false);

  // Look up pronunciation details if available
  const pronunciation = materials.pronunciationGuide?.find(
    (p) => p.word.toLowerCase() === word.label.toLowerCase()
  );

  const handleAudio = () => {
    stop();
    speak(word.label);
  };

  const cycleSpeed = () => {
    setSpeechRate((prev) => (prev === 1.0 ? 1.2 : prev === 1.2 ? 0.8 : 1.0));
  };

  return (
    <div className="w-full h-full bg-card rounded-3xl border border-border shadow-xs overflow-hidden flex flex-col">
      {/* Image area — fills remaining space, shrinks to fit viewport */}
      <div className="relative flex-1 min-h-0 bg-muted/60 flex items-center justify-center p-3 sm:p-4 border-b border-border/60">
        <WordImage word={word} className="w-full h-full object-contain" altMode="learning" />
      </div>

      {/* Word info — compact, never overflows */}
      <div className="shrink-0 px-5 py-4 sm:px-6 sm:py-5 flex flex-col items-center text-center">
        {!isRevealed ? (
          <div className="w-full flex flex-col items-center space-y-3">
            <p className="text-muted-foreground text-sm font-medium">
              Try to recall this word in English before revealing.
            </p>
            <button
              type="button"
              onClick={onReveal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] shadow-xs"
            >
              <Eye className="size-5" aria-hidden />
              <span>Reveal Word</span>
              <kbd className="hidden sm:inline-flex ms-1 px-2 py-0.5 text-xs bg-primary-foreground/20 rounded font-mono font-normal">
                Space
              </kbd>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-1.5 break-words max-w-full tracking-tight">
              {word.label}
            </h3>

            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <span className="text-sm sm:text-base text-muted-foreground font-mono bg-secondary/60 px-3 py-0.5 rounded-xl">
                {pronunciation?.ipa || word.phonetic}
              </span>
              {!immersionMode &&
                ((word as { arabic?: string; ar?: string }).arabic ||
                  (word as { arabic?: string; ar?: string }).ar) && (
                  <span
                    className="text-sm sm:text-base text-muted-foreground font-bold bg-secondary/40 px-3 py-0.5 rounded-xl"
                    dir="rtl"
                    lang="ar"
                  >
                    {(word as { arabic?: string; ar?: string }).arabic ||
                      (word as { arabic?: string; ar?: string }).ar}
                  </span>
                )}
              <button
                type="button"
                onClick={handleAudio}
                className="size-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
                aria-label={`Listen to ${word.label}`}
                title={`Listen to ${word.label} (Press A)`}
              >
                <Volume2 className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={cycleSpeed}
                className="px-2.5 py-1 text-xs font-mono font-bold rounded-xl bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
                aria-label={`Speech playback speed: ${speechRate.toFixed(1)}x. Click to change.`}
                title="Change speech playback speed"
              >
                {speechRate.toFixed(1)}x
              </button>
            </div>

            <div className="w-full border-t border-border/70 pt-3 text-start">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                aria-expanded={showDetails}
                aria-controls={`word-details-${word.id}`}
                className="w-full flex items-center justify-between py-2 px-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl min-h-[44px]"
              >
                <span>
                  {showDetails ? "Hide Meaning & Collocations" : "Show Meaning & Collocations"}
                </span>
                {showDetails ? (
                  <ChevronUp className="size-4 text-muted-foreground" aria-hidden />
                ) : (
                  <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
                )}
              </button>

              {showDetails && (
                <div
                  id={`word-details-${word.id}`}
                  className="mt-2 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150 p-3 rounded-2xl bg-secondary/20 border border-border/60"
                >
                  {word.description && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Meaning
                      </h4>
                      <p className="text-foreground text-sm leading-relaxed">{word.description}</p>
                    </div>
                  )}

                  {immersionMode &&
                  ((word as { arabic?: string; ar?: string }).arabic ||
                    (word as { arabic?: string; ar?: string }).ar) ? (
                    <div>
                      {!showImmersionArabic ? (
                        <button
                          type="button"
                          onClick={() => setShowImmersionArabic(true)}
                          className="text-xs font-bold text-primary hover:underline py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary min-h-[44px] flex items-center gap-1.5"
                        >
                          <Eye className="size-3.5" />
                          <span>Reveal Arabic Meaning</span>
                        </button>
                      ) : (
                        <div
                          className="p-2.5 rounded-xl bg-background/80 border border-border/50 text-xs font-bold text-foreground"
                          dir="rtl"
                          lang="ar"
                        >
                          {(word as { arabic?: string; ar?: string }).arabic ||
                            (word as { arabic?: string; ar?: string }).ar}
                        </div>
                      )}
                    </div>
                  ) : null}

                  {meta?.collocations && meta.collocations.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        Useful with
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {meta.collocations.map((col, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-background text-foreground border border-border/80 rounded-xl text-xs font-bold shadow-2xs"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
