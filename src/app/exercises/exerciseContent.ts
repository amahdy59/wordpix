import { BEDROOM_VOCABULARY, type VocabItem } from "../data/lessons";

export function getDistractors(word: VocabItem, count = 3): VocabItem[] {
  const sameTopic = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic === word.topic
  );
  const otherTopics = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic !== word.topic
  );
  return [...sameTopic, ...otherTopics].slice(0, count);
}

export function getWordOptions(word: VocabItem): VocabItem[] {
  return [word, ...getDistractors(word)].sort((a, b) => a.id.localeCompare(b.id));
}

export function articleFor(label: string): "a" | "an" {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}
