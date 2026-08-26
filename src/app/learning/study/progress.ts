import { UnitStudyProgress } from "./types";

const STORAGE_KEY = "wordpix.studyProgress.v1";

export function loadStudyProgress(unitId: string): UnitStudyProgress {
  const defaultProgress: UnitStudyProgress = {
    version: 1,
    unitId,
    completedNodeIds: [],
    wordStatus: {},
    reviewWordIds: [],
    updatedAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;

    const data = JSON.parse(raw);
    if (data[unitId] && data[unitId].version === 1) {
      return data[unitId] as UnitStudyProgress;
    }
    return defaultProgress;
  } catch (e) {
    console.error("Failed to load study progress", e);
    return defaultProgress;
  }
}

export function saveStudyProgress(progress: UnitStudyProgress) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};

    progress.updatedAt = new Date().toISOString();
    data[progress.unitId] = progress;

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
    // If it was in review and they got it right, maybe it graduates, but typically we require it to pass in a review session.
    // We'll leave it in reviewWordIds until explicitly cleared during a review session.
    if (!newProgress.wordStatus[wordId]) {
      newProgress.wordStatus[wordId] = "learning";
    }
  }

  return newProgress;
}

export function clearReviewWord(progress: UnitStudyProgress, wordId: string): UnitStudyProgress {
  const newProgress = { ...progress };
  newProgress.reviewWordIds = newProgress.reviewWordIds.filter((id) => id !== wordId);
  return newProgress;
}
