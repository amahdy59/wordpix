const fs = require('fs');
const p = JSON.parse(fs.readFileSync('output/illustrations/generation_batches_pipeline.json', 'utf8'));
const b = p.batches[4];
const m1 = b.items.find(i => i.sceneId === 'market-1-usage-scene-1');
console.log('market-1-usage-scene-1:', JSON.stringify(m1, null, 2));

const mNext = b.items.find(i => i.sceneId === 'market-3-usage-scene-3');
console.log('market-3-usage-scene-3:', JSON.stringify(mNext, null, 2));
