const fs = require('fs');
const sm = JSON.parse(fs.readFileSync('src/app/data/usage/supermarket.usage.json', 'utf8'));

console.log('Supermarket total lessons:', sm.length);
let totalScenes = 0;
const lessonSummary = [];

sm.forEach(l => {
  totalScenes += l.usage.scenes.length;
  lessonSummary.push({
    lessonId: l.lessonId,
    lessonName: l.lessonName,
    sceneCount: l.usage.scenes.length,
    words: l.usage.scenes.map(s => s.check.expectedAnswer)
  });
});

console.log('Total scenes in supermarket.usage.json:', totalScenes);
lessonSummary.forEach(ls => {
  console.log(`${ls.lessonId} (${ls.lessonName}): ${ls.words.join(', ')}`);
});
