const fs = require('fs');
const content = JSON.parse(fs.readFileSync('src/app/learning/hadith/figmaHadithContent.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('src/app/learning/shared/curriculumAudioManifest.json', 'utf8'));

// Build lookup map
const clipsMap = new Map();
for (const [k, v] of Object.entries(manifest.clips)) {
  clipsMap.set(k.toLowerCase().trim(), v.objectKey);
}

function cleanCurriculumTerm(term) {
  return String(term)
    .replace(/^\d+[.)]\s*/, "")
    .replace(/\s*[/(].*$/, "")
    .replace(/[\u0600-\u06FF]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

console.log('Auditing vocabulary audio coverage across all 42 Hadith lessons in Vocabulary stage...');

let totalVocab = 0;
let missingVocab = 0;
let missingList = [];

for (const lesson of content.lessons) {
  const vocabText = lesson.stages['vocabulary']?.text || [];
  // Parse terms from vocabularyText:
  for (const line of vocabText) {
    if (line.includes('—')) {
      const expr = line.split('—')[0].trim();
      const cleaned = cleanCurriculumTerm(expr);
      if (cleaned.length > 1) {
        totalVocab++;
        const key = clipsMap.get(cleaned.toLowerCase());
        if (!key) {
          missingVocab++;
          missingList.push({ lesson: lesson.id, term: expr, cleaned });
        }
      }
    }
  }
}

console.log(`Total vocabulary items checked: ${totalVocab}`);
console.log(`Missing audio keys: ${missingVocab}`);
console.log('Sample missing:', missingList.slice(0, 15));
