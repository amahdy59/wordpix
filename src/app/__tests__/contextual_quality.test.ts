import { describe, expect, it } from "vitest";
import {
  auditContextualLesson,
  CONTEXTUAL_REFERENCE_UNITS,
  inferQuestionType,
} from "../data/contextualQuality";
import { unitUsageDataSchema, type LessonUsageData } from "../data/usageTypes";
import { enrichReferenceLesson } from "../data/referenceUnitEnrichment";
import { applyLessonLearningContexts } from "../data/sceneLearningContext.mjs";

const modules = import.meta.glob<{ default: unknown }>("../data/usage/*.usage.json", {
  eager: true,
});
const lessons: LessonUsageData[] = Object.values(modules).flatMap((module) =>
  unitUsageDataSchema
    .parse(module.default)
    .map(applyLessonLearningContexts)
    .map(enrichReferenceLesson)
);
const reports = lessons.map(auditContextualLesson);
const approvalModules = import.meta.glob<{ default: unknown }>(
  "../data/usageApprovals/*.approval.json",
  {
    eager: true,
  }
);
const releasedLessonIds = new Set(
  Object.values(approvalModules).flatMap((module) =>
    Array.isArray(module.default)
      ? (module.default as Array<{ lessonId?: string }>)
          .map((approval) => approval.lessonId)
          .filter(Boolean)
      : []
  )
);

describe("contextual-diversity curriculum contract", () => {
  it("classifies varied question designs", () => {
    expect(
      inferQuestionType({ prompt: "Why did Sam choose the train?", answer: "It was fast." })
    ).toBe("inference");
    expect(inferQuestionType({ prompt: "Use it: Describe your journey.", answer: "" })).toBe(
      "production"
    );
    expect(inferQuestionType({ prompt: "Complete: I ___ at six.", answer: "arrive" })).toBe(
      "context-cloze"
    );
  });

  it("keeps every target in authored contextual material", () => {
    const failures = reports
      .filter((report) => releasedLessonIds.has(report.lessonId))
      .flatMap((report) =>
        report.targetCoverage
          .filter((target) => target.sources.length === 0)
          .map((target) => `${report.lessonId}: ${target.target}`)
      );
    expect(failures).toEqual([]);
  });

  it("provides production and varied response design throughout the curriculum", () => {
    expect(reports.filter((report) => report.productionTaskCount === 0)).toEqual([]);
    expect(reports.filter((report) => report.questionTypes.length < 2)).toEqual([]);
  });

  it("holds one reference unit per taught CEFR band to the stronger quality gate", () => {
    const referenceUnitIds = new Set<string>(Object.values(CONTEXTUAL_REFERENCE_UNITS));
    const references = reports.filter(
      (report) => referenceUnitIds.has(report.unitId) && releasedLessonIds.has(report.lessonId)
    );
    expect(new Set(references.map((report) => report.unitId))).toEqual(referenceUnitIds);
    expect(references.filter((report) => report.errors.length > 0)).toEqual([]);
    expect(Math.min(...references.map((report) => report.score))).toBeGreaterThanOrEqual(85);
    expect(
      references.flatMap((report) =>
        report.targetCoverage.filter((target) => target.sources.length < 2)
      )
    ).toEqual([]);
    references.forEach((report) => {
      expect(report.questionTypes).toEqual(
        expect.arrayContaining(["inference", "comparison", "production", "transfer"])
      );
      expect(report.productionTaskCount).toBeGreaterThanOrEqual(3);
    });
  });

  it("emits a measurable curriculum summary for editorial review", () => {
    const average = Math.round(
      reports.reduce((total, report) => total + report.score, 0) / reports.length
    );
    const recommendations = reports.filter((report) => report.recommendations.length > 0).length;
    console.warn(
      `Contextual quality: ${reports.length} lessons, ${new Set(reports.map((report) => report.unitId)).size} units, average ${average}/100, ${recommendations} lessons queued for editorial refinement.`
    );
    expect(reports).toHaveLength(864);
  });
});
