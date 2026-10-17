import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearningPath } from "../core/LearningPath";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <LearnerProvider>
      <I18nProvider>{ui}</I18nProvider>
    </LearnerProvider>
  );
}

describe("LearningPath Sticky CEFR Switcher", () => {
  it("renders the sticky CEFR level navigation pills", () => {
    renderWithProviders(<LearningPath dispatch={vi.fn()} />);

    const nav = screen.getByRole("navigation", { name: /CEFR Levels/i });
    expect(nav).toBeInTheDocument();

    expect(within(nav).getByRole("button", { name: "Pre-A1" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "A1" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "A2" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "B1" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "B2" })).toBeInTheDocument();
    expect(within(nav).getByRole("button", { name: "C1" })).toBeInTheDocument();
    expect(within(nav).queryByRole("button", { name: /^Specialist$/i })).not.toBeInTheDocument();
  });

  it("clicking a CEFR level pill reveals and expands that curriculum phase", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LearningPath dispatch={vi.fn()} />);

    // Initially the full path is collapsed
    expect(screen.getByText("General English words mastered")).toBeInTheDocument();

    const nav = screen.getByRole("navigation", { name: /CEFR Levels/i });
    const b1Pill = within(nav).getByRole("button", { name: "B1" });
    await user.click(b1Pill);

    // Full path is now expanded and B1 stage header is in document
    expect(screen.getByText("General English words mastered")).toBeInTheDocument();
    expect(screen.getByText("B1 Wider World")).toBeInTheDocument();
  });

  it("keeps specialist courses separate from CEFR selection", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    renderWithProviders(<LearningPath dispatch={dispatch} />);
    await user.click(screen.getByRole("button", { name: /Pronunciation curriculum/i }));
    expect(dispatch).toHaveBeenCalledWith({ type: "GO", to: "pronunciation-curriculum" });
  });
});
