/**
 * Upload HeyGen Batch audio to Cloudflare R2 and update app additionalRecordings shards.
 * Strictly create-only (putIfAbsent). Never overwrites existing R2 objects or ElevenLabs mappings.
 *
 * Usage:
 *   node scripts/publish_heygen_batch.cjs --batch=batch-02
 */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

const ROOT = path.resolve(__dirname, "..");
const HEYGEN_DIR = path.join(ROOT, "output/recorded-audio/heygen");
const SHARDS_DIR = path.join(ROOT, "src/app/generated/additionalRecordings");
const HEYGEN_KEY_PREFIX = "audio/heygen-v1/nadine";

function normalizeRecordingText(text) {
  return String(text)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function computeAdditionalId(text, language = "en") {
  const lang = language.toLowerCase().startsWith("ar") ? "ar" : "en";
  const payload = `${lang}\0${normalizeRecordingText(text)}`;
  return crypto.createHash("sha256").update(payload, "utf8").digest("hex");
}

function resolveResultsFile(batchId) {
  if (batchId.endsWith(".json")) {
    const direct = path.join(HEYGEN_DIR, batchId);
    if (fs.existsSync(direct)) return direct;
  }
  const files = fs.readdirSync(HEYGEN_DIR).filter(
    (f) => f.startsWith(batchId) && f.endsWith("-heygen-results.json")
  );
  if (files.length > 0) {
    return path.join(HEYGEN_DIR, files[0]);
  }
  throw new Error(`Could not find HeyGen results for batch: ${batchId}`);
}

async function main() {
  const batchArg =
    process.argv.find((a) => a.startsWith("--batch="))?.slice(8) || "batch-02";
  const resultsFile = resolveResultsFile(batchArg);
  console.log(`Using results file: ${resultsFile}`);

  loadEnv();
  const client = createClient(process.env, { requestTimeoutMs: 30000 });

  const items = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
  console.log(`Loaded ${items.length} HeyGen items from ${path.basename(resultsFile)} to publish.`);

  // 1. Prepare upload queue
  const queue = [];
  for (const item of items) {
    const textHash = crypto.createHash("sha256").update(item.text, "utf8").digest("hex");
    const r2Key = `${HEYGEN_KEY_PREFIX}/${textHash}.mp3`;
    const localMp3 = item.heygenMp3Path;
    if (!fs.existsSync(localMp3)) {
      throw new Error(`Local MP3 missing: ${localMp3}`);
    }
    queue.push({
      text: item.text,
      textHash,
      r2Key,
      localMp3,
      sources: item.sources || [],
    });
  }

  console.log(`Starting create-only R2 upload (concurrency: 8)...`);
  const concurrency = 8;
  let nextIdx = 0;
  let createdCount = 0;
  let alreadyCount = 0;
  let errorCount = 0;

  async function worker() {
    while (nextIdx < queue.length) {
      const idx = nextIdx++;
      const item = queue[idx];
      const buffer = fs.readFileSync(item.localMp3);
      try {
        const created = await client.putIfAbsent(item.r2Key, buffer, {
          contentType: "audio/mpeg",
        });
        if (created) {
          createdCount++;
        } else {
          alreadyCount++;
        }
        if ((idx + 1) % 100 === 0 || idx + 1 === queue.length) {
          console.log(
            `  Progress: ${idx + 1}/${queue.length} (created: ${createdCount}, already existed: ${alreadyCount})`
          );
        }
      } catch (err) {
        console.error(`  Error uploading ${item.r2Key}:`, err.message);
        errorCount++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\nR2 Upload Finished:`);
  console.log(`  Newly created: ${createdCount}`);
  console.log(`  Already in R2 (unmodified): ${alreadyCount}`);
  console.log(`  Errors: ${errorCount}`);

  if (errorCount > 0) {
    throw new Error(`Encountered ${errorCount} upload errors. Aborting shard mapping.`);
  }

  // 2. Update additionalRecordings shards
  console.log(`\nUpdating app additionalRecordings shards...`);
  const shardUpdates = new Map(); // prefix -> { path, data }

  let preservedCount = 0;
  let newMappingsCount = 0;

  for (const item of queue) {
    const entryId = computeAdditionalId(item.text, "en");
    const prefix = entryId.slice(0, 2);

    if (!shardUpdates.has(prefix)) {
      const shardPath = path.join(SHARDS_DIR, `${prefix}.json`);
      const existing = fs.existsSync(shardPath)
        ? JSON.parse(fs.readFileSync(shardPath, "utf8"))
        : {};
      shardUpdates.set(prefix, { path: shardPath, data: existing });
    }

    const shard = shardUpdates.get(prefix);
    if (shard.data[entryId]) {
      // PRESERVE existing take (e.g. ElevenLabs)
      preservedCount++;
    } else {
      shard.data[entryId] = item.r2Key;
      newMappingsCount++;
    }
  }

  console.log(`  New HeyGen mappings to write: ${newMappingsCount}`);
  console.log(`  Preserved existing takes: ${preservedCount}`);

  // Write updated shards with sorted keys
  for (const [, { path: shardPath, data }] of shardUpdates) {
    const sorted = Object.keys(data)
      .sort()
      .reduce((acc, k) => {
        acc[k] = data[k];
        return acc;
      }, {});
    fs.writeFileSync(shardPath, JSON.stringify(sorted, null, 2) + "\n", "utf8");
  }

  console.log(`[+] Successfully updated ${shardUpdates.size} shard files in ${SHARDS_DIR}`);

  // 3. Write summary receipt
  const receiptPath = path.join(HEYGEN_DIR, `${batchArg}-publish-receipt.json`);
  fs.writeFileSync(
    receiptPath,
    JSON.stringify(
      {
        publishedAt: new Date().toISOString(),
        batch: batchArg,
        totalItems: queue.length,
        createdR2Objects: createdCount,
        alreadyInR2: alreadyCount,
        newMappings: newMappingsCount,
        preservedMappings: preservedCount,
        namespace: HEYGEN_KEY_PREFIX,
      },
      null,
      2
    ) + "\n",
    "utf8"
  );
  console.log(`[+] Publish receipt written: ${receiptPath}`);
}

main().catch((err) => {
  console.error("Publish failed:", err);
  process.exit(1);
});
