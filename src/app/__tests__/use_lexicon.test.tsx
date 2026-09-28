import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useLexicon } from "../shared/useLexicon";
import { loadLexicon, type LoadedLexicon } from "../data/lexiconLoader";

vi.mock("../data/lexiconLoader", () => ({ loadLexicon: vi.fn() }));
const load = vi.mocked(loadLexicon);
const result: LoadedLexicon = {
  hasArabicGloss: () => true,
  hasReviewedLexiconExamples: () => true,
  getReviewedCollocations: () => [],
  getLexiconEntry: () => ({
    id: "bed",
    arabic: "",
    partOfSpeech: "noun",
    collocations: [],
    sentences: [],
  }),
};

describe("dictionary loading state", () => {
  beforeEach(() => load.mockReset());

  it("exposes loading, failure, retry and success without keeping stale errors", async () => {
    load.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(result);
    const hook = renderHook(() => useLexicon(["bed"]));
    expect(hook.result.current.lexicon).toBeNull();
    await waitFor(() => expect(hook.result.current.lexiconFailed).toBe(true));
    act(() => hook.result.current.retryLexicon());
    expect(hook.result.current.lexiconFailed).toBe(false);
    await waitFor(() => expect(hook.result.current.lexicon).toBe(result));
    expect(load).toHaveBeenCalledTimes(2);
  });

  it("does not expose an old word's result after navigation", async () => {
    let resolveOld: (value: LoadedLexicon) => void = () => undefined;
    load.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        })
    );
    load.mockResolvedValueOnce(result);
    const hook = renderHook(({ id }) => useLexicon([id]), { initialProps: { id: "bed" } });
    hook.rerender({ id: "shower" });
    await waitFor(() => expect(hook.result.current.lexicon).toBe(result));
    await act(async () => resolveOld({ ...result }));
    expect(hook.result.current.lexicon).toBe(result);
    hook.rerender({ id: "shower" });
    expect(load).toHaveBeenCalledTimes(2);
  });
});
