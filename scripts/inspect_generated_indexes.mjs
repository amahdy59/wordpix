import fs from 'node:fs';

const fqm = JSON.parse(fs.readFileSync('src/app/generated/reviewedFigmaQuestionMedia.json', 'utf8'));
console.log('reviewedFigmaQuestionMedia count:', Object.keys(fqm).length);
console.log('Sample entry:', Object.entries(fqm)[0]);

const rgsm = JSON.parse(fs.readFileSync('src/app/generated/reviewedGeneratedSceneMedia.json', 'utf8'));
console.log('reviewedGeneratedSceneMedia count:', Object.keys(rgsm).length);
console.log('Sample entry:', Object.entries(rgsm)[0]);
