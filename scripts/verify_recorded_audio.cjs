/** Read-only reconciliation: LIST/HEAD/GET only, including public playback and CORS. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");
const { validateRecording } = require("./lib/recorded_audio_key.cjs");
const { recordingInputsDigest } = require("./lib/recording_inputs.cjs");

async function verifyRecordedAudio({ requireComplete = false } = {}) {
  loadEnv();
  const client = createClient();
  const output = path.resolve("output/recorded-audio");
  const plan = JSON.parse(fs.readFileSync(path.join(output, "plan.json"), "utf8"));
  const keys = new Set([
    ...(await client.list("audio/")),
    ...(await client.list("assets/audio/scenarios/")),
  ]);
  const inputsDigest = recordingInputsDigest();
  if (requireComplete && plan.inputsDigest !== inputsDigest)
    throw Error("Playback content changed since planning; rebuild the recording plan first");
  const missing = [];
  const indexedEdge = new Set();
  for (const name of fs.readdirSync("src/app/generated/edgeRecordings")) {
    if (name.endsWith(".json"))
      for (const entry of JSON.parse(
        fs.readFileSync(`src/app/generated/edgeRecordings/${name}`, "utf8")
      ))
        indexedEdge.add(`audio/edge-v1/${entry}.mp3`);
  }
  const unlinkedEdge = [];
  for (const item of plan.rows) {
    validateRecording(item);
    if (
      (!item.existingKey || item.existingKey.startsWith("audio/edge-v1/")) &&
      keys.has(item.edgeKey) &&
      !indexedEdge.has(item.edgeKey)
    )
      unlinkedEdge.push(item.edgeKey);
    if (!keys.has(item.existingKey) && !keys.has(item.edgeKey))
      missing.push({
        text: item.text,
        language: item.language,
        sources: item.sources,
        key: item.edgeKey,
      });
  }
  const aliases = JSON.parse(
    fs.readFileSync("src/app/generated/additionalAudioRecordings.json", "utf8")
  );
  const brokenAliases = Object.values(aliases).filter((key) => !keys.has(key));
  // These corrected takes bypass general text lookup in the browser.
  const { audioKey } = require("./lib/assetKey.cjs");
  const pronunciationProfile = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
  };
  const pronunciationKeys = require("../src/app/shared/pronunciationOverrides.json").map((item) =>
    audioKey(item.synthesisText, { ...pronunciationProfile, ...item.profile })
  );
  const brokenPronunciationReferences = pronunciationKeys.filter((key) => !keys.has(key));
  const baselinePath = "output/audio-backup-audit/r2-audio-keys.json";
  const removedOriginals = fs.existsSync(baselinePath)
    ? JSON.parse(fs.readFileSync(baselinePath, "utf8")).keys.filter((key) => !keys.has(key))
    : [];
  const receiptPath = path.join(output, "upload-receipts.jsonl");
  const receipts = fs
    .readFileSync(receiptPath, "utf8")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((item) => item.status === "verified");
  const unique = [...new Map(receipts.map((item) => [item.key, item])).values()];
  const samples = [];
  const base = (
    process.env.VITE_ASSET_BASE_URL || "https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev"
  ).replace(/\/$/, "");
  const sampleCandidates = [
    unique.find((item) => item.key.startsWith("audio/edge-v1/ar-SA-ZariyahNeural/")),
    unique.find((item) => item.key.startsWith("audio/edge-v1/en-US-JennyNeural/")),
    ...unique.filter((_, index) => index % Math.max(1, Math.floor(unique.length / 12)) === 0),
  ].filter(Boolean);
  const arabicReference = plan.rows.find(
    (item) => item.language === "ar" && keys.has(item.existingKey)
  );
  if (arabicReference) {
    const head = await client.head(arabicReference.existingKey);
    const md5 = head?.etag?.replaceAll('"', "");
    const bytes = Number(head?.["content-length"]);
    if (bytes <= 512 || !/^[a-f0-9]{32}$/.test(md5 ?? ""))
      throw Error("Arabic reference has invalid audio metadata");
    sampleCandidates.unshift({ key: arabicReference.existingKey, bytes, md5, language: "ar" });
  }
  const selectedSamples = [...new Map(sampleCandidates.map((item) => [item.key, item])).values()];
  for (const item of selectedSamples.slice(0, 12)) {
    const head = await client.head(item.key);
    if (
      Number(head?.["content-length"]) !== item.bytes ||
      head?.etag?.replaceAll('"', "") !== item.md5
    )
      throw Error("Remote checksum mismatch: " + item.key);
    const response = await fetch(`${base}/${item.key}`, {
      headers: { Origin: "https://amahdy59.github.io" },
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw Error("Public recording cannot be fetched: " + item.key);
    const bytes = Buffer.from(await response.arrayBuffer());
    const cors = response.headers.get("access-control-allow-origin");
    if (
      crypto.createHash("md5").update(bytes).digest("hex") !== item.md5 ||
      (cors !== "*" && cors !== "https://amahdy59.github.io")
    )
      throw Error("Public audio bytes/CORS mismatch: " + item.key);
    samples.push({
      key: item.key,
      language: item.language ?? (item.key.includes("/ar-SA-ZariyahNeural/") ? "ar" : "en"),
      bytes: bytes.length,
      checksumVerified: true,
      corsVerified: true,
    });
  }
  const report = {
    inputsDigest,
    checkedAt: new Date().toISOString(),
    candidates: plan.rows.length,
    recordingsAvailable: plan.rows.length - missing.length,
    missingRecordings: missing.length,
    unlinkedNewRecordings: unlinkedEdge.length,
    exactAliases: Object.keys(aliases).length,
    brokenAliases: brokenAliases.length,
    specialPronunciationReferences: pronunciationKeys.length,
    brokenPronunciationReferences: brokenPronunciationReferences.length,
    removedOriginals: removedOriginals.length,
    verifiedNewUploads: unique.length,
    samples,
  };
  fs.writeFileSync(path.join(output, "verification.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(path.join(output, "remaining.json"), JSON.stringify(missing, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (
    brokenAliases.length ||
    brokenPronunciationReferences.length ||
    removedOriginals.length ||
    (requireComplete && (missing.length || unlinkedEdge.length))
  )
    throw Error(
      "Recording reconciliation is incomplete; see output/recorded-audio/verification.json"
    );
  if (requireComplete)
    fs.writeFileSync(
      "src/app/generated/recordedAudioCoverage.json",
      JSON.stringify({ schemaVersion: 1, status: "complete", ...report }, null, 2) + "\n"
    );
  return report;
}
module.exports = { verifyRecordedAudio };
if (require.main === module)
  verifyRecordedAudio({ requireComplete: process.argv.includes("--require-complete") }).catch(
    (error) => {
      console.error(error.message);
      process.exitCode = 1;
    }
  );
