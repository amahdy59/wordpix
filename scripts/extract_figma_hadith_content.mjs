import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const env = await fs.readFile(path.join(root, ".env.local"), "utf8");
const token = env.match(/^Figma_token=(.*)$/m)?.[1]?.trim();
if (!token) throw new Error("Figma_token is missing from .env.local");

const fileKey = "gRlyhrMavAHXUAT5brWFWu";
const pageId = "1092:2798";
const headers = { "X-Figma-Token": token };
const stageNames = [
  "overview",
  "warm-up",
  "read-listen",
  "vocabulary",
  "practice",
  "speak",
  "check-review",
];

function collectText(node, output = []) {
  if (node?.type === "TEXT" && node.characters?.trim()) {
    output.push(node.characters.trim());
  }
  for (const child of node?.children ?? []) collectText(child, output);
  return output;
}

function stripNavigation(text) {
  const navigationEnd = text.slice(0, 18).lastIndexOf(">") + 2;
  return navigationEnd > 2 ? text.slice(navigationEnd) : text;
}

function inferStage(frame, text) {
  const heading = text.slice(0, 2).join(" · ");
  const patterns = [
    ["overview", /(?:overview:|stage 1 of 7)/i],
    ["warm-up", /(?:warm-up:|stage 2 of 7)/i],
    ["read-listen", /(?:read & listen|stage 3 of 7|the hadith text)/i],
    ["vocabulary", /(?:vocabulary study|stage 4 of 7|· definitions)/i],
    ["practice", /(?:guided practice|practice:|stage 5 of 7|interactive check)/i],
    ["speak", /(?:speak:|stage 6 of 7|speaking activity|respectful dialogue)/i],
    ["check-review", /(?:check & review:|stage 7 of 7|lesson completed)/i],
  ];
  return patterns.find(([, pattern]) => pattern.test(heading))?.[0]
    ?? stageNames[Number(frame.name?.match(/^(\d+)/)?.[1] ?? 0) - 1];
}

function arabicCharacterCount(value) {
  return [...value].filter((character) => /[\u0600-\u06ff]/u.test(character)).length;
}

function latinWordCount(value) {
  return value.match(/[A-Za-z]+/g)?.length ?? 0;
}

function extractCanonicalSource(readText, lessonNumber) {
  const arabic = [...readText]
    .filter((value) => arabicCharacterCount(value) >= 12)
    .sort((a, b) => arabicCharacterCount(b) - arabicCharacterCount(a))[0];
  const translation = [...readText]
    .filter(
      (value) =>
        value !== arabic &&
        latinWordCount(value) >= 18 &&
        !/^(source|contextual|learner flow|audio controls)/i.test(value),
    )
    .sort((a, b) => latinWordCount(b) - latinWordCount(a))[0];
  const citation = readText.find(
    (value) =>
      value !== translation &&
      /(?:source:|sunnah\.com\/|nawawi(?:'s)? forty|reported by|sahih (?:al-)?bukhari|sahih muslim|jami.{0,3}at-tirmidhi)/i.test(
        value,
      ),
  );

  if (!arabic || !translation) {
    throw new Error(`Could not identify the canonical text for Hadith ${lessonNumber}`);
  }

  return {
    arabic,
    translation,
    citation: citation ?? `Nawawi's Forty Hadith · Hadith ${lessonNumber}`,
  };
}

const response = await fetch(
  `https://api.figma.com/v1/files/${fileKey}/nodes?ids=${encodeURIComponent(pageId)}`,
  { headers },
);
if (!response.ok) throw new Error(`Figma page request failed: ${response.status}`);
const payload = await response.json();
const page = payload.nodes?.[pageId]?.document;
if (!page) throw new Error(`Figma page ${pageId} was not found`);

const sections = (page.children ?? [])
  .map((section) => {
    const match = section.name?.match(/^Hadith (\d+) · (.+)$/);
    return match
      ? { section, number: Number(match[1]), title: match[2].trim() }
      : null;
  })
  .filter(Boolean)
  .sort((a, b) => a.number - b.number);

if (sections.length !== 42) {
  throw new Error(`Expected 42 Hadith sections, found ${sections.length}`);
}

const lessons = sections.map(({ section, number, title }) => {
  const frames = [...(section.children ?? [])];
  if (frames.length !== 7) {
    throw new Error(`Expected seven stages for Hadith ${number}, found ${frames.length}`);
  }

  const stages = Object.fromEntries(
    frames.map((frame) => {
      const text = collectText(frame);
      const declaredStage = stageNames[Number(frame.name?.match(/^(\d+)/)?.[1] ?? 0) - 1];
      return [
        number === 18 ? inferStage(frame, text) : declaredStage,
        {
          nodeId: frame.id,
          sourceName: frame.name,
          text: stripNavigation(text),
        },
      ];
    }),
  );
  for (const stageName of stageNames) {
    if (!stages[stageName]) {
      throw new Error(`Hadith ${number} is missing the ${stageName} stage`);
    }
  }
  const source = extractCanonicalSource(stages["read-listen"].text, number);
  stages["read-listen"].text = stages["read-listen"].text.filter(
    (value) => value !== source.arabic && value !== source.translation && value !== source.citation,
  );

  return {
    id: `hadith-${String(number).padStart(2, "0")}`,
    number,
    title,
    nodeId: section.id,
    source,
    stages,
  };
});

const output = {
  schemaVersion: 1,
  source: { fileKey, pageId, name: page.name },
  lessons,
};
const destination = path.join(
  root,
  "src/app/learning/hadith/figmaHadithContent.json",
);
await fs.writeFile(destination, `${JSON.stringify(output, null, 2)}\n`, "utf8");
console.log(
  `Extracted ${lessons.length} Hadith lessons and ${lessons.length * 7} stages to ${destination}`,
);
