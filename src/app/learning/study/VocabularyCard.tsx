import { useState } from "react";
import type { VocabularyItem } from "../../data/lessons";
import type { WordMetaEntry, UnitLearningMaterials } from "../types";
import { useAudio } from "../../shared/useAudio";
import { Volume2 } from "lucide-react";
import { SecondaryButton } from "../../shared/SecondaryButton";

interface Props {
  word: VocabularyItem;
  meta?: WordMetaEntry;
  materials: UnitLearningMaterials;
}

export function VocabularyCard({ word, meta, materials }: Props) {
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
    <div className="w-full bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="w-full bg-muted aspect-[4/3] sm:aspect-[3/2] flex items-center justify-center p-4">
        <img
          src={word.img}
          alt={word.label}
          className="w-full h-full object-contain mix-blend-multiply"
        />
      </div>
      <div className="p-6 md:p-8 flex flex-col items-center text-center">
        <h3 className="text-4xl font-bold text-foreground mb-2">{word.label}</h3>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-lg text-muted-foreground font-mono">
            {pronunciation?.ipa || word.phonetic}
          </span>
          <button
            onClick={handleAudio}
            className="w-[44px] h-[44px] shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label={`Listen to ${word.label}`}
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>

        {!showDetails ? (
          <div className="mt-4">
            <SecondaryButton label="Show Details" onClick={() => setShowDetails(true)} />
          </div>
        ) : (
          <div className="w-full text-start space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {word.description && (
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Meaning
                </h4>
                <p className="text-foreground">{word.description}</p>
              </div>
            )}

            {meta?.collocations && meta.collocations.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Useful with
                </h4>
                <div className="flex flex-wrap gap-2">
                  {meta.collocations.map((col, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
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
  );
}
