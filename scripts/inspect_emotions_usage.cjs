const fs = require('fs');
const content = JSON.parse(fs.readFileSync('src/app/data/usage/basic-emotions.usage.json', 'utf8'));
const scenes = content.scenes || content;
console.log('Scenes count:', scenes.length);
console.log('Sample scene 0:', JSON.stringify(scenes[0], null, 2));
