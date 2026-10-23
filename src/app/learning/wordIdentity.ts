import { COURSE_UNITS } from "../data/courseCatalog";
import type { WordLearningState } from "../../features/gamification/sm2";

export interface ReviewWord {
  unitId: string;
  wordId: string;
}
const owners = new Map<string, string[]>();
for (const unit of Object.values(COURSE_UNITS)) {
  for (const id of new Set(unit.wordIds)) owners.set(id, [...(owners.get(id) ?? []), unit.id]);
}

/** A learning identity only. Content IDs and media keys are never rewritten. */
export const wordMemoryKey = (unitId: string, wordId: string) => `${unitId}::${wordId}`;
export function uniqueWordUnit(wordId: string): string | undefined {
  const units = owners.get(wordId);
  return units?.length === 1 ? units[0] : undefined;
}
export function getWordMemory(
  memory: Record<string, WordLearningState>,
  wordId: string,
  unitId: string
) {
  return memory[wordMemoryKey(unitId, wordId)] ?? memory[wordId];
}
export function hasWordActivity(state: WordLearningState | undefined) {
  return Boolean(
    state &&
    (state.exposures > 0 ||
      state.correctRecalls > 0 ||
      state.incorrectRecalls > 0 ||
      state.lastSeenAt ||
      state.mastery !== "new")
  );
}
export function reviewWordMemory(
  memory: Record<string, WordLearningState>,
  items: readonly ReviewWord[]
) {
  const result: Record<string, WordLearningState> = {};
  for (const item of items) {
    const state = getWordMemory(memory, item.wordId, item.unitId);
    if (state) result[item.wordId] = state;
  }
  return result;
}
export function unitWordMemory(memory: Record<string, WordLearningState>, unitId: string) {
  return Object.fromEntries(
    (COURSE_UNITS[unitId]?.wordIds ?? []).flatMap((id) => {
      const state = getWordMemory(memory, id, unitId);
      return state ? [[id, state]] : [];
    })
  );
}

/** Ambiguous legacy evidence is retained separately, never attributed to an invented sense. */
export function migrateWordMemory(memory: Record<string, WordLearningState>) {
  const current: Record<string, WordLearningState> = {};
  const legacy: Record<string, WordLearningState> = {};
  for (const [key, value] of Object.entries(memory)) {
    const unitId =
      value.unitId ?? (key.includes("::") ? key.split("::")[0] : uniqueWordUnit(value.wordId));
    if (unitId && COURSE_UNITS[unitId]?.wordIds.includes(value.wordId)) {
      const scopedKey = wordMemoryKey(unitId, value.wordId);
      // Explicit scoped evidence wins over older ambiguous records.
      if (!current[scopedKey] || value.unitId) current[scopedKey] = { ...value, unitId };
    } else legacy[key] = value;
  }
  return { current, legacy };
}

/** Keep each raw content ID unique in a session; other senses remain due for the next session. */
export function selectReviewWords(due: readonly WordLearningState[], limit: number): ReviewWord[] {
  const seen = new Set<string>();
  const selected: ReviewWord[] = [];
  for (const word of due) {
    const unitId = word.unitId ?? uniqueWordUnit(word.wordId);
    if (!unitId || seen.has(word.wordId) || !COURSE_UNITS[unitId]?.wordIds.includes(word.wordId))
      continue;
    seen.add(word.wordId);
    selected.push({ wordId: word.wordId, unitId });
    if (selected.length >= limit) break;
  }
  return selected;
}
