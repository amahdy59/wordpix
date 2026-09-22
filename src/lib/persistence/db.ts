import { openDB, type DBSchema } from "idb";
import type {
  LearnerStateSchema,
  SessionRecord,
  LearnerProgressStats,
} from "../../app/context/LearnerContext";
import type { WordLearningState } from "../../features/gamification/sm2";

export type SyncOperation = { ownerId?: string } & (
  | {
      id: string;
      type: "update_preferences";
      payload: Record<string, unknown>;
      createdAt: string;
      status: "pending" | "syncing" | "failed";
      retryCount: number;
    }
  | {
      id: string;
      type: "update_accessibility";
      payload: Record<string, unknown>;
      createdAt: string;
      status: "pending" | "syncing" | "failed";
      retryCount: number;
    }
  | {
      id: string;
      type: "session_completed";
      payload: SessionRecord & {
        learnerProgress: LearnerProgressStats;
        wordMemory: Record<string, WordLearningState>;
      };
      createdAt: string;
      status: "pending" | "syncing" | "failed";
      retryCount: number;
    }
  | {
      id: string;
      type: "add_xp";
      payload: { xp: number };
      createdAt: string;
      status: "pending" | "syncing" | "failed";
      retryCount: number;
    }
  | {
      id: string;
      type: "reset";
      payload: Record<string, never>;
      createdAt: string;
      status: "pending" | "syncing" | "failed";
      retryCount: number;
    }
);

export interface SyncMetadata {
  ownerId: string;
  migration?: { id: string; state: LearnerStateSchema; queueIds: string[] };
}

interface WordPixDB extends DBSchema {
  sync_metadata: { key: string; value: SyncMetadata };
  learner_state: {
    key: string;
    value: LearnerStateSchema;
  };
  mutation_queue: {
    key: string;
    value: SyncOperation;
    indexes: { "by-status": string };
  };
  audio_cache: {
    key: string;
    value: {
      key: string;
      blob: Blob;
      mimeType: string;
      createdAt: number;
      /**
       * Last playback hit. Absent on entries written before this field
       * existed — callers fall back to `createdAt`. Powers LRU eviction.
       */
      lastAccessedAt?: number;
    };
  };
}

const DB_NAME = "wordpix_offline_db";
const DB_VERSION = 3;

export const LEARNER_STATE_KEY = "primary_state";

export async function getDB() {
  if (typeof indexedDB === "undefined") {
    console.warn("IndexedDB is not supported in this environment. Falling back.");
    return null;
  }
  return openDB<WordPixDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("sync_metadata")) db.createObjectStore("sync_metadata");
      if (!db.objectStoreNames.contains("learner_state")) {
        db.createObjectStore("learner_state");
      }
      if (!db.objectStoreNames.contains("mutation_queue")) {
        const queueStore = db.createObjectStore("mutation_queue", { keyPath: "id" });
        queueStore.createIndex("by-status", "status");
      }
      if (!db.objectStoreNames.contains("audio_cache")) {
        db.createObjectStore("audio_cache", { keyPath: "key" });
      }
    },
  });
}

/**
 * Retrieves the canonical learner state from IndexedDB.
 * Falls back to null if not found (letting the context provide defaults).
 */
export async function getLearnerState(): Promise<LearnerStateSchema | null> {
  try {
    const db = await getDB();
    if (!db) return null;
    const state = await db.get("learner_state", LEARNER_STATE_KEY);
    return state ?? null;
  } catch (e) {
    console.error("Failed to get learner state", e);
    return null;
  }
}

/**
 * Saves the learner state to IndexedDB.
 */
export async function saveLearnerState(state: LearnerStateSchema): Promise<boolean> {
  try {
    const db = await getDB();
    if (!db) return false;
    await db.put("learner_state", state, LEARNER_STATE_KEY);
    return true;
  } catch (e) {
    console.error("Failed to save learner state", e);
    return false;
  }
}

/**
 * Pushes a new operation to the mutation queue.
 */
export async function queueMutation<T extends SyncOperation["type"]>(
  type: T,
  payload: Extract<SyncOperation, { type: T }>["payload"]
): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return;
    const metadata = await db.get("sync_metadata", "account");
    const op = {
      ownerId: metadata?.ownerId,
      id: crypto.randomUUID(),
      type,
      payload,
      createdAt: new Date().toISOString(),
      status: "pending",
      retryCount: 0,
    } as SyncOperation;
    await db.put("mutation_queue", op);
  } catch (e) {
    console.error("Failed to queue mutation", e);
  }
}

/**
 * Retrieves cached audio blob from IndexedDB.
 */
export async function getCachedAudio(key: string): Promise<Blob | null> {
  try {
    const db = await getDB();
    if (!db) return null;
    const entry = await db.get("audio_cache", key);
    if (!entry) return null;
    // Record the hit for LRU eviction. Best-effort: a failed touch must
    // never break playback of an entry we already hold.
    try {
      await db.put("audio_cache", { ...entry, lastAccessedAt: Date.now() });
    } catch (touchError) {
      console.warn("Failed to record audio cache hit", touchError);
    }
    return entry.blob;
  } catch (e) {
    console.warn("Failed to retrieve audio from IndexedDB cache", e);
    return null;
  }
}

/**
 * Bounds for the audio blob cache. Eviction touches the audio_cache store
 * only — learner state and the mutation queue are never victims.
 */
export const AUDIO_CACHE_MAX_ENTRIES = 200;
export const AUDIO_CACHE_MAX_BYTES = 96 * 1024 * 1024;

function isQuotaExceededError(error: unknown): boolean {
  if (error instanceof DOMException) {
    return error.name === "QuotaExceededError" || error.code === 22;
  }
  if (error && typeof error === "object" && "name" in error) {
    return (error as { name?: unknown }).name === "QuotaExceededError";
  }
  return false;
}

/**
 * Deletes least-recently-used audio entries until the store is back under
 * both caps. Returns the number of entries removed.
 *
 * NOTE: unexported helper kept internal so the only writers of audio_cache
 * stay in this module.
 */
async function enforceAudioCacheCaps(
  db: NonNullable<Awaited<ReturnType<typeof getDB>>>
): Promise<number> {
  const entries = await db.getAll("audio_cache");
  if (entries.length <= AUDIO_CACHE_MAX_ENTRIES) {
    const bytes = entries.reduce((total, entry) => total + entry.blob.size, 0);
    if (bytes <= AUDIO_CACHE_MAX_BYTES) return 0;
  }
  const byRecency = [...entries].sort(
    (a, b) => (a.lastAccessedAt ?? a.createdAt) - (b.lastAccessedAt ?? b.createdAt)
  );
  let count = entries.length;
  let bytes = entries.reduce((total, entry) => total + entry.blob.size, 0);
  let removed = 0;
  for (const victim of byRecency) {
    if (count <= AUDIO_CACHE_MAX_ENTRIES && bytes <= AUDIO_CACHE_MAX_BYTES) break;
    await db.delete("audio_cache", victim.key);
    count -= 1;
    bytes -= victim.blob.size;
    removed += 1;
  }
  return removed;
}

/**
 * Saves an audio blob to IndexedDB cache for permanent offline reuse.
 *
 * The store is capped (entry count + total bytes, LRU eviction) and a
 * QuotaExceededError triggers one evict-and-retry before giving up. A dropped
 * write only means the clip streams again next time — playback falls back to
 * the network/TTS path, never to broken state.
 */
export async function saveCachedAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return;
    const record = {
      key,
      blob,
      mimeType: blob.type || "audio/mpeg",
      createdAt: Date.now(),
      lastAccessedAt: Date.now(),
    };
    try {
      await db.put("audio_cache", record);
    } catch (putError) {
      if (!isQuotaExceededError(putError)) throw putError;
      console.warn("Audio cache quota exceeded; evicting LRU entries and retrying");
      await enforceAudioCacheCaps(db);
      await db.put("audio_cache", record);
    }
    try {
      await enforceAudioCacheCaps(db);
    } catch (capError) {
      console.warn("Failed to enforce audio cache caps", capError);
    }
  } catch (e) {
    console.warn("Failed to save audio to IndexedDB cache", e);
  }
}
