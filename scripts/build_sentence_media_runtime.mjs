import fs from "node:fs/promises";
import { compileSentenceMedia } from "./lib/sentence_media_runtime.mjs";
if (process.argv.slice(2).some((arg) => arg !== "--check"))
  throw Error("Only --check is supported");
const read = async (path) => JSON.parse(await fs.readFile(path, "utf8"));
const data = compileSentenceMedia(
  await read("src/app/generated/reviewedExactSentenceMedia.json"),
  await read("src/app/generated/rejectedSentenceMedia.json")
);
const output = JSON.stringify(data) + "\n",
  target = "src/app/generated/sentenceMediaRuntime.json";
if (process.argv.includes("--check")) {
  if ((await fs.readFile(target, "utf8")).replace(/\r\n/g, "\n") !== output)
    throw Error(
      "Stale sentence-media runtime table; run node scripts/build_sentence_media_runtime.mjs"
    );
} else await fs.writeFile(target, output);
console.log(
  `Sentence-media runtime: ${data.rows.length} exact pairs, ${Math.round(Buffer.byteLength(output) / 1024)} KiB; source mappings unchanged`
);
