/** Bundle provider-measured sentence offsets for reliable offline highlighting. */
const fs = require("node:fs");
const path = require("node:path");
const manifest = require("../src/app/learning/conversation/conversationReadingAudioManifest.json");
const catalog = require("../src/app/learning/conversation/conversationCatalog.json");
const { audioHash } = require("./lib/assetKey.cjs");
const output = {};
for (const unit of catalog) {
  const directory = `audio_backup/conversation-reading-${unit.unitNumber <= 20 ? "01-20" : "21-40"}-v4`;
  const entries = [manifest.units[unit.id].full, ...manifest.units[unit.id].paragraphs];
  output[unit.id] = entries.map((entry) => {
    const hash = audioHash(entry.text, manifest.profile);
    const metadata = JSON.parse(
      fs.readFileSync(path.join(directory, `${hash}.alignment.json`), "utf8")
    );
    const alignment = metadata.alignment;
    const transcript = alignment.characters.join("");
    if (transcript !== entry.text)
      throw new Error(`Original alignment transcript differs: ${unit.id}/${hash}`);
    const spans = [];
    let cursor = 0;
    for (const character of alignment.characters) {
      spans.push(cursor);
      cursor += character.length;
    }
    return [...new Intl.Segmenter("en", { granularity: "sentence" }).segment(transcript)].map(
      (segment) => {
        const start = segment.index;
        const end = start + segment.segment.length;
        const first = spans.findIndex((value) => value >= start);
        let last = first;
        while (last + 1 < spans.length && spans[last + 1] < end) last++;
        return {
          start,
          end,
          from: alignment.character_start_times_seconds[first],
          to: alignment.character_end_times_seconds[last],
        };
      }
    );
  });
}
const target = "src/app/learning/conversation/conversationTranscriptTiming.json";
fs.writeFileSync(target, JSON.stringify(output) + "\n");
console.log(`Bundled real sentence timing for ${catalog.length} Conversation units`);
