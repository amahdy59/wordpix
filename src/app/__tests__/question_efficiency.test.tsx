import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nProvider } from "../context/I18nContext";
import { WordImage } from "../shared/WordImage";
import { getRichSentence } from "../exercises/exerciseContent";
import type { VocabularyItem } from "../data/courseCatalog";
import { loadUnitUsageForEditorial } from "../data/usageRegistry";
import {
  FIGMA_HADITH_LESSONS,
  getHadithVisualVocabulary,
} from "../learning/hadith/figmaHadithCatalog";
import { getParsedHadithStages } from "../learning/hadith/hadithLessonContent";
import {
  buildValidatedOptions,
  buildPracticeItems,
} from "../learning/study/practice/buildPracticeItems";

const word: VocabularyItem = {
  id: "eleven",
  label: "Eleven",
  phonetic: "/ɪˈlevən/",
  topic: "numbers-counting",
  img: "/eleven.avif",
  description: "The number after ten and before twelve.",
};

describe("answerable, focused questions", () => {
  beforeEach(() => localStorage.clear());

  it("does not reuse a group counting sentence as an individual example", () => {
    const examples = [
      "At a reception desk, three ticket stacks contain ten, eleven, and twelve tickets.",
      "A course coordinator prepares three sets of notebooks: thirteen, fourteen, and fifteen.",
      "The old question has ____ tickets.",
    ];
    for (const exampleUsage of examples) {
      const target = exampleUsage.includes("notebooks")
        ? { ...word, id: "thirteen", label: "Thirteen", exampleUsage }
        : { ...word, exampleUsage };
      expect(getRichSentence(target, null, 1).full).not.toBe(exampleUsage);
      expect(getRichSentence(target, null, 1).full).toMatch(new RegExp(target.label, "i"));
    }
  });

  it("retains ordinary usage and arithmetic examples", () => {
    expect(
      getRichSentence({ ...word, exampleUsage: "I bought eleven tickets." }, null, 1).full
    ).toBe("I bought eleven tickets.");
    expect(
      getRichSentence({
        ...word,
        id: "test-plus",
        label: "plus",
        exampleUsage: "Two plus three equals five.",
      }).full
    ).toBe("Two plus three equals five.");
  });

  it("does not share a multiple-target context across individual word questions", async () => {
    const [usage] = (await loadUnitUsageForEditorial("shapes-geometry"))!;
    const full = "The circle, square, and triangle are on the table.";
    const result = getRichSentence(
      { ...word, id: "circle-test", label: "Circle", exampleUsage: full },
      usage
    ).full;
    expect(result).not.toBe(full);
    expect(result).toMatch(/circle/i);
  });

  it("uses an answerable target frame when the example only contains an inflection", () => {
    const result = getRichSentence({
      ...word,
      id: "get-up-test",
      label: "Get Up",
      topic: "daily-routines",
      exampleUsage: "He gets up early.",
    }).full;
    expect(result).toMatch(/get up/i);
    expect(result).not.toBe("He gets up early.");
  });

  it("keeps all 42 Hadith reviews answerable and excludes exported progress copy", () => {
    for (const lesson of FIGMA_HADITH_LESSONS) {
      const items = getParsedHadithStages(lesson).review;
      expect(items.length, lesson.id).toBeGreaterThan(0);
      for (const item of items) {
        expect(item.answer.trim(), `${lesson.id}: ${item.question}`).not.toBe("");
        expect(item.question).not.toMatch(
          /Final Mastery Check|Lesson Finished|Passed:|Answer each question first/
        );
        expect(item.answer).not.toMatch(
          /NEXT STEPS|Lesson Completion|Outcome Summary|Finish Lesson/
        );
      }
    }
  });

  it("does not substitute an unrelated Hadith image for an unmatched term", () => {
    expect(getHadithVisualVocabulary(["an unknown vocabulary term"], 3)).toEqual([]);
  });

  it("deduplicates distractors regardless of capitalization", () => {
    expect(buildValidatedOptions("apple", ["Apple", "Pear", "pear", "PEAR"], 1)).toBeNull();
  });

  it("does not use other correction questions as distractors", () => {
    const items = buildPracticeItems(
      {
        unitId: "test",
        errorCorrection: [
          { id: "she", wrong: "She go home.", right: "She goes home." },
          { id: "they", wrong: "They is here.", right: "They are here." },
        ],
      },
      [],
      0
    );
    expect(items).toHaveLength(2);
    for (const item of items) {
      if (item.type !== "multipleChoice") throw new Error("Expected correction choices");
      expect(item.data.options).toHaveLength(2);
      expect(item.data.options).not.toContain(
        item.answerText.startsWith("She") ? "They are here." : "She goes home."
      );
    }
  });

  it("provides a visible clue after image failure and loads the next image", () => {
    const { rerender } = render(
      <I18nProvider>
        <WordImage word={word} altMode="assessment" />
      </I18nProvider>
    );
    fireEvent.error(screen.getByRole("img"));
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText("Image placeholder")).toBeVisible();
    expect(screen.getByText(word.description)).toBeVisible();
    expect(screen.getByText(/We’re updating this image/)).toBeVisible();
    rerender(
      <I18nProvider>
        <WordImage word={{ ...word, id: "twelve", img: "/twelve.avif" }} altMode="assessment" />
      </I18nProvider>
    );
    expect(screen.getByRole("img")).toHaveAttribute("src", "/twelve.avif");
    expect(screen.queryByText("Image placeholder")).not.toBeInTheDocument();
  });

  it("makes an image option with no URL answerable immediately", () => {
    render(
      <I18nProvider>
        <WordImage word={{ ...word, img: "" }} altMode="assessment" />
      </I18nProvider>
    );
    expect(screen.getByText(word.description)).toBeVisible();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
