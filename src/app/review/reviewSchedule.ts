import { getDueWordsForReview, type WordLearningState } from "../../features/gamification/sm2";

/** Due means eligible now, in every surface. Calendar labels use the learner's local day. */
export function getReviewSchedule(memory: Record<string, WordLearningState>, now = new Date()) {
  const midnight = new Date(now);
  midnight.setHours(0, 0, 0, 0);
  const due = getDueWordsForReview(memory, now);
  const overdue = due.filter(
    (word) => word.nextReviewAt && Date.parse(word.nextReviewAt) < midnight.getTime()
  );
  const overdueIds = new Set(overdue.map((word) => word.wordId));
  return { due, overdue, today: due.filter((word) => !overdueIds.has(word.wordId)) };
}
