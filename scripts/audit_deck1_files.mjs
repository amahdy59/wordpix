import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const META_PATH = path.join(ROOT, 'output/figma-slides-10015-meta.json');
const HASHES_PATH = path.join(ROOT, 'output/all_ordered_hashes.json');
const IMAGES_DIR = path.join(ROOT, 'output/figma-slides-10015-images');

const meta = JSON.parse(fs.readFileSync(META_PATH, 'utf8'));
const images = meta.meta?.images || meta.images || meta;
const allMetaHashes = Object.keys(images);

const orderedHashes = JSON.parse(fs.readFileSync(HASHES_PATH, 'utf8'));

console.log(`Total meta hashes: ${allMetaHashes.length}`);
console.log(`Ordered hashes: ${orderedHashes.length}`);

// Check existing downloaded files
const downloadedFiles = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.webp') || f.endsWith('.png'));
console.log(`Files in output/figma-slides-10015-images: ${downloadedFiles.length}`);

// Check format of files in output/figma-slides-10015-images
const sampleFiles = downloadedFiles.slice(0, 10);
console.log('Sample files:', sampleFiles);
