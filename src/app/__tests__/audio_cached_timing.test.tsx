import { afterEach, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAudio } from "../shared/useAudio";

vi.mock("../shared/assetUrls", () => ({
  assetUrl: (key: string) => `https://assets.example/${key}`,
  hasAssetHost: () => true,
  audioKey: async () => "audio/test.mp3",
  audioUrls: async () => ["https://assets.example/test.mp3"],
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: async () => new Blob(["verified audio bytes"], { type: "audio/mpeg" }),
  saveCachedAudio: vi.fn(),
}));
vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({ state: { accessibility: { speechRate: 1 } } }),
}));

class CachedAudio {
  static instances: CachedAudio[] = [];
  currentTime = 0;
  duration = 10;
  volume = 1;
  playbackRate = 1;
  onplaying: (() => void) | null = null;
  ontimeupdate: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  constructor() {
    CachedAudio.instances.push(this);
  }
  async play() {
    this.onplaying?.();
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  CachedAudio.instances = [];
});

it("reports cached media time without speech synthesis and ignores progress after stop", async () => {
  vi.stubGlobal("Audio", CachedAudio);
  vi.stubGlobal("speechSynthesis", undefined);
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:cached-timing");
  const progress = vi.fn();
  const { result } = renderHook(() =>
    useAudio({ onTimeUpdate: progress, rate: 0.85, volume: 0.5 })
  );
  expect(result.current.isSupported).toBe(true);
  act(() => result.current.speak("Recorded sentence.", "en-US", `audio/aa/${"a".repeat(64)}.mp3`));
  await waitFor(() => expect(CachedAudio.instances).toHaveLength(1));
  const audio = CachedAudio.instances[0];
  expect(audio.volume).toBe(0.5);
  expect(audio.playbackRate).toBe(0.85);
  act(() => {
    audio.currentTime = 2.5;
    audio.ontimeupdate?.();
  });
  expect(progress).toHaveBeenLastCalledWith(2.5, 10);
  act(() => result.current.stop());
  progress.mockClear();
  act(() => audio.ontimeupdate?.());
  expect(progress).not.toHaveBeenCalled();
});

it("clears measured timing when cached media fails and falls back", async () => {
  vi.stubGlobal("Audio", CachedAudio);
  vi.stubGlobal("speechSynthesis", undefined);
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:cached-failure");
  const progress = vi.fn();
  const { result } = renderHook(() => useAudio({ onTimeUpdate: progress }));
  act(() => result.current.speak("Another sentence.", "en-US", `audio/bb/${"b".repeat(64)}.mp3`));
  await waitFor(() => expect(CachedAudio.instances).toHaveLength(1));
  act(() => CachedAudio.instances[0].onerror?.());
  expect(progress).toHaveBeenLastCalledWith(0, 0);
  expect(result.current.status).toBe("error");
  expect(result.current.isSupported).toBe(true);
});
