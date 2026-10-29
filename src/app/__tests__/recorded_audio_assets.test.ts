import { beforeAll, describe, expect, it } from "vitest";
import { createHash, webcrypto } from "node:crypto";
import { createRequire } from "node:module";
import {
  edgeRecordingKey,
  edgeRecordingPayload,
  normalizeRecordingText,
} from "../shared/edgeRecording";
import { additionalRecordingKey } from "../shared/additionalRecording";
import { isEdgeRecordingAvailable } from "../shared/edgeRecordingAvailability";
import { audioKey } from "../shared/assetUrls";

const require = createRequire(import.meta.url);
const { validateRecording } = require("../../../scripts/lib/recorded_audio_key.cjs");
beforeAll(() => {
  if (!globalThis.crypto?.subtle)
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
});

describe("immutable prerecorded audio", () => {
  it("keeps Node upload validation and browser lookup in agreement for both languages", async () => {
    for (const [text, language, voice] of [
      ["Hello! Welcome to WordPix.", "en", "en-US-JennyNeural"],
      ["أهلاً وسهلاً", "ar", "ar-SA-ZariyahNeural"],
    ]) {
      const edgeKey = await edgeRecordingKey(text, language);
      const hash = createHash("sha256").update(edgeRecordingPayload(text, language)).digest("hex");
      expect(edgeKey).toBe(`audio/edge-v1/${voice}/${hash}.mp3`);
      expect(validateRecording({ text, language, edgeKey })).toEqual({ key: edgeKey, voice });
      expect(edgeKey).not.toBe(await audioKey(text));
    }
  });

  it("normalizes typography but preserves meaningful text, punctuation, case and language", async () => {
    expect(normalizeRecordingText("  Don’t  say “yes”. ")).toBe('Don\'t say "yes".');
    expect(await edgeRecordingKey("Don’t  say yes.")).toBe(
      await edgeRecordingKey("Don't say yes.")
    );
    expect(await edgeRecordingKey("US")).not.toBe(await edgeRecordingKey("us"));
    expect(await edgeRecordingKey("Hello", "ar-SA")).not.toBe(
      await edgeRecordingKey("Hello", "en-US")
    );
    expect(await edgeRecordingKey("   ")).toBeNull();
  });

  it("rejects transcript/key/voice mismatches before generation or upload", async () => {
    const item = {
      text: "Good morning.",
      language: "en",
      edgeKey: await edgeRecordingKey("Good morning."),
    };
    expect(() => validateRecording(item)).not.toThrow();
    for (const changed of [
      { text: "Good evening." },
      { language: "ar" },
      { language: "__proto__" },
      { edgeKey: "audio/aa/old.mp3" },
      { edgeKey: "../private.mp3" },
    ])
      expect(() => validateRecording({ ...item, ...changed })).toThrow();
  });

  it("links a known existing take by its exact transcript without crossing languages", async () => {
    expect(await additionalRecordingKey("break the ice")).toBe(
      "audio/3f/3fb64d68e967e3868e39cdfbdbaad5cb0eb4b50f3ff3d096bacc2bd59941a110.mp3"
    );
    expect(await additionalRecordingKey("break the ice", "ar")).toBeNull();
    expect(
      await additionalRecordingKey("a transcript that has never been recorded 123xyz")
    ).toBeNull();
  });

  it("only prioritizes uploaded Edge clips included in the verified index", async () => {
    const verified = await edgeRecordingKey("Hello! Welcome to WordPix.");
    expect(await isEdgeRecordingAvailable(verified!)).toBe(true);
    expect(
      await isEdgeRecordingAvailable(`audio/edge-v1/en-US-JennyNeural/${"0".repeat(64)}.mp3`)
    ).toBe(false);
    expect(await isEdgeRecordingAvailable("https://example.com/audio.mp3")).toBe(false);
  });
});
