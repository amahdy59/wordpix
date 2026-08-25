// Types for the per-unit learning materials imported from Figma.
//
// Figma (file gRlyhrMavAHXUAT5brWFWu) lays every unit out as two sibling
// frames: the unit frame ("The Bathroom") holding the scene illustration and
// the word cards, and a "Learning Materials" frame holding eight content
// blocks. This models the second frame, plus the sub-topic grouping the first
// frame carries but `lessons.ts` flattens away.
//
// Every block is optional. The extractor emits only what a unit's frame
// actually contains, so a unit missing a block degrades to hiding that
// section rather than rendering an empty shell or throwing.

/** One `topic-*` frame from the unit: a named slice of the unit's words. */
export interface SubtopicGroup {
  id: string;
  title: string;
  /** Word ids, in Figma's card order. Resolve against the unit's vocabulary. */
  wordIds: string[];
}

/**
 * Figma writes comprehension questions open-ended ("What do you use to brush
 * your teeth?"). The app has no open-response exercise, so the extractor
 * converts each to multiple choice, drawing distractors from the same unit's
 * vocabulary — wrong answers stay plausible and on-topic instead of being
 * obviously foreign to the passage.
 */
export interface ComprehensionQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  /** Why the answer is right — shown after answering, never before. */
  explanation: string;
}

export interface ReadingPassage {
  title: string;
  /** CEFR band as authored in the Figma heading, e.g. "B1". */
  level: string;
  text: string;
  questions: ComprehensionQuestion[];
  /**
   * Questions that could not be turned into multiple choice honestly.
   *
   * Figma authors comprehension questions open-ended. Some convert cleanly —
   * "What do you use to brush your teeth?" has a vocabulary item for an
   * answer. Others do not: "What is the purpose of the shower curtain?"
   * mechanically resolves to "shower curtain", which is a question answering
   * itself, and "Name three items..." has no single-item answer at all.
   *
   * Rather than ship a quiz with degenerate options, those are kept verbatim
   * and shown as reflection prompts — answerable against the passage, just
   * not scored.
   */
  openQuestions?: string[];
}

/**
 * Figma tags each entry `(idiom)` or `(phrasal verb)` in its description line.
 * Keeping that as a discriminant is what lets one dataset feed two separate
 * browsable sections without duplicating the content.
 */
export type PhraseKind = "idiom" | "phrasal-verb";

export interface PhraseEntry {
  id: string;
  phrase: string;
  kind: PhraseKind;
  meaning: string;
  example: string;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface MiniDialogue {
  title: string;
  lines: DialogueLine[];
}

export interface CommonMistake {
  id: string;
  wrong: string;
  right: string;
  /** The rule that explains the correction. */
  note: string;
}

/** A row of the Noun/Verb/Adjective/Adverb table. `null` is Figma's "—". */
export interface WordFormationRow {
  noun: string | null;
  verb: string | null;
  adjective: string | null;
  adverb: string | null;
}

/** One fill-in-the-blank item. `sentence` carries a single BLANK placeholder. */
export interface BlankExercise {
  id: string;
  sentence: string;
  answer: string;
}

export interface CulturalNote {
  id: string;
  title: string;
  body: string;
}

/** Reference data for the word inspector and review scheduling. */
export interface WordMetaEntry {
  word: string;
  partOfSpeech: string;
  /** 1–3, from Figma's ★ rating. Higher means more frequent. */
  frequency: number;
  collocations: string[];
}

/** The placeholder token used inside `BlankExercise.sentence`. */
export const BLANK_TOKEN = "____";

export interface UnitLearningMaterials {
  unitId: string;
  subtopics?: SubtopicGroup[];
  passage?: ReadingPassage;
  phrases?: PhraseEntry[];
  dialogue?: MiniDialogue;
  mistakes?: CommonMistake[];
  wordFormation?: WordFormationRow[];
  blankExercises?: BlankExercise[];
  culturalNotes?: CulturalNote[];
  wordMeta?: WordMetaEntry[];
}
