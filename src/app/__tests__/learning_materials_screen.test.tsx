import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  LearningMaterialsScreen,
  PassageSection,
  PhrasesSection,
} from "../learning/LearningMaterialsScreen";
import { PracticeArea } from "../learning/study/PracticeArea";
import { loadLearningMaterials, unitsWithLearningMaterials } from "../learning/registry";
import { initialStudyProgress } from "../learning/study/progress";
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

  it("opens an area-only study link on its first activity", async () => {
    render(<LearningMaterialsScreen unitId="bathroom" area="learn" dispatch={vi.fn()} />);

    await waitFor(() =>
      expect(
        screen.getByRole("heading", { level: 1, name: /Essential words/i })
      ).toBeInTheDocument()
    );
    expect(screen.queryByText(/Your Study Path/i)).not.toBeInTheDocument();
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

  it("renders live PracticeArea interactive exercises", async () => {
    const materials = (await loadLearningMaterials("bedroom"))!;
    const progress = initialStudyProgress("bedroom");
    const onProgressUpdate = vi.fn();

    render(
      <PracticeArea
        materials={materials}
        progress={progress}
        onProgressUpdate={onProgressUpdate}
        nodeId="practice-drill"
        onNextActivity={vi.fn()}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: /Practice Session/i })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/1 of/i).length).toBeGreaterThan(0);
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

  it("renders phrases cleanly without debug inferred markers", async () => {
    const materials = (await loadLearningMaterials("bedroom"))!;
    render(<PhrasesSection materials={materials} />);

    expect(screen.queryByText(/\(inferred\)/)).not.toBeInTheDocument();
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
