import fs from 'node:fs';

const lines = fs.readFileSync('output/figma-slides-10015-images/manifest.csv', 'utf8').split('\n').filter(Boolean);
const categories = {};

for (let i = 1; i < lines.length; i++) {
  const parts = lines[i].split(',');
  const cat = parts[1];
  categories[cat] = (categories[cat] || 0) + 1;
}

console.log('Categories in output/figma-slides-10015-images/manifest.csv:', categories);
