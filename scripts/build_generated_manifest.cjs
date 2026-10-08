const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const allScenes = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/all-usage-scenes-status.json', 'utf8')).items;
const sceneMap = new Map(allScenes.map(s => [s.sceneId, s]));

const dir = path.resolve('output/illustrations/generated');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.webp'));

async function buildManifest() {
  const items = [];
  for (const f of files) {
    const sceneId = f.replace('.webp', '');
    const meta = sceneMap.get(sceneId) || {};
    const webpPath = path.join(dir, f);
    const jpgPath = path.join(dir, `${sceneId}.jpg`);
    const stat = fs.statSync(webpPath);
    const imgInfo = await sharp(webpPath).metadata();

    items.push({
      sceneId,
      unitId: meta.unitId || sceneId.split('-')[0],
      lessonId: meta.lessonId || sceneId.replace(/-usage-scene-\d+$/, ''),
      expectedAnswer: meta.expectedAnswer || '',
      scenario: meta.scenario || '',
      targetWords: meta.targetWords || [],
      format: 'webp',
      width: imgInfo.width,
      height: imgInfo.height,
      bytes: stat.size,
      localWebp: `output/illustrations/generated/${f}`,
      localJpg: `output/illustrations/generated/${sceneId}.jpg`,
      reviewStatus: 'pending-visual-review',
      compliance: null
    });
  }

  const manifest = {
    createdDate: new Date().toISOString(),
    totalGenerated: items.length,
    totalBytesWebp: items.reduce((s, i) => s + i.bytes, 0),
    items
  };

  fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`Manifest created with ${items.length} items, total ${manifest.totalBytesWebp} bytes.`);
}

buildManifest().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
