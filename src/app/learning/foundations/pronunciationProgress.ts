export type PronunciationLessonStatus = "in-progress" | "needs-practice" | "mastered";

export interface PronunciationSession {
  version?: 2;
  currentTargetId?: string;
  targetEvidence?: Record<string, PronunciationTargetEvidence>;
  trial: number;
  attempts: number;
  answer: string | null;
  unlockedStage: number;
  /** First-attempt evidence, keyed by stable stage/trial identity. */
  outcomes: Record<string, boolean>;
}

export interface PronunciationTargetEvidence {
  listening?: boolean;
  speaking?: "unassessed" | "reflected" | "assessed";
  updatedAt: string;
  nextReviewAt?: string;
}

function normalizeTargetEvidence(value: unknown): Record<string, PronunciationTargetEvidence> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, raw]) => {
      if (!key.startsWith("target:") || !raw || typeof raw !== "object") return [];
      const item = raw as Partial<PronunciationTargetEvidence>;
      if (typeof item.updatedAt !== "string" || !Number.isFinite(Date.parse(item.updatedAt)))
        return [];
      return [
        [
          key,
          {
            ...(typeof item.listening === "boolean" ? { listening: item.listening } : {}),
            ...(["unassessed", "reflected", "assessed"].includes(item.speaking ?? "")
              ? { speaking: item.speaking }
              : {}),
            updatedAt: item.updatedAt,
            ...(typeof item.nextReviewAt === "string" &&
            Number.isFinite(Date.parse(item.nextReviewAt))
              ? { nextReviewAt: item.nextReviewAt }
              : {}),
          },
        ],
      ];
    })
  );
}

export function normalizePronunciationSession(value: unknown): PronunciationSession | undefined {
  if (!value || typeof value !== "object") return undefined;
  const item = value as Partial<PronunciationSession>;
  if (
    !Number.isInteger(item.trial) ||
    item.trial! < 0 ||
    item.trial! > (item.version === 2 ? 500 : 2) ||
    !Number.isInteger(item.attempts) ||
    item.attempts! < 0 ||
    !Number.isInteger(item.unlockedStage) ||
    item.unlockedStage! < 0 ||
    item.unlockedStage! > 4 ||
    !(item.answer === null || typeof item.answer === "string") ||
    !item.outcomes ||
    typeof item.outcomes !== "object" ||
    Array.isArray(item.outcomes)
  )
    return undefined;
  const outcomes = Object.fromEntries(
    Object.entries(item.outcomes).filter(
      ([key, outcome]) =>
        (item.version === 2 ? /^[1-4]:target:.+$/.test(key) : /^[1-4]:[0-2]$/.test(key)) &&
        typeof outcome === "boolean"
    )
  );
  return {
    ...(item.version === 2
      ? {
          version: 2,
          targetEvidence: normalizeTargetEvidence(item.targetEvidence),
          ...(typeof item.currentTargetId === "string" && item.currentTargetId.startsWith("target:")
            ? { currentTargetId: item.currentTargetId }
            : {}),
        }
      : {}),
    trial: item.trial!,
    attempts: item.attempts!,
    answer: item.answer!,
    unlockedStage: item.unlockedStage!,
    outcomes,
  };
}

export interface PronunciationLessonProgress {
  targetEvidence?: Record<string, PronunciationTargetEvidence>;
  status: PronunciationLessonStatus;
  currentStage: number;
  bestScorePercent: number;
  sessions: number;
  nextReviewAt?: string;
  updatedAt: string;
  session?: PronunciationSession;
}

export type PronunciationProgress = Record<string, PronunciationLessonProgress>;

export function getDuePronunciationReviews(progress: PronunciationProgress, now: Date) {
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  return Object.entries(progress).flatMap(([lessonId, lesson]) => {
    if (!/^lesson-\d{2}$/.test(lessonId)) return [];
    const lessonNumber = Number(lessonId.slice(7));
    if (lessonNumber < 1 || lessonNumber > 68) return [];
    const evidence = { ...lesson.targetEvidence, ...lesson.session?.targetEvidence };
    const targets = Object.entries(evidence).filter(
      ([, item]) => item.nextReviewAt && Date.parse(item.nextReviewAt) <= todayEnd.getTime()
    );
    return targets.length
      ? [{ lessonId, lessonNumber, targets: targets.map(([targetId]) => targetId) }]
      : [];
  });
}

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
  now = new Date(),
  session?: PronunciationSession
): PronunciationProgress {
  const previous = progress[lessonId];
  return {
    ...progress,
    [lessonId]: {
      ...(previous?.targetEvidence ? { targetEvidence: previous.targetEvidence } : {}),
      status: previous?.status === "mastered" ? "mastered" : "in-progress",
      currentStage: Math.max(0, Math.floor(currentStage)),
      bestScorePercent: previous?.bestScorePercent ?? 0,
      sessions: previous?.sessions ?? 0,
      ...(previous?.nextReviewAt ? { nextReviewAt: previous.nextReviewAt } : {}),
      updatedAt: now.toISOString(),
      ...(session ? { session } : previous?.session ? { session: previous.session } : {}),
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
      ...(item.targetEvidence
        ? { targetEvidence: normalizeTargetEvidence(item.targetEvidence) }
        : {}),
      status: item.status as PronunciationLessonStatus,
      currentStage:
        typeof item.currentStage === "number" ? Math.max(0, Math.floor(item.currentStage)) : 0,
      bestScorePercent:
        typeof item.bestScorePercent === "number" ? clamp(item.bestScorePercent) : 0,
      sessions: typeof item.sessions === "number" ? Math.max(0, Math.floor(item.sessions)) : 0,
      ...(typeof item.nextReviewAt === "string" ? { nextReviewAt: item.nextReviewAt } : {}),
      updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : new Date(0).toISOString(),
      ...(normalizePronunciationSession(item.session)
        ? { session: normalizePronunciationSession(item.session) }
        : {}),
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
  const targetEvidence = { ...previous?.targetEvidence, ...previous?.session?.targetEvidence };
  return {
    ...progress,
    [lessonId]: {
      // Word coverage and acoustic feedback are distinct from validated speaking mastery.
      status:
        previous?.session?.version === 2
          ? "needs-practice"
          : score >= 80
            ? "mastered"
            : "needs-practice",
      ...(Object.keys(targetEvidence).length ? { targetEvidence } : {}),
      currentStage: Math.max(0, Math.floor(currentStage)),
      bestScorePercent: Math.max(previous?.bestScorePercent ?? 0, score),
      sessions: (previous?.sessions ?? 0) + 1,
      nextReviewAt,
      updatedAt: now.toISOString(),
    },
  };
}
