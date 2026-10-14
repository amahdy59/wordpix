import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LessonActionDock } from "../shared/LessonActionDock";
import { TABBED_IDS } from "../store/reducer";

describe("Lesson Focus Shell & Action Dock", () => {
  it("never includes active drill and lesson routes in TABBED_IDS", () => {
    // Drills must not show the global bottom navigation tab bar
    const drillRoutes = [
      "lesson",
      "learning-materials",
      "figma-pronunciation-lesson",
      "skill-exercise",
      "hadith-lesson",
      "conversation-lesson",
      "business-lesson",
    ];

    for (const route of drillRoutes) {
      expect(TABBED_IDS.has(route), `Route ${route} should not be in TABBED_IDS`).toBe(false);
    }
  });

  it("renders LessonActionDock with audio replay, progress step, and primary continue button", () => {
    const onPrimaryClick = vi.fn();
    const onAudioClick = vi.fn();

    render(
      <LessonActionDock
        primaryLabel="Continue"
        onPrimary={onPrimaryClick}
        audioLabel="Replay audio"
        onAudio={onAudioClick}
        currentStep={2}
        totalSteps={5}
      />
    );

    // Audio button
    const audioBtn = screen.getByRole("button", { name: "Replay audio" });
    expect(audioBtn).toBeInTheDocument();
    fireEvent.click(audioBtn);
    expect(onAudioClick).toHaveBeenCalledTimes(1);

    // Step indicator
    expect(screen.getByText("Step 2 of 5")).toBeInTheDocument();

    // Primary action
    const primaryBtn = screen.getByRole("button", { name: "Continue" });
    expect(primaryBtn).toBeInTheDocument();
    fireEvent.click(primaryBtn);
    expect(onPrimaryClick).toHaveBeenCalledTimes(1);
  });

  it("disables primary button when disabled prop is true", () => {
    render(<LessonActionDock primaryLabel="Check Answer" onPrimary={vi.fn()} disabled={true} />);

    const primaryBtn = screen.getByRole("button", { name: "Check Answer" });
    expect(primaryBtn).toBeDisabled();
  });
});
