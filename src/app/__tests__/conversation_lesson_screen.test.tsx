import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ConversationLessonScreen } from "../learning/conversation/ConversationLessonScreen";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("ConversationLessonScreen Component", () => {
  it("renders Unit 1 with all 7 stages in the stepper", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(
      screen.getByRole("main", {
        name: "Unit 1: Could You Live Without Your Smartphone for a Month?",
      })
    ).toBeDefined();
    expect(screen.getByRole("tab", { name: /warm-up/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /reading/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /language bank/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /toolkit/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /quiz/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /discussion/i })).toBeDefined();
    expect(screen.getByRole("tab", { name: /challenge/i })).toBeDefined();
  });

  it("unlocks stages only after completing the preceding stage", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByRole("tab", { name: /language bank/i })).toBeDisabled();

    fireEvent.click(screen.getAllByRole("radio", { name: /vote/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /continue to reading/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue to language bank/i }));

    const vocabTab = screen.getByRole("tab", { name: /language bank/i });
    expect(vocabTab).toBeEnabled();

    // Should display Language Bank items
    expect(screen.getByRole("heading", { name: "essential" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "distraction" })).toBeDefined();
  });

  it("does not allow a deep link to skip directly to a locked stage", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" initialStage="challenge" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByRole("tab", { name: /warm-up/i })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /challenge/i })).toBeDisabled();
  });

  it("renders quick vote options on warmup stage", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    const voteRadios = screen.getAllByRole("radio", { name: /vote/i });
    expect(voteRadios.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole("button", { name: /continue to reading/i })).toBeDisabled();
    fireEvent.click(voteRadios[0]);
    expect(screen.getByRole("button", { name: /continue to reading/i })).toBeEnabled();
    expect(screen.getByRole("heading", { name: /practice poll snapshot/i })).toBeDefined();
    expect(screen.getByText(/not live learner data/i)).toBeDefined();
    expect(screen.getByText("Your position")).toBeDefined();

    const results = within(screen.getByRole("complementary")).getAllByRole("progressbar");
    expect(results).toHaveLength(voteRadios.length);
    expect(
      results.reduce((sum, result) => sum + Number(result.getAttribute("aria-valuenow")), 0)
    ).toBe(100);
  });

  it("offers paragraph-level listening and selectable playback speed", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    fireEvent.click(screen.getAllByRole("radio", { name: /vote/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /continue to reading/i }));

    expect(screen.getAllByRole("button", { name: /listen to paragraph/i }).length).toBeGreaterThan(
      1
    );
    const slow = screen.getByRole("button", { name: "Slow" });
    const normal = screen.getByRole("button", { name: "Normal" });
    expect(slow).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(normal);
    expect(normal).toHaveAttribute("aria-pressed", "true");
  });
});
