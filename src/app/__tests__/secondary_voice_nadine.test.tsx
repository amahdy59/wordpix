import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createHash, webcrypto } from "node:crypto";
import type { ReactNode } from "react";
import { heygenRecordingKey } from "../shared/heygenRecording";
import { isRecordingObjectKey, useAudio } from "../shared/useAudio";
import { DEFAULT_ACCESSIBILITY } from "../context/LearnerContext";
import { I18nProvider } from "../context/I18nContext";
import { SettingsModal } from "../core/SettingsModal";
import { SettingsPage } from "../core/SettingsPage";

const mocks = vi.hoisted(() => ({
  preferredVoice: "primary" as "primary" | "nadine",
  setAccessibility: vi.fn(),
  additional: vi.fn(async (): Promise<string | null> => null),
  edge: vi.fn(async (text: string): Promise<string | null> => {
    const hash = createHash("sha256").update(text).digest("hex");
    return `audio/edge-v1/en-US-JennyNeural/${hash}.mp3`;
  }),
  available: vi.fn(async () => true),
  heygen: vi.fn(async (): Promise<string | null> => null),
  override: vi.fn(() => false),
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
  hasPronunciationOverride: () => mocks.override(),
}));
vi.mock("../shared/additionalRecording", () => ({ additionalRecordingKey: mocks.additional }));
vi.mock("../shared/edgeRecording", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../shared/edgeRecording")>();
  return { ...actual, edgeRecordingKey: mocks.edge };
});
vi.mock("../shared/edgeRecordingAvailability", () => ({
  isEdgeRecordingAvailable: mocks.available,
}));
vi.mock("../shared/heygenRecording", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../shared/heygenRecording")>();
  return { ...actual, heygenRecordingKey: mocks.heygen };
});
vi.mock("../../lib/persistence/db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../lib/persistence/db")>();
  return {
    ...actual,
    getCachedAudio: async () => null,
    saveCachedAudio: vi.fn(),
  };
});
vi.mock("../context/LearnerContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../context/LearnerContext")>();
  return {
    ...actual,
    useLearner: () => ({
      state: {
        preferences: {
          englishLevel: "A1",
          startingUnitId: "unit-1",
          dailyGoalMinutes: 10,
          goal: "everyday",
          theme: "light",
          expression: "adult",
        },
        accessibility: { ...actual.DEFAULT_ACCESSIBILITY, preferredVoice: mocks.preferredVoice },
        learnerProgress: {
          xp: 0,
          streak: 0,
          lastStudiedDate: null,
          daysActive: 0,
          sessionsCompleted: 0,
          completedSessionIds: [],
        },
        wordMemory: {},
        sessionHistory: [],
        pronunciationProgress: {},
        hadithProgress: {},
        conversationProgress: {},
        businessProgress: {},
      },
      setPreferences: vi.fn(),
      setAccessibility: mocks.setAccessibility,
      resetToZero: vi.fn(),
    }),
  };
});

class StubAudio {
  static instances: StubAudio[] = [];
  currentTime = 0;
  duration = 5;
  volume = 1;
  playbackRate = 1;
  onplaying: (() => void) | null = null;
  onended: (() => void) | null = null;
  onerror: (() => void) | null = null;
  pause = vi.fn();
  constructor(public src: string) {
    StubAudio.instances.push(this);
  }
  async play() {
    this.onplaying?.();
  }
}

beforeAll(() => {
  if (!globalThis.crypto?.subtle)
    Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });
});

beforeEach(() => {
  mocks.preferredVoice = "primary";
  mocks.setAccessibility.mockReset();
  mocks.additional.mockReset().mockResolvedValue(null);
  mocks.available.mockReset().mockResolvedValue(true);
  mocks.heygen.mockReset().mockResolvedValue(null);
  mocks.override.mockReset().mockReturnValue(false);
  StubAudio.instances = [];
  vi.stubGlobal("Audio", StubAudio);
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("secondary HeyGen (Nadine) voice routing", () => {
  it("validates HeyGen object keys in isRecordingObjectKey", () => {
    expect(isRecordingObjectKey(`audio/heygen-v1/nadine/${"a".repeat(64)}.mp3`)).toBe(true);
    expect(isRecordingObjectKey("audio/heygen-v1/nadine/short.mp3")).toBe(false);
    expect(DEFAULT_ACCESSIBILITY.preferredVoice).toBe("primary");
  });

  it("keeps primary edge recording ahead of Nadine when preferredVoice is primary", async () => {
    const nadineKey = `audio/heygen-v1/nadine/${"c".repeat(64)}.mp3`;
    mocks.heygen.mockResolvedValue(nadineKey);
    const { result, unmount } = renderHook(() => useAudio());
    act(() => result.current.speak("Good morning."));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(StubAudio.instances.at(-1)?.src).toContain("/audio/edge-v1/en-US-JennyNeural/");
    expect(mocks.heygen).not.toHaveBeenCalled();
    unmount();
  });

  it("prioritizes Nadine when preferredVoice is nadine and preserves primary fallback", async () => {
    mocks.preferredVoice = "nadine";
    const nadineKey = `audio/heygen-v1/nadine/${"d".repeat(64)}.mp3`;
    mocks.heygen.mockResolvedValue(nadineKey);

    const { result, unmount } = renderHook(() => useAudio());
    act(() => result.current.speak("Good morning."));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(StubAudio.instances.at(-1)?.src).toBe(`https://assets.example/${nadineKey}`);

    // Fallback to primary Edge recording when a clip is not yet in heygenRecordings
    mocks.heygen.mockResolvedValue(null);
    act(() => result.current.speak("Not yet synthesized."));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(StubAudio.instances.at(-1)?.src).toContain("/audio/edge-v1/en-US-JennyNeural/");
    unmount();
  });

  it("prioritizes Nadine even when an explicit primary objectKey is passed", async () => {
    mocks.preferredVoice = "nadine";
    const nadineKey = `audio/heygen-v1/nadine/${"e".repeat(64)}.mp3`;
    mocks.heygen.mockResolvedValue(nadineKey);
    const explicit = "assets/audio/scenarios/airport/airport-1/01_tariq_check_in.mp3";

    const { result, unmount } = renderHook(() => useAudio());
    act(() => result.current.speak("Welcome to check-in.", "en-US", explicit));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(StubAudio.instances.at(-1)?.src).toBe(`https://assets.example/${nadineKey}`);
    unmount();
  });

  it("skips Nadine for Arabic clips and pronunciation overrides", async () => {
    mocks.preferredVoice = "nadine";
    const nadineKey = `audio/heygen-v1/nadine/${"f".repeat(64)}.mp3`;
    mocks.heygen.mockResolvedValue(nadineKey);

    const { result, unmount } = renderHook(() => useAudio({ lang: "ar-SA" }));
    act(() => result.current.speak("مرحبا", "ar-SA"));
    await waitFor(() => expect(result.current.status).toBe("playing"));
    expect(mocks.heygen).not.toHaveBeenCalled();

    mocks.override.mockReturnValue(true);
    act(() => result.current.speak("ant", "en-US"));
    await waitFor(() => expect(mocks.override).toHaveBeenCalled());
    expect(mocks.heygen).not.toHaveBeenCalled();
    unmount();
  });
});

describe("heygenRecordingKey real shard lookup", () => {
  it("resolves verified vocabulary reference examples and skips Arabic", async () => {
    const actualMod = await vi.importActual<typeof import("../shared/heygenRecording")>(
      "../shared/heygenRecording"
    );
    const { default: examples } = await import("../data/recordedReferenceExamples.json");
    const sample = Object.values(Object.values(examples)[0]!)[0]!.en;
    const key = await actualMod.heygenRecordingKey(sample, "en");
    expect(key).toMatch(/^audio\/heygen-v1\/nadine\/[a-f0-9]{64}\.mp3$/);
    expect(await actualMod.heygenRecordingKey(sample, "ar")).toBeNull();
    expect(await actualMod.heygenRecordingKey("   ", "en")).toBeNull();
    // Ensure imported symbol is referenced cleanly
    expect(typeof heygenRecordingKey).toBe("function");
  });
});

describe("Preferred Voice UI controls", () => {
  it("renders accessible Primary/Nadine buttons and dispatches preferredVoice updates", async () => {
    const Wrapper = ({ children }: { children: ReactNode }) => (
      <I18nProvider>{children}</I18nProvider>
    );
    const user = userEvent.setup();
    const { unmount } = render(
      <Wrapper>
        <SettingsModal isOpen onClose={vi.fn()} />
      </Wrapper>
    );
    const primaryBtn = screen.getByRole("button", { name: "Standard (Default)" });
    const nadineBtn = screen.getByRole("button", { name: "Nadine (Secondary)" });
    expect(primaryBtn).toHaveAttribute("aria-pressed", "true");
    expect(nadineBtn).toHaveAttribute("aria-pressed", "false");
    await user.click(nadineBtn);
    expect(mocks.setAccessibility).toHaveBeenCalledWith({ preferredVoice: "nadine" });
    unmount();

    render(
      <Wrapper>
        <SettingsPage dispatch={vi.fn()} />
      </Wrapper>
    );
    await user.click(screen.getByRole("button", { name: /audio & speech/i }));
    const pageNadineBtn = screen.getByRole("button", { name: "Nadine (Secondary)" });
    await user.click(pageNadineBtn);
    expect(mocks.setAccessibility).toHaveBeenCalledWith({ preferredVoice: "nadine" });
  });
});
