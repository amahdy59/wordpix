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
}

export const EXERCISES: ExerciseDef[] = [
  // Listening (9)
  { id: "listen-word-match", category: "listening", title: "1. Word Match (Definition)", description: "Listen to pronunciation and match definition with root etymology." },
  { id: "listen-audio-scene-match", category: "listening", title: "2. Audio Scene Match", description: "Match soundscape to 2x2 illustrated scenes with SM-2 confidence calibration." },
  { id: "listen-dictation-sprint", category: "listening", title: "3. Dictation Sprint", description: "Cloze text input with countdown timer and limited replays." },
  { id: "listen-vocab-spotting", category: "listening", title: "4. Vocabulary Spotting", description: "Tap target words as you hear continuous narration." },
  { id: "listen-dialogue-roleplay", category: "listening", title: "5. Dialogue Role-Play", description: "Chat-bubble model conversation with native speaker accent labels." },
  { id: "listen-selective-shadowing", category: "listening", title: "6. Selective Shadowing", description: "Waveform scrubber with phoneme accuracy scoring per word." },
  { id: "listen-results", category: "listening", title: "7. Listening Results", description: "Lesson completion summary with percentile leaderboard ranking." },
  { id: "listen-warmup-review", category: "listening", title: "8. Warm-up Refresher", description: "30-second flashcard review with memory strength indicators." },
  { id: "listen-podcast-comprehension", category: "listening", title: "9. Podcast Comprehension", description: "Multi-select topic chips based on podcast audio snippet." },

  // Reading (9)
  { id: "read-visual-context", category: "reading", title: "1. Visual Context", description: "Photo scene with multiple choice context clues and why-this-matters rationale." },
  { id: "read-progressive-reveal", category: "reading", title: "2. Progressive Reveal", description: "Sentence-by-sentence reading with tap-to-translate XP tooltips." },
  { id: "read-error-detection", category: "reading", title: "3. Error Detection", description: "Proofreading paragraph with tappable grammar errors." },
  { id: "read-comic-strip", category: "reading", title: "4. Comic Strip", description: "Sequential visual panel narrative with speech bubbles." },
  { id: "read-infographic", category: "reading", title: "5. Infographic Reading", description: "Data visualizations and charts with inline vocabulary definitions." },
  { id: "read-category-sort", category: "reading", title: "6. Category Sort", description: "Drag-and-drop word chips into category buckets." },
  { id: "read-results", category: "reading", title: "7. Reading Results", description: "Vocabulary gained cards and spaced repetition countdown." },
  { id: "read-subtitle-correction", category: "reading", title: "8. Subtitle Correction", description: "Video subtitle grammar error fixing." },
  { id: "read-confidence-check", category: "reading", title: "9. Confidence Check", description: "Pre-lesson self-assessment vocabulary pre-check." },

  // Speaking (8)
  { id: "speak-echo-practice", category: "speaking", title: "1. Echo Practice", description: "Side-by-side waveform comparison and syllable phoneme accuracy." },
  { id: "speak-scenario-response", category: "speaking", title: "2. Scenario Response", description: "Situational speaking prompt with cultural tips." },
  { id: "speak-photo-narration", category: "speaking", title: "3. Photo Narration", description: "Descriptive photo speaking guide with real-time vocabulary tracker." },
  { id: "speak-video-roleplay", category: "speaking", title: "4. Video Roleplay", description: "Interactive video roleplay with YOUR TURN voice recording." },
  { id: "speak-compare-contrast", category: "speaking", title: "5. Compare & Contrast", description: "Side-by-side photo comparison with live grammar structure detection." },
  { id: "speak-word-chain", category: "speaking", title: "6. Word Chain Arcade", description: "Fast-paced memory chain game with combo streaks and hearts." },
  { id: "speak-self-repair", category: "speaking", title: "7. Self-Repair", description: "Audio comparison of detected errors (❌ vs ✓) and re-recording." },
  { id: "speak-results", category: "speaking", title: "8. Speaking Results", description: "Lesson summary with fluency metrics and hesitation counts." },

  // Writing (9)
  { id: "write-caption-builder", category: "writing", title: "1. Caption Builder", description: "Guided image caption writing using word bank chips." },
  { id: "write-sentence-assembly", category: "writing", title: "2. Sentence Assembly Arcade", description: "Timed word tile ordering with combo multipliers." },
  { id: "write-photo-journal", category: "writing", title: "3. Photo Journal", description: "Free-form writing with real-time error underlines and rubric dot ratings." },
  { id: "write-video-summary", category: "writing", title: "4. Video Summary", description: "Academic summary writing with register style tips." },
  { id: "write-error-correction", category: "writing", title: "5. Error Correction", description: "Find & fix grammar paragraph with rule cards." },
  { id: "write-paraphrase-challenge", category: "writing", title: "6. Paraphrase Challenge", description: "Sentence rewriting with target word constraints." },
  { id: "write-image-story-chain", category: "writing", title: "7. Image Story Chain", description: "Sequential narrative writing with transition connectors." },
  { id: "write-results", category: "writing", title: "8. Writing Results", description: "Lesson summary with recurring mistakes flag list." },
  { id: "write-timed-sprint", category: "writing", title: "9. Timed Writing Sprint", description: "Arcade speed vocabulary typing with live score and streak fire." },
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

export function countAvailableExercises(includeSpeaking: boolean, includeListening: boolean): number {
  const categories = availableCategories(includeSpeaking, includeListening);
  return EXERCISES.filter((e) => categories.some((c) => c.id === e.category)).length;
}
