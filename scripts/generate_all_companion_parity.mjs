import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

console.log("=== GENERATING DUAL-FORMAT ASSET COMPANIONS (ZERO API CALLS) ===");

// 1. Resolve pronunciation cat & fish
const pronDir = path.resolve("public/word-images/pronunciation");
if (!fs.existsSync(pronDir)) fs.mkdirSync(pronDir, { recursive: true });

const catSource = path.resolve("public/word-images/pet-shop/cat.avif");
const fishSource = path.resolve("public/word-images/pet-shop/fish.avif");

if (fs.existsSync(catSource)) {
  const catBuf = fs.readFileSync(catSource);
  await sharp(catBuf).webp({ quality: 85 }).toFile(path.join(pronDir, "cat.webp"));
  await sharp(catBuf).avif({ quality: 80 }).toFile(path.join(pronDir, "cat.avif"));
  console.log("Generated pronunciation/cat.webp and cat.avif");
}

if (fs.existsSync(fishSource)) {
  const fishBuf = fs.readFileSync(fishSource);
  await sharp(fishBuf).webp({ quality: 85 }).toFile(path.join(pronDir, "fish.webp"));
  await sharp(fishBuf).avif({ quality: 80 }).toFile(path.join(pronDir, "fish.avif"));
  console.log("Generated pronunciation/fish.webp and fish.avif");
}

// 2. Pronunciation AVIF companions for all WebP files
const pronFiles = fs.readdirSync(pronDir).filter(f => f.endsWith(".webp"));
let pronAvifCount = 0;
for (const file of pronFiles) {
  const avifPath = path.join(pronDir, file.replace(/\.webp$/, ".avif"));
  if (!fs.existsSync(avifPath) || fs.statSync(avifPath).size < 1000) {
    const buf = fs.readFileSync(path.join(pronDir, file));
    await sharp(buf).avif({ quality: 80, effort: 4 }).toFile(avifPath);
    pronAvifCount++;
  }
}
console.log(`Generated ${pronAvifCount} AVIF companions in public/word-images/pronunciation`);

// 3. Scene-images AVIF companions
const sceneDir = path.resolve("public/scene-images");
const sceneWebp = fs.readdirSync(sceneDir).filter(f => f.endsWith(".webp"));
let sceneAvifCount = 0;
for (const file of sceneWebp) {
  const avifPath = path.join(sceneDir, file.replace(/\.webp$/, ".avif"));
  if (!fs.existsSync(avifPath) || fs.statSync(avifPath).size < 1000) {
    try {
      const buf = fs.readFileSync(path.join(sceneDir, file));
      await sharp(buf).avif({ quality: 80, effort: 4 }).toFile(avifPath);
      sceneAvifCount++;
    } catch (e) {
      console.warn(`Failed to convert ${file}:`, e.message);
    }
  }
}
console.log(`Generated ${sceneAvifCount} AVIF companions in public/scene-images`);

// 4. Learning-scenes WebP companions
const learnDir = path.resolve("public/learning-scenes");
function getFilesRecursive(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results = results.concat(getFilesRecursive(full));
    else if (entry.isFile()) results.push(full);
  }
  return results;
}

const learnAvif = getFilesRecursive(learnDir).filter(f => f.endsWith(".avif"));
let learnWebpCount = 0;
for (const file of learnAvif) {
  const webpPath = file.replace(/\.avif$/, ".webp");
  if (!fs.existsSync(webpPath) || fs.statSync(webpPath).size < 1000) {
    try {
      const buf = fs.readFileSync(file);
      await sharp(buf).webp({ quality: 85, effort: 4 }).toFile(webpPath);
      learnWebpCount++;
    } catch (e) {
      console.warn(`Failed to convert ${file}:`, e.message);
    }
  }
}
console.log(`Generated ${learnWebpCount} WebP companions in public/learning-scenes`);

console.log("\nSummary of Generated Companion Assets:");
console.log(`- Pronunciation cat/fish: 4 files`);
console.log(`- Pronunciation AVIF: ${pronAvifCount} files`);
console.log(`- Scene-images AVIF: ${sceneAvifCount} files`);
console.log(`- Learning-scenes WebP: ${learnWebpCount} files`);
console.log(`Total new companion files: ${4 + pronAvifCount + sceneAvifCount + learnWebpCount}`);
