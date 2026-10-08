import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../context/I18nContext";
import { HadithPractice } from "../learning/hadith/HadithPractice";
import { getHadithExerciseSet } from "../learning/hadith/hadithExerciseCatalog";

describe("focused Hadith practice", () => {
  it("shows one question, retains its answer on return, and keeps the total score", () => {
    const set = getHadithExerciseSet("hadith-02")!;
    const { container } = render(
      <I18nProvider>
        <HadithPractice exerciseSet={set} onScoreChange={vi.fn()} />
      </I18nProvider>
    );
    expect(container.querySelectorAll("[data-quiz-question]")).toHaveLength(1);
    const first = set.exercises[0];
    if (first.type !== "single-choice") throw new Error("Expected first choice question");
    const answer = first.options.find((option) => option.id === first.answerId)!;
    fireEvent.click(screen.getByRole("radio", { name: answer.label }));
    fireEvent.click(screen.getByRole("button", { name: "Next Question" }));
    expect(screen.queryByRole("radio", { name: answer.label })).not.toBeInTheDocument();
    expect(container.querySelectorAll("[data-quiz-question]")).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Previous Question" }));
    expect(screen.getByRole("radio", { name: answer.label })).toBeChecked();
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuemax", "10");
  });
});
