import { readFile, writeFile } from "node:fs/promises";
const corpus = JSON.parse(await readFile("scratch/audio_corpus.json", "utf8"));
const ledger = JSON.parse(await readFile("assets/audio-ledger.json", "utf8"));
const pending = corpus.filter((clip) => !ledger.clips[clip.hash]);
const byTier = (items) => Object.fromEntries([...new Set(items.map((item) => item.tier))].map((tier) => { const rows = items.filter((item) => item.tier === tier); return [tier, { clips: rows.length, characters: rows.reduce((sum, row) => sum + row.chars, 0) }]; }));
const report = { generatedAt: "2026-10-06", profile: corpus[0]?.profile ?? null, corpusClips: corpus.length, alreadyLedgerClips: corpus.length - pending.length, pendingClips: pending.length, pendingCharacters: pending.reduce((sum, item) => sum + item.chars, 0), byTier: byTier(pending), note: "This is a dry-run inventory. It does not call ElevenLabs or modify R2." };
await writeFile("docs/AUDIO_REMAINING_REVIEW_2026-10-06.json", `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
