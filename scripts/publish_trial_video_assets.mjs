import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const { createClient } = require('./lib/r2.cjs');
const base = (process.env.VITE_ASSET_BASE_URL || '').replace(/\/+$/, '');
if (!base || new URL(base).protocol !== 'https:') throw new Error('HTTPS media base required');
const assets = [
  { id: 'video', file: 'public/learning-scenes/numbers-counting/numbers-counting-trial.webm', ext: 'webm', mime: 'video/webm' },
  { id: 'poster', file: 'public/learning-scenes/numbers-counting/numbers-counting-trial-poster.jpg', ext: 'jpg', mime: 'image/jpeg' },
].map(a => {
  const bytes = fs.readFileSync(a.file);
  if (!bytes.length || (a.ext === 'webm' ? bytes.subarray(0, 4).toString('hex') !== '1a45dfa3' : bytes.subarray(0, 3).toString('hex') !== 'ffd8ff')) throw new Error(`Invalid media: ${a.id}`);
  const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  return { ...a, bytes, sha256, key: `trial-media/v1/numbers-counting/${sha256}.${a.ext}` };
});
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ files: assets.length, bytes: assets.reduce((n, a) => n + a.bytes.length, 0), writes: 0 }));
} else {
  const client = createClient();
  const manifest = {};
  for (const a of assets) {
    const created = await client.putIfAbsent(a.key, a.bytes, { contentType: a.mime });
    const [head, bytes] = await Promise.all([client.head(a.key), client.get(a.key)]);
    const url = `${base}/${a.key}`;
    let response;
    for (let attempt = 0; attempt < 3; attempt++) {
      try { response = await fetch(url, { signal: AbortSignal.timeout(30000) }); break; }
      catch (error) { if (attempt === 2) throw error; }
    }
    const publicBytes = Buffer.from(await response.arrayBuffer());
    if (!head || head['content-type'] !== a.mime || !bytes?.equals(a.bytes) || !response.ok || response.headers.get('content-type')?.split(';')[0] !== a.mime || !publicBytes.equals(a.bytes)) throw new Error(`Remote verification failed: ${a.id}`);
    manifest[a.id] = { url, key: a.key, sha256: a.sha256, bytes: a.bytes.length, mime: a.mime };
    console.log(JSON.stringify({ id: a.id, created, verified: true, bytes: a.bytes.length }));
  }
  fs.writeFileSync('src/app/generated/trialVideoMedia.json', JSON.stringify(manifest, null, 2) + '\n');
}
