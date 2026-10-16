/**
 * Upload authentic scenario audio and subtitle files to Cloudflare R2.
 *
 * STRICTLY ADDITIVE: Uses putIfAbsent ('if-none-match: *') to ensure existing
 * R2 objects are never overwritten, modified, or deleted.
 *
 * Features:
 * - Concurrent uploads with configurable worker pool (default 25)
 * - Exponential backoff retry on transient network errors
 * - Progress indicator with elapsed time, throughput, and ETA
 * - CLI flags: --dry-run, --limit=<N>, --prefix=<unit-id>
 * - Post-upload HTTP verification check against public CDN
 */

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const SCENARIOS_DIR = path.join(ROOT, "assets", "audio", "scenarios");
const PUBLIC_BASE_URL = (process.env.VITE_ASSET_BASE_URL || "").replace(/\/+$/, "");

const DRY_RUN = process.argv.includes("--dry-run");
const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const LIMIT = limitArg ? parseInt(limitArg.split("=")[1], 10) : Infinity;
const prefixArg = process.argv.find((a) => a.startsWith("--prefix="));
const PREFIX_FILTER = prefixArg ? prefixArg.split("=")[1] : null;
const CONCURRENCY = parseInt(process.env.R2_CONCURRENCY || "25", 10);

function walkDirectory(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkDirectory(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".mp3":
      return "audio/mpeg";
    case ".vtt":
      return "text/vtt; charset=utf-8";
    case ".srt":
      return "text/plain; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}

async function withRetry(fn, attempts = 5) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i === attempts - 1) break;
      const delay = Math.min(1000 * 2 ** i, 10000);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

async function main() {
  console.log("=== WordPix Cloudflare R2 Scenario Audio Uploader ===");
  if (!fs.existsSync(SCENARIOS_DIR)) {
    console.error(`Error: Scenarios directory not found at ${SCENARIOS_DIR}`);
    process.exit(1);
  }

  const r2 = createClient();
  await r2.verify();
  console.log("✓ R2 connectivity and credentials verified successfully.");

  console.log("Scanning scenario assets...");
  const allAbsolutePaths = walkDirectory(SCENARIOS_DIR);
  let filesToProcess = allAbsolutePaths.map((absPath) => {
    // Relative to workspace root, using forward slashes: assets/audio/scenarios/...
    const relativeKey = path.relative(ROOT, absPath).replace(/\\/g, "/");
    return {
      absPath,
      key: relativeKey,
      size: fs.statSync(absPath).size,
      contentType: getContentType(absPath),
    };
  });

  if (PREFIX_FILTER) {
    filesToProcess = filesToProcess.filter((f) => f.key.includes(PREFIX_FILTER));
    console.log(`Filter --prefix=${PREFIX_FILTER} active: ${filesToProcess.length} matching files.`);
  }

  if (Number.isFinite(LIMIT)) {
    filesToProcess = filesToProcess.slice(0, LIMIT);
    console.log(`Limit --limit=${LIMIT} active.`);
  }

  const totalFiles = filesToProcess.length;
  const totalBytes = filesToProcess.reduce((sum, f) => sum + f.size, 0);
  console.log(
    `Found ${totalFiles} files to sync (${(totalBytes / (1024 * 1024)).toFixed(2)} MB total).`
  );
  console.log(`Worker concurrency: ${CONCURRENCY}${DRY_RUN ? " [DRY-RUN MODE]" : ""}\n`);

  if (DRY_RUN) {
    console.log("Sample keys that would be uploaded:");
    for (const item of filesToProcess.slice(0, 10)) {
      console.log(`  -> ${item.key} (${item.contentType}, ${item.size} bytes)`);
    }
    console.log(`\n[DRY RUN] Would process ${totalFiles} files.`);
    return;
  }

  const startTime = Date.now();
  let completed = 0;
  let uploaded = 0;
  let skipped = 0;
  let uploadedBytes = 0;
  let cursor = 0;
  const failed = [];

  async function worker() {
    while (cursor < filesToProcess.length) {
      const item = filesToProcess[cursor++];
      try {
        const buffer = fs.readFileSync(item.absPath);
        const wasAdded = await withRetry(() =>
          r2.putIfAbsent(item.key, buffer, { contentType: item.contentType })
        );

        if (wasAdded) {
          uploaded++;
          uploadedBytes += item.size;
        } else {
          skipped++;
        }
      } catch (err) {
        failed.push({ key: item.key, error: err.message });
      } finally {
        completed++;
        if (completed % 50 === 0 || completed === totalFiles) {
          const elapsedSec = (Date.now() - startTime) / 1000;
          const pct = ((completed / totalFiles) * 100).toFixed(1);
          const rateMb = (uploadedBytes / (1024 * 1024) / Math.max(elapsedSec, 0.1)).toFixed(2);
          const remainingItems = totalFiles - completed;
          const itemsPerSec = completed / Math.max(elapsedSec, 0.1);
          const etaSec = Math.round(remainingItems / Math.max(itemsPerSec, 0.01));
          process.stdout.write(
            `\rProgress: [${completed}/${totalFiles}] ${pct}% | +${uploaded} uploaded, ${skipped} skipped, ${failed.length} err | ${rateMb} MB/s | ETA: ${etaSec}s   `
          );
        }
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, filesToProcess.length) }, () => worker())
  );

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n\n=== SYNC COMPLETED in ${durationSec}s ===`);
  console.log(`Total processed : ${totalFiles}`);
  console.log(`Newly uploaded  : ${uploaded} (${(uploadedBytes / (1024 * 1024)).toFixed(2)} MB)`);
  console.log(`Already in R2   : ${skipped}`);
  console.log(`Failed          : ${failed.length}`);

  if (failed.length > 0) {
    console.error("\nFailures occurred for the following items:");
    for (const f of failed.slice(0, 20)) {
      console.error(`  - ${f.key}: ${f.error}`);
    }
    if (failed.length > 20) console.error(`  ... and ${failed.length - 20} more`);
    process.exit(1);
  }

  // Verification step: Probe random uploaded keys via HTTP
  if (PUBLIC_BASE_URL && uploaded > 0) {
    console.log(`\nVerifying live CDN resolution via ${PUBLIC_BASE_URL}...`);
    const samples = filesToProcess
      .filter((f) => f.key.endsWith(".mp3"))
      .slice(0, 5)
      .map((f) => f.key);

    let verifyPassed = 0;
    for (const sampleKey of samples) {
      const url = `${PUBLIC_BASE_URL}/${sampleKey}`;
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok) {
          console.log(`  ✓ HTTP ${res.status}: ${url}`);
          verifyPassed++;
        } else {
          console.warn(`  ✗ HTTP ${res.status}: ${url}`);
        }
      } catch (e) {
        console.warn(`  ✗ Error probing ${url}: ${e.message}`);
      }
    }
    console.log(`Verification: ${verifyPassed}/${samples.length} CDN probes successful.`);
  }
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
