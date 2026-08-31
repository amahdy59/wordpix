/**
 * Uploads public image assets to R2 under a versioned, immutable prefix.
 *
 * Re-running is safe: existing keys are skipped with HEAD before upload.
 * Requires the R2_* values in .env.local.
 *
 * Usage:
 *   pnpm assets:upload --dry-run
 *   pnpm assets:upload
 *   pnpm assets:upload --force  (replace existing R2 objects after an import)
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const IMAGE_PREFIX = "images/v1";
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force");
const CONCURRENCY = Number(process.env.R2_UPLOAD_CONCURRENCY || 4);

async function withRetry(operation, attempts = 5) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (attempt === attempts - 1) break;
      await new Promise((resolve) => setTimeout(resolve, 250 * 2 ** attempt));
    }
  }
  throw lastError;
}

const CONTENT_TYPES = {
  ".avif": "image/avif",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

function imageFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return imageFiles(fullPath);
    return CONTENT_TYPES[path.extname(entry.name).toLowerCase()] ? [fullPath] : [];
  });
}

async function main() {
  const files = imageFiles(PUBLIC);
  const bytes = files.reduce((total, file) => total + fs.statSync(file).size, 0);
  console.log(`images : ${files.length.toLocaleString()}`);
  console.log(`size   : ${(bytes / 1024 / 1024).toFixed(2)} MiB`);
  console.log(`prefix : ${IMAGE_PREFIX}/`);
  console.log(`mode   : ${FORCE ? "replace existing objects" : "skip existing objects"}`);

  if (DRY_RUN) {
    console.log("\n--dry-run: nothing uploaded.");
    return;
  }

  const r2 = createClient();
  await r2.verify();

  let cursor = 0;
  let uploaded = 0;
  let skipped = 0;

  async function worker() {
    while (cursor < files.length) {
      const file = files[cursor++];
      const relative = path.relative(PUBLIC, file).split(path.sep).join("/");
      const key = `${IMAGE_PREFIX}/${relative}`;

      if (!FORCE && (await withRetry(() => r2.exists(key)))) {
        skipped += 1;
        continue;
      }

      await withRetry(() => r2.put(key, fs.readFileSync(file), {
        contentType: CONTENT_TYPES[path.extname(file).toLowerCase()],
      }));
      uploaded += 1;

      if ((uploaded + skipped) % 100 === 0) {
        console.log(`processed ${uploaded + skipped}/${files.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\nuploaded: ${uploaded}`);
  console.log(`skipped : ${skipped}`);
}

main().catch((error) => {
  console.error(`\nAsset upload failed: ${error.message}`);
  process.exitCode = 1;
});
