import test from "node:test";
import assert from "node:assert/strict";
import {
  applyImageCheckupReviews,
  imageHealthFlags,
  imageReviewAction,
} from "../lib/image_health.mjs";

const good = { bytes: 24000, width: 960, height: 720, format: "heif", extension: "avif" };
test("valid image metadata does not invent defects or semantic approval", () => {
  assert.deepEqual(imageHealthFlags(good), []);
  assert.equal(
    imageReviewAction({ url: "/picture.avif", semantic: "not reviewed" }),
    "inspect-image-and-context"
  );
});
test("empty and unreadable files are distinct from low-resolution review flags", () => {
  assert.deepEqual(imageHealthFlags({ bytes: 0 }), ["empty-local-copy"]);
  assert.deepEqual(imageHealthFlags({ error: "invalid container" }), ["unreadable-local-copy"]);
  assert.deepEqual(imageHealthFlags({ ...good, width: 120, height: 100 }), [
    "check-display-resolution",
  ]);
});
test("detects disguised SVG containers and oversized transfers without replacing media", () => {
  assert.deepEqual(imageHealthFlags({ ...good, format: "svg", bytes: 300000 }), [
    "container-extension-mismatch",
    "check-transfer-size",
  ]);
});
test("replacement, purpose, content holds and reuse remain different decisions", () => {
  assert.equal(
    imageReviewAction({ semantic: "confirmed mismatch", url: "/one.avif" }),
    "replace-association"
  );
  assert.equal(imageReviewAction({ purpose: "text-only" }), "no-image-needed");
  assert.equal(imageReviewAction({ hold: "review wording" }), "review-content-first");
  assert.equal(
    imageReviewAction({ semantic: "reviewed reuse", url: "/one.avif" }),
    "keep-reviewed-assignment"
  );
  assert.equal(imageReviewAction({ candidateCount: 2 }), "inspect-existing-candidates");
  assert.equal(imageReviewAction({ candidateCount: 0 }), "decide-purpose-and-search");
});

test("sampled visual triage rejects changed content, changed URLs and duplicate decisions", () => {
  const row = { id: "one", revision: "content-digest", url: "https://example.test/one.webp" };
  const review = {
    demandId: row.id,
    contentSha256: row.revision,
    url: row.url,
    disposition: "replace-action-image",
    rationale: "The depicted object does not show the assessed action.",
    servedSha256: "bytes-digest",
  };
  const ledger = { reviewedAt: "2026-10-29T21:00:00Z", proposals: [review] };
  assert.equal(applyImageCheckupReviews([{ ...row }], ledger)[0].action, "replace-action-image");
  assert.throws(() => applyImageCheckupReviews([{ ...row, revision: "changed" }], ledger), /Stale/);
  assert.throws(
    () => applyImageCheckupReviews([{ ...row, url: "https://example.test/other.webp" }], ledger),
    /Stale/
  );
  assert.throws(
    () => applyImageCheckupReviews([{ ...row }], { ...ledger, proposals: [review, review] }),
    /Duplicate/
  );
  const dated = applyImageCheckupReviews([{ ...row }], {
    ...ledger,
    proposals: [{ ...review, reviewedAt: "2026-10-30T03:00:00Z" }],
  });
  assert.match(dated[0].byteEvidence, /2026-10-30T03:00:00Z/);
});
