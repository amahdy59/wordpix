import fs from 'node:fs';
import path from 'node:path';

function checkDir(d) {
  if (!fs.existsSync(d)) {
    console.log(`Directory ${d} DOES NOT EXIST.`);
    return;
  }
  const files = fs.readdirSync(d);
  console.log(`Directory ${d}: ${files.length} items`);
  if (files.includes('manifest.csv')) console.log(`  Contains manifest.csv`);
  if (files.includes('gallery.html')) console.log(`  Contains gallery.html`);
}

checkDir('output/figma-slides-10015-images');
checkDir('public/question-images/v2/_ALL_3411_FIGMA_SLIDES');
checkDir('public/question-images/v2');
