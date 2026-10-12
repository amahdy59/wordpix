const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(fs.readFileSync('src/app/learning/shared/curriculumAudioManifest.json', 'utf8'));
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

console.log('=== AUDITING COMPLETE CURRICULUM VOCABULARY AUDIO COVERAGE ===');

// 1. Hadith
const hadithContent = JSON.parse(fs.readFileSync('src/app/learning/hadith/figmaHadithContent.json', 'utf8'));
const { parseHadithVocabulary } = require('../src/app/learning/hadith/hadithVocabularyContent.ts');

let hadithMissing = [];
for (const lesson of hadithContent.lessons) {
  const lines = lesson.stages['vocabulary']?.text || [];
  const items = parseHadithVocabulary(lines, lesson.number);
  for (const item of items) {
    const cleaned = cleanCurriculumTerm(item.term);
    const key = clipsMap.get(cleaned.toLowerCase()) || clipsMap.get(item.term.toLowerCase());
    if (!key) {
      hadithMissing.push({ lesson: lesson.id, term: item.term, cleaned });
    }
  }
}

console.log(`Hadith Core Vocabulary Missing Audio: ${hadithMissing.length}`);
if (hadithMissing.length > 0) {
  console.log('Hadith missing list:', hadithMissing);
}

// 2. Conversation
const convCatalog = JSON.parse(fs.readFileSync('src/app/learning/conversation/conversationCatalog.json', 'utf8'));
let convMissing = [];
for (const unit of convCatalog) {
  for (const item of unit.languageBank || []) {
    const cleaned = cleanCurriculumTerm(item.term);
    const key = clipsMap.get(cleaned.toLowerCase()) || clipsMap.get(item.term.toLowerCase());
    if (!key) {
      convMissing.push({ unit: unit.unitNumber, term: item.term, cleaned });
    }
  }
}
console.log(`Conversation Language Bank Missing Audio: ${convMissing.length}`);

// 3. Business
const bizCatalog = JSON.parse(fs.readFileSync('src/app/learning/business/businessCatalog.json', 'utf8'));
let bizMissing = [];
for (const unit of bizCatalog) {
  for (const item of unit.languageBank || []) {
    const cleaned = cleanCurriculumTerm(item.term);
    const key = clipsMap.get(cleaned.toLowerCase()) || clipsMap.get(item.term.toLowerCase());
    if (!key) {
      bizMissing.push({ unit: unit.unitNumber, term: item.term, cleaned });
    }
  }
}
console.log(`Business Language Bank Missing Audio: ${bizMissing.length}`);
