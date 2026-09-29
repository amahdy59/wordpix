import type { VocabularyItem } from "./courseCatalog";
import type { LessonUsageData } from "./usageTypes";

function escapePattern(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsLabel(text: string, label: string): boolean {
  return new RegExp(`\\b${escapePattern(label.trim()).replace(/\\s+/g, "\\s+")}\\b`, "iu").test(
    text
  );
}

function sentenceCandidates(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/u)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

/**
 * Finds a sentence in which the target is doing meaningful work. Scene copy
 * is preferred because it keeps the target beside the other words in its
 * lesson cluster; the reading is the second source of truth.
 */
export function findLessonContextSentences(
  word: Pick<VocabularyItem, "label">,
  usage: LessonUsageData | null | undefined
): string[] {
  if (!usage) return [];
  const sources = [
    ...usage.usage.scenes.flatMap((scene) => sentenceCandidates(scene.scenario)),
    ...sentenceCandidates(usage.reading.text),
    ...(usage.contextExtensions ?? []).flatMap((context) => sentenceCandidates(context.text)),
  ];
  return [...new Set(sources.filter((sentence) => containsLabel(sentence, word.label)))];
}

export function findLessonContextSentence(
  word: Pick<VocabularyItem, "label">,
  usage: LessonUsageData | null | undefined
): string | undefined {
  return findLessonContextSentences(word, usage)[0];
}

export interface ReviewInterval {
  distance: number;
  words: string[];
  lessonId: string;
}

/** Parses generated review copy into data without depending on word position. */
export function parseSpacedReview(value: string): ReviewInterval[] {
  return value
    .split(/\r?\n/u)
    .map((line) => line.match(/^(\d+) lesson\(s\) back:\s*(.+?)\s+from\s+([a-z0-9-]+)$/iu))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => ({
      distance: Number(match[1]),
      words: match[2].split(",").map((word) => word.trim()),
      lessonId: match[3],
    }));
}

/** Rotates rather than randomises so answer position varies but stays stable. */
export function rotateOptions<T>(options: readonly T[], offset: number): T[] {
  if (options.length === 0) return [];
  const normalized = ((offset % options.length) + options.length) % options.length;
  return [...options.slice(normalized), ...options.slice(0, normalized)];
}
