import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { ConversationLessonScreen } from "../learning/conversation/ConversationLessonScreen";
import { LearnerProvider } from "../context/LearnerContext";
import { I18nProvider } from "../../i18n";

describe("ConversationLessonScreen Component", () => {
  it("groups Unit 1 into four sections without losing its seven-stage progress", () => {
    const dispatch = vi.fn();
    const { container } = render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(container.querySelector("main")).toBeNull();
    expect(screen.getAllByRole("heading", { level: 1 })).toEqual([
      screen.getByRole("heading", {
        level: 1,
        name: "Unit 1: Could You Live Without Your Smartphone for a Month?",
      }),
    ]);
    const nav = screen.getByRole("navigation", { name: "Lesson sections" });
    for (const label of [
      "Read & listen",
      "Language",
      "Practice",
      "Review & apply",
      "Warm-up",
      "Reading",
    ]) {
      expect(within(nav).getByRole("button", { name: label })).toBeDefined();
    }
    expect(within(nav).getByRole("progressbar")).toHaveAttribute("aria-valuemax", "7");
  });

  it("allows browsing stages before answering", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByRole("button", { name: "Language" })).toBeEnabled();

    fireEvent.click(screen.getAllByRole("radio", { name: /vote/i })[0]);
    fireEvent.click(screen.getByRole("button", { name: /continue to reading/i }));
    fireEvent.click(screen.getByRole("button", { name: /continue to language bank/i }));

    const vocabTab = screen.getByRole("button", { name: "Language" });
    expect(vocabTab).toBeEnabled();

    // Should display Language Bank items
    expect(screen.getByRole("heading", { name: "essential" })).toBeDefined();
    expect(screen.getByRole("heading", { name: "distraction" })).toBeDefined();
  });

  it("opens a requested stage without completing earlier stages", () => {
    const dispatch = vi.fn();
    render(
      <I18nProvider>
        <LearnerProvider>
          <ConversationLessonScreen unitId="unit-01" initialStage="challenge" dispatch={dispatch} />
        </LearnerProvider>
      </I18nProvider>
    );

    expect(screen.getByRole("button", { name: "Challenge" })).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(screen.getByRole("button", { name: "Review & apply" })).toBeEnabled();
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
    expect(screen.getByRole("button", { name: /continue to reading/i })).toBeEnabled();
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
    const slow = screen.getByRole("radio", { name: "Slow" });
    const normal = screen.getByRole("radio", { name: "Normal" });
    expect(slow).toBeChecked();
    fireEvent.click(normal);
    expect(normal).toBeChecked();
  });
});
