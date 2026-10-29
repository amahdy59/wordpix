import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  playCorrectSound,
  playIncorrectSound,
  playLevelUpSound,
  playClickSound,
  resetAudioContextForTests,
} from "../shared/useSound";

/**
 * This file previously contained one test asserting the sound functions "run
 * safely without throwing". They each wrap their whole body in a try/catch that
 * swallows everything, so that assertion could never fail — it was a tautology
 * in the same family as the old a11y test.
 *
 * The real defect was resource management: getAudioContext() constructed a new
 * AudioContext on every call and never closed one. Chrome caps concurrent
 * contexts at roughly six, so after about six answers construction threw, the
 * catch swallowed it, and audio feedback silently died mid-lesson.
 */

interface FakeNode {
  connect: () => void;
  start: () => void;
  stop: () => void;
  type: string;
  frequency: { setValueAtTime: () => void; exponentialRampToValueAtTime: () => void };
  gain: { setValueAtTime: () => void; exponentialRampToValueAtTime: () => void };
}

function makeNode(): FakeNode {
  const ramp = { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() };
  return {
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    type: "sine",
    frequency: ramp,
    gain: ramp,
  };
}

let constructorCalls = 0;
let resumeCalls = 0;
let contextState: AudioContextState = "running";

class FakeAudioContext {
  currentTime = 0;
  destination = {};
  get state() {
    return contextState;
  }
  constructor() {
    constructorCalls += 1;
  }
  createOscillator() {
    return makeNode();
  }
  createGain() {
    return makeNode();
  }
  resume() {
    resumeCalls += 1;
    contextState = "running";
    return Promise.resolve();
  }
  close() {
    return Promise.resolve();
  }
}

beforeEach(() => {
  constructorCalls = 0;
  resumeCalls = 0;
  contextState = "running";
  vi.stubGlobal("AudioContext", FakeAudioContext);
  resetAudioContextForTests();
});

afterEach(() => {
  resetAudioContextForTests();
  vi.unstubAllGlobals();
});

describe("Sound effects", () => {
  it("creates exactly one AudioContext no matter how many sounds play", () => {
    for (let i = 0; i < 25; i += 1) {
      playCorrectSound();
      playIncorrectSound();
      playClickSound();
      playLevelUpSound();
    }
    expect(constructorCalls).toBe(1);
  });

  it("keeps working past the browser's concurrent-context limit", () => {
    // Six answers used to be the ceiling. Play well past it and assert the
    // oscillators are still being wired up.
    const spy = vi.spyOn(FakeAudioContext.prototype, "createOscillator");
    for (let i = 0; i < 20; i += 1) playCorrectSound();
    expect(spy).toHaveBeenCalled();
    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(20);
    spy.mockRestore();
  });

  it("resumes a context suspended by the autoplay policy", () => {
    playClickSound();
    contextState = "suspended";
    playClickSound();
    expect(resumeCalls).toBeGreaterThan(0);
  });

  it("degrades quietly when the Web Audio API is unavailable", () => {
    resetAudioContextForTests();
    vi.stubGlobal("AudioContext", undefined);
    expect(() => {
      playCorrectSound();
      playClickSound();
    }).not.toThrow();
  });

  it("stops retrying once construction has failed", () => {
    resetAudioContextForTests();
    let attempts = 0;
    vi.stubGlobal(
      "AudioContext",
      class {
        constructor() {
          attempts += 1;
          throw new Error("blocked");
        }
      }
    );

    for (let i = 0; i < 10; i += 1) playClickSound();
    expect(attempts).toBe(1);
  });
});

describe("Speech synthesis stall handling", () => {
  it("declares a timeout for utterances that never start", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(__dirname, "../shared/useAudio.ts"), "utf8");

    // With no installed voice, speak() can resolve to silence: neither onstart
    // nor onerror fires, leaving status pinned at "loading" — which isPlaying
    // counts, so the UI showed "Playing sound…" forever.
    expect(source).toContain("SPEECH_START_TIMEOUT_MS");
    expect(source).toMatch(/setStatus\(\(current\) => \(current === "loading" \? "error" : current\)\)/);
  });

  it("clears the stall timer on start, end, error, stop, and unmount", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(__dirname, "../shared/useAudio.ts"), "utf8");

    expect((source.match(/clearStall\(\)/g) ?? []).length).toBeGreaterThanOrEqual(4);
    expect(source).toContain("clearTimeout(stallTimerRef.current)");
  });

  it("no longer keeps a write-only utterance ref", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(__dirname, "../shared/useAudio.ts"), "utf8");
    expect(source).not.toContain("activeUtteranceRef");
  });
});
