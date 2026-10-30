import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useAudio } from "../shared/useAudio";

const lookup = vi.hoisted(() => ({
  additional: vi.fn(async (): Promise<string | null> => null),
  edge: vi.fn(
    async (text: string) =>
      `audio/edge-v1/en-US-JennyNeural/${(text.includes("persisted") ? "b" : "a").repeat(64)}.mp3`
  ),
  available: vi.fn(async () => true),
  cached: vi.fn(async (_key: string): Promise<Blob | null> => null),
}));
vi.mock("../shared/assetUrls", () => ({
  hasAssetHost: () => true,
  assetUrl: (key: string) => `https://assets.example/${key}`,
  audioUrls: async () => [],
  audioKey: async () => null,
  AUDIO_PROFILE_V4: {},
}));
vi.mock("../shared/pronunciationOverrides", () => ({
  getPronunciationAssetSpec: (text: string) => ({ text, profile: {} }),
  hasPronunciationOverride: () => false,
}));
vi.mock("../shared/additionalRecording", () => ({ additionalRecordingKey: lookup.additional }));
vi.mock("../shared/edgeRecording", () => ({ edgeRecordingKey: lookup.edge }));
vi.mock("../shared/edgeRecordingAvailability", () => ({
  isEdgeRecordingAvailable: lookup.available,
}));
vi.mock("../../lib/persistence/db", () => ({
  getCachedAudio: lookup.cached,
  saveCachedAudio: vi.fn(),
}));
vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({ state: { accessibility: { speechRate: 1 } } }),
}));

class Recording {
  static instances: Recording[] = [];
  currentTime = 1;
  duration = 20;
  volume = 1;
  playbackRate = 1;
  onplaying: (() => void) | null = null;
  onwaiting: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  constructor(public src: string) {
    Recording.instances.push(this);
  }
  async play() {
    this.onplaying?.();
  }
}

beforeEach(() => {
  lookup.additional.mockReset().mockResolvedValue(null);
  lookup.edge.mockClear();
  lookup.available.mockReset().mockResolvedValue(true);
  lookup.cached.mockReset().mockResolvedValue(null);
  Recording.instances = [];
  vi.stubGlobal("Audio", Recording);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("recording recovery and startup", () => {
  it("plays a persisted exact recording when its availability index cannot load offline", async () => {
    lookup.available.mockResolvedValue(false);
    lookup.cached.mockImplementation(async (key) =>
      key.includes("/edge-v1/")
        ? new Blob(["nonempty previously verified recording"], { type: "audio/mpeg" })
        : null
    );
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:offline-exact-recording");
    const { result, unmount } = renderHook(() => useAudio());
    act(() => result.current.speak("An exact persisted recording."));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(Recording.instances.at(-1)?.src).toBe("blob:offline-exact-recording");
    unmount();
  });
  it("offers recovery when a recording stalls after playback has already started", async () => {
    const onError = vi.fn();
    const onEnded = vi.fn();
    const { result, unmount } = renderHook(() => useAudio({ onError, onEnded }));
    act(() => result.current.speak("Buffering recovery."));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    const media = Recording.instances.at(-1)!;
    vi.useFakeTimers();
    act(() => media.onwaiting?.());
    expect(result.current.status).toBe("buffering");
    act(() => vi.advanceTimersByTime(15001));
    expect(result.current.status).toBe("error");
    expect(onError).toHaveBeenCalledOnce();
    expect(media.pause).toHaveBeenCalled();
    act(() => {
      media.onplaying?.();
      media.onended?.();
    });
    expect(result.current.status).toBe("error");
    expect(onEnded).not.toHaveBeenCalled();
    unmount();
  });

  it.each(["playing", "pause"] as const)(
    "cancels the buffering deadline after %s",
    async (event) => {
      const onError = vi.fn();
      const { result, unmount } = renderHook(() => useAudio({ onError }));
      act(() => result.current.speak(`Recovered by ${event}.`));
      await waitFor(() => expect(result.current.status).toBe("playing"));
      const media = Recording.instances.at(-1)!;
      vi.useFakeTimers();
      act(() => media.onwaiting?.());
      act(() => (event === "playing" ? media.onplaying?.() : result.current.pause()));
      act(() => vi.advanceTimersByTime(15001));
      expect(result.current.status).toBe(event === "playing" ? "playing" : "paused");
      expect(onError).not.toHaveBeenCalled();
      unmount();
    }
  );

  it("overlaps independent alias and verified-recording lookups without changing priority", async () => {
    let resolveAlias!: (value: string | null) => void;
    lookup.additional.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveAlias = resolve;
        })
    );
    const { result, unmount } = renderHook(() => useAudio());
    act(() => result.current.speak("Cold lookup."));
    await waitFor(() => expect(lookup.additional).toHaveBeenCalled());
    expect(lookup.edge).toHaveBeenCalled();
    await act(async () => resolveAlias(`audio/aa/${"b".repeat(64)}.mp3`));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(Recording.instances.at(-1)?.src).toContain(`/audio/aa/${"b".repeat(64)}.mp3`);
    unmount();
  });
});
