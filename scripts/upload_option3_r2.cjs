/**
 * Upload Option 3 generated audio clips to Cloudflare R2
 * Strictly Additive - Never deletes or overwrites existing objects.
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const DIR = path.join(ROOT, "audio_backup", "option3-par-v25");

async function mapConcurrent(items, concurrency, fn) {
  let index = 0;
  const results = new Array(items.length);
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

async function main() {
  const r2 = createClient();
  await r2.verify();
  console.log("R2 bucket verified.");

  if (!fs.existsSync(DIR)) {
    console.error(`Directory not found: ${DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mp3"));
  console.log(`Found ${files.length} audio clips in ${DIR}`);

  let uploaded = 0;
  let skipped = 0;
  let errors = 0;

  console.log("Uploading clips to Cloudflare R2 with concurrency 20...");
  await mapConcurrent(files, 20, async (f) => {
    const hash = f.replace(".mp3", "");
    const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    const filePath = path.join(DIR, f);
    const buf = fs.readFileSync(filePath);

    try {
      const added = await r2.putIfAbsent(key, buf, { contentType: "audio/mpeg" });
      if (added) uploaded++;
      else skipped++;
    } catch (err) {
      errors++;
      console.error(`Error uploading ${key}: ${err.message}`);
    }
  });

  console.log(`\n=== UPLOAD SUMMARY ===`);
  console.log(`Total files: ${files.length}`);
  console.log(`Newly uploaded: ${uploaded}`);
  console.log(`Already present in R2: ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
