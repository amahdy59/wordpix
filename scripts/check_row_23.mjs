import fs from 'node:fs';
import readline from 'node:readline';

async function checkRow23() {
  const file = 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv';
  const stream = fs.createReadStream(file);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let count = 0;
  for await (const line of rl) {
    if (line.startsWith('23,') || line.startsWith('"23",') || line.includes('VIS-BC080EBF2B8E')) {
      console.log('Row 23:', line);
    }
  }
}

checkRow23().catch(console.error);
