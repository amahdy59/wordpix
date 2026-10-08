import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "../context/I18nContext";
import { SentenceQuestionSupport, resolveSentenceMedia } from "../shared/SentenceQuestionSupport";
import { AUTHORED_LESSON_CONTENT } from "../exercises/content/authoredLessonContent";
import { loadLessonUsageForEditorial } from "../data/usageRegistry";
import type { VocabularyItem } from "../data/courseCatalog";
import { sentenceCloze } from "../exercises/sentenceCloze";

const speak = vi.fn();
const stop = vi.fn();
let audioOptions: { onEnded?: () => void; onError?: () => void };
vi.mock("../shared/useAudio", () => ({
  useAudio: (options: typeof audioOptions) => {
    audioOptions = options;
    return {
      speak,
      stop,
      isPlaying: false,
      isLoading: false,
      isSupported: true,
      isError: false,
    };
  },
}));
afterEach(() => vi.useRealTimers());
const word: VocabularyItem = {
  id: "five",
  label: "Five",
  topic: "numbers-counting",
  img: "/word-images/five.avif",
  phonetic: "",
  description: "A visual representation of this specific concept.",
};

describe("sentence question evidence", () => {
  it("blanks a complete multiword target without altering related words", () => {
    expect(sentenceCloze("Keep the bed sheet on the bed.", "Bed sheet")).toBe(
      "Keep the _____ on the bed."
    );
    expect(sentenceCloze("Use C++ in class.", "C++")).toBe("Use _____ in class.");
    expect(sentenceCloze("Place the red   apple here.", "red apple")).toBe("Place the _____ here.");
  });
  it("uses the reviewed transfer scenes while preserving unrelated sentence media", async () => {
    const usage = await loadLessonUsageForEditorial("numbers-counting-1");
    const office = usage!.usage.scenes.find((scene) => scene.targetWords.includes("Two"))!;
    const officeMedia = resolveSentenceMedia("two", office.scenario, usage);
    expect(officeMedia?.imagePath).toMatch(
      /^usage-illustrations\/v1\/numbers-counting-1-usage-scene-1\//
    );
    expect(officeMedia?.imageAlt).toMatch(/folders/);
    const cafeMedia = resolveSentenceMedia(
      "five",
      "At a café counter, four cups are on one tray, five on another, and six on a third.",
      usage
    );
    expect(cafeMedia?.imagePath).toMatch(
      /^usage-illustrations\/v1\/numbers-counting-1-usage-scene-2\//
    );
    expect(cafeMedia?.imageAlt).toMatch(/cups/);
    expect(resolveSentenceMedia("two", "We have two bags.", usage)?.imagePath).toMatch(
      /^question-images\/v1\/sentence-two\//
    );
  });

  it("retains exact sentence media for every reviewed pilot word", () => {
    for (const lesson of Object.values(AUTHORED_LESSON_CONTENT)) {
      for (const entry of lesson.words) {
        expect(resolveSentenceMedia(entry.id, entry.sentence.full)).toEqual(entry.sentence.media);
        expect(resolveSentenceMedia(entry.id, "A different situation.")).toBeUndefined();
      }
    }
  });

  it("uses a labelled placeholder and a numeric clue instead of unrelated artwork", () => {
    render(
      <I18nProvider>
        <SentenceQuestionSupport
          word={word}
          sentence="There are five cups."
          prompt="There are _____ cups."
          answered={false}
        />
      </I18nProvider>
    );
    expect(screen.getByText(/We’re updating this image/i)).toBeVisible();
    expect(screen.getByText("5")).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    expect(speak).toHaveBeenLastCalledWith("There are", undefined, undefined, {
      synthesisOnly: true,
    });
  });

  it("pauses once for a multiword gap, then reads the remaining context without the answer", () => {
    vi.useFakeTimers();
    speak.mockClear();
    render(
      <I18nProvider>
        <SentenceQuestionSupport
          word={word}
          sentence="There are five blue cups."
          prompt="There are ____ ____ cups."
          answered={false}
        />
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    act(() => audioOptions.onEnded?.());
    act(() => vi.advanceTimersByTime(649));
    expect(speak).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /Stop sentence audio/i })).toBeVisible();
    act(() => vi.advanceTimersByTime(1));
    expect(speak).toHaveBeenLastCalledWith("cups.", undefined, undefined, { synthesisOnly: true });
    act(() => audioOptions.onEnded?.());
    expect(screen.getByRole("button", { name: /Listen to the sentence/i })).toBeVisible();
  });

  it("cancels a pending fragment on stop and on unmount", () => {
    vi.useFakeTimers();
    const view = render(
      <I18nProvider>
        <SentenceQuestionSupport
          word={word}
          sentence="There are five cups."
          prompt="There are ____ cups."
          answered={false}
        />
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    act(() => audioOptions.onEnded?.());
    fireEvent.click(screen.getByRole("button", { name: /Stop sentence audio/i }));
    speak.mockClear();
    act(() => vi.runAllTimers());
    expect(speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    act(() => audioOptions.onEnded?.());
    view.unmount();
    speak.mockClear();
    act(() => vi.runAllTimers());
    expect(speak).not.toHaveBeenCalled();
  });

  it("cancels the gap audio when answered and then reads the complete sentence", () => {
    vi.useFakeTimers();
    const content = (answered: boolean) => (
      <I18nProvider>
        <SentenceQuestionSupport
          word={word}
          sentence="There are five cups."
          prompt="There are ____ cups."
          answered={answered}
        />
      </I18nProvider>
    );
    const view = render(content(false));
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    act(() => audioOptions.onEnded?.());
    view.rerender(content(true));
    speak.mockClear();
    act(() => vi.runAllTimers());
    expect(speak).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    expect(speak).toHaveBeenLastCalledWith("There are five cups.");
    view.rerender(content(false));
    view.rerender(content(true));
    expect(screen.getByRole("button", { name: /Listen to the sentence/i })).toBeVisible();
  });

  it("recovers from a missing scene file without substituting vocabulary media", () => {
    const media = resolveSentenceMedia("five", "I can see five books.");
    render(
      <I18nProvider>
        <SentenceQuestionSupport
          word={word}
          sentence="I can see five books."
          prompt="I can see _____ books."
          answered={true}
          media={media}
        />
      </I18nProvider>
    );
    const image = screen.getByRole("img");
    fireEvent.error(image);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText(/We’re updating this image/i)).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
    expect(speak).toHaveBeenLastCalledWith("I can see five books.");
  });
});
