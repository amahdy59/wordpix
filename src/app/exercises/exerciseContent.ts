import { BEDROOM_VOCABULARY, type VocabItem } from "../data/lessons";

export const CONFUSION_PAIRS: Record<string, string[]> = {
  pillow: ["blanket", "nightstand", "bed", "dresser"],
  blanket: ["pillow", "bed", "nightstand"],
  bed: ["pillow", "blanket", "nightstand"],
  nightstand: ["dresser", "wardrobe", "desk"],
  dresser: ["wardrobe", "nightstand", "bookshelf"],
  wardrobe: ["dresser", "closet", "mirror"],
  desk: ["chair", "bookshelf", "lamp"],
  chair: ["desk", "bedroom-bench"],
  bookshelf: ["desk", "dresser"],
  mirror: ["wardrobe", "dresser"],
};

/**
 * Generates semantically and visually related distractors instead of purely random picks.
 */
export function getSemanticDistractors(word: VocabItem, count = 3): VocabItem[] {
  const confusionIds = CONFUSION_PAIRS[word.id] ?? [];
  const confusionWords = confusionIds
    .map((id) => BEDROOM_VOCABULARY.find((item) => item.id === id))
    .filter(Boolean) as VocabItem[];

  const sameTopic = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic === word.topic && !confusionIds.includes(item.id)
  );

  const otherTopics = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic !== word.topic && !confusionIds.includes(item.id)
  );

  const pool = [...confusionWords, ...sameTopic, ...otherTopics];
  return pool.slice(0, count);
}

export function getDistractors(word: VocabItem, count = 3): VocabItem[] {
  return getSemanticDistractors(word, count);
}

export function articleFor(label: string): "a" | "an" {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}
