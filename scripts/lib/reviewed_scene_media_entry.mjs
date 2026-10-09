export function reviewedMediaEntry(review, existing = {}, legacy = {}) {
  if (!/^[a-z0-9-]+-usage-scene-\d+$/.test(review.sceneId) ||
      !/^[a-f0-9]{64}$/.test(review.sha256) || !review.imageAlt?.trim() ||
      !review.reviewedScenario?.trim() || !review.reviewedQuestion?.trim() || !review.reviewedAnswer?.trim())
    throw new Error("Invalid reviewed scene evidence.");
  if (legacy[review.sceneId]) throw new Error(`Preserving existing media mapping: ${review.sceneId}`);
  if (review.imagePurpose !== undefined && review.imagePurpose !== "word-reference")
    throw new Error("Unsupported image purpose.");
  if (review.sharedAssetId !== undefined &&
      (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(review.sharedAssetId) || review.sharedAssetId.length > 100))
    throw new Error("Invalid shared asset name.");
  if (review.imagePurpose === "word-reference" && !review.sharedAssetId)
    throw new Error("A word reference needs a descriptive shared asset identity.");
  const imagePath = review.sharedAssetId
    ? `question-images/v3/shared/${review.sharedAssetId}/${review.sha256}.webp`
    : `question-images/v2/${review.sceneId}/${review.sha256}.webp`;
  const entry = {
    reviewedScenario: review.reviewedScenario,
    reviewedQuestion: review.reviewedQuestion,
    reviewedAnswer: review.reviewedAnswer,
    imagePath,
    imageAlt: review.imageAlt,
    ...(review.imagePurpose ? {imagePurpose:review.imagePurpose} : {}),
  };
  if (existing[review.sceneId] && JSON.stringify(existing[review.sceneId]) !== JSON.stringify(entry))
    throw new Error(`Preserving existing generated mapping: ${review.sceneId}`);
  return entry;
}
