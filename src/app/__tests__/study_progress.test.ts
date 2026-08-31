import { beforeEach, describe, expect, it } from "vitest";
import {
  clearReviewWord,
  loadStudyProgress,
  recordWordPractice,
  saveStudyProgress,
} from "../learning/study/progress";

describe("study progress", () => {
  beforeEach(() => localStorage.clear());

  it("stores progress without mutating React state", () => {
    const progress = loadStudyProgress("bathroom");
    const originalUpdatedAt = progress.updatedAt;

    saveStudyProgress(progress);

    expect(progress.updatedAt).toBe(originalUpdatedAt);
    expect(loadStudyProgress("bathroom")).toMatchObject({ unitId: "bathroom", version: 1 });
  });

  it("queues an incorrectly recalled word for review", () => {
    const progress = loadStudyProgress("bathroom");
    const updated = recordWordPractice(progress, "towel", false);

    expect(updated.reviewWordIds).toContain("towel");
    expect(updated.wordStatus.towel).toBe("learning");
    expect(progress.reviewWordIds).toEqual([]);
  });

  it("marks a successfully reviewed word as comfortable", () => {
    const progress = recordWordPractice(loadStudyProgress("bathroom"), "towel", false);
    const updated = clearReviewWord(progress, "towel");

    expect(updated.reviewWordIds).not.toContain("towel");
    expect(updated.wordStatus.towel).toBe("comfortable");
  });
});
