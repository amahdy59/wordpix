import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
const require = createRequire(import.meta.url);
const { normaliseAudioText } = require("../../../scripts/lib/audioText.cjs") as {
  normaliseAudioText: (text: string) => string;
};
describe("audio corpus text", () => {
  it("turns authored cloze blanks into speakable prompts", () => {
    expect(normaliseAudioText("Use a ______ to dry off.")).toBe("Use a blank to dry off.");
  });
  it("normalizes escaped whitespace without damaging punctuation", () => {
    expect(normaliseAudioText('  The toilet — just in case.\\nSay "okay".  ')).toBe(
      'The toilet — just in case. Say "okay".'
    );
  });
});
