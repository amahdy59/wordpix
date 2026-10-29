const fs = require('fs');

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b = pipeline.batches[1];

const marchItem = b.items.find(i => i.sceneId === 'days-months-1-usage-scene-5');
if (marchItem) {
  marchItem.optimizedPrompt = 'Crisp early spring desktop atmosphere: An open desktop calendar planner resting on a clean wooden desk beside a small vase with early blooming spring daffodils and mild morning sun filtering through a window. Fresh, clean, rejuvenating seasonal atmosphere with zero humans, zero text leaks, zero brand logos.';
}

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log('Successfully updated March item in Batch 2.');
