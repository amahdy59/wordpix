import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LearningMaterialsScreen } from "../learning/LearningMaterialsScreen";
import { hashToRoute, screenToHash } from "../router/useHashRouter";
import { reducer } from "../store/reducer";

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

  it("tells the learner when a unit has not been imported yet", async () => {
    render(<LearningMaterialsScreen unitId="kitchen" dispatch={vi.fn()} />);
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
