import fs from "node:fs/promises";
import { createRequire } from "node:module";
import { digest } from "./lib/media_catalog.mjs";

const require = createRequire(import.meta.url);
const { audioHash } = require("./lib/assetKey.cjs");
const root = "output/media-followup-2026-10-30/audio-quality";
const read = async (file) => JSON.parse(await fs.readFile(file, "utf8"));
const [plan, aliases, snapshot, overrides] = await Promise.all([
  read("output/recorded-audio/plan.json"),
  read("src/app/generated/additionalAudioRecordings.json"),
  read("output/media-catalog/r2-inventory.json"),
  read("src/app/shared/pronunciationOverrides.json"),
]);
const keys = new Set(snapshot.keys);
const selected = new Map();
const profiles = [
  {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
  },
  { voiceId: "XfNU2rGpBa01ckF309OY", modelId: "eleven_v4", stability: 0.7, similarityBoost: 0.75 },
  {
    voiceId: "Xb7hH8MSUJpSbSDYk0k2",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
  },
];
const keyFor = (row) => {
  if (row.keys.length) return row.keys.find((key) => keys.has(key)) ?? row.existingKey;
  const alias = aliases[digest(`${row.language}\0${row.text}`)];
  return alias ?? (keys.has(row.edgeKey) ? row.edgeKey : row.existingKey);
};
function take(pool, count, category) {
  for (const row of pool
    .map((row) => ({ ...row, key: keyFor(row) }))
    .filter((row) => row.key)
    .sort((a, b) => digest(a.key).localeCompare(digest(b.key)))) {
    if (selected.has(row.key)) continue;
    selected.set(row.key, { ...row, category });
    if (--count === 0) break;
  }
}
for (const override of overrides) {
  const profile = {
    voiceId: "XfNU2rGpBa01ckF309OY",
    modelId: "eleven_turbo_v2_5",
    stability: 0.7,
    similarityBoost: 0.75,
    ...override.profile,
  };
  const hash = audioHash(override.synthesisText, profile);
  const key = `audio/${hash.slice(0, 2)}/${hash}.mp3`;
  selected.set(key, {
    key,
    text: override.matches[0],
    language: "en",
    sources: ["pronunciation-override"],
    category: "pronunciation-override",
  });
}
const rows = plan.rows;
take(
  rows.filter((row) => row.language === "ar"),
  8,
  "Arabic-authored-reference"
);
take(
  rows.filter((row) => row.keys.some((key) => key.startsWith("assets/audio/scenarios/"))),
  6,
  "authored-conversation"
);
take(
  rows.filter((row) => row.sources.includes("feedback")),
  4,
  "feedback"
);
take(
  rows.filter((row) => row.language === "en" && row.text.length > 600),
  6,
  "long-English-passage"
);
take(
  rows.filter(
    (row) =>
      row.language === "en" && row.text.length < 35 && keyFor(row)?.startsWith("audio/edge-v1/")
  ),
  6,
  "short-Edge-vocabulary"
);
take(
  rows.filter(
    (row) =>
      row.language === "en" &&
      row.text.length >= 35 &&
      row.text.length < 220 &&
      keyFor(row)?.startsWith("audio/edge-v1/")
  ),
  8,
  "Edge-sentence"
);
take(
  rows.filter((row) => row.language === "en" && /^audio\/[a-f0-9]{2}\//.test(keyFor(row) ?? "")),
  6,
  "legacy-recording"
);
// Include each recoverable legacy voice/model profile, rather than assuming
// that a hashed legacy URL reveals its speaker. Unmatched sources stay unknown.
for (const profile of profiles) {
  take(
    rows.filter((row) => {
      const key = keyFor(row);
      if (!/^audio\/[a-f0-9]{2}\//.test(key ?? "")) return false;
      return [row.text, row.text.charAt(0).toUpperCase() + row.text.slice(1)].some((text) => {
        const hash = audioHash(text, profile);
        return key === `audio/${hash.slice(0, 2)}/${hash}.mp3`;
      });
    }),
    2,
    `verified-profile-${profile.voiceId}-${profile.modelId}`
  );
}
await fs.mkdir(`${root}/clips`, { recursive: true });
const results = [];
let cursor = 0;
const pending = [...selected.values()];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < pending.length) {
      const row = pending[cursor++];
      const url = `https://pub-e84a3f9882a141ac9f33296bbad85e2a.r2.dev/${row.key}`;
      try {
        const start = performance.now();
        const response = await fetch(url, {
          headers: { Origin: "https://amahdy59.github.io" },
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) throw Error(`GET ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!bytes.length) throw Error("Empty recording");
        const sha256 = digest(bytes);
        const file = `${root}/clips/${sha256}.mp3`;
        await fs.writeFile(file, bytes);
        results.push({
          key: row.key,
          url,
          expected: row.text,
          language: row.language,
          category: row.category,
          sources: row.sources,
          file,
          sha256,
          bytes: bytes.length,
          publicGetMs: Math.round(performance.now() - start),
          cors: response.headers.get("access-control-allow-origin"),
          status: "downloaded-for-review",
        });
      } catch (error) {
        results.push({
          key: row.key,
          url,
          expected: row.text,
          category: row.category,
          language: row.language,
          status: "held",
          error: error.message,
        });
      }
    }
  })
);
results.sort((a, b) => a.category.localeCompare(b.category) || a.key.localeCompare(b.key));
const summary = {
  generatedAt: new Date().toISOString(),
  planGeneratedAt: plan.generatedAt,
  inputsDigest: plan.inputsDigest,
  sampleSize: results.length,
  downloaded: results.filter((row) => row.file).length,
  held: results.filter((row) => !row.file).length,
  r2Writes: 0,
  mappingChanges: 0,
  note: "Stratified sample, not a full listening audit. GET latency is not browser playback startup latency.",
};
await fs.writeFile(
  `${root}/sample.json`,
  JSON.stringify({ summary, clips: results }, null, 2) + "\n"
);
const escape = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]
  );
await fs.writeFile(
  `${root}/listen.html`,
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>WordPix listening review</title><style>:root{--paper:#fff;--ink:#17202a;--line:#52616b;--focus:#003a8c}body{max-width:60rem;margin:auto;padding:1rem;background:var(--paper);color:var(--ink);font:1rem/1.6 system-ui}article{padding:1rem;border-bottom:2px solid var(--line)}audio{width:100%;min-height:48px}a{color:var(--focus)}:focus-visible{outline:3px solid var(--focus);outline-offset:3px}code{overflow-wrap:anywhere}</style><h1>WordPix listening review</h1><p>Check pronunciation and stress, complete starts/ends, intelligibility and level consistency against each exact transcript. Automated signal and transcription results are review clues, not pronunciation approval. Native audio controls do not autoplay or preload all clips.</p>${results.map((row, index) => `<article><h2>${index + 1}. ${escape(row.category)}</h2><p lang="${row.language === "ar" ? "ar" : "en"}" dir="${row.language === "ar" ? "rtl" : "ltr"}">${escape(row.expected)}</p>${row.file ? `<audio controls preload="none" aria-label="Listen to review sample ${index + 1}" src="clips/${row.sha256}.mp3"></audio>` : `<p>${escape(row.error)}</p>`}<p><code>${escape(row.key)}</code></p></article>`).join("")}</html>`
);
console.log(JSON.stringify(summary, null, 2));
if (summary.held) process.exitCode = 1;
