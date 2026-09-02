import { describe, it, expect } from "vitest";
import {
  sessionReducer,
  initialSessionState,
  buildValidatedOptions,
  buildPracticeItems,
  ROUND_SIZE,
} from "../learning/study/practice";
import type { SessionState } from "../learning/study/practice";
import type { UnitLearningMaterials } from "../learning/types";
import type { VocabularyItem } from "../data/lessons";

describe("practice session state machine (sessionReducer)", () => {
  it("initializes with clean idle state", () => {
    expect(initialSessionState.phase).toBe("idle");
    expect(initialSessionState.currentIndex).toBe(0);
    expect(initialSessionState.pickedIndex).toBeNull();
    expect(initialSessionState.firstTryCorrectCount).toBe(0);
  });

  it("handles ANSWER_CORRECT and tracks round statistics", () => {
    const s1 = sessionReducer(initialSessionState, { type: "ANSWER_CORRECT", round: 1 });
    expect(s1.phase).toBe("answered_correct");
    expect(s1.firstTryCorrectCount).toBe(1);
    expect(s1.roundCorrectCounts[1]).toBe(1);

    const s2 = sessionReducer(s1, { type: "ANSWER_CORRECT", round: 1 });
    expect(s2.firstTryCorrectCount).toBe(2);
    expect(s2.roundCorrectCounts[1]).toBe(2);
  });

  it("handles ANSWER_WRONG and tracks pickedIndex", () => {
    const s1 = sessionReducer(initialSessionState, { type: "ANSWER_WRONG", pickedIndex: 2 });
    expect(s1.phase).toBe("answered_wrong");
    expect(s1.pickedIndex).toBe(2);
    expect(s1.firstTryCorrectCount).toBe(0);
  });

  it("handles GAVE_UP cleanly", () => {
    const s1 = sessionReducer(initialSessionState, { type: "GAVE_UP" });
    expect(s1.phase).toBe("gave_up");
    expect(s1.pickedIndex).toBeNull();
  });

  it("allows RETRY only from answered_wrong or gave_up states", () => {
    // Disallowed from idle
    const s1 = sessionReducer(initialSessionState, { type: "RETRY" });
    expect(s1.phase).toBe("idle");

    // Allowed from answered_wrong
    const wrongState: SessionState = {
      ...initialSessionState,
      phase: "answered_wrong",
      pickedIndex: 1,
    };
    const s2 = sessionReducer(wrongState, { type: "RETRY" });
    expect(s2.phase).toBe("retrying");
    expect(s2.pickedIndex).toBeNull();

    // Allowed from gave_up
    const gaveUpState: SessionState = { ...initialSessionState, phase: "gave_up" };
    const s3 = sessionReducer(gaveUpState, { type: "RETRY" });
    expect(s3.phase).toBe("retrying");
  });

  it("advances normally on NEXT within a round", () => {
    const s1 = sessionReducer(initialSessionState, {
      type: "NEXT",
      totalItems: 16,
      roundSize: ROUND_SIZE,
    });
    expect(s1.phase).toBe("idle");
    expect(s1.currentIndex).toBe(1);
  });

  it("triggers checkpoint on NEXT at round boundary", () => {
    const atEndOfRound: SessionState = { ...initialSessionState, currentIndex: ROUND_SIZE - 1 };
    const s1 = sessionReducer(atEndOfRound, {
      type: "NEXT",
      totalItems: 16,
      roundSize: ROUND_SIZE,
    });
    expect(s1.phase).toBe("checkpoint");
  });

  it("triggers completed on NEXT when all items are finished", () => {
    const atLastItem: SessionState = { ...initialSessionState, currentIndex: 15 };
    const s1 = sessionReducer(atLastItem, {
      type: "NEXT",
      totalItems: 16,
      roundSize: ROUND_SIZE,
    });
    expect(s1.phase).toBe("completed");
  });

  it("handles CONTINUE_ROUND to enter next round", () => {
    const checkpointState: SessionState = {
      ...initialSessionState,
      phase: "checkpoint",
      currentIndex: 7,
    };
    const s1 = sessionReducer(checkpointState, { type: "CONTINUE_ROUND" });
    expect(s1.phase).toBe("idle");
    expect(s1.currentIndex).toBe(8);
  });

  it("deduplicates reviewAddedWords", () => {
    const s1 = sessionReducer(initialSessionState, { type: "ADD_REVIEW_WORD", word: "towel" });
    expect(s1.reviewAddedWords).toEqual(["towel"]);

    const s2 = sessionReducer(s1, { type: "ADD_REVIEW_WORD", word: "towel" });
    expect(s2.reviewAddedWords).toEqual(["towel"]);

    const s3 = sessionReducer(s2, { type: "ADD_REVIEW_WORD", word: "soap" });
    expect(s3.reviewAddedWords).toEqual(["towel", "soap"]);
  });

  it("resets state and increments attemptCount on RESTART", () => {
    const dirtyState: SessionState = {
      phase: "completed",
      currentIndex: 15,
      pickedIndex: 1,
      firstTryCorrectCount: 12,
      roundCorrectCounts: { 1: 7, 2: 5 },
      reviewAddedWords: ["mirror"],
      attemptCount: 0,
    };
    const s1 = sessionReducer(dirtyState, { type: "RESTART" });
    expect(s1.phase).toBe("idle");
    expect(s1.currentIndex).toBe(0);
    expect(s1.firstTryCorrectCount).toBe(0);
    expect(s1.roundCorrectCounts).toEqual({});
    expect(s1.reviewAddedWords).toEqual([]);
    expect(s1.attemptCount).toBe(1);
  });
});

describe("distractor validation & practice builder", () => {
  it("rejects candidate set with fewer than 2 distinct distractors", () => {
    const res1 = buildValidatedOptions("apple", ["apple"], 42);
    expect(res1).toBeNull();

    const res2 = buildValidatedOptions("apple", ["banana"], 42);
    expect(res2).toBeNull();
  });

  it("builds valid 3-distractor 4-option set when sufficient distractors exist", () => {
    const res = buildValidatedOptions("apple", ["banana", "cherry", "date", "elderberry"], 42);
    expect(res).not.toBeNull();
    expect(res!.options).toHaveLength(4);
    expect(res!.options).toContain("apple");
    expect(res!.options[res!.correctIndex]).toBe("apple");
  });

  it("generates practice items across exercise types", () => {
    const mockMaterials: UnitLearningMaterials = {
      unitId: "test-unit",
      blankExercises: [{ id: "b1", sentence: "The towel is in the bathroom.", answer: "towel" }],
      additionalExercises: {
        multipleChoice: [
          {
            id: "mc1",
            question: "Where do you wash?",
            options: ["sink", "door", "window"],
            correctIndex: 0,
            explanation: "Sink is where you wash.",
          },
        ],
      },
    };

    const mockVocab: VocabularyItem[] = [
      {
        id: "1",
        label: "towel",
        topic: "bathroom",
        phonetic: "/ˈtaʊ.əl/",
        img: "/img/towel.webp",
        description: "A piece of cloth used for drying",
      },
      {
        id: "2",
        label: "soap",
        topic: "bathroom",
        phonetic: "/soʊp/",
        img: "/img/soap.webp",
        description: "A cleansing agent",
      },
      {
        id: "3",
        label: "mirror",
        topic: "bathroom",
        phonetic: "/ˈmɪr.ər/",
        img: "/img/mirror.webp",
        description: "A reflective glass",
      },
      {
        id: "4",
        label: "brush",
        topic: "bathroom",
        phonetic: "/brʌʃ/",
        img: "/img/brush.webp",
        description: "An instrument with bristles",
      },
    ];

    const items = buildPracticeItems(mockMaterials, mockVocab, 0);
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.some((i) => i.type === "blank")).toBe(true);
    expect(items.some((i) => i.type === "multipleChoice")).toBe(true);
  });
});
