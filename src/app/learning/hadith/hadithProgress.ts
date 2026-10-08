import { z } from "zod";
import { HADITH_STAGE_IDS, type HadithStageId } from "./hadithCurriculumStages";

const LEGACY_HADITH_STAGE_IDS = [
  "overview",
  "warm-up",
  "read-listen",
  "vocabulary",
  "practice",
  "speak",
  "check-review",
] as const;

export const HADITH_CONFIDENCE_VALUES = ["again", "supported", "ready"] as const;
export type HadithConfidence = (typeof HADITH_CONFIDENCE_VALUES)[number];
export type HadithLessonStatus = "in-progress" | "needs-practice" | "mastered";

const progressEntrySchema = z.object({
  status: z.enum(["in-progress", "needs-practice", "mastered"]),
  currentStage: z
    .number()
    .int()
    .min(0)
    .max(HADITH_STAGE_IDS.length - 1),
  completedStages: z.array(z.enum(HADITH_STAGE_IDS)),
  bestScorePercent: z.number().min(0).max(100),
  sessions: z.number().int().nonnegative(),
  confidence: z.enum(HADITH_CONFIDENCE_VALUES).optional(),
  nextReviewAt: z.string().optional(),
  updatedAt: z.string(),
});

const persistedProgressEntrySchema = z.object({
  status: z.enum(["in-progress", "needs-practice", "mastered"]),
  currentStage: z
    .number()
    .int()
    .min(0)
    .max(LEGACY_HADITH_STAGE_IDS.length - 1),
  completedStages: z.array(z.string()),
  bestScorePercent: z.number(),
  sessions: z.number().int().nonnegative(),
  confidence: z.enum(HADITH_CONFIDENCE_VALUES).optional(),
  nextReviewAt: z.string().optional(),
  updatedAt: z.string(),
});

export type HadithLessonProgress = z.infer<typeof progressEntrySchema>;
export type HadithProgress = Record<string, HadithLessonProgress>;

export function getHadithReviewIntervalDays(
  scorePercent: number,
  confidence: HadithConfidence
): number {
  const mastered = clampScore(scorePercent) >= 80 && confidence !== "again";
  return mastered ? 7 : confidence === "again" ? 1 : 3;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function normalizeHadithProgress(value: unknown): HadithProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: HadithProgress = {};
  for (const [lessonId, candidate] of Object.entries(value)) {
    const parsed = persistedProgressEntrySchema.safeParse(candidate);
    if (!parsed.success || !/^hadith-\d{2}$/.test(lessonId)) continue;

    const isSevenStage =
      parsed.data.completedStages.some((stage) => stage === "overview" || stage === "warm-up") ||
      parsed.data.currentStage >= 5;

    const isFiveStage =
      !isSevenStage &&
      (parsed.data.completedStages.some((stage) => stage === "speak" || stage === "check-review") ||
        parsed.data.currentStage === 4);

    let migratedStage: number;
    if (isSevenStage) {
      const legacyStage = LEGACY_HADITH_STAGE_IDS[parsed.data.currentStage];
      if (legacyStage === "speak" || legacyStage === "check-review") {
        migratedStage = 3;
      } else if (legacyStage === "practice") {
        migratedStage = 2;
      } else if (legacyStage === "vocabulary") {
        migratedStage = 1;
      } else {
        migratedStage = 0;
      }
    } else if (isFiveStage) {
      if (parsed.data.currentStage >= 3) {
        migratedStage = 3;
      } else {
        migratedStage = parsed.data.currentStage;
      }
    } else {
      migratedStage = Math.min(HADITH_STAGE_IDS.length - 1, Math.max(0, parsed.data.currentStage));
    }

    const completedStages = parsed.data.completedStages
      .map((stage) => {
        if (stage === "speak" || stage === "check-review") return "review";
        return stage;
      })
      .filter((stage): stage is HadithStageId => HADITH_STAGE_IDS.includes(stage as HadithStageId));

    output[lessonId] = progressEntrySchema.parse({
      ...parsed.data,
      currentStage: migratedStage,
      completedStages: [...new Set(completedStages)],
      bestScorePercent: clampScore(parsed.data.bestScorePercent),
    });
  }
  return output;
}

export function checkpointHadithLesson(
  progress: HadithProgress,
  lessonId: string,
  currentStage: number,
  completedStage?: HadithStageId | "speak" | "check-review",
  scorePercent?: number,
  now = new Date()
): HadithProgress {
  const previous = progress[lessonId];
  const normalizedStage =
    completedStage === "speak" || completedStage === "check-review"
      ? ("review" as HadithStageId)
      : completedStage;
  const completedStages = normalizedStage
    ? [...new Set([...(previous?.completedStages ?? []), normalizedStage])]
    : (previous?.completedStages ?? []);
  return {
    ...progress,
    [lessonId]: {
      status: previous?.status === "mastered" ? "mastered" : "in-progress",
      currentStage: Math.max(0, Math.min(HADITH_STAGE_IDS.length - 1, Math.floor(currentStage))),
      completedStages,
      bestScorePercent: Math.max(
        previous?.bestScorePercent ?? 0,
        scorePercent === undefined ? 0 : clampScore(scorePercent)
      ),
      sessions: previous?.sessions ?? 0,
      ...(previous?.confidence ? { confidence: previous.confidence } : {}),
      ...(previous?.nextReviewAt ? { nextReviewAt: previous.nextReviewAt } : {}),
      updatedAt: now.toISOString(),
    },
  };
}

export function completeHadithLesson(
  progress: HadithProgress,
  lessonId: string,
  scorePercent: number,
  confidence: HadithConfidence,
  now = new Date()
): HadithProgress {
  const previous = progress[lessonId];
  const score = clampScore(scorePercent);
  const mastered = score >= 80 && confidence !== "again";
  const reviewDays = getHadithReviewIntervalDays(score, confidence);
  return {
    ...progress,
    [lessonId]: {
      status: mastered ? "mastered" : "needs-practice",
      currentStage: HADITH_STAGE_IDS.length - 1,
      completedStages: [...HADITH_STAGE_IDS],
      bestScorePercent: Math.max(previous?.bestScorePercent ?? 0, score),
      sessions: (previous?.sessions ?? 0) + 1,
      confidence,
      nextReviewAt: new Date(now.getTime() + reviewDays * 86_400_000).toISOString(),
      updatedAt: now.toISOString(),
    },
  };
}
