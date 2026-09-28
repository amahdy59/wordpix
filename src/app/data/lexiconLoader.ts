import * as core from "./lexiconCore";
import type { LexiconEntry } from "./lexiconCore";
import { createContentRequestCache } from "./contentRequestCache";

const loaders = import.meta.glob<{ entries: Record<string, LexiconEntry> }>(
  "./contentChunks/lexicon-*.ts"
);
const requestShard = createContentRequestCache<number, Record<string, LexiconEntry>>();

/** Hyphen/underscore aliases must always land in the same shard. */
export function lexiconShardFor(id: string): number {
  let hash = 0;
  for (const char of id.trim().toLowerCase().replace(/[-_]/g, "")) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash % 64;
}

async function loadShard(index: number): Promise<Record<string, LexiconEntry>> {
  return requestShard(
    index,
    async () => (await loaders[`./contentChunks/lexicon-${index}.ts`]()).entries
  );
}

/** A screen receives a snapshot scoped to its requested words, never the full catalogue. */
export async function loadLexicon(wordIds: readonly string[]) {
  const shards = await Promise.all([...new Set(wordIds.map(lexiconShardFor))].map(loadShard));
  const dictionary: Record<string, LexiconEntry> = Object.assign({}, ...shards);
  return {
    getLexiconEntry: (wordId: string, label?: string, unitId?: string) =>
      core.getLexiconEntry(dictionary, wordId, label, unitId),
    getReviewedCollocations: core.getReviewedCollocations,
    hasReviewedLexiconExamples: core.hasReviewedLexiconExamples,
    hasArabicGloss: core.hasArabicGloss,
  };
}

export type LoadedLexicon = Awaited<ReturnType<typeof loadLexicon>>;
