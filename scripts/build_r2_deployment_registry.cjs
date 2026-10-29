const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const manifestPath = 'output/illustrations/generated/manifest.json';
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));

// Build lookup map from pipeline
const pipelineLookup = {};
pipeline.batches.forEach(b => {
  b.items.forEach(item => {
    pipelineLookup[item.sceneId] = item;
  });
});

const generatedDir = path.resolve('output/illustrations/generated');
const registryEntries = [];

manifest.items.forEach(item => {
  const webpPath = path.join(generatedDir, `${item.sceneId}.webp`);
  const jpgPath = path.join(generatedDir, `${item.sceneId}.jpg`);

  if (!fs.existsSync(webpPath)) return;

  const webpBuffer = fs.readFileSync(webpPath);
  const sha256 = crypto.createHash('sha256').update(webpBuffer).digest('hex');

  const pItem = pipelineLookup[item.sceneId] || {};
  const sceneParts = item.sceneId.split('-usage-scene-');
  const lessonId = sceneParts[0];
  const chunkNumber = sceneParts[1] ? parseInt(sceneParts[1], 10) : 1;
  const unitId = pItem.unitId || lessonId.replace(/-\d+$/, '');

  const entry = {
    sceneId: item.sceneId,
    unitId: unitId,
    lessonId: lessonId,
    chunkNumber: chunkNumber,
    targetWord: pItem.expectedAnswer || pItem.targetWord || item.targetWord,
    scenario: pItem.scenario || item.scenario || "",
    sha256: sha256,
    byteSize: webpBuffer.length,
    dimensions: "1024x1024",
    contentType: "image/webp",
    localWebp: `output/illustrations/generated/${item.sceneId}.webp`,
    localJpg: `output/illustrations/generated/${item.sceneId}.jpg`,
    targetR2Key: `usage-illustrations/v1/${item.sceneId}/${sha256}.webp`,
    appMediaKey: `${lessonId}-usage-scene-${chunkNumber}`,
    appUsageFile: `src/app/data/usage/${unitId}.usage.json`
  };

  registryEntries.push(entry);
});

// Write JSON registry
const registryJsonPath = 'output/illustrations/r2-deployment-registry.json';
fs.writeFileSync(registryJsonPath, JSON.stringify({
  generatedDate: new Date().toISOString(),
  totalScenes: registryEntries.length,
  totalBytesWebp: registryEntries.reduce((acc, e) => acc + e.byteSize, 0),
  entries: registryEntries
}, null, 2), 'utf8');

// Write Markdown Documentation
const mdPath = 'output/illustrations/R2_DEPLOYMENT_REGISTRY.md';
let md = `# WordPix Pedagogical Scenes — R2 Deployment & App Mapping Registry\n\n`;
md += `**Generated Date:** ${new Date().toISOString()}  \n`;
md += `**Total Cataloged Scenes:** ${registryEntries.length}  \n`;
md += `**Total WebP Weight:** ${(registryEntries.reduce((acc, e) => acc + e.byteSize, 0) / (1024 * 1024)).toFixed(2)} MB  \n`;
md += `**Dimensions:** 1024×1024 WebP (q85, effort 5)  \n\n`;

md += `## Curriculum Summary\n\n`;
const byUnit = {};
registryEntries.forEach(e => {
  byUnit[e.unitId] = (byUnit[e.unitId] || 0) + 1;
});
md += `| Unit ID | Scenes Count | App Usage Data File |\n| :--- | :---: | :--- |\n`;
Object.entries(byUnit).forEach(([u, count]) => {
  md += `| \`${u}\` | **${count}** | \`src/app/data/usage/${u}.usage.json\` |\n`;
});

md += `\n## Complete Asset Mapping Table\n\n`;
md += `| Scene ID | Target Word | SHA-256 Hash | Target R2 Key | Local File |\n`;
md += `| :--- | :--- | :--- | :--- | :--- |\n`;
registryEntries.forEach(e => {
  md += `| \`${e.sceneId}\` | **${e.targetWord}** | \`${e.sha256.slice(0, 12)}...\` | \`${e.targetR2Key}\` | \`${e.localWebp}\` |\n`;
});

fs.writeFileSync(mdPath, md, 'utf8');
console.log(`Successfully built R2 deployment registry for all ${registryEntries.length} scenes.`);
console.log(`JSON: ${registryJsonPath}`);
console.log(`Markdown: ${mdPath}`);
