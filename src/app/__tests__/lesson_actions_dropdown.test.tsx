import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonWorldEntry } from "../lesson/LessonWorldEntry";
import { I18nProvider } from "../context/I18nContext";

describe("Lesson Actions Dropdown & Navigation", () => {
  it("renders more options button with WCAG accessible attributes", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="garden" dispatch={dispatch} />
      </I18nProvider>
    );

    const triggerButtons = screen.getAllByLabelText(/More options and quick navigation for/i);
    expect(triggerButtons.length).toBeGreaterThan(0);
    expect(triggerButtons[0]).toHaveAttribute("aria-haspopup", "menu");
    expect(triggerButtons[0]).toHaveAttribute("aria-expanded", "false");
  });

  it("opens menu and allows jumping directly to Read Story (step 5)", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="garden" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      /More options and quick navigation for Garden Basics 1/i
    )[0];
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const readStoryButton = screen.getByRole("menuitem", { name: /Read Story/i });
    expect(readStoryButton).toBeInTheDocument();

    fireEvent.click(readStoryButton);

    expect(dispatch).toHaveBeenCalledWith({
      type: "START_LESSON",
      lessonId: "garden-1",
      unitId: "garden",
      mode: "NEW_LESSON",
      wordQueue: expect.arrayContaining(["rose", "tulip"]),
      initialStep: 5,
    });
  });

  it("allows jumping directly to Browse Words flashcards", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="garden" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      /More options and quick navigation for Garden Basics 1/i
    )[0];
    fireEvent.click(trigger);

    const browseWordsButton = screen.getByRole("menuitem", { name: /Browse Words/i });
    fireEvent.click(browseWordsButton);

    expect(dispatch).toHaveBeenCalledWith({
      type: "GO_LEARN_WORDS",
      lessonId: "garden-1",
    });
  });

  it("expands Jump to Step submenu and selects specific exercise step", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="garden" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      /More options and quick navigation for Garden Basics 1/i
    )[0];
    fireEvent.click(trigger);

    const jumpToggle = screen.getByRole("button", { name: /Jump to Step/i });
    fireEvent.click(jumpToggle);

    const spellingStepButton = screen.getByRole("menuitem", { name: /3\. Spell the Word/i });
    fireEvent.click(spellingStepButton);

    expect(dispatch).toHaveBeenCalledWith({
      type: "START_LESSON",
      lessonId: "garden-1",
      unitId: "garden",
      mode: "NEW_LESSON",
      wordQueue: expect.arrayContaining(["rose", "tulip"]),
      initialStep: 2,
    });
  });

  it("closes the menu when pressing Escape", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="garden" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      /More options and quick navigation for Garden Basics 1/i
    )[0];
    fireEvent.click(trigger);

    expect(screen.getByRole("menuitem", { name: /Read Story/i })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("menuitem", { name: /Read Story/i })).not.toBeInTheDocument();
  });
});
