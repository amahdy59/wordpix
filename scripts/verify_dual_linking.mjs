import { resolveSentenceMedia } from '../src/app/content/sentenceMedia.ts';
import fs from 'node:fs';

const media = JSON.parse(fs.readFileSync('src/app/generated/reviewedExactSentenceMedia.json', 'utf8'));

// Find an entry with literalImagePath or imageFallbacks kind === 'literal'
let sampleKey = null;
for (const [k, v] of Object.entries(media)) {
  if (v.literalImagePath || (v.imageFallbacks && v.imageFallbacks.some(fb => fb.kind === 'literal'))) {
    sampleKey = k;
    break;
  }
}

if (sampleKey) {
  console.log('Found dual-linked idiom:', sampleKey);
  console.log(JSON.stringify(media[sampleKey], null, 2));

  const litKey = `${sampleKey}-literal`;
  if (media[litKey]) {
    console.log('\nFound dedicated literal entry:', litKey);
    console.log(JSON.stringify(media[litKey], null, 2));
  }
} else {
  console.log('No dual-linked idiom found?');
}
