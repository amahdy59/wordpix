import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { readLessonResume, saveLessonResume } from "../lesson/lessonResume";
import { COURSE_UNITS } from "../data/courseCatalog";
import { LessonWorldEntry } from "../lesson/LessonWorldEntry";
import { reducer } from "../store/reducer";
import type { Screen } from "../types";

const group = COURSE_UNITS.bedroom.groups[0];
const saved: Extract<Screen, { id: "lesson" }> = {
  id: "lesson",
  mode: "NEW_LESSON",
  unitId: "bedroom",
  lessonId: group.id,
  sessionId: "resume-test",
  wordQueue: group.wordIds.slice(0, 5),
  step: 2,
  totalSteps: 6,
  attempts: [
    {
      exerciseStep: 1,
      wordId: group.wordIds[0],
      correct: false,
      answeredAt: "2026-10-17T00:00:00Z",
      dimension: "listening-recognition",
    },
  ],
  startedAt: "2026-10-17T00:00:00Z",
};

beforeEach(() => localStorage.clear());

describe("Unit-scoped lesson resumption", () => {
  it("restores the same session, attempts and stage without resetting learning history", () => {
    saveLessonResume(saved);
    expect(readLessonResume("bedroom")).toEqual(saved);
    expect(
      reducer(
        { id: "lesson-entry", unitId: "bedroom" },
        { type: "RESUME_LESSON", unitId: "bedroom" }
      )
    ).toEqual(saved);
    expect(readLessonResume("bathroom")).toBeNull();
  });

  it.each([
    { ...saved, unitId: "bathroom" },
    { ...saved, wordQueue: ["not-a-bedroom-word"] },
    { ...saved, step: 6 },
    { ...saved, lessonId: "missing-group" },
    { ...saved, attempts: [{ correct: "false" }] },
  ])("ignores corrupt or mismatched saved state %#", (invalid) => {
    localStorage.setItem("wordpix:lesson-resume:bedroom", JSON.stringify(invalid));
    expect(readLessonResume("bedroom")).toBeNull();
    expect(reducer({ id: "home" }, { type: "RESUME_LESSON", unitId: "bedroom" })).toEqual({
      id: "home",
    });
  });

  it("removes a completed save without removing another unit's saved session", () => {
    saveLessonResume(saved);
    localStorage.setItem("wordpix:lesson-resume:bathroom", "keep");
    saveLessonResume({ ...saved, id: "lesson-complete" });
    expect(readLessonResume("bedroom")).toBeNull();
    expect(localStorage.getItem("wordpix:lesson-resume:bathroom")).toBe("keep");
  });

  it("offers Resume as the unit's primary action and requests the saved unit", () => {
    saveLessonResume(saved);
    const dispatch = vi.fn();
    render(<LessonWorldEntry unitId="bedroom" dispatch={dispatch} />);
    fireEvent.click(screen.getByRole("button", { name: "Resume lesson" }));
    expect(dispatch).toHaveBeenCalledWith({ type: "RESUME_LESSON", unitId: "bedroom" });
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: "START_LESSON" }));
  });

  it("resumes when clicking the in-progress group card directly", () => {
    saveLessonResume(saved);
    const dispatch = vi.fn();
    render(<LessonWorldEntry unitId="bedroom" dispatch={dispatch} />);
    fireEvent.click(
      screen.getByRole("button", { name: new RegExp(`group 1.*${group.name}`, "i") })
    );
    expect(dispatch).toHaveBeenCalledWith({ type: "RESUME_LESSON", unitId: "bedroom" });
    expect(dispatch).not.toHaveBeenCalledWith(expect.objectContaining({ type: "START_LESSON" }));
  });
});
