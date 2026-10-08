const fs = require('fs');
const sharp = require('sharp');

const c = JSON.parse(fs.readFileSync('output/illustrations/figma-reuse/library-review/candidates.json', 'utf8'));
const classroomItems = c.filter(x => x.sceneId.startsWith('classroom'));

async function inspect() {
  console.log(`Inspecting ${classroomItems.length} classroom sources...`);
  for (const item of classroomItems) {
    const exists = fs.existsSync(item.sourceFile);
    let dims = '';
    if (exists) {
      const meta = await sharp(item.sourceFile).metadata();
      dims = `${meta.width}x${meta.height} (${meta.format})`;
    }
    console.log(`[${item.sceneId}] Answer: ${item.scene.check.expectedAnswer} | Exists: ${exists} | ${dims}`);
    console.log(`   Scenario: ${item.scene.scenario}`);
    console.log(`   Target words: ${(item.scene.targetWords || []).join(', ')}`);
  }
}

inspect().catch(error => { console.error(error); process.exitCode = 1; });
