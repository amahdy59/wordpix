import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { COURSE_UNITS, type VocabularyItem } from "../data/lessons";
import { loadUnitVocabulary } from "../data/vocabulary";

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
  it("keeps an unapproved usage package out of the learner experience", async () => {
    const dispatch = vi.fn();

    render(<ExerciseStory step={5} words={mockFarmWords} lessonId="farm-1" dispatch={dispatch} />);

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /3\. Dialogue/i })).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: /3\. Usage Scenes/i })).not.toBeInTheDocument();
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

    expect(await screen.findByRole("button", { name: /3\. Dialogue/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /3\. Usage Scenes/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/^break the ice$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Dictionary reviewed$/i)).not.toBeInTheDocument();
  });
});
