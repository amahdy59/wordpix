import fs from 'node:fs';
import readline from 'node:readline';

async function searchPrompt(keyword) {
  const files = [
    'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-all-additional-image-prompts.csv',
    'outputs/full-visual-expansion-2026-10-26-01a176fb/WordPix-next-3000-image-prompts.csv',
    'docs/question-sentence-image-inventory.csv'
  ];

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const stream = fs.createReadStream(f);
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    for await (const line of rl) {
      if (line.toLowerCase().includes(keyword.toLowerCase())) {
        console.log(`[${f}] MATCH (${keyword}):`, line.slice(0, 160));
        return;
      }
    }
  }
}

async function main() {
  await searchPrompt('prototype');
  await searchPrompt('elements of style');
  await searchPrompt('hemingway');
  await searchPrompt('bricklayer');
  await searchPrompt('pipetting');
}

main().catch(console.error);
