/**
 * Generates only the bounded Foundations lesson corpus.
 *
 * New clips use the same immutable, content-addressed keys as the main audio
 * pipeline. Existing local or R2 objects are never overwritten. If R2
 * credentials are absent, clips are still saved under public/audio so local
 * lessons use the natural voice immediately; rerun later to upload them.
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient, readConfig } = require("./lib/r2.cjs");
const { AUDIO_PROFILE } = require("./lib/assetKey.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const CORPUS = path.join(ROOT, "scratch", "foundation_audio_corpus.json");
const DRY_RUN = process.argv.includes("--dry-run");
const MAX_CHARS = Number(process.argv.find((arg) => arg.startsWith("--max-chars="))?.split("=")[1] ?? 10000);

async function synthesise(text, profile = AUDIO_PROFILE) {
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}`, {
    method: "POST",
    headers: { "content-type": "application/json", "xi-api-key": process.env.ELEVENLABS_API_KEY },
    body: JSON.stringify({
      text,
      model_id: profile.modelId,
      voice_settings: {
        stability: profile.stability,
        similarity_boost: profile.similarityBoost,
      },
    }),
  });
  if (!response.ok) throw new Error(`ElevenLabs ${response.status}: ${(await response.text()).slice(0, 240)}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  if (!fs.existsSync(CORPUS)) throw new Error("Run: npx vite-node scripts/build_foundation_audio_corpus.ts");
  const corpus = JSON.parse(fs.readFileSync(CORPUS, "utf8"));
  const plannedChars = corpus.reduce((sum, entry) => sum + entry.chars, 0);
  if (plannedChars > MAX_CHARS) throw new Error(`Foundation corpus is ${plannedChars} characters; budget is ${MAX_CHARS}.`);

  let haveR2 = true;
  try {
    readConfig();
  } catch {
    haveR2 = false;
  }
  console.log(`clips      : ${corpus.length}`);
  console.log(`characters : ${plannedChars.toLocaleString()}`);
  console.log(`R2 upload  : ${haveR2 ? "enabled" : "not configured (local files only)"}`);
  if (DRY_RUN) return console.log("--dry-run: no generation or upload performed.");
  if (!process.env.ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is missing from .env.local.");

  const r2 = haveR2 ? createClient() : null;
  if (r2) await r2.verify();
  let generated = 0;
  let downloaded = 0;
  let uploaded = 0;
  let skipped = 0;

  for (const entry of corpus) {
    const key = `audio/${entry.hash.slice(0, 2)}/${entry.hash}.mp3`;
    const target = path.join(ROOT, "public", key);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    let audio = fs.existsSync(target) ? fs.readFileSync(target) : null;

    if (!audio && r2 && (await r2.exists(key))) {
      audio = await r2.get(key);
      if (audio) {
        fs.writeFileSync(target, audio, { flag: "wx" });
        downloaded += 1;
      }
    }

    if (!audio) {
      audio = await synthesise(entry.text, entry.profile ?? AUDIO_PROFILE);
      fs.writeFileSync(target, audio, { flag: "wx" });
      generated += 1;
    } else {
      skipped += 1;
    }

    if (r2 && !(await r2.exists(key))) {
      await r2.put(key, audio, { contentType: "audio/mpeg", immutable: true });
      uploaded += 1;
    }
  }

  console.log(`generated  : ${generated}`);
  console.log(`downloaded : ${downloaded}`);
  console.log(`uploaded   : ${uploaded}`);
  console.log(`reused     : ${skipped}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
