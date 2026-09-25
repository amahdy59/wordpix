import { z } from "zod";
import { BUSINESS_STAGE_IDS, type BusinessStageId } from "./businessTypes";

export type BusinessLessonStatus = "in-progress" | "mastered";

export const businessUnitProgressSchema = z.object({
  status: z.enum(["in-progress", "mastered"]),
  currentStage: z
    .number()
    .int()
    .min(0)
    .max(BUSINESS_STAGE_IDS.length - 1),
  completedStages: z.array(z.enum(BUSINESS_STAGE_IDS)),
  quizBestScore: z.number().int().min(0).max(10).optional(),
  checklistCompleted: z.array(z.string()).optional(),
  reflectionNotes: z.record(z.string(), z.string()).optional(),
  confidenceRating: z.enum(["not-yet", "almost", "ready"]).optional(),
  updatedAt: z.string(),
});

export type BusinessUnitProgress = z.infer<typeof businessUnitProgressSchema>;
export type BusinessProgress = Record<string, BusinessUnitProgress>;

export function normalizeBusinessProgress(value: unknown): BusinessProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: BusinessProgress = {};
  for (const [unitId, candidate] of Object.entries(value)) {
    if (!/^unit-\d{2}$/.test(unitId)) continue;
    const parsed = businessUnitProgressSchema.safeParse(candidate);
    if (parsed.success) {
      output[unitId] = parsed.data;
    }
  }
  return output;
}

export function checkpointBusinessUnit(
  progress: BusinessProgress,
  unitId: string,
  currentStage: number,
  completedStage?: BusinessStageId,
  quizScore?: number,
  now = new Date()
): BusinessProgress {
  const current = progress[unitId] ?? {
    status: "in-progress",
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };

  const completedStages = new Set(current.completedStages);
  if (completedStage) completedStages.add(completedStage);

  let quizBestScore = current.quizBestScore;
  if (typeof quizScore === "number") {
    const clamped = Math.max(0, Math.min(10, Math.round(quizScore)));
    quizBestScore = typeof quizBestScore === "number" ? Math.max(quizBestScore, clamped) : clamped;
  }

  const boundedStage = Math.max(0, Math.min(BUSINESS_STAGE_IDS.length - 1, currentStage));

  const updated: BusinessUnitProgress = {
    ...current,
    currentStage: boundedStage,
    completedStages: Array.from(completedStages) as BusinessStageId[],
    quizBestScore,
    updatedAt: now.toISOString(),
  };

  return {
    ...progress,
    [unitId]: updated,
  };
}

export function saveBusinessReflection(
  progress: BusinessProgress,
  unitId: string,
  promptId: string,
  text: string,
  now = new Date()
): BusinessProgress {
  const current = progress[unitId] ?? {
    status: "in-progress" as const,
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };
  const reflectionNotes = { ...(current.reflectionNotes || {}), [promptId]: text.slice(0, 4000) };
  return {
    ...progress,
    [unitId]: {
      ...current,
      reflectionNotes,
      updatedAt: now.toISOString(),
    },
  };
}

export function saveBusinessChecklist(
  progress: BusinessProgress,
  unitId: string,
  checklist: string[],
  now = new Date()
): BusinessProgress {
  const current = progress[unitId] ?? {
    status: "in-progress" as const,
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };
  return {
    ...progress,
    [unitId]: {
      ...current,
      checklistCompleted: checklist,
      updatedAt: now.toISOString(),
    },
  };
}

export function saveBusinessConfidence(
  progress: BusinessProgress,
  unitId: string,
  rating: "not-yet" | "almost" | "ready",
  now = new Date()
): BusinessProgress {
  const current = progress[unitId] ?? {
    status: "in-progress" as const,
    currentStage: 0,
    completedStages: [],
    updatedAt: now.toISOString(),
  };
  return {
    ...progress,
    [unitId]: {
      ...current,
      confidenceRating: rating,
      updatedAt: now.toISOString(),
    },
  };
}

export function canCompleteBusinessUnit(progress: BusinessProgress, unitId: string): boolean {
  const current = progress[unitId];
  if (!current) return false;
  // Require at least 6 stages completed including quiz & speaking
  return (
    current.completedStages.includes("exercises") && current.completedStages.includes("speaking")
  );
}

export function completeBusinessUnit(
  progress: BusinessProgress,
  unitId: string,
  now = new Date()
): BusinessProgress {
  const current = progress[unitId];
  const allStages = [...BUSINESS_STAGE_IDS];

  const updated: BusinessUnitProgress = {
    status: "mastered",
    currentStage: BUSINESS_STAGE_IDS.length - 1,
    completedStages: allStages,
    quizBestScore: current?.quizBestScore,
    checklistCompleted: current?.checklistCompleted,
    reflectionNotes: current?.reflectionNotes,
    confidenceRating: current?.confidenceRating,
    updatedAt: now.toISOString(),
  };

  return {
    ...progress,
    [unitId]: updated,
  };
}
