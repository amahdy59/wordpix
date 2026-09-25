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

  it("renders Figma Language Bank Table layout with all 5 columns and interactive controls", async () => {
    const { BusinessVocabularyStage } =
      await import("../learning/business/stages/BusinessVocabularyStage");
    const { getBusinessUnit } = await import("../learning/business/businessCatalog");

    const unit = getBusinessUnit("unit-01");
    expect(unit).toBeDefined();
    if (!unit) return;

    const onNext = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessVocabularyStage unit={unit} onNext={onNext} />
        </LearnerProvider>
      </I18nProvider>
    );

    // 1. Table is default view matching Figma
    const table = screen.getByRole("table");
    expect(table).toBeDefined();

    // 2. All 5 headers exist matching Figma
    expect(screen.getByRole("columnheader", { name: "Image" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Word/Phrase" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Definition" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Example" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Type" })).toBeDefined();

    // 3. All 15 rows rendered in the table (desktop + mobile both in DOM, hidden via CSS)
    const rows = screen.getAllByRole("row");
    // 1 header row + 15 item rows
    expect(rows.length).toBe(16);

    // Verify row content: term and definition
    // Note: unified component renders both desktop table row and mobile card, so use getAllByText
    expect(screen.getAllByText("role").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("your function or position in an organisation").length
    ).toBeGreaterThan(0);

    // 4. Test Type filter
    const collocationFilter = screen.getByRole("button", { name: /Collocation/i });
    fireEvent.click(collocationFilter);

    // After filtering by Collocation (4 items), table should have 1 header + 4 rows = 5 rows
    const filteredRows = screen.getAllByRole("row");
    expect(filteredRows.length).toBe(5);

    // 5. Test Search
    const searchInput = screen.getByRole("searchbox", { name: "Search vocabulary" });
    fireEvent.change(searchInput, { target: { value: "touch" } });
    expect(screen.getAllByText("keep in touch").length).toBeGreaterThan(0);

    // Reset filter
    const allFilter = screen.getByRole("button", { name: /All/i });
    fireEvent.click(allFilter);
    fireEvent.change(searchInput, { target: { value: "" } });

    // Continue button invokes onNext
    const continueBtn = screen.getByRole("button", { name: /Continue to Usage Focus/i });
    fireEvent.click(continueBtn);
    expect(onNext).toHaveBeenCalledOnce();
  });
});
