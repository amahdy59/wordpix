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
}

export function VocabularyCard({ word, meta, materials, isRevealed, onReveal }: Props) {
  const { speak, stop } = useAudio({ lang: "en-US", rate: 0.9 });
  const [showDetails, setShowDetails] = useState(false);

  // Look up pronunciation details if available
  const pronunciation = materials.pronunciationGuide?.find(
    (p) => p.word.toLowerCase() === word.label.toLowerCase()
  );

  const handleAudio = () => {
    stop();
    speak(word.label);
  };

  return (
    <div className="w-full bg-card rounded-3xl border border-border shadow-xs overflow-hidden flex flex-col">
      <div className="w-full bg-muted/60 aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center p-4 border-b border-border/60">
        <WordImage word={word} className="w-full h-full object-contain" altMode="learning" />
      </div>

      <div className="p-6 sm:p-8 flex flex-col items-center text-center">
        {!isRevealed ? (
          <div className="w-full flex flex-col items-center py-4 space-y-4">
            <p className="text-muted-foreground text-sm font-medium">
              Try to recall this word in English before revealing.
            </p>
            <button
              onClick={onReveal}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-primary-foreground rounded-2xl font-bold text-base hover:bg-primary/90 transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[48px] shadow-xs"
            >
              <Eye className="size-5" aria-hidden />
              <span>Reveal Word</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2 break-words max-w-full tracking-tight">
              {word.label}
            </h3>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-lg text-muted-foreground font-mono bg-secondary/60 px-3 py-1 rounded-xl">
                {pronunciation?.ipa || word.phonetic}
              </span>
              <button
                onClick={handleAudio}
                className="size-11 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[44px] min-w-[44px]"
                aria-label={`Listen to ${word.label}`}
              >
                <Volume2 className="size-5" aria-hidden />
              </button>
            </div>

            <div className="w-full border-t border-border/70 pt-4 text-start">
              <button
                type="button"
                onClick={() => setShowDetails((prev) => !prev)}
                aria-expanded={showDetails}
                aria-controls={`word-details-${word.id}`}
                className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl min-h-[44px]"
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
                  className="mt-3 space-y-4 animate-in fade-in slide-in-from-top-1 duration-150 p-4 rounded-2xl bg-secondary/20 border border-border/60"
                >
                  {word.description && (
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Meaning
                      </h4>
                      <p className="text-foreground text-sm leading-relaxed">{word.description}</p>
                    </div>
                  )}

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
