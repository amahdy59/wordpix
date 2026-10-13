import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nProvider } from "../../i18n";
import { OnlinePronunciationFeedback } from "../shared/OnlinePronunciationFeedback";
import type { PronunciationAssessmentResult } from "../shared/pronunciationAssessment";

const assessment = vi.hoisted(() => ({ assess: vi.fn(), enabled: true }));
vi.mock("../shared/pronunciationAssessment", async (original) => ({
  ...(await original<typeof import("../shared/pronunciationAssessment")>()),
  assessPronunciation: assessment.assess,
  onlineAssessmentEnabled: () => assessment.enabled,
}));
const blob = new Blob(["real recorded input"]);
function view(target = "pin", onAssessed = vi.fn()) {
  return (
    <I18nProvider>
      <OnlinePronunciationFeedback blob={blob} target={target} onAssessed={onAssessed} />
    </I18nProvider>
  );
}
const result: PronunciationAssessmentResult = {
  status: "assessed",
  accuracy: 70,
  words: [
    { word: "pin", accuracy: 70, errorType: "None", phonemes: [{ phoneme: "p", accuracy: 80 }] },
  ],
};

describe("consented automatic pronunciation feedback", () => {
  beforeEach(() => {
    assessment.enabled = true;
    assessment.assess.mockReset();
  });
  afterEach(() => vi.useRealTimers());
  it("keeps recordings local until explicit opt-in and respects disabled configuration", async () => {
    assessment.enabled = false;
    render(view());
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(assessment.assess).not.toHaveBeenCalled();
  });
  it("automatically checks a recording after opt-in without treating estimates as mastery", async () => {
    assessment.assess.mockResolvedValue(result);
    const onAssessed = vi.fn();
    render(view("pin", onAssessed));
    expect(assessment.assess).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() => expect(onAssessed).toHaveBeenCalledOnce());
    expect(screen.getByText("Feedback received. Compare and try again.")).toBeVisible();
    expect(screen.queryByText(/mastered/i)).not.toBeInTheDocument();
  });
  it("ignores a response after consent is withdrawn", async () => {
    let resolve: (value: PronunciationAssessmentResult) => void = () => undefined;
    assessment.assess.mockReturnValue(
      new Promise<PronunciationAssessmentResult>((done) => {
        resolve = done;
      })
    );
    const onAssessed = vi.fn();
    render(view("pin", onAssessed));
    fireEvent.click(screen.getByRole("checkbox"));
    await waitFor(() => expect(assessment.assess).toHaveBeenCalledOnce());
    const signal = assessment.assess.mock.calls[0][2] as AbortSignal;
    fireEvent.click(screen.getByRole("checkbox"));
    await act(async () => resolve(result));
    expect(signal.aborted).toBe(true);
    expect(onAssessed).not.toHaveBeenCalled();
    expect(screen.queryByText("Feedback received. Compare and try again.")).not.toBeInTheDocument();
  });
  it("does not score no-speech results or network failures", async () => {
    assessment.assess.mockResolvedValue({ status: "unassessed", reason: "no-speech" });
    const onAssessed = vi.fn();
    const rendered = render(view("pin", onAssessed));
    fireEvent.click(screen.getByRole("checkbox"));
    await screen.findByText(/No usable speech was detected/);
    expect(onAssessed).not.toHaveBeenCalled();
    rendered.unmount();
    assessment.assess.mockRejectedValue(new Error("network unavailable"));
    render(view("pin", onAssessed));
    fireEvent.click(screen.getByRole("checkbox"));
    await screen.findByText(/Online feedback is not available/);
    expect(onAssessed).not.toHaveBeenCalled();
  });
});
