import { describe, expect, it, vi } from "vitest";

vi.mock("../generated/reviewedUsageIllustrations.json", () => {
  throw Error("Combined usage illustrations must not be imported");
});
vi.mock("../generated/reviewedFigmaQuestionMedia.json", () => {
  throw Error("Combined Figma question media must not be imported");
});
vi.mock("../generated/reviewedFigmaObjectScenes.json", () => {
  throw Error("Combined Figma object scenes must not be imported");
});
vi.mock("../generated/reviewedGeneratedSceneMedia.json", () => {
  throw Error("Combined generated scenes must not be imported");
});

import { loadUnitUsageForEditorial } from "../data/usageRegistry";

describe("bounded usage-media dependency graph", () => {
  it("loads reviewed scenes without evaluating any all-course manifest", async () => {
    const lessons = await loadUnitUsageForEditorial("numbers-counting");
    expect(lessons?.length).toBeGreaterThan(0);
    expect(lessons?.some((lesson) => lesson.usage.scenes.some((scene) => scene.imagePath))).toBe(
      true
    );
  });
});
