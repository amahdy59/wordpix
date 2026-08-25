import { describe, expect, it } from "vitest";
import { getDistractors } from "../exercises/exerciseContent";
import { COURSE_UNITS, resolveGroup, type VocabularyItem } from "../data/lessons";

/**
 * Distractors have to come from the lesson the learner is actually in.
 *
 * A unit is far bigger than a lesson — bathroom is 67 words split into groups
 * of 15 — and drawing wrong answers from the whole unit put words from three
 * lessons ahead on screen. A learner cannot rule out a picture whose word they
 * have never been taught, so the question stops measuring recognition.
 */

const bathroom = COURSE_UNITS["bathroom"];
const wordsById = new Map(bathroom.vocabulary.map((w) => [w.id, w]));
const lessonWords = (groupId: string): VocabularyItem[] =>
  resolveGroup(groupId)
    .wordIds.map((id) => wordsById.get(id)!)
    .filter(Boolean);

describe("distractor scoping", () => {
  it("draws every distractor from the current lesson", () => {
    const lesson = lessonWords("bathroom-1");
    expect(lesson.length).toBeGreaterThanOrEqual(4);
    const inLesson = new Set(lesson.map((w) => w.id));

    for (const target of lesson) {
      const distractors = getDistractors(target, 3, lesson);
      expect(distractors).toHaveLength(3);
      for (const d of distractors) {
        expect(inLesson.has(d.id), `${d.id} is not in bathroom-1`).toBe(true);
      }
    }
  });

  it("never offers the target word as its own distractor", () => {
    const lesson = lessonWords("bathroom-1");
    for (const target of lesson) {
      const ids = getDistractors(target, 3, lesson).map((d) => d.id);
      expect(ids).not.toContain(target.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("borrows from the unit only when the lesson cannot fill the options", () => {
    // A lesson of three can offer at most two distractors from within itself,
    // so the third has to come from somewhere — a slightly unfamiliar option
    // beats showing three choices when every other question shows four.
    const tiny = lessonWords("bathroom-1").slice(0, 3);
    const distractors = getDistractors(tiny[0], 3, tiny);

    expect(distractors).toHaveLength(3);
    expect(distractors.filter((d) => tiny.some((t) => t.id === d.id))).toHaveLength(2);
    for (const d of distractors) {
      expect(d.topic, "fallback stays inside the unit").toBe("bathroom");
    }
  });

  it("stays inside the lesson for every lesson of every unit", () => {
    for (const unit of Object.values(COURSE_UNITS)) {
      const byId = new Map(unit.vocabulary.map((w) => [w.id, w]));
      for (const group of unit.groups) {
        const lesson = group.wordIds.map((id) => byId.get(id)!).filter(Boolean);
        if (lesson.length < 4) continue; // covered by the fallback case above
        const inLesson = new Set(lesson.map((w) => w.id));
        const target = lesson[0];
        for (const d of getDistractors(target, 3, lesson)) {
          expect(inLesson.has(d.id), `${group.id} leaked ${d.id}`).toBe(true);
        }
      }
    }
  }, 60000);
});
