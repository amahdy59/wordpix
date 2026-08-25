import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearningMaterialsScreen } from "../learning/LearningMaterialsScreen";
import { hashToRoute, screenToHash } from "../router/useHashRouter";
import { reducer } from "../store/reducer";
import { COURSE_UNITS } from "../data/lessons";
import { unitsWithLearningMaterials } from "../learning/registry";

describe("LearningMaterialsScreen", () => {
  it("opens on the reading passage and offers a section for each imported block", async () => {
    render(<LearningMaterialsScreen unitId="bathroom" dispatch={vi.fn()} />);

    await waitFor(() =>
      expect(screen.getByRole("heading", { name: /reading passage/i })).toBeInTheDocument()
    );
    expect(screen.getByText(/Every morning starts in the bathroom/)).toBeInTheDocument();

    for (const label of [
      "Words",
      "Reading",
      "Idioms & Phrasal Verbs",
      "Dialogue",
      "Common Mistakes",
      "Word Forms",
      "Practice",
      "Culture & Usage",
      "Reference",
    ]) {
      expect(screen.getByRole("button", { name: new RegExp(label, "i") })).toBeInTheDocument();
    }
  });

  it("reveals the explanation only after a comprehension answer is chosen", async () => {
    const user = userEvent.setup();
    render(<LearningMaterialsScreen unitId="bathroom" dispatch={vi.fn()} />);

    await waitFor(() => screen.getByRole("heading", { name: /comprehension questions/i }));

    const explanation = /floss cleans between teeth rather than brushing them/i;
    expect(screen.queryByText(explanation)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /A toothbrush and toothpaste/i }));
    expect(screen.getByText(explanation)).toBeInTheDocument();
  });

  it("filters phrases down to phrasal verbs without losing the idioms", async () => {
    const user = userEvent.setup();
    render(<LearningMaterialsScreen unitId="bathroom" dispatch={vi.fn()} />);

    await waitFor(() => screen.getByRole("button", { name: /Idioms & Phrasal Verbs/i }));
    await user.click(screen.getByRole("button", { name: /Idioms & Phrasal Verbs/i }));

    expect(screen.getByText("throw in the towel")).toBeInTheDocument();
    expect(screen.getByText("freshen up")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /phrasal verbs \(/i }));
    expect(screen.getByText("freshen up")).toBeInTheDocument();
    expect(screen.queryByText("throw in the towel")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^All \(/i }));
    expect(screen.getByText("throw in the towel")).toBeInTheDocument();
  });

  it("marks fill-in-the-blank answers only once the learner asks", async () => {
    const user = userEvent.setup();
    render(<LearningMaterialsScreen unitId="bathroom" dispatch={vi.fn()} />);

    await waitFor(() => screen.getByRole("button", { name: /Practice/i }));
    await user.click(screen.getByRole("button", { name: /Practice/i }));

    await user.type(screen.getByLabelText("Answer for sentence 1"), "toothpaste");
    expect(screen.queryByText(/of 10 correct/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /check answers/i }));
    expect(screen.getByText("1 of 10 correct")).toBeInTheDocument();
  });

  it("shows unconvertible comprehension questions as unscored prompts", async () => {
    // Figma authors these open-ended, and some do not convert to multiple
    // choice honestly. They must still reach the learner rather than vanish.
    render(<LearningMaterialsScreen unitId="bedroom" dispatch={vi.fn()} />);

    await waitFor(() => screen.getByRole("heading", { name: /think about it/i }));
    const prompts = screen
      .getByRole("heading", { name: /think about it/i })
      .closest("div")!
      .querySelectorAll("li");
    expect(prompts.length).toBeGreaterThan(0);

    // They are prompts, not a quiz: no options to click inside that block.
    expect(
      screen
        .getByRole("heading", { name: /think about it/i })
        .closest("div")!
        .querySelectorAll("button").length
    ).toBe(0);
  });

  it("marks an inferred idiom or phrasal-verb label as inferred", async () => {
    const user = userEvent.setup();
    render(<LearningMaterialsScreen unitId="bedroom" dispatch={vi.fn()} />);

    await waitFor(() => screen.getByRole("button", { name: /Idioms & Phrasal Verbs/i }));
    await user.click(screen.getByRole("button", { name: /Idioms & Phrasal Verbs/i }));

    // The source file tags kinds for some units and not others; where it does
    // not, the label has to read as a guess rather than a fact.
    expect(screen.getAllByText(/\(inferred\)/).length).toBeGreaterThan(0);
  });

  it("tells the learner when a unit has not been imported yet", async () => {
    // Named `art-studio` until the design file grew materials for it, which is
    // exactly the brittleness worth removing: the unit without materials is
    // whichever one Figma has not covered yet, not a fixed id. Today that is
    // `human-body` — the one unit the file splits four ways — and the day that
    // is imported too, this test has nothing left to check and says so.
    const withMaterials = new Set(unitsWithLearningMaterials());
    const gap = Object.keys(COURSE_UNITS).find((id) => !withMaterials.has(id));
    expect(gap, "every unit now has materials — delete this test").toBeDefined();

    render(<LearningMaterialsScreen unitId={gap!} dispatch={vi.fn()} />);
    await waitFor(() => expect(screen.getByText(/no study materials yet/i)).toBeInTheDocument());
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
