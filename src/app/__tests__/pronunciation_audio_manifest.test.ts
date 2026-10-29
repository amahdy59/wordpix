import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  PRONUNCIATION_AUDIO_MANIFEST,
  getPronunciationAudioClip,
  normalizePronunciationAudioLabel,
} from "../learning/foundations/pronunciationAudioManifest";
import { FIGMA_PRONUNCIATION_LESSONS } from "../learning/foundations/figmaPronunciationCatalog";

describe("pronunciation audio manifest", () => {
  it("contains only immutable R2 audio keys", () => {
    const entries = Object.values(PRONUNCIATION_AUDIO_MANIFEST.clips).flat();
    expect(Object.keys(PRONUNCIATION_AUDIO_MANIFEST.clips)).toHaveLength(578);
    expect(entries.length).toBeGreaterThanOrEqual(578);
    expect(
      entries.every((entry) => /^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/.test(entry.objectKey))
    ).toBe(true);
  });

  it("normalizes typographic punctuation without guessing labels", () => {
    expect(normalizePronunciationAudioLabel("  DON’T  ")).toBe("don't");
    expect(getPronunciationAudioClip("cat")?.objectKey).toMatch(/^audio\//);
    expect(getPronunciationAudioClip("definitely-not-a-corpus-label")).toBeNull();
  });

  it("provides authored R2 audio for every curriculum label", () => {
    const sourceLabels = new Set(
      FIGMA_PRONUNCIATION_LESSONS.flatMap((lesson) =>
        lesson.images.map((item) => normalizePronunciationAudioLabel(item.label))
      )
    );
    const resolved = new Set(Object.keys(PRONUNCIATION_AUDIO_MANIFEST.clips));
    const unresolvedKeys = [...sourceLabels].filter((key) => !resolved.has(key));

    expect(sourceLabels.size).toBe(578);
    expect(unresolvedKeys).toHaveLength(0);
    expect([...resolved].every((key) => sourceLabels.has(key))).toBe(true);
  });

  it("uses a reconciliation script that cannot mutate R2", () => {
    const script = fs.readFileSync(
      path.resolve("scripts/reconcile_pronunciation_audio.cjs"),
      "utf8"
    );
    expect(script).not.toMatch(/\br2\.(?:put|remove)\s*\(/);
    expect(script).not.toContain("ELEVENLABS_API_KEY");
  });
});
