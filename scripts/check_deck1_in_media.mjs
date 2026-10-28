import fs from 'node:fs';

const media = JSON.parse(fs.readFileSync('src/app/generated/reviewedExactSentenceMedia.json', 'utf8'));

// Check sample entries from Set 1 (dresser, wardrobe) and Set 2 (razor-nail-clipper)
console.log('dresser in media:', media['sentence-bedroom-1-dresser-6a8a6a0e2d']);
console.log('razor in media:', media['sentence-bathroom-3-razor-92e18cfe9b']);
