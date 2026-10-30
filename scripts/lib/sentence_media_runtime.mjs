import { createHash } from "node:crypto";
import { z } from "zod";
const media = z.object({ imagePath: z.string().min(1), imageAlt: z.string().min(1) });
const entrySchema = media.extend({
  wordId: z.string().min(1),
  sentence: z.string().min(1),
  imageFallbacks: z.array(media).optional(),
});
const hash = (value) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export function compileSentenceMedia(registry, rejections) {
  const strings = [],
    indexes = new Map(),
    rows = [],
    seen = new Set();
  const rejected = new Set();
  for (const row of rejections) {
    const entry = registry[row.entryId];
    if (
      !entry ||
      entry.wordId !== row.wordId ||
      entry.sentence !== row.sentence ||
      entry.imagePath !== row.imagePath
    )
      throw Error(`Stale sentence-media rejection: ${row.entryId}`);
    const id = JSON.stringify([row.wordId, row.sentence, row.imagePath]);
    if (rejected.has(id)) throw Error(`Duplicate sentence-media rejection: ${row.entryId}`);
    rejected.add(id);
  }
  const index = (value) => {
    if (!indexes.has(value)) {
      indexes.set(value, strings.length);
      strings.push(value);
    }
    return indexes.get(value);
  };
  for (const raw of Object.values(registry)) {
    const entry = entrySchema.parse(raw);
    if (rejected.has(JSON.stringify([entry.wordId, entry.sentence, entry.imagePath]))) continue;
    const identity = `${entry.wordId}\0${entry.sentence}`;
    if (seen.has(identity)) continue;
    seen.add(identity);
    rows.push(
      [
        entry.wordId,
        entry.sentence,
        entry.imagePath,
        entry.imageAlt,
        ...(entry.imageFallbacks ?? []).flatMap((fallback) => [
          fallback.imagePath,
          fallback.imageAlt,
        ]),
      ].map(index)
    );
  }
  return {
    schemaVersion: 1,
    sourceSha256: hash(registry),
    rejectionsSha256: hash(rejections),
    strings,
    rows,
  };
}

/** Keep the original first-match pairs; only change their delivery boundary. */
export function scopeSentenceMedia(runtime, wordIds) {
  const allowed = new Set(wordIds);
  const strings = [];
  const indexes = new Map();
  const rows = runtime.rows
    .filter((row) => allowed.has(runtime.strings[row[0]]))
    .map((row) =>
      row.map((original) => {
        const value = runtime.strings[original];
        if (!indexes.has(value)) {
          indexes.set(value, strings.length);
          strings.push(value);
        }
        return indexes.get(value);
      })
    );
  return { schemaVersion: 1, strings, rows };
}
