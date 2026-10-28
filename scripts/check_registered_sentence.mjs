import fs from 'node:fs';

const m = JSON.parse(fs.readFileSync('src/app/generated/reviewedExactSentenceMedia.json', 'utf8'));
for (const [k, v] of Object.entries(m)) {
  if (k.includes('the-smart-money') || (v.wordId && v.wordId.includes('smart-money'))) {
    console.log(k);
    console.log('  wordId:', v.wordId);
    console.log('  sentence:', v.sentence);
    console.log('  imagePath:', v.imagePath);
  }
}
