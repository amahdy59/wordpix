export type PronunciationLessonStatus = "in-progress" | "needs-practice" | "mastered";

export interface PronunciationLessonProgress {
  status: PronunciationLessonStatus;
  currentStage: number;
  bestScorePercent: number;
  sessions: number;
  nextReviewAt?: string;
  updatedAt: string;
}

export type PronunciationProgress = Record<string, PronunciationLessonProgress>;

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export function checkpointPronunciationLesson(
  progress: PronunciationProgress,
  lessonId: string,
  currentStage: number,
  now = new Date()
): PronunciationProgress {
  const previous = progress[lessonId];
  return {
    ...progress,
    [lessonId]: {
      status: previous?.status === "mastered" ? "mastered" : "in-progress",
      currentStage: Math.max(0, Math.floor(currentStage)),
      bestScorePercent: previous?.bestScorePercent ?? 0,
      sessions: previous?.sessions ?? 0,
      ...(previous?.nextReviewAt ? { nextReviewAt: previous.nextReviewAt } : {}),
      updatedAt: now.toISOString(),
    },
  };
}

export function normalizePronunciationProgress(value: unknown): PronunciationProgress {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const output: PronunciationProgress = {};
  for (const [id, raw] of Object.entries(value)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const item = raw as Partial<PronunciationLessonProgress>;
    if (!["in-progress", "needs-practice", "mastered"].includes(String(item.status))) continue;
    output[id] = {
      status: item.status as PronunciationLessonStatus,
      currentStage:
        typeof item.currentStage === "number" ? Math.max(0, Math.floor(item.currentStage)) : 0,
      bestScorePercent:
        typeof item.bestScorePercent === "number" ? clamp(item.bestScorePercent) : 0,
      sessions: typeof item.sessions === "number" ? Math.max(0, Math.floor(item.sessions)) : 0,
      ...(typeof item.nextReviewAt === "string" ? { nextReviewAt: item.nextReviewAt } : {}),
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date(0).toISOString(),
    };
  }
  return output;
}

export function completePronunciationLesson(
  progress: PronunciationProgress,
  lessonId: string,
  scorePercent: number,
  currentStage: number,
  now = new Date()
): PronunciationProgress {
  const previous = progress[lessonId];
  const score = clamp(scorePercent);
  const nextReviewAt = new Date(now.getTime() + (score >= 80 ? 3 : 1) * 86400000).toISOString();
  return {
    ...progress,
    [lessonId]: {
      status: score >= 80 ? "mastered" : "needs-practice",
      currentStage: Math.max(0, Math.floor(currentStage)),
      bestScorePercent: Math.max(previous?.bestScorePercent ?? 0, score),
      sessions: (previous?.sessions ?? 0) + 1,
      nextReviewAt,
      updatedAt: now.toISOString(),
    },
  };
}
