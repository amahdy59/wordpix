/** Explicit approval, exactly eight immutable objects; no replacement or deletion. */
import fs from "node:fs/promises";
import crypto from "node:crypto";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { assertRecordingBucket } = require("./lib/recording_bucket.cjs");
const { validateRecording } = require("./lib/recorded_audio_key.cjs");
if (process.argv.slice(2).some((arg) => arg !== "--execute"))
  throw Error("Only --execute is supported");
const sha = (bytes) => crypto.createHash("sha256").update(bytes).digest("hex");
const batch = JSON.parse(
  await fs.readFile("docs/media/APPROVED_HUMIDITY_REPAIR_2026-10-30.json", "utf8")
);
const draft = await fs.readFile(
  "output/content-repair-2026-10-30/humidity-migration/jungle.usage.proposed.json"
);
if (
  batch.status !== "approved-by-user" ||
  batch.files.length !== 8 ||
  new Set(batch.files.map((item) => item.key)).size !== 8 ||
  batch.replacements !== 5 ||
  sha(draft) !== batch.draftSha256
)
  throw Error("Changed or unapproved publication batch");
const source = await fs.readFile(batch.source, "utf8");
if (
  sha(source) !== batch.originalSha256 &&
  JSON.stringify(JSON.parse(source)) !== JSON.stringify(JSON.parse(draft))
)
  throw Error("Source changed since approval");
const uploads = [];
for (const item of batch.files) {
  validateRecording({ text: item.text, language: "en", edgeKey: item.key });
  if (!item.file.startsWith("output/content-repair-2026-10-30/humidity-migration/recordings/"))
    throw Error("Unexpected recording path");
  const data = await fs.readFile(item.file);
  if (
    data.length !== item.bytes ||
    data.length <= 512 ||
    sha(data) !== item.sha256 ||
    item.durationSeconds <= 0
  )
    throw Error("Changed or invalid recording");
  uploads.push({ ...item, data, md5: crypto.createHash("md5").update(data).digest("hex") });
}
console.log(
  `Validated ${uploads.length} approved recordings; mode=${process.argv.includes("--execute") ? "execute" : "dry-run"}`
);
if (!process.argv.includes("--execute")) process.exit(0);
loadEnv();
const client = createClient(process.env, { requestTimeoutMs: 60000 });
await assertRecordingBucket(client);
const base = "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/";
const receipts = [];
for (const item of uploads) {
  const created = await client.putIfAbsent(item.key, item.data, {
    contentType: "audio/mpeg",
    verifyChecksum: true,
  });
  const head = await client.head(item.key);
  const response = await fetch(base + item.key, {
    headers: { Origin: "https://amahdy59.github.io" },
    signal: AbortSignal.timeout(60000),
  });
  const cors = response.headers.get("access-control-allow-origin");
  if (
    Number(head?.["content-length"]) !== item.bytes ||
    head?.etag?.replaceAll('"', "") !== item.md5 ||
    sha(await client.get(item.key)) !== item.sha256 ||
    !response.ok ||
    !["*", "https://amahdy59.github.io"].includes(cors) ||
    sha(Buffer.from(await response.arrayBuffer())) !== item.sha256
  )
    throw Error("Remote verification failed: " + item.key);
  const receipt = {
    key: item.key,
    bytes: item.bytes,
    md5: item.md5,
    sha256: item.sha256,
    status: "verified",
    created,
    checksumVerified: true,
    corsVerified: true,
    verifiedAt: new Date().toISOString(),
  };
  receipts.push(receipt);
  await fs.writeFile(
    "docs/media/PUBLISHED_HUMIDITY_RECEIPT_2026-10-30.json",
    JSON.stringify(
      { schemaVersion: 1, approvedFiles: 8, verifiedFiles: receipts.length, receipts },
      null,
      2
    ) + "\n"
  );
  await fs.appendFile(
    "output/recorded-audio/upload-receipts.jsonl",
    JSON.stringify(receipt) + "\n"
  );
  console.log(`Verified ${receipts.length}/8`);
}
const current = await fs.readFile(batch.source, "utf8");
if (sha(current) === batch.originalSha256) {
  if (current.split(batch.oldText).length - 1 !== 5)
    throw Error("Unexpected source occurrence count");
  const updated = current.replaceAll(batch.oldText, batch.newText);
  if (JSON.stringify(JSON.parse(updated)) !== JSON.stringify(JSON.parse(draft)))
    throw Error("Draft differs from approved semantic change");
  await fs.writeFile(batch.source, updated);
} else if (!current.includes(batch.newText) || current.includes(batch.oldText))
  throw Error("Changed source; apply withheld");
console.log(
  "Eight immutable recordings verified; five linked text occurrences applied. Original objects retained."
);
