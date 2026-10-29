import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAudio, isRecordingObjectKey } from "../shared/useAudio";

const fixture = vi.hoisted(() => ({
  host: true,
  urls: vi.fn(async (text: string) => [`https://assets.example/${encodeURIComponent(text)}.mp3`]),
}));
vi.mock("../shared/assetUrls", () => ({
  hasAssetHost: () => fixture.host,
  assetUrl: (key: string) => `https://assets.example/${key}`,
  audioUrls: fixture.urls,
  audioKey: async () => "audio/test.mp3",
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../shared/additionalRecording", () => ({ additionalRecordingKey: async () => null }));
vi.mock("../shared/edgeRecording", () => ({ edgeRecordingKey: async () => null }));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: async () => new Blob(["valid cached recording"], { type: "audio/mpeg" }),
  saveCachedAudio: vi.fn(),
}));
vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({ state: { accessibility: { speechRate: 1 } } }),
}));

class RecordedAudio {
  static instances: RecordedAudio[] = [];
  currentTime = 0;
  duration = 12;
  volume = 1;
  playbackRate = 1;
  onplaying: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  constructor() {
    RecordedAudio.instances.push(this);
  }
  async play() {
    this.onplaying?.();
  }
}
beforeEach(() => {
  fixture.host = true;
  RecordedAudio.instances = [];
  vi.stubGlobal("Audio", RecordedAudio);
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:recording-completion");
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("reports unavailable audio without invoking device speech, including an unlocked device", () => {
  fixture.host = false;
  const speak = vi.fn();
  vi.stubGlobal("speechSynthesis", { speak });
  const onError = vi.fn();
  const { result } = renderHook(() => useAudio({ onError }));
  act(() => result.current.speak("bed"));
  expect(result.current.status).toBe("error");
  expect(speak).not.toHaveBeenCalled();
  expect(onError).toHaveBeenCalledOnce();
});

it("notifies natural recorded completion and ignores completion after stop or replacement", async () => {
  const ended = vi.fn();
  const { result, unmount } = renderHook(() => useAudio({ onEnded: ended }));
  act(() => result.current.speak("bed"));
  await waitFor(() => expect(result.current.status).toBe("playing"));
  const first = RecordedAudio.instances.at(-1)!;
  act(() => first.onended?.());
  expect(ended).toHaveBeenCalledTimes(1);
  act(() => result.current.speak("chair"));
  await waitFor(() => expect(RecordedAudio.instances).toHaveLength(2));
  const canceled = RecordedAudio.instances.at(-1)!;
  act(() => result.current.stop());
  act(() => canceled.onended?.());
  expect(ended).toHaveBeenCalledTimes(1);
  act(() => result.current.speak("mirror"));
  await waitFor(() => expect(RecordedAudio.instances).toHaveLength(3));
  const replaced = RecordedAudio.instances.at(-1)!;
  act(() => result.current.speak("lamp"));
  await waitFor(() => expect(RecordedAudio.instances).toHaveLength(4));
  act(() => replaced.onended?.());
  expect(ended).toHaveBeenCalledTimes(1);
  unmount();
});

it("looks up the complete corrected source transcript without an outdated explicit reference", async () => {
  const { result, unmount } = renderHook(() => useAudio());
  const text = "The questioner (Gabriel) asked about faith. The reply explained its meaning.";
  fixture.urls.mockClear();
  act(() => result.current.speak(text, "en-US"));
  await waitFor(() => expect(result.current.status).toBe("playing"));
  expect(fixture.urls).toHaveBeenCalledWith(text, expect.any(Array));
  expect(result.current.source).toBe("recording");
  unmount();
});

it("pauses a reading when a word takes ownership and resumes recorded media at its position", async () => {
  const { result, unmount } = renderHook(() => ({ reading: useAudio(), word: useAudio() }));
  const text = "The supplier (in another region) closed. Production / demand remained important.";
  act(() => result.current.reading.speak(text));
  await waitFor(() => expect(result.current.reading.status).toBe("playing"));
  const reading = RecordedAudio.instances.at(-1)!;
  reading.currentTime = 4;
  act(() => result.current.word.speak("supplier"));
  await waitFor(() => expect(result.current.word.status).toBe("playing"));
  expect(result.current.reading.status).toBe("paused");
  expect(reading.pause).toHaveBeenCalled();
  act(() => result.current.reading.resume());
  await waitFor(() => expect(result.current.reading.status).toBe("playing"));
  expect(reading.currentTime).toBe(4);
  expect(result.current.word.status).toBe("paused");
  unmount();
});

it("only accepts app-managed recording keys and rejects URLs and traversal", () => {
  expect(isRecordingObjectKey(`audio/aa/${"a".repeat(64)}.mp3`)).toBe(true);
  expect(isRecordingObjectKey(`audio/edge-v1/en-US-JennyNeural/${"a".repeat(64)}.mp3`)).toBe(true);
  expect(
    isRecordingObjectKey("assets/audio/scenarios/numbers-counting/numbers-counting-1/01_tariq.mp3")
  ).toBe(true);
  for (const key of [
    "https://example.com/audio.mp3",
    "assets/audio/scenarios/../private.mp3",
    "audio/edge-v1/other/" + "a".repeat(64) + ".mp3",
  ])
    expect(isRecordingObjectKey(key)).toBe(false);
});

it("bounds stalled cached playback and ignores late events from the failed request", async () => {
  vi.useFakeTimers();
  vi.spyOn(RecordedAudio.prototype, "play").mockImplementation(() => new Promise<void>(() => {}));
  const onError = vi.fn();
  const onEnded = vi.fn();
  const { result, unmount } = renderHook(() => useAudio({ onError, onEnded }));
  await act(async () => {
    result.current.speak("A stalled cached recording.");
    for (let turn = 0; turn < 20; turn++) await Promise.resolve();
  });
  const media = RecordedAudio.instances.at(-1)!;
  expect(result.current.status).toBe("loading");
  await act(async () => {
    await vi.advanceTimersByTimeAsync(15000);
  });
  expect(result.current.status).toBe("error");
  expect(media.pause).toHaveBeenCalled();
  expect(onError).toHaveBeenCalledOnce();
  act(() => {
    media.onplaying?.();
    media.onended?.();
  });
  expect(result.current.status).toBe("error");
  expect(onEnded).not.toHaveBeenCalled();
  unmount();
});
