const fs = require('fs');
const m = JSON.parse(fs.readFileSync('output/illustrations/figma-reuse/reviewed-upload-manifest.json', 'utf8'));
console.log('Figma reuse item keys:', Object.keys(m[0]));
console.log('First 5 items:', m.slice(0, 5).map(e => ({ id: e.id, target: e.targetWord || e.word, path: e.imagePath })));
