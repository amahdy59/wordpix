import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../context/I18nContext";
import { SpecializedTracksCard } from "../core/SpecializedTracksCard";
import { HADITH_STAGE_IDS } from "../learning/hadith/hadithCurriculumStages";

const mockUseLearner = vi.hoisted(() => vi.fn());
vi.mock("../context/LearnerContext", () => ({ useLearner: mockUseLearner }));
const emptyProgress = {
  hadithProgress: {},
  pronunciationProgress: {},
  conversationProgress: {},
  businessProgress: {},
};
const updatedAt = "2026-10-08T12:00:00.000Z";

describe("specialist course resume card", () => {
  beforeEach(() => mockUseLearner.mockReturnValue({ state: emptyProgress }));

  it("distinguishes completed Hadith stages from mastery", () => {
    mockUseLearner.mockReturnValue({
      state: {
        ...emptyProgress,
        hadithProgress: {
          "hadith-01": {
            updatedAt,
            status: "needs-practice",
            completedStages: [...HADITH_STAGE_IDS],
          },
        },
      },
    });
    render(
      <I18nProvider>
        <SpecializedTracksCard dispatch={vi.fn()} />
      </I18nProvider>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "4/4 complete");
    expect(screen.queryByText("Mastered")).not.toBeInTheDocument();
  });

  it("shows the pronunciation stage rather than a quiz score and resumes its stable lesson ID", async () => {
    const dispatch = vi.fn();
    mockUseLearner.mockReturnValue({
      state: {
        ...emptyProgress,
        pronunciationProgress: {
          "lesson-25": { updatedAt, status: "in-progress", currentStage: 1, bestScorePercent: 95 },
        },
      },
    });
    render(
      <I18nProvider>
        <SpecializedTracksCard dispatch={dispatch} />
      </I18nProvider>
    );
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "40");
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuetext", "Stage 2 of 5");
    await userEvent.click(screen.getByRole("button", { name: /^Continue:/ }));
    expect(dispatch).toHaveBeenCalledWith({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: 25 });
  });

  it("ignores unknown saved lessons while retaining course shortcuts", () => {
    mockUseLearner.mockReturnValue({
      state: {
        ...emptyProgress,
        hadithProgress: { "hadith-99": { updatedAt, completedStages: [], status: "in-progress" } },
        pronunciationProgress: {
          unknown: { updatedAt, currentStage: 0, bestScorePercent: 0 },
          "lesson-99": { updatedAt, currentStage: 0, bestScorePercent: 0 },
        },
      },
    });
    render(
      <I18nProvider>
        <SpecializedTracksCard dispatch={vi.fn()} />
      </I18nProvider>
    );
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  it("retains the explicit migration for a legacy pronunciation lesson", async () => {
    const dispatch = vi.fn();
    mockUseLearner.mockReturnValue({
      state: {
        ...emptyProgress,
        pronunciationProgress: {
          "word-stress": { updatedAt, status: "in-progress", currentStage: 0, bestScorePercent: 0 },
        },
      },
    });
    render(
      <I18nProvider>
        <SpecializedTracksCard dispatch={dispatch} />
      </I18nProvider>
    );
    await userEvent.click(screen.getByRole("button", { name: /^Continue:/ }));
    expect(dispatch).toHaveBeenCalledWith({ type: "OPEN_FIGMA_PRONUNCIATION", lessonNumber: 41 });
  });
});
