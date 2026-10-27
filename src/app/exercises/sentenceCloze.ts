/** Escape punctuation before constructing the pattern; multiword labels may
 * contain whitespace and must remain a single assessed phrase. */
function escapeLabel(label: string): string {
  return label
    .trim()
    .split(/\s+/u)
    .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("(?:\\s+|-)");
}

/** Only reviewed omissions in locked catalogue headings may expand a target. */
const NATURAL_TARGET_PATTERNS: Readonly<Record<string, string>> = {
  "brush teeth": "brush\\s+(?:my|your|his|her|our|their|the)\\s+teeth",
  "wash face": "wash\\s+(?:my|your|his|her|our|their|the)\\s+face",
  "pack bag": "pack\\s+(?:my|your|his|her|our|their|the|a)\\s+bag",
  "submit work": "submit\\s+(?:my|your|his|her|our|their|the)\\s+work",
  "leave office": "leave\\s+the\\s+office",
  "wash dishes": "wash\\s+the\\s+dishes",
  "put on pajamas": "put\\s+on\\s+(?:my|your|his|her|our|their)\\s+pajamas",
  "set alarm": "set\\s+(?:my|your|his|her|our|their|the|an)\\s+alarm",
  "clean house": "clean\\s+the\\s+house",
  "shake head": "shake\\s+(?:my|your|his|her|our|their|the)\\s+head",
  "furrow brow": "furrow\\s+(?:my|your|his|her|our|their|the)\\s+brow",
  "raise hand": "raise\\s+(?:my|your|his|her|our|their|a)\\s+hand",
  "keep off grass": "keep\\s+off\\s+the\\s+grass",
  "star gazing": "stargazing",
  "double boil": "use\\s+a\\s+double\\s+boiler",
  "motive / niyyah": "motive",
  "migration / hijrah": "migration",
};

export function findSentenceTarget(
  sentence: string,
  label: string
): { start: number; end: number; text: string } | undefined {
  const trimmed = label.trim();
  if (!trimmed) return undefined;
  // Authored question headings use an ellipsis for the learner's own object.
  const questionStem = /(?:\.{3}|…)\??$/u.test(trimmed)
    ? trimmed.replace(/(?:\.{3}|…)\??$/u, "").trim()
    : undefined;
  const alternatives = [
    escapeLabel(trimmed),
    NATURAL_TARGET_PATTERNS[trimmed.toLocaleLowerCase("en-US")],
    questionStem ? escapeLabel(questionStem) : undefined,
  ].filter((candidate): candidate is string => Boolean(candidate));
  const match = new RegExp(
    `(?<![\\p{L}\\p{N}])(?:${alternatives.join("|")})(?![\\p{L}\\p{N}])`,
    "iu"
  ).exec(sentence);
  return match
    ? { start: match.index, end: match.index + match[0].length, text: match[0] }
    : undefined;
}

export function sentenceCloze(sentence: string, label: string): string {
  const target = findSentenceTarget(sentence, label);
  return target
    ? `${sentence.slice(0, target.start)}_____${sentence.slice(target.end)}`.trim()
    : sentence.trim();
}
