const fs = require('fs');

function inspectUnit(unitPath) {
  const data = JSON.parse(fs.readFileSync(unitPath, 'utf8'));
  console.log(`\n=== UNIT: ${data[0].unitId} (${data[0].unitName}) ===`);
  data.forEach(l => {
    console.log(`  Lesson: ${l.lessonId} (${l.lessonName}) - ${l.usage.scenes.length} scenes`);
    l.usage.scenes.forEach(s => {
      console.log(`    Chunk ${s.chunkNumber}: [${s.targetWords.join(', ')}] -> ${s.check.expectedAnswer}`);
      console.log(`      Scenario: ${s.scenario}`);
      console.log(`      Q: ${s.check.question}`);
    });
  });
}

inspectUnit('src/app/data/usage/accessories-jewelry.usage.json');
inspectUnit('src/app/data/usage/everyday-clothing.usage.json');
inspectUnit('src/app/data/usage/footwear.usage.json');
