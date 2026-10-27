import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { createClient } from "./lib/r2.cjs";

function parseEnv(source) {
  return Object.fromEntries(
    source
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/))
      .filter(Boolean)
      .map((match) => [match[1], match[2].replace(/^(['"])(.*)\1$/, "$2")])
  );
}

async function retry(fn, retries = 3, delay = 1000) {
  let lastErr;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  throw lastErr;
}

async function main() {
  console.log("=== WordPix Priority Sentence Images Ingestion ===");

  const localEnv = parseEnv(fs.readFileSync(".env.local", "utf8"));
  const env = { ...localEnv, ...process.env };
  const r2 = createClient(env);

  console.log("1. Verifying Cloudflare R2 connection...");
  await r2.verify();
  console.log("R2 connection verified successfully.");

  const mappingPath = "scripts/verified_mapping_83.json";
  const items = JSON.parse(fs.readFileSync(mappingPath, "utf8"));
  console.log(`Loaded ${items.length} items from ${mappingPath}.`);

  const FOLDER = "C:\\Users\\AhmedMahdy\\Downloads\\wordix-priority sentence images (3)";
  const MEDIA_MANIFEST_PATH = "src/app/generated/reviewedExactSentenceMedia.json";
  const exactMedia = JSON.parse(fs.readFileSync(MEDIA_MANIFEST_PATH, "utf8"));
  const initialKeyCount = Object.keys(exactMedia).length;
  console.log(`Existing reviewedExactSentenceMedia entries: ${initialKeyCount}`);

  let convertedCount = 0;
  let r2UploadedCount = 0;
  let r2AlreadyPresentCount = 0;

  const newEntries = {};

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const sourceFilePath = path.join(FOLDER, item.file);

    if (!fs.existsSync(sourceFilePath)) {
      throw new Error(`Source file missing: ${sourceFilePath}`);
    }

    const rawBuffer = fs.readFileSync(sourceFilePath);

    // 1. Convert to optimized WebP (max width 1264px, quality: 80, effort: 4)
    const webpBuffer = await sharp(rawBuffer)
      .resize({ width: 1264, withoutEnlargement: true })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();
    convertedCount++;

    const sha256 = crypto.createHash("sha256").update(webpBuffer).digest("hex");
    const relPath = `question-images/v2/${item.folderName}/${sha256}.webp`;
    const localWebpPath = path.join("public", relPath);

    // 2. Save locally
    fs.mkdirSync(path.dirname(localWebpPath), { recursive: true });
    fs.writeFileSync(localWebpPath, webpBuffer);

    // 3. Upload to Cloudflare R2 (putIfAbsent for strictly additive upload)
    const wasUploaded = await retry(() => r2.putIfAbsent(relPath, webpBuffer, { contentType: "image/webp" }));
    if (wasUploaded) {
      r2UploadedCount++;
    } else {
      r2AlreadyPresentCount++;
    }

    // Verify presence in R2
    const exists = await retry(() => r2.exists(relPath));
    if (!exists) {
      throw new Error(`R2 verification failed for uploaded object: ${relPath}`);
    }

    // 4. Manifest entry
    newEntries[item.folderName] = {
      wordId: item.wordId,
      sentence: item.sentence,
      imagePath: relPath,
      imageAlt: item.sentence,
    };

    // Store relPath in item for aliases
    item.relPath = relPath;

    if ((i + 1) % 10 === 0 || i === items.length - 1) {
      console.log(`[Progress] Processed ${i + 1} / ${items.length} (R2 Uploaded: ${r2UploadedCount}, Already Present: ${r2AlreadyPresentCount})`);
    }
  }

  // 5. Add helpful aliases so exercises finding either variation of the sentence resolve to this image
  console.log("Adding sentence aliases to manifest...");

  function addAlias(aliasKey, wordId, sentence, sourceItem) {
    newEntries[aliasKey] = {
      wordId,
      sentence,
      imagePath: sourceItem.relPath,
      imageAlt: sentence,
    };
  }

  const findItem = (wordId, check) => items.find(it => it.wordId === wordId && (!check || check(it)));

  const fireExt = findItem("fire-extinguisher");
  if (fireExt) {
    addAlias("sentence-3d-printer-lab-4-fire-extinguisher-during-tour", "fire-extinguisher", "During a safety tour, the instructor identifies a fire extinguisher beside the door.", fireExt);
  }

  const flag = findItem("flag");
  if (flag) {
    addAlias("sentence-fire-station-4-flag-outside-station", "flag", "Outside the station, a flag hangs from a pole as a symbol of the service or community.", flag);
  }

  const glueStick = findItem("glue-stick");
  if (glueStick) {
    addAlias("sentence-3d-printer-lab-2-glue-stick-craft-task", "glue-stick", "The designer moves the mouse to inspect a model in 3D software, then picks up the glue stick for a separate craft task.", glueStick);
  }

  const slot = findItem("slot");
  if (slot) {
    addAlias("sentence-post-office-1-slot-public-box", "slot", "He puts his outgoing letter through the narrow slot in the public box.", slot);
  }

  const towel = findItem("towel");
  if (towel) {
    addAlias("sentence-bathroom-2-towel-after-brushing", "towel", "Sami puts away his toothbrush and toothpaste after brushing. He dries his face with a towel.", towel);
  }

  const brushTeeth = findItem("brush-teeth");
  if (brushTeeth) {
    addAlias("sentence-bathroom-6-brush-teeth-before-breakfast", "brush-teeth", "I brush my teeth before breakfast.", brushTeeth);
    addAlias("sentence-bathroom-6-brush-teeth-before-bed", "brush-teeth", "I brush my teeth before bed.", brushTeeth);
  }

  const ginger = findItem("ginger");
  if (ginger) {
    addAlias("sentence-vegetables-1-ginger-he-grated", "ginger", "He grated fresh ginger into the soup.", ginger);
  }

  // Also update existing entries that matched exact sentences to point to the new high-res image
  for (const [key, entry] of Object.entries(exactMedia)) {
    const matched = items.find(it => it.wordId === entry.wordId && it.sentence === entry.sentence);
    if (matched) {
      console.log(`Updating existing entry ${key} (${entry.wordId}) imagePath to new asset: ${matched.relPath}`);
      exactMedia[key].imagePath = matched.relPath;
      exactMedia[key].imageAlt = matched.sentence;
    }
  }

  // Merge newly added entries into manifest
  const mergedMedia = {
    ...exactMedia,
    ...newEntries,
  };

  fs.writeFileSync(MEDIA_MANIFEST_PATH, JSON.stringify(mergedMedia, null, 2) + "\n");
  const finalKeyCount = Object.keys(mergedMedia).length;
  console.log(`Updated ${MEDIA_MANIFEST_PATH}. Initial keys: ${initialKeyCount}, Added: ${finalKeyCount - initialKeyCount}, Final keys: ${finalKeyCount}.`);

  console.log("\nAll 83 images converted, saved locally, uploaded to R2, and linked in reviewedExactSentenceMedia.json!");
}

main().catch((err) => {
  console.error("Fatal ingestion error:", err);
  process.exit(1);
});
