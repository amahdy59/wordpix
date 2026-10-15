/**
 * Option 3 Audio Generation:
 * 1. 7 Missing transit/daily action phrases
 * 2. 283 Contextual usage examples from src/app/data/usagePhrases/*.phrases.json
 * 3. 23 Compound vocabulary terms from Business, Conversation, and Hadith
 * 4. 41 Pre-A1 Starter reading passages (Units 01-10)
 *
 * Model: eleven_turbo_v2_5 (0.5 credit multiplier)
 * Voice: Nichalia Schwartz (XfNU2rGpBa01ckF309OY)
 *
 * STRICT NON-DELETION POLICY:
 * - Never delete, overwrite, or mutate any existing R2 objects or local backups.
 * - All generation and uploads are strictly additive.
 */

const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioHash, profileFingerprint } = require("./lib/assetKey.cjs");
const { normaliseAudioText } = require("./lib/audioText.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const LEDGER = path.join(ROOT, "assets", "audio-ledger.json");
const CURRICULUM_MANIFEST = path.join(ROOT, "src", "app", "learning", "shared", "curriculumAudioManifest.json");
const OUT_DIR = path.join(ROOT, "audio_backup", "option3-par-v25");

const TARGET_PROFILE = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
};

const arg = (name, fallback = null) => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const CONFIRM = flag("confirm");
const MAX_CHARS = Number(arg("max-chars", 32000)) || 32000;
const CONCURRENCY = Math.max(1, Math.min(3, Number(arg("concurrency", 2))));

function readLedger() {
  if (!fs.existsSync(LEDGER)) {
    return { profile: profileFingerprint(TARGET_PROFILE), clips: {} };
  }
  return JSON.parse(fs.readFileSync(LEDGER, "utf8"));
}

function writeLedger(ledger) {
  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  const ordered = {};
  for (const key of Object.keys(ledger.clips).sort()) ordered[key] = ledger.clips[key];
  const content = JSON.stringify({ profile: ledger.profile, clips: ordered }, null, 2) + "\n";
  const tmp = path.join(require("os").tmpdir(), `audio-ledger-${Date.now()}.tmp.json`);
  fs.writeFileSync(tmp, content, "utf8");
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      fs.copyFileSync(tmp, LEDGER);
      break;
    } catch {
      if (attempt < 5) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * attempt);
    }
  }
  try { fs.rmSync(tmp, { force: true }); } catch {}
}

function collectOption3Items() {
  const items = [];
  const seenHashes = new Set();

  function addItem(rawText, category, meta = {}) {
    const text = normaliseAudioText(rawText);
    if (!text || text.length < 2) return;
    const hash = audioHash(text, TARGET_PROFILE);
    if (seenHashes.has(hash)) return;
    seenHashes.add(hash);
    items.push({
      hash,
      text,
      category,
      chars: text.length,
      meta,
      key: `audio/${hash.slice(0, 2)}/${hash}.mp3`,
    });
  }

  // 1. Missing Phrases (7)
  const missingPhrases = [
    'check the gate number',
    'Which gate does the flight leave from?',
    'check the departure time',
    'Is the flight on time?',
    'board the plane',
    'Which pier does the ferry leave from?',
    'confirm the departure pier'
  ];
  for (const p of missingPhrases) addItem(p, 'phrase');

  // 2. Examples from usagePhrases (283)
  const phraseDir = path.join(ROOT, 'src', 'app', 'data', 'usagePhrases');
  const pFiles = fs.readdirSync(phraseDir).filter((f) => f.endsWith('.phrases.json'));
  for (const f of pFiles) {
    const list = JSON.parse(fs.readFileSync(path.join(phraseDir, f), 'utf8'));
    for (const item of list) {
      if (item.example) addItem(item.example, 'phrase-example', { lessonId: item.lessonId, phrase: item.phrase });
    }
  }

  // 3. Compound terms from Business, Conversation, Hadith
  const businessCatalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'app', 'learning', 'business', 'businessCatalog.json'), 'utf8'));
  const convCatalog = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'app', 'learning', 'conversation', 'conversationCatalog.json'), 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(CURRICULUM_MANIFEST, 'utf8'));

  for (const u of businessCatalog) {
    for (const item of u.languageBank) {
      const t = item.term.trim();
      if (!manifest.clips[t] && !manifest.clips[t.toLowerCase()]) {
        addItem(t, 'compound-term', { domain: 'business' });
      }
    }
  }
  for (const u of convCatalog) {
    const bank = u.languageBank || u.vocabulary || [];
    for (const item of bank) {
      const t = (item.term || item.phrase || '').trim();
      if (t && !manifest.clips[t] && !manifest.clips[t.toLowerCase()]) {
        addItem(t, 'compound-term', { domain: 'conversation' });
      }
    }
  }
  const hadithTerms = ['judged', 'motive', 'intend', 'migration', 'worldly'];
  for (const t of hadithTerms) {
    if (!manifest.clips[t] && !manifest.clips[t.toLowerCase()]) {
      addItem(t, 'compound-term', { domain: 'hadith' });
    }
  }

  // 4. Starter Reading Passages (Units 01-10)
  const starterUnits = [
    "numbers-counting",
    "colors",
    "shapes-geometry",
    "basic-emotions",
    "family",
    "bedroom",
    "bathroom",
    "kitchen",
    "living-room",
    "fruits"
  ];
  for (const u of starterUnits) {
    const p = path.join(ROOT, 'src', 'app', 'data', 'usage', `${u}.usage.json`);
    if (fs.existsSync(p)) {
      const d = JSON.parse(fs.readFileSync(p, 'utf8'));
      for (const l of d) {
        if (l.reading?.text) {
          addItem(l.reading.text, 'starter-passage', { unitId: u, lessonId: l.lessonId, title: l.reading.title });
        }
      }
    }
  }

  return items;
}

async function synthesise(text, apiKey, profile = TARGET_PROFILE) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: profile.modelId,
      voice_settings: {
        stability: profile.stability,
        similarity_boost: profile.similarityBoost,
      },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`ElevenLabs HTTP ${res.status}: ${errText}`);
  }
  const buf = await res.arrayBuffer();
  return Buffer.from(buf);
}

async function main() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    console.error("Missing ELEVENLABS_API_KEY");
    process.exit(1);
  }

  const r2 = createClient();
  await r2.verify();
  console.log("Verified Cloudflare R2 bucket connection.");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const items = collectOption3Items();
  console.log(`Collected ${items.length} total Option 3 candidate items.`);

  const ledger = readLedger();
  const curriculumManifest = JSON.parse(fs.readFileSync(CURRICULUM_MANIFEST, "utf8"));

  // Pre-filter: Concurrent check against R2 and local backup
  console.log("Checking R2 presence for all items concurrently...");
  async function mapConcurrent(list, limit, fn) {
    let index = 0;
    const results = new Array(list.length);
    async function w() {
      while (index < list.length) {
        const i = index++;
        results[i] = await fn(list[i], i);
      }
    }
    await Promise.all(Array.from({ length: limit }, () => w()));
    return results;
  }

  const checkResults = await mapConcurrent(items, 25, async (item) => {
    const backupFile = path.join(OUT_DIR, `${item.hash}.mp3`);
    let existsInR2 = false;
    try {
      existsInR2 = await r2.exists(item.key);
    } catch {}
    return { item, exists: existsInR2 || fs.existsSync(backupFile), backupFile };
  });

  const needed = [];
  let existingCount = 0;
  for (const res of checkResults) {
    const { item, exists, backupFile } = res;
    if (exists) {
      existingCount++;
      if (!ledger.clips[item.hash]) {
        ledger.clips[item.hash] = {
          file: `${item.hash}.mp3`,
          bytes: fs.existsSync(backupFile) ? fs.statSync(backupFile).size : 0,
          chars: item.chars,
          text: item.text,
          tier: item.category,
        };
      }
      if (item.category === "compound-term") {
        curriculumManifest.clips[item.text] = {
          objectKey: item.key,
          synthesisText: item.text,
          category: "compound",
          domains: [item.meta?.domain || "general"],
          chars: item.chars,
        };
      }
    } else {
      needed.push(item);
    }
  }

  writeLedger(ledger);
  fs.writeFileSync(CURRICULUM_MANIFEST, JSON.stringify(curriculumManifest, null, 2) + "\n");

  const totalCharsNeeded = needed.reduce((s, x) => s + x.chars, 0);
  console.log(`\nItems already available: ${existingCount}`);
  console.log(`Items needing synthesis: ${needed.length}`);
  console.log(`Total characters needed: ${totalCharsNeeded}`);
  console.log(`Estimated credit cost on eleven_turbo_v2_5: ${Math.round(totalCharsNeeded * 0.5)}`);

  if (totalCharsNeeded > MAX_CHARS) {
    console.error(`Exceeds safety cap of ${MAX_CHARS} characters (needed ${totalCharsNeeded}). Aborting.`);
    process.exit(1);
  }

  if (DRY_RUN || !CONFIRM) {
    console.log("\n[DRY RUN] Run with --confirm to execute ElevenLabs synthesis and R2 upload.");
    return;
  }

  // Check live ElevenLabs quota
  const subRes = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": apiKey },
  });
  const subData = await subRes.json();
  const remaining = subData.character_limit - subData.character_count;
  console.log(`\nLive ElevenLabs quota remaining: ${remaining} characters.`);
  if (remaining < totalCharsNeeded) {
    console.error(`Insufficient ElevenLabs balance (${remaining} < ${totalCharsNeeded}). Aborting.`);
    process.exit(1);
  }

  console.log(`\nStarting synthesis of ${needed.length} clips with concurrency ${CONCURRENCY}...`);

  let completed = 0;
  let spentChars = 0;
  let uploadedCount = 0;

  // Process in worker pool
  let queueIndex = 0;
  async function worker(workerId) {
    while (queueIndex < needed.length) {
      const idx = queueIndex++;
      const item = needed[idx];
      const backupPath = path.join(OUT_DIR, `${item.hash}.mp3`);

      let audioBuffer = null;
      let attempts = 0;
      while (attempts < 3 && !audioBuffer) {
        attempts++;
        try {
          audioBuffer = await synthesise(item.text, apiKey);
        } catch (err) {
          console.warn(`[Worker ${workerId}] Attempt ${attempts} failed for "${item.text.slice(0, 30)}...": ${err.message}`);
          if (err.message.includes("429")) {
            await new Promise((r) => setTimeout(r, 4000 * attempts));
          } else {
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      }

      if (!audioBuffer) {
        console.error(`FAILED to synthesise clip: "${item.text}"`);
        continue;
      }

      // 1. Save local backup additively
      fs.writeFileSync(backupPath, audioBuffer);

      // 2. Additively upload to Cloudflare R2
      try {
        await r2.upload(item.key, audioBuffer, "audio/mpeg");
        uploadedCount++;
      } catch (uploadErr) {
        console.error(`R2 Upload failed for ${item.key}: ${uploadErr.message}`);
      }

      // 3. Update ledger entry
      ledger.clips[item.hash] = {
        file: `${item.hash}.mp3`,
        bytes: audioBuffer.length,
        chars: item.chars,
        text: item.text,
        tier: item.category,
      };

      // 4. Update curriculum manifest if compound term
      if (item.category === "compound-term") {
        curriculumManifest.clips[item.text] = {
          objectKey: item.key,
          synthesisText: item.text,
          category: "compound",
          domains: [item.meta?.domain || "general"],
          chars: item.chars,
        };
      }

      completed++;
      spentChars += item.chars;

      if (completed % 10 === 0 || completed === needed.length) {
        writeLedger(ledger);
        fs.writeFileSync(CURRICULUM_MANIFEST, JSON.stringify(curriculumManifest, null, 2) + "\n");
        console.log(`Progress: [${completed}/${needed.length}] ${spentChars} chars synthesized, ${uploadedCount} uploaded.`);
      }

      // Polite pacing
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  // Final flush
  writeLedger(ledger);
  fs.writeFileSync(CURRICULUM_MANIFEST, JSON.stringify(curriculumManifest, null, 2) + "\n");

  console.log(`\n=== OPTION 3 COMPLETE ===`);
  console.log(`Total clips synthesised: ${completed}/${needed.length}`);
  console.log(`Total characters consumed: ${spentChars}`);
  console.log(`Total files uploaded to Cloudflare R2: ${uploadedCount}`);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
