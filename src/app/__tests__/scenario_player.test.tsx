import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  getScenariosForUnit,
  getScenarioForLesson,
  type ScenarioLesson,
} from "../data/scenarios/scenarioService";
import { UnitScenarioPlayer } from "../learning/study/UnitScenarioPlayer";

describe("scenarioService", () => {
  it("retrieves scenarios for unit numbers-counting", () => {
    const scenarios = getScenariosForUnit("numbers-counting");
    expect(scenarios.length).toBeGreaterThan(0);
    const first = scenarios[0];
    expect(first.unitId).toBe("numbers-counting");
    expect(first.lessonId).toBe("numbers-counting-1");
    expect(first.titleEn).toBe("The Date Harvest Box");
    expect(first.titleAr).toBe("صندوق التمر اللذيذ");
    expect(first.lines.length).toBeGreaterThan(0);
    expect(first.lines[0].speaker).toBe("Tariq");
    expect(first.masterAudioRelative).toContain("numbers-counting-1_full.mp3");
  });

  it("retrieves scenario for specific lesson numbers-counting-1", () => {
    const scenario = getScenarioForLesson("numbers-counting-1");
    expect(scenario).toBeDefined();
    expect(scenario?.lessonId).toBe("numbers-counting-1");
    expect(scenario?.targetWords).toContain("one");
    expect(scenario?.targetWords).toContain("two");
  });
});

describe("UnitScenarioPlayer component", () => {
  const mockScenario: ScenarioLesson = {
    unitId: "test-unit",
    lessonId: "test-unit-1",
    titleEn: "Meeting at the Majlis",
    titleAr: "لقاء في المجلس",
    totalDurationSeconds: 25.5,
    masterAudioRelative: "assets/audio/scenarios/test-unit/test-unit-1_full.mp3",
    targetWords: ["welcome", "coffee", "guest"],
    lines: [
      {
        speaker: "Tariq",
        text: "Welcome to our home, my friend.",
        startSeconds: 0,
        endSeconds: 4.2,
        clipRelativePath: "assets/audio/scenarios/test-unit/test-unit-1/01_tariq.mp3",
      },
      {
        speaker: "Adam",
        text: "Thank you, Tariq! The coffee smells wonderful.",
        startSeconds: 4.2,
        endSeconds: 9.0,
        clipRelativePath: "assets/audio/scenarios/test-unit/test-unit-1/02_adam.mp3",
      },
    ],
  };

  it("renders scenario title, Arabic translation, and dialogue lines", () => {
    render(<UnitScenarioPlayer scenarios={[mockScenario]} />);

    expect(screen.getByText("Meeting at the Majlis")).toBeDefined();
    expect(screen.getByText("لقاء في المجلس")).toBeDefined();
    expect(screen.getByText('"Welcome to our home, my friend."')).toBeDefined();
    expect(screen.getByText('"Thank you, Tariq! The coffee smells wonderful."')).toBeDefined();
  });

  it("renders character badges with proper labels", () => {
    render(<UnitScenarioPlayer scenarios={[mockScenario]} />);

    expect(screen.getByText("Tariq")).toBeDefined();
    expect(screen.getByText("Adam")).toBeDefined();
  });

  it("renders target words and triggers onInspectWord callback when clicked", () => {
    const handleInspect = vi.fn();
    render(<UnitScenarioPlayer scenarios={[mockScenario]} onInspectWord={handleInspect} />);

    const welcomeBtn = screen.getByTitle("Inspect word: welcome");
    expect(welcomeBtn).toBeDefined();
    fireEvent.click(welcomeBtn);
    expect(handleInspect).toHaveBeenCalledWith("welcome");
  });

  it("renders multi-scenario tabs when multiple scenarios are provided", () => {
    const secondScenario: ScenarioLesson = {
      ...mockScenario,
      lessonId: "test-unit-2",
      titleEn: "Evening Dinner",
      titleAr: "عشاء المساء",
    };

    render(<UnitScenarioPlayer scenarios={[mockScenario, secondScenario]} />);

    expect(screen.getByRole("tab", { name: "Part 1" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Part 2" })).toBeDefined();

    fireEvent.click(screen.getByRole("tab", { name: "Part 2" }));
    expect(screen.getByText("Evening Dinner")).toBeDefined();
  });
});
