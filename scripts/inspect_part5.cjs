const fs = require('fs');
const sm = JSON.parse(fs.readFileSync('src/app/data/usage/supermarket.usage.json', 'utf8'));
sm.slice(20).forEach(l => {
  console.log(`=== ${l.lessonId} (${l.lessonName}) ===`);
  l.usage.scenes.forEach(s => {
    console.log(`  Chunk ${s.chunkNumber}: [${s.targetWords.join(', ')}] -> ${s.check.expectedAnswer}`);
    console.log(`    Scenario: ${s.scenario}`);
    console.log(`    Q: ${s.check.question}`);
  });
});
