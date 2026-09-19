import type { Lesson } from "../data/lessons";

/**
 * Samples across every authored subtopic instead of taking a random slice from
 * the unit. Deterministic sampling makes the assessment reproducible and keeps
 * one large group from dominating the evidence.
 */
export function buildUnitAssessmentSample(groups: Lesson[], limit = 20): string[] {
  const selected: string[] = [];
  const seen = new Set<string>();
  const maxDepth = Math.max(0, ...groups.map((group) => group.wordIds.length));

  for (let depth = 0; depth < maxDepth && selected.length < limit; depth += 1) {
    for (const group of groups) {
      const wordId = group.wordIds[depth];
      if (!wordId || seen.has(wordId)) continue;
      seen.add(wordId);
      selected.push(wordId);
      if (selected.length === limit) break;
    }
  }
  return selected;
}

export const ASSESSMENT_PASS_PERCENT = 80;
