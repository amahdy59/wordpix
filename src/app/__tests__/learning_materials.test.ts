import { describe, expect, it } from "vitest";
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

    it("loads", async () => {
      const loaded = await loadLearningMaterials(unitId);
      expect(loaded).not.toBeNull();
      materials = loaded!;
      expect(materials.unitId).toBe(unitId);
    });

    it("groups every word of the unit into exactly one sub-topic", async () => {
      materials = (await loadLearningMaterials(unitId))!;
      const unit = COURSE_UNITS[unitId];
      expect(unit).toBeDefined();

      // Sub-topics come from `topic-*` frames, and not every unit has them —
      // fifteen units carry word cards and materials but no topic grouping.
      // The block is absent for those, and the Study screen hides the section
      // rather than showing an empty one, so there is nothing here to check.
      if (!materials.subtopics) return;

      const grouped = materials.subtopics.flatMap((t) => t.wordIds);
      const unitWordIds = unit.wordIds;

      // An empty block would mean "grouped into zero sub-topics", which is a
      // different claim from "not grouped" and always a bug.
      expect(materials.subtopics.length).toBeGreaterThan(0);
      // No duplicates across sub-topics.
      expect(new Set(grouped).size).toBe(grouped.length);
      // Every grouped id is a real word in this unit.
      expect(grouped.filter((id) => !unitWordIds.includes(id))).toEqual([]);
      // Every word of the unit is placed.
      expect(unitWordIds.filter((id) => !grouped.includes(id))).toEqual([]);
    });

    it("gives every comprehension question exactly one answer in range", async () => {
      materials = (await loadLearningMaterials(unitId))!;
      for (const q of materials.passage?.questions ?? []) {
        expect(q.options.length, `${q.id} needs at least two options`).toBeGreaterThan(1);
        expect(new Set(q.options).size, `${q.id} has duplicate options`).toBe(q.options.length);
        expect(q.correctIndex).toBeGreaterThanOrEqual(0);
        expect(q.correctIndex).toBeLessThan(q.options.length);
        expect(q.explanation.trim().length, `${q.id} needs an explanation`).toBeGreaterThan(0);
      }
    });

    it("tags every phrase as an idiom or a phrasal verb", async () => {
      materials = (await loadLearningMaterials(unitId))!;
      for (const phrase of materials.phrases ?? []) {
        expect(["idiom", "phrasal-verb", "collocation"]).toContain(phrase.kind);
        expect(phrase.meaning.trim().length).toBeGreaterThan(0);
        // An example is optional: not every entry in the design file has one,
        // and an entry with a meaning is still worth showing.
      }
    });

    it("gives every fill-in-the-blank exactly one blank and an answer", async () => {
      materials = (await loadLearningMaterials(unitId))!;
      for (const item of materials.blankExercises ?? []) {
        const occurrences = item.sentence.split(BLANK_TOKEN).length - 1;
        expect(occurrences, `${item.id} must contain exactly one ${BLANK_TOKEN}`).toBe(1);
        expect(item.answer.trim().length, `${item.id} needs an answer`).toBeGreaterThan(0);
      }
    });

    it("keeps word-formation rows and reference entries non-empty", async () => {
      materials = (await loadLearningMaterials(unitId))!;
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
