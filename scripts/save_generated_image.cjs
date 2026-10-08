const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const [,, srcPath, sceneId] = process.argv;
if (!srcPath || !sceneId) {
  console.error('Usage: node scripts/save_generated_image.cjs <srcPath> <sceneId>');
  process.exit(1);
}

const outDir = path.resolve('output/illustrations/generated');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const destJpg = path.join(outDir, `${sceneId}.jpg`);
const destWebp = path.join(outDir, `${sceneId}.webp`);

fs.copyFileSync(srcPath, destJpg);

sharp(srcPath)
  .resize(1024, 1024, { fit: 'cover' })
  .webp({ quality: 85, effort: 5 })
  .toFile(destWebp)
  .then(info => {
    console.log(`Successfully saved ${sceneId}:`, info);
  })
  .catch(err => {
    console.error('Error saving WebP:', err);
    process.exit(1);
  });
