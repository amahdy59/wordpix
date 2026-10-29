const crypto = require("node:crypto");
const voices = { en: "en-US-JennyNeural", ar: "ar-SA-ZariyahNeural" };

function validateRecording(item) {
  if (!item || typeof item.text !== "string" || !Object.hasOwn(voices, item.language))
    throw Error("Invalid recording language/text");
  const voice = voices[item.language];
  const normalized = item.text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  const payload = `edge-v1|${voice}|rate=+0%|pitch=+0Hz|volume=+0%\n${normalized}`;
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  const key = `audio/edge-v1/${voice}/${hash}.mp3`;
  if (!normalized || normalized !== item.text || item.edgeKey !== key)
    throw Error("Recording source does not match its immutable key");
  return { key, voice };
}

module.exports = { validateRecording };
