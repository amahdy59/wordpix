import fs from 'node:fs';

const summary = JSON.parse(fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/summary.json', 'utf8'));
console.log('Summary:', JSON.stringify(summary, null, 2));

const wbCounts = JSON.parse(fs.readFileSync('outputs/full-visual-expansion-2026-10-26-01a176fb/workbook-counts.json', 'utf8'));
console.log('Workbook counts:', JSON.stringify(wbCounts, null, 2));
