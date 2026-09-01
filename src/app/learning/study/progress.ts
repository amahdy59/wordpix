import { UnitStudyProgress, StudyWordStatus, StudyNode } from "./types";

const STORAGE_KEY = "wordpix.studyProgress.v1";

function isValidWordStatus(status: unknown): status is StudyWordStatus {
  return (
    typeof status === "string" && ["new", "learning", "comfortable", "review"].includes(status)
  );
}

function sanitizeProgress(raw: unknown, unitId: string): UnitStudyProgress {
  const defaultProgress: UnitStudyProgress = {
    version: 1,
    unitId,
    completedNodeIds: [],
    wordStatus: {},
    reviewWordIds: [],
    updatedAt: new Date().toISOString(),
  };

  if (!raw || typeof raw !== "object") return defaultProgress;
  const obj = raw as Record<string, unknown>;

  const completedNodeIds = Array.isArray(obj.completedNodeIds)
    ? obj.completedNodeIds.filter((id): id is string => typeof id === "string")
    : [];

  const reviewWordIds = Array.isArray(obj.reviewWordIds)
    ? obj.reviewWordIds.filter((id): id is string => typeof id === "string")
    : [];

  const wordStatus: Record<string, StudyWordStatus> = {};
  if (obj.wordStatus && typeof obj.wordStatus === "object") {
    for (const [key, val] of Object.entries(obj.wordStatus as Record<string, unknown>)) {
      if (typeof key === "string" && isValidWordStatus(val)) {
        wordStatus[key] = val;
      }
    }
  }

  const nodePositions: Record<string, number> = {};
  if (obj.nodePositions && typeof obj.nodePositions === "object") {
    for (const [key, val] of Object.entries(obj.nodePositions as Record<string, unknown>)) {
      if (typeof key === "string" && typeof val === "number" && !isNaN(val)) {
        nodePositions[key] = Math.max(0, Math.floor(val));
      }
    }
  }

  const selfAssessment: Record<string, number> = {};
  if (obj.selfAssessment && typeof obj.selfAssessment === "object") {
    for (const [key, val] of Object.entries(obj.selfAssessment as Record<string, unknown>)) {
      if (typeof key === "string" && typeof val === "number" && !isNaN(val)) {
        selfAssessment[key] = val;
      }
    }
  }

  return {
    version: 1,
    unitId,
    lastNodeId: typeof obj.lastNodeId === "string" ? obj.lastNodeId : undefined,
    completedNodeIds,
    wordStatus,
    reviewWordIds,
    nodePositions,
    selfAssessment,
    updatedAt: typeof obj.updatedAt === "string" ? obj.updatedAt : new Date().toISOString(),
  };
}

export function initialStudyProgress(unitId: string): UnitStudyProgress {
  return sanitizeProgress(null, unitId);
}

export function loadStudyProgress(unitId: string): UnitStudyProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return sanitizeProgress(null, unitId);

    const data = JSON.parse(raw);
    if (data && typeof data === "object" && data[unitId]) {
      return sanitizeProgress(data[unitId], unitId);
    }
    return sanitizeProgress(null, unitId);
  } catch (e) {
    console.error("Failed to load study progress", e);
    return sanitizeProgress(null, unitId);
  }
}

export function saveStudyProgress(progress: UnitStudyProgress) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};

    data[progress.unitId] = { ...progress, updatedAt: new Date().toISOString() };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save study progress", e);
  }
}

export function recordWordPractice(
  progress: UnitStudyProgress,
  wordId: string,
  isCorrect: boolean
): UnitStudyProgress {
  const newProgress = { ...progress };
  newProgress.wordStatus = { ...newProgress.wordStatus };
  newProgress.reviewWordIds = [...newProgress.reviewWordIds];

  if (!isCorrect) {
    if (!newProgress.reviewWordIds.includes(wordId)) {
      newProgress.reviewWordIds.push(wordId);
    }
    newProgress.wordStatus[wordId] = "learning";
  } else {
    // If it was in review and they got it right, keep until review confirmation
    if (!newProgress.wordStatus[wordId]) {
      newProgress.wordStatus[wordId] = "learning";
    }
  }

  return newProgress;
}

export function clearReviewWord(progress: UnitStudyProgress, wordId: string): UnitStudyProgress {
  const newProgress = { ...progress };
  newProgress.reviewWordIds = newProgress.reviewWordIds.filter((id) => id !== wordId);
  newProgress.wordStatus = { ...newProgress.wordStatus, [wordId]: "comfortable" };
  return newProgress;
}

/**
 * Calculates genuine activity completion: ratio of completed core curriculum nodes.
 */
export function getCoreActivityProgress(
  progress: UnitStudyProgress,
  nodes: StudyNode[]
): {
  completedCount: number;
  totalCount: number;
  percent: number;
} {
  const coreNodes = nodes.filter((n) => n.area !== "reference");
  const completedCount = progress.completedNodeIds.filter((id) =>
    coreNodes.some((n) => n.id === id)
  ).length;
  const totalCount = coreNodes.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  return { completedCount, totalCount, percent };
}
