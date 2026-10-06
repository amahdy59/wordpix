import { describe, expect, it } from "vitest";
import type { VocabularyItem } from "../data/courseCatalog";
import {
  findLessonContextSentence,
  findLessonContextSentences,
  parseSpacedReview,
  rotateOptions,
} from "../data/lessonContext";
import {
  lessonUsageDataSchema,
  unitUsageDataSchema,
  unitUsagePhraseDataSchema,
  usageLessonApprovalSchema,
} from "../data/usageTypes";
import { getRichSentence } from "../exercises/exerciseContent";

const usage = lessonUsageDataSchema.parse({
  lessonId: "market-1",
  lessonName: "Market 1",
  unitId: "market",
  unitName: "Market",
  unitOrder: 1,
  lessonOrderInUnit: 1,
  globalOrder: 2,
  cefrStage: "A1",
  stageName: "A1",
  targetWordsEnglish: ["Basket", "Stall"],
  targetWordsArabic: ["سلة", "كشك"],
  usage: {
    goal: "Buy food at a market.",
    canDoStatement: "I can buy food at a market.",
    textType: "Dialogue",
    readingTarget: "40 words",
    scenes: [
      {
        chunkNumber: 1,
        targetWords: ["Basket", "Stall"],
        scenario: "Maya carries a basket while she walks to the fruit stall.",
        check: {
          question: "What does Maya carry?",
          options: ["Basket", "Stall"],
          expectedAnswer: "Basket",
        },
        imageBrief: "A shopper carrying a basket at a fruit stall.",
      },
    ],
  },
  reading: {
    title: "At the market",
    text: "Maya visits the market before work.",
    imageBrief: "A busy local market.",
  },
  exercises: [{ prompt: "Use it: Ask for fruit.", answer: "Could I have some apples?" }],
  video: { title: "", idea: "", scriptStarter: "" },
  spacedReview: "1 lesson(s) back: Bag, Shop from shopping-1",
});

const word: VocabularyItem = {
  id: "basket",
  label: "Basket",
  phonetic: "ˈbɑːskɪt",
  img: "/word-images/market/basket.avif",
  topic: "market",
  description: "A container used to carry several things.",
};

describe("lesson context helpers", () => {
  it("finds a target inside its lesson scene", () => {
    expect(findLessonContextSentence(word, usage)).toBe(
      "Maya carries a basket while she walks to the fruit stall."
    );
  });

  it("keeps distinct authored contexts available to later practice stages", () => {
    const usageWithTransfer = {
      ...usage,
      reading: {
        ...usage.reading,
        text: "At lunch, Maya returns the basket before she goes to work.",
      },
    };
    expect(findLessonContextSentences(word, usageWithTransfer)).toHaveLength(2);
    expect(getRichSentence(word, usageWithTransfer, 1).full).toContain("returns the basket");
  });

  it("prefers a curated example and otherwise uses the lesson scene", () => {
    expect(
      getRichSentence({ ...word, exampleUsage: "She put the bread in her basket." }, usage).full
    ).toBe("She put the bread in her basket.");
    expect(getRichSentence(word, usage).full).toBe(
      "Maya carries a basket while she walks to the fruit stall."
    );
    expect(
      getRichSentence({ ...word, exampleUsage: "The basket was used during the activity." }, usage)
        .full
    ).toBe("Maya carries a basket while she walks to the fruit stall.");
  });

  it("turns positional review copy into structured intervals", () => {
    expect(parseSpacedReview(usage.spacedReview)).toEqual([
      { distance: 1, words: ["Bag", "Shop"], lessonId: "shopping-1" },
    ]);
  });

  it("balances answer positions deterministically", () => {
    expect(rotateOptions(["answer", "b", "c"], 1)).toEqual(["b", "c", "answer"]);
    expect(rotateOptions(["answer", "b", "c"], 2)).toEqual(["c", "answer", "b"]);
  });
});

describe("curriculum usage boundary", () => {
  it("rejects a usage check whose answer is not an exact authored option", () => {
    expect(() =>
      lessonUsageDataSchema.parse({
        ...usage,
        usage: {
          ...usage.usage,
          scenes: [
            {
              ...usage.usage.scenes[0],
              check: {
                question: "Which word completes the sentence?",
                options: ["Basket", "Bag"],
                expectedAnswer: "basket",
              },
            },
          ],
        },
      })
    ).toThrow(/exactly match one of the authored options/i);
  });

  it("validates every generated unit payload", async () => {
    const modules = import.meta.glob<{ default: unknown }>("../data/usage/*.usage.json", {
      eager: true,
    });
    expect(Object.keys(modules)).toHaveLength(200);
    for (const [path, module] of Object.entries(modules)) {
      expect(() => unitUsageDataSchema.parse(module.default), path).not.toThrow();
    }
  });

  it("validates every approved phrase export and rejects draft states", () => {
    const modules = import.meta.glob<{ default: unknown }>("../data/usagePhrases/*.phrases.json", {
      eager: true,
    });
    expect(Object.keys(modules).length).toBeGreaterThanOrEqual(5);
    for (const [path, module] of Object.entries(modules)) {
      expect(() => unitUsagePhraseDataSchema.parse(module.default), path).not.toThrow();
    }

    const approved = Object.values(modules)[0]?.default;
    expect(() =>
      unitUsagePhraseDataSchema.parse(
        Array.isArray(approved)
          ? approved.map((phrase) => ({
              ...(phrase as Record<string, unknown>),
              editorial: { status: "draft", reviewer: "Editor", revision: "1" },
            }))
          : approved
      )
    ).toThrow();
  });

  it("requires a complete, two-source approval before a lesson can ship", () => {
    const approval = {
      lessonId: "market-1",
      unitId: "market",
      contentRevision: "2026-09-30.1",
      status: "approved",
      reviewedBy: "Editor",
      reviewedAt: "2026-09-30",
      sources: ["https://dictionary.cambridge.org/", "https://www.oxfordlearnersdictionaries.com/"],
      checks: {
        scenarios: "approved",
        questions: "approved",
        reading: "approved",
        exercises: "approved",
        imageBriefs: "approved",
        cefr: "approved",
        arabic: "approved",
      },
    } as const;
    expect(() => usageLessonApprovalSchema.parse(approval)).not.toThrow();
    expect(() =>
      usageLessonApprovalSchema.parse({
        ...approval,
        checks: { ...approval.checks, arabic: "pending" },
      })
    ).toThrow();
    expect(() =>
      usageLessonApprovalSchema.parse({ ...approval, sources: [approval.sources[0]] })
    ).toThrow();
  });
});
