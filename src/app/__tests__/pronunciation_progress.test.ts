import { describe, expect, it } from "vitest";
import {
  getDuePronunciationReviews,
  checkpointPronunciationLesson,
  completePronunciationLesson,
  migrateLegacyPronunciationProgress,
  normalizePronunciationProgress,
} from "../learning/foundations/pronunciationProgress";

describe("pronunciation curriculum progress", () => {
  it("round trips question evidence through persistence and clears it on completion", () => {
    const session = {
      trial: 2,
      attempts: 1,
      answer: "ship",
      unlockedStage: 3,
      outcomes: { "1:0": true, "3:2": false },
    };
    const saved = checkpointPronunciationLesson({}, "lesson-02", 3, new Date(), session);
    const loaded = normalizePronunciationProgress(JSON.parse(JSON.stringify(saved)));
    expect(loaded["lesson-02"].session).toEqual(session);
    expect(
      completePronunciationLesson(loaded, "lesson-02", 80, 4)["lesson-02"].session
    ).toBeUndefined();
  });

  it("rejects corrupt sessions without discarding historical progress", () => {
    const saved = completePronunciationLesson({}, "lesson-02", 90, 4);
    const loaded = normalizePronunciationProgress({
      "lesson-02": { ...saved["lesson-02"], session: { trial: 8 } },
    });
    expect(loaded["lesson-02"].bestScorePercent).toBe(90);
    expect(loaded["lesson-02"].session).toBeUndefined();
  });
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

  it("moves retired pilot evidence into the revised curriculum without false mastery", () => {
    const migrated = migrateLegacyPronunciationProgress(
      {
        "meaningful-contrasts": {
          status: "mastered",
          sessions: 2,
          updatedAt: "2026-09-20T00:00:00.000Z",
        },
        "pronunciation-portfolio": {
          status: "in-progress",
          sessions: 1,
          updatedAt: "2026-09-21T00:00:00.000Z",
        },
      },
      {}
    );

    expect(migrated["lesson-01"]).toMatchObject({
      status: "in-progress",
      currentStage: 0,
      sessions: 2,
    });
    expect(migrated["lesson-68"]).toMatchObject({ status: "in-progress", sessions: 1 });
  });

  it("never overwrites newer progress in the revised curriculum", () => {
    const migrated = migrateLegacyPronunciationProgress(
      { "meaningful-contrasts": { status: "mastered", sessions: 3 } },
      {
        "lesson-01": {
          status: "mastered",
          currentStage: 4,
          bestScorePercent: 95,
          sessions: 1,
          updatedAt: "2026-09-24T00:00:00.000Z",
        },
      }
    );

    expect(migrated["lesson-01"]).toMatchObject({ status: "mastered", bestScorePercent: 95 });
  });
});

describe("per-target evidence", () => {
  it("preserves target results after completion without claiming speaking mastery", () => {
    const session = {
      version: 2 as const,
      trial: 5,
      attempts: 0,
      answer: null,
      unlockedStage: 4,
      outcomes: { "1:target:pin": true },
      targetEvidence: {
        "target:pin": {
          listening: true,
          speaking: "reflected" as const,
          updatedAt: "2026-10-13T00:00:00.000Z",
          nextReviewAt: "2026-10-14T00:00:00.000Z",
        },
      },
    };
    const saved = checkpointPronunciationLesson({}, "lesson-03", 4, new Date(), session);
    const loaded = normalizePronunciationProgress(JSON.parse(JSON.stringify(saved)));
    expect(loaded["lesson-03"].session).toEqual(session);
    const completed = completePronunciationLesson(loaded, "lesson-03", 100, 4)["lesson-03"];
    expect(completed.status).toBe("needs-practice");
    expect(completed.targetEvidence).toEqual(session.targetEvidence);
    expect(completed.session).toBeUndefined();
  });
});

it("shows due target evidence under its stable lesson ID and ignores future reviews", () => {
  const evidence = {
    listening: false,
    speaking: "unassessed" as const,
    updatedAt: "2026-10-12T12:00:00Z",
    nextReviewAt: "2026-10-13T00:00:00Z",
  };
  const progress = checkpointPronunciationLesson({}, "lesson-03", 1, new Date(), {
    version: 2,
    trial: 0,
    attempts: 0,
    answer: null,
    unlockedStage: 1,
    outcomes: {},
    targetEvidence: {
      "target:pin": evidence,
      "target:pen": { ...evidence, nextReviewAt: "2026-10-20T00:00:00Z" },
    },
  });
  expect(getDuePronunciationReviews(progress, new Date("2026-10-13T12:00:00Z"))).toEqual([
    { lessonId: "lesson-03", lessonNumber: 3, targets: ["target:pin"] },
  ]);
});
