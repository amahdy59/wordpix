import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import {
  useSpeechRecognition,
  transcriptMatches,
  normaliseTranscript,
  editDistance,
} from "../shared/useSpeechRecognition";

describe("normaliseTranscript", () => {
  it("lowercases and strips punctuation", () => {
    expect(normaliseTranscript("A Pillow!")).toBe("a pillow");
  });

  it("collapses whitespace", () => {
    expect(normaliseTranscript("  the   lamp  ")).toBe("the lamp");
  });

  it("keeps non-Latin letters", () => {
    expect(normaliseTranscript("مرحبا!")).toBe("مرحبا");
  });
});

describe("editDistance", () => {
  it("is zero for identical strings", () => {
    expect(editDistance("lamp", "lamp")).toBe(0);
  });

  it("counts single edits", () => {
    expect(editDistance("lamp", "lamps")).toBe(1);
    expect(editDistance("lamp", "camp")).toBe(1);
  });

  it("handles empty input", () => {
    expect(editDistance("", "lamp")).toBe(4);
    expect(editDistance("lamp", "")).toBe(4);
  });
});

describe("transcriptMatches", () => {
  it("accepts an exact match", () => {
    expect(transcriptMatches("lamp", "Lamp")).toBe(true);
  });

  it("accepts the word inside a longer utterance", () => {
    expect(transcriptMatches("it is a lamp", "Lamp")).toBe(true);
  });

  it("ignores punctuation and casing", () => {
    expect(transcriptMatches("Wardrobe!", "wardrobe")).toBe(true);
  });

  /**
   * Recognition engines routinely return a near-spelling for a single spoken
   * word. Demanding an exact string would fail a learner who said it correctly.
   */
  it("tolerates a small engine slip", () => {
    expect(transcriptMatches("wardrobes", "Wardrobe")).toBe(true);
    expect(transcriptMatches("nightstands", "Nightstand")).toBe(true);
  });

  it("still rejects a genuinely different word", () => {
    expect(transcriptMatches("desk", "Lamp")).toBe(false);
    expect(transcriptMatches("mirror", "Pillow")).toBe(false);
  });

  it("rejects empty input rather than matching everything", () => {
    expect(transcriptMatches("", "Lamp")).toBe(false);
    expect(transcriptMatches("lamp", "")).toBe(false);
  });

  it("does not let tolerance swallow short words", () => {
    // "bed" and "bad" differ by one, but tolerance for a 3-letter target is 1,
    // so this documents the deliberate trade-off rather than pretending it is
    // stricter than it is.
    expect(transcriptMatches("desk", "bed")).toBe(false);
  });
});

/** Scriptable stand-in for the browser's SpeechRecognition. */
class MockRecognition {
  static instances: MockRecognition[] = [];
  lang = "";
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;
  onresult: ((e: unknown) => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;
  started = false;
  aborted = false;

  constructor() {
    MockRecognition.instances.push(this);
  }
  addEventListener() {}
  removeEventListener() {}
  dispatchEvent() {
    return true;
  }
  start() {
    this.started = true;
    this.onstart?.();
  }
  stop() {
    this.onend?.();
  }
  abort() {
    this.aborted = true;
  }

  emitResult(alternatives: { transcript: string; confidence: number }[]) {
    const result = Object.assign(alternatives.slice(), {
      length: alternatives.length,
      isFinal: true,
    });
    this.onresult?.({ resultIndex: 0, results: { 0: result, length: 1 } });
  }
  emitError(error: string) {
    this.onerror?.({ error });
  }
}

describe("useSpeechRecognition", () => {
  beforeEach(() => {
    MockRecognition.instances = [];
    vi.stubGlobal("SpeechRecognition", MockRecognition);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports unsupported when the browser has no engine", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("SpeechRecognition", undefined);
    vi.stubGlobal("webkitSpeechRecognition", undefined);

    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(false);
    expect(result.current.status).toBe("unsupported");
  });

  it("picks up the webkit-prefixed engine", () => {
    vi.unstubAllGlobals();
    vi.stubGlobal("SpeechRecognition", undefined);
    vi.stubGlobal("webkitSpeechRecognition", MockRecognition);

    const { result } = renderHook(() => useSpeechRecognition());
    expect(result.current.isSupported).toBe(true);
  });

  it("enters listening state when started", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    await waitFor(() => expect(result.current.isListening).toBe(true));
  });

  it("reports a match when the learner says the word", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitResult([{ transcript: "lamp", confidence: 0.9 }]));

    await waitFor(() => {
      expect(result.current.attempt?.matched).toBe(true);
      expect(result.current.attempt?.heard).toBe("lamp");
    });
  });

  it("reports a miss when a different word is heard", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitResult([{ transcript: "desk", confidence: 0.9 }]));

    await waitFor(() => expect(result.current.attempt?.matched).toBe(false));
  });

  /**
   * The top-ranked alternative is often a homophone while a lower-ranked one
   * is exactly right, so every alternative is checked.
   */
  it("searches every alternative, not just the most confident", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Wardrobe"));
    act(() =>
      MockRecognition.instances[0].emitResult([
        { transcript: "war drove", confidence: 0.95 },
        { transcript: "wardrobe", confidence: 0.4 },
      ])
    );

    await waitFor(() => expect(result.current.attempt?.matched).toBe(true));
  });

  it("distinguishes a blocked microphone from a failure", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitError("not-allowed"));

    await waitFor(() => expect(result.current.status).toBe("denied"));
  });

  it("reports silence separately so the learner is told to speak up", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitError("no-speech"));

    await waitFor(() => expect(result.current.status).toBe("no-speech"));
  });

  it("treats an aborted session as ordinary, not an error", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitError("aborted"));

    await waitFor(() => expect(result.current.status).not.toBe("error"));
  });

  it("aborts the session on unmount so the mic is released", () => {
    const { result, unmount } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    unmount();
    expect(MockRecognition.instances[0].aborted).toBe(true);
  });

  it("clears the previous attempt when listening again", async () => {
    const { result } = renderHook(() => useSpeechRecognition());
    act(() => result.current.listen("Lamp"));
    act(() => MockRecognition.instances[0].emitResult([{ transcript: "lamp", confidence: 0.9 }]));
    await waitFor(() => expect(result.current.attempt).not.toBeNull());

    act(() => result.current.listen("Desk"));
    expect(result.current.attempt).toBeNull();
  });
});

describe("Echo Practice reports no fabricated score", () => {
  async function readEchoPractice() {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const raw = readFileSync(resolve(__dirname, "../exercises/speaking/EchoPractice.tsx"), "utf8");
    return {
      raw,
      // The file's own comments quote the old fabricated output while
      // explaining why it is gone; assert against code only.
      code: raw
        .replace(/\{\s*\/\*[\s\S]*?\*\/\s*\}/g, "")
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .replace(/^\s*\/\/.*$/gm, ""),
    };
  }

  it("exposes only a boolean match, never a percentage", async () => {
    const { code } = await readEchoPractice();

    // The screen previously rendered a hardcoded 92% pronunciation score. The
    // Web Speech API gives no phoneme detail, so any percentage would be
    // invented all over again.
    expect(code).not.toMatch(/Phoneme Match/);
    expect(code).not.toMatch(/setScore/);
    expect(code).not.toMatch(/\{\s*\w*[Ss]core\w*\s*\}\s*%/);
  });

  it("tells the learner what the check does and does not measure", async () => {
    const { raw } = await readEchoPractice();
    expect(raw).toContain("not how well you pronounced it");
  });

  it("falls back to self-assessment where recognition is unavailable", async () => {
    const { code } = await readEchoPractice();
    expect(code).toContain("isSupported");
    expect(code).toContain("cannot listen to speech");
  });
});
