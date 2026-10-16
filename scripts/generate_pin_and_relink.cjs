/**
 * Generates clean audio clips for "pin" (using ARPAbet phoneme markup)
 * and compound terms, uploads them to R2 under immutable content-addressed keys,
 * and verifies their round-trip integrity without deleting any existing files.
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { VOICES, AUDIO_PROFILE, audioKey } = require("./lib/assetKey.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY in environment.");
  process.exit(1);
}

const r2 = createClient();

const PIN_SYNTHESIS_TEXT = '<phoneme alphabet="cmu-arpabet" ph="P IH1 N">pin</phoneme>';

const CLIPS_TO_GENERATE = [
  {
    name: "pin-primary",
    displayText: "pin",
    synthesisText: PIN_SYNTHESIS_TEXT,
    speaker: "nichalia",
    category: "primary-word",
    profile: {
      voiceId: VOICES.nichalia,
      modelId: "eleven_v4",
      stability: 0.7,
      similarityBoost: 0.75,
    },
    source: "derived-profile",
    get objectKey() {
      return audioKey(this.synthesisText, this.profile);
    },
  },
  {
    name: "pin-transfer",
    displayText: "pin",
    synthesisText: PIN_SYNTHESIS_TEXT,
    speaker: "alice",
    category: "transfer-word",
    profile: {
      voiceId: VOICES.alice,
      modelId: "eleven_v4",
      stability: 0.7,
      similarityBoost: 0.75,
    },
    source: "derived-profile",
    get objectKey() {
      return audioKey(this.synthesisText, this.profile);
    },
  },
  {
    name: "motive-niyyah",
    displayText: "motive / niyyah",
    synthesisText: "motive, niyyah",
    speaker: "nichalia",
    category: "vocabulary",
    profile: AUDIO_PROFILE,
    source: "general-corpus",
    get objectKey() {
      return audioKey(this.displayText, this.profile);
    },
  },
  {
    name: "migration-hijrah",
    displayText: "migration / hijrah",
    synthesisText: "migration, hijrah",
    speaker: "nichalia",
    category: "vocabulary",
    profile: AUDIO_PROFILE,
    source: "general-corpus",
    get objectKey() {
      return audioKey(this.displayText, this.profile);
    },
  },
];

async function synthesise(clip) {
  console.log(`Synthesizing ${clip.name} (${clip.speaker}, ${clip.profile.modelId})...`);
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${clip.profile.voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text: clip.synthesisText,
        model_id: clip.profile.modelId,
        voice_settings: {
          stability: clip.profile.stability,
          similarity_boost: clip.profile.similarityBoost,
        },
      }),
      signal: AbortSignal.timeout(90_000),
    }
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`ElevenLabs error ${response.status}: ${detail.slice(0, 240)}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1024) {
    throw new Error(`Invalid clip size ${bytes.length} bytes for ${clip.name}`);
  }
  return bytes;
}

async function main() {
  console.log("=== GENERATING AUDIO CLIPS AND UPLOADING TO R2 ===");
  const results = [];

  for (const clip of CLIPS_TO_GENERATE) {
    const key = clip.objectKey;
    console.log(`\nProcessing [${clip.name}] -> Key: ${key}`);

    // Check backup or synthesize
    const backupPath = path.join(ROOT, "audio_backup", key);
    let bytes;
    if (fs.existsSync(backupPath) && fs.statSync(backupPath).size >= 1024) {
      console.log(`Reusing local backup at ${backupPath}`);
      bytes = fs.readFileSync(backupPath);
    } else {
      bytes = await synthesise(clip);
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, bytes);
      console.log(`Saved backup to ${backupPath} (${bytes.length} bytes)`);
    }

    // Also copy to public/ so local dev / offline verification works directly
    const publicPath = path.join(ROOT, "public", key);
    fs.mkdirSync(path.dirname(publicPath), { recursive: true });
    fs.writeFileSync(publicPath, bytes);

    // Upload to R2
    console.log(`Uploading to R2 (${key})...`);
    await r2.put(key, bytes, { contentType: "audio/mpeg", immutable: true });

    // Verify round-trip from R2
    console.log(`Verifying R2 upload...`);
    const roundTrip = await r2.get(key);
    if (!roundTrip || !roundTrip.equals(bytes)) {
      throw new Error(`R2 verification mismatch for ${key}`);
    }
    console.log(`✓ Verified in R2: ${roundTrip.length} bytes`);

    results.push({
      ...clip,
      bytes: bytes.length,
    });
  }

  console.log("\n=== ALL CLIPS SUCCESSFULLY GENERATED AND UPLOADED ===");
  console.log(JSON.stringify(results.map(r => ({ name: r.name, key: r.objectKey, bytes: r.bytes })), null, 2));
}

main().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
