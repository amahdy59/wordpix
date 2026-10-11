import fs from "node:fs";

function audit() {
  const figmaRequests = JSON.parse(fs.readFileSync("docs/figma-image-regeneration-requests.json", "utf8"));
  console.log("=== Figma Image Regeneration Requests ===");
  console.log(`Total Candidates: ${figmaRequests.reviewedCandidates}, Withheld: ${figmaRequests.withheld}, Replacements Needed: ${figmaRequests.replacementsNeeded}`);
  
  const reasons = {};
  const units = {};
  for (const it of figmaRequests.items) {
    const r = it.reason || "Unspecified";
    reasons[r] = (reasons[r] || 0) + 1;
    const unit = it.questionId.split("-usage-")[0];
    units[unit] = (units[unit] || 0) + 1;
  }
  console.log("\nReasons breakdown:");
  console.log(JSON.stringify(reasons, null, 2));
  console.log("\nUnits breakdown:");
  console.log(JSON.stringify(units, null, 2));

  // Check scene holds / reviews
  if (fs.existsSync("docs/GENERATED_SCENE_MEDIA_REVIEW_2026-10-09.json")) {
    const raw = JSON.parse(fs.readFileSync("docs/GENERATED_SCENE_MEDIA_REVIEW_2026-10-09.json", "utf8"));
    const sceneReview = Array.isArray(raw) ? raw : (raw.items || Object.values(raw));
    console.log("\n=== Generated Scene Media Review 2026-10-09 ===");
    console.log(`Total reviewed scenes: ${sceneReview.length}`);
    const held = sceneReview.filter(s => s && (s.status === "held" || s.status === "needs-replacement" || s.holdReason));
    console.log(`Held / Needs replacement count: ${held.length}`);
  }

  // Check reviewed vocabulary reference media
  if (fs.existsSync("docs/REVIEWED_VOCABULARY_REFERENCE_MEDIA_2026-10-09.json")) {
    const vocabMedia = JSON.parse(fs.readFileSync("docs/REVIEWED_VOCABULARY_REFERENCE_MEDIA_2026-10-09.json", "utf8"));
    console.log("\n=== Reviewed Vocabulary Reference Media ===");
    console.log(`Total items: ${vocabMedia.length}`);
  }
}

audit();
