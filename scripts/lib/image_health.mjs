/** Technical evidence alone never approves an image's meaning or a replacement. */
export function imageHealthFlags({ bytes, width, height, format, extension, error }) {
  if (error) return ["unreadable-local-copy"];
  if (bytes === 0) return ["empty-local-copy"];
  const flags = [];
  if (!(width > 0 && height > 0)) flags.push("invalid-dimensions");
  const expected = {
    avif: ["avif", "heif"],
    webp: ["webp"],
    jpg: ["jpeg"],
    jpeg: ["jpeg"],
    png: ["png"],
    svg: ["svg"],
    gif: ["gif"],
  };
  if (expected[extension] && !expected[extension].includes(format))
    flags.push("container-extension-mismatch");
  if (Math.max(width ?? 0, height ?? 0) < 480) flags.push("check-display-resolution");
  if (bytes > 250 * 1024) flags.push("check-transfer-size");
  return flags;
}

export function imageReviewAction(row) {
  if (row.semantic === "confirmed mismatch") return "replace-association";
  if (row.hold) return "review-content-first";
  if (row.purpose === "text-only") return "no-image-needed";
  if (row.semantic === "reviewed reuse") return "keep-reviewed-assignment";
  if (row.semantic === "stale review") return "recheck-stale-approval";
  if (row.referenceOnly) return "review-reference-context";
  if (!row.url)
    return row.candidateCount > 0 ? "inspect-existing-candidates" : "decide-purpose-and-search";
  return "inspect-image-and-context";
}

/** Sampled visual triage is revision-pinned and never changes runtime media. */
export function applyImageCheckupReviews(rows, ledger) {
  const byId = new Map(rows.map((row) => [row.id, row]));
  const seen = new Set();
  for (const review of ledger.proposals) {
    const row = byId.get(review.demandId);
    if (seen.has(review.demandId)) throw Error(`Duplicate image checkup: ${review.demandId}`);
    seen.add(review.demandId);
    if (!row || row.revision !== review.contentSha256 || row.url !== review.url)
      throw Error(`Stale image checkup: ${review.demandId}`);
    row.action = review.disposition;
    row.visualReview = review.rationale;
    row.reviewedAssetSha256 = review.servedSha256;
    row.byteEvidence = `Public GET bytes recorded at ${review.reviewedAt ?? ledger.reviewedAt}; not re-fetched by this local check`;
  }
  return rows;
}
