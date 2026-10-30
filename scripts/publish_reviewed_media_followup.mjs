import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import sharp from "sharp";

const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const execute = process.argv.includes("--execute");
if (process.argv.slice(2).some((arg) => arg !== "--execute"))
  throw Error("Only --execute is supported");
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const batchPath = "docs/media/PUBLICATION_REVIEW_BATCH_2026-10-30.json";
const batchBytes = await fs.readFile(batchPath);
const batch = JSON.parse(batchBytes);
const approval = await read("docs/media/ACCEPTED_MEDIA_REVIEW_2026-10-30.json");
if (approval.batchSha256 !== sha(batchBytes) || approval.status !== "approved-by-user")
  throw Error("Publication batch differs from the user-approved review");
if (
  batch.proposedNewFiles.length !== 12 ||
  batch.responsiveAssociations.length !== 6 ||
  batch.existingArtReuse.length !== 2
)
  throw Error("Unexpected publication scope");
const base = "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/";
const keyOf = (url) => {
  if (!url.startsWith(base)) throw Error("Unexpected asset host");
  return url.slice(base.length);
};
async function publicBytes(key) {
  const response = await fetch(base + key, {
    headers: { Origin: "https://amahdy59.github.io" },
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw Error(`Public GET failed: ${key} (${response.status})`);
  return Buffer.from(await response.arrayBuffer());
}
const registry = await read("src/app/generated/reviewedExactSentenceMedia.json");
const originals = new Map();
for (const row of batch.responsiveAssociations)
  originals.set(keyOf(row.originalUrl), row.originalSha256);
for (const row of batch.existingArtReuse) {
  originals.set(keyOf(row.content.expectedResolvedUrl), row.originalImageSha256);
  originals.set(row.key, row.assetSha256);
}
for (const row of [
  ...batch.responsiveAssociations,
  ...batch.existingArtReuse.map((item) => ({
    wordId: item.content.wordId,
    sentence: item.content.text,
    originalUrl: item.content.expectedResolvedUrl,
  })),
]) {
  const existing = Object.values(registry).find(
    (item) => item.wordId === row.wordId && item.sentence === row.sentence
  );
  if (
    !existing ||
    (existing.imagePath !== row.originalUrl && existing.imagePath !== keyOf(row.originalUrl))
  )
    throw Error(`Stale original assignment: ${row.wordId}`);
}
const uploads = [];
for (const item of batch.proposedNewFiles) {
  const bytes = await fs.readFile(item.file);
  if (
    bytes.length !== item.bytes ||
    sha(bytes) !== item.sha256 ||
    !item.key.endsWith(`${item.sha256}.webp`) ||
    !/^question-images\/v2\/responsive-(480|960)\/[a-f0-9]{64}\.webp$/.test(item.key)
  )
    throw Error("Invalid proposed image: " + item.key);
  const metadata = await sharp(bytes).metadata();
  if (
    metadata.width !== item.width ||
    metadata.height !== item.height ||
    metadata.format !== "webp"
  )
    throw Error("Changed image dimensions");
  await sharp(bytes).raw().toBuffer();
  uploads.push({ ...item, data: bytes });
}
for (const [key, expected] of originals)
  if (sha(await publicBytes(key)) !== expected)
    throw Error("Reviewed public source changed: " + key);
console.log(
  `Validated approved batch: ${uploads.length} new images, 6 responsive contexts, 2 reuse contexts; mode=${execute ? "execute" : "dry-run"}`
);
if (!execute) process.exit(0);
loadEnv();
const client = createClient();
// Prove this credential's bucket contains the same reviewed original bytes as
// the public endpoint before permitting any create-only write.
const [proofKey, proofSha] = originals.entries().next().value;
if (sha(await client.get(proofKey)) !== proofSha)
  throw Error("Credential bucket differs from reviewed public assets");
const receipts = [];
for (const item of uploads) {
  const created = await client.putIfAbsent(item.key, item.data, {
    contentType: "image/webp",
    verifyChecksum: true,
  });
  const head = await client.head(item.key);
  if (
    Number(head?.["content-length"]) !== item.bytes ||
    sha(await client.get(item.key)) !== item.sha256 ||
    sha(await publicBytes(item.key)) !== item.sha256
  )
    throw Error("Uploaded image verification failed: " + item.key);
  receipts.push({
    key: item.key,
    sha256: item.sha256,
    bytes: item.bytes,
    created,
    verifiedAt: new Date().toISOString(),
  });
  await fs.writeFile(
    "docs/media/PUBLISHED_MEDIA_RECEIPT_2026-10-30.json",
    JSON.stringify(
      {
        batchSha256: approval.batchSha256,
        receipts,
        originalObjectsPreserved: true,
        mappingsApplied: false,
      },
      null,
      2
    ) + "\n"
  );
  console.log(`${created ? "Created" : "Reused identical"} verified image: ${item.key}`);
}
console.log(
  "All approved image bytes verified through authenticated and public GETs. No originals changed."
);
