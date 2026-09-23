/**
 * Generates the canonical Arabic Hadith and English translation tracks.
 *
 * Dry-run is the default-safe planning mode:
 *   node scripts/generate_hadith_audio.cjs --dry-run
 *
 * Paid generation requires an explicit confirmation and character ceiling:
 *   node scripts/generate_hadith_audio.cjs --lesson=1 --confirm --max-chars=2000
 *   node scripts/generate_hadith_audio.cjs --confirm --max-chars=40000
 */
const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { createHadithAudioCorpus, createHadithAudioManifest } = require("./lib/hadithAudio.cjs");

loadEnv();

const ROOT = path.join(__dirname, "..");
const CURRICULUM_PATH = path.join(
  ROOT,
  "src",
  "app",
  "learning",
  "hadith",
  "figmaHadithContent.json"
);
const MANIFEST_PATH = path.join(
  ROOT,
  "src",
  "app",
  "learning",
  "hadith",
  "hadithAudioManifest.json"
);

const arg = (name) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const flag = (name) => process.argv.includes(`--${name}`);
const DRY_RUN = flag("dry-run");
const VERIFY_ONLY = flag("verify");
const CONFIRMED = flag("confirm");
const LESSON = Number(arg("lesson") ?? 0);
const MAX_CHARS = Number(arg("max-chars") ?? 0);

function writeManifest(curriculum) {
  const manifest = createHadithAudioManifest(curriculum);
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return manifest;
}

async function synthesise(clip, apiKey) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${clip.profile.voiceId}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "xi-api-key": apiKey },
      body: JSON.stringify({
        text: clip.text,
        model_id: clip.profile.modelId,
        voice_settings: {
          stability: clip.profile.stability,
          similarity_boost: clip.profile.similarityBoost,
        },
      }),
    }
  );
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    const error = new Error(`ElevenLabs ${response.status}: ${detail.slice(0, 240)}`);
    error.status = response.status;
    throw error;
  }
  const audio = Buffer.from(await response.arrayBuffer());
  if (audio.length < 1024)
    throw new Error(`ElevenLabs returned an invalid ${audio.length}-byte clip`);
  return audio;
}

async function withRetry(task, attempts = 4) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      const retriable = error.status === 429 || error.status >= 500;
      if (!retriable || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.min(30_000, 1_000 * 2 ** attempt)));
    }
  }
}

async function main() {
  const curriculum = JSON.parse(fs.readFileSync(CURRICULUM_PATH, "utf8"));
  writeManifest(curriculum);
  const completeCorpus = createHadithAudioCorpus(curriculum);
  const corpus = LESSON
    ? completeCorpus.filter((clip) => clip.lessonNumber === LESSON)
    : completeCorpus;
  if (LESSON && corpus.length !== 2) throw new Error(`Unknown Hadith lesson ${LESSON}`);

  const plannedChars = corpus.reduce((sum, clip) => sum + clip.chars, 0);
  console.log(`lessons    : ${LESSON || curriculum.lessons.length}`);
  console.log(`clips      : ${corpus.length}`);
  console.log(`characters : ${plannedChars.toLocaleString()}`);
  console.log(`Arabic     : Omar / eleven_multilingual_v2`);
  console.log(`English    : Nichalia / eleven_multilingual_v2`);

  if (VERIFY_ONLY) {
    const r2 = createClient();
    let missing = 0;
    let invalid = 0;
    for (const clip of corpus) {
      const headers = await r2.head(clip.objectKey);
      if (!headers) {
        missing += 1;
        console.error(`missing ${clip.lessonId} ${clip.language}: ${clip.objectKey}`);
        continue;
      }
      const bytes = Number(headers["content-length"] ?? 0);
      const contentType = headers["content-type"] ?? "";
      if (bytes < 1024 || !contentType.startsWith("audio/")) {
        invalid += 1;
        console.error(`invalid ${clip.lessonId} ${clip.language}: ${bytes} bytes, ${contentType}`);
      }
    }
    console.log(`verified   : ${corpus.length - missing - invalid}`);
    console.log(`missing    : ${missing}`);
    console.log(`invalid    : ${invalid}`);
    if (missing || invalid) process.exitCode = 1;
    return;
  }

  if (DRY_RUN) {
    console.log("--dry-run: manifest refreshed; no API generation or R2 mutation performed.");
    return;
  }
  if (!CONFIRMED) throw new Error("Paid generation requires --confirm.");
  if (!Number.isFinite(MAX_CHARS) || MAX_CHARS <= 0 || plannedChars > MAX_CHARS) {
    throw new Error(
      `Planned corpus is ${plannedChars} characters; provide --max-chars at or above that amount.`
    );
  }
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing from .env.local.");

  const r2 = createClient();
  await r2.verify();
  let generated = 0;
  let reused = 0;
  let spentChars = 0;

  for (const clip of corpus) {
    if (await r2.exists(clip.objectKey)) {
      reused += 1;
      continue;
    }
    const audio = await withRetry(() => synthesise(clip, apiKey));
    const backupPath = path.join(ROOT, "audio_backup", clip.objectKey);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, audio);
    await r2.put(clip.objectKey, audio, { contentType: "audio/mpeg", immutable: true });
    const uploaded = await r2.get(clip.objectKey);
    if (!uploaded?.equals(audio))
      throw new Error(`R2 byte verification failed for ${clip.objectKey}`);
    generated += 1;
    spentChars += clip.chars;
    console.log(
      `uploaded ${clip.lessonId} ${clip.language} (${clip.chars} chars, ${audio.length} bytes)`
    );
  }

  console.log(`generated  : ${generated}`);
  console.log(`reused     : ${reused}`);
  console.log(`spent chars: ${spentChars.toLocaleString()}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
