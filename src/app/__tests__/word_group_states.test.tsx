import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { LessonWorldEntry } from "../lesson/LessonWorldEntry";
import { COURSE_UNITS } from "../data/lessons";
import { I18nProvider } from "../context/I18nContext";
import { createInitialWordState, type WordLearningState } from "../../features/gamification/sm2";
import { selectPracticeWordQueue } from "../lesson/lessonSequence";

const progress = vi.hoisted(() => ({
  wordMemory: {} as Record<string, WordLearningState>,
  wordMastery: {} as Record<string, number>,
}));
vi.mock("../data/progress", () => ({ useProgress: () => ({ progress }) }));

describe("word group learning state", () => {
  for (const state of ["Start", "Continue", "Review"] as const) {
    it(`offers one ${state} action with truthful progress`, () => {
      cleanup();
      const group = COURSE_UNITS.bedroom.groups[0];
      const familiarIds =
        state === "Review" ? group.wordIds : state === "Continue" ? group.wordIds.slice(0, 1) : [];
      progress.wordMemory = Object.fromEntries(
        familiarIds.map((id) => [
          id,
          {
            ...createInitialWordState(id),
            exposures: 1,
            mastery: "familiar" as const,
          },
        ])
      );
      progress.wordMastery = Object.fromEntries(familiarIds.map((id) => [id, 1]));
      const dispatch = vi.fn();
      render(
        <I18nProvider>
          <LessonWorldEntry unitId="bedroom" dispatch={dispatch} />
        </I18nProvider>
      );
      const action = screen.getByRole("button", {
        name: new RegExp(
          `^${state} lesson: ${group.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.`
        ),
      });
      expect(action).toBeVisible();
      if (state !== "Start") {
        expect(
          screen.getByRole("progressbar", { name: `${group.name} words learned` })
        ).toHaveAttribute("value", String(state === "Continue" ? 1 : group.wordIds.length));
      }
      fireEvent.click(action);
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "START_LESSON",
          lessonId: group.id,
          wordQueue: selectPracticeWordQueue(group.wordIds, progress.wordMemory),
        })
      );
    });
  }
});
