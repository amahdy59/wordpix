import { describe, expect, it } from "vitest";
import {
  HADITH_01,
  HADITH_LESSONS,
  HADITH_STAGE_IDS,
  getHadithLesson,
} from "../learning/hadith/hadithCurriculum";
import {
  HADITH_AUDIO_ASSETS,
  HADITH_AUDIO_PROFILES,
  getHadithRecordedSource,
} from "../learning/hadith/hadithAudioManifest";
import { audioKey } from "../shared/assetUrls";
import { parseHadithVocabulary } from "../learning/hadith/HadithVocabularyStudy";
import { HADITH_THEMES, getHadithTheme } from "../learning/hadith/hadithThemes";
import { getHadithLessonThumbnail } from "../learning/hadith/figmaHadithCatalog";

describe("Hadith curriculum", () => {
  it("imports all 42 Figma lessons and keeps each Hadith in one canonical source block", () => {
    expect(HADITH_LESSONS).toHaveLength(42);
    expect(HADITH_01.source.arabic).toBeTruthy();
    expect(HADITH_01.source.translation).toBeTruthy();

    for (const lesson of HADITH_LESSONS) {
      expect(lesson.source.arabic).toBeTruthy();
      expect(lesson.source.translation).toBeTruthy();
      expect(lesson.stages["read-listen"].text).not.toContain(lesson.source.arabic);
      expect(lesson.stages["read-listen"].text).not.toContain(lesson.source.translation);
    }
  });

  it("uses the four focused learner stages in order", () => {
    expect(HADITH_STAGE_IDS).toEqual(["read-listen", "vocabulary", "practice", "review"]);
  });

  it("resolves a Hadith by stable id", () => {
    expect(getHadithLesson("hadith-01")?.title).toBe("Actions and Intentions");
    expect(getHadithLesson("hadith-42")?.title).toBe("Hope, Prayer, and Forgiveness");
    expect(getHadithLesson("hadith-99")).toBeUndefined();
  });

  it("provides a real thumbnail asset for every Hadith lesson", () => {
    for (const lesson of HADITH_LESSONS) {
      expect(getHadithLessonThumbnail(lesson), lesson.id).toMatchObject({
        imageRef: expect.stringMatching(/^[a-f0-9]+$/),
        label: expect.any(String),
      });
    }
  });

  it("organizes every lesson into one stable thematic chapter", () => {
    expect(HADITH_THEMES).toHaveLength(7);
    for (const lesson of HADITH_LESSONS) {
      expect(getHadithTheme(lesson.number), `Hadith ${lesson.number}`).toBeDefined();
    }
    const covered = HADITH_THEMES.flatMap((theme) =>
      Array.from({ length: theme.end - theme.start + 1 }, (_, index) => theme.start + index)
    );
    expect(covered).toEqual(Array.from({ length: 42 }, (_, index) => index + 1));
  });

  it("maps every canonical source to immutable Arabic and English audio keys", async () => {
    expect(HADITH_AUDIO_ASSETS).toHaveLength(42);
    expect(new Set(HADITH_AUDIO_ASSETS.map((lesson) => lesson.id)).size).toBe(42);
    for (const lesson of HADITH_AUDIO_ASSETS) {
      expect(lesson.arabic.objectKey).toMatch(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/);
      expect(lesson.translation.objectKey).toMatch(/^audio\/[0-9a-f]{2}\/[0-9a-f]{64}\.mp3$/);
      expect(lesson.arabic.objectKey).not.toBe(lesson.translation.objectKey);
      const curriculumLesson = getHadithLesson(lesson.id);
      expect(curriculumLesson).toBeDefined();
      await expect(
        audioKey(getHadithRecordedSource(lesson.id).arabic, HADITH_AUDIO_PROFILES.ar)
      ).resolves.toBe(lesson.arabic.objectKey);
      await expect(
        audioKey(getHadithRecordedSource(lesson.id).translation, HADITH_AUDIO_PROFILES.en)
      ).resolves.toBe(lesson.translation.objectKey);
    }
  });

  it("parses every Hadith 1 vocabulary record without dropping examples or Arabic support", () => {
    const lines = getHadithLesson("hadith-01")!.stages.vocabulary.text;
    expect(parseHadithVocabulary(lines)).toEqual([
      expect.objectContaining({ term: "action", example: expect.stringContaining("action") }),
      expect.objectContaining({ term: "intention", arabic: "النِّيَّات" }),
      expect.objectContaining({ term: "motive" }),
      expect.objectContaining({ term: "migrate" }),
      expect.objectContaining({ term: "worldly gain" }),
    ]);
  });

  it("parses clean warmup questions, non-noisy choices, and deduplicated preview terms for all 42 lessons", async () => {
    const { getParsedHadithStages } = await import("../learning/hadith/hadithLessonContent");
    for (const lesson of HADITH_LESSONS) {
      const { warmup } = getParsedHadithStages(lesson);
      expect(warmup.question, lesson.id).not.toMatch(/^quick (?:poll|self-rating):/i);
      expect(warmup.choices.length, lesson.id).toBeGreaterThanOrEqual(2);
      for (const choice of warmup.choices) {
        expect(choice, `${lesson.id} choice`).not.toMatch(
          /^(?:think about this|preview:|scenario\s+[a-z]:)/i
        );
        expect(choice.endsWith("?"), `${lesson.id} choice should not be a question`).toBe(false);
      }
      const termKeys = warmup.previewTerms.map((t) => t.term.toLowerCase().trim());
      expect(new Set(termKeys).size, `${lesson.id} preview terms deduplicated`).toBe(
        termKeys.length
      );
    }
  });

  it("parses clean review questions without preamble instruction noise across all lessons", async () => {
    const { getParsedHadithStages } = await import("../learning/hadith/hadithLessonContent");
    for (const lesson of HADITH_LESSONS) {
      const { review } = getParsedHadithStages(lesson);
      expect(review.length, lesson.id).toBeGreaterThanOrEqual(1);
      for (const item of review) {
        expect(item.question, lesson.id).not.toMatch(/^answer each question first/i);
        expect(item.question, lesson.id).not.toMatch(/^outcome-aligned/i);
        expect(item.question.length, lesson.id).toBeGreaterThanOrEqual(10);
      }
    }
  });
});
