import { describe, expect, it } from "vitest";
import { reducer } from "../App";
import {
  BEDROOM_GROUPS,
  BEDROOM_VOCABULARY,
  REVIEW_GROUP_ID,
  getWords,
  nextGroupToStudy,
  resolveGroup,
} from "../data/lessons";
import { RICH_CONTEXT_SENTENCES } from "../exercises/exerciseContent";

/**
 * Regression cover for the defect that made every lesson in the app teach the
 * same five words.
 *
 * `LessonSceneDiscovery` — step 0 of *every* lesson — rebuilt the word queue
 * from `BEDROOM_VOCABULARY.slice(0, 4)` and dispatched START_LESSON without a
 * group id. The master list starts with bed, nightstand, dresser and wardrobe,
 * so whichever group the learner picked, the drills that followed were those
 * four words, labelled "Essential Furniture".
 *
 * Nothing here mocks the queue: these assert on the real group data, so they
 * fail if the wiring regresses or if a group is edited into an inconsistent
 * state.
 */

/** The four words the broken build always fell back to. */
const REGRESSION_WORDS = ["bed", "nightstand", "dresser", "wardrobe"];

/** Five drills. */
const LESSON_STEP_COUNT = 5;

describe("a lesson teaches the group it was started for", () => {
  it.each(BEDROOM_GROUPS.map((g) => [g.id, g.name] as const))(
    "keeps %s's own words end to end",
    (groupId) => {
      const group = resolveGroup(groupId);
      let state = reducer(
        { id: "lesson-entry" },
        { type: "START_LESSON", groupId, wordQueue: group.wordIds }
      );

      // Walk the whole flow; the queue must survive every step.
      for (let step = 0; step < LESSON_STEP_COUNT; step += 1) {
        expect(state).toMatchObject({ id: "lesson", groupId });
        if (state.id === "lesson") {
          expect(state.wordQueue).toEqual(group.wordIds);
        }
        state = reducer(state, { type: "LESSON_NEXT" });
      }

      expect(state).toMatchObject({ id: "lesson-complete", groupId });
      if (state.id === "lesson-complete") {
        expect(state.wordQueue).toEqual(group.wordIds);
      }
    }
  );

  it("does not collapse a non-furniture group onto the furniture words", () => {
    const pillows = resolveGroup("bedding-linens-2");
    const state = reducer(
      { id: "lesson-entry" },
      { type: "START_LESSON", groupId: pillows.id, wordQueue: pillows.wordIds }
    );

    expect(state.id).toBe("lesson");
    if (state.id !== "lesson") return;

    // The exact symptom the learner reported.
    for (const regressionWord of REGRESSION_WORDS) {
      expect(state.wordQueue).not.toContain(regressionWord);
    }
  });

});

describe("resolveGroup", () => {
  it("returns the group that was asked for", () => {
    for (const group of BEDROOM_GROUPS) {
      expect(resolveGroup(group.id).id).toBe(group.id);
    }
  });

  it("names a review session as a review, not as the first group", () => {
    const wordIds = ["pillow", "lamp"];
    const group = resolveGroup(REVIEW_GROUP_ID, wordIds);

    expect(group.id).toBe(REVIEW_GROUP_ID);
    expect(group.wordIds).toEqual(wordIds);
    expect(group.name).not.toBe(BEDROOM_GROUPS[0].name);
  });
});

describe("every group's words exist", () => {
  it.each(BEDROOM_GROUPS.map((g) => [g.id] as const))(
    "%s resolves all of its word ids",
    (groupId) => {
      const group = resolveGroup(groupId);
      // getWords silently drops unknown ids, which is how the "Pillows &
      // Covers" group once shrank from five words to three without anyone
      // noticing. A length mismatch means an id has no vocabulary entry.
      expect(getWords(group.wordIds)).toHaveLength(group.wordIds.length);
    }
  );

  it("keeps group word ids unique across the lesson", () => {
    for (const group of BEDROOM_GROUPS) {
      expect(new Set(group.wordIds).size).toBe(group.wordIds.length);
    }
  });
});

describe("nextGroupToStudy", () => {
  it("starts at the first group when nothing is mastered", () => {
    expect(nextGroupToStudy(() => false).id).toBe(BEDROOM_GROUPS[0].id);
  });

  it("moves on once a group is fully mastered", () => {
    const first = BEDROOM_GROUPS[0];
    const next = nextGroupToStudy((id) => first.wordIds.includes(id));
    expect(next.id).toBe(BEDROOM_GROUPS[1].id);
  });

  it("does not get stuck on the first group forever", () => {
    // The bug this replaces: Home always resumed BEDROOM_GROUPS[0].
    const everythingMastered = nextGroupToStudy(() => true);
    expect(everythingMastered.id).toBe(BEDROOM_GROUPS[BEDROOM_GROUPS.length - 1].id);
  });

  it("skips a mastered group even when a later one is untouched", () => {
    const [first, second] = BEDROOM_GROUPS;
    const mastered = new Set([...first.wordIds, ...second.wordIds]);
    expect(nextGroupToStudy((id) => mastered.has(id)).id).toBe(BEDROOM_GROUPS[2].id);
  });
});

describe("every group word has real teaching content", () => {
  it.each(BEDROOM_GROUPS.flatMap((g) => g.wordIds).map((id) => [id] as const))(
    "%s has a context sentence of its own",
    (wordId) => {
      // getRichSentence falls back to "This is a <word>." for anything missing,
      // which silently turns the context and sentence-building drills into an
      // article exercise. Six of the twenty group words were in that state,
      // including every word of the Pillows & Covers group.
      expect(RICH_CONTEXT_SENTENCES[wordId]).toBeDefined();
    }
  );

  it("builds a cloze that reads as the full sentence", () => {
    for (const wordId of BEDROOM_GROUPS.flatMap((g) => g.wordIds)) {
      const sentence = RICH_CONTEXT_SENTENCES[wordId];
      if (!sentence) continue;
      const word = getWords([wordId])[0];
      const assembled = [sentence.clozeBefore, word.label.toLowerCase(), sentence.clozeAfter]
        .join(" ")
        .replace(/\s+([.,])/g, "$1")
        .trim();
      expect(assembled).toBe(sentence.full);
    }
  });

  it("puts the target word among the sentence-builder tiles", () => {
    for (const wordId of BEDROOM_GROUPS.flatMap((g) => g.wordIds)) {
      const sentence = RICH_CONTEXT_SENTENCES[wordId];
      if (!sentence) continue;
      const label = getWords([wordId])[0].label.toLowerCase();
      // If the target word is not a tile, the drill never asks the learner to
      // place the very word the step is teaching.
      expect(sentence.words.map((w) => w.toLowerCase())).toContain(label);
    }
  });
});

describe("vocabulary integrity", () => {
  it("has no duplicate word ids", () => {
    const ids = BEDROOM_VOCABULARY.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
