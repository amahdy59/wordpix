import { resolveSentenceMedia } from '../src/app/content/sentenceMedia.ts';

const res = resolveSentenceMedia(
  'the-smart-money',
  "The smart money is moving into renewable energy — that's where the growth is."
);
console.log('Result for the-smart-money:', res);
