import { describe, expect, it } from "vitest";
import { generateCurriculum, MAX_ACTIVE_WORDS_PER_LESSON } from "../learning/study/curriculum";
import { getUnitCurriculumDesign } from "../learning/curriculumModel";
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
  it("chunks active vocabulary and preserves every word exactly once", () => {
    const nodes = generateCurriculum(materials, unit);
    const vocabularyNodes = nodes.filter((node) => node.type === "vocabulary");
    expect(
      vocabularyNodes.every((node) => (node.wordIds?.length ?? 0) <= MAX_ACTIVE_WORDS_PER_LESSON)
    ).toBe(true);
    expect(vocabularyNodes.flatMap((node) => node.wordIds ?? [])).toEqual(unit.wordIds);
    expect(vocabularyNodes[0].id).toBe("learn-essential");
  });

  it("keeps above-level reading optional instead of blocking the A1 path", () => {
    const reading = generateCurriculum(materials, unit).find((node) => node.id === "use-reading");
    expect(reading?.isCore).toBe(false);
    expect(reading?.title).toContain("B1");
  });

  it("publishes explicit CEFR, GSE, can-do and final-task metadata", () => {
    const design = getUnitCurriculumDesign(unit, materials);
    expect(design.cefr).toBe("A1");
    expect(design.gseRange).toEqual([22, 29]);
    expect(design.canDo.length).toBeGreaterThanOrEqual(3);
    expect(design.finalTask).not.toBe("");
  });
});

describe("lesson and assessment progression", () => {
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
