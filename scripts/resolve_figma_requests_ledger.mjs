import fs from "node:fs";
import path from "node:path";

const figmaRequestsPath = path.resolve("docs/figma-image-regeneration-requests.json");
const figmaRequests = JSON.parse(fs.readFileSync(figmaRequestsPath, "utf8"));

// Load Batch E from batches-efgh manifest
const manifestEFGHPath = path.resolve("docs/content-review/batches-efgh-2026-10-11/manifest.json");
const manifestEFGH = JSON.parse(fs.readFileSync(manifestEFGHPath, "utf8"));
const batchE = manifestEFGH.batchE || [];

// Load Batches I & J
const manifestIJPath = path.resolve("docs/content-review/batches-ij-2026-10-11/manifest.json");
const manifestIJ = JSON.parse(fs.readFileSync(manifestIJPath, "utf8"));
const allIJ = [...(manifestIJ.batchI || []), ...(manifestIJ.batchJ || [])];

const allResolved = [...batchE, ...allIJ];
const idToTarget = new Map();
for (const item of allResolved) {
  idToTarget.set(item.id, item.targetFile.replace(/^public\//, ""));
}

let resolvedCount = 0;

for (const item of figmaRequests.items) {
  if (idToTarget.has(item.questionId)) {
    item.existingReplacement = idToTarget.get(item.questionId);
    item.nextAction = "Covered by approved dual WebP/AVIF scene artwork.";
    resolvedCount++;
  }
}

figmaRequests.replacementsNeeded = figmaRequests.items.filter(
  (it) => it.nextAction && it.nextAction.includes("Replacement artwork needed")
).length;

fs.writeFileSync(figmaRequestsPath, JSON.stringify(figmaRequests, null, 2) + "\n");
console.log(`Updated figma-image-regeneration-requests.json: ${resolvedCount} total items covered.`);
console.log(`Replacements needed remaining: ${figmaRequests.replacementsNeeded}`);
