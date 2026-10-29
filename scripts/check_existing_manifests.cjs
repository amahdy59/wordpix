const fs = require('fs');

if (fs.existsSync('output/illustrations/figma-reuse/reviewed-upload-manifest.json')) {
  const m = JSON.parse(fs.readFileSync('output/illustrations/figma-reuse/reviewed-upload-manifest.json', 'utf8'));
  console.log('figma-reuse manifest count:', m.length);
  const units = {};
  m.forEach(e => {
    const u = (e.sceneId || '').split('-usage-scene-')[0];
    units[u] = (units[u] || 0) + 1;
  });
  console.log('figma-reuse units:', units);
}

if (fs.existsSync('output/illustrations/batch-01/reviewed-upload-manifest.json')) {
  const m2 = JSON.parse(fs.readFileSync('output/illustrations/batch-01/reviewed-upload-manifest.json', 'utf8'));
  console.log('batch-01 manifest count:', m2.length);
  const units2 = {};
  m2.forEach(e => {
    const u = (e.sceneId || '').split('-usage-scene-')[0];
    units2[u] = (units2[u] || 0) + 1;
  });
  console.log('batch-01 units:', units2);
}
