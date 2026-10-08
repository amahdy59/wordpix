import fs from 'node:fs/promises';
const words=JSON.parse(await fs.readFile('docs/lesson-content-audit/hadith-review-baseline-vocabulary.json','utf8'));
for(const [number,items] of Object.entries(words)) console.log(number,items.map(word=>`${word.term} (${word.partOfSpeech})`).join(' | '));
