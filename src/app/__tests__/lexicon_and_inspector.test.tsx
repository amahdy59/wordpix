import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import type { VocabularyItem } from "../data/lessons";
import { ALL_VOCABULARY } from "../data/lessons";

describe("Lexicon Dictionary & Inspector", () => {
  it("resolves exact dictionary entries with Arabic, collocations, phrasal verbs, and sentences", () => {
    const entry = getLexiconEntry("bed");
    expect(entry.arabic).toContain("سَرِير");
    expect(entry.collocations.length).toBeGreaterThanOrEqual(4);
    expect(entry.sentences.length).toBeGreaterThanOrEqual(3);
    expect(entry.exampleSentence).toContain("bed");
    expect(entry.exampleArabic).toBeDefined();
  });

  it("ensures all words in curriculum have 100% dictionary coverage with 0 generic fallbacks", () => {
    const uniqueWordIds = Array.from(new Set(ALL_VOCABULARY.map((w: VocabularyItem) => w.id)));

    expect(uniqueWordIds.length).toBeGreaterThan(200);

    for (const wordId of uniqueWordIds) {
      const entry = getLexiconEntry(wordId);
      expect(entry.arabic, `Word ${wordId} must have Arabic translation`).toBeTruthy();
      expect(entry.arabic, `Word ${wordId} must not fall back to English ID`).not.toBe(wordId);
      expect(
        entry.collocations.length,
        `Word ${wordId} must have authentic collocations`
      ).toBeGreaterThanOrEqual(3);
      expect(
        entry.sentences.length,
        `Word ${wordId} must have at least 3 contextual sentences`
      ).toBeGreaterThanOrEqual(3);
      // Ensure no placeholder string in sentences
      expect(entry.sentences[0].en).not.toContain("used in daily life");
    }
  });

  it("provides graceful fallback for completely unknown words", () => {
    const fallback = getLexiconEntry("custom-gadget-xyz", "Custom Gadget XYZ");
    expect(fallback.id).toBe("custom-gadget-xyz");
    expect(fallback.arabic).toBe("Custom Gadget XYZ");
    expect(fallback.collocations.length).toBeGreaterThan(0);
  });

  it("renders WordInspectorModal with authentic Oxford/Cambridge details", () => {
    const mockWord: VocabularyItem = {
      id: "blinds",
      label: "Blinds",
      phonetic: "blaɪndz",
      img: "/word-images/blinds.webp",
      topic: "features",
      description: "Horizontal slats across a window that tilt to control the daylight.",
    };

    const { rerender } = render(
      <WordInspectorModal word={mockWord} isOpen={true} onClose={() => {}} />
    );

    const entry = getLexiconEntry("blinds");
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("blinds")).toBeInTheDocument();
    expect(screen.getByText(entry.arabic)).toBeInTheDocument();
    expect(screen.getByText(/Essential Collocations/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-World Usage Contexts/i)).toBeInTheDocument();

    // Rerender as closed
    rerender(<WordInspectorModal word={mockWord} isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
