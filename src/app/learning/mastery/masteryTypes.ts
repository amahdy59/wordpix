import { z } from "zod";

export const vowelTypeSchema = z.enum(["short", "long", "r-controlled", "diphthong", "other"]);

export const phonicsPatternSchema = z.enum(["VC", "CVC", "CCVC", "CVCC", "CVCe", "complex"]);

export const masteryWordSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  text: z.string().trim().min(1),
  phonemes: z.array(z.string().trim().min(1)).min(1),
  graphemes: z.array(z.string().trim().min(1)).min(1),
  soundBoxes: z.array(z.string().trim().min(1)).min(1),
  vowelType: vowelTypeSchema,
  pattern: phonicsPatternSchema,
  wordFamily: z.string().optional(),
  contrastPairs: z.array(z.string()).default([]),
  difficultyLevel: z.number().int().min(0).max(15),
  meaningSnippet: z.string().optional(),
});

export type MasteryWord = z.infer<typeof masteryWordSchema>;

export const masterySkillTypeSchema = z.enum([
  "phoneme_isolation",
  "sound_letter_matching",
  "blending",
  "segmenting",
  "reading",
  "spelling",
  "contrast",
  "pronunciation",
]);

export type MasterySkillType = z.infer<typeof masterySkillTypeSchema>;

export const masterySkillSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/),
  name: z.string().trim().min(1),
  skillType: masterySkillTypeSchema,
  description: z.string().trim().min(1),
});

export type MasterySkill = z.infer<typeof masterySkillSchema>;

export const masteryActivityTypeSchema = z.enum([
  "ListenCard",
  "SoundChoice",
  "LetterSound",
  "BlendBuilder",
  "SoundBoxes",
  "WordBuilder",
  "MinimalPair",
  "SpellFromAudio",
  "QuickReview",
]);

export type MasteryActivityType = z.infer<typeof masteryActivityTypeSchema>;

export const masteryLessonSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  unitId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().positive(),
  title: z.string().trim().min(1),
  skillId: z.string().regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/),
  targetWords: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
  activityTypes: z.array(masteryActivityTypeSchema).min(1),
  prerequisites: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).default([]),
});

export type MasteryLesson = z.infer<typeof masteryLessonSchema>;

export const masteryUnitSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  levelId: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  order: z.number().int().positive(),
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  targetSounds: z.array(z.string().trim().min(1)).min(1),
  targetLetters: z.array(z.string().trim().min(1)).min(1),
  words: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).min(1),
  lessons: z.array(masteryLessonSchema).min(1),
});

export type MasteryUnit = z.infer<typeof masteryUnitSchema>;

export const masteryLevelSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  levelNumber: z.number().int().min(0).max(15),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  description: z.string().trim().min(1),
  units: z.array(masteryUnitSchema).min(1),
});

export type MasteryLevel = z.infer<typeof masteryLevelSchema>;

export const masteryStatusSchema = z.enum([
  "unseen",
  "introduced",
  "practicing",
  "mastered",
  "struggling",
]);

export type MasteryStatus = z.infer<typeof masteryStatusSchema>;

export interface MasteryItemProgress {
  id: string;
  status: MasteryStatus;
  consecutiveCorrect: number;
  totalAttempts: number;
  totalErrors: number;
  lastPracticedMs?: number;
  nextReviewMs?: number;
}
