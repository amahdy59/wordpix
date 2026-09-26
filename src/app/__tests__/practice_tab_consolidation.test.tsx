import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillExerciseHub } from "../core/SkillExerciseHub";
import type { WordLearningState } from "../../features/gamification/sm2";
import { createInitialWordState } from "../../features/gamification/sm2";

const fixture = vi.hoisted(() => ({
  memory: {} as Record<string, WordLearningState>,
  streak: 5,
}));

vi.mock("../data/progress", () => ({
  useProgress: () => ({
    progress: {
      wordMemory: fixture.memory,
      streak: fixture.streak,
      wordMastery: {},
    },
  }),
}));

vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({
    state: {
      preferences: {
        englishLevel: "A1",
      },
    },
  }),
}));

vi.mock("../shared/useAccessibilityPreferences", () => ({
  useAccessibility: () => ({
    accessibility: {
      includeSpeaking: true,
      includeListening: true,
      numeralSystem: "western",
    },
  }),
  formatNumber: (n: number) => String(n),
}));

function createMemoryItem(id: string, daysOffset: number): WordLearningState {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return {
    ...createInitialWordState(id),
    nextReviewAt: date.toISOString(),
  };
}

describe("Practice Tab & Review Consolidation", () => {
  beforeEach(() => {
    fixture.memory = {};
    fixture.streak = 5;
  });

  it("leads with 'Reviews Due Today' hero when words need review", () => {
    fixture.memory = {
      overdueWord: createMemoryItem("overdueWord", -2),
      todayWord: createMemoryItem("todayWord", 0),
      futureWord: createMemoryItem("futureWord", 4),
    };

    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    // Should lead with review hero showing 2 words due
    expect(screen.getByRole("region", { name: /Today's review/i })).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText(/words due/i)).toBeInTheDocument();
    expect(screen.getByText(/5 day streak/i)).toBeInTheDocument();

    // Clicking "Review Now" starts the review session
    const reviewBtn = screen.getByRole("button", { name: /Review 2 now/i });
    fireEvent.click(reviewBtn);

    expect(dispatch).toHaveBeenCalledWith({
      type: "START_LESSON",
      lessonId: "daily-review",
      mode: "SMART_REVIEW",
      wordQueue: ["overdueWord", "todayWord"],
    });
  });

  it("shows celebratory all-caught-up banner when zero reviews are due", () => {
    fixture.memory = {
      futureWord: createMemoryItem("futureWord", 4),
    };

    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    expect(screen.getByText(/All caught up/i)).toBeInTheDocument();
    expect(screen.getByText(/5 day streak/i)).toBeInTheDocument();
  });

  it("renders 'Practice by Skill' with category filters and drills", () => {
    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    expect(
      screen.getByRole("heading", { level: 2, name: /Skill Exercise Hub/i })
    ).toBeInTheDocument();

    // Category filter chips are present
    expect(screen.getByRole("button", { name: /Listening/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reading/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Speaking/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Writing/i })).toBeInTheDocument();

    // Can start a skill exercise
    const startExerciseButtons = screen.getAllByRole("button", { name: /Start Exercise/i });
    expect(startExerciseButtons.length).toBeGreaterThan(0);

    fireEvent.click(startExerciseButtons[0]);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: "OPEN_SKILL_EXERCISE" }));
  });
});
