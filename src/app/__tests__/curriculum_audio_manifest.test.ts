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

  it("resolves newly added Hadith vocabulary phrases", () => {
    expect(getCurriculumAudioKey("give sincere advice")).toMatch(
      /^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/
    );
    expect(getCurriculumAudioKey("change through lawful action")).toMatch(
      /^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/
    );
    expect(getCurriculumAudioKey("reach the clouds")).toMatch(
      /^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/
    );
  });

  it("handles case-insensitivity gracefully", () => {
    const lowerKey = getCurriculumAudioKey("motive");
    const upperKey = getCurriculumAudioKey("Motive");
    expect(lowerKey).toBe(upperKey);
  });

  it("resolves short usage phrases to their content-addressed R2 keys", () => {
    expect(getCurriculumAudioKey("update the software")).toBe(
      "audio/dd/dd62f7d65a3b46a9598fb91d34312a715e1d9d5d47920c82c07453189f1e527e.mp3"
    );
    expect(getCurriculumAudioKey("board the plane")).toBe(
      "audio/2d/2d8ab33ea5dfe6b07be8b3a72425629483c1669acb7c56bd767c44c9c2b2bb3e.mp3"
    );
    expect(getCurriculumAudioKey("check system status")).toBe(
      "audio/ae/ae300f4f66434f3bcd9347d9c86660d5d0c13de910d06259ef3ea153d847fa01.mp3"
    );
  });
});
