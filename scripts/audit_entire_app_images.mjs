import fs from "node:fs";
import path from "node:path";

console.log("=== COMPREHENSIVE WORDPIX IMAGE AUDIT ===");

const allImageReferences = new Map(); // path -> Array<{ source, context }>

function recordImage(imgUrl, source, context = "") {
  if (!imgUrl || typeof imgUrl !== "string") return;
  let cleanUrl = imgUrl.trim();
  if (!allImageReferences.has(cleanUrl)) {
    allImageReferences.set(cleanUrl, []);
  }
  allImageReferences.get(cleanUrl).push({ source, context });
}

// 1. Audit Usage JSON files (865 lessons, exercises, scenes)
const usageDir = "src/app/data/usage";
if (fs.existsSync(usageDir)) {
  const usageFiles = fs.readdirSync(usageDir).filter(f => f.endsWith(".usage.json"));
  for (const file of usageFiles) {
    try {
      const data = JSON.parse(fs.readFileSync(path.join(usageDir, file), "utf8"));
      function findImages(obj, fileContext) {
        if (!obj || typeof obj !== "object") return;
        if (Array.isArray(obj)) {
          for (const item of obj) findImages(item, fileContext);
          return;
        }
        for (const [key, val] of Object.entries(obj)) {
          if (typeof val === "string" && (val.endsWith(".webp") || val.endsWith(".avif") || val.endsWith(".png") || val.endsWith(".jpg"))) {
            recordImage(val, fileContext, key);
          } else if (typeof val === "object") {
            findImages(val, fileContext);
          }
        }
      }
      findImages(data, `usage/${file}`);
    } catch (e) {
      console.error(`Error reading ${file}:`, e.message);
    }
  }
}

// 2. Audit Phrase JSON files
const phraseDir = "src/app/data/usagePhrases";
if (fs.existsSync(phraseDir)) {
  const phraseFiles = fs.readdirSync(phraseDir).filter(f => f.endsWith(".phrases.json"));
  for (const file of phraseFiles) {
    const data = JSON.parse(fs.readFileSync(path.join(phraseDir, file), "utf8"));
    for (const item of data) {
      if (item.imagePath) {
        recordImage(item.imagePath, `phrase/${file}`, item.phrase);
      }
    }
  }
}

// 3. Audit courseCatalog and curriculum data
const tsFiles = [
  "src/app/data/courseCatalog.ts",
  "src/app/data/curriculumSequence.ts",
  "src/app/data/lexiconDictionary.ts",
  "src/app/data/unique_words.json",
  "src/app/data/all_words.json",
  "src/app/data/reviewedUsageIllustrations.ts",
  "src/app/learning/foundations/pronunciationLesson1.ts",
];

for (const tsFile of tsFiles) {
  if (fs.existsSync(tsFile)) {
    const content = fs.readFileSync(tsFile, "utf8");
    const matches = content.matchAll(/["']([^"']+\.(?:webp|avif|png|jpg|jpeg))["']/gi);
    for (const m of matches) {
      recordImage(m[1], tsFile, "string-match");
    }
  }
}

// Verify disk / R2 resolution
let localMissingCount = 0;
const missingItems = [];
const existingItems = [];

for (const [imgRef, sources] of allImageReferences.entries()) {
  let localPath = imgRef;
  if (localPath.startsWith("http://") || localPath.startsWith("https://")) {
    const urlObj = new URL(localPath);
    localPath = urlObj.pathname;
  }
  if (localPath.startsWith("./")) {
    localPath = localPath.slice(2);
  }
  if (localPath.startsWith("/")) {
    localPath = localPath.slice(1);
  }
  if (localPath.startsWith("images/v1/")) {
    localPath = localPath.replace("images/v1/", "");
  } else if (localPath.startsWith("images/")) {
    localPath = localPath.replace("images/", "");
  }

  // Shopping-mall pilot scenes are served directly from Cloudflare R2
  if (/^learning-scenes\/shopping-mall\/shopping-mall-[12]-scene-[1-5]\.avif$/.test(localPath)) {
    existingItems.push(imgRef);
    continue;
  }

  // Candidates
  const candidatePaths = [
    path.resolve("public", localPath),
    path.resolve("public/images", localPath),
    path.resolve("public/word-images/pronunciation", localPath),
    path.resolve(localPath)
  ];

  const found = candidatePaths.some(p => fs.existsSync(p));
  if (!found) {
    localMissingCount++;
    missingItems.push({ imgRef, sources: sources.slice(0, 3) });
  } else {
    existingItems.push(imgRef);
  }
}

console.log(`\nResults:`);
console.log(`- Verified assets: ${existingItems.length}`);
console.log(`- Missing locally: ${localMissingCount}`);

if (localMissingCount > 0) {
  console.log("\n--- MISSING IMAGES BREAKDOWN ---");
  for (const m of missingItems) {
    console.log(`MISSING: ${m.imgRef}`);
    for (const s of m.sources) {
      console.log(`  Source: ${s.source} (${s.context})`);
    }
  }
} else {
  console.log("\n🎉 PERFECT: Zero missing image files across all scanned application content!");
}
