import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

async function updateHeroAvifs() {
  const dir = path.resolve("public/scene-images");
  const files = fs.readdirSync(dir).filter(f => f.endsWith("-hero.webp"));
  let updated = 0;

  for (const f of files) {
    const avifName = f.replace(".webp", ".avif");
    const avifPath = path.join(dir, avifName);
    const webpPath = path.join(dir, f);

    const stat = fs.existsSync(avifPath) ? fs.statSync(avifPath) : null;
    // If missing, or if it is one of the blank placeholder files (568 or 1566 bytes)
    if (!stat || stat.size === 1566 || stat.size === 568) {
      const buffer = await sharp(webpPath).avif({ quality: 80 }).toBuffer();
      fs.writeFileSync(avifPath, buffer);
      console.log(`[UPDATED] ${avifName} (${buffer.length} bytes) from ${f}`);
      updated++;
    }
  }

  console.log(`\nUpdated ${updated} hero AVIF files from newly generated WebP assets.`);
}

updateHeroAvifs().catch(console.error);
