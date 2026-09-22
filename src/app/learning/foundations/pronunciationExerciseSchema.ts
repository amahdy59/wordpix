import { z } from "zod";

export const pronunciationStageSchema = z.enum([
  "hear",
  "notice",
  "see-feel",
  "copy-say",
  "contrast",
  "use",
  "transfer",
  "retry-recovery",
  "delayed-review",
]);

export type PronunciationStage = z.infer<typeof pronunciationStageSchema>;

const mediaSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

export const pronunciationExerciseSchema = z.object({
  id: z.string().min(1),
  stage: pronunciationStageSchema,
  prompt: z.string().min(1),
  targetAudio: z.string().min(1),
  responseMode: z.enum(["listen-and-choose", "listen-and-select", "record-and-reflect"]),
  options: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
        audio: z.string().optional(),
        image: mediaSchema.optional(),
      })
    )
    .min(1),
  answer: z.string().min(1).optional(),
  support: z.tuple([z.string().min(1), z.string().min(1)]),
  replayLimit: z.number().int().min(0).max(3),
  freshSpeaker: z.boolean(),
  imageVisibility: z.enum(["hidden-during-check", "visible", "after-answer"]),
});

export type PronunciationExercise = z.infer<typeof pronunciationExerciseSchema>;

export const pronunciationLessonSchema = z.object({
  id: z.string().min(1),
  number: z.number().int().positive(),
  title: z.string().min(1),
  objective: z.string().min(1),
  stages: z.array(pronunciationStageSchema).min(1),
  exercises: z.array(pronunciationExerciseSchema).min(1),
  delayedReviewDays: z.array(z.number().int().positive()).min(1),
});

export type PronunciationLesson = z.infer<typeof pronunciationLessonSchema>;

export function validatePronunciationLesson(value: unknown): PronunciationLesson {
  return pronunciationLessonSchema.parse(value);
}
