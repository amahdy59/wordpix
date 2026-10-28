import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const searchFiles = [
  'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv',
  'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-literal-scenes-first.csv',
  'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv',
  'outputs/next-1000-required-images-2026-10-23/1000-app-image-requirements.csv',
  'docs/question-sentence-image-inventory.csv'
];

for (const f of searchFiles) {
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    const lines = raw.split('\n');
    let figCount = 0;
    let litCount = 0;
    for (const l of lines) {
      if (l.toLowerCase().includes('figurative')) figCount++;
      if (l.toLowerCase().includes('literal')) litCount++;
    }
    console.log(`${f}: figurative=${figCount}, literal=${litCount}`);
  }
}
