import { z } from "zod";
import { conversationUnitProgressSchema } from "../../app/learning/conversation/conversationProgress";
import { businessUnitProgressSchema } from "../../app/learning/business/businessProgress";
import { HADITH_STAGE_IDS } from "../../app/learning/hadith/hadithCurriculumStages";
import {
  normalizePronunciationSession,
  type PronunciationSession,
} from "../../app/learning/foundations/pronunciationProgress";

const timestamp = z.string().refine((value) => Number.isFinite(Date.parse(value)));
const targetEvidence = z.record(
  z.string(),
  z.object({
    listening: z.boolean().optional(),
    speaking: z.enum(["unassessed", "reflected", "assessed"]).optional(),
    updatedAt: timestamp,
    nextReviewAt: timestamp.optional(),
  })
);
export const pronunciationRecordSchema = z.object({
  status: z.enum(["in-progress", "needs-practice", "mastered"]),
  currentStage: z.number().int().min(0).max(4),
  bestScorePercent: z.number().min(0).max(100),
  sessions: z.number().int().nonnegative(),
  updatedAt: timestamp,
  nextReviewAt: timestamp.optional(),
  targetEvidence: targetEvidence.optional(),
  session: z
    .custom<PronunciationSession>((value) => normalizePronunciationSession(value) !== undefined)
    .optional(),
});
export const hadithRecordSchema = z.object({
  status: z.enum(["in-progress", "needs-practice", "mastered"]),
  currentStage: z
    .number()
    .int()
    .min(0)
    .max(HADITH_STAGE_IDS.length - 1),
  completedStages: z.array(z.enum(HADITH_STAGE_IDS)),
  bestScorePercent: z.number().min(0).max(100),
  sessions: z.number().int().nonnegative(),
  confidence: z.enum(["again", "supported", "ready"]).optional(),
  nextReviewAt: timestamp.optional(),
  updatedAt: timestamp,
});

export const specialistMutationSchema = z.discriminatedUnion("track", [
  z.object({
    track: z.literal("pronunciation"),
    previousSessions: z.number().int().nonnegative().optional(),
    lessonId: z.string().regex(/^lesson-\d{2}$/),
    state: pronunciationRecordSchema,
  }),
  z.object({
    track: z.literal("hadith"),
    previousSessions: z.number().int().nonnegative().optional(),
    lessonId: z.string().regex(/^hadith-\d{2}$/),
    state: hadithRecordSchema,
  }),
  z.object({
    track: z.literal("conversation"),
    lessonId: z.string().regex(/^unit-\d{2}$/),
    state: conversationUnitProgressSchema,
  }),
  z.object({
    track: z.literal("business"),
    lessonId: z.string().regex(/^unit-\d{2}$/),
    state: businessUnitProgressSchema,
  }),
]);
export type SpecialistMutation = z.infer<typeof specialistMutationSchema>;
export const specialistSnapshotSchema = z.object({
  pronunciationProgress: z.record(z.string(), pronunciationRecordSchema).default({}),
  hadithProgress: z.record(z.string(), hadithRecordSchema).default({}),
  conversationProgress: z.record(z.string(), conversationUnitProgressSchema).default({}),
  businessProgress: z.record(z.string(), businessUnitProgressSchema).default({}),
});

/** Union earned evidence; only mutable checkpoint/reflection fields use the latest explicit action. */
export function mergeSpecialistRecord<T extends { updatedAt: string }>(left: T, right: T): T {
  const newest = Date.parse(left.updatedAt) > Date.parse(right.updatedAt) ? left : right;
  const merged: Record<string, unknown> = { ...left, ...right, ...newest };
  const a = left as Record<string, unknown>,
    b = right as Record<string, unknown>;
  for (const field of ["bestScorePercent", "quizBestScore", "sessions"]) {
    if (typeof a[field] === "number" || typeof b[field] === "number")
      merged[field] = Math.max(Number(a[field] ?? 0), Number(b[field] ?? 0));
  }
  for (const field of ["completedStages", "checklistCompleted"]) {
    if (Array.isArray(a[field]) || Array.isArray(b[field]))
      merged[field] = [
        ...new Set([
          ...(Array.isArray(a[field]) ? a[field] : []),
          ...(Array.isArray(b[field]) ? b[field] : []),
        ]),
      ];
  }
  const targetA = a.targetEvidence as Record<string, { updatedAt: string }> | undefined;
  const targetB = b.targetEvidence as Record<string, { updatedAt: string }> | undefined;
  if (targetA || targetB) {
    const targets = { ...targetA };
    for (const [id, entry] of Object.entries(targetB ?? {}))
      targets[id] = targets[id] ? mergeSpecialistRecord(targets[id], entry) : entry;
    merged.targetEvidence = targets;
  }
  return merged as T;
}

export function mergeSpecialistMap<T extends { updatedAt: string }>(
  left: Record<string, T>,
  right: Record<string, T>
): Record<string, T> {
  const result = { ...left };
  for (const [id, value] of Object.entries(right))
    result[id] = result[id] ? mergeSpecialistRecord(result[id], value) : value;
  return result;
}
