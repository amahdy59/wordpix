import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../context/I18nContext";
import { CurriculumQuizEngine, type QuizQuestion } from "../shared/CurriculumQuizEngine";

const mockQuestions: QuizQuestion[] = [
  {
    id: "q1",
    stem: "What does 'role' mean?",
    options: [
      {
        value: "a",
        label: "Your function in an organisation",
        accessibleLabel: "A: Your function in an organisation",
      },
      { value: "b", label: "A type of bread", accessibleLabel: "B: A type of bread" },
      { value: "c", label: "A playing card", accessibleLabel: "C: A playing card" },
      { value: "d", label: "A formal greeting", accessibleLabel: "D: A formal greeting" },
    ],
    correctValue: "a",
    explanation: "A 'role' refers to your function or position in an organisation.",
  },
  {
    id: "q2",
    stem: "Choose the correct collocation: 'work ___ clients'",
    options: [
      { value: "a", label: "to", accessibleLabel: "A: to" },
      { value: "b", label: "with", accessibleLabel: "B: with" },
      { value: "c", label: "for", accessibleLabel: "C: for" },
      { value: "d", label: "at", accessibleLabel: "D: at" },
    ],
    correctValue: "b",
    explanation: "We say 'work with clients', not 'work to/for/at clients'.",
  },
];

describe("CurriculumQuizEngine", () => {
  it("renders first question with progress pills (1..N) visible", () => {
    render(
      <I18nProvider>
        <CurriculumQuizEngine questions={mockQuestions} desktopPageSize={1} />
      </I18nProvider>
    );

    // Question stem visible
    expect(screen.getByText("What does 'role' mean?")).toBeInTheDocument();

    // Progress pills: should show pill for Q1 and Q2
    expect(screen.getByRole("list", { name: /question progress/i })).toBeInTheDocument();
    const pills = screen.getAllByRole("listitem");
    expect(pills.length).toBe(2);
  });

  it("reveals feedback and explanation after selecting an option", async () => {
    render(
      <I18nProvider>
        <CurriculumQuizEngine questions={mockQuestions} desktopPageSize={1} />
      </I18nProvider>
    );

    const correctOption = screen.getByRole("radio", {
      name: /A: Your function in an organisation/i,
    });
    await userEvent.click(correctOption);

    // Feedback panel visible
    expect(screen.getByRole("status")).toBeInTheDocument();

    // Explanation text visible
    expect(
      screen.getByText("A 'role' refers to your function or position in an organisation.")
    ).toBeInTheDocument();
  });

  it("advances to next question after answering", async () => {
    render(
      <I18nProvider>
        <CurriculumQuizEngine questions={mockQuestions} desktopPageSize={1} />
      </I18nProvider>
    );

    // Answer Q1
    await userEvent.click(
      screen.getByRole("radio", { name: /A: Your function in an organisation/i })
    );

    // Click Next
    const nextBtn = screen.getByRole("button", { name: /next question/i });
    await userEvent.click(nextBtn);

    // Q2 stem should now be visible
    expect(screen.getByText(/work ___ clients/i)).toBeInTheDocument();
  });

  it("shows completion screen with score after last question", async () => {
    render(
      <I18nProvider>
        <CurriculumQuizEngine questions={mockQuestions} desktopPageSize={1} />
      </I18nProvider>
    );

    // Answer Q1
    await userEvent.click(
      screen.getByRole("radio", { name: /A: Your function in an organisation/i })
    );
    await userEvent.click(screen.getByRole("button", { name: /next question/i }));

    // Answer Q2
    await userEvent.click(screen.getByRole("radio", { name: /B: with/i }));
    await userEvent.click(screen.getByRole("button", { name: /view results/i }));

    // Completion screen
    expect(screen.getByRole("heading", { name: /quiz completed/i })).toBeInTheDocument();
  });

  it("calls onComplete with results when quiz finishes", async () => {
    const onComplete = vi.fn();
    render(
      <I18nProvider>
        <CurriculumQuizEngine
          questions={mockQuestions}
          desktopPageSize={1}
          onComplete={onComplete}
        />
      </I18nProvider>
    );

    await userEvent.click(
      screen.getByRole("radio", { name: /A: Your function in an organisation/i })
    );
    await userEvent.click(screen.getByRole("button", { name: /next question/i }));
    await userEvent.click(screen.getByRole("radio", { name: /B: with/i }));
    await userEvent.click(screen.getByRole("button", { name: /view results/i }));

    expect(onComplete).toHaveBeenCalledWith({ correct: 2, total: 2 });
  });
});
