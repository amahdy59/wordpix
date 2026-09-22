import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const env = await fs.readFile(path.join(root, ".env.local"), "utf8");
const token = env.match(/^Figma_token=(.*)$/m)?.[1]?.trim();
if (!token) throw new Error("Figma_token is missing from .env.local");

const fileKey = "gRlyhrMavAHXUAT5brWFWu";
const pageId = "1126:3665";
const response = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(pageId)}`,
  { headers: { "X-Figma-Token": token } },
);
if (!response.ok) throw new Error(`Figma request failed: ${response.status}`);
const payload = await response.json();
const document = payload.nodes?.[pageId]?.document;
if (!document) throw new Error("Pronunciation curriculum page was not returned");

const lessons = [];
for (const section of document.children ?? []) {
  for (const frame of section.children ?? []) {
    const match = /^lesson-(\d+)-/.exec(frame.name ?? "");
    if (!match) continue;
    lessons.push({
      number: Number(match[1]),
      nodeId: frame.id,
      sourceName: frame.name,
      section: section.name,
    });
  }
}
lessons.sort((a, b) => a.number - b.number);
if (lessons.length !== 68) {
  throw new Error(`Expected 68 lessons, found ${lessons.length}`);
}

const output = {
  schemaVersion: 1,
  source: { fileKey, pageId, name: document.name },
  lessons,
};
const destination = path.join(root, "src/app/learning/foundations/figmaPronunciationManifest.json");
await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Extracted ${lessons.length} lessons to ${destination}`);
