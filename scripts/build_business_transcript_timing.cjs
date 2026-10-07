/** Bundle only measured timing for the Business recordings that exist. */
const fs = require("node:fs");
const path = require("node:path");
const manifest = require("../src/app/learning/business/businessReadingAudioManifest.json");
const { audioHash } = require("./lib/assetKey.cjs");
const output = {};
for (const unit of Object.values(manifest.units)) {
  for (const entry of [unit.full, ...unit.paragraphs].filter(Boolean)) {
    const hash = audioHash(entry.text, manifest.profile);
    const metadata = JSON.parse(
      fs.readFileSync(
        path.join("audio_backup/business-reading-01-40-v4", `${hash}.alignment.json`),
        "utf8"
      )
    );
    const alignment = metadata.alignment;
    const text = alignment.characters.join("");
    if (text !== entry.text) throw new Error(`Alignment transcript differs: ${hash}`);
    let cursor = 0;
    const offsets = alignment.characters.map((character) => {
      const offset = cursor;
      cursor += character.length;
      return offset;
    });
    output[entry.key] = [
      ...new Intl.Segmenter("en", { granularity: "sentence" }).segment(text),
    ].map((segment) => {
      const start = segment.index;
      const end = start + segment.segment.length;
      const first = offsets.findIndex((value) => value >= start);
      let last = first;
      while (last + 1 < offsets.length && offsets[last + 1] < end) last++;
      return {
        start,
        end,
        from: alignment.character_start_times_seconds[first],
        to: alignment.character_end_times_seconds[last],
      };
    });
  }
}
fs.writeFileSync(
  "src/app/learning/business/businessTranscriptTiming.json",
  JSON.stringify(output) + "\n"
);
console.log(`Bundled measured timing for ${Object.keys(output).length} Business recordings`);
