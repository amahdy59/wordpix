import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

const terms = ['Mark Jenkins', 'Aura H-1', 'Mini Dialogue', 'Genomix', 'Prusia', 'Rev. 3'];

async function searchFile(file) {
  if (!fs.existsSync(file)) return;
  const stream = fs.createReadStream(file);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    for (const t of terms) {
      if (line.toLowerCase().includes(t.toLowerCase())) {
        console.log(`[${path.basename(file)}:${lineNum}] Found "${t}":\n  ${line.slice(0, 160)}`);
      }
    }
  }
}

async function main() {
  const allCsvs = [
    'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv',
    'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv',
    'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-literal-scenes-first.csv',
    'outputs/next-1000-required-images-2026-10-23/1000-app-image-requirements.csv',
    'docs/question-sentence-image-inventory.csv'
  ];

  for (const c of allCsvs) {
    await searchFile(c);
  }
}

main().catch(console.error);
