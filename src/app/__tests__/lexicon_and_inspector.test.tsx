import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import type { VocabularyItem } from "../data/lessons";
import { BEDROOM_VOCABULARY } from "../data/lessons";

describe("Lexicon Dictionary & Inspector", () => {
  it("resolves exact dictionary entries with Arabic, collocations, phrasal verbs, and sentences", () => {
    const entry = getLexiconEntry("bed");
    expect(entry.arabic).toContain("سَرِير");
    expect(entry.collocations.length).toBeGreaterThanOrEqual(4);
    expect(entry.sentences.length).toBeGreaterThanOrEqual(3);
    expect(entry.exampleSentence).toContain("bed");
    expect(entry.exampleArabic).toBeDefined();
  });

  it("ensures core vocabulary items have rich dictionary coverage", () => {
    const coreWords = BEDROOM_VOCABULARY.map((w: VocabularyItem) => w.id);

    for (const wordId of coreWords) {
      const entry = getLexiconEntry(wordId);
      expect(entry.arabic, `Word ${wordId} must have Arabic translation`).toBeTruthy();
      expect(
        entry.collocations.length,
        `Word ${wordId} must have collocations`
      ).toBeGreaterThanOrEqual(1);
      expect(
        entry.sentences.length,
        `Word ${wordId} must have contextual sentences`
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it("provides graceful fallback for completely unknown words", () => {
    const fallback = getLexiconEntry("custom-gadget-xyz", "Custom Gadget XYZ");
    expect(fallback.id).toBe("custom-gadget-xyz");
    expect(fallback.arabic).toBe("Custom Gadget XYZ");
    expect(fallback.collocations.length).toBeGreaterThan(0);
  });

  it("renders WordInspectorModal with authentic details", () => {
    const mockWord: VocabularyItem = {
      id: "blinds",
      label: "Blinds",
      phonetic: "blaɪndz",
      img: "/word-images/bedroom/blinds.webp",
      topic: "bedroom-1",
      description: "Horizontal slats across a window that tilt to control the daylight.",
    };

    render(<WordInspectorModal word={mockWord} isOpen={true} onClose={() => {}} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
