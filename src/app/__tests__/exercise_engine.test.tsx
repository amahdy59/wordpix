import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { SkillExerciseRunner } from "../exercises/SkillExerciseRunner";
import { EXERCISE_DEFINITIONS, getExerciseDefinition } from "../exercises/content";
import { SKILL_EXERCISE_IDS } from "../exercises/registry";
import {
  isChoiceCorrect,
  isEntryCorrect,
  isMultiCorrect,
  isOrderCorrect,
  isSortCorrect,
  isGraded,
  normaliseAnswer,
  type ChoiceTask,
  type EntryTask,
  type MultiSelectTask,
  type OrderTask,
  type SortTask,
  type ExerciseDefinition,
} from "../exercises/taskTypes";

const wrap = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

beforeEach(() => localStorage.clear());

describe("Answer checking", () => {
  const choice: ChoiceTask = {
    id: "c",
    kind: "choice",
    prompt: "p",
    explanation: "e",
    options: [
      { id: "a", label: "A", correct: true },
      { id: "b", label: "B" },
    ],
  };

  it("marks the correct option", () => {
    expect(isChoiceCorrect(choice, "a")).toBe(true);
    expect(isChoiceCorrect(choice, "b")).toBe(false);
  });

  const entry: EntryTask = {
    id: "e",
    kind: "entry",
    prompt: "p",
    explanation: "e",
    accept: ["Wardrobe", "closet"],
  };

  it("accepts any listed answer, ignoring case and spacing", () => {
    expect(isEntryCorrect(entry, "  wardrobe ")).toBe(true);
    expect(isEntryCorrect(entry, "CLOSET")).toBe(true);
    expect(isEntryCorrect(entry, "dresser")).toBe(false);
  });

  it("tolerates a trailing full stop", () => {
    expect(normaliseAnswer("wardrobe.")).toBe("wardrobe");
    expect(isEntryCorrect(entry, "wardrobe.")).toBe(true);
  });

  const multi: MultiSelectTask = {
    id: "m",
    kind: "multi",
    prompt: "p",
    explanation: "e",
    options: [
      { id: "a", label: "A", correct: true },
      { id: "b", label: "B", correct: true },
      { id: "c", label: "C" },
    ],
  };

  it("requires every correct option and no incorrect ones", () => {
    expect(isMultiCorrect(multi, ["a", "b"])).toBe(true);
    expect(isMultiCorrect(multi, ["b", "a"])).toBe(true);
    expect(isMultiCorrect(multi, ["a"])).toBe(false);
    expect(isMultiCorrect(multi, ["a", "b", "c"])).toBe(false);
  });

  const order: OrderTask = {
    id: "o",
    kind: "order",
    prompt: "p",
    explanation: "e",
    solution: ["The", "lamp", "is", "on"],
  };

  it("requires the exact sequence", () => {
    expect(isOrderCorrect(order, ["The", "lamp", "is", "on"])).toBe(true);
    expect(isOrderCorrect(order, ["lamp", "The", "is", "on"])).toBe(false);
    expect(isOrderCorrect(order, ["The", "lamp", "is"])).toBe(false);
  });

  const sort: SortTask = {
    id: "s",
    kind: "sort",
    prompt: "p",
    explanation: "e",
    buckets: [
      { id: "f", label: "Furniture" },
      { id: "b", label: "Bedding" },
    ],
    items: [
      { id: "i1", label: "Wardrobe", bucketId: "f" },
      { id: "i2", label: "Duvet", bucketId: "b" },
    ],
  };

  it("requires every item in its right bucket", () => {
    expect(isSortCorrect(sort, { i1: "f", i2: "b" })).toBe(true);
    expect(isSortCorrect(sort, { i1: "b", i2: "b" })).toBe(false);
    expect(isSortCorrect(sort, { i1: "f" })).toBe(false);
  });

  it("treats practice tasks as ungraded", () => {
    expect(isGraded({ id: "p", kind: "practice", prompt: "p", explanation: "e", guidance: [] })).toBe(
      false
    );
    expect(isGraded(choice)).toBe(true);
  });
});

describe("SkillExerciseRunner", () => {
  const definition: ExerciseDefinition = {
    id: "test",
    title: "Test Exercise",
    category: "reading",
    step: 1,
    totalSteps: 9,
    tasks: [
      {
        id: "q1",
        kind: "choice",
        prompt: "Which one is right?",
        explanation: "A is right because of reasons.",
        options: [
          { id: "a", label: "Option A", correct: true },
          { id: "b", label: "Option B" },
        ],
      },
      {
        id: "q2",
        kind: "entry",
        prompt: "Type wardrobe",
        explanation: "It is wardrobe.",
        accept: ["wardrobe"],
      },
    ],
  };

  it("shows the prompt and its options", () => {
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });
    expect(screen.getByText("Which one is right?")).toBeTruthy();
    expect(screen.getByRole("button", { name: /Option A/ })).toBeTruthy();
  });

  it("will not check before an answer is given", () => {
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });
    expect(screen.getByRole("button", { name: "Check answer" })).toBeDisabled();
  });

  it("marks a correct answer and explains why", async () => {
    const user = userEvent.setup();
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });

    await user.click(screen.getByRole("button", { name: /Option A/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByText("A is right because of reasons.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Next question" })).toBeTruthy();
  });

  it("marks a wrong answer without hiding the explanation", async () => {
    const user = userEvent.setup();
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });

    await user.click(screen.getByRole("button", { name: /Option B/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));

    expect(screen.getByText("A is right because of reasons.")).toBeTruthy();
  });

  it("selects options with number keys", async () => {
    const user = userEvent.setup();
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });

    await user.keyboard("1");
    expect(screen.getByRole("button", { name: /Option A/ })).toHaveAttribute("aria-pressed", "true");
  });

  it("advances through the exercise to a real score", async () => {
    const user = userEvent.setup();
    render(<SkillExerciseRunner definition={definition} dispatch={vi.fn()} />, { wrapper: wrap });

    await user.click(screen.getByRole("button", { name: /Option A/ }));
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "Next question" }));

    await user.type(screen.getByLabelText("Your answer"), "wardrobe");
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "See results" }));

    expect(screen.getByText(/2 of 2 correct/)).toBeTruthy();
  });

  it("says plainly that a practice-only exercise is not scored", async () => {
    const user = userEvent.setup();
    const practice: ExerciseDefinition = {
      ...definition,
      tasks: [
        {
          id: "p1",
          kind: "practice",
          prompt: "Say it aloud",
          explanation: "Nothing marked.",
          guidance: ["Speak clearly"],
        },
      ],
    };
    render(<SkillExerciseRunner definition={practice} dispatch={vi.fn()} />, { wrapper: wrap });

    expect(screen.getByText(/cannot grade open answers/i)).toBeTruthy();
    await user.click(screen.getByRole("button", { name: "Check answer" }));
    await user.click(screen.getByRole("button", { name: "See results" }));
    expect(screen.getByText(/not scored/i)).toBeTruthy();
  });
});

describe("Exercise content", () => {
  const definitions = Object.values(EXERCISE_DEFINITIONS) as ExerciseDefinition[];

  it("covers most of the hub", () => {
    expect(definitions.length).toBeGreaterThanOrEqual(25);
  });

  it("only defines ids the registry knows about", () => {
    definitions.forEach((d) => {
      expect(SKILL_EXERCISE_IDS, `${d.id} is not a registered exercise`).toContain(d.id);
    });
  });

  it("gives every graded task exactly one reachable correct answer", () => {
    definitions.forEach((definition) => {
      definition.tasks.forEach((task) => {
        if (task.kind === "choice") {
          const correct = task.options.filter((o) => o.correct);
          expect(correct.length, `${definition.id}/${task.id} needs one correct option`).toBe(1);
          expect(task.options.length, `${definition.id}/${task.id} needs distractors`).toBeGreaterThan(1);
        }
        if (task.kind === "multi") {
          expect(
            task.options.filter((o) => o.correct).length,
            `${definition.id}/${task.id} needs correct options`
          ).toBeGreaterThan(0);
        }
        if (task.kind === "entry") {
          expect(task.accept.length, `${definition.id}/${task.id} accepts nothing`).toBeGreaterThan(0);
        }
        if (task.kind === "order") {
          expect(task.solution.length, `${definition.id}/${task.id} has no solution`).toBeGreaterThan(1);
        }
        if (task.kind === "sort") {
          task.items.forEach((item) => {
            expect(
              task.buckets.some((b) => b.id === item.bucketId),
              `${definition.id}/${task.id}: ${item.id} points at a missing bucket`
            ).toBe(true);
          });
        }
      });
    });
  });

  it("explains every task, so a wrong answer teaches something", () => {
    definitions.forEach((definition) => {
      definition.tasks.forEach((task) => {
        expect(task.explanation.length, `${definition.id}/${task.id} has no explanation`).toBeGreaterThan(
          15
        );
      });
    });
  });

  it("has no duplicate option labels within a question", () => {
    definitions.forEach((definition) => {
      definition.tasks.forEach((task) => {
        if (task.kind !== "choice" && task.kind !== "multi") return;
        const labels = task.options.map((o) => o.label);
        expect(new Set(labels).size, `${definition.id}/${task.id} repeats an option`).toBe(labels.length);
      });
    });
  });

  it("resolves through getExerciseDefinition", () => {
    definitions.forEach((d) => {
      expect(getExerciseDefinition(d.id as never)).toBe(d);
    });
  });
});
