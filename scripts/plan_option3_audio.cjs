const fs = require('fs');
const path = require('path');
const { audioHash, AUDIO_PROFILE } = require('./lib/assetKey.cjs');

// 1. Missing Phrases (7)
const missingPhrases = [
  'check the gate number',
  'Which gate does the flight leave from?',
  'check the departure time',
  'Is the flight on time?',
  'board the plane',
  'Which pier does the ferry leave from?',
  'confirm the departure pier'
];

// 2. Examples from usagePhrases (283)
const phraseDir = 'src/app/data/usagePhrases';
const pFiles = fs.readdirSync(phraseDir).filter(f => f.endsWith('.phrases.json'));
const examples = Array.from(new Set(pFiles.flatMap(f => JSON.parse(fs.readFileSync(path.join(phraseDir, f))).map(x => x.example).filter(Boolean))));

// 3. Compound terms from Business, Conversation, Hadith
const businessCatalog = JSON.parse(fs.readFileSync('src/app/learning/business/businessCatalog.json'));
const convCatalog = JSON.parse(fs.readFileSync('src/app/learning/conversation/conversationCatalog.json'));
const manifestClips = JSON.parse(fs.readFileSync('src/app/learning/shared/curriculumAudioManifest.json')).clips;

const missingCompounds = new Set();
for (const u of businessCatalog) {
  for (const item of u.languageBank) {
    const t = item.term.trim();
    if (!manifestClips[t] && !manifestClips[t.toLowerCase()]) missingCompounds.add(t);
  }
}
for (const u of convCatalog) {
  const bank = u.languageBank || u.vocabulary || [];
  for (const item of bank) {
    const t = (item.term || item.phrase || '').trim();
    if (t && !manifestClips[t] && !manifestClips[t.toLowerCase()]) missingCompounds.add(t);
  }
}
const hadithTerms = ['judged', 'motive', 'intend', 'migration', 'worldly'];
for (const t of hadithTerms) {
  if (!manifestClips[t]) missingCompounds.add(t);
}

// 4. Starter Reading Passages (Units 01-10)
// Curriculum Sequence:
const seq = [
  "numbers-counting",
  "colors",
  "shapes-geometry",
  "basic-emotions",
  "family",
  "bedroom",
  "bathroom",
  "kitchen",
  "living-room",
  "fruits"
];
const starterPassages = [];
for (const u of seq) {
  const p = 'src/app/data/usage/' + u + '.usage.json';
  if (fs.existsSync(p)) {
    const d = JSON.parse(fs.readFileSync(p));
    for (const l of d) {
      if (l.reading?.text) {
        starterPassages.push({
          unitId: u,
          lessonId: l.lessonId,
          title: l.reading.title,
          text: l.reading.text
        });
      }
    }
  }
}

const ledger = JSON.parse(fs.readFileSync('assets/audio-ledger.json', 'utf8'));

console.log('=== OPTION 3 TARGET INVENTORY ===');
console.log('1. Missing Phrases:', missingPhrases.length, 'chars:', missingPhrases.reduce((s, x) => s + x.length, 0));
console.log('2. Usage Examples:', examples.length, 'chars:', examples.reduce((s, x) => s + x.length, 0));
console.log('3. Compound Terms:', missingCompounds.size, 'chars:', Array.from(missingCompounds).reduce((s, x) => s + x.length, 0));
console.log('4. Starter Passages (Units 1-10):', starterPassages.length, 'chars:', starterPassages.reduce((s, x) => s + x.text.length, 0));

const allItems = [
  ...missingPhrases.map(t => ({ text: t, category: 'phrase' })),
  ...examples.map(t => ({ text: t, category: 'example' })),
  ...Array.from(missingCompounds).map(t => ({ text: t, category: 'compound' })),
  ...starterPassages.map(p => ({ text: p.text, category: 'passage', meta: p }))
];

let alreadyInLedger = 0;
let needsGen = [];
for (const item of allItems) {
  const h = audioHash(item.text, AUDIO_PROFILE);
  if (ledger.clips[h]) {
    alreadyInLedger++;
  } else {
    needsGen.push(item);
  }
}

console.log('\n=== LEDGER & SYNTHESIS NEEDS ===');
console.log('Total items in scope:', allItems.length);
console.log('Already in ledger ($0 cost):', alreadyInLedger);
console.log('Need ElevenLabs generation:', needsGen.length);
const totalGenChars = needsGen.reduce((s, x) => s + x.text.length, 0);
console.log('Total characters to generate:', totalGenChars);
console.log('Credits cost on eleven_turbo_v2_5 (0.5x):', Math.round(totalGenChars * 0.5));
