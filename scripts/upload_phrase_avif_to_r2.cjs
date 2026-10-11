const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const PHRASE_DIR = path.join(ROOT, "public/phrase-images");
const DRY_RUN = process.argv.includes("--dry-run");

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

async function uploadPhraseAvifFiles() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 connection verified.");

  const files = fs.readdirSync(PHRASE_DIR).filter((f) => f.endsWith(".avif"));
  console.log(`Found ${files.length} AVIF phrase files to inspect for R2 synchronization.`);

  let uploaded = 0;
  let alreadyExisted = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const localPath = path.join(PHRASE_DIR, file);
    const objectKey = `images/v1/phrase-images/${file}`;

    const exists = await withRetry(() => r2.exists(objectKey));
    if (exists) {
      alreadyExisted++;
      continue;
    }

    if (DRY_RUN) {
      console.log(`[DRY-RUN] Would upload: ${objectKey}`);
      uploaded++;
      continue;
    }

    const buffer = fs.readFileSync(localPath);
    await withRetry(() =>
      r2.put(objectKey, buffer, { contentType: "image/avif" })
    );
    uploaded++;
    if (uploaded % 25 === 0) {
      console.log(`Uploaded ${uploaded} AVIF files to R2...`);
    }
  }

  console.log(`\n=== Phrase AVIF R2 Upload Complete ===`);
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Already existed: ${alreadyExisted}`);
  console.log(`Total inspected: ${files.length}`);
}

uploadPhraseAvifFiles().catch((err) => {
  console.error("Upload error:", err);
  process.exit(1);
});
