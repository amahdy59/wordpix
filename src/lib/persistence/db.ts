import { openDB, type DBSchema } from "idb";
import type {
  LearnerStateSchema,
  SessionRecord,
  LearnerProgressStats,
} from "../../app/context/LearnerContext";
import type { WordLearningState } from "../../features/gamification/sm2";

export type SyncOperation =
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
    };

interface WordPixDB extends DBSchema {
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
    };
  };
}

const DB_NAME = "wordpix_offline_db";
const DB_VERSION = 2;

export const LEARNER_STATE_KEY = "primary_state";

export async function getDB() {
  if (typeof indexedDB === "undefined") {
    console.warn("IndexedDB is not supported in this environment. Falling back.");
    return null;
  }
  return openDB<WordPixDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
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
export async function saveLearnerState(state: LearnerStateSchema): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return;
    await db.put("learner_state", state, LEARNER_STATE_KEY);
  } catch (e) {
    console.error("Failed to save learner state", e);
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
    const op = {
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
    return entry?.blob ?? null;
  } catch (e) {
    console.warn("Failed to retrieve audio from IndexedDB cache", e);
    return null;
  }
}

/**
 * Saves an audio blob to IndexedDB cache for permanent offline reuse.
 */
export async function saveCachedAudio(key: string, blob: Blob): Promise<void> {
  try {
    const db = await getDB();
    if (!db) return;
    await db.put("audio_cache", {
      key,
      blob,
      mimeType: blob.type || "audio/mpeg",
      createdAt: Date.now(),
    });
  } catch (e) {
    console.warn("Failed to save audio to IndexedDB cache", e);
  }
}
