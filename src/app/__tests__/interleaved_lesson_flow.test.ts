import { describe, expect, it } from "vitest";
import {
  partitionWordsIntoChunks,
  buildInterleavedLessonPlan,
  CANONICAL_STAGE_COUNT,
  MAX_LESSON_STAGE_COUNT,
} from "../lesson/lessonSequence";

describe("Interleaved Lesson Flow & Micro-Cycle Partitioning", () => {
  describe("partitionWordsIntoChunks", () => {
    it("keeps small word sets (<= 5) in a single chunk", () => {
      const three = ["a", "b", "c"];
      expect(partitionWordsIntoChunks(three)).toEqual([["a", "b", "c"]]);

      const five = ["a", "b", "c", "d", "e"];
      expect(partitionWordsIntoChunks(five)).toEqual([["a", "b", "c", "d", "e"]]);
    });

    it("partitions 8 words into two balanced chunks of 4", () => {
      const eight = ["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8"];
      const chunks = partitionWordsIntoChunks(eight);
      expect(chunks).toEqual([
        ["w1", "w2", "w3", "w4"],
        ["w5", "w6", "w7", "w8"],
      ]);
    });

    it("partitions 10 words into two balanced chunks of 5", () => {
      const ten = Array.from({ length: 10 }, (_, i) => `w${i + 1}`);
      const chunks = partitionWordsIntoChunks(ten);
      expect(chunks).toHaveLength(2);
      expect(chunks[0]).toHaveLength(5);
      expect(chunks[1]).toHaveLength(5);
      expect(chunks.flat()).toEqual(ten);
    });

    it("partitions 12 words into three balanced chunks of 4", () => {
      const twelve = Array.from({ length: 12 }, (_, i) => `w${i + 1}`);
      const chunks = partitionWordsIntoChunks(twelve);
      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toHaveLength(4);
      expect(chunks[1]).toHaveLength(4);
      expect(chunks[2]).toHaveLength(4);
      expect(chunks.flat()).toEqual(twelve);
    });

    it("partitions 14 words into balanced chunks of 5, 5, and 4", () => {
      const fourteen = Array.from({ length: 14 }, (_, i) => `w${i + 1}`);
      const chunks = partitionWordsIntoChunks(fourteen);
      expect(chunks).toHaveLength(3);
      expect(chunks[0]).toHaveLength(5);
      expect(chunks[1]).toHaveLength(5);
      expect(chunks[2]).toHaveLength(4);
      expect(chunks.flat()).toEqual(fourteen);
    });

    it("partitions 16 words into four balanced chunks of 4", () => {
      const sixteen = Array.from({ length: 16 }, (_, i) => `w${i + 1}`);
      const chunks = partitionWordsIntoChunks(sixteen);
      expect(chunks).toHaveLength(4);
      chunks.forEach((chunk) => expect(chunk).toHaveLength(4));
      expect(chunks.flat()).toEqual(sixteen);
    });
  });

  describe("buildInterleavedLessonPlan", () => {
    it("returns standard 6 stages for small lessons (<= 5 words)", () => {
      const words = ["bed", "lamp", "desk"];
      const plan = buildInterleavedLessonPlan(words, "A1", true);

      expect(plan).toHaveLength(6);
      expect(plan.map((s) => s.exercise)).toEqual([
        "listen",
        "recall",
        "fill",
        "builder",
        "quiz",
        "story",
      ]);
      plan.forEach((step, idx) => {
        expect(step.stepIndex).toBe(idx);
        expect(step.wordIds).toEqual(words);
        expect(step.totalChunks).toBe(1);
      });
    });

    it("interleaves presentation, retrieval, and context for 10-word lessons", () => {
      const words = Array.from({ length: 10 }, (_, i) => `word_${i + 1}`);
      const plan = buildInterleavedLessonPlan(words, "A2", true);

      // 2 chunks of 5 words
      // Chunk 1: listen, recall, fill (words 1-5)
      // Chunk 2: listen, recall, fill (words 6-10)
      // Synthesis: builder, quiz, story (all 10 words)
      // Total: 2 * 3 + 3 = 9 steps
      expect(plan).toHaveLength(9);

      // Verify Chunk 1
      expect(plan[0].exercise).toBe("listen");
      expect(plan[0].wordIds).toEqual(words.slice(0, 5));
      expect(plan[0].chunkIndex).toBe(0);
      expect(plan[0].chunkRange).toEqual({ start: 1, end: 5, total: 10 });
      expect(plan[0].isSynthesis).toBe(false);

      expect(plan[1].exercise).toBe("recall");
      expect(plan[1].wordIds).toEqual(words.slice(0, 5));

      expect(plan[2].exercise).toBe("fill");
      expect(plan[2].wordIds).toEqual(words.slice(0, 5));

      // Verify Chunk 2
      expect(plan[3].exercise).toBe("listen");
      expect(plan[3].wordIds).toEqual(words.slice(5, 10));
      expect(plan[3].chunkIndex).toBe(1);
      expect(plan[3].chunkRange).toEqual({ start: 6, end: 10, total: 10 });

      expect(plan[4].exercise).toBe("recall");
      expect(plan[4].wordIds).toEqual(words.slice(5, 10));

      expect(plan[5].exercise).toBe("fill");
      expect(plan[5].wordIds).toEqual(words.slice(5, 10));

      // Verify Synthesis Phase
      expect(plan[6].exercise).toBe("builder");
      expect(plan[6].isSynthesis).toBe(true);
      expect(plan[6].wordIds).toEqual(words);

      expect(plan[7].exercise).toBe("quiz");
      expect(plan[7].isSynthesis).toBe(true);

      expect(plan[8].exercise).toBe("story");
      expect(plan[8].isSynthesis).toBe(true);
      expect(plan[8].wordIds).toEqual(words);
    });

    it("verifies zero questions are dropped across all words", () => {
      const words = Array.from({ length: 12 }, (_, i) => `item_${i + 1}`);
      const plan = buildInterleavedLessonPlan(words, "B1", true);

      // 3 chunks of 4 words
      // 3 chunks * 3 drills + 3 synthesis = 12 steps
      expect(plan).toHaveLength(12);

      const listenWords = plan.filter((s) => s.exercise === "listen").flatMap((s) => s.wordIds);
      expect(listenWords).toEqual(words);

      const recallWords = plan.filter((s) => s.exercise === "recall").flatMap((s) => s.wordIds);
      expect(recallWords).toEqual(words);

      const fillWords = plan.filter((s) => s.exercise === "fill").flatMap((s) => s.wordIds);
      expect(fillWords).toEqual(words);
    });

    it("respects accessibility includeListening=false in micro-cycles", () => {
      const words = Array.from({ length: 8 }, (_, i) => `item_${i + 1}`);
      const plan = buildInterleavedLessonPlan(words, "A1", false);

      // 2 chunks of 4 words
      // Without listening: each chunk runs [recall, fill] = 2 drills
      // 2 chunks * 2 drills + 3 synthesis = 7 steps
      expect(plan).toHaveLength(7);
      expect(plan.some((s) => s.exercise === "listen")).toBe(false);

      expect(plan[0].exercise).toBe("recall");
      expect(plan[0].wordIds).toHaveLength(4);
      expect(plan[1].exercise).toBe("fill");
      expect(plan[1].wordIds).toHaveLength(4);

      expect(plan[2].exercise).toBe("recall");
      expect(plan[2].wordIds).toHaveLength(4);
      expect(plan[3].exercise).toBe("fill");
      expect(plan[3].wordIds).toHaveLength(4);
    });

    it("maintains step bounds within MAX_LESSON_STAGE_COUNT", () => {
      expect(CANONICAL_STAGE_COUNT).toBe(6);
      expect(MAX_LESSON_STAGE_COUNT).toBeGreaterThanOrEqual(24);
    });
  });
});
