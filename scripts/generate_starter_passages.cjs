/**
 * Synthesizes and uploads studio audio for Starter Units 01–10 reading passages:
 * 1. numbers-counting
 * 2. colors
 * 3. shapes-geometry
 * 4. family
 * 5. bedroom
 * 6. kitchen
 * 7. living-room
 * 8. fruits
 *
 * Model: eleven_turbo_v2_5
 * Voice: Nichalia Schwartz (XfNU2rGpBa01ckF309OY)
 *
 * Hard Guardrails:
 * - Strictly additive upload to R2 (putIfAbsent). Never delete, overwrite, or mutate.
 * - Always run with --dry-run first to verify planned character count.
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
const BACKUP_DIR = path.join(ROOT, "audio_backup", "starter-passages-u01-u10");

const TARGET_PROFILE = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  modelId: "eleven_turbo_v2_5",
  stability: 0.7,
  similarityBoost: 0.75,
};

const STARTER_UNITS = [
  "numbers-counting",
  "colors",
  "shapes-geometry",
  "family",
  "bedroom",
  "kitchen",
  "living-room",
  "fruits",
];

const flag = (name) => process.argv.includes(`--${name}`);
const DRY_RUN = flag("dry-run");

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
  try {
    fs.rmSync(tmp, { force: true });
  } catch {}
}

async function synthesise(text, apiKey) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${TARGET_PROFILE.voiceId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "xi-api-key": apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: TARGET_PROFILE.modelId,
      voice_settings: {
        stability: TARGET_PROFILE.stability,
        similarity_boost: TARGET_PROFILE.similarityBoost,
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
      const waitMs = Math.min(30000, 2000 * 2 ** attempt);
      console.warn(`  retry ${attempt}/${attempts - 1} for ${label} in ${waitMs}ms (${error.message.slice(0, 80)})`);
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
}

async function main() {
  console.log("=== STARTER PASSAGES AUDIO GENERATOR (Units 01–10) ===");
  const ledger = readLedger();

  const passages = [];
  for (const u of STARTER_UNITS) {
    const fPath = path.join(ROOT, "src", "app", "learning", "units", `${u}.ts`);
    const content = fs.readFileSync(fPath, "utf8");
    const match = content.match(/passage:\s*\{[\s\S]*?text:\s*"((?:[^"\\]|\\.)*)"/);
    if (!match) {
      throw new Error(`Could not find passage in ${u}.ts`);
    }
    const rawText = match[1].replace(/\\"/g, '"');
    const normText = normaliseAudioText(rawText);
    const cleanText = normText.replace(/[-_]/g, " ").trim();
    const hRaw = audioHash(normText, TARGET_PROFILE);
    const hClean = audioHash(cleanText, TARGET_PROFILE);

    passages.push({
      unitId: u,
      text: normText,
      cleanText,
      hRaw,
      hClean,
      chars: normText.length,
    });
  }

  const pending = passages.filter((p) => !ledger.clips[p.hRaw]);
  const plannedChars = pending.reduce((sum, p) => sum + p.chars, 0);

  console.log(`Units target: ${passages.length}`);
  console.log(`Already in ledger: ${passages.length - pending.length}`);
  console.log(`To generate: ${pending.length} passages (${plannedChars.toLocaleString()} characters)`);

  for (const p of passages) {
    const inLedger = !!ledger.clips[p.hRaw];
    console.log(`  ${p.unitId.padEnd(20)}: ${p.chars} chars | in ledger: ${inLedger}`);
  }

  if (DRY_RUN) {
    console.log("\n[DRY RUN] Complete. No API calls made, no characters spent.");
    return;
  }

  if (pending.length === 0) {
    console.log("\nAll starter passages are already present in ledger.");
    return;
  }

  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
  if (!apiKey) {
    throw new Error("ELEVENLABS_API_KEY is not set in environment or .env.local.");
  }

  const r2 = createClient();
  await r2.verify();
  console.log("R2 bucket verified successfully.\n");

  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  let generatedCount = 0;
  let spentChars = 0;

  for (let i = 0; i < pending.length; i++) {
    const p = pending[i];
    console.log(`[${i + 1}/${pending.length}] Synthesizing "${p.unitId}" (${p.chars} chars)…`);

    const audioBuf = await withRetry(
      () => synthesise(p.text, apiKey),
      p.unitId
    );

    spentChars += p.chars;
    generatedCount++;

    // 1. Save local backup
    const backupFile = path.join(BACKUP_DIR, `${p.hRaw}.mp3`);
    fs.writeFileSync(backupFile, audioBuf);

    // 2. Upload to Cloudflare R2 additively (primary hash)
    const primaryKey = `audio/${p.hRaw.slice(0, 2)}/${p.hRaw}.mp3`;
    await r2.putIfAbsent(primaryKey, audioBuf, { contentType: "audio/mpeg" });

    // 3. If cleanText hash differs, also upload cleanText alias key additively
    if (p.hClean !== p.hRaw) {
      const aliasKey = `audio/${p.hClean.slice(0, 2)}/${p.hClean}.mp3`;
      await r2.putIfAbsent(aliasKey, audioBuf, { contentType: "audio/mpeg" });
    }

    // 4. Record in ledger
    ledger.clips[p.hRaw] = {
      tier: "materials",
      chars: p.chars,
      bytes: audioBuf.length,
      unitId: p.unitId,
    };
    if (p.hClean !== p.hRaw) {
      ledger.clips[p.hClean] = {
        tier: "materials",
        chars: p.chars,
        bytes: audioBuf.length,
        unitId: p.unitId,
        reused: true,
      };
    }
    writeLedger(ledger);

    console.log(`  -> Saved ${audioBuf.length} bytes, uploaded to R2, ledger updated.`);

    // Polite pause between generation calls to avoid burst rate limits
    if (i < pending.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log("\n=== GENERATION COMPLETE ===");
  console.log(`Passages generated: ${generatedCount}`);
  console.log(`Total characters spent: ${spentChars.toLocaleString()}`);
  console.log(`Updated ledger written to ${LEDGER}`);
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
