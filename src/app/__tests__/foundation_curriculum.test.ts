import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FOUNDATION_CURRICULUM_SCHEMA_VERSION,
  FOUNDATION_LESSON_IDS,
  FOUNDATION_LESSONS,
  FOUNDATION_PICTURE_WORDS,
  FOUNDATION_STAGES,
  LEVEL_ONE_UNITS,
  LEVEL_ZERO_UNITS,
  getFoundationLesson,
} from "../learning/foundations/foundationCurriculum";
import { validateFoundationCurriculum } from "../learning/foundations/foundationCurriculumSchema";
import {
  checkpointFoundationLesson,
  completeFoundationLesson,
  getRecommendedFoundationLessonId,
} from "../learning/foundations/foundationProgress";
import { audioKey } from "../shared/assetUrls";
import { reducer } from "../store/reducer";
import { hashToScreen, screenToHash } from "../router/useHashRouter";

describe("foundation curriculum", () => {
  it("preserves the authored unit and lesson progression", () => {
    expect(LEVEL_ZERO_UNITS.map((unit) => unit.id)).toEqual(["0.1", "0.2", "0.3", "0.4", "0.5"]);
    expect(LEVEL_ZERO_UNITS.flatMap((unit) => unit.lessons.map((lesson) => lesson.id))).toEqual([
      "same-or-different",
      "count-words",
      "clap-syllables",
      "rhyme-recognition",
      "same-beginning",
      "first-sound",
      "final-sound",
      "blend-and-segment",
    ]);
    expect(LEVEL_ONE_UNITS[0].lessons).toHaveLength(8);
    expect(FOUNDATION_LESSONS).toHaveLength(16);
  });

  it("organizes every lesson once in a clear two-stage journey", () => {
    expect(FOUNDATION_STAGES.map((stage) => stage.title)).toEqual([
      "Listening foundations",
      "First letters and words",
    ]);
    const stagedLessonIds: string[] = [];
    for (const stage of FOUNDATION_STAGES) {
      for (const unit of stage.units) {
        stagedLessonIds.push(...unit.lessons.map((lesson) => lesson.id));
      }
    }
    expect(stagedLessonIds).toEqual(FOUNDATION_LESSONS.map((lesson) => lesson.id));
    for (const stage of FOUNDATION_STAGES) {
      for (const unit of stage.units) {
        expect(unit.outcome.length).toBeGreaterThan(20);
      }
    }
  });

  it("resumes the last unfinished lesson without locking exploratory navigation", () => {
    const opened = checkpointFoundationLesson({}, "short-a", 4, { 0: true }, "2026-09-20");
    expect(getRecommendedFoundationLessonId(FOUNDATION_LESSON_IDS, opened)).toBe("short-a");

    const mastered = completeFoundationLesson(opened, "short-a", 8, 8, 10, { 0: true });
    expect(getRecommendedFoundationLessonId(FOUNDATION_LESSON_IDS, mastered)).toBe(
      "same-or-different"
    );
    expect(mastered["short-a"]?.status).toBe("mastered");
  });

  it("marks a low-scoring completed lesson for practice instead of mastery", () => {
    const progress = completeFoundationLesson({}, "sound-s", 3, 6, 8, { 0: true, 1: false });
    expect(progress["sound-s"]).toMatchObject({
      status: "needs-practice",
      lastScorePercent: 50,
      sessions: 1,
    });
  });

  it("validates the versioned curriculum contract at runtime", () => {
    expect(() =>
      validateFoundationCurriculum({
        schemaVersion: FOUNDATION_CURRICULUM_SCHEMA_VERSION,
        lessons: FOUNDATION_LESSONS,
        stages: FOUNDATION_STAGES,
      })
    ).not.toThrow();
  });

  it("uses the complete authored Same or Different practice bank", () => {
    const lesson = getFoundationLesson("same-or-different");
    expect(lesson.models).toHaveLength(2);
    expect(lesson.questions).toHaveLength(12);
    expect(lesson.questions.slice(-4).map((question) => question.audio)).toEqual([
      "hat. hat.",
      "cup. bus.",
      "map. mat.",
      "log. log.",
    ]);
  });

  it("routes directly to the listening lesson", () => {
    const screen = reducer(
      { id: "explore" },
      { type: "START_FOUNDATION_LESSON", lessonId: "same-or-different" }
    );
    expect(screen).toEqual({ id: "foundation-lesson", lessonId: "same-or-different" });
    expect(screenToHash(screen).hash).toBe("#/foundations/same-or-different");
    expect(hashToScreen("#/foundations/same-or-different")?.screen).toEqual(screen);
    expect(hashToScreen("#/foundations/spell-satp")?.screen).toEqual({
      id: "foundation-lesson",
      lessonId: "spell-satp",
    });
  });

  it("provides valid picture-word previews without using people", () => {
    const pictureWords = Object.values(FOUNDATION_PICTURE_WORDS).flat();
    expect(Object.keys(FOUNDATION_PICTURE_WORDS)).toHaveLength(12);
    expect(pictureWords.length).toBeGreaterThanOrEqual(40);

    for (const picture of pictureWords) {
      expect(picture.src).toMatch(/\.(?:avif|png)$/);
      expect(existsSync(resolve(process.cwd(), "public", picture.src.replace(/^\//, "")))).toBe(
        true
      );
    }
  });

  it("has a non-empty local ElevenLabs clip for every foundation utterance", async () => {
    const texts = new Set(
      FOUNDATION_LESSONS.flatMap((lesson) => [
        ...lesson.models.map((model) => model.audio),
        ...lesson.questions.map((question) => question.audio),
        ...lesson.questions.flatMap((question) =>
          question.options.flatMap((option) => (option.audio ? [option.audio] : []))
        ),
        ...(FOUNDATION_PICTURE_WORDS[lesson.id] ?? []).map((picture) => picture.word),
      ])
    );

    expect(texts.size).toBe(133);
    for (const text of texts) {
      const key = await audioKey(text);
      expect(key).not.toBeNull();
      const path = resolve(process.cwd(), "public", key!);
      expect(existsSync(path)).toBe(true);
      expect(statSync(path).size).toBeGreaterThan(0);
    }
  });

  it("keeps spoken answer choices interactive instead of narrating option numbers", () => {
    const interactiveQuestions = FOUNDATION_LESSONS.flatMap((lesson) => lesson.questions).filter(
      (question) => question.options.some((option) => option.audio)
    );

    expect(interactiveQuestions.length).toBeGreaterThan(30);
    for (const question of interactiveQuestions) {
      expect(question.audio.toLowerCase()).not.toContain("choice one");
      expect(question.audio.toLowerCase()).not.toContain("choice two");
      expect(question.options.every((option) => Boolean(option.audio))).toBe(true);
      for (const option of question.options) {
        if (option.mediaKind === "photo") expect(option.image).toBeDefined();
        if (!option.image) continue;
        expect(
          existsSync(resolve(process.cwd(), "public", option.image.src.replace(/^\//, "")))
        ).toBe(true);
      }
    }
  });

  it("uses audible example cues instead of isolated target phonemes", () => {
    for (const id of ["sound-s", "short-a", "sound-t", "sound-p"] as const) {
      const lesson = getFoundationLesson(id);
      expect(lesson.models[0].audio).toMatch(/^Listen for .+, as in .+\.$/);
      expect(
        lesson.questions.slice(0, 4).every((question) => question.audio === lesson.models[0].audio)
      ).toBe(true);
    }
  });
});
