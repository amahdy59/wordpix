const fs = require('fs');
const p = JSON.parse(fs.readFileSync('output/illustrations/generation_batches_pipeline.json', 'utf8'));
const b = p.batches[4];
console.log('Batch name:', b.name);
const units = {};
b.items.forEach(i => {
  const u = i.unitId || i.sceneId.split('-')[0];
  units[u] = (units[u] || 0) + 1;
});
console.log('Total items in batch:', b.items.length);
console.log('Units breakdown:', units);

const remaining = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY');
const completed = b.items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY');
console.log('Completed count:', completed.length);
console.log('Completed scenes:', completed.map(i => i.sceneId));
console.log('Remaining count:', remaining.length);
const remUnits = {};
remaining.forEach(i => {
  const u = i.unitId || i.sceneId.split('-')[0];
  remUnits[u] = (remUnits[u] || 0) + 1;
});
console.log('Remaining by unit:', remUnits);

const veg = b.items.filter(i => i.sceneId.startsWith('vegetables'));
console.log('Vegetables items count:', veg.length);
veg.forEach(v => console.log('Veg item:', v.sceneId, v.expectedAnswer, v.status));


