import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { imageKindOf } from './lib/image-format.mjs';

const require = createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const { createClient } = require('./lib/r2.cjs');
const root = 'output/illustrations/figma-reuse';
const entries = JSON.parse(fs.readFileSync(`${root}/reviewed-upload-manifest.json`, 'utf8'));
const dryRun = process.argv.includes('--dry-run');
const verifyOnly = process.argv.includes('--verify-only');
const delivery = path.resolve(`${root}/delivery`);
const publicBase = (process.env.VITE_ASSET_BASE_URL || '').replace(/\/+$/, '');
if (!publicBase || new URL(publicBase).protocol !== 'https:') throw new Error('HTTPS media base required');
if (new Set(entries.map(e => e.id)).size !== entries.length) throw new Error('Duplicate content IDs');
for (const e of entries) {
  const file = path.resolve(e.localFile);
  if (!file.startsWith(delivery + path.sep) || e.reviewStatus !== 'approved-media' ||
      !/^question-images\/v1\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/.test(e.key)) throw new Error(`Invalid reviewed entry: ${e.id}`);
  const bytes = fs.readFileSync(file);
  if (bytes.length !== e.bytes || imageKindOf(bytes.subarray(0, 16)) !== 'webp' ||
      crypto.createHash('sha256').update(bytes).digest('hex') !== e.sha256) throw new Error(`Invalid bytes: ${e.id}`);
}
if (dryRun) {
  console.log(JSON.stringify({ mode: 'dry-run', files: entries.length, bytes: entries.reduce((n,e)=>n+e.bytes,0), writes: 0 }));
} else {
  const client = createClient();
  let cursor = 0, uploaded = 0, alreadyPresent = 0;
  const assets = [];
  const save = () => fs.writeFileSync(`${root}/r2-upload-receipt.json`, JSON.stringify({ uploaded, alreadyPresent, verified: assets.length, assets }, null, 2) + '\n');
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < entries.length) {
      const e = entries[cursor++];
      const bytes = fs.readFileSync(e.localFile);
      const prior = await client.head(e.key);
      if (!prior) {
        if (verifyOnly) throw new Error(`Remote object absent: ${e.id}`);
        const created = await client.putIfAbsent(e.key, bytes, { contentType: 'image/webp', immutable: true });
        if (created) uploaded++;
        else alreadyPresent++;
      } else alreadyPresent++;
      // Never overwrite an existing key, even if its contents fail verification.
      const [headers, remote] = await Promise.all([client.head(e.key), client.get(e.key)]);
      if (!headers || headers['content-type'] !== 'image/webp' || Number(headers['content-length']) !== bytes.length || !remote?.equals(bytes)) throw new Error(`R2 verification failed: ${e.id}`);
      const url = `${publicBase}/${e.key}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const cdn = Buffer.from(await response.arrayBuffer());
      if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== 'image/webp' || !cdn.equals(bytes)) throw new Error(`CDN verification failed: ${e.id}`);
      assets.push({ id: e.id, key: e.key, sha256: e.sha256, bytes: bytes.length, url, verified: true });
      save();
      if (assets.length % 10 === 0) console.log(`Verified ${assets.length}/${entries.length}`);
    }
  }));
  save();
  console.log(JSON.stringify({ uploaded, alreadyPresent, verified: assets.length }));
}
