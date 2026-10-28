import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
loadEnv();

const FIGMA_TOKEN = process.env.Figma_token || process.env.FIGMA_TOKEN;
const FILE_KEY = 'lWC9b9Jo16MxOTd9MAOeuT';

async function checkNewDeck() {
  console.log(`Checking Figma API for file: ${FILE_KEY}`);

  // Test 1: Public web check
  const webRes = await fetch(`https://www.figma.com/slides/${FILE_KEY}`);
  console.log(`Public web status: ${webRes.status}`);

  // Test 2: API /images
  console.log('Querying /v1/files/:key/images ...');
  const imgRes = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/images`, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN }
  });
  console.log(`Images status: ${imgRes.status}`);
  if (imgRes.ok) {
    const data = await imgRes.json();
    const images = data.meta?.images || data.images || {};
    const count = Object.keys(images).length;
    console.log(`Total image fills in meta.images: ${count}`);
    fs.writeFileSync('output/figma-deck3-meta.json', JSON.stringify(data, null, 2));
  } else {
    console.log('Images error:', await imgRes.text());
  }
}

checkNewDeck().catch(console.error);
