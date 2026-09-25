import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const rawUnits = JSON.parse(await fs.readFile(path.join(root, "scratch/parsed_units_raw.json"), "utf8"));
const manifest = JSON.parse(await fs.readFile(path.join(root, "src/app/learning/business/businessImageManifest.json"), "utf8"));
let recallData = {};
try {
  recallData = JSON.parse(await fs.readFile(path.join(root, "scratch/business_recall_data.json"), "utf8"));
} catch {}

function normalizeTerm(str) {
  return (str || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Image lookup by unitNumber and slot, and by term
const imageMap = new Map();
const termImageMap = new Map();
for (const img of manifest.images) {
  imageMap.set(`${img.unitNumber}-${img.slot}`, img.imageSrc);
  if (img.term) {
    termImageMap.set(`${img.unitNumber}-${img.term.toLowerCase().trim()}`, img.imageSrc);
    termImageMap.set(`${img.unitNumber}-${normalizeTerm(img.term)}`, img.imageSrc);
  }
}

// Hero lookup by unitNumber
const heroMap = new Map();
for (const hero of manifest.heroes || []) {
  heroMap.set(hero.unitNumber, hero.imageSrc);
}

// Section title mapping
const SECTION_MAP = {
  1: "Workplace Foundations",
  2: "Collaboration & Influence",
  3: "Leadership, Change & Strategy",
  4: "Executive Strategy & Governance",
};

const SECTION_MAP_AR = {
  1: "أسس التواصل في بيئة العمل",
  2: "التعاون والتأثير المهني",
  3: "القيادة، التغيير والاستراتيجية",
  4: "الاستراتيجية التنفيذية والحوكمة",
};

function getSectionNumber(unitNumber) {
  if (unitNumber <= 10) return 1;
  if (unitNumber <= 20) return 2;
  if (unitNumber <= 30) return 3;
  return 4; // 31-40
}

function cleanTitle(title) {
  return title
    .replace(/^Beyond Business English\s*·\s*/i, "")
    .replace(/^unit-\d+-/i, "")
    .replace(/^Unit\s*\d+\s*[:·-]\s*/i, "")
    .replace(/^UNIT\s*\d+\s*[:·-]\s*/i, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, l => l.toUpperCase())
    .trim();
}

function getUnitTags(unitNumber, title) {
  const t = title.toLowerCase();
  const tags = [];
  if (t.includes("meeting") || t.includes("clarifying")) tags.push("#Meetings");
  if (t.includes("negotiat") || t.includes("agreement") || t.includes("pricing")) tags.push("#Negotiation");
  if (t.includes("leader") || t.includes("management") || t.includes("authority")) tags.push("#Leadership");
  if (t.includes("crisis") || t.includes("strategy") || t.includes("uncertainty") || t.includes("boardroom") || t.includes("crossroads")) tags.push("#Crisis & Strategy");
  if (t.includes("sales") || t.includes("pitch") || t.includes("brand") || t.includes("customer")) tags.push("#Sales & Pitching");
  if (t.includes("team") || t.includes("feedback") || t.includes("conflict") || t.includes("hybrid") || t.includes("interview") || t.includes("responsibilit")) tags.push("#Teamwork");
  if (tags.length === 0) {
    if (unitNumber <= 10) tags.push("#Workplace Foundations");
    else if (unitNumber <= 20) tags.push("#Collaboration");
    else if (unitNumber <= 29) tags.push("#Strategic Change");
    else tags.push("#Executive Governance");
  }
  return tags;
}

function parseExercises(rawTexts, unitNumber) {
  const questions = [];
  const keyIdx = rawTexts.findIndex(t => /Answer Key|\[REVEAL\]/i.test(t));
  const qSection = keyIdx >= 0 ? rawTexts.slice(0, keyIdx) : rawTexts;
  const aSection = keyIdx >= 0 ? rawTexts.slice(keyIdx + 1) : [];

  let currentQ = null;
  for (const text of qSection) {
    const qMatch = text.match(/^(?:Question\s*)?(\d+)[:.]\s*(.+)$/i);
    const optMatch = text.match(/^([A-C])\.\s*(.+)$/i);

    if (qMatch && !optMatch) {
      if (currentQ) questions.push(currentQ);
      currentQ = {
        id: `q-${unitNumber}-${qMatch[1]}`,
        question: qMatch[2].trim(),
        options: [],
        correctAnswer: "A",
        explanation: "",
      };
    } else if (optMatch && currentQ) {
      currentQ.options.push({
        key: optMatch[1].toUpperCase(),
        text: optMatch[2].trim(),
      });
    }
  }
  if (currentQ) questions.push(currentQ);

  // Parse answers
  for (let i = 0; i < aSection.length; i++) {
    const text = aSection[i];
    const numMatch = text.match(/^(\d+)\.?$/);
    if (numMatch && i + 1 < aSection.length) {
      const num = Number(numMatch[1]);
      const targetQ = questions.find(q => q.id === `q-${unitNumber}-${num}`);
      const next1 = aSection[i + 1] || "";
      const next2 = aSection[i + 2] || "";
      const next3 = aSection[i + 3] || "";

      if (targetQ) {
        if (/^[A-C]$/.test(next1)) {
          targetQ.correctAnswer = next1;
          targetQ.explanation = next3 ? `${next2} — ${next3}` : next2;
        } else {
          targetQ.explanation = next1;
        }
      }
    }
  }

  // Ensure default options if only open prompts existed
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (q.options.length < 2) {
      q.options = [
        { key: "A", text: q.explanation || "Correct interpretation based on context" },
        { key: "B", text: "Incomplete or inaccurate assumption" },
        { key: "C", text: "Irrelevant alternative" },
      ];
      q.correctAnswer = "A";
    }
  }

  return questions;
}

function parseDialogue(rawTexts) {
  const lines = [];
  for (let i = 0; i < rawTexts.length; i++) {
    const text = rawTexts[i];
    if (/^(Mariam|Daniel|Manager|Sara|Colleague|Elena|David|Speaker\s*[A-Z]|Client|Supplier|Buyer|Operations|Finance|Product|Director|Executive)$/i.test(text.trim())) {
      const nextText = rawTexts[i + 1];
      if (nextText && !nextText.startsWith("3.") && !nextText.includes("Language Bank")) {
        lines.push({
          speaker: text.trim(),
          text: nextText.trim(),
        });
        i++; // skip nextText
      }
    } else if (text.length > 25 && !text.includes("Dismiss") && !text.includes("View changes") && !text.includes("CONTEXT")) {
      // Narrative text
      lines.push({
        speaker: "Narrator",
        text: text.trim(),
      });
    }
  }
  return lines;
}

const compiledUnits = [];

for (const raw of rawUnits) {
  const unitNumber = raw.unitNumber;
  const sectionNumber = getSectionNumber(unitNumber);
  const sectionTitle = SECTION_MAP[sectionNumber];

  // Language Bank with R2 images
  const languageBank = raw.languageBank.map((item, idx) => {
    const slot = idx + 1;
    const termClean = item.term.trim().toLowerCase();
    const termNorm = normalizeTerm(item.term);
    const imageSrc =
      termImageMap.get(`${unitNumber}-${termClean}`) ||
      termImageMap.get(`${unitNumber}-${termNorm}`) ||
      imageMap.get(`${unitNumber}-${slot}`) ||
      "";
    return {
      id: `vocab-${unitNumber}-${slot}`,
      term: item.term.trim(),
      type: item.type || "Vocabulary",
      definition: item.definition.trim(),
      example: item.example.trim(),
      imageSrc,
    };
  });

  // Dialogue
  const dialogueLines = parseDialogue(raw.mainInput.content || []);

  // Exercises
  const exercises = parseExercises(raw.exercises.texts || [], unitNumber);

  // Warmup prompts
  const warmupPrompts = (raw.warmup.prompts || [])
    .filter(p => !p.startsWith("1.") && p.length > 10)
    .map((p, idx) => ({
      id: `warmup-${unitNumber}-${idx + 1}`,
      question: p.replace(/^Question\s*\d+:\s*/i, "").trim(),
      hint: "Reflect on a real or past workplace scenario.",
    }));

  // Discussion prompts
  const discussionPrompts = (raw.discussion.prompts || [])
    .filter(p => !p.startsWith("6.") && p.length > 10 && !p.startsWith("Prompt"))
    .map((p, idx) => ({
      id: `disc-${unitNumber}-${idx + 1}`,
      prompt: p.trim(),
    }));

  // Speaking task checklist
  const speakChecklist = (raw.speakingTask.texts || [])
    .filter(t => t.startsWith("I ") || t.startsWith("•") || t.startsWith("-"))
    .map(t => t.replace(/^[•-]\s*/, "").trim());

  // Speaking task steps
  const speakSteps = (raw.speakingTask.texts || [])
    .filter(t => /^\d+\.\s*/.test(t) || (/^[A-Z]/.test(t) && t.length > 20 && !t.includes("Checklist") && !t.includes("Rule")))
    .slice(0, 5);

  const cleanUnitTitle = cleanTitle(raw.title);

  compiledUnits.push({
    id: `unit-${String(unitNumber).padStart(2, "0")}`,
    unitNumber,
    sectionNumber,
    sectionTitle,
    sectionTitleAr: SECTION_MAP_AR[sectionNumber],
    level: raw.level,
    heroImageSrc: heroMap.get(unitNumber),
    estimatedMinutes: Math.min(20, Math.max(8, Math.round((languageBank.length * 0.4) + (exercises.length * 0.6) + 4))),
    tags: getUnitTags(unitNumber, cleanUnitTitle),
    title: cleanUnitTitle,
    essentialQuestion: raw.essentialQuestion.replace(/\*\*Level:\*\*.*?\*\*Essential Question:\*\*/i, "").replace(/^Essential Question:\s*[“"]?/i, "").replace(/[”"]?$/i, "").trim() || `How do professionals effectively navigate ${cleanUnitTitle.toLowerCase()} in a global enterprise?`,
    speakingGoal: raw.speakingGoal.replace(/^SPEAKING GOAL\s*/i, "").trim(),
    warmup: {
      instructions: raw.warmup.instructions || "Reflect on your prior experiences with this workplace topic.",
      prompts: warmupPrompts,
    },
    mainInput: {
      title: raw.mainInput.title || `Case Scenario: ${cleanUnitTitle}`,
      context: raw.mainInput.context || "",
      dialogue: dialogueLines.length > 0 ? dialogueLines : [
        { speaker: "Narrator", text: raw.mainInput.context || "Case study overview." }
      ],
    },
    languageBank,
    usageFocus: {
      title: raw.usageFocus.title.replace(/^4\.\s*Usage Focus\s*[-—]\s*/i, "").trim(),
      description: raw.usageFocus.description || "",
      details: raw.usageFocus.details || [],
    },
    exercises,
    discussion: {
      title: raw.discussion.title || "Discussion Questions",
      prompts: discussionPrompts,
    },
    speakingTask: {
      title: raw.speakingTask.title.replace(/^7\.\s*Main Speaking Task\s*[-—]\s*/i, "").trim(),
      rule: "Do not memorise a script. Focus on natural interaction, active listening, and clear intent.",
      steps: speakSteps,
      checklist: speakChecklist.length > 0 ? speakChecklist : [
        "I clearly stated my objective and perspective.",
        "I used target vocabulary from the Language Bank.",
        "I applied the Usage Focus framework.",
        "I maintained a professional and collaborative tone.",
      ],
    },
    review: {
      title: raw.review.title || "Review & Recycling",
      recycledPoints: (raw.review.texts || []).filter(t => t.includes("•") || t.includes("-")),
      spacedRepetitionPrompt: "Rate your confidence (Not yet · Almost · Ready). Practice these phrases in your next meeting or email.",
    },
    recall: recallData[`unit-${String(unitNumber).padStart(2, "0")}`] || undefined,
  });
}

console.log(`Compiled ${compiledUnits.length} units.`);
const targetCatalogPath = path.join(root, "src/app/learning/business/businessCatalog.json");
await fs.writeFile(targetCatalogPath, JSON.stringify(compiledUnits, null, 2), "utf8");
console.log(`Saved catalog to ${targetCatalogPath}`);

// Summary stats
console.log("Summary stats:");
console.log(`- Units: ${compiledUnits.length}`);
console.log(`- Total Vocab: ${compiledUnits.reduce((acc, u) => acc + u.languageBank.length, 0)}`);
console.log(`- Total Vocab with R2 imageSrc: ${compiledUnits.reduce((acc, u) => acc + u.languageBank.filter(i => !!i.imageSrc).length, 0)}`);
console.log(`- Total Exercises: ${compiledUnits.reduce((acc, u) => acc + u.exercises.length, 0)}`);
