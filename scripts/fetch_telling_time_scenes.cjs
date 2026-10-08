const fs = require('fs');
const allScenes = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/all-usage-scenes-status.json', 'utf8')).items;
const timeScenes = allScenes.filter(x => x.unitId === 'telling-time');
console.log('Total telling-time scenes:', timeScenes.length);
timeScenes.forEach((s, idx) => {
  console.log(`[${idx + 1}] ${s.sceneId} | Answer: ${s.expectedAnswer} | TargetWords: ${s.targetWords.join(', ')}`);
  console.log(`    Scenario: ${s.scenario}`);
  console.log(`    Question: ${s.question}`);
});
