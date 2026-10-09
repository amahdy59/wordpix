import type { BusinessUnit } from "./businessTypes";

/** Keep source indices intact: recorded audio timing uses the original transcript. */
export function getBusinessInputPresentation(input: BusinessUnit["mainInput"]) {
  const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
  const narratorPassages: string[] = [];
  const visibleLineIndices = new Set<number>();
  input.dialogue.forEach((line, index) => {
    const text = normalize(line.text);
    if (line.speaker.trim().toLowerCase() === "narrator") {
      if (narratorPassages.some((previous) => previous === text || previous.includes(text))) {
        return;
      }
      narratorPassages.push(text);
    }
    visibleLineIndices.add(index);
  });
  return {
    visibleLineIndices,
    showContext:
      Boolean(input.context.trim()) && !narratorPassages.includes(normalize(input.context)),
    title: input.title.replace(/^#+\s*/, "").replace(/^\d+\.\s*Main Input\s*[:—–-]?\s*/i, ""),
  };
}
