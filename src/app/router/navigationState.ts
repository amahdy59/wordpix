import { z } from "zod";
import type { Screen } from "../types";
import { SKILL_EXERCISE_IDS } from "../exercises/registry";
import { BUSINESS_STAGE_IDS } from "../learning/business/businessTypes";
import { CONVERSATION_STAGE_IDS } from "../learning/conversation/conversationTypes";
import { MASTERY_DIMENSIONS } from "../../features/gamification/sm2";
import { COURSE_UNITS, REVIEW_GROUP_ID } from "../data/courseCatalog";
import { PRONUNCIATION_LESSON_COUNT } from "../learning/foundations/pronunciationLessonMetadata";
import {
  HADITH_LESSON_COUNT,
  getHadithLessonMetadata,
} from "../learning/hadith/hadithLessonMetadata";
import { MAX_LESSON_STAGE_COUNT } from "../lesson/lessonSequence";

const id = z.string().min(1).max(200);
const vocabularyUnitIds = new Set(Object.keys(COURSE_UNITS));
const vocabularyUnitId = id.refine((value) => vocabularyUnitIds.has(value));
const groupOwners = new Map(
  Object.values(COURSE_UNITS).flatMap((unit) =>
    unit.groups.map((group) => [group.id, unit] as const)
  )
);
const groupId = id.refine((value) => groupOwners.has(value));
// Match the specialist routes without eagerly loading their full lesson catalogs.
const specialistUnitId = id.regex(/^unit-(?:0[1-9]|[12]\d|3\d|40)$/);
const hadithIds = new Set(
  Array.from({ length: HADITH_LESSON_COUNT }, (_, index) => getHadithLessonMetadata(index + 1)?.id)
);
const returnTo = z.enum([
  "home",
  "explore",
  "library",
  "learn",
  "profile",
  "practice",
  "lesson-entry",
]);
const attempt = z.object({
  exerciseStep: z.number().int().nonnegative(),
  wordId: id,
  correct: z.boolean(),
  answeredAt: z.string(),
  dimension: z.enum(MASTERY_DIMENSIONS).optional(),
});
const session = {
  mode: z.enum([
    "NEW_LESSON",
    "SMART_REVIEW",
    "SKILL_PRACTICE",
    "UNIT_ASSESSMENT",
    "PRE_LESSON_ASSESSMENT",
  ]),
  sessionId: id,
  lessonId: id,
  unitId: vocabularyUnitId.optional(),
  wordQueue: z.array(id).min(1),
  attempts: z.array(attempt),
  reviewItems: z.array(z.object({ unitId: vocabularyUnitId, wordId: id })).optional(),
};
const schema = z.discriminatedUnion("id", [
  z.object({
    id: z.literal("onboarding"),
    step: z.enum(["splash", "partners", "language", "ready"]),
  }),
  ...(
    [
      "home",
      "learn",
      "explore",
      "library",
      "practice",
      "review",
      "profile",
      "settings",
      "release-notes",
      "pronunciation-curriculum",
      "hadith-curriculum",
      "conversation-curriculum",
      "business-curriculum",
      "skill-hub",
    ] as const
  ).map((value) => z.object({ id: z.literal(value) })),
  z.object({
    id: z.literal("lesson-entry"),
    unitId: vocabularyUnitId.optional(),
    returnTo: returnTo.exclude(["lesson-entry"]).optional(),
  }),
  z.object({ id: z.literal("learn-words"), lessonId: groupId }),
  z.object({
    id: z.literal("learning-materials"),
    unitId: vocabularyUnitId.optional(),
    area: id.optional(),
    nodeId: id.optional(),
    returnTo: returnTo.optional(),
  }),
  z.object({
    id: z.literal("figma-pronunciation-lesson"),
    lessonNumber: z.number().int().min(1).max(PRONUNCIATION_LESSON_COUNT),
  }),
  z.object({
    id: z.literal("hadith-lesson"),
    lessonId: id.refine((value) => hadithIds.has(value)),
  }),
  z.object({
    id: z.literal("conversation-lesson"),
    unitId: specialistUnitId,
    stage: z.enum(CONVERSATION_STAGE_IDS).optional(),
  }),
  z.object({
    id: z.literal("business-lesson"),
    unitId: specialistUnitId,
    stage: z.enum(BUSINESS_STAGE_IDS).optional(),
  }),
  z.object({ id: z.literal("skill-exercise"), exerciseId: z.enum(SKILL_EXERCISE_IDS) }),
  z.object({
    id: z.literal("lesson"),
    ...session,
    step: z
      .number()
      .int()
      .min(0)
      .max(MAX_LESSON_STAGE_COUNT - 1),
    totalSteps: z.number().int().min(1).max(MAX_LESSON_STAGE_COUNT).optional(),
    startedAt: z.string(),
    activeItemId: id.optional(),
  }),
  z.object({ id: z.literal("lesson-complete"), ...session }),
]);

/** Invalid navigation is recoverable without deleting canonical learner records. */
export function parseNavigationState(value: unknown): Screen | null {
  const result = schema.safeParse(value);
  if (!result.success) return null;
  const screen = result.data;
  if (screen.id === "lesson" || screen.id === "lesson-complete") {
    const queue = new Set(screen.wordQueue);
    if (screen.attempts.some((item) => !queue.has(item.wordId))) return null;
    if (
      screen.id === "lesson" &&
      ((screen.totalSteps !== undefined && screen.step >= screen.totalSteps) ||
        (screen.activeItemId !== undefined && !queue.has(screen.activeItemId)))
    )
      return null;

    if (screen.mode === "SMART_REVIEW" || screen.reviewItems !== undefined) {
      // Each review position must identify exactly the meaning being assessed.
      // Older reviews without owning units cannot safely restore that identity.
      if (
        !screen.reviewItems?.length ||
        screen.reviewItems.length !== screen.wordQueue.length ||
        queue.size !== screen.wordQueue.length ||
        (screen.lessonId !== REVIEW_GROUP_ID && screen.lessonId !== "spaced-review") ||
        screen.reviewItems.some(
          (item, index) =>
            item.wordId !== screen.wordQueue[index] ||
            !COURSE_UNITS[item.unitId].wordIds.includes(item.wordId)
        )
      )
        return null;
    } else {
      const owner = groupOwners.get(screen.lessonId);
      if (
        !owner ||
        (screen.unitId !== undefined && screen.unitId !== owner.id) ||
        !screen.wordQueue.every((wordId) => owner.wordIds.includes(wordId))
      )
        return null;
    }
  }
  if (screen.id === "explore") return { id: "learn" };
  return screen;
}
