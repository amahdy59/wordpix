import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BusinessLessonScreen } from "../learning/business/BusinessLessonScreen";
import { BusinessCurriculumScreen } from "../learning/business/BusinessCurriculumScreen";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("Business Learning Screens & Spaced Repetition", () => {
  it("renders Unit 02 with all 9 stages in the stepper, including Stage 0 Quick Recall", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByRole("main")).toBeDefined();

    // Verify stage navigation buttons in desktop sidebar
    const desktopNav = screen.getByRole("navigation", { name: "Lesson Path Steps" });
    expect(within(desktopNav).getByText("Quick Recall")).toBeDefined();
    expect(within(desktopNav).getByText("Warm-Up")).toBeDefined();
    expect(within(desktopNav).getByText("Main Input")).toBeDefined();
    expect(within(desktopNav).getByText("Language Bank")).toBeDefined();
    expect(within(desktopNav).getByText("Usage Focus")).toBeDefined();
    expect(within(desktopNav).getByText("Exercise Set")).toBeDefined();
    expect(within(desktopNav).getByText("Discussion")).toBeDefined();
    expect(within(desktopNav).getByText("Speaking Task")).toBeDefined();
    expect(within(desktopNav).getByText("Review & Recycling")).toBeDefined();
  });

  it("enforces sequential lock: later stages are locked on initial entry", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    const desktopNav = screen.getByRole("navigation", { name: "Lesson Path Steps" });
    const buttons = within(desktopNav).getAllByRole("button");

    // Stage 0 (Recall) is active and enabled
    expect(buttons[0]).not.toBeDisabled();

    // Stage 1 (Warm-Up) and onward are locked and disabled
    expect(buttons[1]).toBeDisabled();
    expect(buttons[5]).toBeDisabled();
  });

  it("interacts with Spaced Repetition (Quick Recall) prompts and advances", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Should display Quick Recall banner
    expect(screen.getByText(/0\. Quick Recall · Unit 1:/i)).toBeDefined();

    // Select or type answer
    const optionButtons = screen.queryAllByRole("radio");
    if (optionButtons.length > 0) {
      fireEvent.click(optionButtons[0]);
    } else {
      const input = screen.getByPlaceholderText(/type the word or phrase/i);
      fireEvent.change(input, { target: { value: "role" } });
    }

    // Check answer
    const checkBtn = screen.getByRole("button", { name: /check answer/i });
    fireEvent.click(checkBtn);

    // Answer revealed, rate confidence
    expect(screen.getByText(/how easily did you recall this item/i)).toBeDefined();
    const easyBtn = screen.getByRole("button", { name: /easy/i });
    expect(easyBtn).toBeDefined();
    fireEvent.click(easyBtn);
  });

  it("renders BusinessCurriculumScreen with 4 CEFR tabs and 10 units each", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessCurriculumScreen dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Verify all 4 CEFR tabs exist
    expect(screen.getByRole("tab", { name: /B1/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /B2/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /C1/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /C2/i })).toBeDefined();

    // In default "All Levels" view, all 40 units should exist
    const unitCards = screen.getAllByRole("article");
    expect(unitCards.length).toBe(40);

    // Switch to C1 tab
    const c1Tab = screen.getByRole("tab", { name: /C1/i });
    fireEvent.click(c1Tab);

    // Under C1, exactly 10 units should be shown
    const c1Cards = screen.getAllByRole("article");
    expect(c1Cards.length).toBe(10);
  });
});
