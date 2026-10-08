/** Escape punctuation before constructing the pattern; multiword labels may
 * contain whitespace and must remain a single assessed phrase. */
export function sentenceCloze(sentence: string, label: string): string {
  const escaped = label
    .trim()
    .split(/\s+/u)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("\\s+");
  return sentence
    .replace(new RegExp(`(?<![\\p{L}\\p{N}])${escaped}(?![\\p{L}\\p{N}])`, "iu"), "_____")
    .trim();
}
