import { describe, expect, it } from "vitest";
import { AUTHORED_LESSON_CONTENT } from "../exercises/content/authoredLessonContent";
import {
  auditCurriculumContent,
  authoredLessonContentSchema,
  buildAuthoredLessonRegistry,
  rawCurriculumLessonSchema,
} from "../exercises/content/curriculumContentPipeline";
import { buildSentenceCompletion, getRichSentence } from "../exercises/exerciseContent";
import { COURSE_UNITS, type VocabularyItem } from "../data/lessons";

const incompleteLesson = rawCurriculumLessonSchema.parse({
  stage_cefr: "A1",
  lesson_global_order: 1,
  lesson_id: "sample-1",
  lesson_name: "Sample 1",
  word_count: 4,
  words: ["One", "Two", "Three", "Four"].map((word, index) => ({
    order: index + 1,
    word,
    arabic: "عربي",
    cluster: 1,
    revised_usage_sentence: "",
    usage_function: "",
    key_collocation_or_pattern: "",
    grammar_or_form_focus: "",
    register_or_constraint: "",
    cefr_appropriacy: "",
    editorial_status: "not_revised",
  })),
  clusters: [
    {
      cluster_no: 1,
      target_words: ["One", "Two", "Three", "Four"],
      reading: {
        title: "",
        text: "",
        comprehension_or_retrieval_task: "",
        cefr_qa: "",
        editorial_status: "not_revised",
      },
    },
  ],
  lesson_qa: {
    word_examples_complete: false,
    cluster_readings_complete: false,
    media_adds_new_affordance: false,
    cefr_checked: false,
    recycling_checked: false,
    final_integration_checked: false,
    editorial_status: "not_revised",
  },
});

describe("curriculum content pipeline", () => {
  it("blocks incomplete external lessons instead of partially admitting them", () => {
    const report = auditCurriculumContent("1.0", 1, [incompleteLesson], [incompleteLesson]);

    expect(report.eligibleLessons).toBe(0);
    expect(report.blockedLessons).toBe(1);
    expect(report.missingUsageSentences).toBe(4);
    expect(report.missingClusterReadings).toBe(1);
    expect(report.issues.map((issue) => issue.code)).toEqual([
      "missing-enrichment",
      "qa-incomplete",
    ]);
  });

  it("keeps the approved pilot structurally valid and corrects the Arabic gloss for three", () => {
    const lesson = AUTHORED_LESSON_CONTENT["numbers-counting-1"];
    expect(authoredLessonContentSchema.safeParse(lesson).success).toBe(true);
    expect(lesson.words.find((word) => word.id === "three")?.arabic).toBe("ثلاثة");
    expect(lesson.clusters.every((cluster) => cluster.targetWordIds.length === 5)).toBe(true);
  });

  it("admits the complete Numbers & Counting unit with stable IDs and full cluster coverage", () => {
    const allLessons = Object.values(AUTHORED_LESSON_CONTENT);
    const numbersLessons = allLessons.filter((lesson) =>
      lesson.lessonId.startsWith("numbers-counting-")
    );

    expect(numbersLessons.map((lesson) => lesson.lessonId)).toEqual([
      "numbers-counting-1",
      "numbers-counting-2",
      "numbers-counting-3",
      "numbers-counting-4",
    ]);
    expect(numbersLessons.reduce((total, lesson) => total + lesson.words.length, 0)).toBe(50);
    expect(numbersLessons.reduce((total, lesson) => total + lesson.clusters.length, 0)).toBe(10);
    expect(
      AUTHORED_LESSON_CONTENT["numbers-counting-4"].words.find((word) => word.id === "divided-by")
        ?.arabic
    ).toBe("مقسوم على");

    const sourceGroups = COURSE_UNITS["numbers-counting"].groups;
    for (const lesson of numbersLessons) {
      expect(sourceGroups.find((group) => group.id === lesson.lessonId)?.wordIds).toEqual(
        lesson.words.map((word) => word.id)
      );
    }
  });

  it("admits the complete Colors unit with stable IDs, reviewed glosses, and full cluster coverage", () => {
    const allLessons = Object.values(AUTHORED_LESSON_CONTENT);
    const colorsLessons = allLessons.filter((lesson) => lesson.lessonId.startsWith("colors-"));

    expect(colorsLessons.map((lesson) => lesson.lessonId)).toEqual([
      "colors-1",
      "colors-2",
      "colors-3",
    ]);
    expect(colorsLessons.reduce((total, lesson) => total + lesson.words.length, 0)).toBe(40);
    expect(colorsLessons.reduce((total, lesson) => total + lesson.clusters.length, 0)).toBe(8);
    expect(
      colorsLessons.every((lesson) => authoredLessonContentSchema.safeParse(lesson).success)
    ).toBe(true);

    const sourceGroups = COURSE_UNITS["colors"].groups;
    for (const lesson of colorsLessons) {
      expect(sourceGroups.find((group) => group.id === lesson.lessonId)?.wordIds).toEqual(
        lesson.words.map((word) => word.id)
      );
    }

    const redWord = AUTHORED_LESSON_CONTENT["colors-1"].words.find((w) => w.id === "red");
    expect(redWord?.arabic).toBe("أحمر");
    expect(redWord?.sentence.full).toBe("The apple is red.");

    const rainbowWord = AUTHORED_LESSON_CONTENT["colors-3"].words.find((w) => w.id === "rainbow");
    expect(rainbowWord?.arabic).toBe("قوس قزح");
  });

  it("rejects duplicate lesson IDs and words assigned to more than one cluster", () => {
    const lesson = AUTHORED_LESSON_CONTENT["numbers-counting-1"];
    expect(() => buildAuthoredLessonRegistry([lesson, lesson])).toThrow(
      /Duplicate authored lesson ID/u
    );

    const invalidLesson = structuredClone(lesson);
    invalidLesson.clusters[1].targetWordIds[0] = "one";
    expect(authoredLessonContentSchema.safeParse(invalidLesson).success).toBe(false);
  });

  it("serves the authored sentence to the live sentence-building engine", () => {
    const threeWord = {
      id: "three",
      label: "Three",
      phonetic: "/θriː/",
      img: "/word-images/numbers-counting/three.avif",
      description: "Three red apples on a table.",
      topic: "numbers-counting",
    } satisfies VocabularyItem;

    expect(getRichSentence(threeWord)).toMatchObject({
      full: "She bought three apples.",
      words: ["She", "bought", "three", "apples"],
    });

    const blueWord = {
      id: "blue",
      label: "Blue",
      phonetic: "/bluː/",
      img: "/word-images/colors/blue.avif",
      description: "Clear blue sky above a field.",
      topic: "colors",
    } satisfies VocabularyItem;

    expect(getRichSentence(blueWord)).toMatchObject({
      full: "The sky is blue.",
      words: ["The", "sky", "is", "blue"],
    });
  });

  it("limits sentence construction to a useful two- or three-word phrase", () => {
    expect(
      buildSentenceCompletion("He wore a clean white shirt to Friday prayer.", "White")
    ).toMatchObject({
      blankStart: 3,
      answer: ["clean", "white", "shirt"],
    });

    const shortSentence = buildSentenceCompletion("This is blue.", "Blue");
    expect(shortSentence.answer).toEqual(["is", "blue"]);
    expect(shortSentence.answer.length).toBeLessThanOrEqual(3);
  });
});
