import { afterEach, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAudio } from "../shared/useAudio";

vi.mock("../shared/assetUrls", () => ({
  hasAssetHost: () => true,
  assetUrl: (key: string) => `https://assets.example/${key}`,
  audioUrls: async () => [
    "https://assets.example/primary.mp3",
    "https://assets.example/alternate.mp3",
  ],
  audioKey: async () => null,
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../shared/additionalRecording", () => ({ additionalRecordingKey: async () => null }));
vi.mock("../shared/edgeRecording", () => ({ edgeRecordingKey: async () => null }));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: async () => null,
  saveCachedAudio: vi.fn(),
}));
vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({ state: { accessibility: { speechRate: 1 } } }),
}));

class NetworkRecording {
  static instances: NetworkRecording[] = [];
  currentTime = 0;
  duration = 10;
  volume = 1;
  playbackRate = 1;
  onplaying: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  ontimeupdate: (() => void) | null = null;
  pause = vi.fn();
  constructor(public src: string) {
    NetworkRecording.instances.push(this);
  }
  async play() {
    if (this.src.endsWith("primary.mp3")) throw Error("Missing take");
    this.onplaying?.();
  }
}
afterEach(() => {
  vi.unstubAllGlobals();
  NetworkRecording.instances = [];
});

it("does not let late events from a failed take change the active recording or complete its question", async () => {
  vi.stubGlobal("Audio", NetworkRecording);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  const onEnded = vi.fn();
  const onTimeUpdate = vi.fn();
  const { result, unmount } = renderHook(() => useAudio({ onEnded, onTimeUpdate }));
  act(() => result.current.speak("Recorded context."));
  await waitFor(() => expect(result.current.status).toBe("playing"));
  const [failed, active] = NetworkRecording.instances;
  expect(active.src).toContain("alternate.mp3");
  onTimeUpdate.mockClear();
  act(() => {
    failed.currentTime = 8;
    failed.onplaying?.();
    failed.ontimeupdate?.();
    failed.onended?.();
    failed.onerror?.();
  });
  expect(onTimeUpdate).not.toHaveBeenCalled();
  expect(onEnded).not.toHaveBeenCalled();
  expect(result.current.status).toBe("playing");
  expect(failed.pause).toHaveBeenCalled();
  act(() => active.onended?.());
  expect(onEnded).toHaveBeenCalledOnce();
  unmount();
});
