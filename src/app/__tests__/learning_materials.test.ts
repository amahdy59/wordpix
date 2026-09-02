import { beforeAll, describe, expect, it } from "vitest";
import { COURSE_UNITS } from "../data/lessons";
import { loadLearningMaterials, unitsWithLearningMaterials } from "../learning/registry";
import { BLANK_TOKEN, type UnitLearningMaterials } from "../learning/types";

/**
 * Integrity checks for content imported from Figma.
 *
 * These guard the extraction rather than the rendering: a sub-topic naming a
 * word the unit does not have, or a converted question with no correct answer,
 * is a broken import that would otherwise surface as an empty grid or an
 * unanswerable quiz in the app.
 */
describe("unit learning materials", () => {
  const unitIds = unitsWithLearningMaterials();

  it("registers at least one imported unit", () => {
    expect(unitIds.length).toBeGreaterThan(0);
  });

  it("returns null for a unit with no materials", async () => {
    await expect(loadLearningMaterials("not-a-real-unit")).resolves.toBeNull();
  });

  describe.each(unitIds)("%s", (unitId) => {
    let materials: UnitLearningMaterials;

    beforeAll(async () => {
      materials = (await loadLearningMaterials(unitId))!;
    });

    it("loads", () => {
      expect(materials).not.toBeNull();
      expect(materials.unitId).toBe(unitId);
    });

    it("groups every word of the unit into exactly one sub-topic", () => {
      const unit = COURSE_UNITS[unitId];
      expect(unit).toBeDefined();

      if (!materials.subtopics) return;

      const grouped = materials.subtopics.flatMap((t) => t.wordIds);
      const unitWordIds = unit.wordIds;

      expect(materials.subtopics.length).toBeGreaterThan(0);
      expect(new Set(grouped).size).toBe(grouped.length);
      expect(grouped.filter((id) => !unitWordIds.includes(id))).toEqual([]);
      expect(unitWordIds.filter((id) => !grouped.includes(id))).toEqual([]);
    });

    it("gives every comprehension question exactly one answer in range", () => {
      for (const q of materials.passage?.questions ?? []) {
        expect(q.options.length, `${q.id} needs at least two options`).toBeGreaterThan(1);
        expect(new Set(q.options).size, `${q.id} has duplicate options`).toBe(q.options.length);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.trim().length, `${q.id} needs an explanation`).toBeGreaterThan(0);
      }
    });

    it("tags every phrase as an idiom or a phrasal verb", () => {
      for (const phrase of materials.phrases ?? []) {
        expect(["idiom", "phrasal-verb", "collocation"]).toContain(phrase.kind);
        expect(phrase.meaning.trim().length).toBeGreaterThan(0);
      }
    });

    it("gives every fill-in-the-blank exactly one blank and an answer", () => {
      for (const item of materials.blankExercises ?? []) {
        const occurrences = item.sentence.split(BLANK_TOKEN).length - 1;
        expect(occurrences, `${item.id} must contain exactly one ${BLANK_TOKEN}`).toBe(1);
        expect(item.answer.trim().length, `${item.id} needs an answer`).toBeGreaterThan(0);
      }
    });

    it("keeps word-formation rows and reference entries non-empty", () => {
      for (const row of materials.wordFormation ?? []) {
        const filled = [row.noun, row.verb, row.adjective, row.adverb].filter(Boolean);
        expect(filled.length, "a row with no forms is a bad import").toBeGreaterThan(0);
      }
      for (const entry of materials.wordMeta ?? []) {
        expect(entry.frequency).toBeGreaterThanOrEqual(1);
        expect(entry.frequency).toBeLessThanOrEqual(3);
        expect(entry.collocations.length).toBeGreaterThan(0);
      }
    });
  });
});
