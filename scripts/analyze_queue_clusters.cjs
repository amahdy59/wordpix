const fs = require('fs');
const d = JSON.parse(fs.readFileSync('output/antigravity-image-handoff-2026-10-08/figma-scene-review-queue.json', 'utf8'));
const pending = d.items.filter(x => x.status === 'not-semantically-approved');

const unitGroups = {
  vector: ['numbers-counting', 'colors', 'shapes-geometry'],
  residual: ['bedroom', 'bathroom', 'kitchen', 'living-room', 'fruits', 'vegetables'],
  foundational: ['classroom', 'market', 'daily-routines', 'daily-action-verbs', 'movement-verbs', 'hand-actions', 'telling-time', 'days-months', 'giving-directions', 'shopping-mall', 'toys-games', 'indoor-hobbies', 'creative-hobbies', 'everyday-clothing', 'accessories-jewelry', 'footwear', 'prepositions-of-place'],
  clinical: ['hospital', 'pharmacy', 'dentist', 'dental-clinic', 'eye-doctor', 'hair-salon', 'human-body-head-and-face', 'human-body-upper-body', 'human-body-lower-body', 'human-body-hands-and-feet', 'skin-hair'],
  social: ['wedding', 'graduation', 'birthday-party', 'life-events', 'family', 'extended-family', 'relationships-roles', 'social-situations', 'ages-life-stages', 'physical-appearance', 'facial-expressions', 'complex-feelings', 'basic-emotions', 'personality-character']
};

const groups = {
  vectorCovered: 0,
  residualRoomsFood: 0,
  foundationalA1A2: 0,
  clinicalMedical: 0,
  socialPeople: 0,
  other: 0
};

const perGroupUnits = {
  vectorCovered: {},
  residualRoomsFood: {},
  foundationalA1A2: {},
  clinicalMedical: {},
  socialPeople: {},
  other: {}
};

for (const item of pending) {
  const m = item.sceneId.match(/^([a-z0-9-]+?)-\d+-usage-scene-\d+$/);
  const u = m ? m[1] : item.sceneId;
  let g = 'other';
  if (unitGroups.vector.includes(u)) g = 'vectorCovered';
  else if (unitGroups.residual.includes(u)) g = 'residualRoomsFood';
  else if (unitGroups.foundational.includes(u)) g = 'foundationalA1A2';
  else if (unitGroups.clinical.includes(u)) g = 'clinicalMedical';
  else if (unitGroups.social.includes(u)) g = 'socialPeople';

  groups[g]++;
  perGroupUnits[g][u] = (perGroupUnits[g][u] || 0) + 1;
}

console.log('Group counts:', JSON.stringify(groups, null, 2));
console.log('Total:', Object.values(groups).reduce((a,b)=>a+b, 0));
for (const [k, v] of Object.entries(perGroupUnits)) {
  console.log(`\n--- ${k} (${groups[k]} items) ---`);
  console.log(Object.entries(v).map(([unit, count]) => `${unit}: ${count}`).join(', '));
}
