import fs from 'node:fs';
import sharp from 'sharp';

async function check() {
  const files = fs.readdirSync('output').filter(f => f.startsWith('deck3_slide_')).sort((a,b) => {
    const na = parseInt(a.replace(/[^0-9]/g, '')) || 0;
    const nb = parseInt(b.replace(/[^0-9]/g, '')) || 0;
    return na - nb;
  });
  for (const f of files) {
    const meta = await sharp('output/' + f).metadata();
    console.log(`${f.padEnd(25)} ${meta.width}x${meta.height} ${meta.format}`);
  }
}
check();
