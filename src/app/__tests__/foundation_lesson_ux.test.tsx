import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearnerProvider, __clearTestStateCache } from "../context/LearnerContext";
import { FoundationLessonScreen } from "../learning/foundations/FoundationLessonScreen";

const audio = vi.hoisted(() => ({
  status: "idle" as "idle" | "loading" | "playing" | "error" | "unsupported",
  speak: vi.fn(),
  stop: vi.fn(),
}));

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    speak: audio.speak,
    stop: audio.stop,
    status: audio.status,
    isPlaying: audio.status === "loading" || audio.status === "playing",
    isError: audio.status === "error",
    isSupported: audio.status !== "unsupported",
  }),
}));

describe("foundation lesson experience", () => {
  beforeEach(() => {
    __clearTestStateCache();
    audio.status = "idle";
    audio.speak.mockClear();
    audio.stop.mockClear();
  });

  it("requires listening to every spoken option before choosing and revealing the photo", async () => {
    const user = userEvent.setup();
    render(
      <LearnerProvider>
        <FoundationLessonScreen lessonId="sound-s" dispatch={vi.fn()} />
      </LearnerProvider>
    );

    await user.click(screen.getByRole("button", { name: "Start lesson" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Listen to choice 1" }));
    expect(screen.queryByRole("button", { name: "Choose option 1" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Listen to choice 2" }));
    await user.click(screen.getByRole("button", { name: "Choose option 1" }));

    expect(screen.getByRole("button", { name: "Correct answer: sun" })).toBeInTheDocument();
    expect(screen.getByText("Yes. sun contains sss.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Continue" })).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Your turn · 2 of 6")).toBeInTheDocument());
  });

  it("keeps rhyme pictures visible and automatically plays each entered audio step", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <LearnerProvider>
        <FoundationLessonScreen lessonId="rhyme-recognition" dispatch={vi.fn()} />
      </LearnerProvider>
    );

    await user.click(screen.getByRole("button", { name: "Start lesson" }));
    expect(audio.speak).toHaveBeenLastCalledWith("cat. hat.");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(audio.speak).toHaveBeenLastCalledWith("cat. sun.");
    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(
      screen.getByRole("heading", { name: "Listen for the word with the same ending sound." })
    ).toBeInTheDocument();
    expect(container.querySelectorAll("img.blur-xl")).toHaveLength(0);
    expect(container.querySelectorAll("img.blur-0").length).toBeGreaterThan(0);
  });

  it("shows a clear recovery action when sound playback fails", () => {
    audio.status = "error";
    render(
      <LearnerProvider>
        <FoundationLessonScreen lessonId="same-or-different" dispatch={vi.fn()} />
      </LearnerProvider>
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Check the device volume, then tap the sound button to retry."
    );
  });
});
