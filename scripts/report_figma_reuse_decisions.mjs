import fs from 'node:fs';
const root = 'output/illustrations/figma-reuse';
const reviews = JSON.parse(fs.readFileSync(`${root}/content-review.json`, 'utf8'));
const vectors = JSON.parse(fs.readFileSync('src/app/generated/reviewedUsageIllustrations.json', 'utf8'));
const rejected = reviews.filter(r => r.status === 'withheld').map(r => ({
  questionId: r.wordId ? `sentence:${r.wordId}` : r.clusterId ? `reading:${r.clusterId}` : r.sceneId,
  sourceNode: r.nodeId,
  sourceRef: r.sourceRef,
  reason: r.reason,
  currentText: r.reviewedSentence || r.reviewedScenario || r.reviewedText,
  existingReplacement: vectors[r.sceneId]?.imagePath || '',
  nextAction: vectors[r.sceneId] ? 'Covered by reviewed vector; source photo remains withheld.' : 'Replacement artwork needed; use labelled placeholder and textual evidence.',
  generationPrompt: `Illustrate exactly: ${r.reviewedSentence || r.reviewedScenario || r.reviewedText}. Show the specified objects, quantities, colors, people, positions, and actions clearly at phone size. Adult learning context. Keep all critical clues within the frame. No assessed word, answer labels, decorative numerals, captions, or watermarks. Verify every count and geometric or anatomical relationship.`,
}));
const columns = ['questionId', 'sourceNode', 'reason', 'currentText', 'existingReplacement', 'nextAction', 'generationPrompt'];
const quote = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
fs.writeFileSync('docs/figma-image-regeneration-requests.csv', [columns.join(','), ...rejected.map(r => columns.map(c => quote(r[c])).join(','))].join('\n') + '\n');
fs.writeFileSync('docs/figma-image-regeneration-requests.json', JSON.stringify({ reviewedCandidates: reviews.length, withheld: rejected.length, replacementsNeeded: rejected.filter(r => !r.existingReplacement).length, items: rejected }, null, 2) + '\n');
const full = JSON.parse(fs.readFileSync(`${root}/full-matching-decisions.json`, 'utf8'));
const approvedRefs = new Set(reviews.filter(r => r.status === 'approved').map(r => r.sourceRef));
const rejectedRefs = new Set(rejected.map(r => r.sourceRef));
const rows = full.decisions.filter(r => r.sceneId).map(r => ({ nodeId: r.nodeId, sceneId: r.sceneId, sourceRef: r.imageRefs[0],
  status: approvedRefs.has(r.imageRefs[0]) ? 'approved-for-recorded-question-only' : rejectedRefs.has(r.imageRefs[0]) ? 'withheld-after-visual-review' : 'withheld-pending-content-and-visual-review',
  metadataMatch: r.status === 'candidate-for-visual-review', currentScenario: r.scene.scenario }));
fs.writeFileSync('docs/figma-scene-library-review-status.json', JSON.stringify({ placements: rows.length, sources: new Set(rows.map(r => r.sourceRef)).size, scope: 'Full-file scene inventory. Metadata matching is not visual approval. Assets remain excluded until their exact question passes review. A rejected photo may already be covered by a separately reviewed vector.', items: rows }, null, 2) + '\n');
console.log(JSON.stringify({ withheld: rejected.length, replacementsNeeded: rejected.filter(r => !r.existingReplacement).length, scenePlacements: rows.length }));
