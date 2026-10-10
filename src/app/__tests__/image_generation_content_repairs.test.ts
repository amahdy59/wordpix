import { describe, expect, it } from "vitest";
import airportPhrases from "../data/usagePhrases/airport.phrases.json";
import { loadUnitUsageForEditorial } from "../data/usageRegistry";
import generatedMedia from "../generated/reviewedGeneratedSceneMedia.json";
import { unitUsagePhraseDataSchema } from "../data/usageTypes";

describe("image generation content repairs", () => {
  it("uses airport senses and concrete grammar patterns with stable phrase identities", () => {
    expect(unitUsagePhraseDataSchema.safeParse(airportPhrases).success).toBe(true);
    expect(airportPhrases).toHaveLength(12);
    expect(new Set(airportPhrases.map((p) => p.id)).size).toBe(12);
    expect(airportPhrases.map((p) => p.phrase).join(" ")).not.toMatch(
      /platform|timetable|service on time/
    );
    expect(
      airportPhrases.filter((p) => p.phrase === "check in").every((p) => p.cefrStage === "B1")
    ).toBe(true);
    expect(airportPhrases.every((p) => !/normal article|keep the key words/i.test(p.pattern))).toBe(
      true
    );
  });
  it("makes latest scene exercises self-contained and consistent with source evidence", async () => {
    for (const unit of [
      "classroom",
      "fruits",
      "market",
      "office-supplies",
      "supermarket",
      "vegetables",
      "airport",
      "3d-printer-lab",
    ]) {
      const lessons = await loadUnitUsageForEditorial(unit);
      expect(lessons, unit).not.toBeNull();
      for (const lesson of lessons ?? []) {
        for (const scene of lesson.usage.scenes) {
          expect(
            lesson.exercises.some(
              (e) =>
                e.answer === scene.check.expectedAnswer &&
                e.prompt === `${scene.scenario}\n${scene.check.question}`
            ),
            `${lesson.lessonId}/${scene.chunkNumber}`
          ).toBe(true);
        }
      }
    }
  });
  it("preserves scenario, question and answer for established generated media", async () => {
    for (const unit of new Set(
      Object.keys(generatedMedia).map((id) => id.replace(/-\d+-usage-scene-\d+$/, ""))
    )) {
      const lessons = await loadUnitUsageForEditorial(unit);
      for (const lesson of lessons ?? []) {
        for (const scene of lesson.usage.scenes) {
          const key = `${lesson.lessonId}-usage-scene-${scene.chunkNumber}`;
          const media = generatedMedia[key as keyof typeof generatedMedia];
          if (!media) continue;
          expect(scene.scenario, key).toBe(media.reviewedScenario);
          expect(scene.check.question, key).toBe(media.reviewedQuestion);
          expect(scene.check.expectedAnswer, key).toBe(media.reviewedAnswer);
        }
      }
    }
  });
});
