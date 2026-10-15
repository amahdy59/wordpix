/**
 * WordPix - Sync Business Multi-Voice Audio to Application Manifest & Timing JSON
 *
 * Strict Non-Deletion Policy:
 * Preserves all existing unit-01 entries and existing timing mappings.
 */
const fs = require("node:fs");
const path = require("node:path");
const { normaliseAudioText } = require("./lib/audioText.cjs");
const { audioHash } = require("./lib/assetKey.cjs");

const MANIFEST_PATH = "src/app/learning/business/businessReadingAudioManifest.json";
const TIMING_PATH = "src/app/learning/business/businessTranscriptTiming.json";
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
const units = [...u1, ...u2].slice(1);

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
const timing = JSON.parse(fs.readFileSync(TIMING_PATH, "utf8"));

let updatedUnits = 0;
let updatedParagraphs = 0;

for (const unit of units) {
  const normalize = (t) => t.replace(/\s+/g, " ").trim();
  const narratorPassages = [];
  const paragraphs = [];

  // 1. Context
  if (unit.mainInput.context && unit.mainInput.context.trim()) {
    const rawContext = unit.mainInput.context;
    const text = normaliseAudioText(rawContext);
    const profile = NARRATOR_PROFILE;
    const hash = audioHash(text, profile);
    const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    const timingKey = `audio/${hash.slice(0, 2)}/${hash}.timing.json`;

    const timingFile = path.join(OUT_DIR, `${hash}.timing.json`);
    if (fs.existsSync(timingFile)) {
      paragraphs.push({ key, text, timingKey });
      timing[key] = JSON.parse(fs.readFileSync(timingFile, "utf8"));
    }
    narratorPassages.push(normalize(rawContext));
  }

  // 2. Dialogue lines
  unit.mainInput.dialogue.forEach((line) => {
    const norm = normalize(line.text);
    if (line.speaker.trim().toLowerCase() === "narrator") {
      if (narratorPassages.some((p) => p === norm || p.includes(norm))) return;
      narratorPassages.push(norm);
    }
    const text = normaliseAudioText(line.text);
    const profile = getVoiceProfile(line.speaker);
    const hash = audioHash(text, profile);
    const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    const timingKey = `audio/${hash.slice(0, 2)}/${hash}.timing.json`;

    const timingFile = path.join(OUT_DIR, `${hash}.timing.json`);
    if (fs.existsSync(timingFile)) {
      paragraphs.push({ key, text, timingKey });
      timing[key] = JSON.parse(fs.readFileSync(timingFile, "utf8"));
    }
  });

  if (paragraphs.length > 0) {
    manifest.units[unit.id] = {
      full: null,
      paragraphs,
    };
    updatedUnits++;
    updatedParagraphs += paragraphs.length;
  } else {
    delete manifest.units[unit.id];
  }
}

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
fs.writeFileSync(TIMING_PATH, JSON.stringify(timing, null, 2) + "\n");

console.log(
  `Synced ${updatedUnits} units and ${updatedParagraphs} paragraphs to manifest and timing.`
);
