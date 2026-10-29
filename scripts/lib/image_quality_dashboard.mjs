import { z } from "zod";
import { CDN, digest } from "./media_catalog.mjs";
import { contentDigest } from "./visual_review.mjs";
import { imageReportExportSchema } from "../../src/app/media/imageReportSchema.ts";

export function dashboardImageUrl(value) {
  if (!value) return null;
  const url = new URL(value, "https://amahdy59.github.io");
  if (url.username || url.password) return null;
  return [CDN, "https://amahdy59.github.io"].includes(url.origin) ? url.href : null;
}
export const purposeReviewSchema = z
  .object({
    schemaVersion: z.literal(1),
    reviews: z.array(
      z
        .object({
          contentId: z.string().min(1),
          contentSha256: z.string().regex(/^[a-f0-9]{64}$/),
          purpose: z.enum(["required", "helpful", "text-only"]),
          rationale: z.string().trim().min(20),
          reviewer: z.string().trim().min(1),
          reviewedAt: z.iso.datetime(),
        })
        .strict()
    ),
  })
  .strict();

export function buildQualityRows({ demands, additional, catalog, decisions, purposes }) {
  const assets = new Map(catalog.assets.map((asset) => [asset.key, asset]));
  const approved = new Map(
    decisions.decisions
      .filter((decision) => decision.decision === "reuse")
      .map((decision) => [decision.content.demandId, decision])
  );
  const reviews = new Map();
  for (const review of purposeReviewSchema.parse(purposes).reviews) {
    if (reviews.has(review.contentId)) throw Error(`Duplicate purpose review: ${review.contentId}`);
    reviews.set(review.contentId, review);
  }
  const sources = [
    ...demands.map((demand) => ({
      ...demand,
      contentId: demand.demandId,
      revision: contentDigest(demand),
    })),
    ...additional.map((use) => ({
      ...use,
      unitId:
        use.track === "core-story"
          ? use.sourceId.split("/")[0].replace(/-\d+$/, "")
          : `${use.track}/${use.sourceId.split("/")[0]}`,
      wordId: use.contentId,
      revision: digest(JSON.stringify([use.track, use.sourceId, use.kind, use.text])),
    })),
  ];
  const rows = sources.map((source) => {
    const asset = assets.get(source.imageKey);
    const review = reviews.get(source.contentId);
    if (review && review.contentSha256 !== source.revision)
      throw Error(`Stale purpose review: ${source.contentId}`);
    const decision = approved.get(source.contentId);
    // A stale decision is visible as stale; never turn a lexical match into approval.
    const semantic =
      decision &&
      decision.content.contentSha256 === source.revision &&
      dashboardImageUrl(source.resolvedUrl) === `${CDN}/${decision.key}`
        ? "reviewed reuse"
        : decision
          ? "stale review"
          : source.status === "confirmed-mismatch"
            ? "confirmed mismatch"
            : "not reviewed";
    return {
      id: source.contentId,
      unitId: source.unitId,
      wordId: source.wordId,
      lessonId: source.lessonId ?? null,
      kind: source.kind,
      text: source.text,
      revision: source.revision,
      url: dashboardImageUrl(source.resolvedUrl),
      key: source.imageKey ?? null,
      status: source.status,
      referenceOnly: Boolean(source.referenceOnly || /reference.only/i.test(source.note ?? "")),
      hold: source.generationHold ?? null,
      purpose: review?.purpose ?? "needs review",
      rationale: review?.rationale ?? "",
      semantic,
      reviewedAssetSha256: decision?.assetSha256 ?? null,
      inventory: asset?.remoteListed
        ? `listed at ${catalog.summary.inventoryCapturedAt}`
        : "local or not listed",
      byteEvidence: decision?.assetSha256
        ? "digest recorded; use media:review for fresh public GET verification"
        : "not verified by dashboard",
      displayName: asset?.displayName ?? null,
      candidateCount: source.candidateKeys?.length ?? 0,
    };
  });
  for (const id of reviews.keys())
    if (!rows.some((row) => row.id === id)) throw Error(`Unknown purpose review: ${id}`);
  return rows;
}

/** Reject tampered identity hashes as well as unexpected fields/oversized input. */
export function parseLearnerImageReports(input) {
  const parsed = imageReportExportSchema.parse(input);
  for (const report of parsed.reports) {
    const { context, assetUrl, reason } = report;
    const expectedContent = digest(
      JSON.stringify([context.kind, context.unitId ?? "", context.wordId ?? "", context.text])
    );
    if (
      report.contentId !== expectedContent ||
      report.assetId !== digest(assetUrl) ||
      report.id !== digest(`${report.contentId}\0${report.assetId}\0${reason}`) ||
      !dashboardImageUrl(assetUrl)
    )
      throw Error("Invalid report identity or image origin");
  }
  return parsed.reports;
}
export function safeInlineJson(value) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
