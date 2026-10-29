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
              className="text-primary font-medium hover:underline focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-primary rounded-xs px-[2px] -mx-[2px]"
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
