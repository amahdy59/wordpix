import fs from 'node:fs';

const media = JSON.parse(fs.readFileSync('src/app/generated/reviewedExactSentenceMedia.json', 'utf8'));
const entries = Object.entries(media);

console.log(`Total entries: ${entries.length}`);

// Sample entries from the newly added ones (past index 9980)
console.log('--- Sample new entry at 10000 ---');
console.log(entries[10000]);

console.log('--- Sample new entry at 12000 ---');
console.log(entries[12000]);

console.log('--- Sample new entry at 15000 ---');
console.log(entries[15000]);
