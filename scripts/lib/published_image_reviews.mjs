import fs from "node:fs/promises";
import { CDN, digest } from "./media_catalog.mjs";

/** Read-only evidence of an already authorized, published display override. */
export function publishedImageReviews({
  batchBytes,
  approval,
  publication,
  runtime,
  historical = [],
}) {
  if (
    approval.status !== "approved-by-user" ||
    digest(batchBytes) !== approval.batchSha256 ||
    publication.batchSha256 !== approval.batchSha256
  )
    throw Error("Published image approval does not match the immutable batch");
  const batch = JSON.parse(batchBytes.toString("utf8"));
  if (JSON.stringify(batch.bindings) !== JSON.stringify(runtime))
    throw Error("Runtime supplied images differ from the approved batch");
  return batch.bindings.map((row) => {
    const file = batch.files.find((item) => row.imagePath === `${CDN}/${item.key}`);
    const receipt = publication.receipts.find((item) => item.key === file?.key);
    if (
      !file ||
      !approval.keys.includes(file.key) ||
      receipt?.sha256 !== file.sha256 ||
      receipt.bytes !== file.bytes ||
      !receipt.checksumVerified ||
      !receipt.corsVerified
    )
      throw Error("Supplied image lacks an approved publication receipt");
    const contentSha256 = digest(
      JSON.stringify([
        row.kind === "scene" ? "usage-scene" : row.kind,
        row.unitId,
        row.lessonId,
        row.wordId,
        row.text,
      ])
    );
    const previousUrl = row.expectedSourceKey ? `${CDN}/${row.expectedSourceKey}` : null;
    const historicalReuse = historical.filter(
      (item) =>
        item.decision === "reuse" &&
        item.content.contentSha256 === contentSha256 &&
        item.content.expectedResolvedUrl === previousUrl &&
        digest(
          JSON.stringify([
            item.content.kind,
            item.content.unitId,
            item.content.lessonId,
            item.content.wordId,
            item.content.text,
          ])
        ) === contentSha256 &&
        ["subject", "action", "quantity", "context", "assessmentSafe", "altText"].every(
          (check) => item.checks?.[check] === true
        )
    );
    return {
      contentSha256,
      previousUrl,
      previousUrls: [previousUrl, ...historicalReuse.map((item) => `${CDN}/${item.key}`)],
      currentUrl: row.imagePath,
      servedSha256: file.sha256,
      approvedAt: approval.approvedAt,
      batchSha256: approval.batchSha256,
    };
  });
}

export async function loadPublishedImageReviews() {
  const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
  const [batchBytes, approval, publication, runtime, historical] = await Promise.all([
    fs.readFile("docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json"),
    read("docs/media/APPROVED_SUPPLIED_IMAGES_2026-10-30.json"),
    read("docs/media/PUBLISHED_SUPPLIED_IMAGE_RECEIPT_2026-10-30.json"),
    read("src/app/generated/suppliedMedia.json"),
    read("docs/media/visual-decisions.json"),
  ]);
  return publishedImageReviews({
    batchBytes,
    approval,
    publication,
    runtime,
    historical: historical.decisions,
  });
}

export function findPublishedSupersession(revision, previousUrl, currentUrl, published) {
  return (
    previousUrl !== currentUrl &&
    published.find(
      (row) =>
        row.contentSha256 === revision &&
        (row.previousUrl === previousUrl || row.previousUrls?.includes(previousUrl)) &&
        row.currentUrl === currentUrl
    )
  );
}
