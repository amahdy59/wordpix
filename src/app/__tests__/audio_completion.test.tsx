import { afterEach, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAudio } from "../shared/useAudio";
vi.mock("../shared/assetUrls", () => ({
  hasAssetHost: () => false,
  audioUrl: async () => null,
  audioKey: async () => null,
  normaliseText: (text: string) => text.trim(),
  AUDIO_PROFILE: {
    voiceId: "test",
    modelId: "test",
    stability: 0.7,
    similarityBoost: 0.75,
  },
}));
vi.mock("../context/LearnerContext", () => ({
  useLearner: () => ({ state: { accessibility: { speechRate: 1 } } }),
}));
afterEach(() => vi.unstubAllGlobals());
it("notifies natural completion but ignores an ending after stop or replacement", () => {
  const speak = vi.fn();
  vi.stubGlobal("speechSynthesis", {
    speak,
    cancel: vi.fn(),
    getVoices: () => [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    resume: vi.fn(),
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      text: string;
      constructor(text: string) {
        this.text = text;
      }
    }
  );
  const ended = vi.fn();
  const { result, unmount } = renderHook(() => useAudio({ onEnded: ended }));
  act(() => result.current.speak("bed"));
  const first = speak.mock.calls.at(-1)![0];
  act(() => first.onend());
  expect(ended).toHaveBeenCalledTimes(1);
  act(() => result.current.speak("chair"));
  const canceled = speak.mock.calls.at(-1)![0];
  act(() => result.current.stop());
  act(() => canceled.onend());
  expect(ended).toHaveBeenCalledTimes(1);
  act(() => result.current.speak("mirror"));
  const replaced = speak.mock.calls.at(-1)![0];
  act(() => result.current.speak("lamp"));
  act(() => replaced.onend());
  expect(ended).toHaveBeenCalledTimes(1);
  unmount();
});

it("reads corrected source text completely without requesting an outdated clip", () => {
  const speak = vi.fn();
  vi.stubGlobal("speechSynthesis", {
    speak,
    cancel: vi.fn(),
    getVoices: () => [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    resume: vi.fn(),
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    }
  );
  const { result, unmount } = renderHook(() => useAudio({ preferLocal: true }));
  const text = "The questioner (Gabriel) asked about faith. The reply explained its meaning.";
  act(() =>
    result.current.speak(text, "en-US", "audio/aa/" + "a".repeat(64) + ".mp3", {
      synthesisOnly: true,
    })
  );
  expect(speak.mock.calls.at(-1)![0].text).toBe(text);
  unmount();
});

it("preserves a complete fallback passage and restarts canceled device speech after a word takes over", () => {
  const speak = vi.fn();
  vi.stubGlobal("speechSynthesis", {
    speak,
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: () => [],
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  vi.stubGlobal(
    "SpeechSynthesisUtterance",
    class {
      constructor(public text: string) {}
    }
  );
  const { result, unmount } = renderHook(() => ({
    reading: useAudio({ preserveText: true }),
    word: useAudio(),
  }));
  const text = "The supplier (in another region) closed. Production / demand remained important.";
  act(() => result.current.reading.speak(text));
  expect(speak.mock.calls.at(-1)![0].text).toBe(text);
  act(() => speak.mock.calls.at(-1)![0].onstart());
  act(() => result.current.reading.pause());
  expect(result.current.reading.status).toBe("paused");
  act(() => result.current.reading.resume());
  expect(result.current.reading.status).toBe("playing");
  act(() => result.current.word.speak("supplier"));
  expect(result.current.reading.status).toBe("idle");
  act(() => result.current.reading.speak(text));
  expect(speak.mock.calls.at(-1)![0].text).toBe(text);
  unmount();
});
