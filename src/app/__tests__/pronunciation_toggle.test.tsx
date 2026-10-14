import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { LearnerProvider, useLearner, DEFAULT_ACCESSIBILITY } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { SettingsModal } from "../core/SettingsModal";
import { LearningPath } from "../core/LearningPath";
import { SpecializedTracksCard } from "../core/SpecializedTracksCard";
import { PronunciationCurriculumScreen } from "../learning/foundations/PronunciationCurriculumScreen";
import { FigmaPronunciationLessonScreen } from "../learning/foundations/FigmaPronunciationLessonScreen";

const wrapper = ({ children }: { children: ReactNode }) => (
  <LearnerProvider>
    <I18nProvider>{children}</I18nProvider>
  </LearnerProvider>
);

describe("Global Pronunciation Toggle", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("defaults includePronunciation to true in DEFAULT_ACCESSIBILITY", () => {
    expect(DEFAULT_ACCESSIBILITY.includePronunciation).toBe(true);
  });

  it("exposes a toggle for Pronunciation Exercises in SettingsModal", async () => {
    const user = userEvent.setup();
    render(
      <LearnerProvider>
        <I18nProvider>
          <SettingsModal isOpen onClose={vi.fn()} />
        </I18nProvider>
      </LearnerProvider>
    );

    const toggle = screen.getByRole("button", {
      name: /include pronunciation exercises/i,
    });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("hides the Pronunciation course card from LearningPath when disabled", () => {
    function TestHarness() {
      const { setAccessibility } = useLearner();
      return (
        <div>
          <button type="button" onClick={() => setAccessibility({ includePronunciation: false })}>
            Disable
          </button>
          <LearningPath dispatch={vi.fn()} />
        </div>
      );
    }

    const { rerender } = render(<TestHarness />, { wrapper });

    // Initially enabled: card is visible
    expect(screen.getByRole("button", { name: /pronunciation curriculum/i })).toBeInTheDocument();

    // Disable pronunciation
    act(() => {
      screen.getByRole("button", { name: "Disable" }).click();
    });

    rerender(<TestHarness />);
    expect(
      screen.queryByRole("button", { name: /pronunciation curriculum/i })
    ).not.toBeInTheDocument();
  });

  it("hides Pronunciation from SpecializedTracksCard tracks when disabled", () => {
    function TestHarness() {
      const { setAccessibility } = useLearner();
      return (
        <div>
          <button type="button" onClick={() => setAccessibility({ includePronunciation: false })}>
            Disable
          </button>
          <SpecializedTracksCard dispatch={vi.fn()} />
        </div>
      );
    }

    const { rerender } = render(<TestHarness />, { wrapper });

    expect(screen.getByRole("button", { name: /pronunciation curriculum/i })).toBeInTheDocument();

    act(() => {
      screen.getByRole("button", { name: "Disable" }).click();
    });

    rerender(<TestHarness />);
    expect(
      screen.queryByRole("button", { name: /pronunciation curriculum/i })
    ).not.toBeInTheDocument();
  });

  it("renders accessible fallback in PronunciationCurriculumScreen when disabled and allows re-enabling", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();

    function TestHarness() {
      const { setAccessibility } = useLearner();
      return (
        <div>
          <button type="button" onClick={() => setAccessibility({ includePronunciation: false })}>
            Disable
          </button>
          <PronunciationCurriculumScreen dispatch={dispatch} />
        </div>
      );
    }

    render(<TestHarness />, { wrapper });

    // Disable pronunciation
    await user.click(screen.getByRole("button", { name: "Disable" }));

    // Fallback notice should appear
    expect(
      screen.getByRole("heading", { name: /pronunciation exercises disabled/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/pronunciation exercises are currently turned off/i)
    ).toBeInTheDocument();

    // Re-enable button should restore curriculum
    const enableBtn = screen.getByRole("button", {
      name: /enable pronunciation exercises/i,
    });
    await user.click(enableBtn);

    expect(
      screen.queryByRole("heading", { name: /pronunciation exercises disabled/i })
    ).not.toBeInTheDocument();
  });

  it("renders accessible fallback in FigmaPronunciationLessonScreen when disabled and allows re-enabling", async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();

    function TestHarness() {
      const { setAccessibility } = useLearner();
      return (
        <div>
          <button type="button" onClick={() => setAccessibility({ includePronunciation: false })}>
            Disable
          </button>
          <FigmaPronunciationLessonScreen lessonNumber={1} dispatch={dispatch} />
        </div>
      );
    }

    render(<TestHarness />, { wrapper });

    // Disable pronunciation
    await user.click(screen.getByRole("button", { name: "Disable" }));

    // Fallback notice should appear
    expect(
      screen.getByRole("heading", { name: /pronunciation exercises disabled/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/pronunciation exercises are currently turned off/i)
    ).toBeInTheDocument();

    // Re-enable button should restore lesson view
    const enableBtn = screen.getByRole("button", {
      name: /enable pronunciation exercises/i,
    });
    await user.click(enableBtn);

    expect(
      screen.queryByRole("heading", { name: /pronunciation exercises disabled/i })
    ).not.toBeInTheDocument();
  });
});
