import { describe, expect, it, vi } from "vitest";
vi.mock("../../lib/supabase/client", () => ({
  supabase: { auth: { getSession: vi.fn() }, rpc: vi.fn() },
}));
import {
  DEFAULT_ACCESSIBILITY,
  INITIAL_LEARNER_STATE,
  migrateState,
} from "../context/LearnerContext";
import { validateSyncOperation } from "../../lib/persistence/syncValidation";
import { migrateGuestToAccount } from "../../lib/persistence/sync";
import { createInitialWordState } from "../../features/gamification/sm2";
import { getWordMemory, migrateWordMemory, wordMemoryKey } from "../learning/wordIdentity";
import { reviewSessionAction } from "../review/startReview";
import { parseNavigationState } from "../router/navigationState";
import { mergeSpecialistRecord } from "../../lib/persistence/specialistProgress";
import * as database from "../../lib/persistence/db";
import {
  enqueueLearnerWrite,
  flushLearnerWrites,
  getLearnerSaveStatus,
  getUnsavedLearnerSnapshot,
} from "../../lib/persistence/learnerWrites";

describe("application review regressions", () => {
  it("syncs the complete accessibility preferences produced by the provider", () => {
    const operation = {
      id: "full-settings",
      type: "update_accessibility" as const,
      payload: { ...DEFAULT_ACCESSIBILITY, autoPlayAudio: false },
      createdAt: new Date().toISOString(),
      status: "pending" as const,
      retryCount: 0,
    };
    expect(validateSyncOperation(operation).payload).toEqual(operation.payload);
  });
  it("retains ambiguous historical evidence without applying it to unrelated senses", () => {
    const coach = { ...createInitialWordState("coach"), mastery: "strong" as const, exposures: 10 };
    const one = createInitialWordState("one");
    const result = migrateWordMemory({ coach, one });
    expect(result.legacy.coach).toEqual(coach);
    expect(getWordMemory(result.current, "coach", "sports-center")).toBeUndefined();
    expect(getWordMemory(result.current, "one", "numbers-counting")).toMatchObject({
      wordId: "one",
      unitId: "numbers-counting",
    });
    const scoped = { ...coach, unitId: "bus-station" };
    const migrated = migrateState({
      ...INITIAL_LEARNER_STATE,
      wordMemory: { coach, [wordMemoryKey("bus-station", "coach")]: scoped },
    });
    expect(migrated.legacyWordMemory?.coach).toEqual(coach);
    expect(getWordMemory(migrated.wordMemory, "coach", "bus-station")).toEqual(scoped);
    expect(getWordMemory(migrated.wordMemory, "coach", "sports-center")).toBeUndefined();
    expect(migrateState(migrated)).toEqual(migrated);
  });
  it("carries exact unit identities into cold and mixed-unit reviews", () => {
    const due = [
      { ...createInitialWordState("coach"), unitId: "bus-station" },
      { ...createInitialWordState("coach"), unitId: "sports-center" },
      createInitialWordState("one"),
    ];
    expect(reviewSessionAction(due, 10)).toMatchObject({
      type: "START_LESSON",
      wordQueue: ["coach", "one"],
      reviewItems: [
        { unitId: "bus-station", wordId: "coach" },
        { unitId: "numbers-counting", wordId: "one" },
      ],
    });
    expect(reviewSessionAction([createInitialWordState("coach")], 10)).toBeNull();
  });
  it("rejects partial or obsolete persisted screens without touching learning records", () => {
    expect(parseNavigationState({ id: "lesson", lessonId: "numbers-counting-1" })).toBeNull();
    expect(parseNavigationState({ id: "retired-screen" })).toBeNull();
    expect(parseNavigationState({ id: "onboarding" })).toBeNull();
    expect(parseNavigationState({ id: "home" })).toEqual({ id: "home" });
    expect(parseNavigationState({ id: "explore" })).toEqual({ id: "learn" });
  });
  it("merges earned specialist evidence while respecting a newer review result", () => {
    const old = {
      status: "mastered",
      updatedAt: "2026-10-01T00:00:00Z",
      completedStages: ["warmup"],
      quizBestScore: 8,
    };
    const next = {
      status: "in-progress",
      updatedAt: "2026-10-02T00:00:00Z",
      completedStages: ["quiz"],
      quizBestScore: 6,
    };
    expect(mergeSpecialistRecord(old, next)).toEqual({
      ...next,
      completedStages: ["warmup", "quiz"],
      quizBestScore: 8,
    });
    expect(mergeSpecialistRecord(next, old).status).toBe("in-progress");
  });
  it("atomically writes a checkpoint and its sync intent, with idempotent change IDs", async () => {
    const db = (await database.getDB())!;
    await db.clear("mutation_queue");
    await database.saveLearnerChange(
      INITIAL_LEARNER_STATE,
      [{ type: "add_xp", payload: { xp: 5 } }],
      "checkpoint"
    );
    await database.saveLearnerChange(
      INITIAL_LEARNER_STATE,
      [{ type: "add_xp", payload: { xp: 5 } }],
      "checkpoint"
    );
    expect(await db.count("mutation_queue")).toBe(1);
    expect(await db.get("learner_state", database.LEARNER_STATE_KEY)).toEqual(
      INITIAL_LEARNER_STATE
    );
  });
  it("keeps a failed snapshot for a visible retry rather than reporting it saved", async () => {
    const write = vi
      .spyOn(database, "saveLearnerChange")
      .mockRejectedValueOnce(new Error("Quota exceeded"));
    enqueueLearnerWrite(INITIAL_LEARNER_STATE, [], "retryable");
    await flushLearnerWrites();
    expect(getLearnerSaveStatus()).toBe("failed");
    expect(getUnsavedLearnerSnapshot()).toEqual(INITIAL_LEARNER_STATE);
    write.mockResolvedValue(undefined);
    await flushLearnerWrites();
    expect(getLearnerSaveStatus()).toBe("saved");
    expect(getUnsavedLearnerSnapshot()).toBeUndefined();
    write.mockRestore();
  });
  it("does not freeze a stale guest migration snapshot while local saving is failing", async () => {
    const write = vi
      .spyOn(database, "saveLearnerChange")
      .mockRejectedValue(new Error("Storage unavailable"));
    enqueueLearnerWrite(INITIAL_LEARNER_STATE, [], "blocked-migration");
    await flushLearnerWrites();
    await expect(migrateGuestToAccount("alice")).rejects.toThrow("has not been saved");
    expect(getUnsavedLearnerSnapshot()).toEqual(INITIAL_LEARNER_STATE);
    write.mockRestore();
  });
  it("durably writes a snapshot superseding an in-flight copy with the same change ID", async () => {
    let finish: () => void = () => {};
    const write = vi
      .spyOn(database, "saveLearnerChange")
      .mockImplementationOnce(
        () =>
          new Promise<void>((resolve) => {
            finish = resolve;
          })
      )
      .mockResolvedValue(undefined);
    const latest = {
      ...INITIAL_LEARNER_STATE,
      learnerProgress: { ...INITIAL_LEARNER_STATE.learnerProgress, xp: 7 },
    };
    enqueueLearnerWrite(INITIAL_LEARNER_STATE, [], "same-action");
    enqueueLearnerWrite(latest, [], "same-action");
    finish();
    await flushLearnerWrites();
    expect(write).toHaveBeenCalledTimes(2);
    expect(write).toHaveBeenLastCalledWith(latest, [], "same-action");
    expect(getUnsavedLearnerSnapshot()).toBeUndefined();
    expect(getLearnerSaveStatus()).toBe("saved");
    write.mockRestore();
  });
});
