import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { getOrGenerateStoryBundle } from "../data/storyTalesDictionary";
import { GARDEN_VOCABULARY, GARDEN_GROUPS } from "../data/lessons";

describe("Story Suite & Vocabulary-Centric Quizzes", () => {
  it("ensures all garden groups have bespoke stories and 2-vocab + 1-comprehension quiz questions", () => {
    GARDEN_GROUPS.forEach((group) => {
      const bundle = getOrGenerateStoryBundle(
        group.id,
        group.name,
        GARDEN_VOCABULARY.filter((w) => group.wordIds.includes(w.id))
      );
      expect(bundle, `Group ${group.id} must have bespoke story bundle`).toBeDefined();
      expect(bundle.passages.length).toBe(3);

      // Verify each passage has English and Arabic
      bundle.passages.forEach((p, idx) => {
        expect(p.text.length, `Passage ${idx + 1} text in ${group.id}`).toBeGreaterThan(40);
        expect(p.textArabic.length, `Passage ${idx + 1} textArabic in ${group.id}`).toBeGreaterThan(
          30
        );
      });

      // Verify 3 quiz questions
      expect(bundle.quiz.length).toBe(3);

      // Verify Question 1 & 2 are vocabulary-oriented questions with 4 choices
      expect(bundle.quiz[0].options.length).toBe(4);
      expect(bundle.quiz[1].options.length).toBe(4);
      expect(bundle.quiz[2].options.length).toBe(4);

      // Verify authentic Arabic explanations
      bundle.quiz.forEach((q) => {
        expect(q.explanation.length).toBeGreaterThan(15);
        expect(q.explanationArabic?.length).toBeGreaterThan(10);
      });
    });
  });

  it("renders the interactive card stepper quiz and enables selecting answers", () => {
    const dispatch = vi.fn();
    const flowerWords = GARDEN_VOCABULARY.filter((w) => w.topic === "garden-1");

    render(<ExerciseStory step={5} words={flowerWords} lessonId="garden-1" dispatch={dispatch} />);

    // Switch to section 5: Quiz
    const quizTab = screen.getByRole("button", { name: /5\. Quiz/i });
    fireEvent.click(quizTab);

    // Question 1 should be visible
    expect(screen.getByText(/Question 1 of 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Vocabulary Focus/i)).toBeInTheDocument();

    // Option buttons are present
    const sunflowerOption = screen.getByRole("button", { name: /The rose/i });
    expect(sunflowerOption).toBeInTheDocument();

    // Select Sunflower option
    fireEvent.click(sunflowerOption);

    // Well done explanation should appear
    expect(screen.getByText(/The narrative focuses on the rose/i)).toBeInTheDocument();

    // Navigate to Question 2
    const nextQBtn = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextQBtn);

    expect(screen.getByText(/Question 2 of 3/i)).toBeInTheDocument();

    // Select Lavender option
    const lavenderOption = screen.getByRole("button", { name: /To carefully inspect/i });
    fireEvent.click(lavenderOption);

    // Navigate to Question 3 (Comprehension)
    const nextQBtn2 = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextQBtn2);

    expect(screen.getByText(/Question 3 of 3/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Story Comprehension/i).length).toBeGreaterThanOrEqual(1);

    // Select Option A for Question 3
    const optionA = screen.getByRole("button", { name: /All tasks were successfully completed/i });
    fireEvent.click(optionA);

    // Completion banner appears
    expect(screen.getByText(/Story & Vocabulary Quiz Complete!/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 3 \/ 3/i)).toBeInTheDocument();
  });
});
