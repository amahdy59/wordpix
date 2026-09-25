import { describe, it, expect } from "vitest";
import {
  BUSINESS_UNITS,
  getBusinessUnit,
  getBusinessUnitsByCefr,
  getBusinessSections,
} from "../learning/business/businessCatalog";
import {
  businessUnitSchema,
  BUSINESS_CEFR_LEVELS,
  BUSINESS_STAGE_IDS,
} from "../learning/business/businessTypes";
import {
  checkpointBusinessUnit,
  completeBusinessUnit,
  canCompleteBusinessUnit,
  saveBusinessReflection,
  saveBusinessChecklist,
  saveBusinessConfidence,
  type BusinessProgress,
} from "../learning/business/businessProgress";
import { hashToRoute, screenToHash } from "../router/useHashRouter";

describe("Beyond Business English (B1–C2) Curriculum", () => {
  it("contains exactly 40 units across 4 CEFR sections", () => {
    expect(BUSINESS_UNITS).toHaveLength(40);
    expect(getBusinessUnitsByCefr("B1")).toHaveLength(10);
    expect(getBusinessUnitsByCefr("B2")).toHaveLength(10);
    expect(getBusinessUnitsByCefr("C1")).toHaveLength(10);
    expect(getBusinessUnitsByCefr("C2")).toHaveLength(10);
  });

  it("assigns sequential unit numbers 1 through 40 with stable IDs", () => {
    BUSINESS_UNITS.forEach((unit, idx) => {
      const expectedNumber = idx + 1;
      const expectedId = `unit-${String(expectedNumber).padStart(2, "0")}`;
      expect(unit.unitNumber).toBe(expectedNumber);
      expect(unit.id).toBe(expectedId);
    });
  });

  it("validates every unit against the strict businessUnitSchema", () => {
    BUSINESS_UNITS.forEach((unit) => {
      const result = businessUnitSchema.safeParse(unit);
      if (!result.success) {
        console.error(`Unit validation error in ${unit.id}:`, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  });

  it("verifies locked 8-stage pedagogical structure in every unit", () => {
    BUSINESS_UNITS.forEach((unit) => {
      // 1. Warm-up
      expect(unit.essentialQuestion).toBeTruthy();
      expect(typeof unit.warmup.instructions).toBe("string");
      expect(Array.isArray(unit.warmup.prompts)).toBe(true);

      // 2. Workplace Input
      expect(unit.mainInput.title).toBeTruthy();
      expect(typeof unit.mainInput.context).toBe("string");
      expect(Array.isArray(unit.mainInput.dialogue)).toBe(true);

      // 3. Language Bank (vocabulary items)
      expect(unit.languageBank.length).toBeGreaterThanOrEqual(15);
      unit.languageBank.forEach((item) => {
        expect(item.term).toBeTruthy();
        expect(item.definition).toBeTruthy();
        expect(item.example).toBeTruthy();
        expect(item.imageSrc).toMatch(
          new RegExp(`^/business/v1/images/unit-${String(unit.unitNumber).padStart(2, "0")}/vocab-`)
        );
      });

      // 4. Usage Focus
      expect(unit.usageFocus.title).toBeTruthy();
      expect(typeof unit.usageFocus.description).toBe("string");
      expect(Array.isArray(unit.usageFocus.details)).toBe(true);

      // 5. Targeted Drills
      expect(Array.isArray(unit.exercises)).toBe(true);
      unit.exercises.forEach((ex) => {
        expect(["A", "B", "C"]).toContain(ex.correctAnswer);
        expect(ex.options.length).toBeGreaterThanOrEqual(2);
      });

      // 6. Discussion
      expect(Array.isArray(unit.discussion.prompts)).toBe(true);

      // 7. Executive Speaking Simulation
      expect(unit.speakingTask.title).toBeTruthy();
      expect(unit.speakingTask.rule).toBeTruthy();
      expect(Array.isArray(unit.speakingTask.steps)).toBe(true);
      expect(unit.speakingTask.checklist.length).toBeGreaterThanOrEqual(1);

      // 8. Review & Recycling
      expect(Array.isArray(unit.review.recycledPoints)).toBe(true);
      expect(unit.review.spacedRepetitionPrompt).toBeTruthy();
    });
  });

  it("retrieves individual units and sections via helpers", () => {
    const unit1 = getBusinessUnit("unit-01");
    expect(unit1).toBeDefined();
    expect(unit1?.title).toBe("Introducing Yourself Professionally");
    expect(unit1?.level).toBe("B1");

    const unit40 = getBusinessUnit("unit-40");
    expect(unit40).toBeDefined();
    expect(unit40?.title).toBe("Executive Capstone The Company At A Crossroads");
    expect(unit40?.level).toBe("C2");

    expect(getBusinessUnit("non-existent")).toBeUndefined();

    const sections = getBusinessSections();
    expect(sections.length).toBeGreaterThanOrEqual(4);
  });

  it("exports valid stage identifiers and CEFR levels", () => {
    expect(BUSINESS_STAGE_IDS).toEqual([
      "recall",
      "warmup",
      "input",
      "vocabulary",
      "usage",
      "exercises",
      "discussion",
      "speaking",
      "review",
    ]);
    expect(BUSINESS_CEFR_LEVELS).toEqual(["B1", "B2", "C1", "C2"]);
  });

  it("configures spaced repetition recall for units 02 through 40", () => {
    // Unit 01 is the initial unit, so it has no preceding unit to recall
    expect(BUSINESS_UNITS[0].recall).toBeUndefined();

    // Units 02 to 40 have spaced recall referencing previous unit language
    for (let i = 1; i < BUSINESS_UNITS.length; i++) {
      const unit = BUSINESS_UNITS[i];
      expect(unit.recall).toBeDefined();
      expect(unit.recall?.sourceUnitNumber).toBe(unit.unitNumber - 1);
      expect(unit.recall?.prompts.length).toBeGreaterThanOrEqual(3);
      unit.recall?.prompts.forEach((prompt) => {
        expect(prompt.id).toBeTruthy();
        expect(prompt.question).toBeTruthy();
        expect(prompt.targetWord).toBeTruthy();
        expect(prompt.promptTypeLabel).toBeTruthy();
      });
    }
  });

  it("verifies all 40 units have valid hero images and R2 image assets", () => {
    BUSINESS_UNITS.forEach((unit) => {
      expect(unit.heroImageSrc).toMatch(
        new RegExp(
          `^/business/v1/heroes/unit-${String(unit.unitNumber).padStart(2, "0")}-hero\\.webp$`
        )
      );
      unit.languageBank.forEach((vocab) => {
        expect(vocab.imageSrc).toMatch(
          new RegExp(`^/business/v1/images/unit-${String(unit.unitNumber).padStart(2, "0")}/vocab-`)
        );
      });
    });
  });

  it("correctly manages unit progress state and completion criteria", () => {
    const unitId = "unit-01";
    let progress: BusinessProgress = {};

    progress = checkpointBusinessUnit(progress, unitId, 2, "vocabulary");
    expect(progress[unitId].status).toBe("in-progress");
    expect(progress[unitId].completedStages).toContain("vocabulary");
    expect(progress[unitId].currentStage).toBe(2);

    progress = checkpointBusinessUnit(progress, unitId, 4, "exercises", 9);
    expect(progress[unitId].completedStages).toContain("exercises");
    expect(progress[unitId].quizBestScore).toBe(9);

    progress = saveBusinessReflection(progress, unitId, "note-1", "My notes on the prompt");
    expect(progress[unitId].reflectionNotes?.["note-1"]).toBe("My notes on the prompt");

    progress = saveBusinessChecklist(progress, unitId, ["checklist-item-a"]);
    expect(progress[unitId].checklistCompleted).toContain("checklist-item-a");

    progress = saveBusinessConfidence(progress, unitId, "ready");
    expect(progress[unitId].confidenceRating).toBe("ready");

    expect(canCompleteBusinessUnit(progress, unitId)).toBe(false);

    // Complete speaking stage as well
    progress = checkpointBusinessUnit(progress, unitId, 6, "speaking");
    expect(canCompleteBusinessUnit(progress, unitId)).toBe(true);

    progress = completeBusinessUnit(progress, unitId);
    expect(progress[unitId].status).toBe("mastered");
    expect(progress[unitId].completedStages).toEqual(BUSINESS_STAGE_IDS);
  });

  it("round-trips business curriculum and lesson hashes via useHashRouter", () => {
    expect(screenToHash({ id: "business-curriculum" })).toEqual({
      hash: "#/business",
      title: "WordPix — Beyond Business English",
    });

    expect(screenToHash({ id: "business-lesson", unitId: "unit-05" })).toEqual({
      hash: "#/business/unit-05",
      title: "WordPix — Beyond Business English — Unit 5",
    });

    expect(screenToHash({ id: "business-lesson", unitId: "unit-05", stage: "vocabulary" })).toEqual(
      {
        hash: "#/business/unit-05/vocabulary",
        title: "WordPix — Beyond Business English — Unit 5",
      }
    );

    expect(screenToHash({ id: "business-lesson", unitId: "unit-02", stage: "recall" })).toEqual({
      hash: "#/business/unit-02/recall",
      title: "WordPix — Beyond Business English — Unit 2",
    });

    // Hash to route intent
    expect(hashToRoute("#/business")).toEqual({
      kind: "screen",
      screen: { id: "business-curriculum" },
      title: "WordPix — Beyond Business English",
    });

    expect(hashToRoute("#/business/unit-05")).toEqual({
      kind: "screen",
      screen: { id: "business-lesson", unitId: "unit-05", stage: undefined },
      title: "WordPix — Beyond Business English — Unit 5",
    });

    expect(hashToRoute("#/business/unit-05/exercises")).toEqual({
      kind: "screen",
      screen: { id: "business-lesson", unitId: "unit-05", stage: "exercises" },
      title: "WordPix — Beyond Business English — Unit 5",
    });

    expect(hashToRoute("#/business/unit-02/recall")).toEqual({
      kind: "screen",
      screen: { id: "business-lesson", unitId: "unit-02", stage: "recall" },
      title: "WordPix — Beyond Business English — Unit 2",
    });

    // Reject out-of-range or invalid stages
    expect(hashToRoute("#/business/unit-99")).toBeNull();
    expect(hashToRoute("#/business/unit-05/invalid-stage")).toBeNull();
  });
});
