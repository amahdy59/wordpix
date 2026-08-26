import { describe, expect, it } from "vitest";
import { COURSE_UNITS, resolveUnitForLesson } from "../data/lessons";
import { getWords, loadAllUnitVocabulary, loadUnitVocabulary } from "../data/vocabulary";

/**
 * Word ids are not unique across the course, and the lookup has to care.
 *
 * 10,848 word entries share only 7,675 ids: 1,841 ids appear in more than one
 * unit, and "mirror" appears in fifteen. A single global id map can only
 * answer "some mirror" — whichever unit wrote that key last — so a bathroom
 * drill could render the gym's mirror.
 *
 * That failure is invisible by construction. The picture *is* a mirror, the
 * word *is* mirror, and nothing looks broken; it is simply not the photograph
 * the lesson was built around. Nobody would file it, which is why it is
 * pinned here.
 */

const unitWords = await loadAllUnitVocabulary();

/** An id that genuinely belongs to more than one unit, with its owners. */
function sharedId(): { id: string; units: string[] } {
  const owners = new Map<string, string[]>();
  for (const [unitId, words] of unitWords) {
    for (const word of words) {
      owners.set(word.id, [...(owners.get(word.id) ?? []), unitId]);
    }
  }
  const found = [...owners.entries()]
    .filter(([, units]) => units.length > 1)
    .sort((a, b) => b[1].length - a[1].length)[0];
  return { id: found[0], units: found[1] };
}

describe("word lookup respects the unit asking", () => {
  it("has ids that really are shared, or this test proves nothing", () => {
    const { units } = sharedId();
    expect(units.length).toBeGreaterThan(1);
  });

  it("returns each unit's own copy of a shared id", async () => {
    const { id, units } = sharedId();
    for (const unitId of units) await loadUnitVocabulary(unitId);

    for (const unitId of units) {
      const [word] = getWords([id], unitId);
      expect(word, `${unitId} could not resolve its own "${id}"`).toBeDefined();
      // The artwork is what actually differs, and what the learner sees.
      const own = (unitWords.get(unitId) ?? []).find((w) => w.id === id);
      expect(word.img, `${unitId} got another unit's "${id}"`).toBe(own!.img);
    }
  });

  it("gives different units different artwork for the same word", async () => {
    const { id, units } = sharedId();
    for (const unitId of units) await loadUnitVocabulary(unitId);
    const images = new Set(units.map((unitId) => getWords([id], unitId)[0]?.img));
    // If every unit resolved to one entry, the scoping is not doing anything.
    expect(images.size).toBeGreaterThan(1);
  });

  it("still answers without a unit, for cross-unit review sessions", () => {
    const { id } = sharedId();
    expect(getWords([id])).toHaveLength(1);
  });

  it("keeps a lesson's words inside the unit that owns the lesson", async () => {
    // The path the router actually takes: lessonId → unit → words.
    const unit = COURSE_UNITS["bathroom"];
    const group = unit.groups[0];
    const unitId = resolveUnitForLesson(group.id).id;
    expect(unitId).toBe("bathroom");

    await loadUnitVocabulary(unitId);
    for (const word of getWords(group.wordIds, unitId)) {
      expect(word.img, `${word.id} came from outside ${unitId}`).toContain(`/${unitId}/`);
    }
  });
});
