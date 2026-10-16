import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { I18nProvider } from "../../i18n";
import { SpeechRecordCompare } from "../shared/SpeechRecordCompare";

const audio = vi.hoisted(() => ({
  status: "idle" as "idle" | "loading" | "playing" | "error" | "unsupported",
  speak: vi.fn(),
  stop: vi.fn(),
}));

const recording = vi.hoisted(() => ({
  status: "idle" as
    "unsupported" | "idle" | "requesting" | "recording" | "ready" | "denied" | "error",
  recordingUrl: null as string | null,
  recordingBlob: null as Blob | null,
  durationMs: 0,
  elapsedMs: 0,
  maxDurationMs: 60_000,
  start: vi.fn(),
  stop: vi.fn(),
  deleteRecording: vi.fn(),
}));

vi.mock("../shared/useAudio", () => ({
  useAudio: () => ({
    ...audio,
    isPlaying: audio.status === "playing" || audio.status === "loading",
    isSupported: audio.status !== "unsupported",
    isError: audio.status === "error",
  }),
}));

vi.mock("../shared/usePrivateRecording", () => ({
  usePrivateRecording: () => recording,
}));

function renderStudio() {
  return render(
    <I18nProvider>
      <SpeechRecordCompare
        target="Should smartphones be limited at school?"
        modelText="I think limits help students focus."
      />
    </I18nProvider>
  );
}

describe("SpeechRecordCompare", () => {
  beforeEach(() => {
    audio.status = "idle";
    audio.speak.mockClear();
    audio.stop.mockClear();
    recording.status = "idle";
    recording.recordingUrl = null;
    recording.recordingBlob = null;
    recording.durationMs = 0;
    recording.start.mockClear();
    recording.stop.mockClear();
    recording.deleteRecording.mockClear();
  });

  it("presents the private listen-record-compare sequence", async () => {
    const user = userEvent.setup();
    renderStudio();

    expect(screen.getByText(/never uploaded or saved/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Listen to the model" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Record your response" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Compare and reflect" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Play model" }));
    expect(audio.speak).toHaveBeenCalledWith("I think limits help students focus.");
    await user.click(screen.getByRole("button", { name: "Start recording" }));
    expect(recording.start).toHaveBeenCalledTimes(1);
  });

  it("offers local playback, duration reflection, and deletion when a recording is ready", async () => {
    const user = userEvent.setup();
    recording.status = "ready";
    recording.recordingUrl = "blob:private-recording";
    recording.recordingBlob = new Blob(["private audio"], { type: "audio/webm" });
    recording.durationMs = 12_000;
    renderStudio();

    expect(screen.getByText("Your response: 0:12")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Clear and confident" })).toBeInTheDocument();
    await user.click(screen.getByRole("radio", { name: "Clear and confident" }));
    expect(screen.getByRole("radio", { name: "Clear and confident" })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Delete private recording" }));
    expect(recording.deleteRecording).toHaveBeenCalledTimes(1);
  });
  it.each(["recording", "requesting"] as const)(
    "stops hidden media when a studio is collapsed during %s",
    (status) => {
      recording.status = status;
      renderStudio();
      const details = screen.getByText("Listen, record, and compare").closest("details")!;
      details.open = false;
      fireEvent(details, new Event("toggle"));
      expect(audio.stop).toHaveBeenCalled();
      if (status === "requesting") expect(recording.deleteRecording).toHaveBeenCalled();
      else expect(recording.stop).toHaveBeenCalled();
    }
  );

  it("renders as an open section without details/summary when noDetails is true", () => {
    const { container } = render(
      <I18nProvider>
        <SpeechRecordCompare target="ship" modelText="ship" noDetails />
      </I18nProvider>
    );
    const region = screen.getByRole("region", { name: "Listen, record, and compare" });
    expect(region).toBeVisible();
    expect(region.tagName.toLowerCase()).toBe("section");
    expect(screen.getByRole("heading", { name: "Listen, record, and compare" })).toBeVisible();
    // Verify outer element is not details
    expect(container.firstElementChild?.tagName.toLowerCase()).toBe("section");
  });
});
