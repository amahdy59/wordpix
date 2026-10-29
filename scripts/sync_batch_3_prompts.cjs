const fs = require('fs');

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b3 = pipeline.batches[3]; // Classroom & Office Supplies

// Load classroom and office data
const classroomData = JSON.parse(fs.readFileSync('src/app/data/usage/classroom.usage.json', 'utf8'));
const officeData = JSON.parse(fs.readFileSync('src/app/data/usage/office-supplies.usage.json', 'utf8'));

// Load improvements
require('./enhance_classroom_content.cjs');
require('./enhance_office_content.cjs');

// Build prompt mapping
const promptMap = {};

// Classroom prompts
classroomData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const sceneId = `classroom-${lIdx + 1}-usage-scene-${sIdx + 1}`;
    promptMap[sceneId] = {
      scenario: scene.scenario,
      question: scene.check.question
    };
  });
});

// Office prompts
officeData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const sceneId = `office-supplies-${lIdx + 1}-usage-scene-${sIdx + 1}`;
    promptMap[sceneId] = {
      scenario: scene.scenario,
      question: scene.check.question
    };
  });
});

// Update Batch 3 items
let updated = 0;
b3.items.forEach(item => {
  if (promptMap[item.sceneId]) {
    item.scenario = promptMap[item.sceneId].scenario;
    // Keep prompt matching the scenario
    item.optimizedPrompt = `Crisp, photorealistic documentary photography illustrating the concept of "${item.expectedAnswer}". Context: ${item.scenario}. Focus clearly on the central item "${item.expectedAnswer}" in a clean, modern, well-lit workspace setting. Strictly object and environment focused; no human figures unless strictly necessary (men only if present). Zero text overlays, zero labels, zero brand logos, zero graphic overlays.`;
    updated++;
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Synchronized ${updated}/36 items in Batch 3 with elevated adult scenarios and clean prompts.`);
