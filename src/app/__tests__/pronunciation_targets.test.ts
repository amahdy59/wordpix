import { describe, expect, it } from "vitest";
import {
  FIGMA_PRONUNCIATION_LESSONS,
  getPronunciationQuestion,
} from "../learning/foundations/figmaPronunciationCatalog";
import {
  getPronunciationTargets,
  pronunciationTargetId,
  pronunciationTrialCount,
} from "../learning/foundations/pronunciationTargets";
import { calculateAccuracy, transcriptMatches } from "../shared/useSpeechRecognition";
import { hasReportedPronunciationAudioIssue } from "../learning/foundations/pronunciationAudioQuality";

describe("complete pronunciation target coverage", () => {
  it("checks every authored target exactly once per applicable stage in all 68 lessons", () => {
    for (const lesson of FIGMA_PRONUNCIATION_LESSONS) {
      for (const stage of [1, 2, 3, 4] as const) {
        const expected = getPronunciationTargets(lesson.number, stage === 4)
          .slice(0, stage === 2 ? 3 : undefined)
          .map((item) => pronunciationTargetId(item.label));
        const actual = Array.from(
          { length: pronunciationTrialCount(lesson.number, stage) },
          (_, trial) => getPronunciationQuestion(lesson.number, stage, trial).target
        );
        expect(new Set(actual.map((item) => pronunciationTargetId(item.label)))).toEqual(
          new Set(expected)
        );
        expect(actual).toHaveLength(new Set(expected).size);
      }
    }
  });
  it("does not confuse minimal pairs, extra endings or substrings", () => {
    for (const heard of ["pinned", "pen", "spin", "pinning", "bin"]) {
      expect(transcriptMatches(heard, "pin")).toBe(false);
      expect(calculateAccuracy(heard, "pin")).toBe(0);
    }
    expect(transcriptMatches("a pin", "pin")).toBe(true);
    expect(transcriptMatches("a pin here", "pin here")).toBe(true);
    expect(transcriptMatches("a pinned here", "pin here")).toBe(false);
  });
  it("quarantines the reported pin audio issue without changing an asset reference", () => {
    expect(hasReportedPronunciationAudioIssue("Pin")).toBe(true);
    expect(hasReportedPronunciationAudioIssue("pen")).toBe(false);
  });
});
