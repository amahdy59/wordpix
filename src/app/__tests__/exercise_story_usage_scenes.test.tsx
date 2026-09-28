import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { COURSE_UNITS, type VocabularyItem } from "../data/lessons";

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
  it("renders authentic Usage Scenes tab and scenario chunks for lessons with curriculum data", async () => {
    const dispatch = vi.fn();

    render(<ExerciseStory step={5} words={mockFarmWords} lessonId="farm-1" dispatch={dispatch} />);

    // Wait for async lazy-load of farm usage data
    await waitFor(() => {
      expect(screen.getByText(/3\. Usage Scenes/i)).toBeInTheDocument();
    });

    // Click the Usage Scenes tab
    const usageTab = screen.getByRole("button", { name: /3\. Usage Scenes/i });
    fireEvent.click(usageTab);

    // Goal and Can-Do statement are displayed
    expect(screen.getByText(/Lesson Mission/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Use the vocabulary from The Farm to understand and communicate/i)
    ).toBeInTheDocument();

    // Chunk stepper buttons are present
    const chunk1Btn = screen.getByRole("tab", { name: /Chunk 1 of 5/i });
    const chunk2Btn = screen.getByRole("tab", { name: /Chunk 2 of 5/i });
    expect(chunk1Btn).toBeInTheDocument();
    expect(chunk2Btn).toBeInTheDocument();

    // Chunk 1 scenario text and check question are displayed
    expect(
      screen.getAllByText(
        /The farmer checks on the cow, pig, and chicken during the morning round/i
      ).length
    ).toBeGreaterThan(0);
    expect(
      screen.getByText(/Which target word best matches the key detail in this scene\?/i)
    ).toBeInTheDocument();

    // Target word buttons are present
    const cowOption = screen.getByRole("button", { name: /^Cow$/i });
    const pigOption = screen.getByRole("button", { name: /^Pig$/i });
    expect(cowOption).toBeInTheDocument();
    expect(pigOption).toBeInTheDocument();

    // Answer the question by clicking Cow
    fireEvent.click(cowOption);

    // Check that Cow option now has success indication
    expect(cowOption).toHaveClass("bg-feedback-success-surface");

    // Switch to Chunk 2
    fireEvent.click(chunk2Btn);

    // Chunk 2 target words and scenario are displayed
    expect(
      screen.getAllByText(
        /The farmer checks on the horse, sheep, and goat during the morning round/i
      ).length
    ).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: /^Horse$/i })).toBeInTheDocument();
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
});
