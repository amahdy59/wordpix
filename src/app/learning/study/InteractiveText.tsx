import { useMemo } from "react";
import { loadedUnitVocabulary } from "../../data/vocabulary";
import type { VocabularyItem } from "../../data/lessons";

interface UnitMatcher {
  regex: RegExp | null;
  vocabMap: Map<string, VocabularyItem>;
}

const unitMatcherCache = new Map<string, UnitMatcher>();

function getUnitMatcher(unitId: string): UnitMatcher {
  const cached = unitMatcherCache.get(unitId);
  if (cached) return cached;

  const vocabulary = loadedUnitVocabulary(unitId);
  if (!vocabulary || vocabulary.length === 0) {
    const emptyMatcher: UnitMatcher = { regex: null, vocabMap: new Map() };
    unitMatcherCache.set(unitId, emptyMatcher);
    return emptyMatcher;
  }

  // Sort by length descending to match longest phrases first (e.g. "wash hands" before "wash")
  const sortedVocab = [...vocabulary].sort((a, b) => b.label.length - a.label.length);
  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = sortedVocab.map((v) => escapeRegExp(v.label)).join("|");
  const regex = new RegExp(`\\b(${pattern})\\b`, "gi");

  const vocabMap = new Map<string, VocabularyItem>();
  for (const item of vocabulary) {
    vocabMap.set(item.label.toLowerCase(), item);
  }

  const matcher: UnitMatcher = { regex, vocabMap };
  unitMatcherCache.set(unitId, matcher);
  return matcher;
}

interface Props {
  text: string;
  unitId: string;
  onInspectWord: (word: VocabularyItem) => void;
  className?: string;
}

export function InteractiveText({ text, unitId, onInspectWord, className }: Props) {
  const { parts, matchedWords } = useMemo(() => {
    const matcher = getUnitMatcher(unitId);
    if (!matcher.regex) return { parts: [text], matchedWords: [] };

    const parts = text.split(matcher.regex);
    const matchedWords = parts.map((part) => matcher.vocabMap.get(part.toLowerCase()));

    return { parts, matchedWords };
  }, [text, unitId]);

  return (
    <span className={className} lang="en" dir="ltr">
      {parts.map((part, index) => {
        const word = matchedWords[index];
        if (word) {
          return (
            <button
              key={index}
              type="button"
              onClick={() => onInspectWord(word)}
              className="inline rounded px-1 py-0.5 -mx-0.5 align-baseline cursor-pointer touch-manipulation font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 bg-primary/8 hover:bg-primary/15 hover:decoration-primary hover:text-primary active:bg-primary/20 motion-safe:active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:bg-primary/15 motion-safe:transition-colors"
              title={`Tap to inspect "${part}"`}
              aria-label={`Inspect vocabulary word: ${part}`}
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
