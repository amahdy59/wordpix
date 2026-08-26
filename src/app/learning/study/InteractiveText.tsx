import { useMemo } from "react";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import type { VocabularyItem } from "../../data/lessons";

interface Props {
  text: string;
  unitId: string;
  onInspectWord: (word: VocabularyItem) => void;
  className?: string;
}

export function InteractiveText({ text, unitId, onInspectWord, className }: Props) {
  const vocabulary = useMemo(() => loadedUnitVocabulary(unitId), [unitId]);

  const { parts, matchedWords } = useMemo(() => {
    if (vocabulary.length === 0) return { parts: [text], matchedWords: [] };

    // Sort by length descending to match longest phrases first (e.g. "wash hands" before "wash")
    const sortedVocab = [...vocabulary].sort((a, b) => b.label.length - a.label.length);

    // Create an escaped regex for the labels
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const pattern = sortedVocab.map((v) => escapeRegExp(v.label)).join("|");

    // \b is tricky because some words might have special characters, but we'll try standard boundary
    const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

    const parts = text.split(regex);
    const matchedWords = parts.map((part) => {
      const lower = part.toLowerCase();
      return sortedVocab.find((v) => v.label.toLowerCase() === lower);
    });

    return { parts, matchedWords };
  }, [text, vocabulary]);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        const word = matchedWords[index];
        if (word) {
          return (
            <button
              key={index}
              onClick={() => onInspectWord(word)}
              className="text-primary font-medium hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary rounded-sm px-[2px] -mx-[2px]"
              title="Tap to see meaning"
            >
              {part}
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
