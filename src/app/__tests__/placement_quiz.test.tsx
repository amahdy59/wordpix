import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlacementQuizModal } from "../onboarding/PlacementQuizModal";
import { PLACEMENT_ITEMS } from "../onboarding/placementRecommendation";
import { I18nProvider } from "../context/I18nContext";

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({ speak: vi.fn(), stop: vi.fn(), isPlaying: false, isError: false }),
}));
beforeEach(() => {
  localStorage.clear();
});
describe("provisional starting-point check", () => {
  it("includes the correct answer in every shuffled question and returns guidance without mastery", () => {
    const complete = vi.fn();
    const close = vi.fn();
    render(
      <I18nProvider>
        <PlacementQuizModal isOpen onClose={close} onComplete={complete} />
      </I18nProvider>
    );
    for (const item of PLACEMENT_ITEMS) {
      for (const option of item.options)
        expect(screen.getByRole("button", { name: option })).toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: item.options[item.answer] }));
    }
    expect(complete).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ level: "C1", totalQuestions: 15, correctCount: 15 })
    );
    expect(close).toHaveBeenCalledOnce();
    expect(localStorage.getItem("wordpix:learner:v2")).toBeNull();
  });
  it("offers an honest not-sure route and does not award an advanced level", () => {
    const complete = vi.fn();
    render(
      <I18nProvider>
        <PlacementQuizModal isOpen onClose={vi.fn()} onComplete={complete} />
      </I18nProvider>
    );
    for (let step = 0; step < PLACEMENT_ITEMS.length; step++)
      fireEvent.click(screen.getByRole("button", { name: /I'm not sure/ }));
    expect(complete).toHaveBeenCalledWith(
      expect.objectContaining({ level: "A1", correctCount: 0 })
    );
  });
  it("can reopen a closed check with consistent hooks and a fresh first question", () => {
    const props = { onClose: vi.fn(), onComplete: vi.fn() };
    const { rerender } = render(
      <I18nProvider>
        <PlacementQuizModal isOpen={false} {...props} />
      </I18nProvider>
    );
    expect(screen.queryByRole("dialog")).toBeNull();
    rerender(
      <I18nProvider>
        <PlacementQuizModal isOpen {...props} />
      </I18nProvider>
    );
    expect(screen.getByRole("dialog", { name: "Find a starting point" })).toBeInTheDocument();
    expect(screen.getByText("Question 1 of 15")).toBeInTheDocument();
  });
});
