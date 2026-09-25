import { isFoundationLessonId, type FoundationLessonId } from "./foundationCurriculum";

export const FOUNDATION_PROGRESS_SCHEMA_VERSION = 1 as const;
export const FOUNDATION_MASTERY_THRESHOLD = 80;

export type FoundationLessonStatus = "in-progress" | "needs-practice" | "mastered";

export interface FoundationLessonProgress {
  schemaVersion: typeof FOUNDATION_PROGRESS_SCHEMA_VERSION;
  status: FoundationLessonStatus;
  currentStep: number;
  questionResults: Record<string, boolean>;
  sessions: number;
  bestScorePercent: number;
  lastScorePercent: number;
  updatedAt: string;
  completedAt?: string;
}

export type FoundationProgress = Partial<Record<FoundationLessonId, FoundationLessonProgress>>;

const isStatus = (value: unknown): value is FoundationLessonStatus =>
  value === "in-progress" || value === "needs-practice" || value === "mastered";

const clampPercent = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function normalizeFoundationProgress(value: unknown): FoundationProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  const normalized: FoundationProgress = {};
  for (const [lessonId, raw] of Object.entries(value)) {
    if (!isFoundationLessonId(lessonId)) continue;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const record = raw as Partial<FoundationLessonProgress>;
    if (!isStatus(record.status)) continue;

    normalized[lessonId as FoundationLessonId] = {
      schemaVersion: FOUNDATION_PROGRESS_SCHEMA_VERSION,
      status: record.status,
      currentStep:
        typeof record.currentStep === "number" && Number.isFinite(record.currentStep)
          ? Math.max(0, Math.floor(record.currentStep))
          : 0,
      questionResults:
        record.questionResults && typeof record.questionResults === "object"
          ? Object.fromEntries(
              Object.entries(record.questionResults).filter(
                (entry): entry is [string, boolean] => typeof entry[1] === "boolean"
              )
            )
          : {},
      sessions:
        typeof record.sessions === "number" && Number.isFinite(record.sessions)
          ? Math.max(0, Math.floor(record.sessions))
          : 0,
      bestScorePercent:
        typeof record.bestScorePercent === "number" ? clampPercent(record.bestScorePercent) : 0,
      lastScorePercent:
        typeof record.lastScorePercent === "number" ? clampPercent(record.lastScorePercent) : 0,
      updatedAt:
        typeof record.updatedAt === "string" && record.updatedAt
          ? record.updatedAt
          : new Date(0).toISOString(),
      ...(typeof record.completedAt === "string" && record.completedAt
        ? { completedAt: record.completedAt }
        : {}),
    };
  }
  return normalized;
}

export function checkpointFoundationLesson(
  progress: FoundationProgress,
  lessonId: FoundationLessonId,
  currentStep: number,
  questionResults: Readonly<Record<number, boolean>>,
  updatedAt = new Date().toISOString()
): FoundationProgress {
  const previous = progress[lessonId];
  return {
    ...progress,
    [lessonId]: {
      schemaVersion: FOUNDATION_PROGRESS_SCHEMA_VERSION,
      status: previous?.status === "mastered" ? "mastered" : "in-progress",
      currentStep: Math.max(0, Math.floor(currentStep)),
      questionResults: Object.fromEntries(
        Object.entries(questionResults).map(([key, result]) => [key, Boolean(result)])
      ),
      sessions: previous?.sessions ?? 0,
      bestScorePercent: previous?.bestScorePercent ?? 0,
      lastScorePercent: previous?.lastScorePercent ?? 0,
      updatedAt,
      ...(previous?.completedAt ? { completedAt: previous.completedAt } : {}),
    },
  };
}

export function completeFoundationLesson(
  progress: FoundationProgress,
  lessonId: FoundationLessonId,
  correct: number,
  total: number,
  currentStep: number,
  questionResults: Readonly<Record<number, boolean>>,
  completedAt = new Date().toISOString(),
  masteryThreshold = FOUNDATION_MASTERY_THRESHOLD
): FoundationProgress {
  const previous = progress[lessonId];
  const score = total > 0 ? clampPercent((correct / total) * 100) : 0;
  const mastered =
    previous?.status === "mastered" || masteryThreshold === 0 || score >= masteryThreshold;
  return {
    ...progress,
    [lessonId]: {
      schemaVersion: FOUNDATION_PROGRESS_SCHEMA_VERSION,
      status: mastered ? "mastered" : "needs-practice",
      currentStep,
      questionResults: Object.fromEntries(
        Object.entries(questionResults).map(([key, result]) => [key, Boolean(result)])
      ),
      sessions: (previous?.sessions ?? 0) + 1,
      bestScorePercent: Math.max(previous?.bestScorePercent ?? 0, score),
      lastScorePercent: score,
      updatedAt: completedAt,
      completedAt,
    },
  };
}

export function getRecommendedFoundationLessonId(
  lessonIds: readonly FoundationLessonId[],
  progress: FoundationProgress
): FoundationLessonId {
  const unfinished = lessonIds.filter((id) => progress[id]?.status !== "mastered");
  const recentlyOpened = unfinished
    .filter((id) => progress[id]?.status === "in-progress")
    .sort((left, right) =>
      (progress[right]?.updatedAt ?? "").localeCompare(progress[left]?.updatedAt ?? "")
    )[0];
  return recentlyOpened ?? unfinished[0] ?? lessonIds[0];
}
