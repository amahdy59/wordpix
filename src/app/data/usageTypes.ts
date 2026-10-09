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
  .superRefine((check, context) => {
    if (!check.options.includes(check.expectedAnswer)) {
      context.addIssue({
        code: "custom",
        path: ["expectedAnswer"],
        message: "The expected answer must exactly match one of the authored options.",
      });
    }
  });

export const usageSceneChunkSchema = z
  .object({
    chunkNumber: z.number().int().positive(),
    targetWords: oneOrManyStrings,
    scenario: z.string().trim().min(1),
    check: usageCheckSchema,
    imageBrief: z.string(),
    /** Optional scene-specific visual; R2 vocabulary mappings remain untouched. */
    imagePath: z.string().trim().min(1).optional(),
    /** Describes the scene without spelling out an assessed answer. */
    imageAlt: z.string().trim().min(1).optional(),
    /** A vocabulary reference is not evidence for an entire sentence or scene. */
    imagePurpose: z.enum(["word-reference"]).optional(),
    imageFallbacks: z
      .array(
        z.object({
          imagePath: z.string().trim().min(1),
          imageAlt: z.string().trim().min(1),
        })
      )
      .optional(),
  })
  .superRefine((scene, context) => {
    if (scene.imagePurpose && (!scene.imagePath || !scene.imageAlt)) {
      context.addIssue({
        code: "custom",
        path: ["imagePurpose"],
        message: "A vocabulary reference requires an image and a visible-content description.",
      });
    }
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

/** Only approved workbook records cross this runtime boundary. */
export const usagePhraseSchema = z
  .object({
    id: z.string().trim().min(1),
    lessonId: z.string().trim().min(1),
    slot: z.enum(["core-1", "core-2", "optional-1"]),
    unitId: z.string().trim().min(1),
    phrase: z.string().trim().min(1),
    kind: z.enum(["collocation", "phrasal-verb", "idiom", "everyday-expression"]),
    meaning: z.string().trim().min(1),
    arabicMeaning: z.string().trim().min(1),
    example: z.string().trim().min(1),
    learnerPurpose: z.string().trim().min(1),
    pattern: z.string().trim().min(1),
    cefrStage: z.enum(["Pre-A1", "A1", "A2", "B1", "B2", "C1", "C2"]),
    register: z.string().trim().min(1),
    frequencyEvidence: z.string().trim().min(1),
    evidenceUrl: z.string().url(),
    check: z.object({
      question: z.string().trim().min(1),
      expectedAnswer: z.string().trim().min(1),
      explanation: z.string().trim().min(1),
    }),
    practice: z.object({
      retrieval: z.string().trim().min(1),
      personalUse: z.string().trim().min(1),
      laterReview: z.string().trim().min(1),
    }),
    sceneId: z.string().trim().min(1),
    sourceStatus: z.string().trim().min(1),
    sourceReview: z
      .object({
        status: z.literal("verified-online"),
        reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
        primaryUrl: z.string().url(),
        secondaryUrl: z.string().url(),
        finding: z.string().trim().min(1),
      })
      .strict(),
    editorial: z.object({
      status: z.literal("approved"),
      reviewer: z.string().trim().min(1),
      revision: z.string().trim().min(1),
    }),
  })
  .strict();

export const unitUsagePhraseDataSchema = z.array(usagePhraseSchema);

/** A whole usage lesson may ship only after every learner-facing field is reviewed. */
export const usageLessonApprovalSchema = z
  .object({
    lessonId: z.string().trim().min(1),
    unitId: z.string().trim().min(1),
    contentRevision: z.string().trim().min(1),
    status: z.literal("approved"),
    reviewedBy: z.string().trim().min(1),
    reviewedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/u),
    sources: z.array(z.string().url()).min(2),
    checks: z
      .object({
        scenarios: z.literal("approved"),
        questions: z.literal("approved"),
        reading: z.literal("approved"),
        exercises: z.literal("approved"),
        imageBriefs: z.literal("approved"),
        cefr: z.literal("approved"),
        arabic: z.literal("approved"),
      })
      .strict(),
  })
  .strict();

export const unitUsageApprovalDataSchema = z.array(usageLessonApprovalSchema);

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
    phrases: z.array(usagePhraseSchema).default([]),
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
  phrases: UsagePhrase[];
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
export type UsagePhrase = z.infer<typeof usagePhraseSchema>;
export type UsageLessonApproval = z.infer<typeof usageLessonApprovalSchema>;

export interface LessonVideoPlan {
  title: string;
  idea: string;
  scriptStarter: string;
}

export type LessonUsageData = z.infer<typeof lessonUsageDataSchema>;
export type UnitUsageData = z.infer<typeof unitUsageDataSchema>;
