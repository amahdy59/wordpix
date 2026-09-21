import { describe, expect, it, vi } from "vitest";
import { INITIAL_LEARNER_STATE, persistLearnerStateBeforeCleanup } from "../context/LearnerContext";

describe("legacy learner-state migration", () => {
  it("keeps legacy data when IndexedDB persistence fails", async () => {
    const cleanup = vi.fn();
    const persist = vi.fn().mockResolvedValue(false);

    await expect(
      persistLearnerStateBeforeCleanup(INITIAL_LEARNER_STATE, cleanup, persist)
    ).resolves.toBe(false);
    expect(cleanup).not.toHaveBeenCalled();
  });

  it("cleans legacy data only after IndexedDB persistence succeeds", async () => {
    const cleanup = vi.fn();
    const persist = vi.fn().mockResolvedValue(true);

    await expect(
      persistLearnerStateBeforeCleanup(INITIAL_LEARNER_STATE, cleanup, persist)
    ).resolves.toBe(true);
    expect(cleanup).toHaveBeenCalledOnce();
  });
});
