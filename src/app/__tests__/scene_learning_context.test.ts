import { describe, expect, it } from "vitest";
import {
  applyLessonLearningContexts,
  applySceneLearningContext,
} from "../data/sceneLearningContext.mjs";
import { loadUnitUsage, loadUnitUsageForEditorial } from "../data/usageRegistry";
import type { UsageSceneChunk, LessonUsageData } from "../data/usageTypes";
import { loadBilingualUnit } from "../data/bilingualCatalogue.generated";

const scene: UsageSceneChunk = {
  chunkNumber: 1,
  targetWords: ["Blouse", "Shirt"],
  scenario: "Omar notices a blouse and considers a shirt.",
  check: {
    question: "What does Omar notice first?",
    options: ["Blouse", "Shirt"],
    expectedAnswer: "Blouse",
  },
  imageBrief: "Original reference brief.",
  imagePath: "existing/read-only-reference.webp",
  imageAlt: "A blouse on a hanger.",
  learningContext: {
    sourceScenario: "Omar notices a blouse and considers a shirt.",
    sourceQuestion: "What does Omar notice first?",
    sourceAnswer: "Blouse",
    scenario: "Omar buys a blouse as a gift for his sister and a shirt for himself.",
    question: "Which item is the gift?",
    imageBrief: "One blouse on a hanger. Written context supplies the gift relationship.",
  },
};
describe("written task repairs with preserved media evidence", () => {
  it("loads the newly authored construction dictionary and the medicine sense of tablet", async () => {
    const construction = await loadBilingualUnit("construction-site");
    const pharmacy = await loadBilingualUnit("pharmacy");
    expect(Object.keys(construction).length).toBeGreaterThan(60);
    expect(pharmacy.tablet.definition).toContain("medicine");
    expect(pharmacy.tablet.arabicTranslation).toBe("قرص دوائي");
  });
  it("preserves source, media URL, literal alternative and answer while changing the written task", () => {
    const before = structuredClone(scene);
    const revised = applySceneLearningContext(scene);
    expect(scene).toEqual(before);
    expect(revised.scenario).toBe(scene.learningContext?.scenario);
    expect(revised.check.question).toBe("Which item is the gift?");
    expect(revised.check.expectedAnswer).toBe(scene.check.expectedAnswer);
    expect(revised.imagePath).toBe(scene.imagePath);
    expect(revised.imageAlt).toBe(scene.imageAlt);
    expect(revised.imagePurpose).toBe("word-reference");
    expect(applySceneLearningContext(revised)).toBe(revised);
  });
  it("fails closed after any preserved source field changes", () => {
    for (const edited of [
      { ...scene, scenario: "Another situation." },
      { ...scene, check: { ...scene.check, question: "Another question?" } },
      { ...scene, check: { ...scene.check, expectedAnswer: "Shirt" } },
    ])
      expect(applySceneLearningContext(edited)).toBe(edited);
  });
  it("updates the corresponding self-contained exercise without changing unrelated work", () => {
    const lesson = {
      usage: { scenes: [scene] },
      exercises: [
        { contextTag: "scene-1", prompt: "Old exercise.", answer: "Blouse" },
        { contextTag: "reading-gist", prompt: "Read the passage.", answer: "Gift shopping." },
      ],
    } as unknown as LessonUsageData;
    const revised = applyLessonLearningContexts(lesson);
    expect(revised.exercises[0].prompt).toBe(
      `${scene.learningContext?.scenario}\nWhich item is the gift?`
    );
    expect(revised.exercises[1]).toEqual(lesson.exercises[1]);
  });
  it("keeps editorial media evidence intact but delivers the repaired learner question", async () => {
    const raw = (await loadUnitUsageForEditorial("everyday-clothing"))?.[0];
    const learner = (await loadUnitUsage("everyday-clothing"))?.[0];
    expect(raw?.usage.scenes[0].check.question).toContain("notice first");
    expect(learner?.usage.scenes[0].check.question).toBe(
      "Which item does Omar buy for his sister?"
    );
    expect(learner?.usage.scenes[0].imagePath).toBe(raw?.usage.scenes[0].imagePath);
    expect(learner?.exercises[0].prompt).toContain("gift for his sister");
  });
});
