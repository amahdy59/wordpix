import { describe, expect, it, beforeAll } from "vitest";
import { createRequire } from "node:module";
import { audioHash, audioKey, normaliseText, AUDIO_PROFILE } from "../shared/assetUrls";

const require = createRequire(import.meta.url);
// The generator's implementation, loaded directly so the two are compared
// rather than assumed equal.
const generator = require("../../../scripts/lib/assetKey.cjs");

/**
 * happy-dom does not implement Web Crypto, but the browser and Node both do.
 * Borrowing Node's keeps the assertions about agreement meaningful.
 */
beforeAll(async () => {
  if (!globalThis.crypto?.subtle) {
    const { webcrypto } = await import("node:crypto");
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
  }
});

const SAMPLES = [
  "toothbrush",
  "Towel Rack",
  "dental floss",
  "Every morning starts in the bathroom.",
  "throw in the towel",
  "I squeeze blank onto my toothbrush every morning.",
  "Did you brush your teeth yet?",
  // Punctuation and quoting variants that normalisation should collapse.
  "  spaced   out  ",
  "curly ‘quotes’ here",
];

describe("audio asset keys", () => {
  /**
   * The whole scheme rests on this. The generator uploads to a key derived
   * from the text; the browser derives the same key to find it. If the two
   * implementations drift, nothing errors — every lookup just 404s and the app
   * silently falls back to robotic speech synthesis, having already paid for
   * clips nobody can reach.
   */
  it("derives identical keys in the browser and the generator", async () => {
    for (const text of SAMPLES) {
      const browser = await audioHash(text);
      expect(browser, `no hash for ${JSON.stringify(text)}`).toBeTruthy();
      expect(browser, `hash mismatch for ${JSON.stringify(text)}`).toBe(generator.audioHash(text));
    }
  });

  it("derives identical object keys", async () => {
    for (const text of SAMPLES) {
      expect(await audioKey(text)).toBe(generator.audioKey(text));
    }
  });

  it("shares one voice profile", () => {
    expect(AUDIO_PROFILE.voiceId).toBe(generator.AUDIO_PROFILE.voiceId);
    expect(AUDIO_PROFILE.modelId).toBe(generator.AUDIO_PROFILE.modelId);
    expect(AUDIO_PROFILE.stability).toBe(generator.AUDIO_PROFILE.stability);
    expect(AUDIO_PROFILE.similarityBoost).toBe(generator.AUDIO_PROFILE.similarityBoost);
  });

  it("normalises text the same way on both sides", () => {
    for (const text of SAMPLES) {
      expect(normaliseText(text)).toBe(generator.normaliseText(text));
    }
  });
});

describe("de-duplication", () => {
  /** Trivial formatting differences must not buy a second copy of a clip. */
  it("collapses whitespace and curly quotes to one key", async () => {
    expect(await audioHash("the  library")).toBe(await audioHash("the library"));
    expect(await audioHash(" library ")).toBe(await audioHash("library"));
    expect(await audioHash("don’t")).toBe(await audioHash("don't"));
  });

  /** Case is meaningful to a speech engine, so it must not be collapsed. */
  it("keeps case distinct", async () => {
    expect(await audioHash("US")).not.toBe(await audioHash("us"));
  });

  it("shards keys by the first two hex characters", async () => {
    const key = await audioKey("toothbrush");
    const hash = await audioHash("toothbrush");
    expect(key).toBe(`audio/${hash!.slice(0, 2)}/${hash}.mp3`);
  });
});

describe("asset host configuration", () => {
  /**
   * With no bucket configured the app must degrade to speech synthesis rather
   * than requesting a malformed URL — that is the state of any dev checkout
   * without VITE_ASSET_BASE_URL set.
   */
  it("returns no URL when no asset host is configured", async () => {
    const { audioUrl, hasAssetHost } = await import("../shared/assetUrls");
    if (!hasAssetHost()) {
      expect(await audioUrl("toothbrush")).toBeNull();
    } else {
      expect(await audioUrl("toothbrush")).toMatch(/^https?:\/\/.+\/audio\/[0-9a-f]{2}\//);
    }
  });
});
