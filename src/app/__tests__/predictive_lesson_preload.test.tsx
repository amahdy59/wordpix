import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { usePredictiveLessonPreload } from "../shared/usePredictiveLessonPreload";
import * as courseCatalog from "../data/courseCatalog";
import * as vocabulary from "../data/vocabulary";
import * as audio from "../shared/useAudio";

vi.mock("../shared/useAudio", () => ({
  preloadAudioClip: vi.fn(),
}));

vi.mock("../learning/shared/curriculumAudioManifest", () => ({
  getCurriculumAudioKey: vi.fn((term: string) => `audio/mock/${term}.mp3`),
}));

describe("usePredictiveLessonPreload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not preload when step is less than 3", async () => {
    const loadUnitSpy = vi.spyOn(vocabulary, "loadUnitVocabulary");
    const audioSpy = vi.spyOn(audio, "preloadAudioClip");

    renderHook(() => usePredictiveLessonPreload("colors-1", 1));

    await new Promise((r) => setTimeout(r, 350));
    expect(loadUnitSpy).not.toHaveBeenCalled();
    expect(audioSpy).not.toHaveBeenCalled();
  });

  it("preloads next lesson assets when step is 3 or greater", async () => {
    const mockNextGroup = {
      id: "colors-2",
      name: "Colors 2",
      description: "Next lesson",
      topicId: "colors-2",
      wordIds: ["red", "blue"],
    };
    vi.spyOn(courseCatalog, "getNextGroupChronological").mockReturnValue(mockNextGroup);
    vi.spyOn(courseCatalog, "resolveUnitForLesson").mockReturnValue({
      id: "colors",
      name: "Colors",
      description: "Unit description",
      topics: [],
      groups: [mockNextGroup],
      wordIds: ["red", "blue"],
    });
    vi.spyOn(vocabulary, "loadUnitVocabulary").mockResolvedValue([]);
    vi.spyOn(vocabulary, "getWords").mockReturnValue([
      {
        id: "red",
        label: "red",
        topic: "colors",
        img: "/images/red.webp",
        phonetic: "red",
        description: "Red color",
        arabicTranslation: "أحمر",
      },
    ]);
    const audioSpy = vi.spyOn(audio, "preloadAudioClip");

    renderHook(() => usePredictiveLessonPreload("colors-1", 3));

    await waitFor(
      () => {
        expect(vocabulary.loadUnitVocabulary).toHaveBeenCalledWith("colors");
        expect(audioSpy).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it("respects Save-Data preference and skips preloading", async () => {
    const loadUnitSpy = vi.spyOn(vocabulary, "loadUnitVocabulary");
    Object.defineProperty(navigator, "connection", {
      value: { saveData: true },
      configurable: true,
    });

    renderHook(() => usePredictiveLessonPreload("colors-save-data-test", 4));

    await new Promise((r) => setTimeout(r, 350));
    expect(loadUnitSpy).not.toHaveBeenCalled();

    // Clean up
    Object.defineProperty(navigator, "connection", {
      value: undefined,
      configurable: true,
    });
  });
});
