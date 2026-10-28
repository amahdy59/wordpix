import fs from 'node:fs';

const raw = fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv', 'utf8');
const lines = raw.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].toLowerCase().includes('photographer')) {
    console.log(`Line ${i}: ${lines[i].slice(0, 160)}`);
  }
}
