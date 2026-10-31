/** Only the exact approved batch; immutable creates and full public verification. */
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import sharp from "sharp";
const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { assertRecordingBucket } = require("./lib/recording_bucket.cjs");
if (process.argv.slice(2).some((arg) => arg !== "--execute"))
  throw Error("Only --execute is supported");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const raw = await fs.readFile("docs/media/SUPPLIED_IMAGE_BATCH_2026-10-30.json");
const batch = JSON.parse(raw);
const approval = JSON.parse(
  await fs.readFile("docs/media/APPROVED_SUPPLIED_IMAGES_2026-10-30.json", "utf8")
);
if (
  approval.status !== "approved-by-user" ||
  approval.batchSha256 !== sha(raw) ||
  batch.files.length !== 68 ||
  batch.bindings.length !== 34 ||
  JSON.stringify(approval.keys) !== JSON.stringify(batch.files.map((file) => file.key))
)
  throw Error("Changed or unapproved image batch");
const base = "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/";
const approvedUrls = new Set(batch.files.map((file) => base + file.key));
for (const row of batch.bindings) {
  if (
    !["sentence", "scene"].includes(row.kind) ||
    !row.text ||
    !row.lessonId ||
    !row.wordId ||
    !row.imageAlt ||
    row.imagePurpose !== "word-reference" ||
    !approvedUrls.has(row.imagePath) ||
    row.responsiveSources.some((source) => !approvedUrls.has(source.url))
  )
    throw Error("Invalid exact-context binding");
}
const uploads = [];
for (const file of batch.files) {
  if (
    !/^question-images\/v2\/supplied-20261030\/[a-f0-9]{64}\.webp$/.test(file.key) ||
    !file.key.endsWith(file.sha256 + ".webp") ||
    !file.file.startsWith("output/required-images-2026-10-30/prepared/")
  )
    throw Error("Unexpected image key or file");
  const data = await fs.readFile(file.file);
  const meta = await sharp(data).metadata();
  if (
    sha(data) !== file.sha256 ||
    data.length !== file.bytes ||
    meta.format !== "webp" ||
    meta.width !== file.width ||
    meta.height !== file.height
  )
    throw Error("Prepared image changed");
  await sharp(data).raw().toBuffer();
  uploads.push({ ...file, data });
}
console.log(
  `Validated 68 files for 34 approved contexts; mode=${process.argv.includes("--execute") ? "execute" : "dry-run"}`
);
if (!process.argv.includes("--execute")) process.exit(0);
if (process.env.WORDPIX_READ_ONLY_MEDIA === "1")
  throw Error("Publication is disabled while WORDPIX_READ_ONLY_MEDIA=1");
loadEnv();
const client = createClient(process.env, { requestTimeoutMs: 60000 });
await assertRecordingBucket(client);
const receipts = [];
for (const file of uploads) {
  const created = await client.putIfAbsent(file.key, file.data, {
    contentType: "image/webp",
    verifyChecksum: true,
  });
  const head = await client.head(file.key);
  const response = await fetch(base + file.key, {
    headers: { Origin: "https://amahdy59.github.io" },
    signal: AbortSignal.timeout(60000),
  });
  if (
    Number(head?.["content-length"]) !== file.bytes ||
    sha(await client.get(file.key)) !== file.sha256 ||
    !response.ok ||
    !["*", "https://amahdy59.github.io"].includes(
      response.headers.get("access-control-allow-origin")
    ) ||
    sha(Buffer.from(await response.arrayBuffer())) !== file.sha256
  )
    throw Error("Public image verification failed: " + file.key);
  receipts.push({
    key: file.key,
    sha256: file.sha256,
    bytes: file.bytes,
    created,
    checksumVerified: true,
    corsVerified: true,
    verifiedAt: new Date().toISOString(),
  });
  await fs.writeFile(
    "docs/media/PUBLISHED_SUPPLIED_IMAGE_RECEIPT_2026-10-30.json",
    JSON.stringify(
      {
        schemaVersion: 1,
        batchSha256: approval.batchSha256,
        expectedFiles: 68,
        verifiedFiles: receipts.length,
        receipts,
      },
      null,
      2
    ) + "\n"
  );
  console.log(`Verified ${receipts.length}/68`);
}
await fs.writeFile(
  "src/app/generated/suppliedMedia.json",
  JSON.stringify(batch.bindings, null, 2) + "\n"
);
console.log("Activated 34 exact display contexts; historical objects and mappings retained.");
