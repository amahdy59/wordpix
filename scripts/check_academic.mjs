import fs from 'node:fs';
import readline from 'node:readline';

async function checkAcademic() {
  const file = 'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv';
  const stream = fs.createReadStream(file);
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  let count = 0;
  for await (const line of rl) {
    if (line.includes('academic-life') && (line.includes('manuscript') || line.includes('editor') || line.includes('author') || line.includes('writing') || line.includes('writer'))) {
      console.log('Academic match:', line.slice(0, 160));
    }
  }
}

checkAcademic().catch(console.error);
