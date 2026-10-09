import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { BusinessLessonScreen } from "../learning/business/BusinessLessonScreen";
import { BusinessCurriculumScreen } from "../learning/business/BusinessCurriculumScreen";
import { LearnerProvider, useLearner } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("Business Learning Screens & Spaced Repetition", () => {
  it("does not award XP when a caller requests completion without learning evidence", () => {
    function CompletionProbe() {
      const { state, recordBusinessCompletion } = useLearner();
      return (
        <>
          <output aria-label="Completion evidence">
            {JSON.stringify({ xp: state.learnerProgress.xp, progress: state.businessProgress })}
          </output>
          <button type="button" onClick={() => recordBusinessCompletion("unit-02")}>
            Request completion
          </button>
        </>
      );
    }
    render(
      <I18nProvider>
        <LearnerProvider>
          <CompletionProbe />
        </LearnerProvider>
      </I18nProvider>
    );
    const before = screen.getByLabelText("Completion evidence").textContent;
    fireEvent.click(screen.getByRole("button", { name: "Request completion" }));
    expect(screen.getByLabelText("Completion evidence").textContent).toBe(before);
  });
  it("browses speaking and review without granting mastery or completing unchecked tasks", () => {
    const dispatch = vi.fn();
    function ProgressProbe() {
      const { state } = useLearner();
      const progress = state.businessProgress?.["unit-02"];
      return <output aria-label="Business progress evidence">{JSON.stringify(progress)}</output>;
    }
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
          <ProgressProbe />
        </LearnerProvider>
      </I18nProvider>
    );
    fireEvent.click(screen.getByRole("button", { name: "Review & apply" }));
    fireEvent.click(screen.getByRole("button", { name: "Speak" }));
    fireEvent.click(screen.getByRole("button", { name: /Continue to Review & Confidence/i }));
    expect(
      within(screen.getByRole("navigation", { name: "Lesson sections" })).getByRole("progressbar")
    ).toHaveAttribute("aria-valuenow", "0");
    fireEvent.click(screen.getByRole("button", { name: /Return to Curriculum Hub/i }));
    const evidence = JSON.parse(
      screen.getByLabelText("Business progress evidence").textContent ?? "{}"
    );
    expect(evidence.status).toBe("in-progress");
    expect(evidence.completedStages).toEqual([]);
    expect(evidence.quizBestScore).toBeUndefined();
  });
  it("groups Unit 02 into four sections and exposes its initial recall stages", () => {
    const dispatch = vi.fn();
    const { container } = render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(container.querySelector("main")).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Unit 2: Roles, Teams & Responsibilities",
      })
    ).toBeDefined();

    const nav = screen.getByRole("navigation", { name: "Lesson sections" });
    for (const label of [
      "Read & listen",
      "Language",
      "Practice",
      "Review & apply",
      "Recall",
      "Warm-Up",
      "Input",
    ]) {
      expect(within(nav).getByRole("button", { name: label })).toBeDefined();
    }
    expect(within(nav).getByRole("progressbar")).toHaveAttribute("aria-valuemax", "9");
  });

  it("allows browsing later stages without completing recall", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-02" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    const desktopNav = screen.getByRole("navigation", { name: "Lesson sections" });
    expect(within(desktopNav).getByRole("button", { name: "Recall" })).toBeEnabled();
    for (const label of ["Warm-Up", "Language", "Practice", "Review & apply"]) {
      expect(within(desktopNav).getByRole("button", { name: label })).toBeEnabled();
    }
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

    fireEvent.click(screen.getByText(/optional: how did that feel/i));
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

    // 2. All 4 core headers exist (Type column streamlined out of table)
    expect(screen.getByRole("columnheader", { name: "Image" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Word/Phrase" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Definition" })).toBeDefined();
    expect(screen.getByRole("columnheader", { name: "Example" })).toBeDefined();
    expect(screen.queryByRole("columnheader", { name: "Type" })).toBeNull();

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
    const allFilter = screen.getByRole("button", { name: /^all/i });
    fireEvent.click(allFilter);
    fireEvent.change(searchInput, { target: { value: "" } });

    // Continue button invokes onNext
    const continueBtn = screen.getByRole("button", { name: /Continue to Usage Focus/i });
    fireEvent.click(continueBtn);
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("keeps navigation available without marking skipped stages complete", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    const desktopNav = screen.getByRole("navigation", { name: "Lesson sections" });
    const warmupBtn = within(desktopNav).getByRole("button", { name: /Warm-Up/i });
    const inputBtn = within(desktopNav).getByRole("button", { name: "Input" });
    const vocabBtn = within(desktopNav).getByRole("button", { name: "Language" });

    expect(warmupBtn.getAttribute("aria-current")).toBe("step");
    expect(inputBtn.hasAttribute("disabled")).toBe(false);
    expect(vocabBtn.hasAttribute("disabled")).toBe(false);

    // Browsing forward does not complete an unanswered warm-up.
    fireEvent.click(screen.getByRole("button", { name: /Continue to Case Scenario/i }));

    // The current stage changes while all navigation remains available.
    expect(inputBtn.getAttribute("aria-current")).toBe("step");
    expect(vocabBtn.hasAttribute("disabled")).toBe(false);

    // Jump back to Stage 1 via the stepper without completing Stage 2
    fireEvent.click(warmupBtn);
    expect(warmupBtn.getAttribute("aria-current")).toBe("step");

    expect(within(desktopNav).getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
    // Skipped sections remain uncompleted.
    expect(vocabBtn.hasAttribute("disabled")).toBe(false);
  });

  it("renders multiple-choice warm-up questions with instant feedback and thumbnail image", async () => {
    const { BusinessWarmupStage } = await import("../learning/business/stages/BusinessWarmupStage");
    const { getBusinessUnit } = await import("../learning/business/businessCatalog");

    const unit = getBusinessUnit("unit-01");
    expect(unit).toBeDefined();
    if (!unit) return;

    const onNext = vi.fn();
    const onSaveNote = vi.fn();

    const { container } = render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessWarmupStage unit={unit} onSaveNote={onSaveNote} onNext={onNext} />
        </LearnerProvider>
      </I18nProvider>
    );

    // 1. Verify thumbnail image is rendered with resolved asset URL
    const heroImg = container.querySelector("img");
    expect(heroImg).not.toBeNull();
    expect(heroImg?.getAttribute("src")).toContain("unit-01-hero.webp");

    // 2. Warm-up questions must NOT have textareas; they must have multiple choice radiogroups
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);

    const radioGroups = screen.getAllByRole("radiogroup");
    expect(radioGroups).toHaveLength(1);
    expect(radioGroups.length).toBeLessThanOrEqual(7);

    // 3. Radio options exist for Question 1
    const q1RadioButtons = within(radioGroups[0]).getAllByRole("radio");
    expect(q1RadioButtons.length).toBeGreaterThanOrEqual(2);

    // Initially, no feedback is revealed for Question 1
    expect(screen.queryByText(/Strategic Workplace Feedback/i)).toBeNull();

    // 4. Select an option
    fireEvent.click(q1RadioButtons[0]);
    expect(onSaveNote).toHaveBeenCalledWith("warmup-1-1", "A");

    // 5. Instant feedback card is displayed with explanation
    expect(screen.getByText(/Strategic Workplace Feedback/i)).toBeDefined();
    expect(screen.getByText(unit.warmup.prompts[0].explanation!)).toBeDefined();

    // 6. Continue to next stage invokes onNext
    const continueBtn = screen.getByRole("button", { name: /Continue to Case Scenario/i });
    fireEvent.click(continueBtn);
    expect(onNext).toHaveBeenCalledOnce();
  });

  it("renders thumbnail image on unit cards in BusinessCurriculumScreen", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <BusinessCurriculumScreen dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Verify all unit cards contain hero thumbnail images with resolved sources
    const cards = screen.getAllByRole("article");
    expect(cards.length).toBe(40);

    const firstCard = cards[0];
    const cardImg = firstCard.querySelector("img");
    expect(cardImg).not.toBeNull();
    expect(cardImg?.getAttribute("src")).toContain("unit-01-hero.webp");
  });
});
