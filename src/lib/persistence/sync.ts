import { getDB, type SyncOperation } from "./db";
import { supabase } from "../supabase/client";

/**
 * Periodically attempts to sync pending operations from the mutation queue to Supabase.
 */
export async function syncQueue() {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction("mutation_queue", "readwrite");
  const store = tx.objectStore("mutation_queue");
  const pendingOps = await store.index("by-status").getAll("pending");

  if (pendingOps.length === 0) {
    return;
  }

  // Check if authenticated
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    // Cannot sync without a session. Wait for login.
    return;
  }

  for (const op of pendingOps) {
    // Mark as syncing
    op.status = "syncing";
    await store.put(op);

    try {
      await processOperation(op, session.user.id);
      
      // If successful, we can delete it from the queue or mark it as synced.
      // We will delete it to keep the queue clean.
      const delTx = db.transaction("mutation_queue", "readwrite");
      await delTx.objectStore("mutation_queue").delete(op.id);
      await delTx.done;
    } catch (err) {
      console.error(`Failed to sync operation ${op.id}`, err);
      // Mark as failed and increment retry count
      const updateTx = db.transaction("mutation_queue", "readwrite");
      op.status = "pending"; // leave it pending for the next cycle
      op.retryCount += 1;
      await updateTx.objectStore("mutation_queue").put(op);
      await updateTx.done;
    }
  }

  await tx.done;
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
      const { error: sessionError } = await supabase
        .from("session_history")
        .upsert({
          user_id: userId,
          session_id: op.payload.sessionId, // For idempotency
          completed_at: op.payload.completedAt,
          score: op.payload.score,
          total_words: op.payload.totalWords,
          xp_breakdown: op.payload.xp,
        });
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
        const { error: wordError } = await supabase
          .from("word_memory")
          .upsert({
            user_id: userId,
            word_id: wordId, // Composite primary key (user_id, word_id)
            state: state,
            updated_at: new Date().toISOString()
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
           sessions_completed: 0 
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
      console.warn(`Unknown operation type: ${op.type}`);
  }
}

// Start a background sync loop
if (typeof window !== "undefined" && typeof process === "undefined") {
  // Sync every 30 seconds
  setInterval(syncQueue, 30000);
  
  // Also attempt sync when coming back online
  window.addEventListener("online", syncQueue);
}

/**
 * Migrates local guest data to a newly authenticated account.
 * Follows the "preserve guest XP/mastery on top of remote, deduplicate progression" policy.
 */
export async function migrateGuestToAccount(userId: string) {
  const db = await getDB();
  if (!db) return;
  const tx = db.transaction("learner_state", "readonly");
  const store = tx.objectStore("learner_state");
  const localState = await store.get("local_user");
  await tx.done;

  if (!localState) return;
  if (localState.learnerProgress.xp === 0 && localState.sessionHistory.length === 0) {
    // Nothing to migrate
    return;
  }

  // 1. Fetch remote profile to merge
  const { data: remoteProfile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("Failed to fetch remote profile for migration", profileError);
    throw profileError;
  }

  // 2. Merge logic
  // XP/Streak: Add local progress to remote progress, because the user did this work while offline/guest.
  const remoteXp = remoteProfile?.xp || 0;
  const remoteSessionsCompleted = remoteProfile?.sessions_completed || 0;
  
  const mergedXp = remoteXp + localState.learnerProgress.xp;
  const mergedSessions = remoteSessionsCompleted + localState.learnerProgress.sessionsCompleted;
  // For streak and days_active, picking the max is safest without complex calendar math.
  const mergedStreak = Math.max(remoteProfile?.streak || 0, localState.learnerProgress.streak);
  const mergedDaysActive = Math.max(remoteProfile?.days_active || 0, localState.learnerProgress.daysActive);

  // 3. Upsert Profile
  await supabase.from("profiles").upsert({
    id: userId,
    xp: mergedXp,
    streak: mergedStreak,
    days_active: mergedDaysActive,
    sessions_completed: mergedSessions,
    // Prefer local preferences as the most recent user intent
    preferences: localState.preferences,
    accessibility: localState.accessibility,
    updated_at: new Date().toISOString()
  });

  // 4. Push session history (append-only, idempotently deduplicated by session_id in DB)
  for (const record of localState.sessionHistory) {
    await supabase.from("session_history").upsert({
      user_id: userId,
      session_id: record.sessionId,
      completed_at: record.completedAt,
      score: record.score,
      total_words: record.totalWords,
      xp_breakdown: record.xp,
    });
  }

  // 5. Push word memory (idempotent upsert)
  for (const [wordId, state] of Object.entries(localState.wordMemory)) {
    await supabase.from("word_memory").upsert({
      user_id: userId,
      word_id: wordId,
      state: state,
      updated_at: new Date().toISOString()
    });
  }

  // 6. Overwrite local IDB with merged progress so UI is immediately correct upon reload
  const mergedState = {
    ...localState,
    learnerProgress: {
      ...localState.learnerProgress,
      xp: mergedXp,
      streak: mergedStreak,
      daysActive: mergedDaysActive,
      sessionsCompleted: mergedSessions,
    }
  };
  
  const writeTx = db.transaction("learner_state", "readwrite");
  await writeTx.objectStore("learner_state").put(mergedState, "local_user");
  await writeTx.done;
}
