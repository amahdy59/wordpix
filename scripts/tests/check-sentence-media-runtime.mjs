import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { compileSentenceMedia, scopeSentenceMedia } from "../lib/sentence_media_runtime.mjs";
const entry = {
  wordId: "one",
  sentence: "One tool rests on the table.",
  imagePath: "unchanged.webp",
  imageAlt: "One tool on a table.",
};
test("compact table preserves strings, fallbacks and original first-match precedence", () => {
  const data = compileSentenceMedia(
    {
      first: {
        ...entry,
        imageFallbacks: [{ imagePath: "fallback.svg", imageAlt: "A drawn tool." }],
      },
      duplicate: { ...entry, imagePath: "shadowed.webp" },
    },
    []
  );
  assert.deepEqual(
    data.rows.map((row) => row.map((index) => data.strings[index])),
    [
      [
        entry.wordId,
        entry.sentence,
        entry.imagePath,
        entry.imageAlt,
        "fallback.svg",
        "A drawn tool.",
      ],
    ]
  );
});
test("rejection is exact and cannot silently follow changed content or URLs", () => {
  const rejection = { entryId: "first", ...entry };
  assert.equal(compileSentenceMedia({ first: entry }, [rejection]).rows.length, 0);
  assert.throws(
    () => compileSentenceMedia({ first: { ...entry, imagePath: "changed.webp" } }, [rejection]),
    /Stale/
  );
  assert.throws(() => compileSentenceMedia({ first: entry }, [rejection, rejection]), /Duplicate/);
});
test("every production runtime pair equals the reviewed source after exact exclusions", () => {
  const read = (path) => JSON.parse(fs.readFileSync(path));
  const source = read("src/app/generated/reviewedExactSentenceMedia.json"),
    rejections = read("src/app/generated/rejectedSentenceMedia.json"),
    runtime = read("src/app/generated/sentenceMediaRuntime.json");
  assert.deepEqual(runtime, compileSentenceMedia(source, rejections));
  assert.equal(Object.keys(source).length, 23590);
});

test("unit tables preserve every applicable exact pair, description and fallback", () => {
  const read = (path) => JSON.parse(fs.readFileSync(path, "utf8"));
  const runtime = read("src/app/generated/sentenceMediaRuntime.json");
  const decode = (table) => table.rows.map((row) => row.map((index) => table.strings[index]));
  for (const name of fs.readdirSync("src/app/generated/sentenceMediaUnits")) {
    const table = read(`src/app/generated/sentenceMediaUnits/${name}`);
    const wordIds = new Set(table.rows.map((row) => table.strings[row[0]]));
    assert.deepEqual(
      decode(table),
      decode(runtime).filter((row) => wordIds.has(row[0])),
      name
    );
    assert.ok(Buffer.byteLength(JSON.stringify(table)) <= 320 * 1024, name);
  }
});

test("scoping cannot leak unrelated words or change duplicate precedence", () => {
  const runtime = compileSentenceMedia(
    {
      first: entry,
      duplicate: { ...entry, imagePath: "shadowed.webp" },
      unrelated: { ...entry, wordId: "two" },
    },
    []
  );
  const scoped = scopeSentenceMedia(runtime, ["one"]);
  assert.deepEqual(
    scoped.rows.map((row) => row.map((i) => scoped.strings[i])),
    [[entry.wordId, entry.sentence, entry.imagePath, entry.imageAlt]]
  );
  assert.deepEqual(scopeSentenceMedia(runtime, ["unknown"]), {
    schemaVersion: 1,
    strings: [],
    rows: [],
  });
});
