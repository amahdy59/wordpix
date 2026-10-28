import fs from 'node:fs';

const queue = JSON.parse(fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/queue-data.json', 'utf8'));
console.log('Queue keys:', Object.keys(queue));
if (Array.isArray(queue)) {
  console.log('Queue is array, length:', queue.length);
  console.log('Sample item:', queue[0]);
} else {
  for (const [k, v] of Object.entries(queue)) {
    console.log(k, Array.isArray(v) ? `Array length: ${v.length}` : typeof v);
  }
}
