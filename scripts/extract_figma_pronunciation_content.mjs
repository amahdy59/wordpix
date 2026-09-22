import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const env = await fs.readFile(path.join(root, ".env.local"), "utf8");
const token = env.match(/^Figma_token=(.*)$/m)?.[1]?.trim();
if (!token) throw new Error("Figma_token is missing from .env.local");

const fileKey = "gRlyhrMavAHXUAT5brWFWu";
const pageId = "1126:3665";
const headers = { "X-Figma-Token": token };

const pageResponse = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(pageId)}`,
  { headers },
);
if (!pageResponse.ok) throw new Error(`Figma page request failed: ${pageResponse.status}`);
const pagePayload = await pageResponse.json();
const page = pagePayload.nodes?.[pageId]?.document;
const frames = [];
for (const section of page?.children ?? []) {
  for (const frame of section.children ?? []) {
    if (/^lesson-\d+-/.test(frame.name ?? "")) {
      frames.push({ id: frame.id, name: frame.name, section: section.name });
    }
  }
}
frames.sort((a, b) => Number(a.name.match(/lesson-(\d+)/)?.[1]) - Number(b.name.match(/lesson-(\d+)/)?.[1]));
if (frames.length !== 68) throw new Error(`Expected 68 lesson frames, found ${frames.length}`);

const textNodes = [];
const imageRefs = new Set();
function walk(node, output) {
  if (node.type === "TEXT" && node.characters?.trim()) output.push(node.characters.trim());
  for (const fill of node.fills ?? []) if (fill.imageRef) imageRefs.add(fill.imageRef);
  for (const child of node.children ?? []) walk(child, output);
}

const lessons = [];
for (let offset = 0; offset < frames.length; offset += 20) {
  const batch = frames.slice(offset, offset + 20);
  const ids = batch.map((frame) => frame.id).join(",");
  const response = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`,
    { headers },
  );
  if (!response.ok) throw new Error(`Figma lesson request failed for batch ${offset}: ${response.status}`);
  const payload = await response.json();
  for (const frame of batch) {
    const document = payload.nodes?.[frame.id]?.document;
    const text = [];
    walk(document, text);
    lessons.push({
      number: Number(frame.name.match(/lesson-(\d+)/)?.[1]),
      nodeId: frame.id,
      sourceName: frame.name,
      section: frame.section,
      text,
    });
  }
}

const output = {
  schemaVersion: 1,
  source: { fileKey, pageId, name: page.name },
  imageRefs: [...imageRefs].sort(),
  lessons,
};
const destination = path.join(root, "src/app/learning/foundations/figmaPronunciationContent.json");
await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(`Extracted ${lessons.length} lessons and ${imageRefs.size} image refs to ${destination}`);
