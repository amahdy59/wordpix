const fs = require('fs');

// 1. Parse stages from curriculumSequence.ts
const text = fs.readFileSync('src/app/data/curriculumSequence.ts', 'utf8');
const lines = text.split('\n');
const stageMap = {};
let currentStage = 'Stage 1: Pre-A1 Starter';
for (const line of lines) {
  const m = line.match(/\/\/\s*───\s*(Stage \d+:\s*[^─]+)/);
  if (m) currentStage = m[1].trim();
  const unitMatch = line.match(/^\s*['"]([a-z0-9-]+)['"],?/);
  if (unitMatch) {
    stageMap[unitMatch[1]] = currentStage;
  }
}

// 2. Load all 3657 usage scenes
const allScenesData = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/all-usage-scenes-status.json', 'utf8'));
const allScenes = allScenesData.items;

const totalByStage = {};
const coveredByStage = {};
const missingByStage = {};
const statusCounts = {};

for (const item of allScenes) {
  const unit = item.unitId;
  const stage = stageMap[unit] || 'Other';
  totalByStage[stage] = (totalByStage[stage] || 0) + 1;

  if (item.afterDraftStatus === 'reviewed-media-live' || item.afterDraftStatus === 'uploaded-draft-not-published') {
    coveredByStage[stage] = (coveredByStage[stage] || 0) + 1;
  } else {
    missingByStage[stage] = (missingByStage[stage] || 0) + 1;
  }
}

console.log('=== USAGE SCENE STATUS OVERALL ===');
console.log(statusCounts);

console.log('\n=== USAGE SCENES BREAKDOWN BY CEFR STAGE ===');
for (const [st, total] of Object.entries(totalByStage)) {
  const cov = coveredByStage[st] || 0;
  const miss = missingByStage[st] || 0;
  const pct = ((cov / total) * 100).toFixed(1);
  console.log(`${st.padEnd(28)}: Total = ${String(total).padStart(4)} | Covered = ${String(cov).padStart(3)} (${pct}%) | Missing = ${String(miss).padStart(4)}`);
}

// Top units missing usage scenes
const missingByUnit = {};
for (const item of allScenes) {
  if (item.status !== 'reviewed-media-live' && item.status !== 'reviewed-media-draft') {
    const unit = item.sceneId.replace(/-\d+-usage-scene-\d+$/, '');
    missingByUnit[unit] = (missingByUnit[unit] || 0) + 1;
  }
}

const sortedMissing = Object.entries(missingByUnit).sort((a,b) => b[1] - a[1]);
console.log('\n=== TOP 20 UNITS MISSING USAGE SCENES ===');
sortedMissing.slice(0, 20).forEach(([u, c]) => {
  const st = stageMap[u] || 'Unknown';
  console.log(`${u.padEnd(25)}: ${String(c).padStart(3)} missing (${st})`);
});
