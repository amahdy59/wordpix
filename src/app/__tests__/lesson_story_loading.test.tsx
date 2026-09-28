import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExerciseStory } from "../exercises/ExerciseStory";
import { loadLessonStory } from "../data/lessonStoryLoader";
import { BEDROOM_VOCABULARY, COURSE_UNITS } from "../data/lessons";

vi.mock("../data/lessonStoryLoader", () => ({ loadLessonStory: vi.fn() }));
vi.mock("../data/usageRegistry", () => ({ loadLessonUsage: vi.fn().mockResolvedValue(null) }));
const load = vi.mocked(loadLessonStory);
const lesson = COURSE_UNITS.bedroom.groups[0];
const props = {
  step: 5,
  words: BEDROOM_VOCABULARY.slice(0, 3),
  lessonId: lesson.id,
  dispatch: vi.fn(),
};

describe("on-demand lesson passage", () => {
  beforeEach(() => load.mockReset());

  it("announces loading and does not read a placeholder aloud", async () => {
    let finish: (text: string) => void = () => undefined;
    load.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        })
    );
    load.mockResolvedValue(undefined); // speculative next lesson
    render(<ExerciseStory {...props} />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading study materials");
    expect(screen.getByRole("button", { name: "Listen to full story audio" })).toBeDisabled();
    await act(async () => finish("A carefully reviewed passage."));
    expect(screen.getByText("A carefully reviewed passage.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Listen to full story audio" })).toBeEnabled();
  });

  it("offers retry after a download fails", async () => {
    load.mockRejectedValueOnce(new Error("offline")).mockResolvedValue("Recovered passage.");
    render(<ExerciseStory {...props} />);
    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Failed to load study materials")
    );
    fireEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(await screen.findByText("Recovered passage.")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
