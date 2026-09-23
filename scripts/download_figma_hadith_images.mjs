import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const env = await fs.readFile(path.join(root, ".env.local"), "utf8");
const token = env.match(/^Figma_token=(.*)$/m)?.[1]?.trim();
if (!token) throw new Error("Figma_token is missing from .env.local");
const content = JSON.parse(
  await fs.readFile(path.join(root, "src/app/learning/hadith/figmaHadithContent.json"), "utf8")
);
const response = await fetch("https://api.figma.com/v1/files/gRlyhrMavAHXUAT5brWFWu/images", {
  headers: { "X-Figma-Token": token },
});
if (!response.ok) throw new Error(`Figma image map request failed: ${response.status}`);
const payload = await response.json();
const images = payload.meta?.images ?? {};
const imageRefs = [...new Set(content.visualVocabulary.map((item) => item.imageRef))];
const selected = Object.fromEntries(
  imageRefs.filter((ref) => images[ref]).map((ref) => [ref, images[ref]])
);
const destination = path.join(root, "src/app/learning/hadith/figmaHadithImageManifest.json");
await fs.writeFile(
  destination,
  `${JSON.stringify({ schemaVersion: 1, imageRefs, images: selected }, null, 2)}\n`,
  "utf8"
);
console.log(
  `Resolved ${Object.keys(selected).length}/${imageRefs.length} Hadith Figma image refs to ${destination}`
);
