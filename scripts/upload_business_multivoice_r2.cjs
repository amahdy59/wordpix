/**
 * WordPix - Upload Multi-Voice Business Audio to Cloudflare R2
 *
 * Strict Non-Deletion Policy:
 * Only performs additive HEAD + PUT operations for missing files.
 * NEVER deletes or overwrites existing keys in R2 or local directories.
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

loadEnv();

const DIR = path.resolve("audio_backup/business-reading-multivoice-v4");

async function main() {
  if (!fs.existsSync(DIR)) {
    console.log("No multi-voice audio directory found at:", DIR);
    return;
  }

  const allFiles = fs.readdirSync(DIR);
  const targets = [];

  for (const file of allFiles) {
    if (file.endsWith(".mp3")) {
      const hash = file.replace(".mp3", "");
      targets.push({
        file,
        localPath: path.join(DIR, file),
        key: `audio/${hash.slice(0, 2)}/${hash}.mp3`,
        contentType: "audio/mpeg",
      });
    } else if (file.endsWith(".timing.json")) {
      const hash = file.replace(".timing.json", "");
      targets.push({
        file,
        localPath: path.join(DIR, file),
        key: `audio/${hash.slice(0, 2)}/${hash}.timing.json`,
        contentType: "application/json",
      });
    }
  }

  console.log(`Found ${targets.length} files to process in ${DIR}`);

  const r2 = createClient();
  const doUpload = process.argv.includes("--upload");

  let existing = 0;
  let missing = 0;
  let uploaded = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < targets.length) {
      const idx = cursor++;
      const target = targets[idx];
      const exists = await r2.head(target.key);
      if (exists) {
        existing++;
      } else {
        missing++;
        if (doUpload) {
          const body = fs.readFileSync(target.localPath);
          await r2.put(target.key, body, {
            "content-type": target.contentType,
            "cache-control": "public, max-age=31536000, immutable",
          });
          uploaded++;
          if (uploaded % 25 === 0) {
            console.log(`Progress: uploaded ${uploaded} missing files...`);
          }
        }
      }
    }
  }

  // 10 concurrent workers for fast networking
  await Promise.all(Array.from({ length: 10 }, () => worker()));

  console.log(
    JSON.stringify(
      {
        total: targets.length,
        alreadyInR2: existing,
        missingFromR2: missing,
        uploadedNow: uploaded,
        status: doUpload ? "Upload complete" : "Dry run complete (pass --upload to push to R2)",
      },
      null,
      2
    )
  );
}

main().catch((err) => {
  console.error("Upload error:", err.message);
  process.exitCode = 1;
});
