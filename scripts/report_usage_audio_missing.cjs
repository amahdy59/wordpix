const fs = require("node:fs");
const corpus = JSON.parse(fs.readFileSync("scratch/usage_audio_corpus.json", "utf8"));
const ledger = JSON.parse(fs.readFileSync("assets/audio-ledger.json", "utf8"));
const missing = corpus.filter((clip) => !ledger.clips[clip.hash]);
const byTier = Object.fromEntries(["phrases", "phrase-examples", "paragraphs"].map((tier) => {
  const rows = missing.filter((clip) => clip.tier === tier);
  return [tier, { clips: rows.length, characters: rows.reduce((sum, row) => sum + row.chars, 0), items: rows }];
}));
const report = { generatedAt: "2026-10-06", totalMissingClips: missing.length, totalMissingCharacters: missing.reduce((sum, row) => sum + row.chars, 0), byTier };
fs.writeFileSync("docs/USAGE_AUDIO_REMAINING_2026-10-06.json", JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ totalMissingClips: report.totalMissingClips, totalMissingCharacters: report.totalMissingCharacters, byTier: Object.fromEntries(Object.entries(byTier).map(([key, value]) => [key, { clips: value.clips, characters: value.characters }])) }));
