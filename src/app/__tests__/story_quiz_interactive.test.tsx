import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { getOrGenerateStoryBundle } from "../data/storyTalesDictionary";
import { BEDROOM_VOCABULARY, BEDROOM_GROUPS } from "../data/lessons";

describe("Story Suite & Vocabulary-Centric Quizzes", () => {
  it("ensures all bedroom groups have bespoke stories and 3 quiz questions", () => {
    BEDROOM_GROUPS.forEach((group) => {
      const bundle = getOrGenerateStoryBundle(
        group.id,
        group.name,
        BEDROOM_VOCABULARY.filter((w) => group.wordIds.includes(w.id))
      );
      expect(bundle, `Group ${group.id} must have bespoke story bundle`).toBeDefined();
      expect(bundle.passages.length).toBe(3);

      // Verify each passage has English and Arabic
      bundle.passages.forEach((p, idx) => {
        expect(p.text.length, `Passage ${idx + 1} text in ${group.id}`).toBeGreaterThan(30);
        expect(p.textArabic.length, `Passage ${idx + 1} textArabic in ${group.id}`).toBeGreaterThan(
          20
        );
      });

      // Verify 3 quiz questions
      expect(bundle.quiz.length).toBe(3);

      // Verify quiz questions have 4 options
      expect(bundle.quiz[0].options.length).toBe(4);
      expect(bundle.quiz[1].options.length).toBe(4);
      expect(bundle.quiz[2].options.length).toBe(4);

      // Verify authentic Arabic explanations
      bundle.quiz.forEach((q) => {
        expect(q.explanation.length).toBeGreaterThan(10);
        expect(q.explanationArabic?.length).toBeGreaterThan(5);
      });
    });
  });

  it("renders the interactive card stepper quiz and enables selecting answers", () => {
    const dispatch = vi.fn();
    const bedroomWords = BEDROOM_VOCABULARY.filter((w) => BEDROOM_GROUPS[0].wordIds.includes(w.id));

    render(
      <ExerciseStory step={5} words={bedroomWords} lessonId="bedroom-1" dispatch={dispatch} />
    );

    // Switch to section 5: Quiz
    const quizTab = screen.getByRole("button", { name: /5\. Quiz/i });
    fireEvent.click(quizTab);

    // Question 1 should be visible
    expect(screen.getByText(/Question 1 of 3/i)).toBeInTheDocument();

    // Option button is present (A small nightstand with a lamp and an alarm clock)
    const nightstandOption = screen.getByRole("button", { name: /small nightstand/i });
    expect(nightstandOption).toBeInTheDocument();

    // Select option
    fireEvent.click(nightstandOption);

    // Explanation should appear
    expect(screen.getByText(/The text states: 'Next to the bed/i)).toBeInTheDocument();

    // Navigate to Question 2
    const nextQBtn = screen.getByRole("button", { name: /Next Question/i });
    fireEvent.click(nextQBtn);

    expect(screen.getByText(/Question 2 of 3/i)).toBeInTheDocument();
  });
});
