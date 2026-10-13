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
const { VOICES, AUDIO_PROFILE, audioKey } = require("./lib/assetKey.cjs");
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

const PRIMARY_PROFILE_V4 = {
  voiceId: VOICES.nichalia,
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};

const TRANSFER_PROFILE_V4 = {
  voiceId: VOICES.alice,
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};

const SENTENCE_PROFILE_V4 = {
  voiceId: VOICES.nichalia,
  modelId: "eleven_v4",
  stability: 0.65,
  similarityBoost: 0.75,
};

const normalize = (value) =>
  String(value).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim();

function buildCorpus() {
  const corpusMap = new Map();

  function addClip(displayText, baseProfile, speaker, category) {
    const asset = getPronunciationAssetSpec(displayText, baseProfile);
    const objectKey = audioKey(asset.text, asset.profile);
    if (!corpusMap.has(objectKey)) {
      corpusMap.set(objectKey, {
        displayText,
        synthesisText: asset.text,
        profile: asset.profile,
        speaker,
        category,
        objectKey,
        chars: asset.text.length,
      });
    }
  }

  // 1. Primary target words across all 68 lessons
  const allWordLabels = [
    ...new Set(
      SOURCE.lessons
        .flatMap((lesson) => lesson.images.map((item) => item.label))
        .filter(Boolean)
        .map(normalize)
    ),
  ];
  for (const word of allWordLabels) {
    addClip(word, PRIMARY_PROFILE_V4, "nichalia", "primary-word");
  }

  // 2. Stage 4 Transfer challenge items voiced by Alice
  const transferWordLabels = [
    ...new Set(
      SOURCE.lessons
        .flatMap((lesson) =>
          lesson.images.filter((item) => item.role === "transfer").map((item) => item.label)
        )
        .filter(Boolean)
        .map(normalize)
    ),
  ];
  for (const word of transferWordLabels) {
    addClip(word, TRANSFER_PROFILE_V4, "alice", "transfer-word");
  }

  // 3. Model delivery sentences and instructional cues
  const modelSentences = new Set();
  for (const lesson of SOURCE.lessons) {
    const lines = lesson.text;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/^Model Audio/i.test(line) && lines[i + 1]) {
        const text = normalize(lines[i + 1]);
        if (text.length > 5 && !text.startsWith("Level ") && !text.startsWith("Lesson ")) {
          modelSentences.add(text);
        }
      }
      if (/^Incorrect Retry/i.test(line) && lines[i + 1]) {
        const text = normalize(lines[i + 1]);
        if (text.length > 5) modelSentences.add(text);
      }
      if (/^Target Line:/i.test(line)) {
        const text = normalize(line.replace(/^Target Line:\s*/i, ""));
        if (text.length > 5) modelSentences.add(text);
      }
    }
  }
  for (const sentence of modelSentences) {
    addClip(sentence, SENTENCE_PROFILE_V4, "nichalia", "model-sentence");
  }

  return [...corpusMap.values()];
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
      const retriable =
        error.name === "TypeError" ||
        error.message?.includes("fetch failed") ||
        error.code === "ECONNRESET" ||
        error.status === 429 ||
        error.status >= 500;
      if (!retriable || attempt >= attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, Math.min(30_000, 1000 * 2 ** attempt)));
    }
  }
}

async function main() {
  const r2 = createClient();
  const corpus = buildCorpus();
  const existing = new Set(await withRetry(() => r2.list("audio/")));
  const pending = corpus.filter((clip) => !existing.has(clip.objectKey));
  const plannedChars = pending.reduce((sum, clip) => sum + clip.chars, 0);

  const primaryClips = corpus.filter((c) => c.category === "primary-word");
  const transferClips = corpus.filter((c) => c.category === "transfer-word");
  const sentenceClips = corpus.filter((c) => c.category === "model-sentence");

  console.log("=== PRONUNCIATION AUDIO CORPUS (OPTION D) ===");
  console.log(`total planned clips : ${corpus.length}`);
  console.log(`  - primary words   : ${primaryClips.length} (${primaryClips.reduce((s, c) => s + c.chars, 0)} chars) [Nichalia / eleven_v4]`);
  console.log(`  - transfer words  : ${transferClips.length} (${transferClips.reduce((s, c) => s + c.chars, 0)} chars) [Alice / eleven_v4]`);
  console.log(`  - model sentences : ${sentenceClips.length} (${sentenceClips.reduce((s, c) => s + c.chars, 0)} chars) [Nichalia / eleven_v4]`);
  console.log(`already in R2       : ${corpus.length - pending.length}`);
  console.log(`missing / pending   : ${pending.length}`);
  console.log(`planned characters  : ${plannedChars.toLocaleString()} chars (~${plannedChars.toLocaleString()} credits)`);

  if (VERIFY_ONLY) {
    if (pending.length) {
      console.error(`Verification failed: ${pending.length} clips missing from R2.`);
      process.exitCode = 1;
    } else {
      console.log("Verification passed: all clips present in R2.");
    }
    return;
  }
  if (DRY_RUN) return;
  if (!CONFIRMED) throw new Error("Paid generation requires --confirm.");
  if (!Number.isFinite(MAX_CHARS) || MAX_CHARS <= 0 || plannedChars > MAX_CHARS) {
    throw new Error(
      `Planned corpus is ${plannedChars} characters; provide --max-chars at or above that amount.`
    );
  }
  const apiKey = process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key;
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is missing from .env.local.");
  await r2.verify();

  let cursor = 0;
  let generated = 0;
  let reusedBackup = 0;
  async function worker() {
    while (cursor < pending.length) {
      const clip = pending[cursor++];
      const backupPath = path.join(ROOT, "audio_backup", clip.objectKey);
      let bytes;
      if (fs.existsSync(backupPath) && fs.statSync(backupPath).size >= 1024) {
        bytes = fs.readFileSync(backupPath);
        reusedBackup += 1;
      } else {
        bytes = await withRetry(() => synthesise(clip, apiKey));
        fs.mkdirSync(path.dirname(backupPath), { recursive: true });
        fs.writeFileSync(backupPath, bytes);
      }
      await r2.put(clip.objectKey, bytes, { contentType: "audio/mpeg", immutable: true });
      const roundTrip = await r2.get(clip.objectKey);
      if (!roundTrip?.equals(bytes))
        throw new Error(`R2 verification failed for ${clip.objectKey}`);
      generated += 1;
      if (generated % 20 === 0 || generated === pending.length) {
        console.log(`generated/uploaded ${generated}/${pending.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  console.log(`completed        : ${generated} clips (reused local backup: ${reusedBackup})`);
  console.log("Run 'pnpm run audio:pronunciation:manifest' to reconcile manifest with new clips.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
