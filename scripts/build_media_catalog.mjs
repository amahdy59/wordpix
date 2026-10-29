import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import {
  csvText,
  digest,
  finalizeAssets,
  mediaKind,
  normalizeText,
  objectKey,
  parseCsv,
  reconcileBindings,
  validateReviews,
} from "./lib/media_catalog.mjs";

const require = createRequire(import.meta.url);
const root = process.cwd();
const output = path.join(root, "output/media-catalog");
await fs.mkdir(output, { recursive: true });
const readJson = async (file) =>
  JSON.parse((await fs.readFile(file, "utf8")).replace(/^\uFEFF/, ""));
const optionalJson = async (file) => {
  try {
    return await readJson(file);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
};
const offline = process.argv.includes("--offline");
if (process.argv.slice(2).some((arg) => arg !== "--offline"))
  throw new Error("Only --offline is supported. This tool has no upload/rename/delete mode.");
const reviews = validateReviews(await readJson("docs/media/asset-reviews.json"));
let snapshot;
if (offline) {
  snapshot = await readJson(path.join(output, "r2-inventory.json"));
} else {
  require("./lib/env.cjs").loadEnv();
  const client = require("./lib/r2.cjs").createClient();
  // The sole remote operation is a paginated GET listing. Do not call verify().
  const keys = await client.list("");
  snapshot = {
    schemaVersion: 1,
    bucket: client.config.bucket,
    capturedAt: new Date().toISOString(),
    keys: keys.sort(),
  };
  const previous = await optionalJson(path.join(output, "r2-inventory.json"));
  const snapshotDir = path.join(output, "snapshots");
  await fs.mkdir(snapshotDir, { recursive: true });
  const stamp = snapshot.capturedAt.replace(/[:.]/g, "-");
  await fs.writeFile(
    path.join(snapshotDir, `${stamp}.json`),
    JSON.stringify(snapshot, null, 2) + "\n",
    { flag: "wx" }
  );
  const before = new Set(previous?.keys ?? []);
  const after = new Set(keys);
  await fs.writeFile(
    path.join(output, "inventory-changes.json"),
    JSON.stringify(
      {
        previousCapturedAt: previous?.capturedAt ?? null,
        capturedAt: snapshot.capturedAt,
        baseline: !previous,
        addedKeys: keys.filter((k) => !before.has(k)),
        noLongerListedKeys: [...before].filter((k) => !after.has(k)),
        note: "Read-only observation. This command performs no object mutations.",
      },
      null,
      2
    ) + "\n"
  );
  await fs.writeFile(
    path.join(output, "r2-inventory.json"),
    JSON.stringify(snapshot, null, 2) + "\n"
  );
}
if (snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.keys) || !snapshot.capturedAt)
  throw new Error("Invalid inventory snapshot");
const remote = new Set(snapshot.keys);
console.log(`R2 inventory: ${remote.size} keys (${offline ? "cached" : "fresh"}).`);
const assets = new Map();
function record(key, source, localPath, context) {
  key = objectKey(key);
  if (!key) return;
  const item = assets.get(key) ?? {
    key,
    remoteListed: remote.has(key),
    sources: new Set(),
    localPaths: new Set(),
    contexts: new Set(),
  };
  if (source) item.sources.add(source);
  if (localPath) item.localPaths.add(localPath.replaceAll("\\", "/"));
  if (context) item.contexts.add(context);
  assets.set(key, item);
}
for (const key of remote) record(key, null);
const manifests = [
  "output/figma-slides-10015-remaining/manifest.csv",
  "output/figma-slides-10015-images/manifest.csv",
  "output/figma-designed-visuals-images/manifest.csv",
  "output/figma-deck3-images/manifest.csv",
];
const absentSources = [];
const candidates = new Map();
for (const file of manifests) {
  let rows;
  try {
    rows = parseCsv(await fs.readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") {
      absentSources.push(file);
      continue;
    }
    throw error;
  }
  for (const row of rows) {
    const key = objectKey(row["R2 Path"]);
    const sentence = row["Exact Sentence"] ?? row.Sentence;
    record(
      key,
      file,
      row["Local Storage Path"] ?? row["Local App Path"] ?? row["Local Path"],
      sentence
    );
    if (sentence && key) {
      const set = candidates.get(normalizeText(sentence)) ?? new Set();
      set.add(key);
      candidates.set(normalizeText(sentence), set);
    }
  }
}
const registry = await readJson("src/app/generated/reviewedExactSentenceMedia.json");
const bindings = reconcileBindings(registry, reviews);
for (const [id, entry] of Object.entries(registry)) {
  record(entry.imagePath, `registry:${id}`, null, entry.sentence);
  for (const fallback of entry.imageFallbacks ?? [])
    record(fallback.imagePath, `stored-fallback:${id}`, null, entry.sentence);
  const set = candidates.get(normalizeText(entry.sentence)) ?? new Set();
  const key = objectKey(entry.imagePath);
  if (key) set.add(key);
  candidates.set(normalizeText(entry.sentence), set);
}

// Index literal references in JSON catalogues, retaining provenance. These are
// recorded references, not proof that a branch is reachable at runtime.
async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(file)));
    else if (entry.isFile()) result.push(file);
  }
  return result;
}
for (const file of await walk("src/app")) {
  if (!file.endsWith(".json") || file.endsWith("reviewedExactSentenceMedia.json")) continue;
  const content = await readJson(file);
  const visit = (value, pointer) => {
    if (
      typeof value === "string" &&
      /\.(?:webp|avif|png|jpe?g|svg|mp3|wav|webm|mp4|vtt)$/i.test(value)
    ) {
      const key = objectKey(value);
      if (key && remote.has(key)) record(key, `${file.replaceAll("\\", "/")}#${pointer}`);
    } else if (Array.isArray(value)) value.forEach((v, i) => visit(v, `${pointer}/${i}`));
    else if (value && typeof value === "object")
      for (const [k, v] of Object.entries(value)) visit(v, `${pointer}/${k}`);
  };
  visit(content, "");
}
const demandData = await optionalJson(path.join(output, "demands.json"));
if (!demandData)
  throw new Error(
    "Run node scripts/audit_visual_demands.mjs first. Coverage must not silently use an empty demand set."
  );
for (const demand of demandData.demands)
  if (demand.resolvedUrl)
    record(demand.resolvedUrl, `runtime-demand:${demand.demandId}`, null, demand.text);

// Local candidates are mapped only when that exact public object key exists in
// the inventory or a source manifest. No invented CDN path transformations.
for (const file of await walk("public")) {
  const rel = file.replaceAll("\\", "/").slice("public/".length);
  if (assets.has(rel)) record(rel, "public-local-copy", file);
  if (assets.has(`images/v1/${rel}`)) record(`images/v1/${rel}`, "public-local-copy", file);
}
let localHashed = 0;
for (const item of assets.values()) {
  if (mediaKind(item.key) !== "image") continue;
  for (const file of item.localPaths) {
    const resolved = path.resolve(file);
    if (!resolved.startsWith(root + path.sep))
      throw new Error(`Local source escapes workspace: ${file}`);
    try {
      const bytes = await fs.readFile(resolved);
      item.localSha256 = digest(bytes);
      item.localBytes = bytes.length;
      item.localHashPath = file;
      localHashed++;
      break;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}
const catalog = finalizeAssets(
  [...assets.values()].map((item) => ({
    ...item,
    sources: [...item.sources].sort(),
    localPaths: [...item.localPaths].sort(),
    contexts: [...item.contexts].sort(),
  })),
  reviews
);
const byKey = new Map(catalog.map((a) => [a.key, a]));
for (const review of reviews.assets)
  if (!byKey.has(review.key)) throw new Error(`Unknown annotated asset: ${review.key}`);
const mismatchKeys = new Set(
  bindings
    .filter((b) => b.status === "mismatch")
    .map((b) => JSON.stringify([b.wordId, b.sentence, b.imageKey]))
);
const rejectedCandidates = new Set(
  bindings
    .filter((b) => b.status === "mismatch")
    .map((b) => JSON.stringify([normalizeText(b.sentence), b.imageKey]))
);
const demands = demandData.demands.map((d) => {
  const imageKey = objectKey(d.resolvedUrl);
  const mismatch = mismatchKeys.has(JSON.stringify([d.wordId, d.text, imageKey]));
  const options = [...(candidates.get(normalizeText(d.text)) ?? [])]
    .filter(
      (k) =>
        k !== imageKey &&
        byKey.get(k)?.remoteListed &&
        !rejectedCandidates.has(JSON.stringify([normalizeText(d.text), k]))
    )
    .sort();
  return {
    ...d,
    imageKey,
    status: mismatch
      ? "confirmed-mismatch"
      : imageKey
        ? byKey.get(imageKey)?.remoteListed
          ? "assigned-unreviewed"
          : "local-or-unlisted-reference"
        : options.length
          ? "reuse-candidates-to-review"
          : "search-existing-artwork",
    candidateKeys: options,
    conceptId: `concept-${digest(normalizeText(d.text)).slice(0, 24)}`,
    generationApproved: false,
  };
});
const counts = (rows) =>
  Object.fromEntries(
    [...new Set(rows.map((r) => r.status))]
      .sort()
      .map((s) => [s, rows.filter((r) => r.status === s).length])
  );
const duplicates = catalog
  .filter((a) => a.duplicateGroup)
  .map((a) => ({
    groupId: a.duplicateGroup,
    assetId: a.assetId,
    key: a.key,
    displayName: a.displayName,
    evidence: a.duplicateEvidence,
  }));
const conceptQueue = new Map();
for (const demand of demands.filter((d) => !d.imageKey || d.status === "confirmed-mismatch")) {
  const concept = conceptQueue.get(demand.conceptId) ?? {
    conceptId: demand.conceptId,
    text: demand.text,
    demandIds: [],
    lessons: new Set(),
    candidateKeys: new Set(),
    statuses: new Set(),
    generationApproved: false,
  };
  concept.demandIds.push(demand.demandId);
  concept.lessons.add(demand.lessonId);
  demand.candidateKeys.forEach((key) => concept.candidateKeys.add(key));
  concept.statuses.add(demand.status);
  conceptQueue.set(demand.conceptId, concept);
}
const concepts = [...conceptQueue.values()].map((c) => ({
  ...c,
  lessons: [...c.lessons].sort(),
  candidateKeys: [...c.candidateKeys].sort(),
  statuses: [...c.statuses].sort(),
}));
const summary = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  inventoryCapturedAt: snapshot.capturedAt,
  inventoryMode: offline ? "cached" : "live-read-only",
  bucket: snapshot.bucket ?? "not-recorded-in-legacy-snapshot",
  remoteKeys: remote.size,
  catalogAssets: catalog.length,
  localImagesHashed: localHashed,
  localExactDuplicateGroups: new Set(duplicates.map((a) => a.groupId)).size,
  indexedReferencesAbsent: catalog.filter((a) => !a.sources.some((s) => s !== "public-local-copy"))
    .length,
  missingOptionalManifests: absentSources,
  bindings: counts(bindings),
  shadowedBindings: bindings.filter((b) => b.shadowedBy).length,
  demands: counts(demands),
  demandScope: demandData.scope,
  demandsGeneratedAt: demandData.generatedAt,
  referenceOnlyUses: demands.filter((d) => d.referenceOnly).length,
  deduplicatedConceptsToReview: concepts.length,
  confirmedNewImagesRequired: null,
  generationApproved: 0,
  limitations: [
    "Object listing proves key existence at capture time, not GET integrity.",
    "Duplicate groups compare local bytes only; original Figma hashes and filenames are not byte-equality evidence.",
    "No indexed reference does not mean safe to delete.",
    "Candidate matches use exact normalized text and require visual review. Semantic completeness is not established.",
    "Audio, video and captions are inventoried; local byte duplicate checking currently covers images only.",
  ],
};
const write = (name, data) =>
  fs.writeFile(
    path.join(output, name),
    typeof data === "string" ? data : JSON.stringify(data, null, 2) + "\n"
  );
await write("catalog.json", { schemaVersion: 1, summary, assets: catalog });
await write(
  "assets.csv",
  csvText(
    catalog.map((a) => ({ ...a, indexedReferences: a.sources.length })),
    [
      "assetId",
      "displayName",
      "nameStatus",
      "tags",
      "aliases",
      "kind",
      "collection",
      "key",
      "url",
      "remoteListed",
      "indexedReferences",
      "duplicateGroup",
      "duplicateEvidence",
      "localSha256",
      "localBytes",
      "localHashPath",
      "sources",
    ]
  )
);
await write(
  "duplicates.csv",
  csvText(duplicates, ["groupId", "assetId", "displayName", "key", "evidence"])
);
await write(
  "bindings.csv",
  csvText(bindings, [
    "entryId",
    "wordId",
    "sentence",
    "imageKey",
    "status",
    "evidence",
    "shadowedBy",
    "storedFallbacks",
  ])
);
await write("visual-reconciliation.json", { schemaVersion: 1, scope: demandData.scope, demands });
await write(
  "visual-reconciliation.csv",
  csvText(demands, [
    "demandId",
    "conceptId",
    "kind",
    "unitId",
    "lessonId",
    "wordId",
    "text",
    "status",
    "imageKey",
    "candidateKeys",
    "generationHold",
    "generationApproved",
    "referenceOnly",
    "imageSupport",
  ])
);
await write("summary.json", summary);
// Small Markdown packets make visual matching manageable without loading an
// 80 MB catalog into an editor. These are proposals, never runtime mappings.
const md = (text) =>
  String(text ?? "")
    .replace(/[\\`*_{}\[\]<>|]/g, "\\$&")
    .replace(/\r?\n/g, " ");
const packetsDir = path.join(output, "review-packets");
await fs.mkdir(packetsDir, { recursive: true });
const perUnit = new Map();
for (const demand of demands.filter((d) => !d.imageKey || d.status === "confirmed-mismatch")) {
  if (!/^[a-z0-9-]+$/.test(demand.unitId))
    throw new Error(`Invalid unit ID for packet: ${demand.unitId}`);
  const list = perUnit.get(demand.unitId) ?? [];
  list.push(demand);
  perUnit.set(demand.unitId, list);
}
const packetLinks = [];
for (const [unitId, items] of [...perUnit].sort(([a], [b]) => a.localeCompare(b, "en"))) {
  for (let start = 0; start < items.length; start += 25) {
    const name = `${unitId}-${String(start / 25 + 1).padStart(3, "0")}.md`;
    const lines = [
      `# ${md(unitId)} — visual review`,
      "",
      `Inventory: ${snapshot.capturedAt}. Candidate labels and historic assignments require visual confirmation.`,
      "",
      "For each item: inspect the image, check exact counts/actions/context, record acceptance or rejection with evidence. No approval or mapping is applied by this report.",
      "",
    ];
    for (const d of items.slice(start, start + 25)) {
      lines.push(
        `## ${md(d.lessonId)} · ${md(d.wordId)}`,
        "",
        `Demand: ${d.demandId} · Concept: ${d.conceptId}`,
        "",
        md(d.text),
        "",
        `Status: ${d.status}`,
        ""
      );
      if (d.imageKey) lines.push(`Current: [${md(d.imageKey)}](${byKey.get(d.imageKey)?.url})`, "");
      if (!d.candidateKeys.length)
        lines.push("Search existing catalog artwork before requesting new art.", "");
      for (const key of d.candidateKeys) {
        const asset = byKey.get(key);
        lines.push(
          `Candidate: [${md(asset.displayName)}](${asset.url}) — ${asset.assetId} (${asset.nameStatus})`,
          ""
        );
      }
    }
    await fs.writeFile(path.join(packetsDir, name), lines.join("\n") + "\n");
    packetLinks.push(
      `- [${md(unitId)} · items ${start + 1}–${Math.min(start + 25, items.length)}](review-packets/${name})`
    );
  }
}
await write(
  "review-index.md",
  "# Visual review packets\n\nGrouped by stable unit IDs, up to 25 learning uses per packet. Exact-text candidates are suggestions; new art is not approved. Regenerated index is authoritative; files from earlier runs may remain for preservation.\n\n" +
    packetLinks.join("\n") +
    "\n"
);
await write(
  "binding-mismatches.md",
  "# Confirmed binding mismatches\n\n" +
    bindings
      .filter((b) => b.status === "mismatch")
      .map(
        (b) =>
          `## ${md(b.entryId)}\n\n${md(b.sentence)}\n\n[Inspect assigned image](${byKey.get(b.imageKey)?.url})\n\n${md(b.evidence)}\n\nDisposition: search existing artwork for a reviewed replacement; no live mapping change applied.\n`
      )
      .join("\n")
);
await write(
  "concept-review-queue.csv",
  csvText(concepts, [
    "conceptId",
    "text",
    "statuses",
    "lessons",
    "demandIds",
    "candidateKeys",
    "generationApproved",
  ])
);
await write(
  "review-plan.md",
  `# Media review snapshot\n\nInventory captured: ${snapshot.capturedAt}.\n\n- ${remote.size} R2 keys inventoried; ${catalog.length} catalog records.\n- ${localHashed} local image copies hashed; ${summary.localExactDuplicateGroups} exact local duplicate groups.\n- ${bindings.filter((b) => b.status === "mismatch").length} confirmed incorrect registry assignments; ${summary.shadowedBindings} shadowed rows.\n- ${demands.length} runtime learning uses checked.\n- ${concepts.length} deduplicated concepts need assignment or mismatch review.\n\nOpen assets.csv to search names, collections and provenance. Open bindings.csv for incorrect assignments and duplicates. Open concept-review-queue.csv for candidate matching before requesting new art. Candidate suggestions are unverified. The final number of new images is still undetermined.\n\n${summary.limitations.map((x) => "- " + x).join("\n")}\n\nScope: ${demandData.scope}\n`
);
console.log(JSON.stringify(summary, null, 2));
