import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDB, LEARNER_STATE_KEY, queueMutation } from "../../lib/persistence/db";
import { migrateGuestToAccount, syncQueue } from "../../lib/persistence/sync";
import { INITIAL_LEARNER_STATE } from "../context/LearnerContext";

const mocks = vi.hoisted(() => ({ session: vi.fn(), write: vi.fn(), rpc: vi.fn() }));
vi.mock("../../lib/supabase/client", () => ({
  supabase: {
    auth: { getSession: mocks.session },
    rpc: mocks.rpc,
    from: () => ({ update: () => ({ eq: mocks.write }) }),
  },
}));

beforeEach(async () => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ data: { session: { user: { id: "alice" } } }, error: null });
  mocks.write.mockImplementation(async () => {
    // A real task boundary would close an IDB transaction held across this request.
    await new Promise((resolve) => setTimeout(resolve, 1));
    return { error: null };
  });
  const db = (await getDB())!;
  await db.clear("mutation_queue");
  await db.clear("sync_metadata");
  await db.clear("learner_state");
});

describe("account sync queue", () => {
  it("completes writes across network waits and serializes overlapping flushes", async () => {
    const db = (await getDB())!;
    await db.put("sync_metadata", { ownerId: "alice" }, "account");
    await queueMutation("add_xp", { xp: 20 });
    await Promise.all([syncQueue(), syncQueue()]);
    expect(mocks.write).toHaveBeenCalledOnce();
    expect(await db.count("mutation_queue")).toBe(0);
  });
  it("retains failed operations and stops before newer snapshots", async () => {
    const db = (await getDB())!;
    await db.put("sync_metadata", { ownerId: "alice" }, "account");
    await queueMutation("add_xp", { xp: 20 });
    await queueMutation("add_xp", { xp: 30 });
    mocks.write.mockResolvedValue({ error: new Error("offline") });
    await expect(syncQueue()).rejects.toThrow("offline");
    expect(mocks.write).toHaveBeenCalledOnce();
    const ops = await db.getAll("mutation_queue");
    expect(ops).toHaveLength(2);
    expect(ops.reduce((n, op) => n + op.retryCount, 0)).toBe(1);
  });
  it("does not upload guest or other-account operations", async () => {
    await queueMutation("add_xp", { xp: 20 });
    await syncQueue();
    const db = (await getDB())!;
    await db.put("sync_metadata", { ownerId: "bob" }, "account");
    await syncQueue();
    expect(mocks.write).not.toHaveBeenCalled();
    expect(await db.count("mutation_queue")).toBe(1);
  });
  it("recovers operations interrupted while syncing", async () => {
    const db = (await getDB())!;
    await db.put("sync_metadata", { ownerId: "alice" }, "account");
    await db.put("mutation_queue", {
      id: "interrupted",
      ownerId: "alice",
      type: "add_xp",
      payload: { xp: 30 },
      createdAt: "2026-09-04",
      status: "syncing",
      retryCount: 0,
    });
    await syncQueue();
    expect(await db.count("mutation_queue")).toBe(0);
  });
});

describe("guest migration", () => {
  it("reuses its receipt and canonical state after a failed response", async () => {
    const db = (await getDB())!;
    const local = structuredClone(INITIAL_LEARNER_STATE);
    local.learnerProgress.xp = 20;
    await db.put("learner_state", local, LEARNER_STATE_KEY);
    await queueMutation("add_xp", { xp: 20 });
    mocks.rpc.mockResolvedValueOnce({ error: { message: "network" }, data: null });
    await expect(migrateGuestToAccount("alice")).rejects.toThrow("local progress is safe");
    expect((await db.get("learner_state", LEARNER_STATE_KEY))?.learnerProgress.xp).toBe(20);
    const merged = structuredClone(local);
    merged.learnerProgress.xp = 120;
    mocks.rpc.mockResolvedValue({ error: null, data: merged });
    await migrateGuestToAccount("alice");
    expect(mocks.rpc.mock.calls[0]).toEqual(mocks.rpc.mock.calls[1]);
    expect((await db.get("learner_state", LEARNER_STATE_KEY))?.learnerProgress.xp).toBe(120);
    expect(await db.count("mutation_queue")).toBe(0);
    await migrateGuestToAccount("alice");
    expect(mocks.rpc).toHaveBeenCalledTimes(2);
  });
  it("preserves progress earned while the migration request is in flight", async () => {
    const db = (await getDB())!;
    const local = structuredClone(INITIAL_LEARNER_STATE);
    local.learnerProgress.xp = 20;
    await db.put("learner_state", local, LEARNER_STATE_KEY);
    mocks.rpc.mockImplementation(async () => {
      const newer = structuredClone(local);
      newer.learnerProgress.xp = 30;
      await db.put("learner_state", newer, LEARNER_STATE_KEY);
      await queueMutation("add_xp", { xp: 30 });
      const remote = structuredClone(local);
      remote.learnerProgress.xp = 120;
      return { data: remote, error: null };
    });
    await migrateGuestToAccount("alice");
    expect((await db.get("learner_state", LEARNER_STATE_KEY))?.learnerProgress.xp).toBe(130);
    expect((await db.getAll("mutation_queue"))[0].payload).toEqual({ xp: 130 });
  });
});
