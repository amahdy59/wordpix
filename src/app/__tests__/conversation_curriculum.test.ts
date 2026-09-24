import { describe, it, expect } from "vitest";
import {
  CONVERSATION_UNITS,
  getConversationUnit,
  getUnitsByCefr,
} from "../learning/conversation/conversationCatalog";
import {
  conversationUnitSchema,
  CEFR_LEVELS,
  CONVERSATION_STAGE_IDS,
} from "../learning/conversation/conversationTypes";

describe("Conversation & Debate (B1–C2) Curriculum", () => {
  it("contains exactly 40 units across 4 CEFR levels", () => {
    expect(CONVERSATION_UNITS).toHaveLength(40);
    expect(getUnitsByCefr("B1")).toHaveLength(10);
    expect(getUnitsByCefr("B2")).toHaveLength(10);
    expect(getUnitsByCefr("C1")).toHaveLength(10);
    expect(getUnitsByCefr("C2")).toHaveLength(10);
  });

  it("assigns sequential unit numbers 1 through 40 with stable IDs", () => {
    CONVERSATION_UNITS.forEach((unit, idx) => {
      const expectedNumber = idx + 1;
      const expectedId = `unit-${String(expectedNumber).padStart(2, "0")}`;
      expect(unit.unitNumber).toBe(expectedNumber);
      expect(unit.id).toBe(expectedId);
    });
  });

  it("validates every unit against the strict conversationUnitSchema", () => {
    CONVERSATION_UNITS.forEach((unit) => {
      const result = conversationUnitSchema.safeParse(unit);
      if (!result.success) {
        console.error(`Unit validation error in ${unit.id}:`, result.error.format());
      }
      expect(result.success).toBe(true);
    });
  });

  it("verifies locked 7-part pedagogical structure in every unit", () => {
    CONVERSATION_UNITS.forEach((unit) => {
      // 1. Warm-up
      expect(unit.warmup.bigQuestion).toBeTruthy();
      expect(unit.warmup.bigQuestionAr).not.toBe(unit.warmup.bigQuestion);
      expect(unit.warmup.prompts.length).toBeGreaterThanOrEqual(2);
      expect(unit.warmup.quickVote.options.length).toBeGreaterThanOrEqual(2);

      // 2. Read & Understand
      expect(unit.reading.paragraphs.length).toBeGreaterThanOrEqual(3);
      expect(unit.reading.inShort.summary).toBeTruthy();
      expect(unit.reading.inShort.targetTerms.length).toBeGreaterThanOrEqual(3);

      // 3. Language Bank (exactly 10 items)
      expect(unit.languageBank).toHaveLength(10);
      unit.languageBank.forEach((item, itemIndex) => {
        expect(item.term).toBeTruthy();
        expect(item.termAr).not.toBe(item.term);
        expect(item.meaning).toBeTruthy();
        expect(item.meaningAr).not.toBe(item.meaning);
        expect(item.example).toBeTruthy();
        expect(item.imageDescription).toBeTruthy();
        expect(item.imageSrc).toMatch(
          new RegExp(
            `^/conversation/v1/images/unit-${String(unit.unitNumber).padStart(2, "0")}/${String(itemIndex + 1).padStart(2, "0")}-[a-z0-9-]+\\.webp$`
          )
        );
      });

      // 4. Toolkit (4 functional templates)
      expect(unit.toolkit.phrases.length).toBeGreaterThanOrEqual(3);

      // 5. Quiz (exactly 10 questions with valid keyed answer)
      expect(unit.quiz).toHaveLength(10);
      unit.quiz.forEach((q) => {
        expect(["A", "B", "C", "D"]).toContain(q.correctAnswer);
        expect(q.options.length).toBeGreaterThanOrEqual(3);
      });

      // 6. Discussion (6 deep questions)
      expect(unit.discussion).toHaveLength(6);

      // 7. Speaking Challenge
      expect(unit.speakingChallenge.title).toBeTruthy();
      expect(unit.speakingChallenge.tasks.length).toBeGreaterThanOrEqual(1);

      // Research citations
      expect(unit.researchBasis.length).toBeGreaterThanOrEqual(1);
    });
  });

  it("retrieves individual units via getConversationUnit helper", () => {
    const unit1 = getConversationUnit("unit-01");
    expect(unit1).toBeDefined();
    expect(unit1?.title).toBe("Could You Live Without Your Smartphone for a Month?");
    expect(unit1?.level).toBe("B1");

    const unit40 = getConversationUnit("unit-40");
    expect(unit40).toBeDefined();
    expect(unit40?.title).toBe("Does Technological Progress Necessarily Mean Human Progress?");
    expect(unit40?.level).toBe("C2");

    expect(getConversationUnit("non-existent")).toBeUndefined();
  });

  it("exports valid stage identifiers and CEFR levels", () => {
    expect(CONVERSATION_STAGE_IDS).toEqual([
      "warmup",
      "reading",
      "vocabulary",
      "toolkit",
      "quiz",
      "discussion",
      "challenge",
    ]);
    expect(CEFR_LEVELS).toEqual(["B1", "B2", "C1", "C2"]);
  });
});
