import { describe, expect, it } from "vitest";
import { BEDROOM_GROUPS, BEDROOM_VOCABULARY, COURSE_UNITS, type CourseUnit } from "../data/lessons";
import { loadAllUnitVocabulary } from "../data/vocabulary";
import { PLACEHOLDER_DESCRIPTION } from "../data/placeholderDescription";
import { getImageAltText } from "../shared/WordImage";

function normalized(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const units = Object.values(COURSE_UNITS);

// Vocabulary lives one chunk per unit now, so a suite that checks every word
// in the course loads them all up front instead of reading them off the
// catalogue object.
const unitWords = await loadAllUnitVocabulary();
const wordsOf = (unit: CourseUnit) => unitWords.get(unit.id) ?? [];
const vocabulary = units.flatMap(wordsOf);

describe("Vocabulary descriptions", () => {
  it("loads the reviewed unit-scoped bilingual catalogue without unsafe rows", () => {
    const translated = vocabulary.filter((word) => word.arabicTranslation);
    const examples = vocabulary.filter((word) => word.exampleUsage);

    expect(translated).toHaveLength(7180);
    expect(examples).toHaveLength(2963);
    translated.forEach((word) => {
      expect(word.arabicTranslation, `${word.topic}/${word.id} has a non-Arabic gloss`).toMatch(
        /[؀-ۿ]/
      );
    });
    examples.forEach((word) => {
      expect(
        word.description,
        `${word.topic}/${word.id} retained generic catalogue copy`
      ).not.toMatch(/^A term used in the .+ context\.$/i);
      expect(
        word.exampleUsage,
        `${word.topic}/${word.id} retained a generic catalogue example`
      ).not.toMatch(/^The term .+ was used in the .+ lesson\.$/i);
    });

    const library = new Map((unitWords.get("library") ?? []).map((word) => [word.id, word]));
    expect(library.get("novel")?.arabicTranslation).toBe("رواية");
    expect(library.get("author")?.description).toBe(
      "A person who writes a book, story, or other written work."
    );
    expect(library.get("cart")?.description).toContain("move books");
    expect(library.get("borrowing")?.arabicTranslation).toBe("استعارة الكتب");
    expect(
      unitWords.get("freelancing-remote-work")?.find((word) => word.id === "1099")
        ?.arabicTranslation
    ).toBe("");
    expect(unitWords.get("fruits")?.find((word) => word.id === "banana")?.arabicTranslation).toBe(
      "موز"
    );
    expect(unitWords.get("fruits")?.find((word) => word.id === "cherry")?.description).toContain(
      "fruit"
    );
    expect(
      unitWords.get("vegetables")?.find((word) => word.id === "cucumber")?.arabicTranslation
    ).toBe("خيار");
    expect(
      unitWords.get("days-months")?.find((word) => word.id === "appointment")?.description
    ).toContain("planned meeting");
    expect(unitWords.get("days-months")?.find((word) => word.id === "schedule")?.description).toBe(
      "A plan that shows when activities or events will happen."
    );
    expect(unitWords.get("vegetables")?.find((word) => word.id === "ginger")?.exampleUsage).toBe(
      "She grated fresh ginger into the soup."
    );

    const correctedFruitImages = [
      "lemon",
      "lime",
      "grapefruit",
      "tangerine",
      "mandarin",
      "clementine",
      "kumquat",
      "blood-orange",
      "yuzu",
      "cherry",
      "apricot",
      "date",
      "fig",
      "olive",
      "avocado",
      "persimmon",
      "pomegranate",
    ];
    correctedFruitImages.forEach((id) => {
      expect(unitWords.get("fruits")?.find((word) => word.id === id)?.img).toBe(
        `/word-images/fruits/${id}-reviewed.avif`
      );
    });

    for (const [unitId, reviewedCount] of [
      ["fruits", 50],
      ["vegetables", 60],
      ["days-months", 49],
    ] as const) {
      const reviewed = (unitWords.get(unitId) ?? []).filter(
        (word) => word.arabicTranslation !== undefined
      );
      expect(reviewed, `${unitId} catalogue coverage`).toHaveLength(reviewedCount);
      reviewed.forEach((word) => {
        expect(word.arabicTranslation, `${unitId}/${word.id} missing Arabic`).toBeTruthy();
        expect(word.description, `${unitId}/${word.id} missing definition`).not.toBe(
          PLACEHOLDER_DESCRIPTION
        );
      });
    }
  }, 60000);

  it("validates every completed editorial description", () => {
    vocabulary
      .filter((word) => word.description !== PLACEHOLDER_DESCRIPTION)
      .forEach((word) => {
        expect(word.description, `${word.id} has no description`).toBeTruthy();
        expect(word.description, `${word.id} contains placeholder copy`).not.toMatch(
          /needs manual|undefined|^this refers to the .+ used in this context\.$/i
        );
        expect(word.description.length, `${word.id} too short`).toBeGreaterThan(25);
        expect(word.description.length, `${word.id} too long to listen to`).toBeLessThan(350);
        expect(word.description, `${word.id} should end with a period`).toMatch(/\.$/);
        expect(word.description[0], `${word.id} should start capitalised`).toBe(
          word.description[0].toUpperCase()
        );
      });
  }, 60000);

  it("tracks placeholder debt and prevents it from increasing", () => {
    const placeholders = vocabulary.filter((word) => word.description === PLACEHOLDER_DESCRIPTION);
    expect(placeholders.length, "Vocabulary placeholder debt increased").toBeLessThanOrEqual(10333);
    expect(
      placeholders.filter((word) =>
        [
          "bathroom",
          "kitchen",
          "living-room",
          "farm",
          "garden",
          "park",
          "playground",
          "classroom",
          "bakery",
          "amusement-park",
          "camping-site",
          "construction-site",
          "weather-station",
          "art-studio",
          "computer-lab",
          "newspaper-office",
          "tv-studio",
        ].includes(word.topic)
      ),
      "Completed unit definitions must not regress to placeholders"
    ).toHaveLength(0);
  });

  it("ensures vocabulary items have valid learning descriptions", () => {
    const invalid = vocabulary.filter((w) => !w.description);
    expect(invalid.length, `${invalid.map((w) => w.id).join(", ")} missing description`).toBe(0);
  }, 60000);

  it("provides descriptions for all words in each learning group", () => {
    units.forEach((unit) => {
      unit.groups.forEach((group) => {
        const descriptions = group.wordIds.map(
          (id) => wordsOf(unit).find((word) => word.id === id)?.description
        );
        expect(descriptions.every(Boolean), `${unit.id}/${group.id} missing descriptions`).toBe(
          true
        );
      });
    });
  }, 60000);
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
          const word = wordsOf(unit).find((item) => item.id === wordId);
          expect(word, `${unit.id}/${group.id} references missing word ${wordId}`).toBeDefined();
          expect(story, `${unit.id}/${group.id} story omits ${word?.label}`).toContain(
            normalized(word?.label ?? "")
          );
        });
      });
    });
  }, 30000);
});

describe("Lesson data integrity", () => {
  it("keeps every group inside its owning unit", () => {
    units.forEach((unit) => {
      const ids = new Set(wordsOf(unit).map((word) => word.id));
      unit.groups.forEach((group) => {
        group.wordIds.forEach((wordId) => {
          expect(
            ids.has(wordId),
            `${unit.id}/${group.id} references missing word "${wordId}"`
          ).toBe(true);
        });
      });
    });
  }, 30000);

  it("keeps learning groups short and free of duplicate words", () => {
    units.forEach((unit) => {
      unit.groups.forEach((group) => {
        expect(group.wordIds.length, `${unit.id}/${group.id} is empty`).toBeGreaterThanOrEqual(1);
        expect(group.wordIds.length, `${unit.id}/${group.id} is too long`).toBeLessThanOrEqual(20);
        expect(new Set(group.wordIds).size, `${unit.id}/${group.id} repeats a word`).toBe(
          group.wordIds.length
        );
      });
    });
  }, 30000);

  it("has no duplicate word ids within a unit", () => {
    units.forEach((unit) => {
      const ids = wordsOf(unit).map((word) => word.id);
      expect(new Set(ids).size, `${unit.id} repeats a word id`).toBe(ids.length);
    });
  }, 30000);

  it("assigns every word to a declared topic or unit", () => {
    units.forEach((unit) => {
      const topics = new Set([...unit.topics.map((topic) => topic.id), unit.id]);
      wordsOf(unit).forEach((word) => {
        expect(
          topics.has(word.topic),
          `${unit.id}/${word.id} has unknown topic "${word.topic}"`
        ).toBe(true);
      });
    });
  }, 30000);

  it("gives every word a phonetic spelling", () => {
    vocabulary.forEach((word) => expect(word.phonetic, `${word.id} has no phonetic`).toBeTruthy());
  }, 30000);
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
