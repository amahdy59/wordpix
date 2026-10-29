const fs = require('fs');
const p = JSON.parse(fs.readFileSync('output/illustrations/generation_batches_pipeline.json', 'utf8'));

console.log('Batch 5 name:', p.batches[5]?.name);
console.log('Batch 5 total scenes:', p.batches[5]?.totalScenes);
const b5Units = {};
p.batches[5]?.items.forEach(i => {
  const u = i.unitId || i.sceneId.split('-')[0];
  b5Units[u] = (b5Units[u] || 0) + 1;
});
console.log('Batch 5 units:', b5Units);

console.log('------------------------------------');
console.log('Batch 6 name:', p.batches[6]?.name);
console.log('Batch 6 total scenes:', p.batches[6]?.totalScenes);
const b6Units = {};
p.batches[6]?.items.forEach(i => {
  const u = i.unitId || i.sceneId.split('-')[0];
  b6Units[u] = (b6Units[u] || 0) + 1;
});
console.log('Batch 6 units:', b6Units);
