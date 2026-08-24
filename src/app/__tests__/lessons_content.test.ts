import { describe, expect, it } from "vitest";
import { BEDROOM_GROUPS, BEDROOM_VOCABULARY, COURSE_UNITS } from "../data/lessons";
import { getImageAltText } from "../shared/WordImage";

function normalized(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const units = Object.values(COURSE_UNITS);
const vocabulary = units.flatMap((unit) => unit.vocabulary);

describe("Vocabulary descriptions", () => {
  it("gives every word a useful description", () => {
    vocabulary.forEach((word) => {
      expect(word.description, `${word.id} has no description`).toBeTruthy();
      expect(word.description, `${word.id} contains placeholder copy`).not.toMatch(
        /known as|needs manual|undefined/i
      );
      expect(word.description.length, `${word.id} too short`).toBeGreaterThan(25);
      expect(word.description.length, `${word.id} too long to listen to`).toBeLessThan(350);
      expect(word.description, `${word.id} should end with a period`).toMatch(/\.$/);
      expect(word.description[0], `${word.id} should start capitalised`).toBe(
        word.description[0].toUpperCase()
      );
    });
  });

  it("ensures vocabulary items have valid learning descriptions", () => {
    vocabulary.forEach((word) => {
      expect(word.description).toBeTruthy();
    });
  });

  it("provides descriptions for all words in each learning group", () => {
    units.forEach((unit) => {
      unit.groups.forEach((group) => {
        const descriptions = group.wordIds.map(
          (id) => unit.vocabulary.find((word) => word.id === id)?.description
        );
        expect(descriptions.every(Boolean), `${unit.id}/${group.id} missing descriptions`).toBe(
          true
        );
      });
    });
  });
});

describe("Lesson story integrity", () => {
  it("provides natural copy with every assigned word", () => {
    units.forEach((unit) => {
      unit.groups.forEach((group) => {
        expect(group.story, `${unit.id}/${group.id} has no story`).toBeTruthy();
        expect(group.story, `${unit.id}/${group.id} contains generated placeholders`).not.toMatch(
          /undefined|we learned about some very useful things/i
        );

        const story = normalized(group.story ?? "");
        group.wordIds.forEach((wordId) => {
          const word = unit.vocabulary.find((item) => item.id === wordId);
          expect(word, `${unit.id}/${group.id} references missing word ${wordId}`).toBeDefined();
          expect(story, `${unit.id}/${group.id} story omits ${word?.label}`).toContain(
            normalized(word?.label ?? "")
          );
        });
      });
    });
  });
});

describe("Lesson data integrity", () => {
  it("keeps every group inside its owning unit", () => {
    units.forEach((unit) => {
      const ids = new Set(unit.vocabulary.map((word) => word.id));
      unit.groups.forEach((group) => {
        group.wordIds.forEach((wordId) => {
          expect(
            ids.has(wordId),
            `${unit.id}/${group.id} references missing word "${wordId}"`
          ).toBe(true);
        });
      });
    });
  });

  it("keeps learning groups short and free of duplicate words", () => {
    units.forEach((unit) => {
      unit.groups.forEach((group) => {
        expect(group.wordIds.length, `${unit.id}/${group.id} is empty`).toBeGreaterThanOrEqual(1);
        expect(group.wordIds.length, `${unit.id}/${group.id} is too long`).toBeLessThanOrEqual(15);
        expect(new Set(group.wordIds).size, `${unit.id}/${group.id} repeats a word`).toBe(
          group.wordIds.length
        );
      });
    });
  });

  it("has no duplicate word ids within a unit", () => {
    units.forEach((unit) => {
      const ids = unit.vocabulary.map((word) => word.id);
      expect(new Set(ids).size, `${unit.id} repeats a word id`).toBe(ids.length);
    });
  });

  it("assigns every word to a declared topic or unit", () => {
    units.forEach((unit) => {
      const topics = new Set([...unit.topics.map((topic) => topic.id), unit.id]);
      unit.vocabulary.forEach((word) => {
        expect(
          topics.has(word.topic),
          `${unit.id}/${word.id} has unknown topic "${word.topic}"`
        ).toBe(true);
      });
    });
  });

  it("gives every word a phonetic spelling", () => {
    vocabulary.forEach((word) => expect(word.phonetic, `${word.id} has no phonetic`).toBeTruthy());
  });
});

describe("Assessment alt text is answerable", () => {
  const lamp = BEDROOM_VOCABULARY.find((word) => word.id === "lamp")!;

  it("describes the picture without naming it", () => {
    const alt = getImageAltText(lamp, "assessment", 0, false);
    expect(alt).toContain("Picture option A");
    expect(alt).toContain(lamp.description);
    expect(alt.toLowerCase()).not.toContain("lamp");
  });

  it("carries enough information to tell options apart", () => {
    const alts = BEDROOM_GROUPS[0].wordIds.map((id, index) => {
      const word = BEDROOM_VOCABULARY.find((item) => item.id === id)!;
      return getImageAltText(word, "assessment", index, false);
    });
    expect(new Set(alts).size).toBe(alts.length);
    alts.forEach((alt) => expect(alt.length).toBeGreaterThan(30));
  });

  it("adds the word once the option is chosen", () => {
    const alt = getImageAltText(lamp, "assessment", 0, true);
    expect(alt).toContain(lamp.label);
    expect(alt).toContain(lamp.description);
  });

  it("names the word directly in learning mode", () => {
    expect(getImageAltText(lamp, "learning")).toBe(lamp.label);
  });
});
