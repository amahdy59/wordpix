import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { I18nProvider } from "../../i18n";
import {
  normalizePronunciationProgress,
  normalizePronunciationSession,
} from "../learning/foundations/pronunciationProgress";
import {
  pronunciationContentRevision,
  resumablePronunciationSession,
} from "../learning/foundations/pronunciationTargets";
import { AudioRecoveryStatus } from "../shared/AudioRecoveryStatus";
import { ReadingVocabulary } from "../shared/ReadingVocabulary";

const session = {
  version: 2 as const,
  trial: 0,
  attempts: 0,
  answer: null,
  unlockedStage: 1,
  outcomes: {},
  targetEvidence: {},
};
afterEach(() => vi.restoreAllMocks());

describe("saved pronunciation boundaries", () => {
  it.each([NaN, Infinity, -Infinity])("recovers non-finite progress values (%s)", (value) => {
    const progress = normalizePronunciationProgress({
      "lesson-03": {
        status: "in-progress",
        currentStage: value,
        bestScorePercent: value,
        sessions: value,
        updatedAt: "invalid",
        nextReviewAt: "invalid",
      },
    })["lesson-03"];
    expect(progress).toEqual({
      status: "in-progress",
      currentStage: 0,
      bestScorePercent: 0,
      sessions: 0,
      updatedAt: new Date(0).toISOString(),
    });
  });
  it("retains earned evidence when a contradictory attempt cannot resume", () => {
    const evidence = { "target:pin": { listening: true, updatedAt: "2026-10-13T12:00:00Z" } };
    const progress = normalizePronunciationProgress({
      "lesson-03": {
        status: "needs-practice",
        currentStage: 4,
        bestScorePercent: 85,
        sessions: 3,
        updatedAt: "2026-10-13T12:00:00Z",
        session: { ...session, targetEvidence: evidence },
      },
    })["lesson-03"];
    expect(progress.session).toBeUndefined();
    expect(progress).toMatchObject({ bestScorePercent: 85, sessions: 3, targetEvidence: evidence });
  });
  it("rejects unsupported checkpoint versions and unsafe attempt counts", () => {
    expect(normalizePronunciationSession({ ...session, version: 999 })).toBeUndefined();
    expect(
      normalizePronunciationSession({ ...session, attempts: Number.MAX_SAFE_INTEGER + 1 })
    ).toBeUndefined();
    expect(
      normalizePronunciationSession({ ...session, currentTargetId: "target:" })
    ).toBeUndefined();
  });
  it("does not coerce an invalid status or stage into a resumable attempt", () => {
    const saved = {
      status: "in-progress",
      currentStage: 99,
      bestScorePercent: 80,
      sessions: 2,
      session: { ...session, unlockedStage: 4 },
    };
    expect(
      normalizePronunciationProgress({ "lesson-03": { ...saved, status: ["mastered"] } })
    ).toEqual({});
    const loaded = normalizePronunciationProgress({ "lesson-03": saved })["lesson-03"];
    expect(loaded.session).toBeUndefined();
    expect(loaded.bestScorePercent).toBe(80);
    expect(loaded.currentStage).toBe(4);
  });
  it("rejects outdated content, absent targets and out-of-range trials instead of carrying an answer", () => {
    expect(
      resumablePronunciationSession(3, 1, { ...session, contentRevision: "outdated" })
    ).toBeUndefined();
    expect(
      resumablePronunciationSession(3, 1, { ...session, currentTargetId: "target:missing" })
    ).toBeUndefined();
    expect(
      resumablePronunciationSession(3, 1, { ...session, trial: 500, answer: "pin" })
    ).toBeUndefined();
    expect(
      resumablePronunciationSession(3, 3, {
        ...session,
        unlockedStage: 3,
        outcomes: { "3:target:pin": true },
      })
    ).toBeUndefined();
    expect(
      resumablePronunciationSession(3, 1, {
        ...session,
        contentRevision: pronunciationContentRevision(3),
      })
    ).toEqual({ ...session, contentRevision: pronunciationContentRevision(3) });
  });
});

describe("recoverable, focused learning controls", () => {
  it("announces the offline recovery hint only after playback fails and updates on reconnect", () => {
    const online = vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const { rerender } = render(
      <I18nProvider>
        <AudioRecoveryStatus failed={false} />
      </I18nProvider>
    );
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
    rerender(
      <I18nProvider>
        <AudioRecoveryStatus failed />
      </I18nProvider>
    );
    expect(screen.getByRole("status")).toHaveTextContent(/offline.*Reconnect and retry/);
    online.mockReturnValue(true);
    act(() => window.dispatchEvent(new Event("online")));
    expect(screen.getByRole("status")).toHaveTextContent(/Check your volume and try again/);
  });
  it("keeps every glossary term available while hiding the long tail by default", () => {
    const select = vi.fn();
    render(
      <I18nProvider>
        <ReadingVocabulary
          terms={["one", "two", "three", "four", "five", "six", "seven", "eight"]}
          onSelect={select}
        />
      </I18nProvider>
    );
    const more = screen.getByText("More words (2)");
    expect(more.closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("six").closest("details")).toBeNull();
    expect(screen.getByText("seven").closest("details")).toBe(more.closest("details"));
    fireEvent.click(more);
    // happy-dom does not implement native details activation.
    const details = more.closest("details")!;
    details.open = true;
    expect(screen.getAllByRole("button")).toHaveLength(8);
    fireEvent.click(screen.getByRole("button", { name: /learn about eight/i }));
    expect(select).toHaveBeenCalledWith("eight");
  });
});
