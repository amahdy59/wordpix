/**
 * Plan B Audio Generation:
 * 1. 138 remaining Core Usage Paragraphs (from src/app/data/usage/*.usage.json)
 * 2. Conversation Unit 11 Reading Article (title + 6 paragraphs)
 * 3. Business Curriculum Units 1 to 21 Main Input Dialogues (182 lines)
 *
 * Model: eleven_turbo_v2_5 (0.5 credits / char)
 * Voice: Nichalia Schwartz (XfNU2rGpBa01ckF309OY)
 *
 * Non-negotiables:
 * - Content-addressed immutable keys: audio/<hash[0..2]>/<hash>.mp3
 * - Check r2.exists(key) before calling ElevenLabs ($0 if already in bucket)
 * - Safe character cap (--max-chars)
 * - Save local backup copy in audio_backup/
 * - Update assets/audio-ledger.json atomically
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

const arg = (name, fallback = null) => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  return found ? found.slice(name.length + 3) : fallback;
};
const flag = (name) => process.argv.includes(`--${name}`);

const DRY_RUN = flag("dry-run");
const CONFIRM = flag("confirm");
const MAX_CHARS = Number(arg("max-chars", 125000)) || 125000;
const LIMIT = Number(arg("limit", 0)) || Infinity;
const CONCURRENCY = Math.max(1, Math.min(3, Number(arg("concurrency", 2))));

// Profile for eleven_turbo_v2_5
const TARGET_PROFILE = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
};

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
  const tmp = path.join(require("os").tmpdir(), "audio-ledger.tmp.json");
  fs.writeFileSync(tmp, content, "utf8");
  for (let attempt = 1; attempt <= 5; attempt += 1) {
    try {
      fs.copyFileSync(tmp, LEDGER);
      break;
    } catch {
      if (attempt < 5) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 200 * attempt);
    }
  }
  fs.rmSync(tmp, { force: true });
}

function collectPlanBItems() {
  const items = [];
  const seenHashes = new Set();

  function addItem(rawText, tier, sourceId) {
    const text = normaliseAudioText(rawText);
    if (!text || text.length < 2) return;
    const hash = audioHash(text, TARGET_PROFILE);
    if (seenHashes.has(hash)) return;
    seenHashes.add(hash);
    items.push({
      hash,
      text,
      tier,
      chars: text.length,
      sourceId,
    });
  }

  // 1. Missing Core Usage Paragraphs
  const lv4 = JSON.parse(fs.readFileSync(path.join(ROOT, "assets", "audio-ledger-v4-repaired.json"), "utf8"));
  const usageCorpus = JSON.parse(fs.readFileSync(path.join(ROOT, "scratch", "usage_audio_corpus.json"), "utf8"));
  for (const item of usageCorpus) {
    if (item.tier === "paragraphs" && !lv4.clips[item.hash]) {
      addItem(item.text, "paragraphs", (item.lessonIds || []).join(", "));
    }
  }

  // 2. Conversation Unit 11 Reading (Article in screenshot)
  const conv = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "app", "learning", "conversation", "conversationCatalog.json"), "utf8"));
  const u11 = conv.find((u) => u.unitNumber === 11);
  if (u11) {
    addItem(u11.reading.title + ". " + u11.reading.paragraphs.join(" "), "conversation-u11", "conv-u11-full");
    for (let i = 0; i < u11.reading.paragraphs.length; i++) {
      addItem(u11.reading.paragraphs[i], "conversation-u11", `conv-u11-p${i + 1}`);
    }
  }

  // 3. Business Curriculum Units 1 to 21 Dialogues
  const biz = JSON.parse(fs.readFileSync(path.join(ROOT, "src", "app", "learning", "business", "businessCatalog.json"), "utf8"));
  for (let i = 0; i < 21; i++) {
    const u = biz[i];
    if (u && u.mainInput && u.mainInput.dialogue) {
      for (let d = 0; d < u.mainInput.dialogue.length; d++) {
        addItem(u.mainInput.dialogue[d].text, "business-dialogue", `biz-${u.unitNumber}-d${d + 1}`);
      }
    }
  }

  return items;
}

async function synthesise(text, apiKey, profile = TARGET_PROFILE) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "xi-api-key": apiKey },
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
    const detail = await res.text().catch(() => "");
    const error = new Error(`ElevenLabs ${res.status}: ${detail.slice(0, 300)}`);
    error.status = res.status;
    throw error;
  }
  return Buffer.from(await res.arrayBuffer());
}

async function withRetry(fn, label, attempts = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      const status = error.status ?? 0;
      const retriable = status === 429 || status >= 500 || status === 0;
      if (!retriable || attempt >= attempts) throw error;
      const waitMs = Math.min(30000, 1000 * 2 ** attempt);
      console.warn(`  retry ${attempt}/${attempts - 1} for ${label} in ${waitMs}ms (${error.message.slice(0, 80)})`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

async function main() {
  const items = collectPlanBItems();
  const ledger = readLedger();

  const totalChars = items.reduce((acc, i) => acc + i.chars, 0);
  console.log(`Plan B items: ${items.length} clips, ${totalChars.toLocaleString()} text characters`);
  console.log(`Estimated ElevenLabs quota cost (0.5x): ${Math.round(totalChars * 0.5).toLocaleString()} credits`);

  const pending = items.filter((item) => !ledger.clips[item.hash]).slice(0, LIMIT);
  const plannedChars = pending.reduce((acc, i) => acc + i.chars, 0);
  console.log(`Already in ledger: ${items.length - pending.length}`);
  console.log(`Pending: ${pending.length} clips, ${plannedChars.toLocaleString()} text chars (${Math.round(plannedChars * 0.5).toLocaleString()} credits)`);

  if (DRY_RUN || !CONFIRM) {
    console.log("\n[DRY RUN] Run with --confirm to start actual generation and upload.");
    const byTier = {};
    for (const e of pending) {
      byTier[e.tier] = (byTier[e.tier] || 0) + e.chars;
    }
    for (const [tier, chars] of Object.entries(byTier)) {
      console.log(`  ${tier.padEnd(22)}: ${chars.toLocaleString()} text chars (~${Math.round(chars * 0.5).toLocaleString()} credits)`);
    }
    return;
  }

  const apiKey =
    process.env.Elevenlabs_API_key_2 ||
    process.env.ELEVENLABS_API_KEY ||
    process.env.Elevenlabs_API_key;

  if (!apiKey) {
    throw new Error("No ElevenLabs API key found in environment or .env.local");
  }

  // Check live remaining quota
  const subRes = await fetch("https://api.elevenlabs.io/v1/user/subscription", {
    headers: { "xi-api-key": apiKey },
  });
  const subData = await subRes.json().catch(() => ({}));
  const remainingCredits =
    typeof subData.character_limit === "number" && typeof subData.character_count === "number"
      ? subData.character_limit - subData.character_count
      : null;
  console.log(
    `ElevenLabs subscription: tier=${subData.tier}, remaining credits=${remainingCredits?.toLocaleString()}`
  );
  if (remainingCredits !== null && remainingCredits < 1000) {
    throw new Error(`Insufficient credits remaining: only ${remainingCredits} credits available.`);
  }

  // Allow text up to remaining credits * 2, leaving an 800 credit safety margin
  const maxSafeTextChars = remainingCredits ? Math.max(0, (remainingCredits - 800) * 2) : MAX_CHARS;
  const effectiveMaxChars = Math.min(MAX_CHARS, maxSafeTextChars);
  console.log(`Enforcing safe text character cap: ${effectiveMaxChars.toLocaleString()} text chars`);

  const r2 = createClient();
  console.log(`Connecting to Cloudflare R2 bucket: ${r2.config.bucket}...`);

  let spentChars = 0;
  let reservedChars = 0;
  let generated = 0;
  let reused = 0;
  let failed = 0;
  let cursor = 0;
  let stopped = false;

  const saveSoon = (() => {
    let timer = null;
    return () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        writeLedger(ledger);
      }, 1500);
    };
  })();

  async function worker(workerId) {
    while (!stopped) {
      const idx = cursor++;
      if (idx >= pending.length) return;
      const entry = pending[idx];
      const key = `audio/${entry.hash.slice(0, 2)}/${entry.hash}.mp3`;
      const label = JSON.stringify(entry.text.slice(0, 40));

      try {
        // Safe check: does it already exist in R2 from a prior partial run?
        if (await r2.exists(key)) {
          ledger.clips[entry.hash] = {
            tier: entry.tier,
            chars: entry.chars,
            bytes: null,
            reused: true,
          };
          reused += 1;
          saveSoon();
          console.log(`  [reused R2] ${label}`);
          continue;
        }

        if (reservedChars + entry.chars > effectiveMaxChars) {
          stopped = true;
          console.log(`\nCharacter budget ceiling reached (${reservedChars.toLocaleString()} chars); stopping cleanly.`);
          return;
        }
        reservedChars += entry.chars;

        const audioBuffer = await withRetry(
          () => synthesise(entry.text, apiKey, TARGET_PROFILE),
          label
        );

        // Save local backup copy
        try {
          const localPath = path.join(ROOT, "audio_backup", key);
          fs.mkdirSync(path.dirname(localPath), { recursive: true });
          fs.writeFileSync(localPath, audioBuffer);
        } catch (bErr) {
          console.warn(`  Local backup warning for ${key}: ${bErr.message}`);
        }

        // Put to Cloudflare R2
        await withRetry(
          () => r2.put(key, audioBuffer, { contentType: "audio/mpeg" }),
          key
        );

        spentChars += entry.chars;
        ledger.clips[entry.hash] = {
          tier: entry.tier,
          chars: entry.chars,
          bytes: audioBuffer.length,
        };
        generated += 1;
        saveSoon();

        console.log(`  [${generated}/${pending.length}] Generated: ${label} (${entry.chars} chars)`);
      } catch (err) {
        failed += 1;
        console.error(`  FAILED ${label}: ${err.message}`);
        if (err.status === 401 || err.status === 403) {
          stopped = true;
          console.error("  Authentication failed — stopping.");
        }
      }
    }
  }

  console.log(`\nStarting generation with concurrency ${CONCURRENCY}...`);
  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  writeLedger(ledger);

  console.log("\n================ GENERATION SUMMARY ================");
  console.log(`Generated : ${generated}`);
  console.log(`Reused    : ${reused}`);
  console.log(`Failed    : ${failed}`);
  console.log(`Text chars: ${spentChars.toLocaleString()}`);
  console.log(`Quota cost: ~${Math.round(spentChars * 0.5).toLocaleString()} credits`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
