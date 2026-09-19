const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { audioHash, AUDIO_PROFILE } = require("./lib/assetKey.cjs");
const feedbackPhrases = require("../src/app/exercises/feedbackPhrases.json");

loadEnv();

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "assets", "audio-batches", "feedback");
fs.mkdirSync(OUT_DIR, { recursive: true });

// This catalog is also imported by the app, preventing spoken text and R2
// content hashes from drifting apart. Every item is a complete standalone
// utterance: no word-identification stem is generated or spliced afterward.
const phrases = new Set([...feedbackPhrases.correct, ...feedbackPhrases.incorrect]);

async function run() {
  let count = 0;
  for (const text of phrases) {
    const hash = audioHash(text);
    const dest = path.join(OUT_DIR, `${hash}.mp3`);
    if (fs.existsSync(dest)) {
      console.log(`Exists: ${hash} ("${text}")`);
      continue;
    }

    console.log(`Generating: ${hash} ("${text}")`);
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${AUDIO_PROFILE.voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: AUDIO_PROFILE.modelId,
          voice_settings: {
            stability: AUDIO_PROFILE.stability,
            similarity_boost: AUDIO_PROFILE.similarityBoost,
          },
        }),
      }
    );

    if (!res.ok) {
      console.error("Failed:", await res.text());
      process.exit(1);
    }

    const buffer = await res.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
    count++;
  }

  console.log(`Generated ${count} new files in ${OUT_DIR}`);
  console.log("Upload these to Cloudflare R2 bucket: wordpix");
}

run();
