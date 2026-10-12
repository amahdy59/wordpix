const fs = require('fs');
const content = JSON.parse(fs.readFileSync('src/app/learning/hadith/figmaHadithContent.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('src/app/learning/shared/curriculumAudioManifest.json', 'utf8'));

// Build lookup map
const clipsMap = new Map();
for (const [k, v] of Object.entries(manifest.clips)) {
  clipsMap.set(k.toLowerCase().trim(), v.objectKey);
}

const { parseHadithVocabulary } = require('../src/app/learning/hadith/hadithVocabularyContent.ts');

let missing = 0;
let total = 0;
let missingList = [];

for (const lesson of content.lessons) {
  const lines = lesson.stages['vocabulary']?.text || [];
  const items = parseHadithVocabulary(lines, lesson.number);
  for (const item of items) {
    total++;
    const key = clipsMap.get(item.term.toLowerCase().trim());
    if (!key) {
      missing++;
      missingList.push({ lesson: lesson.id, term: item.term });
    }
  }
}

console.log(`Parsed Vocabulary Total: ${total}`);
console.log(`Missing Audio Keys: ${missing}`);
if (missing > 0) {
  console.log('Missing items:', missingList);
}
