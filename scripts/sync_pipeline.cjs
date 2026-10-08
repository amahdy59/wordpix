const fs = require('fs');
const path = require('path');

const generatedDir = 'output/illustrations/generated';
const webpFiles = fs.readdirSync(generatedDir).filter(f => f.endsWith('.webp') && fs.statSync(path.join(generatedDir, f)).size > 0);
const completedSet = new Set(webpFiles.map(f => f.replace('.webp', '')));

console.log('Total completed webp files:', completedSet.size);

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));

pipeline.batches.forEach(b => {
  b.items.forEach(item => {
    if (completedSet.has(item.sceneId)) {
      item.status = 'COMPLETED_SAVED_LOCALLY';
      item.reviewStatus = 'pending-visual-review';
    }
  });
  b.completedScenes = b.items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY').length;
  b.queuedScenes = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY').length;
});

pipeline.totalCompletedSoFar = pipeline.batches.reduce((acc, b) => acc + (b.completedScenes || 0), 0);
pipeline.totalRemainingInPipeline = pipeline.totalScenesCataloged - pipeline.totalCompletedSoFar;

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');

console.log('Total completed in pipeline:', pipeline.totalCompletedSoFar);
console.log('Batch 1 completed:', pipeline.batches[0].completedScenes, '/', pipeline.batches[0].totalScenes);

// Let's find the remaining queued items in Batch 1 specifically for telling-time:
const tellingTimeQueued = pipeline.batches[0].items.filter(i => i.sceneId.startsWith('telling-time') && i.status !== 'COMPLETED_SAVED_LOCALLY');
console.log('Telling time queued count:', tellingTimeQueued.length);
tellingTimeQueued.forEach(i => console.log(`  - ${i.sceneId}: ${i.expectedAnswer}`));
