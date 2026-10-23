import { describe, expect, it } from "vitest";
import { parseNavigationState } from "../router/navigationState";
import { COURSE_UNITS, REVIEW_GROUP_ID } from "../data/courseCatalog";

const lesson = {
  id: "lesson",
  mode: "NEW_LESSON",
  sessionId: "saved-session",
  lessonId: COURSE_UNITS["numbers-counting"].groups[0].id,
  unitId: "numbers-counting",
  wordQueue: ["one"],
  step: 0,
  totalSteps: 2,
  attempts: [],
  startedAt: "2026-10-23T08:00:00Z",
};
const review = {
  ...lesson,
  mode: "SMART_REVIEW",
  lessonId: REVIEW_GROUP_ID,
  reviewItems: [{ unitId: "numbers-counting", wordId: "one" }],
};

describe("saved navigation identities", () => {
  it.each([
    { id: "lesson-entry", unitId: "removed-unit" },
    { id: "lesson-entry", unitId: "toString" },
    { id: "learning-materials", unitId: "removed-unit" },
    { id: "learn-words", lessonId: "removed-group" },
    { id: "hadith-lesson", lessonId: "hadith-43" },
    { id: "hadith-lesson", lessonId: "not-a-hadith" },
    { id: "conversation-lesson", unitId: "unit-00" },
    { id: "conversation-lesson", unitId: "unit-41" },
    { id: "business-lesson", unitId: "unit-99" },
    { ...lesson, unitId: "removed-unit" },
    { ...lesson, lessonId: "removed-group" },
    { ...lesson, unitId: "bedroom" },
    { ...lesson, wordQueue: ["bed"] },
    { ...lesson, activeItemId: "bed" },
    { ...lesson, step: 2 },
    { ...review, reviewItems: [] },
    { ...review, reviewItems: undefined },
    { ...review, wordQueue: ["two"] },
    { ...review, wordQueue: ["one", "two"] },
    {
      ...review,
      wordQueue: ["one", "one"],
      reviewItems: [...review.reviewItems, ...review.reviewItems],
    },
    { ...review, reviewItems: [{ unitId: "bedroom", wordId: "one" }] },
    {
      ...review,
      attempts: [{ exerciseStep: 0, wordId: "bed", correct: true, answeredAt: lesson.startedAt }],
    },
  ])("rejects unavailable or inconsistent saved content: %j", (screen) => {
    expect(parseNavigationState(screen)).toBeNull();
  });

  it.each([
    lesson,
    { ...lesson, unitId: undefined },
    { ...lesson, mode: "PRE_LESSON_ASSESSMENT", wordQueue: ["one", "one"] },
    review,
    { ...review, id: "lesson-complete" },
    { id: "lesson-entry" },
    { id: "learning-materials", unitId: "numbers-counting" },
    { id: "learn-words", lessonId: lesson.lessonId },
    { id: "hadith-lesson", lessonId: "hadith-01" },
    { id: "hadith-lesson", lessonId: "hadith-42" },
    { id: "conversation-lesson", unitId: "unit-40", stage: "quiz" },
    { id: "business-lesson", unitId: "unit-01", stage: "review" },
  ])("preserves valid current and legacy navigation: %j", (screen) => {
    expect(parseNavigationState(screen)).not.toBeNull();
  });
});
