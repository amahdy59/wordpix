const fs = require('fs');
const sm = JSON.parse(fs.readFileSync('src/app/data/usage/supermarket.usage.json', 'utf8'));
console.log('Total supermarket lessons:', sm.length);
sm.slice(0, 5).forEach(l => {
  console.log(`=== ${l.lessonId} (${l.lessonName}) ===`);
  l.usage.scenes.forEach(s => {
    console.log(`Chunk ${s.chunkNumber}: [${s.targetWords.join(', ')}]`);
    console.log(`  Scenario: ${s.scenario}`);
    console.log(`  Q: ${s.check.question} -> ${s.check.expectedAnswer}`);
  });
});
