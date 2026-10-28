#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const { loadEnv } = require('./lib/env.cjs');
const { createClient } = require('./lib/r2.cjs');

loadEnv();

const ROOT = path.resolve('.');
const TASKS_PATH = path.join(ROOT, 'output/deck3_tasks.json');
const tasks = JSON.parse(fs.readFileSync(TASKS_PATH, 'utf8')).slice(0, 5);

const r2 = createClient();
console.log("Testing sync for first 5 tasks...");

for (const task of tasks) {
  console.log(`Downloading Task ${task.index}: ${task.targetPhrase}...`);
  const res = await fetch(task.url);
  const rawBuf = Buffer.from(await res.arrayBuffer());
  const webpBuffer = await sharp(rawBuf)
    .resize({ width: 1536, height: 1152, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toBuffer();
  const sha256 = crypto.createHash('sha256').update(webpBuffer).digest('hex');
  const r2Key = `question-images/v2/context-scenes/${sha256}.webp`;
  const exists = await r2.exists(r2Key);
  console.log(`Task ${task.index} optimized: ${webpBuffer.length} bytes (sha256: ${sha256.slice(0, 10)}...). R2 exists: ${exists}`);
  if (!exists) {
    await r2.put(r2Key, webpBuffer, { contentType: 'image/webp' });
    console.log(`  Uploaded to ${r2Key}`);
  }
}
console.log("Sample test completed successfully!");
