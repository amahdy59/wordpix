/** Normalises authored English before hashing, synthesis and billing. */
function normaliseAudioText(rawText) {
  return String(rawText)
    .replace(/\\"/g, '"')
    .replace(/\\n/g, " ")
    .replace(/_{2,}/g, "blank")
    .replace(/\s+/g, " ")
    .trim();
}
module.exports = { normaliseAudioText };
