import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LEXICON_DICTIONARY, getLexiconEntry, hasArabicGloss } from "../data/lexiconDictionary";
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
    expect(fallback.collocations.length).toBeGreaterThan(0);
    // The English sentence has to be grammatical for whatever kind of word
    // reached the fallback, not `The ${label} is used in daily life.`
    expect(fallback.exampleSentence).toBe("This is a custom gadget XYZ.");
  });

  it("leaves the Arabic gloss empty rather than echoing the English label", () => {
    // Both screens that show a gloss render it inside `dir="rtl" lang="ar"`.
    // Returning the English label there laid the word out right-to-left and
    // told a screen reader it was Arabic.
    const fallback = getLexiconEntry("custom-gadget-xyz", "Custom Gadget XYZ");
    expect(fallback.arabic).toBe("");
    expect(hasArabicGloss(fallback)).toBe(false);
  });

  it("does not count an English string as an Arabic gloss", () => {
    // 93 generated entries carried `arabic: "Heat Stroke (Arabic)"`. A check
    // for emptiness would have passed every one of them.
    expect(hasArabicGloss({ arabic: "Heat Stroke (Arabic)" })).toBe(false);
    expect(hasArabicGloss({ arabic: "" })).toBe(false);
    expect(hasArabicGloss(getLexiconEntry("toilet"))).toBe(true);
  });

  it("has no placeholder entries left in the dictionary", () => {
    // The stubs read `arabic: "<Label> (Arabic)"` with the English sentence
    // copied into the `ar` field, and shipped to learners as real content.
    for (const [id, entry] of Object.entries(LEXICON_DICTIONARY)) {
      expect(hasArabicGloss(entry), `${id} must carry a real Arabic gloss`).toBe(true);
      for (const sentence of entry.sentences) {
        expect(sentence.ar, `${id} must not repeat its English sentence as Arabic`).not.toBe(
          sentence.en
        );
      }
    }
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

  it("portals the inspector outside the inert app root", () => {
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
    const mockWord: VocabularyItem = {
      id: "blinds",
      label: "Blinds",
      phonetic: "blaɪndz",
      img: "/word-images/bedroom/blinds.webp",
      topic: "bedroom-1",
      description: "Horizontal slats across a window that tilt to control the daylight.",
    };

    render(<WordInspectorModal word={mockWord} isOpen onClose={() => {}} />, {
      container: root,
    });

    const dialog = screen.getByRole("dialog");
    expect(root).toHaveAttribute("inert");
    expect(root).not.toContainElement(dialog);
    expect(dialog.closest("[inert]")).toBeNull();
  });
});
