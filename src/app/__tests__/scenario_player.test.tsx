import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

  it("falls back gracefully to speech synthesis on play when audio cannot load", async () => {
    const mockSpeak = vi.fn();
    const mockCancel = vi.fn();
    const mockGetVoices = vi.fn().mockReturnValue([
      { name: "George", lang: "en-GB" },
      { name: "Samantha", lang: "en-US" },
    ]);

    class MockUtterance {
      text: string;
      voice: SpeechSynthesisVoice | null = null;
      pitch = 1;
      rate = 1;
      lang = "en-US";
      onstart: (() => void) | null = null;
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
      constructor(text: string) {
        this.text = text;
      }
    }

    vi.stubGlobal("speechSynthesis", {
      speak: mockSpeak,
      cancel: mockCancel,
      getVoices: mockGetVoices,
    });
    vi.stubGlobal("SpeechSynthesisUtterance", MockUtterance);

    const playSpy = vi
      .spyOn(window.HTMLMediaElement.prototype, "play")
      .mockRejectedValue(new Error("MEDIA_ERR_SRC_NOT_SUPPORTED"));

    render(<UnitScenarioPlayer scenarios={[mockScenario]} />);

    const playBtn = screen.getByRole("button", { name: /Meeting at the Majlis/i });
    fireEvent.click(playBtn);

    await waitFor(() => {
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });

    playSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
