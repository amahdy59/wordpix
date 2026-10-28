import fs from 'node:fs';

const p1 = 'src/app/data/releaseNotes.json';
const p2 = 'public/release-notes.json';

for (const p of [p1, p2]) {
  const d = JSON.parse(fs.readFileSync(p, 'utf8'));
  d.version = d.releases[0].version;
  fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');
}
console.log('Synchronized top-level version with releases[0].version in both files.');
