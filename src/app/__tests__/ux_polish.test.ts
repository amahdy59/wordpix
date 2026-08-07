import { describe, expect, it } from "vitest";
import { playCorrectSound, playIncorrectSound, playLevelUpSound, playClickSound } from "../shared/useSound";

describe("UX & Learning Polish Suite", () => {
  it("useSound methods run safely without throwing errors", () => {
    expect(() => {
      playCorrectSound();
      playIncorrectSound();
      playLevelUpSound();
      playClickSound();
    }).not.toThrow();
  });
});
