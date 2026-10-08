import fs from 'node:fs';

const root = 'output/illustrations/batch-01';
const entries = JSON.parse(fs.readFileSync(`${root}/reviewed-upload-manifest.json`, 'utf8'));
const receipt = JSON.parse(fs.readFileSync(`${root}/r2-upload-receipt.json`, 'utf8'));
if (entries.length !== 50 || receipt.verified !== 50 || receipt.assets.length !== 50) throw new Error('All 50 uploads must be verified first');
const media = {};
for (const entry of entries) {
  const remote = receipt.assets.find(x => x.sceneId === entry.sceneId);
  if (!remote?.verified || remote.key !== entry.key || remote.sha256 !== entry.sha256 || remote.bytes !== entry.bytes) throw new Error(`Missing verified receipt: ${entry.sceneId}`);
  if (entry.reviewStatus !== 'approved-media' || media[entry.sceneId]) throw new Error(`Invalid reviewed scene: ${entry.sceneId}`);
  media[entry.sceneId] = {
    reviewedScenario: entry.reviewedScenario,
    reviewedAnswer: entry.reviewedAnswer,
    imagePath: entry.key,
    imageAlt: entry.imageAlt,
  };
}
fs.writeFileSync('src/app/generated/reviewedUsageIllustrations.json', JSON.stringify(media, null, 2) + '\n');
const rows = entries.map(x => `| ${x.sceneId} | Reviewed | Lossless WebP | Verified |`).join('\n');
fs.writeFileSync('docs/illustration-batch-01-review.md', `# Illustration batch 01 media review\n\n50 authored scene illustrations reviewed and uploaded to new content-hashed R2 keys.\nNo existing R2 objects or vocabulary/sentence image mappings were overwritten.\n\nCorrections: smoother gradients; clearer mixing/pigment examples; seven-color rainbow;\ntriangular-face tetrahedron; unambiguous front/behind scene; double selection borders\non selected number/math displays. Exact counts and positions checked against contexts.\n\nLossless WebP: 262,554 bytes before final metadata checks; use the format report for\nthe exact encoded total. Every WebP decoded identically to its PNG. Dimensions 1200 × 675.\nS3 HEAD/GET and public CDN GET verified each asset's MIME, size and bytes.\nThe application attaches artwork only when the reviewed scenario and expected answer\nstill match; unchanged or unreviewed media remains as authored.\n\nThe images supplement the exact usage scenes. They do not replace unrelated\nword-specific sentences (such as two bags with a folders illustration).\nThis is an image-specific review, not a full WCAG conformance audit or a claim\nthat all lessons have been approved for release. Existing lesson approval gates remain.\n\n| Scene ID | Semantic/visual review | Delivery | R2/CDN |\n| --- | --- | --- | --- |\n${rows}\n`);
console.log('Attached 50 remotely verified scene media records.');
