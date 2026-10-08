const fs = require('fs');
const p = JSON.parse(fs.readFileSync('output/illustrations/generation_batches_pipeline.json', 'utf8'));

console.log('Total Batches Planned:', p.batches.length);
console.log('Total Scenes Cataloged:', p.totalScenesCataloged);
console.log('Total Completed So Far:', p.totalCompletedSoFar);
console.log('Total Remaining in Pipeline:', p.totalRemainingInPipeline);
console.log('----------------------------------------------------');

p.batches.forEach(b => {
  console.log(`Batch ${b.batchNumber}: ${b.name}`);
  console.log(`  Description: ${b.description}`);
  console.log(`  Total Scenes: ${b.totalScenes} | Completed: ${b.completedScenes} | Queued: ${b.queuedScenes}`);
  console.log(`  Sample scenes:`, b.items.slice(0, 3).map(i => `${i.sceneId} (${i.expectedAnswer})`).join(', '));
  console.log('');
});
