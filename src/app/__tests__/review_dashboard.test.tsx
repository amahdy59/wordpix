import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewMasteryReview } from "../review/ReviewMasteryReview";
import { createInitialWordState } from "../../features/gamification/sm2";
import type { WordLearningState } from "../../features/gamification/sm2";
const fixture = vi.hoisted(() => ({ memory: {} as Record<string, WordLearningState> }));
vi.mock("../data/progress", () => ({
  useProgress: () => ({ progress: { wordMemory: fixture.memory, streak: 3 } }),
}));
vi.mock("../data/vocabulary", () => ({
  getWords: (ids: string[]) => ids.map((id) => ({ id, label: id, img: "test.webp" })),
  loadUnitVocabulary: async () => [],
}));
vi.mock("../data/lessons", () => ({
  REVIEW_GROUP_ID: "review",
  resolveUnitIdForWord: () => undefined,
}));
vi.mock("../shared/WordImage", () => ({ WordImage: () => <span /> }));
vi.mock("../shared/WordInspectorModal", () => ({
  WordInspectorModal: ({ word }: { word: { label: string } | null }) =>
    word ? <div role="dialog">{word.label}</div> : null,
}));
function memory(id: string, days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return { ...createInitialWordState(id), nextReviewAt: date.toISOString() };
}
beforeEach(() => {
  fixture.memory = {};
});
describe("review dashboard", () => {
  it("starts only due words, oldest overdue first, without upcoming padding", async () => {
    fixture.memory = {
      today: memory("today", 0),
      future: memory("future", 5),
      overdue: memory("overdue", -3),
    };
    const dispatch = vi.fn();
    render(<ReviewMasteryReview dispatch={dispatch} />);
    await userEvent.click(screen.getByRole("button", { name: "Review 2 now" }));
    expect(dispatch).toHaveBeenCalledWith({
      type: "START_LESSON",
      lessonId: "review",
      mode: "SMART_REVIEW",
      wordQueue: ["overdue", "today"],
    });
  });
  it("does not start future reviews when the due queue is empty", () => {
    fixture.memory = { future: memory("future", 5) };
    render(<ReviewMasteryReview dispatch={vi.fn()} />);
    expect(screen.getByRole("button", { name: "All caught up" })).toBeDisabled();
  });
  it("expands the queue and opens word details", async () => {
    fixture.memory = Object.fromEntries(
      [1, 2, 3, 4].map((id) => [`word${id}`, memory(`word${id}`, -1)])
    );
    render(<ReviewMasteryReview dispatch={vi.fn()} />);
    const toggle = screen.getByRole("button", { name: "View all 4" });
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("button", { name: /word4/ }));
    expect(screen.getByRole("dialog")).toHaveTextContent("word4");
  });
});
