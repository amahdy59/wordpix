const fs = require('fs');
const https = require('https');

const content = JSON.parse(fs.readFileSync('src/app/learning/hadith/figmaHadithContent.json', 'utf8'));
const manifest = JSON.parse(fs.readFileSync('src/app/learning/hadith/hadithAudioManifest.json', 'utf8'));
const recorded = JSON.parse(fs.readFileSync('src/app/learning/hadith/hadithRecordedSourceTexts.json', 'utf8'));
const curriculumManifest = JSON.parse(fs.readFileSync('src/app/learning/shared/curriculumAudioManifest.json', 'utf8'));

console.log('=== AUDITING ALL HADITH AUDIO ===');

let issues = [];

for (const lesson of content.lessons) {
  const m = manifest.lessons.find(l => l.id === lesson.id);
  const r = recorded[lesson.id];
  
  if (!m) {
    issues.push(`${lesson.id}: missing from manifest`);
    continue;
  }
  
  if (!m.arabic?.objectKey) {
    issues.push(`${lesson.id}: missing arabic objectKey`);
  }
  if (!m.translation?.objectKey) {
    issues.push(`${lesson.id}: missing translation objectKey`);
  }
  
  if (!r) {
    issues.push(`${lesson.id}: missing from recorded texts`);
    continue;
  }
  
  if (r.arabic !== lesson.source.arabic) {
    issues.push(`${lesson.id}: Arabic text does NOT match recorded source (synthesisOnly triggered!)`);
  }
  if (r.translation !== lesson.source.translation) {
    issues.push(`${lesson.id}: Translation does NOT match recorded source (synthesisOnly triggered!)`);
  }

  // Check stage texts
  const rlText = lesson.stages['read-listen']?.text;
  if (!rlText || rlText.length === 0) {
    issues.push(`${lesson.id}: read-listen stage missing text`);
  }
  
  const vocabText = lesson.stages['vocabulary']?.text;
  if (!vocabText || vocabText.length === 0) {
    issues.push(`${lesson.id}: vocabulary stage missing text`);
  }
}

console.log('Total lessons audited:', content.lessons.length);
console.log('Issues found:', issues.length);
if (issues.length > 0) {
  issues.forEach(iss => console.log(' - ', iss));
} else {
  console.log('All 42 Hadith lesson texts and manifest entries matched perfectly!');
}
