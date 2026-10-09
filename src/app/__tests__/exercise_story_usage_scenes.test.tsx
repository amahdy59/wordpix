import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { COURSE_UNITS, type VocabularyItem } from "../data/lessons";
import { loadUnitVocabulary } from "../data/vocabulary";
import { loadLessonUsage } from "../data/usageRegistry";
import { I18nProvider } from "../context/I18nContext";
import en from "../../i18n/en.json";
import ar from "../../i18n/ar.json";

const mockFarmWords: VocabularyItem[] = [
  {
    id: "cow",
    label: "Cow",
    phonetic: "kaʊ",
    img: "./word-images/cow.webp",
    topic: "farm",
    description: "A large domesticated animal raised for milk or beef.",
  },
  {
    id: "pig",
    label: "Pig",
    phonetic: "pɪɡ",
    img: "./word-images/pig.webp",
    topic: "farm",
    description: "An omnivorous domesticated animal with a snout.",
  },
  {
    id: "chicken",
    label: "Chicken",
    phonetic: "ˈtʃɪk.ɪn",
    img: "./word-images/chicken.webp",
    topic: "farm",
    description: "A domestic fowl kept for its eggs or meat.",
  },
];

describe("ExerciseStory — Curriculum Usage Scenes Integration", () => {
  afterEach(() => localStorage.removeItem("wordpix:interface-lang"));

  it.each(["en", "ar"] as const)(
    "identifies supporting vocabulary imagery in %s without claiming a whole scene",
    async (lang) => {
      localStorage.setItem("wordpix:interface-lang", lang);
      const locale = lang === "ar" ? ar : en;
      render(
        <I18nProvider>
          <ExerciseStory step={5} words={[]} lessonId="airport-1" dispatch={vi.fn()} />
        </I18nProvider>
      );
      fireEvent.click(await screen.findByRole("button", { name: locale.story.tabUsageScenes }));
      expect(await screen.findByText(`${locale.story.vocabularyReference}:`)).toBeVisible();
      const description = screen.getByText(
        "An empty airport check-in counter with a blank monitor, baggage conveyor and queue barriers beside large terminal windows."
      );
      expect(description).toHaveAttribute("lang", "en");
      expect(description).toHaveAttribute("dir", "ltr");
      expect(screen.queryByText(`${locale.story.chunkVisualBrief}:`)).not.toBeInTheDocument();
    }
  );
  it("shows released usage scenes in the learner experience", async () => {
    const dispatch = vi.fn();

    render(<ExerciseStory step={5} words={mockFarmWords} lessonId="farm-1" dispatch={dispatch} />);

    expect(await screen.findByRole("button", { name: /3\. Usage Scenes/i })).toBeInTheDocument();
  });

  it("gracefully falls back to dialogue for lessons without curriculum usage JSON", async () => {
    const dispatch = vi.fn();
    const bedroomGroup = COURSE_UNITS["bedroom"].groups[0];
    const dummyWords: VocabularyItem[] = [
      {
        id: "bed",
        label: "Bed",
        phonetic: "bɛd",
        img: "./word-images/bed.webp",
        topic: "bedroom",
        description: "A piece of furniture used for sleep.",
      },
    ];

    render(
      <ExerciseStory step={5} words={dummyWords} lessonId={bedroomGroup.id} dispatch={dispatch} />
    );

    // Dialogue tab remains available
    const dialogueTab = screen.getByRole("button", { name: /3\. Dialogue/i });
    expect(dialogueTab).toBeInTheDocument();

    fireEvent.click(dialogueTab);

    // Casual dialogue title is displayed
    expect(screen.getByText(/Casual Conversation Practice \(Alex & Sam\)/i)).toBeInTheDocument();
  });

  it("holds a dictionary-reviewed phrase until its whole lesson is approved", async () => {
    const dispatch = vi.fn();
    const socialGroup = COURSE_UNITS["social-situations"].groups[0];
    const socialWords = await loadUnitVocabulary("social-situations");
    const lessonWords = socialGroup.wordIds
      .map((wordId) => socialWords.find((word) => word.id === wordId))
      .filter((word): word is VocabularyItem => Boolean(word));

    render(
      <ExerciseStory
        step={5}
        words={lessonWords}
        lessonId="social-situations-1"
        dispatch={dispatch}
      />
    );

    const usageButton = await screen.findByRole("button", { name: /3\. (Dialogue|Usage Scenes)/i });
    expect(usageButton).toBeInTheDocument();
    expect(await screen.findByText(/Usage Scenes/i)).toBeInTheDocument();
    fireEvent.click(usageButton);
    const socialUsage = await loadLessonUsage("social-situations-1");
    expect(socialUsage?.usage.phrases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          phrase: "break the ice",
          editorial: expect.objectContaining({ status: "approved" }),
        }),
      ])
    );
  });
});
