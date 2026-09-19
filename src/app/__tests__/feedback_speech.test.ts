import { describe, expect, it } from "vitest";
import { buildFeedbackSequence, buildFeedbackSpeech } from "../exercises/feedbackSpeech";

describe("brief spoken feedback", () => {
  it("keeps correct feedback short and encouraging", () => {
    expect(buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant: 0 })).toBe(
      "Excellent!"
    );
  });

  it("keeps corrective feedback short without naming either option", () => {
    const line = buildFeedbackSpeech({
      correct: false,
      targetLabel: "Faucet",
      chosenLabel: "Mirror",
      variant: 0,
    });

    expect(line).toBe("Not quite.");
    expect(line).not.toMatch(/faucet|mirror|this is|that is/i);
  });

  it("rotates brief praise so repeated questions do not grate", () => {
    const lines = new Set(
      Array.from({ length: 5 }, (_, variant) =>
        buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant })
      )
    );
    expect(lines).toEqual(
      new Set(["Excellent!", "Great job!", "Well done!", "Nice work!", "Exactly!"])
    );
  });

  it("rotates kind correction phrases", () => {
    expect(
      Array.from({ length: 3 }, (_, variant) =>
        buildFeedbackSpeech({ correct: false, targetLabel: "Faucet", variant })
      )
    ).toEqual(["Not quite.", "Almost.", "Try again."]);
  });

  it("builds one audio segment so feedback remains gapless", () => {
    expect(
      buildFeedbackSequence({
        correct: false,
        targetLabel: "Pliers",
        chosenLabel: "Eggs",
        variant: 2,
      })
    ).toEqual(["Try again."]);
  });

  it("survives any counter a caller passes", () => {
    for (const variant of [0, 7, 1000, -3, 2.7]) {
      const line = buildFeedbackSpeech({ correct: true, targetLabel: "Faucet", variant });
      expect(line).not.toMatch(/undefined/);
      expect(line.length).toBeLessThan(20);
    }
  });
});
