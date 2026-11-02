import fs from "node:fs/promises";
import path from "node:path";
import { loadPublishedImageReviews } from "./lib/published_image_reviews.mjs";
import {
  csvText,
  assetId,
  digest,
  finalizeAssets,
  validateReviews,
  objectKey,
} from "./lib/media_catalog.mjs";
import {
  contentSnapshot,
  createCandidateSearch,
  validateVisualDecisions,
  validateCandidateRejections,
} from "./lib/visual_review.mjs";

const root = path.resolve("output/media-catalog");
const read = async (p) => JSON.parse((await fs.readFile(p, "utf8")).replace(/^\uFEFF/, ""));
const catalog = await read(path.join(root, "catalog.json"));
const summary = catalog.summary;
const assets = finalizeAssets(
  catalog.assets,
  validateReviews(await read("docs/media/asset-reviews.json"))
);
const reconciliation = await read(path.join(root, "visual-reconciliation.json"));
const current = await read(path.join(root, "demands.json"));
const previous = new Map(reconciliation.demands.map((d) => [d.demandId, d]));
const demands = current.demands.map((d) => ({
  ...previous.get(d.demandId),
  ...d,
  imageKey: objectKey(d.resolvedUrl),
  candidateKeys: previous.get(d.demandId)?.candidateKeys ?? [],
}));
const scope = current.scope;
const data = await read("docs/media/visual-decisions.json");
const rejectedData = await read("docs/media/candidate-rejections.json");
const rejected = new Set();
for (const r of validateCandidateRejections(rejectedData, demands, assets)) {
  rejected.add(JSON.stringify([r.demandId, r.key]));
}
const published = await loadPublishedImageReviews();
const decisions = validateVisualDecisions(data, demands, assets, published);
const activeIds = new Set(decisions.map((row) => row.content.demandId));
const superseded = data.decisions.filter((row) => !activeIds.has(row.content.demandId));
const search = createCandidateSearch(assets);
const decided = new Set(decisions.map((d) => d.content.demandId));
const byKey = new Map(assets.map((a) => [a.key, a]));
const unresolved = demands.filter(
  (d) => (!d.imageKey || d.status === "confirmed-mismatch") && !decided.has(d.demandId)
);
const candidates = unresolved.map((d) => ({
  ...contentSnapshot(d),
  conceptId: d.conceptId,
  exactCandidateKeys: d.candidateKeys.filter(
    (key) => !rejected.has(JSON.stringify([d.demandId, key]))
  ),
  searchResults: search(d, 24)
    .filter((r) => !rejected.has(JSON.stringify([d.demandId, r.key])))
    .slice(0, 8),
  reviewStatus: "pending-visual-review",
}));
const reuse = [];
for (const decision of decisions.filter((d) => d.decision === "reuse")) {
  const asset = byKey.get(decision.key);
  if (asset.review?.inspectedSha256 !== decision.assetSha256) {
    const bytes = await fs.readFile(asset.localHashPath);
    if (digest(bytes) !== decision.assetSha256)
      throw new Error(`Local bytes changed: ${decision.key}`);
  }
  // GET only: prove the visually inspected bytes are actually served at the
  // proposed immutable URL. Do not upload, rename or apply any mapping.
  const response = await fetch(asset.url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`Reuse verification GET failed: ${response.status}`);
  const remote = Buffer.from(await response.arrayBuffer());
  if (digest(remote) !== decision.assetSha256)
    throw new Error(`Remote bytes differ: ${decision.key}`);
  reuse.push({
    ...decision,
    remoteEvidence: {
      verifiedAt: new Date().toISOString(),
      method: "GET",
      sha256: digest(remote),
      bytes: remote.length,
    },
    disposition: "validated-proposal-only",
  });
}
const generation = decisions.filter((d) => d.decision === "generate");
const generationGroups = new Map();
for (const d of generation) {
  const key = digest(
    JSON.stringify([d.content.kind, d.content.text, d.visualBrief, d.acceptanceCriteria])
  );
  const group = generationGroups.get(key) ?? {
    requestId: `image-request-${key.slice(0, 24)}`,
    text: d.content.text,
    visualBrief: d.visualBrief,
    acceptanceCriteria: d.acceptanceCriteria,
    demandIds: [],
    status: "content-reviewed-generation-request",
  };
  group.demandIds.push(d.content.demandId);
  generationGroups.set(key, group);
}
const naming = assets
  .filter((a) => a.kind === "image")
  .map((a) => ({
    assetId: a.assetId,
    key: a.key,
    displayName: a.displayName,
    namingStatus: a.nameStatus,
    duplicateGroup: a.duplicateGroup,
    canonicalCandidateId: a.duplicateGroup
      ? assetId([a.key, ...a.duplicateKeys].sort()[0])
      : a.assetId,
    namingAction:
      a.nameStatus === "reviewed" ? "retain-reviewed-name" : "inspect-image-and-add-catalog-name",
    physicalKeyAction: "preserve",
  }));
const write = (name, value) =>
  fs.writeFile(
    path.join(root, name),
    typeof value === "string" ? value : JSON.stringify(value, null, 2) + "\n"
  );
await write("superseded-visual-decisions.json", {
  schemaVersion: 1,
  appliesLiveMappings: false,
  reason: "Historical proposals superseded by the approved published supplied-image batch",
  decisions: superseded,
});
await write("expanded-candidates.json", { schemaVersion: 1, scope, demands: candidates });
await write(
  "expanded-candidates.csv",
  csvText(
    candidates.map((d) => ({ ...d, searchCandidateKeys: d.searchResults.map((r) => r.key) })),
    [
      "demandId",
      "kind",
      "unitId",
      "lessonId",
      "wordId",
      "text",
      "exactCandidateKeys",
      "searchCandidateKeys",
      "reviewStatus",
    ]
  )
);
await write("validated-reuse-proposals.json", {
  schemaVersion: 1,
  appliesLiveMappings: false,
  proposals: reuse,
});
await write("runtime-assignment-proposals.json", {
  schemaVersion: 1,
  appliesLiveMappings: false,
  assignments: reuse.map((p) => ({
    contentId: p.content.demandId,
    unitId: p.content.unitId,
    lessonId: p.content.lessonId,
    wordId: p.content.wordId,
    sentence: p.content.text,
    purpose:
      p.content.kind === "sentence" && /^This is /.test(p.content.text)
        ? "word-reference"
        : "sentence-context",
    imagePath: byKey.get(p.key).url,
    imageAlt: p.imageAlt,
    assetId: p.assetId,
    key: p.key,
    imageSha256: p.assetSha256,
    contentSha256: p.content.contentSha256,
    review: p.review,
    remoteEvidence: p.remoteEvidence,
  })),
});
await write("generation-requests.json", {
  schemaVersion: 1,
  scope,
  requests: [...generationGroups.values()],
});
await write("content-repair-queue.json", {
  schemaVersion: 1,
  items: decisions.filter((d) => d.decision === "content-repair" && !d.resolution),
});
await write(
  "naming-audit.csv",
  csvText(naming, [
    "assetId",
    "key",
    "displayName",
    "namingStatus",
    "duplicateGroup",
    "canonicalCandidateId",
    "namingAction",
    "physicalKeyAction",
  ])
);
const result = {
  generatedAt: new Date().toISOString(),
  inventoryCapturedAt: summary.inventoryCapturedAt,
  demandsGeneratedAt: current.generatedAt,
  auditedUses: demands.length,
  supersededHistoricalDecisions: superseded.length,
  referenceOnlyUses: demands.filter((d) => d.referenceOnly).length,
  validatedReuseProposals: reuse.length,
  authorizedAssignmentsAlreadyApplied: reuse.filter(
    (p) =>
      demands.find((d) => d.demandId === p.content.demandId)?.resolvedUrl === byKey.get(p.key).url
  ).length,
  reviewedCandidateRejections: rejectedData.rejections.length,
  imagesWithReviewedNames: assets.filter((a) => a.kind === "image" && a.nameStatus === "reviewed")
    .length,
  reviewedGenerationRequests: generationGroups.size,
  contentRepairsRequired: decisions.filter((d) => d.decision === "content-repair" && !d.resolution)
    .length,
  contentRepairsResolved: decisions.filter((d) => d.decision === "content-repair" && d.resolution)
    .length,
  unresolvedUses: unresolved.length,
  finalGenerationCountEstablished: unresolved.length === 0,
  completeAppCoverage: false,
  scope,
  liveMappingsChangedByThisCommand: 0,
  r2Writes: 0,
};
await write("decision-summary.json", result);
await write("decision-templates.json", {
  schemaVersion: 1,
  templates: candidates.map((d) => ({
    content: {
      demandId: d.demandId,
      kind: d.kind,
      unitId: d.unitId,
      lessonId: d.lessonId,
      wordId: d.wordId,
      text: d.text,
      expectedResolvedUrl: d.expectedResolvedUrl,
      contentSha256: d.contentSha256,
    },
    reviewStatus: "pending",
    candidateAssetIds: [
      ...new Set([...d.exactCandidateKeys.map(assetId), ...d.searchResults.map((r) => r.assetId)]),
    ],
  })),
});
console.log(JSON.stringify(result, null, 2));
