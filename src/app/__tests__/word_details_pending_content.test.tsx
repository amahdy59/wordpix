import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "../context/I18nContext";
import { WordDetailsContent } from "../shared/WordDetailsContent";
import type { VocabularyItem } from "../data/lessons";

const pending = vi.hoisted(() => ({ failed: false, speak: vi.fn(), retry: vi.fn() }));
vi.mock("../shared/useLexicon", () => ({
  useLexicon: () => ({ lexicon: null, lexiconFailed: pending.failed, retryLexicon: pending.retry }),
}));
vi.mock("../shared/useAudio", () => ({ useAudio: () => ({ speak: pending.speak }) }));
const word: VocabularyItem = {
  id: "red",
  label: "Red",
  img: "/red.webp",
  phonetic: "",
  topic: "colors",
  description: "A primary color.",
};

describe("authored content during dictionary loading", () => {
  it.each([false, true])(
    "keeps the reviewed example and audio available when loading failed=%s",
    (failed) => {
      pending.failed = failed;
      pending.speak.mockClear();
      render(
        <I18nProvider>
          <WordDetailsContent word={word} unitId="colors" />
        </I18nProvider>
      );
      expect(screen.getByRole("region", { name: /Examples/i })).toHaveTextContent(
        "The apple is red."
      );
      fireEvent.click(screen.getByRole("button", { name: /Listen to the sentence/i }));
      expect(pending.speak).toHaveBeenCalledWith("The apple is red.");
      if (failed) expect(screen.getByRole("alert")).toBeVisible();
    }
  );
});
