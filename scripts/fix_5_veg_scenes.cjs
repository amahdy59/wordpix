const fs = require('fs');
const { generateSceneImage } = require('./generate_scene.cjs');

const vegPrompts = {
  'vegetables-3-usage-scene-3': {
    scenario: "On the autumn harvest stand, an ornamental curved hard-shelled gourd displays colorful striped and bumpy skin.",
    prompt: "A beautifully curved, clean decorative harvest gourd with striped green and yellow patterns resting on a rustic wooden windowsill in warm autumn sunlight. Crisp clean still life photography. Zero people, zero text, zero brand logos."
  },
  'vegetables-3-usage-scene-5': {
    scenario: "On the spice counter, several glossy bright red chili peppers with green stems lie beside a wooden cutting board.",
    prompt: "Vibrant close-up photography of fresh glossy bright red chili peppers with crisp green stems resting on a clean dark slate cutting board. Glistening smooth skins, sharp colorful contrast in natural light. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-usage-scene-2': {
    scenario: "In the fresh pepper basket, slender elongated red cayenne peppers are harvested for drying and seasoning.",
    prompt: "Close-up photograph of slender, vibrant red cayenne peppers resting in a clean woven basket on a sunlit wooden counter. Crisp detail on the tapered pods, bright clean culinary atmosphere. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-usage-scene-4': {
    scenario: "On the prep board, a fresh bunch of green scallions features crisp white root ends transitioning into long, hollow green stalks.",
    prompt: "A neat bundle of fresh, crisp green scallions (spring onions) with clean white roots and slender hollow emerald stalks resting on a light wooden cutting board. Fresh culinary daylight, hygienic kitchen. Zero people, zero text, zero brand logos."
  },
  'vegetables-4-usage-scene-5': {
    scenario: "Beside the salad bowl, a fresh head of celery stands upright with crisp, ribbed pale-green stalks and leafy tops.",
    prompt: "A crisp, fresh head of pale-green celery with ribbed crunchy stalks and leafy tops resting beside a chef's knife on a clean white kitchen island. Natural morning light, spotless culinary environment. Zero people, zero text, zero brand logos."
  }
};

async function fixAndRegenerate() {
  const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
  const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
  const b4 = pipeline.batches[4];

  // Update pipeline entries
  for (const [sceneId, data] of Object.entries(vegPrompts)) {
    const item = b4.items.find(i => i.sceneId === sceneId);
    if (item) {
      item.scenario = data.scenario;
      item.optimizedPrompt = data.prompt;
    }
  }
  fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
  console.log('Updated pipeline entries with correct vegetable prompts.');

  // Regenerate in parallel with concurrency 4
  const entries = Object.entries(vegPrompts);
  const promises = entries.map(async ([sceneId, data]) => {
    console.log(`Regenerating ${sceneId}...`);
    return generateSceneImage(sceneId, data.prompt);
  });

  await Promise.all(promises);
  console.log('All 5 vegetable scenes cleanly regenerated!');

  // Sync pipeline & manifest & registry
  const { execSync } = require('child_process');
  execSync('node scripts/sync_pipeline.cjs', { stdio: 'inherit' });
  execSync('node scripts/build_generated_manifest.cjs', { stdio: 'inherit' });
  execSync('node scripts/build_r2_deployment_registry.cjs', { stdio: 'inherit' });
}

fixAndRegenerate().catch(err => {
  console.error('Failed to regenerate vegetables:', err);
  process.exit(1);
});
