import fs from 'node:fs';

const meta = JSON.parse(fs.readFileSync('output/figma-slides-10015-meta.json', 'utf8'));
const images = meta.meta?.images || meta.images || meta;
const hashes = Object.keys(images);

console.log(`Total images in figma-slides-10015-meta.json: ${hashes.length}`);

// Test first URL
const sampleHash = hashes[0];
const sampleUrl = images[sampleHash];
console.log(`Testing URL for ${sampleHash}...`);

const res = await fetch(sampleUrl);
console.log(`Fetch status: ${res.status} ${res.statusText}`);
