import fs from 'node:fs';

const meta1 = JSON.parse(fs.readFileSync('output/figma-slides-10015-meta.json', 'utf8'));
const images1 = meta1.meta?.images || meta1.images || meta1;
const set1 = new Set(Object.keys(images1));

const meta2 = JSON.parse(fs.readFileSync('output/figma-designed-visuals-meta.json', 'utf8'));
const images2 = meta2.meta?.images || meta2.images || meta2;
const set2 = new Set(Object.keys(images2));

const meta3 = JSON.parse(fs.readFileSync('output/figma-deck3-meta.json', 'utf8'));
const images3 = meta3.meta?.images || meta3.images || meta3;
const keys3 = Object.keys(images3);

let in1 = 0;
let in2 = 0;
let brandNew = 0;

for (const k of keys3) {
  if (set1.has(k)) in1++;
  else if (set2.has(k)) in2++;
  else brandNew++;
}

console.log({
  deck1_total: set1.size,
  deck2_total: set2.size,
  deck3_total: keys3.length,
  deck3_in_deck1: in1,
  deck3_in_deck2: in2,
  deck3_brand_new: brandNew
});
