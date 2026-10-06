/** Add correct v4 keys for previously generated clips, preserving every old object. */
const fs = require("node:fs");
const { loadEnv } = require("./lib/env.cjs");
loadEnv();
const { createClient } = require("./lib/r2.cjs");
const { AUDIO_PROFILE, audioHash, profileFingerprint } = require("./lib/assetKey.cjs");
async function main() {
  const profile = { ...AUDIO_PROFILE, modelId: "eleven_v4" };
  const oldLedger = JSON.parse(fs.readFileSync("assets/audio-ledger-v4.json", "utf8"));
  const corpus = JSON.parse(fs.readFileSync("scratch/usage_audio_corpus.json", "utf8"));
  const r2 = createClient();
  const repaired = { profile: profileFingerprint(profile), clips: {} };
  let copied = 0;
  for (const clip of corpus) {
    const entry = oldLedger.clips[clip.hash];
    if (!entry || entry.reused) continue;
    const hash = audioHash(clip.text, profile);
    const sourceKey = `audio/${clip.hash.slice(0, 2)}/${clip.hash}.mp3`;
    const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    if (!await r2.exists(key)) {
      const bytes = await r2.get(sourceKey);
      if (!bytes?.length) throw new Error(`Source clip missing: ${sourceKey}`);
      await r2.put(key, bytes, { contentType: "audio/mpeg" });
      const headers = await r2.head(key);
      if (Number(headers?.["content-length"]) !== bytes.length) throw new Error(`Upload size mismatch: ${key}`);
      copied += 1;
    }
    repaired.clips[hash] = { ...entry, sourceKey };
  }
  fs.writeFileSync("assets/audio-ledger-v4-repaired.json", JSON.stringify(repaired, null, 2) + "\n");
  console.log(JSON.stringify({ copied, verified: Object.keys(repaired.clips).length, elevenLabsRequests: 0, deleted: 0 }));
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
