import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConversationCurriculumScreen } from "../learning/conversation/ConversationCurriculumScreen";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("ConversationCurriculumScreen Component", () => {
  it("renders curriculum overview with 40 units and level filter tabs", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationCurriculumScreen dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByText(/Conversation & Debate/i)).toBeDefined();
    expect(screen.getByRole("tab", { name: /all/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /b1/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /b2/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /c1/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /c2/i })).toBeDefined();
  });

  it("filters units when clicking a CEFR level tab", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationCurriculumScreen dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    // Switch to C2
    const c2Tab = screen.getByRole("tab", { name: /c2/i });
    fireEvent.click(c2Tab);

    // Unit 31 (Meritocracy) should be visible in units grid
    const unitsSection = screen.getByLabelText(/units list/i);
    expect(unitsSection.textContent).toContain("Can a Truly Meritocratic Society Exist?");
    // Unit 1 (Smartphones) should not be visible in C2 units grid
    expect(unitsSection.textContent).not.toContain(
      "Could You Live Without Your Smartphone for a Month?"
    );
  });

  it("navigates to a unit when clicking its card", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationCurriculumScreen dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    const unitCardBtn = screen.getByRole("button", {
      name: /unit 01/i,
    });
    fireEvent.click(unitCardBtn);

    expect(dispatch).toHaveBeenCalledWith({
      type: "OPEN_CONVERSATION_LESSON",
      unitId: "unit-01",
    });
  });
});
