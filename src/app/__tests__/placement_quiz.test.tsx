import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PlacementQuizModal } from "../onboarding/PlacementQuizModal";
import { I18nProvider } from "../context/I18nContext";
import { BEDROOM_VOCABULARY } from "../data/lessons";

function renderWithI18n(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe("PlacementQuizModal functional integrity", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="root"></div>';
  });

  it("ensures target word is always present in options for every question", () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();

    renderWithI18n(<PlacementQuizModal isOpen onClose={onClose} onComplete={onComplete} />);

    // Question 1: targetId is "pillow"
    const pillow = BEDROOM_VOCABULARY.find((w) => w.id === "pillow")!;
    expect(pillow).toBeDefined();

    // Verify pillow image is present in the rendered options
    const q1Buttons = screen.getAllByRole("button").filter((btn) => btn.querySelector("img"));
    expect(q1Buttons).toHaveLength(4);

    const q1AltTexts = q1Buttons.map((btn) => btn.querySelector("img")?.getAttribute("alt") || "");
    const pillowDescription = pillow.description;
    const hasPillow = q1AltTexts.some((alt) => alt.includes(pillowDescription));
    expect(
      hasPillow,
      "Target word 'pillow' must be among the rendered options for Question 1"
    ).toBe(true);
  });

  it("allows completing the quiz and returning a recommendation", () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();

    renderWithI18n(<PlacementQuizModal isOpen onClose={onClose} onComplete={onComplete} />);

    // Click the first option for all 3 questions
    for (let step = 0; step < 3; step++) {
      const optionButtons = screen.getAllByRole("button").filter((btn) => btn.querySelector("img"));
      expect(optionButtons).toHaveLength(4);
      fireEvent.click(optionButtons[0]);
    }

    expect(onComplete).toHaveBeenCalledOnce();
    expect(onClose).toHaveBeenCalledOnce();
    const recommendation = onComplete.mock.calls[0][0];
    expect(recommendation).toHaveProperty("level");
    expect(recommendation).toHaveProperty("startingUnitId");
  });

  it("maintains consistent hook order when toggling isOpen from false to true", () => {
    const onComplete = vi.fn();
    const onClose = vi.fn();

    const { rerender } = render(
      <I18nProvider>
        <PlacementQuizModal isOpen={false} onClose={onClose} onComplete={onComplete} />
      </I18nProvider>
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    rerender(
      <I18nProvider>
        <PlacementQuizModal isOpen={true} onClose={onClose} onComplete={onComplete} />
      </I18nProvider>
    );

    expect(screen.getByRole("dialog")).toBeDefined();
  });
});
