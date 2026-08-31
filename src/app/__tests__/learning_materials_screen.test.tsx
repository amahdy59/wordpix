import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LearningMaterialsScreen,
  PassageSection,
  PhrasesSection,
  PracticeSection,
} from "../learning/LearningMaterialsScreen";
import { loadLearningMaterials, unitsWithLearningMaterials } from "../learning/registry";
import { hashToRoute, screenToHash } from "../router/useHashRouter";
import { reducer } from "../store/reducer";
import { COURSE_UNITS } from "../data/lessons";

describe("LearningMaterialsScreen", () => {
  it("opens on the study home with unit study path and activities", async () => {
    render(<LearningMaterialsScreen unitId="bedroom" dispatch={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /Bedroom/i })).toBeInTheDocument()
    );
    expect(screen.getByText(/Your Study Path/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeInTheDocument();
  });

  it("filters phrases down to phrasal verbs without losing the idioms", async () => {
    const user = userEvent.setup();
    const materials = (await loadLearningMaterials("bedroom"))!;
    render(<PhrasesSection materials={materials} />);

    expect(screen.getByText("hit the pillow")).toBeInTheDocument();
    expect(screen.getByText("put away")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /phrasal verbs \(/i }));
    expect(screen.getByText("put away")).toBeInTheDocument();
    expect(screen.queryByText("hit the pillow")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^All \(/i }));
    expect(screen.getByText("hit the pillow")).toBeInTheDocument();
  });

  it("marks fill-in-the-blank answers only once the learner asks", async () => {
    const user = userEvent.setup();
    const materials = (await loadLearningMaterials("bedroom"))!;
    render(<PracticeSection materials={materials} />);

    await user.type(screen.getByLabelText("Answer for sentence 1"), "wardrobe");
    expect(screen.queryByText(/of 10 correct/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /check answers/i }));
    expect(screen.getByText("1 of 10 correct")).toBeInTheDocument();
  });

  it("shows unconvertible comprehension questions as unscored prompts", async () => {
    const materials = (await loadLearningMaterials("bedroom"))!;
    render(<PassageSection materials={materials} />);

    await waitFor(() => screen.getByRole("heading", { name: /think about it/i }));
    const prompts = screen
      .getByRole("heading", { name: /think about it/i })
      .closest("div")!
      .querySelectorAll("li");
    expect(prompts.length).toBeGreaterThan(0);

    expect(
      screen
        .getByRole("heading", { name: /think about it/i })
        .closest("div")!
        .querySelectorAll("button").length
    ).toBe(0);
  });

  it("marks an inferred idiom or phrasal-verb label as inferred", async () => {
    const materials = (await loadLearningMaterials("bedroom"))!;
    render(<PhrasesSection materials={materials} />);

    expect(screen.getAllByText(/\(inferred\)/).length).toBeGreaterThan(0);
  });

  it("tells the learner when a unit has not been imported yet", async () => {
    const withMaterials = new Set(unitsWithLearningMaterials());
    const gap = Object.keys(COURSE_UNITS).find((id) => !withMaterials.has(id));
    expect(gap, "every unit now has materials — delete this test").toBeDefined();

    render(<LearningMaterialsScreen unitId={gap!} dispatch={vi.fn()} />);
    await waitFor(() =>
      expect(screen.getByText(/no study materials available/i)).toBeInTheDocument()
    );
  });
});

describe("study materials routing", () => {
  it("round-trips #/learn/<unit>/study", () => {
    const screenState = { id: "learning-materials", unitId: "bathroom" } as const;
    const { hash } = screenToHash(screenState);
    expect(hash).toBe("#/learn/bathroom/study");

    const route = hashToRoute(hash);
    expect(route).toEqual({
      kind: "screen",
      screen: { id: "learning-materials", unitId: "bathroom" },
      title: expect.stringContaining("Study Materials"),
    });
  });

  it("navigates there through GO and back to the unit entry", () => {
    const opened = reducer(
      { id: "lesson-entry", unitId: "bathroom" },
      { type: "GO", to: "learning-materials", unitId: "bathroom" }
    );
    expect(opened).toEqual({ id: "learning-materials", unitId: "bathroom" });

    const back = reducer(opened, { type: "GO", to: "lesson-entry", unitId: "bathroom" });
    expect(back).toEqual({ id: "lesson-entry", unitId: "bathroom" });
  });
});
