const fs = require('fs');

const f1 = 'src/app/data/usage/fruits.usage.json';
const f2 = 'src/app/data/usage/vegetables.usage.json';

if (fs.existsSync(f1)) {
  const d1 = JSON.parse(fs.readFileSync(f1, 'utf8'));
  console.log('fruits lessons:', d1.length);
  const sample = d1[0].usage.scenes[1]; // fruits-1-usage-scene-2
  console.log('fruits sample scenario:', sample?.scenario);
  console.log('fruits sample question:', sample?.check?.question);
}

if (fs.existsSync(f2)) {
  const d2 = JSON.parse(fs.readFileSync(f2, 'utf8'));
  console.log('vegetables lessons:', d2.length);
  const sample2 = d2[0].usage.scenes[2]; // vegetables-1-usage-scene-3
  console.log('vegetables sample scenario:', sample2?.scenario);
  console.log('vegetables sample question:', sample2?.check?.question);
}
