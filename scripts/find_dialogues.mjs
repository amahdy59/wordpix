import fs from 'node:fs';
import path from 'node:path';

const searchFiles = [
  'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv',
  'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv',
  'outputs/next-1000-required-images-2026-10-23/1000-app-image-requirements.csv',
  'src/app/learning/curriculum/curriculumData.ts',
  'src/app/exercises/exerciseContent.ts'
];

for (const f of searchFiles) {
  if (fs.existsSync(f)) {
    const raw = fs.readFileSync(f, 'utf8');
    if (raw.toLowerCase().includes('gratitude') || raw.toLowerCase().includes('thank you for everything')) {
      console.log(`Found match in ${f}!`);
      const lines = raw.split('\n');
      lines.forEach((l, idx) => {
        if (l.toLowerCase().includes('gratitude') || l.toLowerCase().includes('thank you for everything')) {
          console.log(`  [Line ${idx + 1}]: ${l.slice(0, 140)}`);
        }
      });
    }
  }
}
