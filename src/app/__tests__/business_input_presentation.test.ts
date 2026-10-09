import { describe, expect, it } from "vitest";
import { getBusinessInputPresentation } from "../learning/business/businessInputPresentation";

describe("Business reading presentation", () => {
  it("shows duplicated narration once while preserving original audio indices", () => {
    const result = getBusinessInputPresentation({
      title: "## 2. Main Input: A decision",
      context: "The team reviews the plan. Everyone agrees.",
      dialogue: [
        { speaker: "Narrator", text: "The team reviews the plan. Everyone agrees." },
        { speaker: "Narrator", text: "Everyone agrees." },
        { speaker: "Narrator", text: "The team reviews the plan. Everyone agrees." },
        { speaker: "Manager", text: "Everyone agrees." },
        { speaker: "Colleague", text: "Everyone agrees." },
      ],
    });
    expect([...result.visibleLineIndices]).toEqual([0, 3, 4]);
    expect(result.showContext).toBe(false);
    expect(result.title).toBe("A decision");
  });

  it("keeps distinct context, narration and repeated participant replies", () => {
    const result = getBusinessInputPresentation({
      title: "A meeting",
      context: "At the office.",
      dialogue: [
        { speaker: "Narrator", text: "The team meets." },
        { speaker: "Narrator", text: "The team meets again." },
        { speaker: "Manager", text: "Yes." },
        { speaker: "Manager", text: "Yes." },
      ],
    });
    expect([...result.visibleLineIndices]).toEqual([0, 1, 2, 3]);
    expect(result.showContext).toBe(true);
  });
});
