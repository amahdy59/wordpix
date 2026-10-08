const fs = require('fs');
const path = require('path');

const allScenes = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/all-usage-scenes-status.json', 'utf8')).items;
const manifest = JSON.parse(fs.readFileSync('output/illustrations/generated/manifest.json', 'utf8'));
const completedIds = new Set(manifest.items.map(i => i.sceneId));

// Function to formulate strict prompt adhering to user rules
function formulatePrompt(scene) {
  const answer = scene.expectedAnswer;
  const unit = scene.unitId;
  const targetWords = (scene.targetWords || []).join(', ');

  // Base prompt guidelines: zero people unless necessary, veiled women if female required, zero text/watermarks
  let prompt = `Photorealistic clean adult real-world scene illustrating the concept of "${answer}". Context: ${scene.scenario}. `;
  prompt += `Show the focal object "${answer}" clearly and realistically. Contextual items (${targetWords}) arranged naturally. `;
  prompt += `Strict guidelines: No human figures unless strictly necessary; if people appear, use professional adult male or veiled Muslim woman wearing neat hijab and modest full-coverage attire. `;
  prompt += `Zero text overlays, zero written labels, zero arrows, zero highlighting circles, zero watermarks. Crisp natural lighting, phone-size readable.`;
  return prompt;
}

// Group upcoming units into batches
const batchDefinitions = [
  {
    batchNumber: 1,
    name: 'Residual Room Scenes & Telling Time (Pre-A1 Starter)',
    units: ['bedroom', 'bathroom', 'kitchen', 'living-room', 'telling-time'],
    description: 'Completes 100% of residual room objects and all 17 Pre-A1 telling-time clock/schedule concepts.'
  },
  {
    batchNumber: 2,
    name: 'Days & Months (Pre-A1 Starter)',
    units: ['days-months'],
    description: '17 calendar, date, and season transition scenes.'
  },
  {
    batchNumber: 3,
    name: 'Basic Emotions (Pre-A1 Starter)',
    units: ['basic-emotions'],
    description: '14 emotion scenes following strict Islamic modesty (veiled women with hijab, or dignified male expressions).'
  },
  {
    batchNumber: 4,
    name: 'Classroom & Office Supplies (A1 Foundations)',
    units: ['classroom', 'office-supplies'],
    description: 'Pure object-focused desk triplets (pencils, markers, rulers, notebooks, staplers).'
  },
  {
    batchNumber: 5,
    name: 'Food, Market & Supermarket Produce (A1 Foundations)',
    units: ['market', 'supermarket', 'fruits', 'vegetables'],
    description: 'Clean produce displays, grocery items, bakery rolls, weighing scales on clean market stalls.'
  },
  {
    batchNumber: 6,
    name: 'Everyday Clothing & Footwear (A1 Foundations)',
    units: ['everyday-clothing', 'accessories-jewelry', 'footwear'],
    description: 'Clean wardrobe flat-lays, shoes, accessories without mannequins or human models.'
  },
  {
    batchNumber: 7,
    name: 'First Aid & Medical Essentials (A1 Foundations)',
    units: ['first-aid-room', 'pharmacy'],
    description: 'First aid kits, bandages, thermometers, medicine bottles (strictly equipment-focused, non-clinical).'
  }
];

const sceneMap = new Map(allScenes.map(s => [s.sceneId, s]));
const batches = [];

for (const bDef of batchDefinitions) {
  const scenesInBatch = allScenes.filter(s => bDef.units.includes(s.unitId) && s.afterDraftStatus !== 'reviewed-media-live' && s.afterDraftStatus !== 'uploaded-draft-not-published');
  
  const items = scenesInBatch.map(s => {
    const isCompleted = completedIds.has(s.sceneId);
    return {
      sceneId: s.sceneId,
      unitId: s.unitId,
      lessonId: s.lessonId,
      expectedAnswer: s.expectedAnswer,
      targetWords: s.targetWords || [],
      scenario: s.scenario,
      status: isCompleted ? 'COMPLETED_SAVED_LOCALLY' : 'QUEUED_FOR_GENERATION',
      optimizedPrompt: formulatePrompt(s),
      imageName: `${s.unitId.replace(/-/g, '_')}_${s.expectedAnswer.toLowerCase().replace(/[^a-z0-9]/g, '_')}`.slice(0, 30)
    };
  });

  batches.push({
    batchNumber: bDef.batchNumber,
    name: bDef.name,
    description: bDef.description,
    totalScenes: items.length,
    completedScenes: items.filter(i => i.status === 'COMPLETED_SAVED_LOCALLY').length,
    queuedScenes: items.filter(i => i.status === 'QUEUED_FOR_GENERATION').length,
    items
  });
}

const pipelineData = {
  lastUpdated: new Date().toISOString(),
  quotaResetTimestamp: '2026-10-09T01:11:25Z',
  totalBatchesPlanned: batches.length,
  totalScenesCataloged: batches.reduce((s, b) => s + b.totalScenes, 0),
  totalCompletedSoFar: batches.reduce((s, b) => s + b.completedScenes, 0),
  totalRemainingInPipeline: batches.reduce((s, b) => s + b.queuedScenes, 0),
  batches
};

fs.writeFileSync('output/illustrations/generation_batches_pipeline.json', JSON.stringify(pipelineData, null, 2) + '\n');
console.log(`Pipeline created: ${batches.length} batches, ${pipelineData.totalScenesCataloged} scenes cataloged (${pipelineData.totalCompletedSoFar} completed, ${pipelineData.totalRemainingInPipeline} queued).`);
