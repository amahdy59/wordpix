import fs from "node:fs/promises";
import path from "node:path";
import { digest, csvText } from "./lib/media_catalog.mjs";
import { encodeResponsiveCandidate } from "./lib/responsive_image_candidate.mjs";

if (process.argv.length !== 2)
  throw Error("This preparation command has no upload or write-source mode");
const root = "output/media-followup-2026-10-30";
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const [health, catalog, reconciliation, additional] = await Promise.all([
  read("output/image-quality/local-image-health.json"),
  read("output/media-catalog/catalog.json"),
  read("output/media-catalog/visual-reconciliation.json"),
  read("output/media-catalog/additional-visual-coverage.json"),
]);
const byKey = new Map(catalog.assets.map((asset) => [asset.key, asset]));
const uses = [...reconciliation.demands, ...additional.uses];
const sources = new Map();
for (const local of health.local.filter(
  (row) => row.activeKeys.length && row.flags.includes("check-transfer-size")
)) {
  for (const key of local.activeKeys) {
    if (sources.has(key)) continue;
    const asset = byKey.get(key);
    if (!asset) throw Error(`Unknown source: ${key}`);
    sources.set(key, {
      key,
      url: asset.remoteListed ? asset.url : null,
      localFile: local.file,
      uses: uses.filter((use) => use.imageKey === key).map((use) => use.demandId ?? use.contentId),
    });
  }
}
const rows = [...sources.values()];
await fs.mkdir(`${root}/responsive`, { recursive: true });
const results = [];
let cursor = 0;
async function immutableWrite(file, bytes) {
  try {
    await fs.writeFile(file, bytes, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST" || digest(await fs.readFile(file)) !== digest(bytes)) throw error;
  }
}
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < rows.length) {
      const row = rows[cursor++];
      try {
        const localBytes = await fs.readFile(row.localFile);
        let bytes = localBytes;
        if (row.url) {
          const response = await fetch(row.url, { signal: AbortSignal.timeout(30000) });
          if (!response.ok) throw Error(`Public GET returned ${response.status}`);
          bytes = Buffer.from(await response.arrayBuffer());
        }
        const sourceSha256 = digest(bytes);
        const localSha256 = digest(localBytes);
        const variants = [];
        for (const size of [480, 960]) {
          const { encoded, ...variant } = await encodeResponsiveCandidate(bytes, size);
          const file = `${root}/responsive/${path.basename(variant.key)}`;
          await immutableWrite(file, encoded);
          variants.push({
            ...variant,
            file,
            sha256: digest(encoded),
            alreadyListedAtInventory: byKey.has(variant.key),
          });
        }
        results.push({
          ...row,
          sourceSha256,
          localSha256,
          localMatchesRemote: row.url ? sourceSha256 === localSha256 : null,
          sourceBytes: bytes.length,
          fetchedAt: new Date().toISOString(),
          sourceEvidence: row.url ? "public GET" : "local-only; remote serving not established",
          status: "encoded-awaiting-context-and-visual-approval",
          variants,
        });
      } catch (error) {
        results.push({ ...row, status: "held", error: error.message });
      }
      if (results.length % 25 === 0)
        console.log(`Prepared ${results.length}/${rows.length} sources`);
    }
  })
);
results.sort((a, b) => a.key.localeCompare(b.key));
const prepared = results.filter((row) => row.variants);
const summary = {
  generatedAt: new Date().toISOString(),
  inventoryCapturedAt: catalog.summary.inventoryCapturedAt,
  sources: results.length,
  prepared: prepared.length,
  held: results.length - prepared.length,
  remoteSourcesVerified: prepared.filter((row) => row.url).length,
  localOnlySources: prepared.filter((row) => !row.url).length,
  remoteSourceChanges: prepared.filter((row) => row.url && !row.localMatchesRemote).length,
  variants: prepared.reduce((sum, row) => sum + row.variants.length, 0),
  sourceBytes: prepared.reduce((sum, row) => sum + row.sourceBytes, 0),
  bytes480: prepared.reduce((sum, row) => sum + row.variants[0].bytes, 0),
  bytes960: prepared.reduce((sum, row) => sum + row.variants[1].bytes, 0),
  status: "local-candidates-only; context approval and scoped publication authorization required",
  r2Writes: 0,
  mappingChanges: 0,
};
await fs.writeFile(
  `${root}/responsive-candidates.json`,
  JSON.stringify({ summary, sources: results }, null, 2) + "\n"
);
await fs.writeFile(`${root}/responsive-summary.json`, JSON.stringify(summary, null, 2) + "\n");
await fs.writeFile(
  `${root}/responsive-candidates.csv`,
  csvText(
    results.flatMap(
      (row) =>
        row.variants?.map((variant) => ({
          sourceKey: row.key,
          sourceSha256: row.sourceSha256,
          sourceBytes: row.sourceBytes,
          ...variant,
          status: row.status,
        })) ?? [{ sourceKey: row.key, status: row.status, error: row.error }]
    ),
    [
      "sourceKey",
      "sourceSha256",
      "sourceBytes",
      "sizePreset",
      "width",
      "height",
      "bytes",
      "key",
      "sha256",
      "file",
      "status",
      "error",
    ]
  )
);
console.log(JSON.stringify(summary, null, 2));
if (summary.held) process.exitCode = 1;
