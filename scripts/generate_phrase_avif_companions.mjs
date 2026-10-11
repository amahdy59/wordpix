import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PHRASE_DIR = path.resolve("public/phrase-images");
const files = fs.readdirSync(PHRASE_DIR).filter((f) => f.endsWith(".webp"));

console.log(`Found ${files.length} WebP phrase images in ${PHRASE_DIR}`);

let converted = 0;
let alreadyExisted = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const webpPath = path.join(PHRASE_DIR, file);
  const avifPath = path.join(PHRASE_DIR, file.replace(/\.webp$/, ".avif"));

  if (fs.existsSync(avifPath) && fs.statSync(avifPath).size > 2000) {
    alreadyExisted++;
    continue;
  }

  const webpBuffer = fs.readFileSync(webpPath);
  const avifBuffer = await sharp(webpBuffer)
    .resize(1024, 768, { fit: "cover" })
    .avif({ quality: 80, effort: 4 })
    .toBuffer();

  fs.writeFileSync(avifPath, avifBuffer);
  converted++;

  if (converted % 25 === 0 || i === files.length - 1) {
    console.log(`Progress: ${converted + alreadyExisted}/${files.length} (converted ${converted}, skipped ${alreadyExisted})`);
  }
}

console.log(`\nDone! Converted: ${converted}, Already existed: ${alreadyExisted}, Total: ${files.length}`);
