import { afterEach, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAudio } from "../shared/useAudio";
vi.mock("../shared/assetUrls", () => ({ hasAssetHost: () => false, audioUrl: async () => null }));
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
