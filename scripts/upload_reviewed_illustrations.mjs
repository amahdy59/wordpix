import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { imageKindOf } from './lib/image-format.mjs';

const require = createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const { createClient } = require('./lib/r2.cjs');
const dryRun = process.argv.includes('--dry-run');
const verifyOnly = process.argv.includes('--verify-only');
const entries = JSON.parse(fs.readFileSync('output/illustrations/batch-01/reviewed-upload-manifest.json', 'utf8'));
const root = path.resolve('output/illustrations/batch-01/delivery');
if (entries.length !== 50 || new Set(entries.map(x => x.sceneId)).size !== 50) throw new Error('Expected 50 reviewed scene IDs');
const publicBase = (process.env.VITE_ASSET_BASE_URL || '').replace(/\/+$/, '');
if (!publicBase || new URL(publicBase).protocol !== 'https:') throw new Error('A HTTPS public media base is required');
const client = createClient();
let uploaded = 0, alreadyPresent = 0, verified = 0;
const receipts = [];
for (const entry of entries) {
  const full = path.resolve(entry.localFile);
  if (!full.startsWith(root + path.sep)) throw new Error(`Outside delivery directory: ${entry.sceneId}`);
  if (entry.reviewStatus !== 'approved-media' || !/^usage-illustrations\/v1\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/.test(entry.key)) throw new Error(`Unreviewed or invalid key: ${entry.sceneId}`);
  const bytes = fs.readFileSync(full);
  const hash = crypto.createHash('sha256').update(bytes).digest('hex');
  if (hash !== entry.sha256 || bytes.length !== entry.bytes || imageKindOf(bytes.subarray(0, 16)) !== 'webp') throw new Error(`Invalid delivery bytes: ${entry.sceneId}`);
  if (dryRun) continue;
  const previous = await client.head(entry.key);
  if (!previous) {
    if (verifyOnly) throw new Error(`Missing remote asset: ${entry.sceneId}`);
    const created = await client.putIfAbsent(entry.key, bytes, { contentType: 'image/webp', immutable: true });
    if (created) uploaded++;
    else alreadyPresent++;
  } else alreadyPresent++;
  const remoteHeaders = await client.head(entry.key);
  const remoteBytes = await client.get(entry.key);
  if (!remoteHeaders || remoteHeaders['content-type'] !== 'image/webp' || Number(remoteHeaders['content-length']) !== bytes.length || !remoteBytes?.equals(bytes)) throw new Error(`R2 verification failed: ${entry.sceneId}`);
  const url = `${publicBase}/${entry.key}`;
  const publicResponse = await fetch(url, { signal: AbortSignal.timeout(30000) });
  const publicBytes = Buffer.from(await publicResponse.arrayBuffer());
  if (!publicResponse.ok || publicResponse.headers.get('content-type')?.split(';')[0] !== 'image/webp' || !publicBytes.equals(bytes)) throw new Error(`Public CDN verification failed: ${entry.sceneId} (${publicResponse.status})`);
  verified++;
  receipts.push({ sceneId: entry.sceneId, key: entry.key, sha256: hash, bytes: bytes.length, url, verified: true });
  if (verified % 10 === 0) console.log(`verified ${verified}/50`);
}
if (dryRun) {
  console.log(JSON.stringify({ mode: 'dry-run', reviewedFiles: entries.length, bytes: entries.reduce((n,x)=>n+x.bytes,0), prefix: 'usage-illustrations/v1/', writes: 0 }));
} else {
  fs.writeFileSync('output/illustrations/batch-01/r2-upload-receipt.json', JSON.stringify({ uploaded, alreadyPresent, verified, assets: receipts }, null, 2) + '\n');
  console.log(JSON.stringify({ uploaded, alreadyPresent, verified }));
}
