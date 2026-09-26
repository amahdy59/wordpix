import { describe, expect, it } from "vitest";
import { generateCurriculum, MAX_ACTIVE_WORDS_PER_LESSON } from "../learning/study/curriculum";
import { FOUNDATION_UNIT_DESIGNS, getUnitCurriculumDesign } from "../learning/curriculumModel";
import { FOUNDATION_SEQUENCE } from "../data/curriculumSequence";
import { recommendPathUnit } from "../learning/recommendPathUnit";
import { COURSE_MODULES, COURSE_UNITS, LEARNING_PATH_UNIT_IDS } from "../data/lessons";
import { loadLearningMaterials } from "../learning/registry";
import { buildUnitAssessmentSample, ASSESSMENT_PASS_PERCENT } from "../lesson/assessmentBlueprint";
import {
  getLessonSequence,
  getStoryStepIndex,
  selectPracticeWordQueue,
} from "../lesson/lessonSequence";
import { initialStudyProgress, syncStudyProgressWithWordMemory } from "../learning/study/progress";
import { createInitialWordState } from "../../features/gamification/sm2";
import type { CourseUnit, Lesson } from "../data/lessons";
import type { UnitLearningMaterials } from "../learning/types";
import { getStartingUnitForLevel, recommendPlacement } from "../onboarding/placementRecommendation";
import { emitLearningEvent, LEARNING_ANALYTICS_EVENT } from "../analytics/learningAnalytics";

const groups: Lesson[] = [
  { id: "g1", name: "Objects", description: "", topicId: "objects", wordIds: ["a", "b", "c"] },
  { id: "g2", name: "Actions", description: "", topicId: "actions", wordIds: ["d", "e", "f"] },
  { id: "g3", name: "Problems", description: "", topicId: "problems", wordIds: ["g", "h", "i"] },
];

const unit: CourseUnit = {
  id: "bedroom",
  name: "Bedroom",
  description: "",
  topics: [],
  groups,
  wordIds: groups.flatMap((group) => group.wordIds),
};

const materials: UnitLearningMaterials = {
  unitId: "bedroom",
  priorityTiers: {
    essential: ["a", "b", "c", "d", "e", "f", "g", "h", "i"],
    important: [],
    goodToKnow: [],
  },
  subtopics: [{ id: "objects", title: "Objects", wordIds: unit.wordIds }],
  passage: { title: "An advanced room", level: "B1", text: "", questions: [] },
  phrases: [],
  dialogue: { title: "Finding things", lines: [{ speaker: "A", text: "Where is it?" }] },
  blankExercises: [{ id: "blank", sentence: "It is ____ the bed.", answer: "under" }],
};

describe("action-oriented curriculum", () => {
  it("retains every unit word exactly once in manageable sessions", async () => {
    for (const unit of Object.values(COURSE_UNITS)) {
      const content = await loadLearningMaterials(unit.id);
      expect(content).toBeDefined();
      const vocabulary = generateCurriculum(content!, unit).filter(
        (node) => node.type === "vocabulary"
      );
      expect(vocabulary.every((node) => (node.wordIds?.length ?? 0) <= 8)).toBe(true);
      expect(new Set(vocabulary.flatMap((node) => node.wordIds ?? []))).toEqual(
        new Set(unit.wordIds)
      );
    }
  });
  it("shows every general English catalogue unit after the foundation sequence", () => {
    const catalogueIds = COURSE_MODULES.filter((module) => !module.isSpecialSection).flatMap(
      (module) => module.unitIds
    );
    // All 18 original foundation units must be present in the first CEFR stage
    // (first 58 units of the path — Pre-A1 + A1). They are no longer required to
    // appear in the old 18-unit block order; CURRICULUM_SEQUENCE is the canonical
    // pedagogical ordering and the foundation units are distributed across Stage 1.
    const earlyPathIds = new Set(LEARNING_PATH_UNIT_IDS.slice(0, 58));
    for (const id of FOUNDATION_SEQUENCE) {
      expect(
        earlyPathIds.has(id),
        `Foundation unit "${id}" must appear in first 58 path units`
      ).toBe(true);
    }
    // Full catalogue coverage is unchanged.
    expect(new Set(LEARNING_PATH_UNIT_IDS)).toEqual(new Set(catalogueIds));
  });
  it("chunks active vocabulary and preserves every word exactly once", () => {
    const nodes = generateCurriculum(materials, unit);
    const vocabularyNodes = nodes.filter((node) => node.type === "vocabulary");
    expect(
      vocabularyNodes.every((node) => (node.wordIds?.length ?? 0) <= MAX_ACTIVE_WORDS_PER_LESSON)
    ).toBe(true);
    expect(vocabularyNodes.flatMap((node) => node.wordIds ?? [])).toEqual(unit.wordIds);
    expect(vocabularyNodes[0].id).toBe("learn-essential");
  });

  it("uses authored frequency ratings to keep lower-frequency words optional", () => {
    const withFrequency: UnitLearningMaterials = {
      ...materials,
      priorityTiers: undefined,
      wordMeta: [
        { word: "a", frequency: 3, partOfSpeech: "n", collocations: [] },
        { word: "b", frequency: 2, partOfSpeech: "n", collocations: [] },
        { word: "c", frequency: 1, partOfSpeech: "n", collocations: [] },
      ],
    };
    const vocabulary = generateCurriculum(withFrequency, unit).filter(
      (node) => node.type === "vocabulary"
    );
    expect(vocabulary.flatMap((node) => node.wordIds)).toHaveLength(unit.wordIds.length);
    expect(vocabulary.find((node) => node.wordIds?.includes("a"))?.id).toBe("learn-objects");
    expect(vocabulary.find((node) => node.wordIds?.includes("c"))?.isCore).toBe(false);
  });

  it("preserves authored foundation order ahead of inferred frequency", async () => {
    const numbers = COURSE_UNITS["numbers-counting"];
    const content = await loadLearningMaterials(numbers.id);
    const vocabulary = generateCurriculum(content!, numbers).filter(
      (node) => node.type === "vocabulary"
    );

    expect(vocabulary[0].wordIds).toEqual([
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
    ]);
    expect(vocabulary.findIndex((node) => node.wordIds?.includes("million"))).toBeGreaterThan(0);
  });

  it("keeps above-level reading optional instead of blocking the A1 path", () => {
    const reading = generateCurriculum(materials, unit).find((node) => node.id === "use-reading");
    expect(reading?.isCore).toBe(false);
    expect(reading?.title).toContain("B1");
  });

  it("publishes explicit CEFR, GSE, can-do and final-task metadata", () => {
    const design = getUnitCurriculumDesign(unit, materials);
    expect(design.cefr).toBe("A1");
    expect(design.reviewStatus).toBe("authored");
    expect(design.gseRange).toEqual([22, 29]);
    expect(design.canDo.length).toBeGreaterThanOrEqual(3);
    expect(design.finalTask).not.toBe("");
  });

  it("identifies template-based units as provisional", () => {
    expect(getUnitCurriculumDesign({ ...unit, id: "airport", name: "Airport" }).reviewStatus).toBe(
      "provisional"
    );
  });

  it("gives every foundation unit an authored communicative outcome and final task", () => {
    expect(Object.keys(FOUNDATION_UNIT_DESIGNS).sort()).toEqual([...FOUNDATION_SEQUENCE].sort());
    for (const design of Object.values(FOUNDATION_UNIT_DESIGNS)) {
      expect(design.canDo).toHaveLength(3);
      expect(design.languageFunctions.length).toBeGreaterThanOrEqual(3);
      expect(design.grammarFocus.length).toBeGreaterThanOrEqual(3);
      expect(design.finalTask).toMatch(/[.!]$/);
    }
  });
});

describe("lesson and assessment progression", () => {
  it("keeps placement as the entry point after the learner starts practising", () => {
    const placed = { ...unit, id: "supermarket", wordIds: ["a"] };
    const later = { ...unit, id: "airport", wordIds: ["b"] };
    const learning = { ...createInitialWordState("a"), mastery: "learning" as const };
    expect(recommendPathUnit([unit, placed, later], "supermarket", { a: learning })?.id).toBe(
      "supermarket"
    );
    expect(
      recommendPathUnit([unit, placed, later], "supermarket", {
        a: { ...learning, mastery: "familiar" },
      })?.id
    ).toBe("airport");
  });
  it("recommends a recoverable starting point without awarding mastery", () => {
    expect(recommendPlacement(0)).toEqual({
      level: "A1",
      startingUnitId: "numbers-counting",
      correctCount: 0,
      totalQuestions: 3,
    });
    expect(recommendPlacement(2).startingUnitId).toBe("supermarket");
    expect(recommendPlacement(3).startingUnitId).toBe("business-communication");
    expect(getStartingUnitForLevel("A1")).toBe("numbers-counting");
    expect(getStartingUnitForLevel("A2")).toBe("supermarket");
    expect(getStartingUnitForLevel("B1")).toBe("business-communication");
  });

  it("emits a versioned, ephemeral placement event", () => {
    let detail: unknown;
    window.addEventListener(
      LEARNING_ANALYTICS_EVENT,
      ((event: CustomEvent) => {
        detail = event.detail;
      }) as EventListener,
      { once: true }
    );
    emitLearningEvent(
      {
        name: "placement_completed",
        properties: { recommendedLevel: "A1", scoreBand: "emerging" },
      },
      new Date("2026-09-19T00:00:00.000Z")
    );
    expect(detail).toEqual({
      version: 1,
      occurredAt: "2026-09-19T00:00:00.000Z",
      event: {
        name: "placement_completed",
        properties: { recommendedLevel: "A1", scoreBand: "emerging" },
      },
    });
  });

  it("keeps the displayed story jump aligned with the actual beginner route", () => {
    expect(getLessonSequence("A1")).toEqual(["listen", "recall", "fill", "quiz", "story"]);
    expect(getStoryStepIndex("A1")).toBe(4);
    expect(getStoryStepIndex("B1")).toBe(5);
    expect(getStoryStepIndex("A1", false)).toBe(3);
  });

  it("prioritises new and due words in an eight-item practice set", () => {
    const strong = {
      ...createInitialWordState("a"),
      exposures: 3,
      mastery: "strong" as const,
      nextReviewAt: "2099-01-01T00:00:00.000Z",
    };
    const due = {
      ...createInitialWordState("b"),
      exposures: 2,
      mastery: "familiar" as const,
      nextReviewAt: "2020-01-01T00:00:00.000Z",
    };
    expect(
      selectPracticeWordQueue(["a", "b", "c"], { a: strong, b: due }, 2, new Date("2026-01-01"))
    ).toEqual(["c", "b"]);
  });

  it("samples every group before taking a second item from any group", () => {
    expect(buildUnitAssessmentSample(groups, 5)).toEqual(["a", "d", "g", "b", "e"]);
    expect(ASSESSMENT_PASS_PERCENT).toBe(80);
  });
});

describe("canonical mastery projection", () => {
  it("projects SM-2 mastery and due dates into the study path", () => {
    const familiar = {
      ...createInitialWordState("a"),
      exposures: 2,
      mastery: "familiar" as const,
      nextReviewAt: "2099-01-01T00:00:00.000Z",
    };
    const due = {
      ...createInitialWordState("b"),
      exposures: 2,
      mastery: "learning" as const,
      nextReviewAt: "2020-01-01T00:00:00.000Z",
    };
    const synced = syncStudyProgressWithWordMemory(
      initialStudyProgress("bedroom"),
      { a: familiar, b: due },
      ["a", "b"],
      new Date("2026-01-01")
    );
    expect(synced.wordStatus.a).toBe("comfortable");
    expect(synced.wordStatus.b).toBe("review");
    expect(synced.reviewWordIds).toContain("b");
  });
});
