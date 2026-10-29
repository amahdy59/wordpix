/** Add exact-transcript aliases and publish only locally verified upload receipts. No R2 writes. */
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { audioHash } = require("./lib/assetKey.cjs");
const { loadEnv } = require("./lib/env.cjs");
const { createClient } = require("./lib/r2.cjs");

async function main() {
  const output = path.resolve("output/recorded-audio");
  const plan = JSON.parse(fs.readFileSync(path.join(output, "plan.json"), "utf8"));
  loadEnv();
  const client = createClient();
  const keys = new Set([
    ...(await client.list("audio/")),
    ...(await client.list("assets/audio/scenarios/")),
  ]);
  const aliasPath = "src/app/generated/additionalAudioRecordings.json";
  const aliases = JSON.parse(fs.readFileSync(aliasPath, "utf8"));
  const proof = [];
  const profile = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
  };
  for (const item of plan.rows) {
    if (
      !item.existingKey ||
      !keys.has(item.existingKey) ||
      item.existingKey.startsWith("audio/edge-v1/")
    )
      continue;
    const standard = [profile, { ...profile, modelId: "eleven_v4" }].map((profile) => {
      const hash = audioHash(item.text, profile);
      return `audio/${hash.slice(0, 2)}/${hash}.mp3`;
    });
    // Existing default takes remain preferred. Aliases repair misses, including historical voices.
    if (standard.some((key) => keys.has(key))) continue;
    const identity = crypto
      .createHash("sha256")
      .update(`${item.language}\0${item.text}`)
      .digest("hex");
    if (aliases[identity] && aliases[identity] !== item.existingKey)
      throw Error("Conflicting exact-text alias: " + identity);
    aliases[identity] = item.existingKey;
    proof.push({
      text: item.text,
      language: item.language,
      key: item.existingKey,
      sources: item.sources,
    });
  }
  for (const key of Object.values(aliases))
    if (!keys.has(key)) throw Error("Alias points to a missing R2 object: " + key);
  const receipts = fs
    .readFileSync(path.join(output, "upload-receipts.jsonl"), "utf8")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line));
  const shards = new Map();
  for (const item of receipts) {
    if (
      item.status !== "verified" ||
      !keys.has(item.key) ||
      item.bytes <= 512 ||
      !/^[a-f0-9]{32}$/.test(item.md5)
    )
      continue;
    const match =
      /^audio\/edge-v1\/((?:en-US-JennyNeural|ar-SA-ZariyahNeural)\/([a-f0-9]{64}))\.mp3$/.exec(
        item.key
      );
    if (!match) throw Error("Unexpected verified recording key");
    const prefix = match[2].slice(0, 2);
    if (!shards.has(prefix)) shards.set(prefix, new Set());
    shards.get(prefix).add(match[1]);
  }
  fs.writeFileSync(
    aliasPath,
    JSON.stringify(Object.fromEntries(Object.entries(aliases).sort()), null, 2) + "\n"
  );
  const aliasShards = new Map();
  for (const [id, key] of Object.entries(aliases)) {
    const prefix = id.slice(0, 2);
    if (!aliasShards.has(prefix)) aliasShards.set(prefix, {});
    aliasShards.get(prefix)[id] = key;
  }
  fs.mkdirSync("src/app/generated/additionalRecordings", { recursive: true });
  for (const [prefix, entries] of aliasShards)
    fs.writeFileSync(
      `src/app/generated/additionalRecordings/${prefix}.json`,
      JSON.stringify(entries) + "\n"
    );
  fs.mkdirSync("src/app/generated/edgeRecordings", { recursive: true });
  for (const [prefix, entries] of shards)
    fs.writeFileSync(
      `src/app/generated/edgeRecordings/${prefix}.json`,
      JSON.stringify([...entries].sort()) + "\n"
    );
  fs.writeFileSync(
    path.join(output, "link-proof.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        aliases: proof,
        edgeClips: [...shards.values()].reduce((sum, entries) => sum + entries.size, 0),
      },
      null,
      2
    )
  );
  console.log(
    JSON.stringify({
      aliases: Object.keys(aliases).length,
      edgeClips: [...shards.values()].reduce((sum, entries) => sum + entries.size, 0),
    })
  );
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
