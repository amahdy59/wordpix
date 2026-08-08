import { describe, expect, it } from "vitest";
import { BEDROOM_VOCABULARY, BEDROOM_GROUPS, BEDROOM_TOPICS } from "../data/lessons";
import { getImageAltText } from "../shared/WordImage";

/** Words in a label that carry meaning, lowercased and de-pluralised. */
function labelStems(label: string): string[] {
  return label
    .toLowerCase()
    .replace(/[^a-z ]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !["and", "the", "of"].includes(w))
    .map((w) => w.replace(/e?s$/, ""));
}

describe("Vocabulary descriptions", () => {
  it("every word has one", () => {
    BEDROOM_VOCABULARY.forEach((w) => {
      expect(w.description, `${w.id} has no description`).toBeTruthy();
    });
  });

  /**
   * The load-bearing rule. A description that contains its own word turns the
   * assessment alt text back into an answer key — the exact bug that made
   * screen readers read the answer aloud.
   */
  it("never names the word it describes", () => {
    const leaks: string[] = [];
    BEDROOM_VOCABULARY.forEach((w) => {
      labelStems(w.label).forEach((stem) => {
        if (new RegExp(`\\b${stem}`, "i").test(w.description)) {
          leaks.push(`${w.id} leaks "${stem}": ${w.description}`);
        }
      });
    });
    expect(leaks, leaks.join("\n")).toEqual([]);
  });

  it("is long enough to identify the object, short enough to hear", () => {
    BEDROOM_VOCABULARY.forEach((w) => {
      expect(w.description.length, `${w.id} too short`).toBeGreaterThan(25);
      expect(w.description.length, `${w.id} too long to listen to`).toBeLessThan(110);
    });
  });

  it("reads as a sentence", () => {
    BEDROOM_VOCABULARY.forEach((w) => {
      expect(w.description, `${w.id} should end with a period`).toMatch(/\.$/);
      expect(w.description[0], `${w.id} should start capitalised`).toBe(
        w.description[0].toUpperCase()
      );
    });
  });

  /**
   * Distractors are drawn from the same group, so two words a learner must
   * choose between cannot share a description.
   */
  it("distinguishes every word within a group", () => {
    BEDROOM_GROUPS.forEach((group) => {
      const descriptions = group.wordIds
        .map((id) => BEDROOM_VOCABULARY.find((w) => w.id === id)?.description)
        .filter(Boolean);
      expect(new Set(descriptions).size, `${group.name} has duplicate descriptions`).toBe(
        descriptions.length
      );
    });
  });

  it("keeps descriptions unique across the whole vocabulary", () => {
    const all = BEDROOM_VOCABULARY.map((w) => w.description);
    expect(new Set(all).size).toBe(all.length);
  });
});

describe("Lesson data integrity", () => {
  /**
   * The "Pillows & Covers" group listed `quilt` and `bedspread`, neither of
   * which existed. App.tsx filters unresolved ids out, so starting that lesson
   * silently dropped it from five words to three with no error anywhere.
   */
  it("every group references words that exist", () => {
    const ids = new Set(BEDROOM_VOCABULARY.map((w) => w.id));
    BEDROOM_GROUPS.forEach((group) => {
      group.wordIds.forEach((wordId) => {
        expect(ids.has(wordId), `${group.id} references missing word "${wordId}"`).toBe(true);
      });
    });
  });

  it("gives every group the full set of words it claims", () => {
    BEDROOM_GROUPS.forEach((group) => {
      expect(group.wordIds.length, `${group.id} is short`).toBe(5);
      expect(new Set(group.wordIds).size, `${group.id} repeats a word`).toBe(group.wordIds.length);
    });
  });

  it("has no duplicate word ids", () => {
    const ids = BEDROOM_VOCABULARY.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("assigns every word to a declared topic", () => {
    const topics = new Set(BEDROOM_TOPICS.map((t) => t.id));
    BEDROOM_VOCABULARY.forEach((w) => {
      expect(topics.has(w.topic), `${w.id} has unknown topic "${w.topic}"`).toBe(true);
    });
  });

  it("matches each topic's declared item count to reality", () => {
    BEDROOM_TOPICS.forEach((topic) => {
      const actual = BEDROOM_VOCABULARY.filter((w) => w.topic === topic.id).length;
      expect(actual, `${topic.id} declares ${topic.itemsCount}`).toBe(topic.itemsCount);
    });
  });

  it("gives every word a phonetic spelling", () => {
    BEDROOM_VOCABULARY.forEach((w) => {
      expect(w.phonetic, `${w.id} has no phonetic`).toBeTruthy();
    });
  });
});

describe("Assessment alt text is now answerable", () => {
  const lamp = BEDROOM_VOCABULARY.find((w) => w.id === "lamp")!;

  it("describes the picture without naming it", () => {
    const alt = getImageAltText(lamp, "assessment", 0, false);
    expect(alt).toContain("Picture option A");
    expect(alt).toContain(lamp.description);
    expect(alt.toLowerCase()).not.toContain("lamp");
  });

  it("carries enough information to tell options apart", () => {
    // The previous behaviour returned a bare "Picture option A", identical in
    // content for every option — safe, but impossible to answer from.
    const alts = BEDROOM_GROUPS[0].wordIds.map((id, i) => {
      const word = BEDROOM_VOCABULARY.find((w) => w.id === id)!;
      return getImageAltText(word, "assessment", i, false);
    });
    expect(new Set(alts).size).toBe(alts.length);
    alts.forEach((alt) => expect(alt.length).toBeGreaterThan(30));
  });

  it("adds the word once the option is chosen", () => {
    const alt = getImageAltText(lamp, "assessment", 0, true);
    expect(alt).toContain(lamp.label);
    expect(alt).toContain(lamp.description);
  });

  it("still names the word directly in learning mode", () => {
    expect(getImageAltText(lamp, "learning")).toBe(lamp.label);
  });
});
