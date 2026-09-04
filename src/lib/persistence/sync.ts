import { getDB, LEARNER_STATE_KEY, type SyncOperation } from "./db";
import { supabase } from "../supabase/client";

// Serialize timer, online and sign-in requests in this tab.
let activeSync: Promise<void> | undefined;
export function syncQueue(): Promise<void> {
  if (!activeSync)
    activeSync = flushQueue().finally(() => {
      activeSync = undefined;
    });
  return activeSync;
}

async function flushQueue() {
  const db = await getDB();
  if (!db) return;
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session) return;
  const metadata = await db.get("sync_metadata", "account");
  // Guest operations belong to a migration; never send them to an arbitrary account.
  if (metadata?.ownerId !== session.user.id || metadata.migration) return;
  const pendingOps = (await db.getAll("mutation_queue"))
    .filter((op) => op.ownerId === session.user.id && op.status !== "failed")
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  for (const op of pendingOps) {
    const { data: current } = await supabase.auth.getSession();
    if (current.session?.user.id !== session.user.id) return;
    // Each IDB write completes before network I/O. Also retries interrupted 'syncing' entries.
    await db.put("mutation_queue", { ...op, status: "syncing" });
    try {
      await processOperation(op, session.user.id);
      await db.delete("mutation_queue", op.id);
    } catch (error) {
      await db.put("mutation_queue", { ...op, status: "pending", retryCount: op.retryCount + 1 });
      throw error; // Preserve ordering: a failed older snapshot must not overwrite a newer one later.
    }
  }
}

/**
 * Executes a single operation against the Supabase backend.
 */
async function processOperation(op: SyncOperation, userId: string) {
  switch (op.type) {
    case "update_preferences": {
      const { error } = await supabase
        .from("profiles")
        .update({ preferences: op.payload, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;
      break;
    }
    case "update_accessibility": {
      const { error } = await supabase
        .from("profiles")
        .update({ accessibility: op.payload, updated_at: new Date().toISOString() })
        .eq("id", userId);
      if (error) throw error;
      break;
    }
    case "session_completed": {
      // 1. Insert session history
      const { error: sessionError } = await supabase.from("session_history").upsert(
        {
          user_id: userId,
          session_id: op.payload.sessionId, // For idempotency
          completed_at: op.payload.completedAt,
          score: op.payload.score,
          total_words: op.payload.totalWords,
          xp_breakdown: op.payload.xp,
        },
        { onConflict: "user_id,session_id", ignoreDuplicates: true }
      );
      if (sessionError) throw sessionError;

      // 2. Update profiles (xp, streak, daysActive)
      // Since this is a distributed system, we should either rely on Rpc/Edge functions or
      // just push the client's calculated state as the source of truth for now.
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          xp: op.payload.learnerProgress.xp,
          streak: op.payload.learnerProgress.streak,
          days_active: op.payload.learnerProgress.daysActive,
          last_studied_date: op.payload.learnerProgress.lastStudiedDate,
          sessions_completed: op.payload.learnerProgress.sessionsCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (profileError) throw profileError;

      // 3. Update word memory for each word
      for (const [wordId, state] of Object.entries(op.payload.wordMemory)) {
        const { error: wordError } = await supabase.from("word_memory").upsert({
          user_id: userId,
          word_id: wordId, // Composite primary key (user_id, word_id)
          state: state,
          updated_at: new Date().toISOString(),
        });
        if (wordError) throw wordError;
      }
      break;
    }
    case "add_xp": {
      const { error } = await supabase
        .from("profiles")
        .update({
          xp: op.payload.xp,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
      if (error) throw error;
      break;
    }
    case "reset": {
      // Clear data from server
      const { error } = await supabase
        .from("profiles")
        .update({
          xp: 0,
          streak: 0,
          days_active: 0,
          sessions_completed: 0,
          last_studied_date: null,
        })
        .eq("id", userId);
      if (error) throw error;

      const { error: wordError } = await supabase
        .from("word_memory")
        .delete()
        .eq("user_id", userId);
      if (wordError) throw wordError;

      const { error: historyError } = await supabase
        .from("session_history")
        .delete()
        .eq("user_id", userId);
      if (historyError) throw historyError;

      break;
    }
    default:
      throw new Error(`Unknown operation type: ${(op as SyncOperation).type}`);
  }
}

// Start a background sync loop
if (typeof window !== "undefined" && typeof process === "undefined") {
  // Sync every 30 seconds
  setInterval(() => {
    void syncQueue().catch(() => {
      /* Retry on the next cycle. */
    });
  }, 30000);

  // Also attempt sync when coming back online
  window.addEventListener("online", () => {
    void syncQueue().catch(() => {
      /* Keep queued data. */
    });
  });
}

/** A frozen payload and server receipt make retries safe after an uncertain response. */
export async function migrateGuestToAccount(userId: string) {
  const db = await getDB();
  if (!db) throw new Error("Local storage is unavailable. Your progress has not been synced.");
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) throw error;
  if (session?.user.id !== userId) throw new Error("Sign in again before syncing progress.");
  if (activeSync) await activeSync;
  const tx = db.transaction(["sync_metadata", "learner_state", "mutation_queue"], "readwrite");
  let metadata = await tx.objectStore("sync_metadata").get("account");
  if (metadata && metadata.ownerId !== userId) {
    await tx.done;
    throw new Error(
      "This device's progress belongs to another account. Use that account to sync it."
    );
  }
  if (!metadata) {
    const state = await tx.objectStore("learner_state").get(LEARNER_STATE_KEY);
    if (!state) {
      await tx.done;
      throw new Error("Progress is still loading. Please try syncing again.");
    }
    const queue = await tx.objectStore("mutation_queue").getAll();
    metadata = {
      ownerId: userId,
      migration: { id: crypto.randomUUID(), state, queueIds: queue.map((op) => op.id) },
    };
    await tx.objectStore("sync_metadata").put(metadata, "account");
  }
  await tx.done;
  if (!metadata.migration) {
    await syncQueue();
    return;
  }
  const snapshot = metadata.migration;
  const { data, error: migrationError } = await supabase.rpc("merge_guest_progress", {
    migration_id: snapshot.id,
    expected_user: userId,
    guest_state: snapshot.state,
  });
  if (migrationError)
    throw new Error(
      "Signed in, but progress sync could not finish. Your local progress is safe. Retry sync after the connection and database setup are ready."
    );
  // Validate the server response before replacing any local data.
  if (
    !data ||
    typeof data !== "object" ||
    !data.learnerProgress ||
    !data.wordMemory ||
    typeof data.wordMemory !== "object" ||
    Array.isArray(data.wordMemory) ||
    ![
      data.learnerProgress.xp,
      data.learnerProgress.sessionsCompleted,
      data.learnerProgress.streak,
      data.learnerProgress.daysActive,
    ].every((value) => typeof value === "number" && Number.isFinite(value) && value >= 0) ||
    !Array.isArray(data.learnerProgress.completedSessionIds) ||
    !data.learnerProgress.completedSessionIds.every((id: unknown) => typeof id === "string") ||
    !Array.isArray(data.sessionHistory) ||
    !data.sessionHistory.every(
      (record: { sessionId?: unknown; completedAt?: unknown } | null) =>
        record && typeof record.sessionId === "string" && typeof record.completedAt === "string"
    )
  ) {
    throw new Error("The sync response was incomplete. Your local progress is safe.");
  }
  const remote = data as typeof snapshot.state;
  const finish = db.transaction(["learner_state", "sync_metadata", "mutation_queue"], "readwrite");
  const latestMetadata = await finish.objectStore("sync_metadata").get("account");
  if (latestMetadata?.migration?.id !== snapshot.id) {
    await finish.done;
    return;
  }
  const current =
    (await finish.objectStore("learner_state").get(LEARNER_STATE_KEY)) ?? snapshot.state;
  const xpOffset = remote.learnerProgress.xp - snapshot.state.learnerProgress.xp;
  const sessionOffset =
    remote.learnerProgress.sessionsCompleted - snapshot.state.learnerProgress.sessionsCompleted;
  const wordMemory = { ...remote.wordMemory };
  for (const [id, state] of Object.entries(current.wordMemory)) {
    if (JSON.stringify(state) !== JSON.stringify(snapshot.state.wordMemory[id]))
      wordMemory[id] = state;
  }
  const history = new Map(remote.sessionHistory.map((record) => [record.sessionId, record]));
  current.sessionHistory.forEach((record) => history.set(record.sessionId, record));
  const operations = await finish.objectStore("mutation_queue").getAll();
  const resetDuringMigration = operations.some(
    (op) => op.type === "reset" && !snapshot.queueIds.includes(op.id)
  );
  if (!resetDuringMigration)
    await finish.objectStore("learner_state").put(
      {
        ...current,
        wordMemory,
        sessionHistory: [...history.values()].sort((a, b) =>
          b.completedAt.localeCompare(a.completedAt)
        ),
        learnerProgress: {
          ...remote.learnerProgress,
          xp: current.learnerProgress.xp + xpOffset,
          sessionsCompleted: current.learnerProgress.sessionsCompleted + sessionOffset,
          completedSessionIds: [
            ...new Set([
              ...remote.learnerProgress.completedSessionIds,
              ...current.learnerProgress.completedSessionIds,
            ]),
          ],
          streak: Math.max(remote.learnerProgress.streak, current.learnerProgress.streak),
          daysActive: Math.max(
            remote.learnerProgress.daysActive,
            current.learnerProgress.daysActive
          ),
          lastStudiedDate:
            [remote.learnerProgress.lastStudiedDate, current.learnerProgress.lastStudiedDate]
              .filter(Boolean)
              .sort()
              .at(-1) ?? null,
        },
      },
      LEARNER_STATE_KEY
    );
  for (const op of operations) {
    if (snapshot.queueIds.includes(op.id)) await finish.objectStore("mutation_queue").delete(op.id);
    else {
      op.ownerId = userId;
      if (!resetDuringMigration && op.type === "add_xp") op.payload.xp += xpOffset;
      if (!resetDuringMigration && op.type === "session_completed") {
        op.payload.learnerProgress.xp += xpOffset;
        op.payload.learnerProgress.sessionsCompleted += sessionOffset;
      }
      await finish.objectStore("mutation_queue").put(op);
    }
  }
  await finish.objectStore("sync_metadata").put({ ownerId: userId }, "account");
  await finish.done;
}
