import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SkillExerciseHub } from "../core/SkillExerciseHub";
import type { WordLearningState } from "../../features/gamification/sm2";
import { createInitialWordState } from "../../features/gamification/sm2";

const fixture = vi.hoisted(() => ({
  memory: {} as Record<string, WordLearningState>,
  streak: 3,
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
        englishLevel: "B1",
      },
      learnerProgress: {
        sessionsCompleted: 2,
      },
    },
  }),
}));

vi.mock("../shared/useAccessibilityPreferences", () => ({
  useAccessibility: () => ({
    accessibility: {
      includeSpeaking: true,
      includeListening: true,
      includePronunciation: true,
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

describe("Practice Tab Streamlining & Plain Language", () => {
  beforeEach(() => {
    fixture.memory = {};
    fixture.streak = 3;
  });

  it("shows Smart Review CTA with estimated time and batch options when words > 10", () => {
    // Generate 15 due words
    const mem: Record<string, WordLearningState> = {};
    for (let i = 0; i < 15; i++) {
      mem[`word_${i}`] = createMemoryItem(`word_${i}`, -1);
    }
    fixture.memory = mem;

    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    // Total due is 15
    expect(screen.getByText("15")).toBeInTheDocument();
    // Estimated duration badge is rendered (~3 min for 10 words)
    expect(screen.getByText(/~3 min/i)).toBeInTheDocument();

    // Default batch size is 10 words
    const smartReviewBtn = screen.getByRole("button", { name: /Smart Review \(10 words\)/i });
    expect(smartReviewBtn).toBeInTheDocument();

    // Batch selector offers "10 (Smart)" and "15 (All)"
    const allBatchBtn = screen.getByRole("button", { name: /15 \(All\)/i });
    expect(allBatchBtn).toBeInTheDocument();

    // Switching to All updates the CTA to 15 words
    fireEvent.click(allBatchBtn);
    expect(screen.getByRole("button", { name: /Smart Review \(15 words\)/i })).toBeInTheDocument();

    // Clicking it starts review with all 15 words
    fireEvent.click(screen.getByRole("button", { name: /Smart Review \(15 words\)/i }));
    expect(dispatch).toHaveBeenCalledWith({
      type: "START_LESSON",
      lessonId: "daily-review",
      mode: "SMART_REVIEW",
      wordQueue: expect.arrayContaining(["word_0", "word_14"]),
    });
  });

  it("displays modality visual badges on skill drill cards", () => {
    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    // Listening category exercises display Listening modality badge
    const listeningBadges = screen.getAllByText(/^Listening$/i);
    expect(listeningBadges.length).toBeGreaterThan(0);

    // Plain language exercise titles are visible
    expect(screen.getByText("Listen & Repeat")).toBeInTheDocument();
    expect(screen.getByText("Quick Word Recall")).toBeInTheDocument();
  });

  it("shows reassuring completion message when zero reviews are due", () => {
    fixture.memory = {
      w1: createMemoryItem("w1", 5),
    };

    const dispatch = vi.fn();
    render(<SkillExerciseHub dispatch={dispatch} />);

    expect(screen.getByText(/All caught up/i)).toBeInTheDocument();
  });
});
