const fs = require("fs");
const path = require("path");
const { loadEnv } = require("./lib/env.cjs");
const { audioHash, AUDIO_PROFILE, profileFingerprint } = require("./lib/assetKey.cjs");

loadEnv();

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Missing ELEVENLABS_API_KEY");
  process.exit(1);
}

const OUT_DIR = path.join(__dirname, "..", "assets", "audio-batches", "feedback");
fs.mkdirSync(OUT_DIR, { recursive: true });

const PRAISE = ["Correct!", "Well done!", "That's right.", "Nice work!", "Exactly."];
const CORRECTION = ["Not quite.", "Close.", "Almost."];
const IDENTIFY = [
  "This is a ",
  "This is an ",
  "This is a pair of ",
  "These are ",
  "The word is \"",
  "This is ",
];
const CONTRAST = [
  "That's a ",
  "That's an ",
  "That's a pair of ",
  "Those are ",
  "That's \"",
  "That's ",
];

const phrases = new Set();

// 1. Correct praise + identify
for (const p of PRAISE) {
  for (const i of IDENTIFY) {
    phrases.add(`${p} ${i}`);
  }
}

// 2. Correction + contrast
for (const c of CORRECTION) {
  for (const cont of CONTRAST) {
    phrases.add(`${c} ${cont}`);
  }
}

// 3. Standalone identify (for the second part of wrong answers)
for (const i of IDENTIFY) {
  phrases.add(i);
}

// Ensure the strings match what `feedbackSpeech.ts` generates!
// e.g., "The word is \"" vs "The word is “"
// `wordGrammar.ts` uses OPEN_QUOTE which is '“' (\u201C)
// Wait! Let's check `OPEN_QUOTE` in `wordGrammar.ts`.
const OPEN_QUOTE = "\u201c"; // “
const CLOSE_QUOTE = "\u201d"; // ”

const phrasesCorrected = new Set();
for (const text of phrases) {
  phrasesCorrected.add(text.replace(/"/g, OPEN_QUOTE)); // Use smart quotes if present
}

async function run() {
  let count = 0;
  for (const text of phrasesCorrected) {
    const hash = audioHash(text);
    const dest = path.join(OUT_DIR, `${hash}.mp3`);
    if (fs.existsSync(dest)) {
      console.log(`Exists: ${hash} ("${text}")`);
      continue;
    }

    console.log(`Generating: ${hash} ("${text}")`);
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${AUDIO_PROFILE.voiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        model_id: AUDIO_PROFILE.modelId,
        voice_settings: {
          stability: AUDIO_PROFILE.stability,
          similarity_boost: AUDIO_PROFILE.similarityBoost
        }
      })
    });

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
