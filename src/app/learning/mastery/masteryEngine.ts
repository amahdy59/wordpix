import type { MasteryItemProgress, MasteryLesson, MasteryStatus } from "./masteryTypes";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * ONE_DAY_MS;
const SEVEN_DAYS_MS = 7 * ONE_DAY_MS;

export function createInitialProgress(id: string): MasteryItemProgress {
  return {
    id,
    status: "unseen",
    consecutiveCorrect: 0,
    totalAttempts: 0,
    totalErrors: 0,
  };
}

export function updateMasteryProgress(
  current: MasteryItemProgress,
  correct: boolean,
  nowMs = Date.now()
): MasteryItemProgress {
  const totalAttempts = current.totalAttempts + 1;

  if (correct) {
    const consecutiveCorrect = current.consecutiveCorrect + 1;
    const isMastered = consecutiveCorrect >= 3;
    const status: MasteryStatus = isMastered ? "mastered" : "practicing";

    let interval = ONE_DAY_MS;
    if (consecutiveCorrect >= 6) {
      interval = SEVEN_DAYS_MS;
    } else if (consecutiveCorrect >= 4) {
      interval = THREE_DAYS_MS;
    }

    return {
      id: current.id,
      status,
      consecutiveCorrect,
      totalAttempts,
      totalErrors: current.totalErrors,
      lastPracticedMs: nowMs,
      nextReviewMs: nowMs + interval,
    };
  }

  const totalErrors = current.totalErrors + 1;
  const isStruggling = totalErrors >= 2 && current.consecutiveCorrect === 0;
  const status: MasteryStatus = isStruggling ? "struggling" : "practicing";

  return {
    id: current.id,
    status,
    consecutiveCorrect: 0,
    totalAttempts,
    totalErrors,
    lastPracticedMs: nowMs,
    nextReviewMs: nowMs, // immediate review
  };
}

export function calculateReviewQueue(
  items: readonly MasteryItemProgress[],
  currentMs = Date.now()
): string[] {
  const eligible = items.filter((item) => {
    if (item.status === "struggling") return true;
    if (item.nextReviewMs !== undefined && item.nextReviewMs <= currentMs) {
      return item.status === "mastered" || item.status === "practicing";
    }
    return false;
  });

  return eligible
    .sort((a, b) => {
      // Struggling items take priority
      if (a.status === "struggling" && b.status !== "struggling") return -1;
      if (b.status === "struggling" && a.status !== "struggling") return 1;
      // Then oldest overdue
      const aDue = a.nextReviewMs ?? 0;
      const bDue = b.nextReviewMs ?? 0;
      return aDue - bDue;
    })
    .map((item) => item.id);
}

export function checkPrerequisitesSatisfied(
  lesson: MasteryLesson,
  completedLessonIds: ReadonlySet<string>
): boolean {
  return lesson.prerequisites.every((prereqId) => completedLessonIds.has(prereqId));
}
