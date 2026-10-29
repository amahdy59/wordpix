const fs = require('fs');
const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b4 = pipeline.batches[4];

const fruits = b4.items.filter(i => i.sceneId.startsWith('fruits'));
const market = b4.items.filter(i => i.sceneId.startsWith('market'));
const veg = b4.items.filter(i => i.sceneId.startsWith('vegetables'));
const sm = b4.items.filter(i => i.sceneId.startsWith('supermarket'));

console.log(`Counts: Fruits=${fruits.length}, Market=${market.length}, Veg=${veg.length}, Supermarket=${sm.length}`);
console.log(`Total: ${fruits.length + market.length + veg.length + sm.length}`);

b4.items = [...fruits, ...market, ...veg, ...sm];

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log('Successfully reordered Batch 4 items: Fruits -> Market -> Vegetables -> Supermarket');
