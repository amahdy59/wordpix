import { describe, expect, it } from "vitest";
import generated from "../generated/reviewedGeneratedSceneMedia.json";
import previous from "../generated/reviewedFigmaObjectScenes.json";
import classroom from "../data/usage/classroom.usage.json";
import publication from "../../../docs/content-review/approved-image-publication-2026-10-10.json";
import { unitUsageDataSchema } from "../data/usageTypes";
import { attachReviewedUsageIllustrations } from "../data/reviewedUsageIllustrations";

describe("independently reviewed generated scene media", () => {
  it("adds new scene identities without replacing established object mappings", () => {
    for (const [id, media] of Object.entries(generated)) {
      expect(previous).not.toHaveProperty(id);
      const reused = publication.items.find(
        (item) => item.sceneId === id && item.selection === "reuse-existing"
      );
      if (reused) {
        expect(media.imagePath).toBe(reused.imagePath);
        expect(media).toHaveProperty("imagePurpose", "word-reference");
      } else
        expect(media.imagePath).toMatch(
          /^question-images\/(?:v2\/[a-z0-9-]+|v3\/shared\/[a-z0-9-]+)\/[a-f0-9]{64}\.webp$/
        );
      expect(media.imageAlt.trim().length).toBeGreaterThan(20);
      expect(media.reviewedQuestion.trim()).not.toBe("");
    }
  });
  it("shares an approved object reference while keeping each question's evidence separate", () => {
    const blouse = generated["everyday-clothing-1-usage-scene-1"];
    const tailoring = generated["tailor-shop-5-usage-scene-4"];
    expect(blouse.imagePath).toBe(tailoring.imagePath);
    expect(blouse).toHaveProperty("imagePurpose", "word-reference");
    expect(tailoring).toHaveProperty("imagePurpose", "word-reference");
    expect(blouse.reviewedQuestion).not.toBe(tailoring.reviewedQuestion);
    expect(blouse.imagePath).toMatch(
      /^question-images\/v3\/shared\/blouse-cream-long-sleeves-hanger\//
    );
  });
  it("attaches reviewed imagery through the current classroom curriculum", () => {
    const source = unitUsageDataSchema.parse(classroom);
    const result = attachReviewedUsageIllustrations(source);
    const scenes = result.flatMap((l) => l.usage.scenes);
    expect(scenes.filter((s) => s.imagePath?.startsWith("question-images/v2/"))).toHaveLength(22);
    expect(source[0].usage.scenes[0].imagePath).toBeUndefined();
  });
  it("withholds a generated image after only the question changes", () => {
    const source = unitUsageDataSchema.parse(classroom);
    source[0].usage.scenes[0].check.question = "Which unrelated object is being requested?";
    expect(attachReviewedUsageIllustrations(source)[0].usage.scenes[0].imagePath).toBeUndefined();
  });
});
