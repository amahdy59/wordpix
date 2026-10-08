const fs = require('fs');
const path = require('path');

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));

// Mark telling-time-2-usage-scene-3 as completed
const b1 = pipeline.batches.find(b => b.batchNumber === 1);
if (!b1) throw new Error('Generation batch 1 is missing.');
const item3 = b1.items.find(i => i.sceneId === 'telling-time-2-usage-scene-3');
if (item3) {
  const localFile = path.join('output/illustrations/generated', `${item3.sceneId}.webp`);
  if (!fs.existsSync(localFile) || fs.statSync(localFile).size === 0) throw new Error('Generated scene is missing or empty.');
  item3.status = 'COMPLETED_SAVED_LOCALLY';
  item3.reviewStatus = 'pending-visual-review';
}
// recount completed and queued
b1.completedScenes = b1.items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY').length;
b1.queuedScenes = b1.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY').length;

pipeline.totalCompletedSoFar = pipeline.batches.reduce((acc, b) => acc + (b.completedScenes || 0), 0);
pipeline.totalRemainingInPipeline = pipeline.totalScenesCataloged - pipeline.totalCompletedSoFar;

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');

console.log('Batch 1 progress:', b1.completedScenes, '/', b1.totalScenes);
const nextQueued = b1.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY').slice(0, 5);
console.log('Next 5 queued items:');
nextQueued.forEach(i => console.log(`- ${i.sceneId}: ${i.expectedAnswer} (${i.imageName})`));
