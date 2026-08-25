import { describe, expect, it } from "vitest";
import { buildFeedbackSpeech } from "../exercises/feedbackSpeech";

describe("buildFeedbackSpeech", () => {
  it("names the word on a correct answer", () => {
    const line = buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant: 0 });
    expect(line).toBe("Correct! This is a faucet.");
  });

  it("names both words on a wrong answer, ending on the right one", () => {
    const line = buildFeedbackSpeech({
      correct: false,
      targetLabel: "Faucet",
      chosenLabel: "Mirror",
      variant: 0,
    });
    expect(line).toBe("Not quite. That's a mirror. This is a faucet.");
    // Ending on the target is the point: it is the word worth remembering.
    expect(line.trimEnd().endsWith("faucet.")).toBe(true);
  });

  it("picks the article from the sound of the word", () => {
    expect(buildFeedbackSpeech({ correct: true, targetLabel: "Umbrella", variant: 0 })).toBe(
      "Correct! This is an umbrella."
    );
    expect(buildFeedbackSpeech({ correct: true, targetLabel: "Towel", variant: 0 })).toBe(
      "Correct! This is a towel."
    );
  });

  it("lowercases multi-word labels", () => {
    expect(buildFeedbackSpeech({ correct: true, targetLabel: "Bath Towel", variant: 0 })).toBe(
      "Correct! This is a bath towel."
    );
  });

  it("rotates the opener so repetition does not grate", () => {
    const openers = new Set(
      Array.from({ length: 5 }, (_, i) =>
        buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant: i })
      )
    );
    expect(openers.size).toBeGreaterThan(1);
  });

  it("still names the target when nothing was chosen", () => {
    const line = buildFeedbackSpeech({
      correct: false,
      targetLabel: "Faucet",
      chosenLabel: null,
      variant: 0,
    });
    expect(line).toBe("Not quite. This is a faucet.");
  });

  it("does not contrast a word with itself", () => {
    // Defensive: if the choice and the answer carry the same label, "That's a
    // faucet. This is a faucet." would be nonsense.
    const line = buildFeedbackSpeech({
      correct: false,
      targetLabel: "Faucet",
      chosenLabel: "faucet",
      variant: 0,
    });
    expect(line).toBe("Not quite. This is a faucet.");
  });

  it("survives any counter a caller passes", () => {
    for (const variant of [0, 7, 1000, -3, 2.7]) {
      const line = buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant });
      expect(line).toMatch(/This is a faucet\.$/);
      expect(line).not.toMatch(/undefined/);
    }
  });
});
