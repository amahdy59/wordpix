import fs from 'node:fs';
const root = 'output/illustrations/figma-reuse';
const reviews = JSON.parse(fs.readFileSync(`${root}/content-review.json`, 'utf8'));
const receipt = JSON.parse(fs.readFileSync(`${root}/r2-upload-receipt.json`, 'utf8'));
const verified = new Map(receipt.assets.filter(a => a.verified).map(a => [a.key, a]));
const sentences = {}, scenes = {}, readings = {};
for (const r of reviews) {
  if (r.status === 'approved' && !verified.has(r.imagePath)) throw new Error(`Remote verification absent: ${r.nodeId}`);
  const { status, reason, reviewedSentence, reviewedScenario, reviewedAnswer, imagePath, imageAlt, imageFallbacks, nodeId } = r;
  if (r.kind === 'sentence') sentences[r.wordId] = { status, reason, reviewedSentence, imagePath, imageAlt, imageFallbacks, sourceNode: nodeId };
  if (r.kind === 'geometry-scene' && status === 'approved') scenes[r.sceneId] = { reviewedScenario, reviewedAnswer, imagePath, imageAlt, imageFallbacks, sourceNode: nodeId };
  if (r.kind === 'reading') readings[r.clusterId] = { status, reason, reviewedText: r.reviewedText, imagePath, imageAlt, sourceNode: nodeId };
}
fs.writeFileSync('src/app/generated/reviewedFigmaQuestionMedia.json', JSON.stringify({ sentences, scenes, readings }, null, 2) + '\n');
console.log(JSON.stringify({ sentenceDecisions: Object.keys(sentences).length, scenes: Object.keys(scenes).length, readings: Object.keys(readings).length }));
