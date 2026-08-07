export type CEFRLevel = "Pre-A1" | "A1" | "A2" | "B1" | "B2" | "C1";

export interface ImageAsset {
  url: string;
  responsive?: {
    w160?: string;
    w400?: string;
    w800?: string;
  };
}

export interface ExampleSentence {
  text: string;
  translation: Record<string, string>;
}

export interface VocabularyItem {
  id: string;
  label: string;
  lemma: string;
  level: CEFRLevel;
  partOfSpeech: "noun" | "verb" | "adjective" | "preposition";
  phonetic: string;
  pronunciationHint?: string;
  translations: Record<string, string>; // e.g. { ar: "وسادة", es: "almohada" }
  topic: string;
  image: ImageAsset;
  tags: string[];
  distractorIds?: string[];
  examples?: ExampleSentence[];
  hotspot?: { x: string; y: string };
}

export interface WorldCategory {
  id: string;
  name: string;
  level: CEFRLevel;
  itemCount: number;
  unlocked: boolean;
  coverImage: string;
}
