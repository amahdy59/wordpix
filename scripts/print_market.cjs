const fs = require('fs');
const market = JSON.parse(fs.readFileSync('src/app/data/usage/market.usage.json', 'utf8'));
market.forEach(l => {
  console.log(`=== ${l.lessonId} (${l.lessonName}) ===`);
  l.usage.scenes.forEach(s => {
    console.log(`Chunk ${s.chunkNumber}: [${s.targetWords.join(', ')}]`);
    console.log(`  Scenario: ${s.scenario}`);
    console.log(`  Q: ${s.check.question} -> ${s.check.expectedAnswer}`);
  });
});
