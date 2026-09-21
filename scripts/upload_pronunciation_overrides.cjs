/**
 * Generates and uploads only pronunciation overrides that do not already
 * exist. This intentionally supports HEAD and PUT only: it never deletes,
 * overwrites, reconciles, or changes R2 bucket configuration.
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioHash, profileFingerprint } = require("./lib/assetKey.cjs");
const { overrides } = require("./lib/pronunciationOverrides.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const LEDGER_PATH = path.join(ROOT, "assets", "audio-ledger.json");
const DRY_RUN = process.argv.includes("--dry-run");

function writeLedger(ledger) {
  const ordered = {};
  for (const hash of Object.keys(ledger.clips).sort()) ordered[hash] = ledger.clips[hash];
  const temp = path.join(os.tmpdir(), "wordpix-pronunciation-ledger.tmp.json");
  fs.writeFileSync(temp, JSON.stringify({ profile: ledger.profile, clips: ordered }, null, 2) + "\n");
  fs.copyFileSync(temp, LEDGER_PATH);
  fs.rmSync(temp, { force: true });
}

async function synthesise(text, profile, apiKey) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}`, {
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
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${(await response.text()).slice(0, 300)}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const unique = new Map();
  for (const override of overrides) {
    const profile = { ...AUDIO_PROFILE, ...(override.profile || {}) };
    const hash = audioHash(override.synthesisText, profile);
    unique.set(hash, {
      hash,
      text: override.synthesisText,
      profile,
      labels: override.matches,
      key: `audio/${hash.slice(0, 2)}/${hash}.mp3`,
    });
  }

  const r2 = createClient();
  const pending = [];
  for (const item of unique.values()) {
    if (!(await r2.exists(item.key))) {
      pending.push(item);
      continue;
    }
    const localPath = path.join(ROOT, "audio_backup", item.key);
    if (!fs.existsSync(localPath) && !DRY_RUN) {
      const audio = await r2.get(item.key);
      if (!audio) throw new Error(`R2 object disappeared during backup: ${item.key}`);
      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      fs.writeFileSync(localPath, audio);
      console.log(`backed up existing ${item.labels.join(", ")} (${audio.length} bytes)`);
    }
  }
  console.log(`override clips: ${unique.size}`);
  console.log(`already in R2: ${unique.size - pending.length}`);
  console.log(`to upload: ${pending.length}`);
  for (const item of pending) console.log(`  ${item.labels.join(", ")} -> ${item.key}`);
  if (DRY_RUN || pending.length === 0) return;

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not configured");
  const ledger = JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8"));
  if (ledger.profile !== profileFingerprint(AUDIO_PROFILE)) throw new Error("Audio ledger profile mismatch");

  for (const item of pending) {
    // Repeat HEAD immediately before PUT so this script cannot overwrite an
    // object created by a concurrent run.
    if (await r2.exists(item.key)) continue;
    const audio = await synthesise(item.text, item.profile, apiKey);
    const localPath = path.join(ROOT, "audio_backup", item.key);
    fs.mkdirSync(path.dirname(localPath), { recursive: true });
    fs.writeFileSync(localPath, audio);
    await r2.put(item.key, audio, { contentType: "audio/mpeg" });
    ledger.clips[item.hash] = {
      tier: "words",
      chars: item.text.length,
      bytes: audio.length,
    };
    console.log(`uploaded ${item.labels.join(", ")} (${audio.length} bytes)`);
  }
  writeLedger(ledger);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
