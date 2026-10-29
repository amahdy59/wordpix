import test from "node:test";
import assert from "node:assert/strict";
import {
  buildQualityRows,
  dashboardImageUrl,
  parseLearnerImageReports,
  purposeReviewSchema,
  safeInlineJson,
} from "../lib/image_quality_dashboard.mjs";
import { digest, CDN } from "../lib/media_catalog.mjs";
import { contentDigest } from "../lib/visual_review.mjs";
const demand = {
  demandId: "demand-one",
  kind: "sentence",
  unitId: "garden",
  lessonId: "garden-1",
  wordId: "spade",
  text: "The tool rests beside soil.",
  resolvedUrl: `${CDN}/images/one.webp`,
  imageKey: "images/one.webp",
  status: "assigned-unreviewed",
  candidateKeys: [],
};
const input = {
  demands: [demand],
  additional: [],
  catalog: {
    summary: { inventoryCapturedAt: "2026-10-29T12:00:00Z" },
    assets: [{ key: demand.imageKey, remoteListed: true }],
  },
  decisions: { decisions: [] },
  purposes: { schemaVersion: 1, reviews: [] },
};
test("assignment and listing never establish byte health or semantic approval", () => {
  const [row] = buildQualityRows(input);
  assert.equal(row.semantic, "not reviewed");
  assert.equal(row.purpose, "needs review");
  assert.equal(row.reviewedAssetSha256, null);
  assert.match(row.byteEvidence, /not verified/);
});
test("purpose decisions require exact current content and cannot silently survive edits", () => {
  const review = {
    contentId: demand.demandId,
    contentSha256: contentDigest(demand),
    purpose: "helpful",
    rationale: "The task supplies the event in text; the image supports the object.",
    reviewer: "Reviewer",
    reviewedAt: "2026-10-29T12:00:00Z",
  };
  assert.equal(
    buildQualityRows({ ...input, purposes: { schemaVersion: 1, reviews: [review] } })[0].purpose,
    "helpful"
  );
  assert.throws(
    () =>
      buildQualityRows({
        ...input,
        demands: [{ ...demand, text: "Changed." }],
        purposes: { schemaVersion: 1, reviews: [review] },
      }),
    /Stale/
  );
  assert.throws(() =>
    purposeReviewSchema.parse({ schemaVersion: 1, reviews: [{ ...review, rationale: "guess" }] })
  );
});
test("unsafe image origins and inline script termination are rejected or escaped", () => {
  assert.equal(dashboardImageUrl("javascript:alert(1)"), null);
  assert.equal(dashboardImageUrl("https://other.example/one.webp"), null);
  assert.equal(safeInlineJson({ text: "</script><img onerror=alert(1)>" }).includes("<"), false);
});
test("imported learner reports require the shared strict schema and exact stable identities", () => {
  const context = { kind: "sentence", unitId: "garden", wordId: "spade", text: demand.text },
    reason = "mismatch",
    assetUrl = demand.resolvedUrl;
  const contentId = digest(
      JSON.stringify([context.kind, context.unitId, context.wordId, context.text])
    ),
    assetId = digest(assetUrl);
  const report = {
    context,
    reason,
    assetUrl,
    contentId,
    assetId,
    id: digest(`${contentId}\0${assetId}\0${reason}`),
    occurrences: 1,
    createdAt: "2026-10-29T12:00:00Z",
    updatedAt: "2026-10-29T12:00:00Z",
  };
  const exported = { schemaVersion: 1, exportedAt: report.createdAt, reports: [report] };
  assert.equal(parseLearnerImageReports(exported).length, 1);
  assert.throws(
    () =>
      parseLearnerImageReports({
        ...exported,
        reports: [{ ...report, contentId: "0".repeat(64) }],
      }),
    /identity/
  );
  assert.throws(() =>
    parseLearnerImageReports({
      ...exported,
      reports: [{ ...report, email: "private@example.test" }],
    })
  );
});
