import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExerciseQuickQuiz } from "../exercises/ExerciseQuickQuiz";
import { ExerciseListenRepeat } from "../exercises/ExerciseListenRepeat";
import { ExerciseShell } from "../shared/ExerciseShell";
import { BEDROOM_VOCABULARY } from "../data/lessons";

describe("Dynamic Progress Bar Tracking Across Exercises", () => {
  it("renders accurate dynamic percentage when progress object is passed to ExerciseShell", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseShell
        step={0}
        title="Test Dynamic"
        words={BEDROOM_VOCABULARY}
        lessonId="bedroom-1"
        dispatch={dispatch}
        progress={{ current: 18, total: 20 }}
        footer={<div>Footer</div>}
      >
        <div>Content</div>
      </ExerciseShell>
    );

    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuenow", "90");
    const fill = bar.firstElementChild as HTMLElement;
    expect(fill.style.width).toBe("90%");
  });

  it("updates ExerciseQuickQuiz progress bar to match current question in drill queue", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseQuickQuiz
        step={5}
        words={BEDROOM_VOCABULARY}
        lessonId="bedroom-1"
        dispatch={dispatch}
      />
    );

    const bar = screen.getByRole("progressbar");
    // Initial position is Question 1 of BEDROOM_VOCABULARY.length (10) -> 10%
    const expectedPct = Math.round((1 / BEDROOM_VOCABULARY.length) * 100).toString();
    expect(bar).toHaveAttribute("aria-valuenow", expectedPct);
  });

  it("updates ExerciseListenRepeat progress bar based on active word index", () => {
    const dispatch = vi.fn();
    render(
      <ExerciseListenRepeat
        step={1}
        words={BEDROOM_VOCABULARY}
        lessonId="bedroom-1"
        dispatch={dispatch}
      />
    );

    const bar = screen.getByRole("progressbar");

    expect(bar).toHaveAttribute("aria-valuenow", "1");
    expect(bar).toHaveAttribute("aria-valuemax", String(BEDROOM_VOCABULARY.length));
    expect(bar).toHaveAccessibleName("Word progress");
    expect(bar).toHaveAttribute("aria-valuetext", `Word 1 of ${BEDROOM_VOCABULARY.length}`);
  });
});
