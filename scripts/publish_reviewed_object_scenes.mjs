import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const { createClient } = require('./lib/r2.cjs');
const reviewFile = process.argv.find(a => a.startsWith('--review='))?.slice(9) || 'docs/figma-object-scene-batch-02.json';
const reviews = JSON.parse(fs.readFileSync(reviewFile, 'utf8')).items.filter(r => r.status === 'approved');
if (!reviews.length || new Set(reviews.map(r => r.sceneId)).size !== reviews.length) throw new Error('Empty review or duplicate IDs');
const usage = fs.readdirSync('src/app/data/usage').filter(f => f.endsWith('.usage.json')).flatMap(f => JSON.parse(fs.readFileSync(`src/app/data/usage/${f}`, 'utf8')));
const scenes = new Map(usage.flatMap(l => l.usage.scenes.map(s => [`${l.lessonId}-usage-scene-${s.chunkNumber}`, s])));
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
async function retryRemote(operation, label) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try { return await operation(); }
    catch (error) {
      if (attempt === 2) throw error;
      console.log(`Retrying transient remote request: ${label}`);
    }
  }
}
const prepared = [];
for (const r of reviews) {
  const scene = scenes.get(r.sceneId);
  if (!/^[a-f0-9]{40}$/.test(r.sourceRef) || !/^[a-z0-9-]+-usage-scene-\d+$/.test(r.sceneId) ||
      scene?.scenario !== r.reviewedScenario || scene?.check.expectedAnswer !== r.reviewedAnswer || !r.imageAlt?.trim()) throw new Error(`Stale or invalid review: ${r.sceneId}`);
  const source = fs.readFileSync(`output/illustrations/figma-reuse/originals/${r.sourceRef}.source`);
  if (hash(source) !== r.sourceSha256) throw new Error(`Source changed: ${r.sceneId}`);
  const encoding = r.encoding || { width: 1280, height: 1280, lossless: true, effort: 6 };
  const photoProfile = encoding.width === 1024 && encoding.height === 1024 && encoding.quality === 85 && encoding.effort === 5;
  const losslessProfile = encoding.width === 1280 && encoding.height === 1280 && encoding.lossless === true && encoding.effort === 6;
  if (!photoProfile && !losslessProfile) throw new Error(`Unreviewed encoding profile: ${r.sceneId}`);
  const bytes = await sharp(source).rotate().resize({ width: encoding.width, height: encoding.height, fit: 'inside', withoutEnlargement: true })
    .webp(photoProfile ? { quality: 85, effort: 5 } : { lossless: true, effort: 6 }).toBuffer();
  if (hash(bytes) !== r.sha256 || bytes.length !== r.bytes || r.imagePath !== `question-images/v1/${r.sceneId}/${r.sha256}.webp`) throw new Error(`Delivery changed: ${r.sceneId}`);
  prepared.push({ r, bytes });
}
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ reviewed: prepared.length, bytes: prepared.reduce((n, p) => n + p.bytes.length, 0), writes: 0 }));
} else {
  const client = createClient();
  const base = (process.env.VITE_ASSET_BASE_URL || '').replace(/\/+$/, '');
  if (!base || new URL(base).protocol !== 'https:') throw new Error('HTTPS media base required');
  const manifestFile = 'src/app/generated/reviewedFigmaObjectScenes.json';
  const manifest = fs.existsSync(manifestFile) ? JSON.parse(fs.readFileSync(manifestFile, 'utf8')) : {};
  for (const { r, bytes } of prepared) {
    if (!process.argv.includes('--verify-only')) await retryRemote(() => client.putIfAbsent(r.imagePath, bytes, { contentType: 'image/webp' }), r.sceneId);
    const [head, remote] = await Promise.all([
      retryRemote(() => client.head(r.imagePath), r.sceneId),
      retryRemote(() => client.get(r.imagePath), r.sceneId),
    ]);
    if (!remote?.equals(bytes) || head?.['content-type'] !== 'image/webp' || Number(head?.['content-length']) !== bytes.length) throw new Error(`R2 verification failed: ${r.sceneId}`);
    let verified = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(`${base}/${r.imagePath}`, { signal: AbortSignal.timeout(30000) });
        verified = response.ok && response.headers.get('content-type')?.split(';')[0] === 'image/webp' && Buffer.from(await response.arrayBuffer()).equals(bytes);
      } catch { /* Retry a transient read without modifying the asset. */ }
      if (verified) break;
    }
    if (!verified) throw new Error(`CDN verification failed: ${r.sceneId}`);
    const entry = { reviewedScenario: r.reviewedScenario, reviewedAnswer: r.reviewedAnswer, imagePath: r.imagePath, imageAlt: r.imageAlt, sourceNode: r.sourceNode };
    if (manifest[r.sceneId] && JSON.stringify(manifest[r.sceneId]) !== JSON.stringify(entry)) throw new Error(`Existing mapping preserved: ${r.sceneId}`);
    manifest[r.sceneId] = entry;
    console.log(`Verified media: ${r.sceneId}`);
  }
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + '\n');
  console.log(JSON.stringify({ verified: prepared.length, existingAssetsPreserved: true }));
}
