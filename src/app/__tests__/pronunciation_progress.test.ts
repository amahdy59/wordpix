import { describe, expect, it } from "vitest";
import {
  checkpointPronunciationLesson,
  completePronunciationLesson,
} from "../learning/foundations/pronunciationProgress";

describe("pronunciation curriculum progress", () => {
  it("persists an in-progress stage without erasing prior evidence", () => {
    const started = checkpointPronunciationLesson({}, "lesson-02", 2, new Date("2026-09-23"));
    const resumed = checkpointPronunciationLesson(started, "lesson-02", 3, new Date("2026-09-24"));

    expect(resumed["lesson-02"]).toMatchObject({
      status: "in-progress",
      currentStage: 3,
      sessions: 0,
    });
  });

  it("schedules stronger results later and preserves the best score", () => {
    const first = completePronunciationLesson(
      {},
      "lesson-02",
      90,
      4,
      new Date("2026-09-23T00:00:00.000Z")
    );
    const retry = completePronunciationLesson(
      first,
      "lesson-02",
      50,
      4,
      new Date("2026-09-24T00:00:00.000Z")
    );

    expect(first["lesson-02"].nextReviewAt).toBe("2026-09-26T00:00:00.000Z");
    expect(retry["lesson-02"]).toMatchObject({
      status: "needs-practice",
      bestScorePercent: 90,
      sessions: 2,
    });
  });
});
