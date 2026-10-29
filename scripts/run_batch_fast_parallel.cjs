const fs = require('fs');
const path = require('path');
const { generateSceneImage } = require('./generate_scene.cjs');

async function runWithConcurrency(items, concurrency = 4) {
  let currentIndex = 0;
  const results = [];

  async function worker(workerId) {
    while (currentIndex < items.length) {
      const idx = currentIndex++;
      const item = items[idx];
      console.log(`[Worker ${workerId}] Starting ${item.sceneId} (${item.expectedAnswer}) [${idx + 1}/${items.length}]...`);
      
      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        attempts++;
        try {
          const res = await generateSceneImage(item.sceneId, item.optimizedPrompt);
          item.status = 'COMPLETED_SAVED_LOCALLY';
          item.reviewStatus = 'pending-visual-review';
          results.push(res);
          success = true;
          console.log(`[Worker ${workerId}] ✅ Finished ${item.sceneId}`);
        } catch (err) {
          console.warn(`[Worker ${workerId}] ⚠️ Attempt ${attempts} failed for ${item.sceneId}: ${err.message}`);
          if (attempts < 3) await new Promise(r => setTimeout(r, 2000 * attempts));
        }
      }
    }
  }

  const workers = [];
  for (let i = 0; i < concurrency; i++) {
    workers.push(worker(i + 1));
  }

  await Promise.all(workers);
  return results;
}

async function runFastBatch(batchIndex = 4, concurrency = 4, limit = 50) {
  const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
  const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
  const b = pipeline.batches[batchIndex];

  if (!b) throw new Error(`Batch ${batchIndex} not found!`);

  const pending = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY');
  console.log(`Batch ${batchIndex} (${b.batchName || b.name}): ${pending.length} pending items. Concurrency: ${concurrency}, Limit: ${limit}`);

  if (pending.length === 0) {
    console.log(`Batch ${batchIndex} is already 100% complete!`);
    return;
  }

  const toProcess = pending.slice(0, limit);
  const startTime = Date.now();
  await runWithConcurrency(toProcess, concurrency);
  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

  // Re-save pipeline
  b.completedScenes = b.items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY').length;
  b.queuedScenes = b.items.filter(i => i.status !== 'COMPLETED_SAVED_LOCALLY').length;
  pipeline.totalCompletedSoFar = pipeline.batches.reduce((acc, batch) => acc + (batch.completedScenes || 0), 0);
  pipeline.totalRemainingInPipeline = pipeline.totalScenesCataloged - pipeline.totalCompletedSoFar;
  fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');

  // Re-build manifest & R2 deployment registry
  const { execSync } = require('child_process');
  execSync('node scripts/sync_pipeline.cjs', { stdio: 'inherit' });
  execSync('node scripts/build_generated_manifest.cjs', { stdio: 'inherit' });
  execSync('node scripts/build_r2_deployment_registry.cjs', { stdio: 'inherit' });

  console.log(`\n==================================================`);
  console.log(`Fast run finished in ${elapsedSec}s! Batch ${batchIndex} is now at ${b.completedScenes}/${b.totalScenes}`);
}

const batchIdx = process.argv[2] ? parseInt(process.argv[2], 10) : 4;
const concurrency = process.argv[3] ? parseInt(process.argv[3], 10) : 4;
const limit = process.argv[4] ? parseInt(process.argv[4], 10) : 50;

runFastBatch(batchIdx, concurrency, limit)
  .then(() => console.log('Done.'))
  .catch(err => console.error('Error:', err));
