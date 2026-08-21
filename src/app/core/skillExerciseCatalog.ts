import { Headphones, BookOpen, Mic, PenTool } from "lucide-react";
import type { SkillCategory, SkillExerciseId } from "../types";

/**
 * Single source of truth for the skill-exercise catalogue.
 *
 * Lifted out of SkillExerciseHub so the dashboard's promo card cannot advertise
 * a different number from the hub it links to — the card hardcoded "35" while
 * the hub now filters by the learner's modality preferences.
 */
export interface ExerciseDef {
  id: SkillExerciseId;
  title: string;
  category: SkillCategory;
  description: string;
  minimumLevel?: "A2" | "B1";
}

/**
 * The drills a learner can start.
 *
 * Two things changed here, both about the hub reading as a design catalogue
 * rather than a place to practise:
 *
 * Titles no longer carry a leading number. "7. Listening Results" numbered the
 * screens in the order they were designed, implying a sequence that does not
 * exist — nothing unlocks anything else, and the list is filtered by the
 * learner's modality settings, so the numbers skipped anyway.
 *
 * The four "Results" screens are gone from the list. They are summary screens
 * belonging to a completed drill, not drills; offering "Writing Results" as
 * something to start showed a summary of work nobody had done. Their ids and
 * routes still exist, so a drill can navigate to its own summary.
 */
export const EXERCISES: ExerciseDef[] = [
  // Listening
  {
    id: "listen-word-match",
    category: "listening",
    title: "Word Match",
    description: "Listen to pronunciation and match definition with root etymology.",
  },
  {
    id: "listen-audio-scene-match",
    category: "listening",
    title: "Audio Scene Match",
    description: "Listen to a short description and choose the matching illustrated scene.",
  },
  {
    id: "listen-dictation-sprint",
    category: "listening",
    title: "Dictation Sprint",
    description: "Cloze text input with countdown timer and limited replays.",
  },
  {
    id: "listen-vocab-spotting",
    category: "listening",
    title: "Vocabulary Spotting",
    description: "Tap target words as you hear continuous narration.",
  },
  {
    id: "listen-dialogue-roleplay",
    category: "listening",
    title: "Dialogue Role-Play",
    description: "Listen to a short conversation and choose an appropriate reply.",
  },
  {
    id: "listen-selective-shadowing",
    category: "listening",
    title: "Selective Shadowing",
    description: "Repeat a model sentence aloud and check your own rhythm and stress.",
    minimumLevel: "B1",
  },
  {
    id: "listen-warmup-review",
    category: "listening",
    title: "Warm-up Refresher",
    description: "30-second flashcard review with memory strength indicators.",
  },
  {
    id: "listen-podcast-comprehension",
    category: "listening",
    title: "Podcast Comprehension",
    description: "Choose the topics covered in a short spoken passage.",
    minimumLevel: "A2",
  },

  // Reading
  {
    id: "read-visual-context",
    category: "reading",
    title: "Visual Context",
    description: "Photo scene with multiple choice context clues and why-this-matters rationale.",
  },
  {
    id: "read-progressive-reveal",
    category: "reading",
    title: "Progressive Reveal",
    description: "Read a short passage sentence by sentence and answer context questions.",
  },
  {
    id: "read-error-detection",
    category: "reading",
    title: "Error Detection",
    description: "Proofreading paragraph with tappable grammar errors.",
  },
  {
    id: "read-comic-strip",
    category: "reading",
    title: "Comic Strip",
    description: "Sequential visual panel narrative with speech bubbles.",
  },
  {
    id: "read-infographic",
    category: "reading",
    title: "Infographic Reading",
    description: "Read simple figures and answer questions about a chart.",
    minimumLevel: "A2",
  },
  {
    id: "read-category-sort",
    category: "reading",
    title: "Category Sort",
    description: "Drag-and-drop word chips into category buckets.",
  },
  {
    id: "read-subtitle-correction",
    category: "reading",
    title: "Subtitle Correction",
    description: "Find and correct grammar mistakes in short subtitles.",
    minimumLevel: "A2",
  },
  {
    id: "read-confidence-check",
    category: "reading",
    title: "Confidence Check",
    description: "Check your understanding of more advanced vocabulary before a lesson.",
    minimumLevel: "B1",
  },

  // Speaking
  {
    id: "speak-echo-practice",
    category: "speaking",
    title: "Echo Practice",
    description: "Say the word and have it checked against what you meant to say.",
  },
  {
    id: "speak-scenario-response",
    category: "speaking",
    title: "Scenario Response",
    description: "Situational speaking prompt with cultural tips.",
  },
  {
    id: "speak-photo-narration",
    category: "speaking",
    title: "Photo Narration",
    description: "Use a clear prompt and word guide to describe a photo aloud.",
  },
  {
    id: "speak-video-roleplay",
    category: "speaking",
    title: "Scenario Roleplay",
    description: "Practice a useful spoken exchange with guided conversation turns.",
  },
  {
    id: "speak-compare-contrast",
    category: "speaking",
    title: "Compare & Contrast",
    description: "Compare two photos aloud using a simple language guide.",
    minimumLevel: "A2",
  },
  {
    id: "speak-word-chain",
    category: "speaking",
    title: "Word Chain Arcade",
    description: "Fast-paced memory chain game with combo streaks and hearts.",
  },
  {
    id: "speak-self-repair",
    category: "speaking",
    title: "Self-Repair",
    description: "Correct a model sentence, then say the improved version aloud.",
    minimumLevel: "A2",
  },

  // Writing
  {
    id: "write-caption-builder",
    category: "writing",
    title: "Caption Builder",
    description: "Guided image caption writing using word bank chips.",
  },
  {
    id: "write-sentence-assembly",
    category: "writing",
    title: "Sentence Assembly Arcade",
    description: "Timed word tile ordering with combo multipliers.",
  },
  {
    id: "write-photo-journal",
    category: "writing",
    title: "Photo Journal",
    description: "Free-form writing with guidance. Not marked — this app cannot grade prose.",
  },
  {
    id: "write-video-summary",
    category: "writing",
    title: "Short Summary",
    description: "Practice writing a concise two-sentence summary with guidance.",
    minimumLevel: "B1",
  },
  {
    id: "write-error-correction",
    category: "writing",
    title: "Error Correction",
    description: "Find and fix grammar mistakes with short rule cards.",
    minimumLevel: "A2",
  },
  {
    id: "write-paraphrase-challenge",
    category: "writing",
    title: "Paraphrase Challenge",
    description: "Rewrite a sentence while keeping its original meaning.",
    minimumLevel: "B1",
  },
  {
    id: "write-image-story-chain",
    category: "writing",
    title: "Image Story Chain",
    description: "Write a short sequence using clear transition words.",
    minimumLevel: "A2",
  },
  {
    id: "write-timed-sprint",
    category: "writing",
    title: "Timed Writing Sprint",
    description: "Arcade speed vocabulary typing with live score and streak fire.",
  },
];

export const ALL_CATEGORIES = [
  { id: "listening" as const, labelBase: "Listening", icon: Headphones },
  { id: "reading" as const, labelBase: "Reading", icon: BookOpen },
  { id: "speaking" as const, labelBase: "Speaking", icon: Mic },
  { id: "writing" as const, labelBase: "Writing", icon: PenTool },
];

export function availableCategories(includeSpeaking: boolean, includeListening: boolean) {
  return ALL_CATEGORIES.filter(
    (c) => (c.id !== "speaking" || includeSpeaking) && (c.id !== "listening" || includeListening)
  );
}

const LEVEL_RANK = { A1: 1, A2: 2, B1: 3 } as const;

export function isExerciseAvailableForLevel(
  exercise: ExerciseDef,
  level: keyof typeof LEVEL_RANK
): boolean {
  return !exercise.minimumLevel || LEVEL_RANK[level] >= LEVEL_RANK[exercise.minimumLevel];
}

export function countAvailableExercises(
  includeSpeaking: boolean,
  includeListening: boolean,
  level?: keyof typeof LEVEL_RANK
): number {
  const categories = availableCategories(includeSpeaking, includeListening);
  return EXERCISES.filter(
    (e) =>
      categories.some((c) => c.id === e.category) &&
      (!level || isExerciseAvailableForLevel(e, level))
  ).length;
}
