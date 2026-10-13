import { getFigmaPronunciationActivityData } from "./figmaPronunciationCatalog";

/** Keep IPA intact; normalize Arabic presentation differences only. */
export function normalizePronunciationSearch(text: string): string {
  return text
    .normalize("NFC")
    .toLocaleLowerCase("en-US")
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .trim();
}

const searchIndex = new Map<number, string>();
export function pronunciationMatches(lessonNumber: number, query: string): boolean {
  const normalized = normalizePronunciationSearch(query);
  if (!normalized) return true;
  let indexed = searchIndex.get(lessonNumber);
  if (!indexed) {
    const activity = getFigmaPronunciationActivityData(lessonNumber);
    indexed = normalizePronunciationSearch(
      [
        lessonNumber,
        activity.title,
        activity.objective,
        activity.focus,
        activity.model,
        ...activity.items.map((item) => item.label),
        ...activity.contrastPairs.flat(),
        ...activity.articulationCues,
        activity.arabicSpeakerTip?.titleAr ?? "",
        activity.arabicSpeakerTip?.tipAr ?? "",
        activity.arabicSpeakerTip?.tipEn ?? "",
      ].join(" ")
    );
    searchIndex.set(lessonNumber, indexed);
  }
  return normalized.split(/\s+/).every((term) => indexed.includes(term));
}
