import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonWorldEntry } from "../lesson/LessonWorldEntry";
import { I18nProvider } from "../context/I18nContext";
import { COURSE_UNITS } from "../data/lessons";

describe("Lesson Actions Dropdown & Navigation", () => {
  const bedroomUnit = COURSE_UNITS["bedroom"];
  const firstGroupName = bedroomUnit.groups[0].name;

  it("renders more options button with WCAG accessible attributes", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="bedroom" dispatch={dispatch} />
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
        <LessonWorldEntry unitId="bedroom" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      new RegExp(`More options and quick navigation for ${firstGroupName}`, "i")
    )[0];
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const readStoryButton = screen.getByRole("menuitem", { name: /Read Story/i });
    expect(readStoryButton).toBeInTheDocument();

    fireEvent.click(readStoryButton);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "START_LESSON",
        unitId: "bedroom",
        initialStep: 5,
      })
    );
  });

  it("allows jumping directly to Browse Words flashcards", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="bedroom" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      new RegExp(`More options and quick navigation for ${firstGroupName}`, "i")
    )[0];
    fireEvent.click(trigger);

    const flashcardsButton = screen.getByRole("menuitem", { name: /Browse Words/i });
    expect(flashcardsButton).toBeInTheDocument();

    fireEvent.click(flashcardsButton);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "GO_LEARN_WORDS",
      })
    );
  });

  it("closes the menu when pressing Escape", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LessonWorldEntry unitId="bedroom" dispatch={dispatch} />
      </I18nProvider>
    );

    const trigger = screen.getAllByLabelText(
      new RegExp(`More options and quick navigation for ${firstGroupName}`, "i")
    )[0];
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
