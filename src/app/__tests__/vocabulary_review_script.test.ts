import { describe, expect, it } from "vitest";
import { loadAllUnitVocabulary } from "../data/vocabulary";

describe("vocabulary definition review script", () => {
  it("loads every runtime vocabulary card, including indirect definitions", async () => {
    const units = await loadAllUnitVocabulary();
    expect([...units.values()].reduce((sum, words) => sum + words.length, 0)).toBe(11_854);
  });
});
