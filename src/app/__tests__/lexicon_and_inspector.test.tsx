import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { getLexiconEntry } from "../data/lexiconDictionary";
import { WordInspectorModal } from "../shared/WordInspectorModal";
import type { VocabularyItem } from "../data/lessons";

describe("Lexicon Dictionary & Inspector", () => {
  it("resolves exact dictionary entries with Arabic, collocations, and examples", () => {
    const entry = getLexiconEntry("bed");
    expect(entry.arabic).toContain("سَرِير");
    expect(entry.collocations.length).toBeGreaterThan(0);
    expect(entry.exampleSentence).toContain("bed");
    expect(entry.exampleArabic).toBeDefined();
  });

  it("provides graceful fallback for unmapped words", () => {
    const fallback = getLexiconEntry("custom-gadget", "Custom Gadget");
    expect(fallback.id).toBe("custom-gadget");
    expect(fallback.arabic).toBe("Custom Gadget");
    expect(fallback.collocations.length).toBeGreaterThan(0);
  });

  it("renders WordInspectorModal with accessible information", () => {
    const mockWord: VocabularyItem = {
      id: "pillow",
      label: "Pillow",
      phonetic: "/ˈpɪl.oʊ/",
      img: "/word-images/pillow.webp",
      topic: "bedding",
      description: "A soft cushion for the head",
    };

    const { rerender } = render(
      <WordInspectorModal word={mockWord} isOpen={true} onClose={() => {}} />
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("pillow")).toBeInTheDocument();
    expect(screen.getByText("/ˈpɪl.oʊ/")).toBeInTheDocument();
    expect(screen.getByText("وِسَادَة / مِخَدَّة")).toBeInTheDocument();

    // Rerender as closed
    rerender(<WordInspectorModal word={mockWord} isOpen={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
