import type { Action } from "../types";
import type { WordLearningState } from "../../features/gamification/sm2";
import { selectReviewWords } from "../learning/wordIdentity";
import { REVIEW_GROUP_ID } from "../data/courseCatalog";

export function reviewSessionAction(
  due: readonly WordLearningState[],
  limit: number
): Action | null {
  const reviewItems = selectReviewWords(due, limit);
  return reviewItems.length
    ? {
        type: "START_LESSON",
        lessonId: REVIEW_GROUP_ID,
        mode: "SMART_REVIEW",
        wordQueue: reviewItems.map((item) => item.wordId),
        reviewItems,
      }
    : null;
}
