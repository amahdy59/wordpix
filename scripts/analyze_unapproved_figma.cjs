const fs = require('fs');

const queue = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/figma-scene-review-queue.json', 'utf8'));

const unapproved = queue.items.filter(i => i.status === 'not-semantically-approved');

console.log('Total unapproved in queue:', unapproved.length);

const unitCounts = {};
unapproved.forEach(i => {
  const unit = i.sceneId ? i.sceneId.replace(/-\d+-usage-scene-\d+$/, '') : 'unknown';
  unitCounts[unit] = (unitCounts[unit] || 0) + 1;
});

console.log('Unit breakdown of unapproved sources:');
console.log(JSON.stringify(unitCounts, null, 2));

// Sample some frames and their text
console.log('\nSample items from different units:');
const sampleUnits = ['classroom', 'hospital', 'dentist', 'shopping', 'human', 'physical'];
sampleUnits.forEach(u => {
  const match = unapproved.find(i => i.sceneId && i.sceneId.startsWith(u));
  if (match) {
    console.log(`\nUnit: ${u}`);
    console.log(`  SceneId: ${match.sceneId}`);
    console.log(`  Frame: ${match.frameName}`);
    console.log(`  Answer: ${match.metadataOnlyAnswer}`);
    console.log(`  Context: ${match.metadataOnlyContext?.slice(0, 100)}...`);
  }
});
