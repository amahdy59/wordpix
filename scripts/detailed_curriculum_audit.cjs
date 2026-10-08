const fs = require('fs');
const path = require('path');

// Read verified assets
const verifiedPath = 'verified-assets.json';
let verifiedAssets = [];
if (fs.existsSync(verifiedPath)) {
  verifiedAssets = JSON.parse(fs.readFileSync(verifiedPath, 'utf8'));
}
const verifiedSceneIds = new Set(verifiedAssets.filter(a => a.mappingRole === 'scene' || a.mappingRole === 'geometry-fallback').map(a => a.contentId));

// Read generated manifest
const generatedManifestPath = 'output/illustrations/generated/manifest.json';
let generatedSceneIds = new Set();
if (fs.existsSync(generatedManifestPath)) {
  const gen = JSON.parse(fs.readFileSync(generatedManifestPath, 'utf8'));
  (gen.items || []).forEach(i => generatedSceneIds.add(i.sceneId));
}

// Read candidates.json to know all usage scenes
const candidatesPath = 'output/illustrations/figma-reuse/library-review/candidates.json';
let candidates = [];
if (fs.existsSync(candidatesPath)) {
  candidates = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
}

console.log('Verified scene IDs count:', verifiedSceneIds.size);
console.log('Locally generated scene IDs count:', generatedSceneIds.size);
console.log('Figma review candidates count:', candidates.length);

// Read the canonical usage catalogs, rather than optional export artifacts.
const usageDir = 'src/app/data/usage';
const sceneMap = new Map();
for (const file of fs.readdirSync(usageDir).filter(file => file.endsWith('.usage.json'))) {
  const lessons = JSON.parse(fs.readFileSync(path.join(usageDir, file), 'utf8'));
  for (const lesson of lessons) {
    const scenes = Array.isArray(lesson.usage.scenes) ? lesson.usage.scenes : [lesson.usage.scenes];
    for (const scene of scenes.filter(Boolean)) {
      sceneMap.set(`${lesson.lessonId}-usage-scene-${scene.chunkNumber}`, scene);
    }
  }
}
console.log('Total scenes in canonical usage catalogs:', sceneMap.size);
console.log('Scenes with verified mapping entries:', [...sceneMap.keys()].filter(id => verifiedSceneIds.has(id)).length);
console.log('Scenes with locally generated files:', [...sceneMap.keys()].filter(id => generatedSceneIds.has(id)).length);
console.log('Mapping entries and local generation do not establish semantic image approval.');