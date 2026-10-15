/**
 * WordPix - Business English Multi-Voice Audio Generator
 *
 * Casts characters to appropriate ElevenLabs voice personas:
 * - Narrator: Nichalia Schwartz (XfNU2rGpBa01ckF309OY)
 * - Male characters: Brian (nPczCjzI2devNBz1zQrb)
 * - Female characters: Sarah (EXAVITQu4vr4xnSDxMaL)
 *
 * Strict Non-Deletion Policy:
 * Never deletes, overwrites, or modifies existing clips or ledger entries.
 */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { audioHash, normaliseText } = require("./lib/assetKey.cjs");
const { normaliseAudioText } = require("./lib/audioText.cjs");

loadEnv();

const OUT_DIR = path.resolve("audio_backup/business-reading-multivoice-v4");

const NARRATOR_PROFILE = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  name: "Nichalia (Narrator)",
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};

const MALE_PROFILE = {
  voiceId: "nPczCjzI2devNBz1zQrb",
  name: "Brian (Male)",
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};

const FEMALE_PROFILE = {
  voiceId: "EXAVITQu4vr4xnSDxMaL",
  name: "Sarah (Female)",
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};

function getVoiceProfile(speaker) {
  const s = String(speaker || "").trim().toLowerCase();
  const maleSpeakers = [
    "youssef", "daniel", "omar", "hassan", "karim", "rami", "amir",
    "buyer", "supplier", "engineer", "product manager", "candidate b"
  ];
  const femaleSpeakers = [
    "mariam", "manager", "sara", "sarah", "colleague", "client",
    "nadia", "salma", "mona", "nour", "customer", "agent",
    "hana", "mina", "meeting lead", "aisha", "chair", "candidate a"
  ];
  if (maleSpeakers.includes(s)) return MALE_PROFILE;
  if (femaleSpeakers.includes(s)) return FEMALE_PROFILE;
  return NARRATOR_PROFILE;
}

const u1 = require("../src/app/learning/business/businessCatalog.units-01-20.json");
const u2 = require("../src/app/learning/business/businessCatalog.units-21-40.json");
// Units 02 to 40 (Unit 01 already in R2)
const units = [...u1, ...u2].slice(1);

const itemsMap = new Map();
const unitManifestMap = new Map();

for (const unit of units) {
  const normalize = (t) => t.replace(/\s+/g, " ").trim();
  const narratorPassages = [];
  const unitItems = [];

  // 1. Context (if standalone narrative)
  if (unit.mainInput.context && unit.mainInput.context.trim()) {
    const rawContext = unit.mainInput.context;
    const text = normaliseAudioText(rawContext);
    const profile = NARRATOR_PROFILE;
    const hash = audioHash(text, profile);
    const item = {
      hash,
      text,
      unit: unit.id,
      speaker: "Narrator",
      track: "context",
      voiceId: profile.voiceId,
      profile,
      chars: text.length,
    };
    if (!itemsMap.has(hash)) itemsMap.set(hash, item);
    unitItems.push(item);
    narratorPassages.push(normalize(rawContext));
  }

  // 2. Visible dialogue turns
  unit.mainInput.dialogue.forEach((line, idx) => {
    const norm = normalize(line.text);
    if (line.speaker.trim().toLowerCase() === "narrator") {
      if (narratorPassages.some((p) => p === norm || p.includes(norm))) return;
      narratorPassages.push(norm);
    }
    const text = normaliseAudioText(line.text);
    const profile = getVoiceProfile(line.speaker);
    const hash = audioHash(text, profile);
    const item = {
      hash,
      text,
      unit: unit.id,
      speaker: line.speaker,
      track: `dialogue-${idx}`,
      voiceId: profile.voiceId,
      profile,
      chars: text.length,
    };
    if (!itemsMap.has(hash)) itemsMap.set(hash, item);
    unitItems.push(item);
  });

  unitManifestMap.set(unit.id, unitItems);
}

const allItems = [...itemsMap.values()];
const unitArg = process.argv.find((a) => a.startsWith("--unit="));
const targetUnit = unitArg ? unitArg.split("=")[1] : null;

const limitArg = process.argv.find((a) => a.startsWith("--limit="));
const limitCount = limitArg ? Number(limitArg.split("=")[1]) : null;

let missing = allItems.filter(
  (item) => !fs.existsSync(path.join(OUT_DIR, `${item.hash}.mp3`))
);

if (targetUnit) {
  missing = missing.filter((item) => item.unit === targetUnit);
}
if (limitCount && limitCount > 0) {
  missing = missing.slice(0, limitCount);
}

const missingChars = missing.reduce((sum, item) => sum + item.chars, 0);

console.log(
  JSON.stringify(
    {
      totalUnits: units.length,
      uniqueItems: allItems.length,
      pendingItems: missing.length,
      pendingCharacters: missingChars,
      outputDir: OUT_DIR,
    },
    null,
    2
  )
);

function buildTiming(alignment, text) {
  let cursor = 0;
  const offsets = alignment.characters.map((character) => {
    const offset = cursor;
    cursor += character.length;
    return offset;
  });
  return [
    ...new Intl.Segmenter("en", { granularity: "sentence" }).segment(text),
  ].map((segment) => {
    const start = segment.index;
    const end = start + segment.segment.length;
    const first = offsets.findIndex((value) => value >= start);
    let last = first;
    while (last + 1 < offsets.length && offsets[last + 1] < end) last++;
    return {
      start,
      end,
      from: alignment.character_start_times_seconds[first] ?? 0,
      to: alignment.character_end_times_seconds[last] ?? 0,
    };
  });
}

async function main() {
  if (!process.argv.includes("--generate")) {
    console.log("Dry run complete. Pass --generate to record audio.");
    return;
  }

  const apiKey =
    process.env.ELEVENLABS_API_KEY ||
    process.env.Elevenlabs_API_key ||
    process.env.Elevenlabs_API_key_2;

  if (!apiKey) throw new Error("No ElevenLabs API key found in environment");

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let generated = 0;
  let cursor = 0;
  let stopped = false;

  async function worker(workerId) {
    while (!stopped && cursor < missing.length) {
      const item = missing[cursor++];
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${item.profile.voiceId}/with-timestamps`,
          {
            method: "POST",
            headers: { "xi-api-key": apiKey, "content-type": "application/json" },
            body: JSON.stringify({
              text: item.text,
              model_id: item.profile.modelId,
              language_code: "en",
              voice_settings: {
                stability: item.profile.stability,
                similarity_boost: item.profile.similarityBoost,
              },
            }),
            signal: AbortSignal.timeout(60000),
          }
        );

        if (!response.ok) {
          stopped = true;
          const error = await response.json().catch(() => ({}));
          console.error(
            JSON.stringify({
              workerId,
              status: response.status,
              unit: item.unit,
              speaker: item.speaker,
              track: item.track,
              detail: error.detail,
            })
          );
          process.exitCode = 1;
          return;
        }

        const result = await response.json();
        const bytes = Buffer.from(result.audio_base64 || "", "base64");
        if (bytes.length < 100) throw new Error("Audio too short; corrupt response");

        const alignmentData = {
          generatedAt: new Date().toISOString(),
          model: item.profile.modelId,
          voiceId: item.profile.voiceId,
          speaker: item.speaker,
          alignment: result.alignment,
          normalized_alignment: result.normalized_alignment,
        };

        const timingSpans = buildTiming(result.alignment, item.text);

        fs.writeFileSync(
          path.join(OUT_DIR, `${item.hash}.alignment.json`),
          JSON.stringify(alignmentData, null, 2),
          { flag: "w" }
        );

        fs.writeFileSync(
          path.join(OUT_DIR, `${item.hash}.timing.json`),
          JSON.stringify(timingSpans, null, 2),
          { flag: "w" }
        );

        fs.writeFileSync(path.join(OUT_DIR, `${item.hash}.mp3`), bytes, { flag: "w" });

        generated++;
        console.log(
          `[${generated}/${missing.length}] (${item.unit} | ${item.speaker} - ${item.profile.name}) ${item.text.slice(0, 40)}... (${bytes.length} bytes)`
        );

        // Small delay between requests to be gentle on API rate limit
        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (err) {
        stopped = true;
        console.error(`Generation error on ${item.unit}: ${err.message}`);
        process.exitCode = 1;
        return;
      }
    }
  }

  // 2 concurrent workers for speed and reliability
  await Promise.all([worker(1), worker(2)]);

  console.log(`Generation completed: ${generated} clips created.`);
}

main().catch((err) => {
  console.error("Script failed:", err.message);
  process.exitCode = 1;
});
