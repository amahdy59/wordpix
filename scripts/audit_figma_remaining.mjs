import fs from 'node:fs';
import readline from 'node:readline';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();

const token = process.env.FIGMA_TOKEN || process.env.Figma_token || process.env.Figma_token_download;
const FILE_KEY = "BVURolbmrORDIa286I9m8q";
const NODE_ID = "9:2";

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

async function main() {
  console.log("Loading question-sentence-image-inventory.csv...");
  const rl = readline.createInterface({
    input: fs.createReadStream("docs/question-sentence-image-inventory.csv"),
    crlfDelay: Infinity
  });

  const inventoryBySentence = new Map();
  const inventoryByUnitWord = new Map();
  let rowCount = 0;
  for await (const line of rl) {
    rowCount++;
    if (rowCount === 1) continue;
    const match = line.match(/^"([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]+)","([^"]*)"/);
    if (match) {
      const [, questionId, unitId, lessonId, wordId, word, stage, sentence, generationPrompt] = match;
      const item = { questionId, unitId, lessonId, wordId, word, stage, sentence, generationPrompt };
      const norm = sentence.trim().toLowerCase();
      if (!inventoryBySentence.has(norm)) inventoryBySentence.set(norm, []);
      inventoryBySentence.get(norm).push(item);

      const uwKey = `${unitId}:::${wordId}`;
      if (!inventoryByUnitWord.has(uwKey)) inventoryByUnitWord.set(uwKey, []);
      inventoryByUnitWord.get(uwKey).push(item);
    }
  }

  // Load curriculum sequence to know valid units
  const { CURRICULUM_SEQUENCE } = require('../src/app/data/curriculumSequence.ts');
  const validUnits = new Set(CURRICULUM_SEQUENCE);

  console.log("Fetching Figma node 9:2...");
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${NODE_ID}`, {
    headers: { "X-Figma-Token": token }
  });
  const data = await res.json();
  const page = data.nodes[NODE_ID]?.document;

  const cards = [];
  function findCards(node, currentContext = {}) {
    if (node.type === "SECTION") {
      if (!currentContext.section) currentContext = { ...currentContext, section: node.name };
      else currentContext = { ...currentContext, subsection: node.name };
    }
    if (node.type === "FRAME" && node.name.includes("—")) {
      currentContext = { ...currentContext, frame: node.name };
    }

    if (node.children && node.children.length >= 2) {
      const imgChild = node.children.find(c => c.fills?.some(f => f.type === "IMAGE" && f.imageRef));
      const textChild = node.children.find(c => c.children?.some(sc => sc.type === "TEXT") || c.type === "TEXT");
      if (imgChild && textChild) {
        const fill = imgChild.fills.find(f => f.type === "IMAGE" && f.imageRef);
        const textNodes = [];
        function getTexts(n) {
          if (n.type === "TEXT" && n.characters) textNodes.push(n.characters.trim());
          if (n.children) n.children.forEach(getTexts);
        }
        getTexts(textChild);

        if (fill && textNodes.length >= 2) {
          cards.push({
            ...currentContext,
            nodeId: node.id,
            imageRef: fill.imageRef,
            word: textNodes[0],
            sentence: textNodes[1],
            jobText: textNodes[2] || ""
          });
          return;
        }
      }
    }
    if (node.children) {
      for (const child of node.children) findCards(child, currentContext);
    }
  }
  findCards(page);

  console.log(`Extracted ${cards.length} cards.`);

  let exactMatchCount = 0;
  let unitWordMatchCount = 0;
  let fallbackCount = 0;

  for (const card of cards) {
    const norm = card.sentence.trim().toLowerCase();
    const inv = inventoryBySentence.get(norm);
    if (inv && inv.length > 0) {
      exactMatchCount++;
      continue;
    }

    // Try subsection slug as unit
    const subClean = (card.subsection || "").replace(/·.*$/, "").trim();
    const unitSlug = slugify(subClean);
    const wordSlug = slugify(card.word);
    const uwKey = `${unitSlug}:::${wordSlug}`;
    const uwInv = inventoryByUnitWord.get(uwKey);
    if (uwInv && uwInv.length > 0) {
      unitWordMatchCount++;
      continue;
    }

    fallbackCount++;
  }

  console.log(`Matching Results:`);
  console.log(`- Exact sentence matches: ${exactMatchCount}`);
  console.log(`- Unit + Word matches: ${unitWordMatchCount}`);
  console.log(`- Total resolved with inventory: ${exactMatchCount + unitWordMatchCount} (${Math.round((exactMatchCount + unitWordMatchCount)/cards.length*100)}%)`);
  console.log(`- Fallbacks (resolved via card context): ${fallbackCount}`);
}

main().catch(console.error);
