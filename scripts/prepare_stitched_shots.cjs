const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const images = {
    'alarm_clock': 'public/word-images/bedroom/alarm-clock.avif',
    'nightstand': 'public/word-images/bedroom/nightstand.avif',
    'lamp': 'public/word-images/bedroom/lamp.avif',
    'blanket': 'public/word-images/bedroom/blanket.avif',
    'wardrobe': 'public/word-images/bedroom/wardrobe.avif',
    'room_overview': 'public/scene-images/bedroom-hero.webp'
  };

  const outBase64 = {};

  for (const [key, relPath] of Object.entries(images)) {
    const fullPath = path.resolve(relPath);
    if (!fs.existsSync(fullPath)) {
      console.warn('File not found:', fullPath);
      continue;
    }
    // Convert to 1280x720 composite with dark cinematic background
    const buf = await sharp(fullPath)
      .resize(1280, 720, {
        fit: 'contain',
        background: { r: 15, g: 23, b: 42, alpha: 1 }
      })
      .webp({ quality: 85 })
      .toBuffer();

    outBase64[key] = buf.toString('base64');
    console.log(`Processed ${key}: ${buf.length} bytes`);
  }

  const outPath = 'C:/Users/AhmedMahdy/.gemini/antigravity/brain/fa27231b-e750-40da-82de-590decdb5a47/scratch/stitched_shots_base64.json';
  fs.writeFileSync(outPath, JSON.stringify(outBase64));
  console.log('Saved stitched_shots_base64.json successfully!');
}

main().catch(console.error);
