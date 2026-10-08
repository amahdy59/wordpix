import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { UnitVideoPlayer, type VideoCaptionCue } from "../shared/UnitVideoPlayer";
import { getUnitVideo, NUMBERS_COUNTING_TRIAL_VIDEO } from "../data/trialVideoData";

describe("unit video editorial review", () => {
  it("withholds the café trial while preserving its published assets", () => {
    expect(getUnitVideo("numbers-counting")).toBeUndefined();
    expect(NUMBERS_COUNTING_TRIAL_VIDEO.mediaReviewStatus).toBe("withheld");
    expect(NUMBERS_COUNTING_TRIAL_VIDEO.src).toMatch(/^https:\/\//);
  });
});

const MOCK_CUES: VideoCaptionCue[] = [
  {
    id: "cue-1",
    startTime: 0,
    endTime: 3,
    speaker: "Barista",
    textEn: "Good morning! Three coffees today?",
    textAr: "صباح الخير! ثلاثة فناجين قهوة اليوم؟",
    keywords: ["three"],
  },
  {
    id: "cue-2",
    startTime: 3.1,
    endTime: 6,
    speaker: "Customer",
    textEn: "Yes, that will be ten dollars.",
    textAr: "نعم، سيكون ذلك عشرة دولارات.",
    keywords: ["ten"],
  },
];

describe("UnitVideoPlayer", () => {
  beforeEach(() => {
    // Mock HTMLMediaElement methods in jsdom
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
    window.HTMLMediaElement.prototype.load = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("renders empty state placeholder when no src is provided", () => {
    render(<UnitVideoPlayer title="Numbers in Action" unitTitle="Numbers & Counting" />);

    expect(screen.getByRole("region", { name: "Numbers in Action" })).toBeInTheDocument();
    expect(screen.getByText("Numbers in Action")).toBeInTheDocument();
    expect(screen.getByText("Numbers & Counting")).toBeInTheDocument();
    expect(screen.getByText(/Recommended Video Specifications/i)).toBeInTheDocument();
  });

  it("renders video element and accessible controls when src is provided", () => {
    render(
      <UnitVideoPlayer
        src="/media/test.mp4"
        title="Numbers in Action"
        cues={MOCK_CUES}
        visualDescription="A barista places three cups on a counter."
      />
    );

    const player = screen.getByRole("region", { name: "Video player: Numbers in Action" });
    expect(player).toBeInTheDocument();

    // Verify accessible controls with specific accessible names
    expect(screen.getByRole("button", { name: "Play video" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Replay video" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mute audio" })).toBeInTheDocument();
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("toggles play/pause when the play button is clicked", () => {
    render(<UnitVideoPlayer src="/media/test.mp4" title="Numbers in Action" />);

    const playBtn = screen.getByRole("button", { name: "Play video" });
    fireEvent.click(playBtn);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("renders interactive transcript and jumps to cue timestamp when clicked", () => {
    render(<UnitVideoPlayer src="/media/test.mp4" title="Numbers in Action" cues={MOCK_CUES} />);

    const transcript = screen.getByRole("region", { name: "Interactive Transcript" });
    expect(within(transcript).getByText("Good morning! Three coffees today?")).toBeInTheDocument();
    expect(
      within(transcript).getByText("صباح الخير! ثلاثة فناجين قهوة اليوم؟")
    ).toBeInTheDocument();

    const cue2Btn = within(transcript).getByRole("button", {
      name: /Customer: Yes, that will be ten dollars/i,
    });
    fireEvent.click(cue2Btn);
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it("toggles the visual description (audio alternative) accordion", () => {
    render(
      <UnitVideoPlayer
        src="/media/test.mp4"
        title="Numbers in Action"
        visualDescription="A barista places three cups on a counter."
      />
    );

    const descToggle = screen.getByRole("button", {
      name: /Visual Scene Description \(Audio Alternative\)/i,
    });
    expect(descToggle).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(descToggle);
    expect(descToggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("A barista places three cups on a counter.")).toBeInTheDocument();
  });

  it("handles keyboard shortcuts (Space, M, T)", () => {
    render(<UnitVideoPlayer src="/media/test.mp4" title="Numbers in Action" cues={MOCK_CUES} />);

    const toolbar = screen.getByRole("toolbar", { name: "Playback controls" });

    // Space toggles play
    fireEvent.keyDown(toolbar, { key: " " });
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();

    // Mute button click & keyboard
    const muteBtn = screen.getByRole("button", { name: "Mute audio" });
    fireEvent.click(muteBtn);
    expect(screen.getByRole("button", { name: "Unmute audio" })).toBeInTheDocument();
  });
});
