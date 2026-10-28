import fs from 'node:fs';
import readline from 'node:readline';

async function checkWriter() {
  const file = 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv';
  const stream = fs.createReadStream(file);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  for await (const line of rl) {
    const l = line.toLowerCase();
    if (l.includes('manuscript') || l.includes('red pen') || l.includes('edit') && l.includes('novel')) {
      console.log('Match:', line.slice(0, 160));
    }
  }
}

checkWriter().catch(console.error);
