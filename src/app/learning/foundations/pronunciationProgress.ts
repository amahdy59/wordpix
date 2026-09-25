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

export const LEGACY_PRONUNCIATION_LESSON_NUMBERS: Readonly<Record<string, number>> = {
  "pronunciation-goals": 59,
  "meaningful-contrasts": 1,
  "clear-word-endings": 25,
  "consonant-sequences": 9,
  "word-stress": 41,
  "syllable-prominence": 41,
  "vowel-clarity": 17,
  "important-information": 49,
  "meaning-chunks": 33,
  "connected-speech": 33,
  "communication-repair": 59,
  "pronunciation-portfolio": 68,
  "pronunciation-minimal-pairs": 17,
  "pronunciation-word-stress": 41,
  "pronunciation-connected-speech": 33,
  "pronunciation-communication-repair": 59,
};

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

/**
 * Preserve evidence of work in the retired Level 13 pilot without claiming
 * that a shorter qualitative lesson mastered its revised full lesson. Existing
 * revised progress always wins; migrated work resumes at the mapped lesson.
 */
export function migrateLegacyPronunciationProgress(
  legacyFoundationValue: unknown,
  pronunciationValue: unknown
): PronunciationProgress {
  const output = normalizePronunciationProgress(pronunciationValue);
  if (
    !legacyFoundationValue ||
    typeof legacyFoundationValue !== "object" ||
    Array.isArray(legacyFoundationValue)
  ) {
    return output;
  }

  for (const [legacyId, raw] of Object.entries(legacyFoundationValue)) {
    const lessonNumber = LEGACY_PRONUNCIATION_LESSON_NUMBERS[legacyId];
    if (!lessonNumber || !raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const targetId = `lesson-${String(lessonNumber).padStart(2, "0")}`;
    if (output[targetId]) continue;
    const item = raw as { status?: unknown; sessions?: unknown; updatedAt?: unknown };
    if (!["in-progress", "needs-practice", "mastered"].includes(String(item.status))) continue;
    output[targetId] = {
      status: "in-progress",
      currentStage: 0,
      bestScorePercent: 0,
      sessions:
        typeof item.sessions === "number" && Number.isFinite(item.sessions)
          ? Math.max(0, Math.floor(item.sessions))
          : 0,
      updatedAt:
        typeof item.updatedAt === "string" && item.updatedAt
          ? item.updatedAt
          : new Date(0).toISOString(),
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
