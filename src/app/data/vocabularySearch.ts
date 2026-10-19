import { z } from "zod";
const schema = z.array(z.tuple([z.string(), z.string(), z.string(), z.string(), z.string()]));
export type SearchEntry = z.infer<typeof schema>[number];
const normalizedLabels = new WeakMap<SearchEntry, string[]>();
let cached: Promise<SearchEntry[]> | undefined;
const loaders = import.meta.glob("../generated/vocabularySearch-*.json", { import: "default" });
export function loadVocabularySearch() {
  cached ??= Promise.all(
    Object.keys(loaders)
      .sort()
      .map(async (key) => schema.parse(await loaders[key]()))
  )
    .then((parts) => parts.flat())
    .catch((error: unknown) => {
      cached = undefined;
      throw error;
    });
  return cached;
}
export function normalizeSearch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[-_]/g, " ")
    .trim();
}
export function searchVocabulary(entries: readonly SearchEntry[], query: string) {
  const term = normalizeSearch(query);
  if (!term) return [];
  return entries
    .map((entry, order) => {
      let labels = normalizedLabels.get(entry);
      if (!labels) {
        labels = [entry[1], entry[2], entry[3]].map(normalizeSearch);
        normalizedLabels.set(entry, labels);
      }
      const rank = labels.some((label) => label === term)
        ? 0
        : labels.some((label) => label.startsWith(term))
          ? 1
          : labels.some((label) => label.includes(term))
            ? 2
            : 3;
      return { entry, rank, order };
    })
    .filter(({ rank }) => rank < 3)
    .sort((a, b) => a.rank - b.rank || a.order - b.order)
    .map(({ entry }) => entry);
}
