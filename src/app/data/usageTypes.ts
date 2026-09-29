import { z } from "zod";

const oneOrManyStrings = z.preprocess(
  (value) => (Array.isArray(value) ? value : [value]),
  z.array(z.string().trim().min(1)).min(1)
);

/**
 * Runtime-validated schema for WordPix curriculum usage, scenes, and
 * contextual materials. The JSON files are generated outside TypeScript, so
 * interfaces alone cannot protect the lesson experience from malformed data.
 */

export const usageCheckSchema = z
  .object({
    question: z.string().trim().min(1),
    options: oneOrManyStrings,
    expectedAnswer: z.string().trim().min(1),
  })
  .transform((check) => {
    const canonicalAnswer = check.options.find(
      (option) => option.toLocaleLowerCase() === check.expectedAnswer.toLocaleLowerCase()
    );
    if (canonicalAnswer) return { ...check, expectedAnswer: canonicalAnswer };
    return { ...check, options: [...check.options, check.expectedAnswer] };
  });

export const usageSceneChunkSchema = z
  .object({
    chunkNumber: z.number().int().positive(),
    targetWords: oneOrManyStrings,
    scenario: z.string().trim().min(1),
    check: usageCheckSchema,
    imageBrief: z.string(),
  })
  .superRefine((scene, context) => {
    if (!scene.check.options.includes(scene.check.expectedAnswer)) {
      context.addIssue({
        code: "custom",
        path: ["check", "expectedAnswer"],
        message: "The expected answer must be one of the available options.",
      });
    }
  });

export const questionTypeSchema = z.enum([
  "meaning",
  "context-cloze",
  "inference",
  "comparison",
  "production",
  "transfer",
]);

export const responseModeSchema = z.enum([
  "choice",
  "short-answer",
  "sentence",
  "spoken",
  "extended-response",
]);

export const lessonExerciseSchema = z.object({
  prompt: z.string().trim().min(1),
  answer: z.string(),
  /** Optional while legacy JSON is progressively enriched. */
  questionType: questionTypeSchema.optional(),
  responseMode: responseModeSchema.optional(),
  contextTag: z.string().trim().min(1).optional(),
});

export const contextExtensionSchema = z.object({
  contextTag: z.string().trim().min(1),
  setting: z.string().trim().min(1),
  targetWords: oneOrManyStrings,
  text: z.string().trim().min(1),
  register: z.enum(["everyday", "service", "professional", "academic"]),
});

export const lessonUsageDataSchema = z.object({
  lessonId: z.string().trim().min(1),
  lessonName: z.string().trim().min(1),
  unitId: z.string().trim().min(1),
  unitName: z.string().trim().min(1),
  unitOrder: z.number().int().positive(),
  lessonOrderInUnit: z.number().int().positive(),
  globalOrder: z.number().int().positive(),
  cefrStage: z.enum(["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]),
  stageName: z.string().trim().min(1),
  targetWordsEnglish: oneOrManyStrings,
  targetWordsArabic: oneOrManyStrings,
  usage: z.object({
    goal: z.string().trim().min(1),
    canDoStatement: z.string().trim().min(1),
    textType: z.string().trim().min(1),
    readingTarget: z.string().trim().min(1),
    scenes: z.preprocess(
      (value) => (Array.isArray(value) ? value : [value]),
      z.array(usageSceneChunkSchema).min(1)
    ),
  }),
  reading: z.object({
    title: z.string().trim().min(1),
    text: z.string().trim().min(1),
    imageBrief: z.string(),
  }),
  exercises: z.array(lessonExerciseSchema).min(1),
  contextExtensions: z.array(contextExtensionSchema).optional(),
  video: z.object({
    title: z.string(),
    idea: z.string(),
    scriptStarter: z.string(),
  }),
  spacedReview: z
    .string()
    .nullish()
    .transform((value) => value ?? ""),
});

export const unitUsageDataSchema = z.array(lessonUsageDataSchema).min(1);

export type UsageCheck = z.infer<typeof usageCheckSchema>;

export type UsageSceneChunk = z.infer<typeof usageSceneChunkSchema>;

export interface LessonUsageMetadata {
  goal: string;
  canDoStatement: string;
  textType: string;
  readingTarget: string;
  scenes: UsageSceneChunk[];
}

export interface LessonReading {
  title: string;
  text: string;
  imageBrief: string;
}

export type LessonExercise = z.infer<typeof lessonExerciseSchema>;
export type QuestionType = z.infer<typeof questionTypeSchema>;
export type ResponseMode = z.infer<typeof responseModeSchema>;
export type ContextExtension = z.infer<typeof contextExtensionSchema>;

export interface LessonVideoPlan {
  title: string;
  idea: string;
  scriptStarter: string;
}

export type LessonUsageData = z.infer<typeof lessonUsageDataSchema>;
export type UnitUsageData = z.infer<typeof unitUsageDataSchema>;
