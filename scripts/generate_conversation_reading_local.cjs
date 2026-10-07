/** Generate Conversation 1–20 reading audio locally; never mutate R2 or its ledger. */
const fs = require("node:fs");
const path = require("node:path");
const { loadEnv } = require("./lib/env.cjs");
const { audioHash } = require("./lib/assetKey.cjs");
const { normaliseAudioText } = require("./lib/audioText.cjs");
loadEnv();
const profile = {
  voiceId: "XfNU2rGpBa01ckF309OY",
  modelId: "eleven_v4",
  stability: 0.7,
  similarityBoost: 0.75,
};
const { directory: out, firstUnit, lastUnit, course } = require("./lib/conversationBatch.cjs");
const ledger = JSON.parse(fs.readFileSync("assets/audio-ledger.json", "utf8"));
const units = require("./lib/specialistAudioCatalog.cjs").filter(
  (u) => course === "business" || (u.unitNumber >= firstUnit && u.unitNumber <= lastUnit)
);
const items = new Map();
for (const unit of units) {
  [
    unit.reading.fullText || unit.reading.title + ". " + unit.reading.paragraphs.join(" "),
    ...unit.reading.paragraphs,
  ].forEach((raw, i) => {
    const text = normaliseAudioText(raw),
      hash = audioHash(text, profile);
    if (!items.has(hash))
      items.set(hash, {
        hash,
        text,
        unit: unit.unitNumber,
        track: i === 0 ? "full" : `paragraph-${i}`,
        chars: text.length,
      });
  });
}
const missing = [...items.values()].filter(
  (item) => !fs.existsSync(path.join(out, item.hash + ".mp3"))
);
const chars = missing.reduce((sum, item) => sum + item.chars, 0);
console.log(
  JSON.stringify({
    model: profile.modelId,
    units: units.length,
    tracks: items.size,
    pending: missing.length,
    characters: chars,
    estimatedBaseCredits: chars,
    output: out,
  })
);
async function main() {
  if (!process.argv.includes("--generate")) return;
  const apiKey = process.argv.includes("--key=primary")
    ? process.env.ELEVENLABS_API_KEY || process.env.Elevenlabs_API_key
    : process.env.Elevenlabs_API_key_2 ||
      process.env.ELEVENLABS_API_KEY ||
      process.env.Elevenlabs_API_key;
  if (!apiKey) throw new Error("No ElevenLabs key configured");
  fs.mkdirSync(out, { recursive: true });
  const manifestPath = path.join(out, "manifest.json");
  const manifestBody = JSON.stringify({ profile, items: [...items.values()] }, null, 2);
  if (fs.existsSync(manifestPath) && fs.readFileSync(manifestPath, "utf8") !== manifestBody)
    throw new Error("Existing batch manifest differs; preserved");
  if (!fs.existsSync(manifestPath)) fs.writeFileSync(manifestPath, manifestBody, { flag: "wx" });
  let generated = 0;
  let cursor = 0;
  let stopped = false;
  async function worker() {
    while (!stopped && cursor < missing.length) {
      const item = missing[cursor++];
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}/with-timestamps`,
          {
            method: "POST",
            headers: { "xi-api-key": apiKey, "content-type": "application/json" },
            body: JSON.stringify({
              text: item.text,
              model_id: profile.modelId,
              language_code: "en",
              voice_settings: {
                stability: profile.stability,
                similarity_boost: profile.similarityBoost,
              },
            }),
            signal: AbortSignal.timeout(120000),
          }
        );
        if (!response.ok) {
          stopped = true;
          const error = await response.json().catch(() => ({}));
          console.log(
            JSON.stringify({
              stopped: true,
              status: response.status,
              generated,
              unit: item.unit,
              track: item.track,
              detail: error.detail,
            })
          );
          process.exitCode = 1;
          return;
        }
        const result = await response.json();
        const bytes = Buffer.from(result.audio_base64 || "", "base64");
        if (bytes.length < 100) throw new Error("Invalid audio response; stopped without saving");
        fs.writeFileSync(
          path.join(out, item.hash + ".alignment.json"),
          JSON.stringify(
            {
              generatedAt: new Date().toISOString(),
              model: profile.modelId,
              alignment: result.alignment,
              normalized_alignment: result.normalized_alignment,
            },
            null,
            2
          ),
          { flag: "wx" }
        );
        fs.writeFileSync(path.join(out, item.hash + ".mp3"), bytes, { flag: "wx" });
        generated++;
        console.log(
          `Recorded ${generated}/${missing.length}: unit ${item.unit}, ${item.track}, ${bytes.length} bytes`
        );
      } catch (error) {
        stopped = true;
        throw error;
      }
    }
  }
  await Promise.all(Array.from({ length: course === "business" ? 3 : 1 }, () => worker()));
  if (process.exitCode) return;
  console.log(JSON.stringify({ complete: true, generated, output: out }));
}
main().catch((error) => {
  console.error(`Generation stopped: ${error.message}. Saved clips are resumable.`);
  process.exitCode = 1;
});
