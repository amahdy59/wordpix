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

const ITEM_ROLE = /^(TEACH|GUIDED|INDEPENDENT|TRANSFER)(?:\s*•\s*(CONTEXT))?$/i;

function collectText(node, output = []) {
  if (node?.type === "TEXT" && node.characters?.trim()) output.push(node.characters.trim());
  for (const child of node?.children ?? []) collectText(child, output);
  return output;
}

function collectLessonImages(node, parent = null, output = [], insideGallery = false) {
  const isInsideGallery = insideGallery || node?.name === "word-image-gallery";
  const imageRef = (node?.fills ?? []).find((fill) => fill?.imageRef)?.imageRef;
  if (imageRef && parent && isInsideGallery) {
    const text = collectText(parent);
    const roleText = text.find((value) => ITEM_ROLE.test(value));
    const roleMatch = roleText?.match(ITEM_ROLE);
    const label = text.find((value) => value !== roleText)?.trim();
    if (label && roleMatch) {
      output.push({
        label,
        role: roleMatch[1].toLowerCase(),
        context: Boolean(roleMatch[2]),
        imageRef,
      });
    }
  }
  for (const child of node?.children ?? []) {
    collectLessonImages(child, node, output, isInsideGallery);
  }
  return output;
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
    const images = collectLessonImages(document);
    lessons.push({
      number: Number(frame.name.match(/lesson-(\d+)/)?.[1]),
      nodeId: frame.id,
      sourceName: frame.name,
      section: frame.section,
      text,
      images,
    });
  }
}

const output = {
  schemaVersion: 2,
  source: { fileKey, pageId, name: page.name },
  imageRefs: [...imageRefs].sort(),
  lessons,
};
const destination = path.join(root, "src/app/learning/foundations/figmaPronunciationContent.json");
const mappedImages = lessons.reduce((total, lesson) => total + lesson.images.length, 0);
const mappedImageRefs = new Set(lessons.flatMap((lesson) => lesson.images.map((image) => image.imageRef)));
const expectedImageUses = lessons.reduce(
  (total, lesson) =>
    total + lesson.text.filter((value) => ITEM_ROLE.test(value)).length,
  0,
);
if (mappedImages !== expectedImageUses) {
  throw new Error(
    `Expected ${expectedImageUses} role-labelled learner images; mapped ${mappedImages}`,
  );
}
await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(
  `Extracted ${lessons.length} lessons, ${mappedImages} learner image uses (${mappedImageRefs.size} unique), and ${imageRefs.size} total image refs to ${destination}`,
);
