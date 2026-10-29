const fs = require('fs');
const p = JSON.parse(fs.readFileSync('output/illustrations/generation_batches_pipeline.json', 'utf8'));
const b3 = p.batches[3];
console.log(`Total items in Batch 3: ${b3.items.length}`);
b3.items.forEach((i, idx) => {
  console.log(`[${idx + 1}] ${i.sceneId} | ${i.expectedAnswer} | ${i.scenario}`);
});
