import { z } from "zod";
import type { LearnerStateSchema } from "../../app/context/LearnerContext";
import type { SyncOperation } from "./db";

const nonNegativeInteger = z.number().int().nonnegative().finite();
const nonNegativeNumber = z.number().nonnegative().finite();
const nullableTimestamp = z.string().datetime({ offset: true }).nullable();

const preferencesSchema = z
  .object({
    englishLevel: z.enum(["A1", "A2", "B1"]),
    startingUnitId: z.string().min(1).max(200),
    dailyGoalMinutes: z.number().int().min(1).max(240),
    goal: z.enum(["everyday", "travel", "work", "school", "conversation", "kids"]),
    theme: z.enum(["system", "light", "dark"]),
    expression: z.enum(["child", "adult"]),
  })
  .strict();

const accessibilitySchema = z
  .object({
    textSize: z.enum(["standard", "large", "xlarge"]),
    highContrast: z.boolean(),
    speechRate: z.number().min(0.5).max(2).finite(),
    numeralSystem: z.enum(["western", "arabic"]),
    includeSpeaking: z.boolean(),
    includeListening: z.boolean(),
    timedExercises: z.boolean(),
    autoAdvance: z.boolean(),
    spokenFeedback: z.boolean(),
    reduceMotion: z.boolean(),
  })
  .strict();

const xpBreakdownSchema = z
  .object({
    correctAnswers: nonNegativeInteger,
    lessonComplete: nonNegativeInteger,
    perfectSession: nonNegativeInteger,
    streak: nonNegativeInteger,
    total: nonNegativeInteger,
  })
  .strict();

const skillMasteryStateSchema = z
  .object({
    attempts: nonNegativeInteger,
    correct: nonNegativeInteger,
    lastAttemptAt: nullableTimestamp,
    mastery: z.enum(["new", "learning", "familiar", "strong"]),
  })
  .strict();

const skillMasterySchema = z
  .object({
    "visual-recognition": skillMasteryStateSchema,
    "listening-recognition": skillMasteryStateSchema,
    "contextual-comprehension": skillMasteryStateSchema,
    "controlled-production": skillMasteryStateSchema,
    "spoken-production": skillMasteryStateSchema,
    "independent-transfer": skillMasteryStateSchema,
  })
  .strict();

const wordLearningStateSchema = z
  .object({
    wordId: z.string().min(1).max(200),
    exposures: nonNegativeInteger,
    correctRecalls: nonNegativeInteger,
    incorrectRecalls: nonNegativeInteger,
    currentStreak: nonNegativeInteger,
    lapses: nonNegativeInteger,
    lastSeenAt: nullableTimestamp,
    lastReviewedAt: nullableTimestamp,
    nextReviewAt: nullableTimestamp,
    intervalDays: nonNegativeInteger,
    easeFactor: nonNegativeNumber,
    mastery: z.enum(["new", "learning", "familiar", "strong"]),
    skillMastery: skillMasterySchema.optional(),
  })
  .strict();

const learnerProgressSchema = z
  .object({
    xp: nonNegativeInteger,
    streak: nonNegativeInteger,
    lastStudiedDate: z.string().date().nullable(),
    daysActive: nonNegativeInteger,
    sessionsCompleted: nonNegativeInteger,
    completedSessionIds: z.array(z.string().min(1).max(200)).max(100_000),
  })
  .strict();

const sessionRecordSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    completedAt: z.string().datetime({ offset: true }),
    score: nonNegativeInteger,
    totalWords: nonNegativeInteger,
    xp: xpBreakdownSchema,
  })
  .strict();

const wordMemorySchema = z.record(z.string().min(1).max(200), wordLearningStateSchema);

const operationMetadataSchema = z.object({
  id: z.string().min(1).max(200),
  ownerId: z.string().min(1).max(200).optional(),
  createdAt: z.string().min(1).max(100),
  status: z.enum(["pending", "syncing", "failed"]),
  retryCount: nonNegativeInteger,
  payloadVersion: z.literal(1).optional(),
  lastSyncAttemptAt: z.string().datetime({ offset: true }).optional(),
  lastErrorCategory: z
    .enum(["auth_required", "validation", "authorization", "transient"])
    .optional(),
});

const syncOperationSchema = z.discriminatedUnion("type", [
  operationMetadataSchema.extend({
    type: z.literal("update_preferences"),
    payload: preferencesSchema,
  }),
  operationMetadataSchema.extend({
    type: z.literal("update_accessibility"),
    payload: accessibilitySchema,
  }),
  operationMetadataSchema.extend({
    type: z.literal("session_completed"),
    payload: sessionRecordSchema.extend({
      learnerProgress: learnerProgressSchema,
      wordMemory: wordMemorySchema,
    }),
  }),
  operationMetadataSchema.extend({
    type: z.literal("assessment_completed"),
    payload: z.object({ xp: nonNegativeInteger, wordMemory: wordMemorySchema }).strict(),
  }),
  operationMetadataSchema.extend({
    type: z.literal("add_xp"),
    payload: z.object({ xp: nonNegativeInteger }).strict(),
  }),
  operationMetadataSchema.extend({
    type: z.literal("reset"),
    payload: z.object({}).strict(),
  }),
]);

const migrationResponseSchema = z
  .object({
    learnerProgress: learnerProgressSchema,
    wordMemory: wordMemorySchema,
    sessionHistory: z.array(sessionRecordSchema).max(100_000),
  })
  .passthrough();

export class SyncPayloadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SyncPayloadValidationError";
  }
}

export type ValidatedMigrationResponse = Pick<
  LearnerStateSchema,
  "learnerProgress" | "wordMemory" | "sessionHistory"
>;

export function validateSyncOperation(operation: SyncOperation): SyncOperation {
  const result = syncOperationSchema.safeParse(operation);
  if (!result.success) {
    throw new SyncPayloadValidationError("A queued sync operation has an invalid payload.");
  }
  return result.data as SyncOperation;
}

export function validateMigrationResponse(value: unknown): ValidatedMigrationResponse {
  const result = migrationResponseSchema.safeParse(value);
  if (!result.success) {
    throw new SyncPayloadValidationError(
      "The sync response was incomplete. Your local progress is safe."
    );
  }
  return result.data;
}
