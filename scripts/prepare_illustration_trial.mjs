import fs from 'node:fs';

// Read-only preparation: never updates curriculum or media mappings.
const inventory = JSON.parse(fs.readFileSync('docs/question-image-inventory.json', 'utf8'));
const theme = fs.readFileSync('src/styles/theme.css', 'utf8');
const root = theme.slice(theme.indexOf(':root {'), theme.indexOf('\n.dark {'));
const tokenNames = ['brand', 'brand-light', 'teal', 'teal-light', 'surface', 'card', 'text', 'text-secondary'];
const palette = Object.fromEntries(tokenNames.map(name => {
  const value = root.match(new RegExp(`--wp-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`))?.[1];
  if (!value) throw new Error(`Missing theme token: ${name}`);
  return [`--wp-${name}`, value];
}));
const luminance = hex => {
  const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
};
const contrast = (a, b) => {
  const values = [luminance(palette[a]), luminance(palette[b])].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
};
const contrastPairs = [['text', 'surface', 7], ['brand', 'brand-light', 3], ['teal', 'teal-light', 3]]
  .map(([foreground, background, minimum]) => {
    const ratio = contrast(`--wp-${foreground}`, `--wp-${background}`);
    if (ratio < minimum) throw new Error(`Contrast failed: ${foreground}/${background}`);
    return { foreground, background, ratio, minimum };
  });
const missing = inventory.items.filter(item => item.reason.startsWith('missing'));
const units = new Map();
for (const item of missing) {
  if (!units.has(item.unitId)) units.set(item.unitId, []);
  units.get(item.unitId).push(item);
}
const orderedUnits = [...units.keys()].sort((a, b) => {
  const priority = x => /numbers-counting|colors|prepositions-of-place|spatial-relations|shapes-geometry/.test(x) ? 0 : 1;
  return priority(a) - priority(b) || a.localeCompare(b);
});
const selected = [];
while (selected.length < 1000 && orderedUnits.some(unit => units.get(unit).length)) {
  for (const unit of orderedUnits) {
    if (selected.length === 1000) break;
    const item = units.get(unit).shift();
    if (!item) continue;
    const issues = [];
    if (/adult completes a realistic task|item or feature central to the adult/.test(item.scenario + item.question)) issues.push('generic-task-needs-concrete-action');
    if (/notice.*first|notices first|mentions? first/i.test(item.question)) issues.push('temporal-question-not-established-by-still-image');
    selected.push({ ...item, generationPrompt: undefined, batch: Math.floor(selected.length / 50) + 1,
      status: issues.length ? 'content-revision-required' : 'brief-review-required', issues,
      illustrationDirection: `Create an adult-oriented editable vector scene for this exact context: ${item.scenario}. Preserve all quantities, positions, objects, and assessed colors. The scene must support this question: ${item.question}. Use WordPix violet/teal for neutral accents only; retain assessed object colors. Use strong outlines, separated silhouettes, and no obscured assessed objects. No answer words, decorative numerals, logos, arrows pointing to the answer, or special highlighting of the correct choice. Do not invent a temporal sequence in a still image.`,
      review: { semantics: false, mobileLegibility: false, contrast: false, alternativeText: false, approved: false } });
  }
}
if (selected.length !== 1000 || new Set(selected.map(x => x.sceneId)).size !== 1000) throw new Error('Batch must contain 1000 unique scene IDs');
const output = { target: 1000, purpose: 'Candidate real-question batch; not generated images or production approvals', palette, contrastPairs,
  batchSize: 50, batchCount: 20, unitCount: new Set(selected.map(x => x.unitId)).size,
  contentRevisionRequired: selected.filter(x => x.issues.length).length, items: selected };
fs.writeFileSync('docs/illustration-trial-1000.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify({ candidates: selected.length, units: output.unitCount, contentRevisionRequired: output.contentRevisionRequired, contrastPairs }, null, 2));
