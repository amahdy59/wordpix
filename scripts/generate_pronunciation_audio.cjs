/**
 * Generates the missing pronunciation curriculum clips once and stores them
 * under immutable, content-addressed R2 keys.
 *
 * Safe planning is the default:
 *   node scripts/generate_pronunciation_audio.cjs --dry-run
 * Paid generation requires both flags:
 *   node scripts/generate_pronunciation_audio.cjs --confirm --max-chars=10000
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioKey } = require("./lib/assetKey.cjs");
const { getPronunciationAssetSpec } = require("./lib/pronunciationOverrides.cjs");

loadEnv();

const ROOT = path.resolve(__dirname, "..");
const SOURCE = JSON.parse(
  fs.readFileSync(
    path.join(ROOT, "src/app/learning/foundations/figmaPronunciationContent.json"),
    "utf8"
  )
);
const flag = (name) => process.argv.includes(`--${name}`);
const arg = (name) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3);
const DRY_RUN = flag("dry-run");
const VERIFY_ONLY = flag("verify");
const CONFIRMED = flag("confirm");
const MAX_CHARS = Number(arg("max-chars") ?? 0);
const CONCURRENCY = Math.max(1, Math.min(4, Number(arg("concurrency") ?? 3)));

const normalize = (value) =>
  String(value).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

function modelAudio(lesson) {
  return lesson.text
    .find((line) => /^Model (?:Delivery|Audio).*:/i.test(line))
    ?.replace(/^Model (?:Delivery|Audio)[^:]*:\s*/i, "")
    .trim();
}

function buildCorpus() {
  const texts = [
    ...SOURCE.lessons.flatMap((lesson) => lesson.images.map((item) => item.label)),
    ...SOURCE.lessons.map(modelAudio),
  ]
    .filter(Boolean)
    .map(normalize);
  const unique = [...new Set(texts)];
  return [
    ...new Map(
      unique.map((displayText) => {
        const asset = getPronunciationAssetSpec(displayText, AUDIO_PROFILE);
        const objectKey = audioKey(asset.text, asset.profile);
        return [
          objectKey,
          {
            displayText,
            synthesisText: asset.text,
            profile: asset.profile,
            objectKey,
            chars: asset.text.length,
          },
        ];
      })
    ).values(),
  ];
}

async function synthesise(clip, apiKey) {
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
    const error = new Error(`ElevenLabs ${response.status}: ${detail.slice(0, 240)}`);
    error.status = response.status;
    throw error;
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1024)
    throw new Error(`Invalid ${bytes.length}-byte clip for ${clip.displayText}`);
  return bytes;
}

async function withRetry(task, attempts = 5) {
  for (let attempt = 1; ; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      const retriable = error.status === 429 || error.status >= 500;
      if (!retriable || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.min(30_000, 1000 * 2 ** attempt)));
    }
  }
}

async function main() {
  const r2 = createClient();
  const corpus = buildCorpus();
  const existing = new Set(await r2.list("audio/"));
  const pending = corpus.filter((clip) => !existing.has(clip.objectKey));
  const plannedChars = pending.reduce((sum, clip) => sum + clip.chars, 0);
  console.log(`curriculum texts : ${corpus.length}`);
  console.log(`already in R2    : ${corpus.length - pending.length}`);
  console.log(`missing clips    : ${pending.length}`);
  console.log(`planned chars    : ${plannedChars.toLocaleString()}`);

  if (VERIFY_ONLY) {
    if (pending.length) process.exitCode = 1;
    return;
  }
  if (DRY_RUN) return;
  if (!CONFIRMED) throw new Error("Paid generation requires --confirm.");
  if (!Number.isFinite(MAX_CHARS) || MAX_CHARS <= 0 || plannedChars > MAX_CHARS) {
    throw new Error(
      `Planned corpus is ${plannedChars} characters; provide --max-chars at or above that amount.`
    );
  }
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing from .env.local.");
  await r2.verify();

  let cursor = 0;
  let generated = 0;
  async function worker() {
    while (cursor < pending.length) {
      const clip = pending[cursor++];
      const bytes = await withRetry(() => synthesise(clip, apiKey));
      const backupPath = path.join(ROOT, "audio_backup", clip.objectKey);
      fs.mkdirSync(path.dirname(backupPath), { recursive: true });
      fs.writeFileSync(backupPath, bytes);
      await r2.put(clip.objectKey, bytes, { contentType: "audio/mpeg", immutable: true });
      const roundTrip = await r2.get(clip.objectKey);
      if (!roundTrip?.equals(bytes))
        throw new Error(`R2 verification failed for ${clip.objectKey}`);
      generated += 1;
      if (generated % 20 === 0 || generated === pending.length) {
        console.log(`generated ${generated}/${pending.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`generated        : ${generated}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
