import { describe, expect, it } from "vitest";
import { buildPracticePollResults } from "../learning/conversation/PracticePollSnapshot";

const options = [
  { id: "A", text: "Yes" },
  { id: "B", text: "Maybe" },
  { id: "C", text: "No" },
] as const;

describe("practice poll snapshot", () => {
  it("creates a stable, complete example distribution", () => {
    const first = buildPracticePollResults(7, options);
    const second = buildPracticePollResults(7, options);

    expect(first).toEqual(second);
    expect(first).toHaveLength(options.length);
    expect(first.reduce((sum, result) => sum + result.percentage, 0)).toBe(100);
    expect(first.every((result) => result.percentage > 0)).toBe(true);
  });

  it("handles an empty option set without inventing a result", () => {
    expect(buildPracticePollResults(1, [])).toEqual([]);
  });
});
