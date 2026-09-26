import { describe, expect, it } from "vitest";
import {
  getCurriculumAudioKey,
  CURRICULUM_AUDIO_MANIFEST,
} from "../learning/shared/curriculumAudioManifest";

describe("curriculumAudioManifest", () => {
  it("has valid schema and populated clips", () => {
    expect(CURRICULUM_AUDIO_MANIFEST.schemaVersion).toBe(1);
    expect(CURRICULUM_AUDIO_MANIFEST.profile.voiceId).toBe("XfNU2rGpBa01ckF309OY");
    expect(Object.keys(CURRICULUM_AUDIO_MANIFEST.clips).length).toBeGreaterThan(1000);
  });

  it("resolves sample terms from hadith, conversation, and business", () => {
    expect(getCurriculumAudioKey("intention")).toMatch(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/);
    expect(getCurriculumAudioKey("motive")).toMatch(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/);
    expect(getCurriculumAudioKey("worldly gain")).toMatch(
      /^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/
    );
  });

  it("handles case-insensitivity gracefully", () => {
    const lowerKey = getCurriculumAudioKey("motive");
    const upperKey = getCurriculumAudioKey("Motive");
    expect(lowerKey).toBe(upperKey);
  });
});
