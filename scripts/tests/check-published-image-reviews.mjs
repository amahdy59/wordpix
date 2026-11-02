import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  publishedImageReviews,
  loadPublishedImageReviews,
} from "../lib/published_image_reviews.mjs";
import { applyImageCheckupReviews, partitionImageCheckupReviews } from "../lib/image_health.mjs";

const read = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const evidence = () => ({
  batchBytes: fs.readFileSync("docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json"),
  approval: read("docs/media/APPROVED_SUPPLIED_IMAGES_2026-10-30.json"),
  publication: read("docs/media/PUBLISHED_SUPPLIED_IMAGE_RECEIPT_2026-10-30.json"),
  runtime: read("src/app/generated/suppliedMedia.json"),
});
test("only the unchanged approved batch with matching publication evidence can supersede a review", async () => {
  assert.equal((await loadPublishedImageReviews()).length, 34);
  const changed = evidence();
  changed.runtime[0].text += " Changed.";
  assert.throws(() => publishedImageReviews(changed), /Runtime/);
  const unapproved = evidence();
  unapproved.approval.status = "pending";
  assert.throws(() => publishedImageReviews(unapproved), /approval/);
  const tampered = evidence();
  tampered.batchBytes = Buffer.from("{}");
  assert.throws(() => publishedImageReviews(tampered), /approval/);
  const missingReceipt = evidence();
  missingReceipt.publication.receipts = [];
  assert.throws(() => publishedImageReviews(missingReceipt), /receipt/);
});
test("a superseded checkup retains its historical finding and never assigns it to the new image", async () => {
  const published = await loadPublishedImageReviews();
  const old = read("docs/media/image-checkup-reviews.json").proposals.find(
    (row) => row.demandId === "demand-ab347eecedc5bcf3991f1021"
  );
  const replacement = published.find((row) => row.contentSha256 === old.contentSha256);
  const current = { id: old.demandId, revision: old.contentSha256, url: replacement.currentUrl };
  const [row] = applyImageCheckupReviews([current], { proposals: [old] }, published);
  assert.equal(row.historicalVisualReview, old);
  assert.equal(row.action, "keep-published-supplied-reference");
  assert.equal(row.reviewedAssetSha256, replacement.servedSha256);
  assert.throws(
    () =>
      applyImageCheckupReviews(
        [{ ...current, revision: "changed" }],
        { proposals: [old] },
        published
      ),
    /Stale/
  );
  assert.throws(
    () =>
      applyImageCheckupReviews(
        [{ ...current, url: "other.webp" }],
        { proposals: [old] },
        published
      ),
    /Stale/
  );
});

test("dashboard triage exposes absent and stale reviews without blessing changed assignments", () => {
  const review = { demandId: "one", contentSha256: "old", url: "old.webp" };
  const row = { id: "one", revision: "new", url: "new.webp", reviewedAssetSha256: "old-digest" };
  const result = partitionImageCheckupReviews([row], {
    proposals: [review, { ...review, demandId: "absent" }],
  });
  assert.equal(result.current.proposals.length, 0);
  assert.equal(result.stale.length, 1);
  assert.equal(result.historical.length, 1);
  assert.equal(row.action, "recheck-stale-approval");
  assert.equal(row.reviewedAssetSha256, null);
  assert.equal(review.url, "old.webp");
  assert.throws(
    () => partitionImageCheckupReviews([row], { proposals: [review, review] }),
    /Duplicate/
  );
});
