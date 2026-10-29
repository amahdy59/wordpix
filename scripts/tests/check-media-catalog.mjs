import test from "node:test";
import assert from "node:assert/strict";
import {
  assetId,
  csvText,
  finalizeAssets,
  objectKey,
  parseCsv,
  reconcileBindings,
  validateReviews,
  sceneVisualSupport,
} from "../lib/media_catalog.mjs";

const empty = { schemaVersion: 1, assets: [], bindings: [] };
test("scene audit accounts for runtime fallbacks and preserves direct-media precedence", () => {
  const words = [{ id: "first-aid-kit", label: "First Aid Kit", img: "kit.avif" }];
  const fallback = sceneVisualSupport({ check: { expectedAnswer: "first aid kit" } }, words);
  assert.equal(fallback.imagePath, "kit.avif");
  assert.equal(fallback.referenceOnly, true);
  const direct = sceneVisualSupport(
    { imagePath: "scene.webp", check: { expectedAnswer: "first aid kit" } },
    words
  );
  assert.equal(direct.imagePath, "scene.webp");
  assert.equal(direct.referenceOnly, false);
  const none = sceneVisualSupport({ check: { expectedAnswer: "unrelated" } }, words);
  assert.equal(none.imagePath, undefined);
  assert.equal(none.imageSupport, "none");
});
test("CSV preserves multilingual multiline context, commas and escaped quotes", () => {
  const input = '\uFEFFsentence,key\r\n"قال: ""مرحبا"",\nhello",image.webp\r\n';
  assert.deepEqual(parseCsv(input), [{ sentence: 'قال: "مرحبا",\nhello', key: "image.webp" }]);
  assert.throws(() => parseCsv('a,b\n"unfinished'), /Unterminated/);
  assert.throws(() => parseCsv("a,b\n1,2,3"), /field count/);
});
test("spreadsheet exports neutralize formulas", () => {
  const rows = parseCsv(csvText([{ name: '=HYPERLINK("bad")' }, { name: "\t@evil" }], ["name"]));
  assert.equal(rows[0].name, '\'=HYPERLINK("bad")');
  assert.equal(rows[1].name, "'\t@evil");
});
test("object identity preserves key case and rejects foreign/signed URLs and traversal", () => {
  assert.equal(objectKey("public/question-images/v2/A/B.webp"), "question-images/v2/A/B.webp");
  assert.equal(objectKey("https://example.com/image.webp"), null);
  assert.equal(objectKey("../image.webp"), null);
  assert.equal(
    objectKey("https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/a.webp?token=secret"),
    null
  );
});
test("catalog names do not change immutable IDs or physical keys", () => {
  const key = "question-images/v2/library-images/" + "a".repeat(40) + ".webp";
  const base = finalizeAssets([{ key }], empty)[0];
  const reviewed = finalizeAssets([{ key }], {
    ...empty,
    assets: [{ key, displayName: "A gourd" }],
  })[0];
  assert.equal(base.assetId, reviewed.assetId);
  assert.equal(reviewed.assetId, assetId(key));
  assert.equal(reviewed.key, key);
  assert.equal(reviewed.displayName, "A gourd");
});
test("duplicate evidence requires equal local bytes, not similar filenames or source hashes", () => {
  const rows = finalizeAssets(
    [
      { key: "a/x.webp", localSha256: "1".repeat(64) },
      { key: "b/y.webp", localSha256: "1".repeat(64) },
      { key: "c/x.webp", localSha256: "2".repeat(64) },
      { key: "d/x.webp" },
    ],
    empty
  );
  assert.equal(rows[0].duplicateGroup, rows[1].duplicateGroup);
  assert.equal(rows[2].duplicateGroup, null);
  assert.equal(rows[3].duplicateGroup, null);
  assert.match(rows[0].duplicateEvidence, /remote equality unverified/);
});
test("first-match binding precedence is preserved without mutation", () => {
  const registry = {
    a: { wordId: "one", sentence: "One bag.", imagePath: "a.webp" },
    b: { wordId: "one", sentence: "One bag.", imagePath: "b.webp" },
    c: { wordId: "one", sentence: "one bag.", imagePath: "c.webp" },
  };
  const original = structuredClone(registry);
  const bindings = reconcileBindings(registry, empty);
  assert.equal(bindings[1].shadowedBy, "a");
  assert.equal(bindings[2].shadowedBy, null);
  assert.deepEqual(registry, original);
});
test("stale binding reviews fail instead of blessing a changed image", () => {
  const registry = { a: { wordId: "one", sentence: "One.", imagePath: "new.webp" } };
  assert.throws(
    () =>
      reconcileBindings(registry, {
        ...empty,
        bindings: [{ entryId: "a", expectedImagePath: "old.webp", status: "verified" }],
      }),
    /Stale/
  );
});
test("reviews require provenance and reject duplicate identities", () => {
  assert.throws(
    () => validateReviews({ ...empty, assets: [{ key: "a.webp", displayName: "A" }] }),
    /requires/
  );
  const r = {
    key: "a.webp",
    displayName: "A",
    reviewer: "Reviewer",
    reviewedAt: "2026-10-29",
    evidence: "Visual check",
  };
  assert.throws(() => validateReviews({ ...empty, assets: [r, r] }), /duplicate/);
});
test("a binding review expires when sentence content changes even if its image does not", () => {
  const registry = { a: { wordId: "one", sentence: "Two bags.", imagePath: "bags.webp" } };
  const review = {
    entryId: "a",
    expectedImagePath: "bags.webp",
    expectedSentence: "One bag.",
    status: "verified",
  };
  assert.throws(() => reconcileBindings(registry, { ...empty, bindings: [review] }), /Stale/);
});
