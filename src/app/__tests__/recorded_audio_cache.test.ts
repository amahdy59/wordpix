import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { IDBFactory } from "fake-indexeddb";
import { Blob as NativeBlob } from "node:buffer";
import {
  AUDIO_CACHE_MAX_ENTRIES,
  getCachedAudio,
  getDB,
  saveCachedAudio,
} from "../../lib/persistence/db";

beforeEach(() => vi.stubGlobal("indexedDB", new IDBFactory()));
afterEach(() => vi.unstubAllGlobals());

it("persists portable audio bytes and reconstructs the original media type and contents", async () => {
  const clip = new Blob([new Uint8Array([1, 5, 9, 13])], { type: "audio/mpeg" });
  await saveCachedAudio("recorded-clip", clip);
  const db = (await getDB())!;
  const stored = (await db.get("audio_cache", "recorded-clip"))!;
  expect(stored.blob).toBeUndefined();
  expect([...new Uint8Array(stored.bytes!)]).toEqual([1, 5, 9, 13]);
  const restored = (await getCachedAudio("recorded-clip"))!;
  expect(restored.type).toBe("audio/mpeg");
  expect([...new Uint8Array(await restored.arrayBuffer())]).toEqual([1, 5, 9, 13]);
  db.close();
});

it("keeps earlier Blob records readable without a database migration or progress reset", async () => {
  const db = (await getDB())!;
  const legacy = new NativeBlob(["previous recording"], { type: "audio/mpeg" });
  await db.put("audio_cache", {
    key: "legacy",
    blob: legacy as unknown as Blob,
    mimeType: "audio/mpeg",
    createdAt: 1,
  });
  const restored = (await getCachedAudio("legacy"))!;
  expect(await restored.text()).toBe("previous recording");
  expect((await db.get("audio_cache", "legacy"))!.lastAccessedAt).toBeGreaterThan(1);
  expect(db.version).toBe(3);
  db.close();
});

it("never writes or returns an empty audio fallback", async () => {
  await saveCachedAudio("empty", new Blob([]));
  const db = (await getDB())!;
  expect(await db.get("audio_cache", "empty")).toBeUndefined();
  await db.put("audio_cache", {
    key: "old-empty",
    bytes: new ArrayBuffer(0),
    mimeType: "audio/mpeg",
    createdAt: 1,
  });
  expect(await getCachedAudio("old-empty")).toBeNull();
  db.close();
});

it("counts portable audio in LRU limits while preserving recently played audio and queued changes", async () => {
  const db = (await getDB())!;
  const operation = {
    id: "queued-preference",
    type: "update_accessibility" as const,
    payload: { speechRate: 0.85 },
    createdAt: "2026-10-29T00:00:00Z",
    status: "pending" as const,
    retryCount: 0,
  };
  await db.put("mutation_queue", operation);
  for (let index = 0; index < AUDIO_CACHE_MAX_ENTRIES; index++)
    await db.put("audio_cache", {
      key: `clip-${index}`,
      bytes: new Uint8Array([index % 255]).buffer,
      mimeType: "audio/mpeg",
      createdAt: index + 1,
    });
  await getCachedAudio("clip-0");
  await saveCachedAudio("new-clip", new Blob(["new recording"], { type: "audio/mpeg" }));
  expect(await db.count("audio_cache")).toBe(AUDIO_CACHE_MAX_ENTRIES);
  expect(await getCachedAudio("clip-0")).not.toBeNull();
  expect(await getCachedAudio("clip-1")).toBeNull();
  expect(await db.get("mutation_queue", operation.id)).toEqual(operation);
  db.close();
});
