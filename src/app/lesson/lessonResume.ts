import { z } from "zod";
import type { Screen } from "../types";
import { COURSE_UNITS, resolveUnitForLesson } from "../data/courseCatalog";
import { MAX_LESSON_STAGE_COUNT } from "./lessonSequence";
import { MASTERY_DIMENSIONS } from "../../features/gamification/sm2";

const lessonSchema = z.object({
  id: z.literal("lesson"),
  mode: z.literal("NEW_LESSON"),
  sessionId: z.string().min(1),
  lessonId: z.string().min(1),
  unitId: z.string().min(1),
  wordQueue: z.array(z.string().min(1)).min(1),
  step: z
    .number()
    .int()
    .min(0)
    .max(MAX_LESSON_STAGE_COUNT - 1),
  totalSteps: z.number().int().min(1).max(MAX_LESSON_STAGE_COUNT),
  attempts: z.array(
    z.object({
      exerciseStep: z.number().int().min(0),
      wordId: z.string(),
      correct: z.boolean(),
      answeredAt: z.string(),
      dimension: z.enum(MASTERY_DIMENSIONS).optional(),
    })
  ),
  startedAt: z.string(),
  activeItemId: z.string().optional(),
});

const key = (unitId: string) => `wordpix:lesson-resume:${unitId}`;

/** Only restore validated, unit-scoped sessions; old or corrupt saves stay harmless. */
export function readLessonResume(unitId: string): Extract<Screen, { id: "lesson" }> | null {
  try {
    const raw = localStorage.getItem(key(unitId));
    if (!raw) return null;
    const parsed = lessonSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return null;
    const lesson = parsed.data;
    const unit = COURSE_UNITS[unitId];
    if (
      !unit ||
      lesson.unitId !== unitId ||
      lesson.step >= lesson.totalSteps ||
      !unit.groups.some((group) => group.id === lesson.lessonId) ||
      !lesson.wordQueue.every((id) => unit.wordIds.includes(id)) ||
      (lesson.activeItemId !== undefined && !lesson.wordQueue.includes(lesson.activeItemId))
    )
      return null;
    return lesson;
  } catch {
    return null;
  }
}

export function saveLessonResume(screen: Screen): void {
  try {
    if (screen.id === "lesson" && screen.mode === "NEW_LESSON") {
      const unitId = screen.unitId ?? resolveUnitForLesson(screen.lessonId).id;
      localStorage.setItem(key(unitId), JSON.stringify({ ...screen, unitId }));
    } else if (screen.id === "lesson-complete" && screen.mode === "NEW_LESSON") {
      localStorage.removeItem(key(screen.unitId ?? resolveUnitForLesson(screen.lessonId).id));
      const prefix = `wordpix:stage:${screen.unitId ?? resolveUnitForLesson(screen.lessonId).id}:`;
      for (const name of Object.keys(localStorage)) {
        if (!name.startsWith(prefix)) continue;
        try {
          if (
            (JSON.parse(localStorage.getItem(name) ?? "null") as { sessionId?: string } | null)
              ?.sessionId === screen.sessionId
          )
            localStorage.removeItem(name);
        } catch {
          /* leave unknown data untouched */
        }
      }
    }
  } catch {
    // Existing memory/IndexedDB progress remains authoritative when storage is unavailable.
  }
}
