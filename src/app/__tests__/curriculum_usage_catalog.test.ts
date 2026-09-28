import { describe, it, expect } from "vitest";
import { loadUnitUsage, hasUnitUsage, loadLessonUsage } from "../data/usageRegistry";

describe("Curriculum Usage Data Layer", () => {
  it("confirms registered units exist in the registry", () => {
    expect(hasUnitUsage("farm")).toBe(true);
    expect(hasUnitUsage("office")).toBe(true);
    expect(hasUnitUsage("non-existent-unit")).toBe(false);
  });

  it("loads the Farm unit (A1) with structured chunks and check questions", async () => {
    const farmUsage = await loadUnitUsage("farm");
    expect(farmUsage).not.toBeNull();
    expect(farmUsage?.length).toBe(6);

    const firstLesson = farmUsage?.[0];
    expect(firstLesson?.lessonId).toBe("farm-1");
    expect(firstLesson?.cefrStage).toBe("A1");
    expect(firstLesson?.targetWordsEnglish.length).toBeGreaterThanOrEqual(10);
    expect(firstLesson?.targetWordsArabic.length).toBeGreaterThanOrEqual(10);

    // Verify Usage chunks
    const scenes = firstLesson?.usage.scenes ?? [];
    expect(scenes.length).toBeGreaterThan(0);
    for (const chunk of scenes) {
      expect(chunk.chunkNumber).toBeGreaterThan(0);
      expect(chunk.targetWords.length).toBeGreaterThan(0);
      expect(chunk.scenario.length).toBeGreaterThan(10);
      expect(chunk.check.question.length).toBeGreaterThan(5);
      expect(chunk.check.expectedAnswer.length).toBeGreaterThan(0);
      expect(chunk.check.options).toContain(chunk.check.expectedAnswer);
      expect(chunk.imageBrief.length).toBeGreaterThan(10);
    }

    // Verify Reading & Exercises
    expect(firstLesson?.reading.title).toContain("Farm");
    expect(firstLesson?.reading.text.length).toBeGreaterThan(50);
    expect(firstLesson?.exercises.length).toBeGreaterThan(0);
  });

  it("loads the Office unit (B2) with professional context", async () => {
    const officeUsage = await loadUnitUsage("office");
    expect(officeUsage).not.toBeNull();
    expect(officeUsage?.length).toBe(4);

    const lesson = officeUsage?.[0];
    expect(lesson?.lessonId).toBe("office-1");
    expect(lesson?.cefrStage).toBe("B2");
    expect(lesson?.usage.canDoStatement.length).toBeGreaterThan(10);

    const scenes = lesson?.usage.scenes ?? [];
    expect(scenes.length).toBe(4);
    expect(scenes[0].targetWords).toEqual(["Desk", "Office Chair", "Filing Cabinet", "Bookshelf"]);
  });

  it("resolves a single lesson directly by lessonId", async () => {
    const lesson = await loadLessonUsage("farm-2");
    expect(lesson).not.toBeNull();
    expect(lesson?.lessonId).toBe("farm-2");
    expect(lesson?.unitId).toBe("farm");
  });

  it("verifies core units across all CEFR stages are registered in the glob loader", () => {
    // Pre-A1
    expect(hasUnitUsage("numbers-counting")).toBe(true);
    expect(hasUnitUsage("bedroom")).toBe(true);
    // A1
    expect(hasUnitUsage("farm")).toBe(true);
    expect(hasUnitUsage("supermarket")).toBe(true);
    // A2
    expect(hasUnitUsage("human-body-head-and-face")).toBe(true);
    // B1
    expect(hasUnitUsage("newspaper-office")).toBe(true);
    // B2
    expect(hasUnitUsage("office")).toBe(true);
    // C1
    expect(hasUnitUsage("law-firm")).toBe(true);
  });
});
