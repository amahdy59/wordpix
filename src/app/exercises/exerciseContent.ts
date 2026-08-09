import { BEDROOM_VOCABULARY, type VocabularyItem } from "../data/lessons";

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

export interface RichSentence {
  clozeBefore: string;
  clozeAfter: string;
  full: string;
  words: string[];
}

export const RICH_CONTEXT_SENTENCES: Record<string, RichSentence> = {
  bed: {
    clozeBefore: "I rest comfortably on my wooden",
    clozeAfter: "after a long day.",
    full: "I rest comfortably on my wooden bed after a long day.",
    words: ["I", "rest", "comfortably", "on", "my", "bed"],
  },
  nightstand: {
    clozeBefore: "The brass lamp sits on the small wooden",
    clozeAfter: "beside the bed.",
    full: "The brass lamp sits on the small wooden nightstand beside the bed.",
    words: ["The", "lamp", "sits", "on", "the", "nightstand"],
  },
  dresser: {
    clozeBefore: "She keeps her folded sweaters inside the top drawer of the",
    clozeAfter: ".",
    full: "She keeps her folded sweaters inside the top drawer of the dresser.",
    words: ["She", "keeps", "sweaters", "in", "the", "dresser"],
  },
  wardrobe: {
    clozeBefore: "He hung his winter coats neatly inside the tall wooden",
    clozeAfter: ".",
    full: "He hung his winter coats neatly inside the tall wooden wardrobe.",
    words: ["He", "hung", "coats", "inside", "the", "wardrobe"],
  },
  desk: {
    clozeBefore: "The student organized her notebook and pens on the study",
    clozeAfter: ".",
    full: "The student organized her notebook and pens on the study desk.",
    words: ["The", "student", "organized", "her", "study", "desk"],
  },
  pillow: {
    clozeBefore: "She fluffed the soft feather",
    clozeAfter: "before going to sleep.",
    full: "She fluffed the soft feather pillow before going to sleep.",
    words: ["She", "fluffed", "the", "soft", "feather", "pillow"],
  },
  blanket: {
    clozeBefore: "He pulled the warm wool",
    clozeAfter: "over his shoulders.",
    full: "He pulled the warm wool blanket over his shoulders.",
    words: ["He", "pulled", "the", "warm", "wool", "blanket"],
  },
  sheet: {
    clozeBefore: "She smoothed the crisp white",
    clozeAfter: "over the mattress.",
    full: "She smoothed the crisp white sheet over the mattress.",
    words: ["She", "smoothed", "the", "crisp", "white", "sheet"],
  },
  mattress: {
    clozeBefore: "The thick memory foam",
    clozeAfter: "supports a restful sleep.",
    full: "The thick memory foam mattress supports a restful sleep.",
    words: ["The", "memory", "foam", "mattress", "supports", "sleep"],
  },
  duvet: {
    clozeBefore: "The plush white",
    clozeAfter: "kept them warm on freezing nights.",
    full: "The plush white duvet kept them warm on freezing nights.",
    words: ["The", "plush", "white", "duvet", "kept", "them", "warm"],
  },
  lamp: {
    clozeBefore: "She turned on the bedside",
    clozeAfter: "to read her favorite novel.",
    full: "She turned on the bedside lamp to read her favorite novel.",
    words: ["She", "turned", "on", "the", "bedside", "lamp"],
  },
  chair: {
    clozeBefore: "He sat in the cushioned",
    clozeAfter: "to tie his shoes.",
    full: "He sat in the cushioned chair to tie his shoes.",
    words: ["He", "sat", "in", "the", "cushioned", "chair"],
  },
  mirror: {
    clozeBefore: "She checked her reflection in the wall",
    clozeAfter: "before heading out.",
    full: "She checked her reflection in the wall mirror before heading out.",
    words: ["She", "checked", "her", "reflection", "in", "the", "mirror"],
  },
  bookshelf: {
    clozeBefore: "He arranged his novel collection neatly on the wooden",
    clozeAfter: ".",
    full: "He arranged his novel collection neatly on the wooden bookshelf.",
    words: ["He", "arranged", "books", "on", "the", "bookshelf"],
  },

  // ── The six group words that had no sentence of their own ─────────────────
  // Without these, getRichSentence fell back to "This is a quilt." — so the
  // Pillows & Covers group, all five words of it, taught nothing but the
  // article. A context drill whose every sentence is "This is a ___" is not a
  // context drill.
  stool: {
    clozeBefore: "She perched on the small wooden",
    clozeAfter: "to reach the top shelf.",
    full: "She perched on the small wooden stool to reach the top shelf.",
    words: ["She", "sat", "on", "the", "wooden", "stool"],
  },
  pillowcase: {
    clozeBefore: "He slipped a clean cotton",
    clozeAfter: "over the pillow.",
    full: "He slipped a clean cotton pillowcase over the pillow.",
    words: ["He", "changed", "the", "cotton", "pillowcase"],
  },
  comforter: {
    clozeBefore: "She pulled the thick",
    clozeAfter: "up to her chin on the cold night.",
    full: "She pulled the thick comforter up to her chin on the cold night.",
    words: ["She", "pulled", "up", "the", "thick", "comforter"],
  },
  cushion: {
    clozeBefore: "He propped a soft",
    clozeAfter: "behind his back while reading.",
    full: "He propped a soft cushion behind his back while reading.",
    words: ["He", "leaned", "on", "a", "soft", "cushion"],
  },
  quilt: {
    clozeBefore: "Her grandmother sewed the patterned",
    clozeAfter: "by hand.",
    full: "Her grandmother sewed the patterned quilt by hand.",
    words: ["Grandmother", "sewed", "the", "patterned", "quilt"],
  },
  bedspread: {
    clozeBefore: "She smoothed the embroidered",
    clozeAfter: "over the whole bed.",
    full: "She smoothed the embroidered bedspread over the whole bed.",
    words: ["She", "smoothed", "the", "embroidered", "bedspread"],
  },
};

export function getRichSentence(word: VocabularyItem): RichSentence {
  if (RICH_CONTEXT_SENTENCES[word.id]) {
    return RICH_CONTEXT_SENTENCES[word.id];
  }
  const article = articleFor(word.label);
  return {
    clozeBefore: `This is ${article}`,
    clozeAfter: `.`,
    full: `This is ${article} ${word.label.toLowerCase()}.`,
    words: ["This", "is", article, word.label.toLowerCase()],
  };
}

/**
 * Generates semantically and visually related distractors instead of purely random picks.
 */
export function getSemanticDistractors(word: VocabularyItem, count = 3): VocabularyItem[] {
  const confusionIds = CONFUSION_PAIRS[word.id] ?? [];
  const confusionWords = confusionIds
    .map((id) => BEDROOM_VOCABULARY.find((item) => item.id === id))
    .filter(Boolean) as VocabularyItem[];

  const sameTopic = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic === word.topic && !confusionIds.includes(item.id)
  );

  const otherTopics = BEDROOM_VOCABULARY.filter(
    (item) => item.id !== word.id && item.topic !== word.topic && !confusionIds.includes(item.id)
  );

  const pool = [...confusionWords, ...sameTopic, ...otherTopics];
  return pool.slice(0, count);
}

export function getDistractors(word: VocabularyItem, count = 3): VocabularyItem[] {
  return getSemanticDistractors(word, count);
}

export function articleFor(label: string): "a" | "an" {
  return /^[aeiou]/i.test(label) ? "an" : "a";
}
