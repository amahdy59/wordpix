import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { buildQualityRows } from "./lib/image_quality_dashboard.mjs";
import { csvText } from "./lib/media_catalog.mjs";
import {
  applyImageCheckupReviews,
  imageHealthFlags,
  imageReviewAction,
} from "./lib/image_health.mjs";

if (process.argv.length > 2)
  throw Error("This local read-only check has no remote write mode or options.");
const read = async (name) => JSON.parse(await fs.readFile(name, "utf8"));
const [runtime, additional, catalog, decisions, purposes, reviews] = await Promise.all([
  read("output/media-catalog/visual-reconciliation.json"),
  read("output/media-catalog/additional-visual-coverage.json"),
  read("output/media-catalog/catalog.json"),
  read("docs/media/visual-decisions.json"),
  read("docs/media/visual-purpose-decisions.json"),
  read("docs/media/asset-reviews.json"),
]);
const rows = buildQualityRows({
  demands: runtime.demands,
  additional: additional.uses,
  catalog,
  decisions,
  purposes,
}).map((row) => ({ ...row, action: imageReviewAction(row) }));
applyImageCheckupReviews(rows, await read("docs/media/image-checkup-reviews.json"));
const activeKeys = new Set(rows.map((row) => row.key).filter(Boolean));
const localAssets = new Map();
for (const asset of catalog.assets.filter((asset) => asset.kind === "image")) {
  for (const file of asset.localPaths) {
    const keys = localAssets.get(file) ?? new Set();
    keys.add(asset.key);
    localAssets.set(file, keys);
  }
}
const pending = [...localAssets.keys()].sort();
const local = [];
let cursor = 0;
// Inspect containers without decoding full-size pictures or loading them into the app.
await Promise.all(
  Array.from({ length: 8 }, async () => {
    while (cursor < pending.length) {
      const file = pending[cursor++];
      const entry = {
        file,
        extension: path.extname(file).slice(1).toLowerCase(),
        activeKeys: [...localAssets.get(file)].filter((key) => activeKeys.has(key)),
      };
      try {
        const stat = await fs.stat(file);
        entry.bytes = stat.size;
        if (stat.size > 0) {
          const meta = await sharp(file).metadata();
          Object.assign(entry, { width: meta.width, height: meta.height, format: meta.format });
        }
      } catch (error) {
        entry.error = error.message;
      }
      local.push({ ...entry, flags: imageHealthFlags(entry) });
    }
  })
);
local.sort((a, b) => a.file.localeCompare(b.file));
const countBy = (items, field) =>
  Object.fromEntries(
    [...new Set(items.map((row) => row[field]))]
      .sort()
      .map((value) => [value, items.filter((row) => row[field] === value).length])
  );
const summary = {
  generatedAt: new Date().toISOString(),
  inventoryCapturedAt: catalog.summary.inventoryCapturedAt,
  inventoryMode: catalog.summary.inventoryMode,
  runtimeUses: runtime.demands.length,
  additionalUses: additional.uses.length,
  actions: countBy(rows, "action"),
  sourceAssociationsAlreadyRejected: reviews.bindings.filter((row) => row.status === "mismatch")
    .length,
  localCopiesInspected: local.length,
  localCopiesWithoutTechnicalFlags: local.filter((row) => row.flags.length === 0).length,
  localFlags: countBy(
    local.flatMap((row) => row.flags.map((flag) => ({ flag }))),
    "flag"
  ),
  generationApproved: decisions.decisions.filter((row) => row.decision === "generate").length,
  activeLocalCopiesInspected: local.filter((row) => row.activeKeys.length).length,
  activeLocalFlags: countBy(
    local
      .filter((row) => row.activeKeys.length)
      .flatMap((row) => row.flags.map((flag) => ({ flag }))),
    "flag"
  ),
  finalRegenerationCount: null,
  r2Writes: 0,
  mappingChanges: 0,
  limitations: [
    "Local container metadata is not a full pixel decode, semantic review, or proof of served R2 bytes.",
    "Small images may be valid thumbnails; large images may be justified. Flags require display-context review.",
    "Keep decisions apply only to exact reviewed content/URL pairs; unreviewed assignments are not approved.",
    "Existing rejected source associations are excluded from the runtime and are counted separately.",
    "No unassigned use is automatically approved for generation; inspect existing art and learning purpose first.",
  ],
};
await fs.mkdir("output/image-quality", { recursive: true });
await fs.writeFile(
  "output/image-quality/checkup-summary.json",
  JSON.stringify(summary, null, 2) + "\n"
);
await fs.writeFile(
  "output/image-quality/local-image-health.json",
  JSON.stringify({ generatedAt: summary.generatedAt, local }, null, 2) + "\n"
);
await fs.writeFile(
  "output/image-quality/checkup.csv",
  csvText(rows, [
    "action",
    "unitId",
    "kind",
    "wordId",
    "text",
    "url",
    "semantic",
    "purpose",
    "referenceOnly",
    "candidateCount",
    "inventory",
    "byteEvidence",
    "visualReview",
    "revision",
  ])
);
await fs.writeFile(
  "output/image-quality/local-image-flags.csv",
  csvText(
    local.filter((row) => row.flags.length),
    ["file", "bytes", "width", "height", "format", "flags", "error", "activeKeys"]
  )
);
console.log(JSON.stringify(summary, null, 2));
