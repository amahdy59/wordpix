import { describe, it, expect, vi } from "vitest";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import {
  getScenariosForUnit,
  getScenarioForLesson,
  type ScenarioLesson,
} from "../data/scenarios/scenarioService";
import { UnitScenarioPlayer } from "../learning/study/UnitScenarioPlayer";

const recorded = vi.hoisted(() => ({
  speak: vi.fn(),
  stop: vi.fn(),
  options: {} as { onEnded?: () => void; onError?: () => void },
}));
vi.mock("../shared/useAudio", () => ({
  useAudio: (options: typeof recorded.options) => {
    recorded.options = options;
    return { speak: recorded.speak, stop: recorded.stop, isSupported: true };
  },
}));

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
    const { container } = render(<UnitScenarioPlayer scenarios={[mockScenario]} />);

    expect(screen.getByText("Meeting at the Majlis")).toBeDefined();
    expect(screen.getByText("لقاء في المجلس")).toBeDefined();
    expect(screen.getByText('"Welcome to our home, my friend."')).toBeDefined();
    expect(screen.getByText('"Thank you, Tariq! The coffee smells wonderful."')).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Play scenario: Meeting at the Majlis" })
    ).toBeDefined();
    expect(container.querySelector("audio")).toHaveAttribute("crossorigin", "anonymous");
    expect(container.querySelector("track")).toHaveAttribute("label", "English captions");
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

  it("displays clear section and lesson indications", () => {
    const secondScenario: ScenarioLesson = {
      ...mockScenario,
      lessonId: "test-unit-2",
      titleEn: "Evening Dinner",
      titleAr: "عشاء المساء",
    };

    render(
      <UnitScenarioPlayer
        scenarios={[mockScenario, secondScenario]}
        sectionTitle="Basic Vocabulary 1"
      />
    );

    // Displays lesson badge and section label
    expect(screen.getByText("Lesson 1:")).toBeDefined();
    expect(screen.getByText("Lesson 1 of 2")).toBeDefined();
    expect(screen.getByText("· Basic Vocabulary 1")).toBeDefined();
  });

  it("reuses recorded lines when a master fails and exposes recovery when the line also fails", async () => {
    const playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockRejectedValue(new Error("MEDIA_ERR_SRC_NOT_SUPPORTED"));
    recorded.speak.mockClear();
    const { unmount } = render(<UnitScenarioPlayer scenarios={[mockScenario]} />);
    fireEvent.click(screen.getByRole("button", { name: /Play scenario: Meeting at the Majlis/i }));
    await waitFor(() => expect(recorded.speak).toHaveBeenCalledWith(mockScenario.lines[0].text));
    act(() => recorded.options.onEnded?.());
    await waitFor(() => expect(recorded.speak).toHaveBeenCalledWith(mockScenario.lines[1].text));
    act(() => recorded.options.onError?.());
    expect(
      screen.getByRole("button", { name: /Play scenario: Meeting at the Majlis/i })
    ).toBeVisible();
    expect(screen.getByRole("status")).not.toBeEmptyDOMElement();
    unmount();
    playSpy.mockRestore();
  });
});
