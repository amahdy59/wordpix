import type { BusinessRecallPrompt, BusinessUnit } from "./businessTypes";

/** Build recognition choices from existing expressions; never fabricate answers. */
export function recallChoices(prompt: BusinessRecallPrompt, unit: BusinessUnit): string[] {
  const answer = prompt.correctAnswer ?? prompt.targetWord;
  const phrases = answer.trim().includes(" ");
  const candidates = [
    ...(prompt.options ?? []),
    ...(unit.recall?.prompts.map((item) => item.correctAnswer ?? item.targetWord) ?? []),
    ...unit.languageBank.map((item) => item.term),
  ];
  const seen = new Set([answer.toLocaleLowerCase()]);
  const distractors = candidates
    .filter((candidate) => {
      const key = candidate.trim().toLocaleLowerCase();
      if (!key || seen.has(key) || candidate.includes(" ") !== phrases) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 3);
  const position =
    [...prompt.id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % (distractors.length + 1);
  distractors.splice(position, 0, answer);
  return distractors;
}
