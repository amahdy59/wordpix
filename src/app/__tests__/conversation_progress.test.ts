import { describe, it, expect } from "vitest";
import {
  canCompleteConversationUnit,
  checkpointConversationUnit,
  completeConversationUnit,
  normalizeConversationProgress,
  saveConversationChallengeResponse,
  type ConversationProgress,
} from "../learning/conversation/conversationProgress";

describe("Conversation Progress State Machine", () => {
  it("normalizes empty or invalid progress safely", () => {
    expect(normalizeConversationProgress(null)).toEqual({});
    expect(normalizeConversationProgress(undefined)).toEqual({});
    expect(normalizeConversationProgress("invalid")).toEqual({});
    expect(normalizeConversationProgress([])).toEqual({});
  });

  it("checkpoints a unit stage and records progress", () => {
    let progress: ConversationProgress = {};
    const now = new Date("2026-09-24T12:00:00Z");

    progress = checkpointConversationUnit(
      progress,
      "unit-01",
      1, // move to reading stage
      "warmup", // completed warmup
      undefined,
      "A", // selected vote A
      now
    );

    expect(progress["unit-01"]).toBeDefined();
    expect(progress["unit-01"].status).toBe("in-progress");
    expect(progress["unit-01"].currentStage).toBe(1);
    expect(progress["unit-01"].completedStages).toContain("warmup");
    expect(progress["unit-01"].selectedVoteOption).toBe("A");
    expect(progress["unit-01"].updatedAt).toBe(now.toISOString());
  });

  it("updates quiz score and clamps to 0-10", () => {
    let progress: ConversationProgress = {};
    progress = checkpointConversationUnit(
      progress,
      "unit-01",
      5,
      "quiz",
      9, // 9/10
      undefined
    );

    expect(progress["unit-01"].quizBestScore).toBe(9);

    // If a lower score is later recorded, best score is preserved
    progress = checkpointConversationUnit(progress, "unit-01", 5, undefined, 7, undefined);
    expect(progress["unit-01"].quizBestScore).toBe(9);
  });

  it("marks a unit as mastered when completed", () => {
    let progress: ConversationProgress = {};
    for (const stage of [
      "warmup",
      "reading",
      "vocabulary",
      "toolkit",
      "quiz",
      "discussion",
    ] as const) {
      progress = checkpointConversationUnit(
        progress,
        "unit-02",
        6,
        stage,
        stage === "quiz" ? 8 : undefined
      );
    }
    expect(progress["unit-02"].status).toBe("in-progress");
    expect(canCompleteConversationUnit(progress, "unit-02")).toBe(true);

    progress = completeConversationUnit(progress, "unit-02");
    expect(progress["unit-02"].status).toBe("mastered");
    expect(progress["unit-02"].completedStages).toHaveLength(7);
  });

  it("refuses mastery when prerequisite stages or the quiz result are missing", () => {
    const progress = checkpointConversationUnit({}, "unit-03", 6, "warmup");
    const unchanged = completeConversationUnit(progress, "unit-03");
    expect(unchanged).toBe(progress);
    expect(unchanged["unit-03"].status).toBe("in-progress");
    expect(unchanged["unit-03"].quizBestScore).toBeUndefined();
  });

  it("preserves valid progress when normalized", () => {
    const raw = {
      "unit-01": {
        status: "in-progress",
        currentStage: 2,
        completedStages: ["warmup", "reading"],
        quizBestScore: 8,
        selectedVoteOption: "B",
        updatedAt: "2026-09-24T12:00:00Z",
      },
      "invalid-unit": {
        status: "garbage",
      },
    };

    const normalized = normalizeConversationProgress(raw);
    expect(normalized["unit-01"]).toBeDefined();
    expect(normalized["unit-01"].status).toBe("in-progress");
    expect(normalized["invalid-unit"]).toBeUndefined();
  });

  it("persists and bounds a learner challenge response", () => {
    const progress = saveConversationChallengeResponse({}, "unit-01", "A".repeat(7000));
    expect(progress["unit-01"].challengeResponse).toHaveLength(6000);
    expect(progress["unit-01"].status).toBe("in-progress");
  });
});
