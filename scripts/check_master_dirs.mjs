import fs from 'node:fs';

const v2 = 'public/question-images/v2';
const items = fs.readdirSync(v2);
const masterDirs = items.filter(i => i.startsWith('_ALL_'));

console.log('Master folders in public/question-images/v2:');
for (const md of masterDirs) {
  const count = fs.readdirSync(`${v2}/${md}`).length;
  console.log(`  ${md}: ${count} files`);
}
