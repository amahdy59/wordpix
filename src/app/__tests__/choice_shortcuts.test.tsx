import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChoiceOptionGroup } from "../shared/ChoiceOptionGroup";

const options = [
  { value: "one", label: "One", accessibleLabel: "One" },
  { value: "two", label: "Two", accessibleLabel: "Two" },
];

describe("question shortcut scope", () => {
  beforeEach(() => {
    localStorage.removeItem("wordpix:character-shortcuts");
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: true,
      media: "(pointer: fine)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    });
  });
  afterEach(() => {
    localStorage.removeItem("wordpix:character-shortcuts");
    vi.restoreAllMocks();
  });

  it("disabling character shortcuts preserves native arrow navigation", async () => {
    localStorage.setItem("wordpix:character-shortcuts", "false");
    const change = vi.fn();
    render(<ChoiceOptionGroup label="Question" options={options} onChange={change} />);
    fireEvent.keyDown(window, { key: "2" });
    expect(change).not.toHaveBeenCalled();
    screen.getByRole("radio", { name: "One" }).focus();
    await userEvent.setup().keyboard("{ArrowRight}");
    expect(change).toHaveBeenCalledWith("two");
    expect(screen.getByRole("radio", { name: "Two" })).toHaveFocus();
  });

  it("answers only the focused question when multiple questions are available", () => {
    const first = vi.fn();
    const second = vi.fn();
    render(
      <>
        <ChoiceOptionGroup label="First question" options={options} onChange={first} />
        <ChoiceOptionGroup label="Second question" options={options} onChange={second} />
      </>
    );
    fireEvent.keyDown(window, { key: "2" });
    expect(first).not.toHaveBeenCalled();
    expect(second).not.toHaveBeenCalled();
    within(screen.getByRole("radiogroup", { name: "Second question" }))
      .getByRole("radio", { name: "One" })
      .focus();
    fireEvent.keyDown(window, { key: "2" });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledExactlyOnceWith("two");
  });

  it("does not intercept shortcuts while typing, repeating or using modifiers", () => {
    const change = vi.fn();
    render(
      <>
        <label>
          Notes
          <input />
        </label>
        <ChoiceOptionGroup label="Question" options={options} onChange={change} />
      </>
    );
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Notes" }), { key: "2" });
    fireEvent.keyDown(window, { key: "2", ctrlKey: true });
    fireEvent.keyDown(window, { key: "2", repeat: true });
    expect(change).not.toHaveBeenCalled();
    fireEvent.keyDown(window, { key: "2" });
    expect(change).toHaveBeenCalledExactlyOnceWith("two");
  });

  it("suspends background answer shortcuts while a modal owns the keyboard", () => {
    const change = vi.fn();
    render(
      <>
        <ChoiceOptionGroup label="Question" options={options} onChange={change} />
        <div role="dialog" aria-modal="true" aria-label="Help">
          <button type="button">Close help</button>
        </div>
      </>
    );
    screen.getByRole("button", { name: "Close help" }).focus();
    fireEvent.keyDown(window, { key: "2" });
    expect(change).not.toHaveBeenCalled();
  });
});
