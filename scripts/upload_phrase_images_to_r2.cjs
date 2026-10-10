const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const PHRASE_IMAGES_DIR = path.join(ROOT, "public", "phrase-images");
const PREFIX = "images/v1/phrase-images";
const DRY_RUN = process.argv.includes("--dry-run");
const CONCURRENCY = 4;

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

async function main() {
  if (!fs.existsSync(PHRASE_IMAGES_DIR)) {
    throw new Error(`Directory ${PHRASE_IMAGES_DIR} does not exist.`);
  }

  const files = fs.readdirSync(PHRASE_IMAGES_DIR).filter((f) => f.endsWith(".webp"));
  console.log(`Found ${files.length} phrase images in public/phrase-images.`);
  console.log(`Target R2 prefix: ${PREFIX}/`);

  if (DRY_RUN) {
    console.log("--dry-run: exiting without uploading.");
    return;
  }

  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.");

  let cursor = 0;
  let uploaded = 0;
  let skipped = 0;

  async function worker() {
    while (cursor < files.length) {
      const filename = files[cursor++];
      const filePath = path.join(PHRASE_IMAGES_DIR, filename);
      const key = `${PREFIX}/${filename}`;

      try {
        const exists = await withRetry(() => r2.exists(key));
        if (exists) {
          skipped += 1;
          continue;
        }

        const buffer = fs.readFileSync(filePath);
        await withRetry(() =>
          r2.put(key, buffer, { contentType: "image/webp" })
        );
        uploaded += 1;

        if ((uploaded + skipped) % 25 === 0 || cursor === files.length) {
          console.log(`Progress: ${uploaded + skipped}/${files.length} (${uploaded} uploaded, ${skipped} skipped)`);
        }
      } catch (err) {
        console.error(`Failed to upload ${filename}:`, err.message);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`\nR2 Upload Finished: ${uploaded} uploaded, ${skipped} skipped (total ${files.length}).`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
