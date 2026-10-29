const fs = require('fs');
const path = require('path');
const { generateSceneImage } = require('./generate_scene.cjs');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runBatch(batchIndex = 1, limit = 50) {
  const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
  const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
  const b = pipeline.batches[batchIndex];

  if (!b) {
    console.error(`Batch index ${batchIndex} does not exist!`);
    return;
  }

  console.log(`Starting Batch ${batchIndex}: "${b.batchName || b.name}"`);
  const pending = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY');
  console.log(`Found ${pending.length} pending items in this batch.`);
  const toProcess = pending.slice(0, limit);

  let successCount = 0;
  for (let idx = 0; idx < toProcess.length; idx++) {
    const item = toProcess[idx];
    console.log(`\n--------------------------------------------------`);
    console.log(`[${idx + 1}/${toProcess.length}] Processing ${item.sceneId} (${item.expectedAnswer})...`);

    try {
      await generateSceneImage(item.sceneId, item.optimizedPrompt);
      item.status = 'COMPLETED_SAVED_LOCALLY';
      item.reviewStatus = 'pending-visual-review';
      successCount++;

      // Re-save pipeline after each successful item
      b.completedScenes = b.items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY').length;
      b.queuedScenes = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY').length;
      pipeline.totalCompletedSoFar = pipeline.batches.reduce((acc, b) => acc + (b.completedScenes || 0), 0);
      pipeline.totalRemainingInPipeline = pipeline.totalScenesCataloged - pipeline.totalCompletedSoFar;
      fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');

      // Re-build manifest
      const { execSync } = require('child_process');
      execSync('node scripts/build_generated_manifest.cjs', { stdio: 'ignore' });

      // Gentle pause to avoid rate throttling
      if (idx < toProcess.length - 1) {
        console.log(`Waiting 3 seconds before next generation...`);
        await sleep(3000);
      }
    } catch (err) {
      console.error(`Error processing ${item.sceneId}:`, err.message);
      await sleep(5000);
    }
  }

  console.log(`\n==================================================`);
  console.log(`Batch ${batchIndex} complete! Successfully generated: ${successCount}/${toProcess.length}`);
}

const batchIndex = process.argv[2] ? parseInt(process.argv[2], 10) : 1;
const count = process.argv[3] ? parseInt(process.argv[3], 10) : 50;

runBatch(batchIndex, count)
  .then(() => console.log('Finished batch run.'))
  .catch(err => console.error('Fatal batch error:', err));
