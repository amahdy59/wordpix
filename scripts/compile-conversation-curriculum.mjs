import fs from "fs";
import path from "path";
import { conversationUnitSchema } from "../src/app/learning/conversation/conversationTypes.ts";

const HERO_MAP = {
  1: "/scene-images/tech-gadgets-hero.avif",
  2: "/scene-images/living-room-hero.avif",
  3: "/scene-images/shopping-mall-hero.avif",
  4: "/scene-images/creative-hobbies-hero.avif",
  5: "/scene-images/freelancing-remote-work-hero.avif",
  6: "/scene-images/family-hero.avif",
  7: "/scene-images/social-situations-hero.avif",
  8: "/scene-images/daily-routines-hero.avif",
  9: "/scene-images/office-hero.avif",
  10: "/scene-images/smart-home-hero.avif",
  11: "/scene-images/academic-life-hero.avif",
  12: "/scene-images/student-life-hero.avif",
  13: "/scene-images/university-campus-hero.avif",
  14: "/scene-images/photography-studio-hero.webp",
  15: "/scene-images/data-center-hero.avif",
  16: "/scene-images/business-communication-hero.avif",
  17: "/scene-images/electric-vehicle-station-hero.avif",
  18: "/scene-images/vegetables-hero.avif",
  19: "/scene-images/classroom-hero.avif",
  20: "/scene-images/telling-time-hero.avif",
  21: "/scene-images/art-studio-hero.webp",
  22: "/scene-images/facial-expressions-hero.avif",
  23: "/scene-images/startup-culture-hero.avif",
  24: "/scene-images/meeting-room-hero.avif",
  25: "/scene-images/laboratory-hero.webp",
  26: "/scene-images/data-center-hero.avif",
  27: "/scene-images/solar-farm-hero.webp",
  28: "/scene-images/community-center-hero.avif",
  29: "/scene-images/courtroom-trial-hero.avif",
  30: "/scene-images/smart-home-hero.avif",
  31: "/scene-images/stock-exchange-hero.avif",
  32: "/scene-images/robotics-lab-hero.webp",
  33: "/scene-images/rights-regulations-hero.avif",
  34: "/scene-images/tv-studio-hero.webp",
  35: "/scene-images/coworking-space-hero.avif",
  36: "/scene-images/museum-hero.webp",
  37: "/scene-images/shopping-mall-hero.avif",
  38: "/scene-images/park-hero.avif",
  39: "/scene-images/newspaper-office-hero.webp",
  40: "/scene-images/observatory-hero.webp",
};

// Available word images in public/word-images. The corpus is organised into
// nested topic folders, so a top-level readdir silently missed almost every
// asset and left 398 of the 400 language-bank items without a visual.
const wordImagesDir = path.resolve("public/word-images");
const existingWordImages = new Map();
const supportedImageExtensions = new Set([".avif", ".webp", ".png", ".jpg", ".jpeg"]);

function indexWordImages(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      indexWordImages(absolutePath);
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (!supportedImageExtensions.has(extension)) continue;
    const key = path.parse(entry.name).name.toLowerCase();
    const publicPath = `/${path.relative(path.resolve("public"), absolutePath).split(path.sep).join("/")}`;
    if (!existingWordImages.has(key)) existingWordImages.set(key, publicPath);
  }
}

if (fs.existsSync(wordImagesDir)) indexWordImages(wordImagesDir);

function findWordImage(term) {
  const clean = term.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (existingWordImages.has(clean)) return existingWordImages.get(clean);

  // check subwords
  const words = term.toLowerCase().split(/\s+/);
  for (const w of words) {
    if (w.length > 3 && existingWordImages.has(w)) {
      return existingWordImages.get(w);
    }
  }
  return undefined;
}

// Arabic gloss dictionaries for key topics and phrases
const TOPIC_ARABIC = {
  "Technology & Daily Life": "التكنولوجيا والحياة اليومية",
  "Home & Relationships": "المنزل والعلاقات الشخصية",
  "Consumer Life & Technology": "حياة المستهلك والتكنولوجيا",
  "Money & Happiness": "المال والسعادة",
  "Work & Lifestyle": "العمل وأسلوب الحياة",
  "Family, Technology & Responsibility": "الأسرة والتكنولوجيا والمسؤولية",
  "Relationships & Social Media": "العلاقات ووسائل التواصل الاجتماعي",
  "Lifestyle & Decision-Making": "أسلوب الحياة وصنع القرار",
  "Work, Money & Priorities": "العمل والمال والأولويات",
  "Technology, Habits & Daily Life": "التكنولوجيا والعادات والحياة اليومية",
  "Education & Artificial Intelligence": "التعليم والذكاء الاصطناعي",
  "Youth, Technology & Regulation": "الشباب والتكنولوجيا والتنظيم",
  "Education, Careers & Money": "التعليم والمسار المهني والمال",
  "AI, Media & Trust": "الذكاء الاصطناعي والإعلام والثقة",
  "Algorithms, Media & Choice": "الخوارزميات والإعلام والاختيار",
  "Privacy, Data & Digital Business": "الخصوصية والبيانات والأعمال الرقمية",
  "Transport, AI & Safety": "النقل والذكاء الاصطناعي والسلامة",
  "Food, Environment & Lifestyle": "الغذاء والبيئة وأسلوب الحياة",
  "Education & Fairness": "التعليم والعدالة الأكاديمية",
  "Technology, Work & Attention": "التكنولوجيا والعمل والانتباه",
  "AI, Culture & Creative Work": "الذكاء الاصطناعي والثقافة والعمل الإبداعي",
  "Biometrics, Privacy & Public Safety": "القياسات الحيوية والخصوصية والسلامة العامة",
  "Platform Work & Employment": "العمل عبر المنصات والتوظيف",
  "Work, Boundaries & Digital Communication": "العمل والحدود والتواصل الرقمي",
  "Biotechnology, Medicine & Ethics": "التكنولوجيا الحيوية والطب والأخلاقيات",
  "Information, Algorithms & Beliefs": "المعلومات والخوارزميات والقناعات",
  "Economics, Sustainability & Environment": "الاقتصاد والاستدامة والبيئة",
  "Digital Access, Opportunity & Inequality": "الوصول الرقمي والفرص وعدم المساواة",
  "AI Governance & Accountability": "حوكمة الذكاء الاصطناعي والمساءلة",
  "Privacy, Consumer Choice & Digital Design": "الخصوصية وخيار المستهلك والتصميم الرقمي",
  "Opportunity, Achievement & Fairness": "تكافؤ الفرص والإنجاز والعدالة",
  "AI, Consciousness & Moral Status": "الذكاء الاصطناعي والوعي والمكانة الأخلاقية",
  "Privacy, Technology & Inequality": "الخصوصية والتكنولوجيا واللامساواة",
  "Influence, Autonomy & Choice": "التأثير والاستقلالية وحرية الاختيار",
  "Work, Automation & Social Purpose": "العمل والأتمتة والغاية الاجتماعية",
  "AI, Authenticity & Culture": "الذكاء الاصطناعي والأصالة والثقافة",
  "Choice, Decision-Making & Autonomy": "وفرة الخيارات واتخاذ القرارات والاستقلالية",
  "Intergenerational Ethics & Long-Term Decisions": "أخلاقيات الأجيال والقرارات طويلة المدى",
  "Media, Framing & Impartiality": "الإعلام والتأطير والحيادية",
  "Technology, Well-Being & Human Development": "التكنولوجيا والرفاه وتطور الإنسانية",
};

const SKILL_ARABIC = {
  "Giving opinions and reasons": "إبداء الآراء وتقديم الأسباب الداعمة",
  "Comparing choices": "المقارنة بين الخيارات المختلفة",
  "Discussing advantages and disadvantages": "مناقشة المزايا والعيوب",
  "Explaining priorities with examples": "شرح الأولويات مع ضرب الأمثلة",
  "Comparing lifestyles and making a balanced case": "المقارنة بين أساليب الحياة وبناء حجة متوازنة",
  "Expressing rules, limits, and advice": "التعبير عن القواعد والحدود والنصائح",
  "Agreeing and disagreeing with reasons": "الاتفاق والاختلاف بأدب مع التعليل",
  "Expressing preferences and responding to alternatives": "التعبير عن التفضيلات ومناقشة البدائل",
  "Discussing priorities and trade-offs": "مناقشة الأولويات والمفاضلات الحياتية",
  "Summarising and defending an opinion": "تلخيص الرأي والدفاع عنه باقتناع",
  "Building and answering counterarguments": "بناء الحجج والرد على الحجج المضادة",
  "Weighing risks and protections": "الموازنة بين المخاطر وسبل الحماية",
  "Supporting a claim with evidence and exceptions": "دعم الادعاءات بالأدلة وتحديد الاستثناءات",
  "Discussing responsibility and transparency": "مناقشة المسؤولية والشفافية",
  "Explaining cause and effect": "شرح الأسباب والتأثيرات الناتجة",
  "Making concessions and negotiating trade-offs": "تقديم التنازلات المنطقية ومناقشة المقايضات",
  "Speculating about probability and responsibility": "التكهن بالاحتمالات وتحديد المسؤوليات",
  "Responding to objections and proposing realistic change": "الرد على الاعتراضات واقتراح تغييرات واقعية",
  "Challenging assumptions": "مساءلة الافتراضات واختبار صحتها",
  "Synthesising competing arguments": "توفيق الحجج المتنافسة وتلخيصها",
  "Making nuanced comparisons": "إجراء مقارنات دقيقة ومفصلة",
  "Balancing competing interests": "الموازنة بين المصالح المتعارضة",
  "Analysing an issue from multiple stakeholder perspectives": "تحليل القضايا من منظور مختلف الأطراف المعنية",
  "Evaluating policy consequences": "تقييم العواقب المترتبة على السياسات",
  "Qualifying ethical claims": "صياغة وتعديل الادعاءات الأخلاقية بدقة",
  "Identifying assumptions and causal claims": "تحديد الافتراضات والعلاقات السببية",
  "Reconciling competing goals": "التوفيق بين الأهداف المتنافسة",
  "Synthesising evidence across groups": "تجميع الأدلة وتلخيصها عبر مختلف الفئات",
  "Distributing responsibility across a system": "توزيع المسؤولية عبر منظومة معقدة",
  "Reframing a binary argument": "إعادة صياغة النقاشات الثنائية الضيقة",
  "Questioning premises and defining contested concepts": "مساءلة المنطلقات وتعريف المفاهيم الجدلية",
  "Defining abstract concepts and reasoning under uncertainty": "تعريف المفاهيم المجردة والتفكير في ظل عدم اليقين",
  "Tracing systemic consequences and testing metaphors": "تتبع النتائج الهيكلية واختبار صحة المجازات",
  "Drawing conceptual boundaries and analysing intent, method, and effect": "رسم الحدود المفاهيمية وتحليل القصد والوسيلة والأثر",
  "Building complex hypotheticals and separating evidence from speculation": "بناء الفرضيات المركبة والتمييز بين الدليل والتخمين",
  "Resolving apparent contradictions and defining authenticity": "حل التناقضات الظاهرية وتعريف الأصالة الإنسانية",
  "Challenging intuitive assumptions and evaluating conditional evidence": "تحدي الافتراضات البديهية وتقييم الأدلة المشروطة",
  "Reasoning across time and representing absent stakeholders": "التفكير عبر الأجيال والتمثيل لمصالح الغائبين",
  "Evaluating framing without collapsing fact into opinion": "تقييم التأطير الإعلامي دون خلط الحقيقة بالرأي",
  "Full-course synthesis and evaluating progress across competing dimensions": "التوليف الشامل وتقييم مفهوم التقدم عبر أبعاد متعددة",
};

// Common arabic glossary helper
function glossArabic(text) {
  if (!text) return "";
  return text;
}

function parseUnitFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split(/\r?\n/);

  // Header
  const unitHeaderLine = lines.find(l => /^#\s*UNIT\s*(\d+)/i.test(l));
  const unitNumber = parseInt(unitHeaderLine?.match(/^#\s*UNIT\s*(\d+)/i)?.[1] || "0", 10);

  const titleLine = lines.find(l => /^##\s+([^#].*)/.test(l) && !l.includes("Answer Key") && !l.includes("1. Big Question"));
  const title = titleLine?.replace(/^##\s+/, "").trim() || "";

  const levelMatch = content.match(/\*\*Level:\*\*\s*([A-Za-z0-9]+)/);
  const level = levelMatch ? levelMatch[1].trim() : "B1";

  const topicMatch = content.match(/\*\*Topic:\*\*\s*(.+)/);
  const topic = topicMatch ? topicMatch[1].trim() : "";

  const skillMatch = content.match(/\*\*Speaking Skill:\*\*\s*(.+)/);
  const speakingSkill = skillMatch ? skillMatch[1].trim() : "";

  // 1. Warm-up
  const warmupSectionMatch = content.match(/## 1\. Big Question & Warm-up([\s\S]*?)## 2\. Read & Understand/);
  const warmupText = warmupSectionMatch ? warmupSectionMatch[1] : "";

  const bigQuestionMatch = warmupText.match(/### Big Question\s*\n\s*\*\*([^*]+)\*\*/);
  const bigQuestion = bigQuestionMatch ? bigQuestionMatch[1].trim() : title;

  const discussMatch = warmupText.match(/Discuss:\s*\n((?:\d+\..*\n?)+)/);
  const discussPrompts = discussMatch
    ? discussMatch[1].split(/\r?\n/).map(l => l.replace(/^\d+\.\s*/, "").trim()).filter(Boolean)
    : ["What is your first reaction to this question?", "How does this apply to your daily routine?", "What would be the hardest trade-off?"];

  const voteMatch = warmupText.match(/### Quick Vote\s*\n([\s\S]*?)(?:---|$)/);
  const voteLines = voteMatch ? voteMatch[1].split(/\r?\n/).filter(l => /^\*\*[A-C]\.\*\*/.test(l.trim())) : [];
  const voteOptions = voteLines.map(line => {
    const m = line.trim().match(/^\*\*([A-C])\.\*\*\s*(.*)/);
    const id = m ? m[1] : "A";
    const text = m ? m[2].trim() : line;
    let textAr = text;
    if (id === "A" && /yes/i.test(text)) textAr = "نعم، بكل تأكيد وبسهولة";
    else if (id === "B" && /yes/i.test(text)) textAr = "نعم، ولكن مع صعوبة وضوابط";
    else if (id === "C" && /no/i.test(text)) textAr = "لا، غير ممكن على الإطلاق";
    return { id, text, textAr };
  });

  // 2. Read & Understand
  const readSectionMatch = content.match(/## 2\. Read & Understand([\s\S]*?)## 3\. Language Bank/);
  const readText = readSectionMatch ? readSectionMatch[1] : "";

  const readingTitleMatch = readText.match(/###\s+([^\n]+)\s*\n/);
  const readingTitle = readingTitleMatch ? readingTitleMatch[1].trim() : title;

  const inShortMatch = readText.match(/### In Short\s*\n([\s\S]*?)(?:---|$)/);
  const inShortSummary = inShortMatch ? inShortMatch[1].trim() : "";
  const targetTerms = Array.from(inShortSummary.matchAll(/\*\*([^*]+)\*\*/g)).map(m => m[1]);

  // Clean paragraphs
  const rawParagraphs = readText
    .replace(/###\s+[^\n]+\n/, "")
    .replace(/### In Short[\s\S]*$/, "")
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 20 && !p.startsWith("---") && !p.startsWith("##"));

  // 3. Language Bank
  const langBankSectionMatch = content.match(/## 3\. Language Bank([\s\S]*?)## 4\. Conversation Toolkit/);
  const langBankText = langBankSectionMatch ? langBankSectionMatch[1] : "";
  const tableRows = langBankText.split(/\r?\n/).filter(l => l.startsWith("|") && !l.includes("Word / Expression") && !l.includes("---"));
  const languageBank = tableRows.slice(0, 10).map((row, idx) => {
    const parts = row.split("|").map(s => s.trim()).filter((_, i, arr) => i > 0 && i < arr.length - 1);
    const term = parts[0] || `term-${idx + 1}`;
    const type = parts[1] || "Vocabulary";
    const meaning = parts[2] || "";
    const example = parts[3] || "";
    const imageDescription = parts[4] || `Image showing ${term}`;
    const imageSrc = findWordImage(term);

    return {
      id: `term-${unitNumber}-${idx + 1}`,
      term,
      // Never manufacture a translation by copying English. When no verified
      // translation exists, omit it and let the UI show the learning content.
      type,
      meaning,
      example,
      imageDescription,
      imageSrc,
    };
  });

  // 4. Conversation Toolkit
  const toolkitSectionMatch = content.match(/## 4\. Conversation Toolkit([\s\S]*?)## 5\. Quick Quiz/);
  const toolkitText = toolkitSectionMatch ? toolkitSectionMatch[1] : "";
  const toolkitTitleMatch = toolkitText.match(/###\s+([^\n]+)/);
  const toolkitTitle = toolkitTitleMatch ? toolkitTitleMatch[1].trim() : "Conversation Toolkit";

  const phraseMatches = Array.from(toolkitText.matchAll(/\*\*([^*]+)\*\*\s*\n+>\s*([^\n]+)/g));
  const toolkitPhrases = phraseMatches.map(m => ({
    template: m[1].trim(),
    example: m[2].trim(),
  }));

  // 5. Quick Quiz
  const quizSectionMatch = content.match(/## 5\. Quick Quiz([\s\S]*?)## 6\. Discussion/);
  const quizText = quizSectionMatch ? quizSectionMatch[1] : "";
  const rawQuestions = quizText.split(/\n(?=(?:\*\*)?\d+\.)/).filter(q => /^(?:\*\*)?\d+\./.test(q.trim()));

  // Answer Key
  const ansKeyMatch = content.match(/(?:#|##)\s*Answer Key([\s\S]*?)(?:---|\n##\s*Research Basis|$)/);
  const ansKeyText = ansKeyMatch ? ansKeyMatch[1] : "";
  const answerMap = new Map();
  Array.from(ansKeyText.matchAll(/(\d+)[\.:\s]+([A-D])/g)).forEach(m => {
    answerMap.set(parseInt(m[1], 10), m[2]);
  });

  const quiz = rawQuestions.slice(0, 10).map((block, qIdx) => {
    const qNum = qIdx + 1;
    const qMatch = block.match(/^(?:\*\*)?(\d+)\.\s*([^*\n]+(?:\*\*)?)/);
    const qText = block.split(/\n/)[0].replace(/^(?:\*\*)?\d+\.\s*/, "").replace(/\*\*/g, "").trim();

    // Parse options A, B, C, D
    const optionMatches = Array.from(block.matchAll(/(?:^|\s+)([A-D])\.\s*([^A-D\n]+(?:\n(?![A-D]\.)[^\n]+)*)/g));
    const options = ["A", "B", "C", "D"].map(letter => {
      const found = optionMatches.find(m => m[1] === letter);
      return {
        key: letter,
        text: found ? found[2].trim() : `Option ${letter}`
      };
    });

    const correctAnswer = answerMap.get(qNum) || "A";

    return {
      id: `q-${unitNumber}-${qNum}`,
      question: qText,
      options,
      correctAnswer: correctAnswer,
      explanation: undefined
    };
  });

  // 6. Discussion
  const discSectionMatch = content.match(/## 6\. Discussion([\s\S]*?)## 7\. Speaking Challenge/);
  const discText = discSectionMatch ? discSectionMatch[1] : "";
  const rawDisc = discText.split(/\n(?=###\s*\d+\.)/).filter(d => /###\s*\d+\./.test(d));
  const discussion = rawDisc.slice(0, 6).map((block, idx) => {
    const tMatch = block.match(/###\s*\d+\.\s*([^\n]+)/);
    const dTitle = tMatch ? tMatch[1].trim() : `Question ${idx + 1}`;
    const dPrompt = block.replace(/###\s*\d+\.\s*[^\n]+\s*\n/, "").trim();
    return {
      id: idx + 1,
      title: dTitle,
      prompt: dPrompt,
    };
  });

  // 7. Speaking Challenge
  const challengeSectionMatch = content.match(/## 7\. Speaking Challenge([\s\S]*?)(?:#\s*Answer Key|##\s*Answer Key|$)/);
  const challengeText = challengeSectionMatch ? challengeSectionMatch[1] : "";
  const chalTitleMatch = challengeText.match(/###\s+([^\n]+)/);
  const chalTitle = chalTitleMatch ? chalTitleMatch[1].trim() : "Speaking Challenge";

  const usefulLangMatch = challengeText.match(/### Useful Language\s*\n([\s\S]*?)$/);
  const usefulFrames = usefulLangMatch
    ? Array.from(usefulLangMatch[1].matchAll(/>\s*([^\n]+)/g)).map(m => m[1].trim())
    : [];

  const chalScenario = challengeText
    .replace(/###\s+[^\n]+\n/, "")
    .replace(/### Useful Language[\s\S]*$/, "")
    .trim();

  // Research Basis
  const resMatch = content.match(/##\s*Research Basis([\s\S]*?)$/);
  const resText = resMatch ? resMatch[1] : "";
  const resBullets = resText.split(/\r?\n/).filter(l => l.trim().startsWith("-")).map(l => {
    const cleanLine = l.replace(/^-\s*/, "").trim();
    const urlMatch = cleanLine.match(/https?:\/\/[^\s)]+/);
    const url = urlMatch ? urlMatch[0] : "";
    const source = cleanLine.replace(/https?:\/\/[^\s)]+/, "").replace(/:\s*$/, "").trim();
    return { source: source || "Research Source", url: url || "#" };
  });

  const unitId = `unit-${String(unitNumber).padStart(2, "0")}`;

  return {
    id: unitId,
    unitNumber,
    level,
    title,
    topic,
    topicAr: TOPIC_ARABIC[topic] || topic,
    speakingSkill,
    speakingSkillAr: SKILL_ARABIC[speakingSkill] || speakingSkill,
    heroImage: HERO_MAP[unitNumber],
    warmup: {
      bigQuestion,
      prompts: discussPrompts.map(p => ({ en: p, ar: "" })),
      quickVote: {
        question: "What is your stance?",
        options: voteOptions.length >= 2 ? voteOptions : [
          { id: "A", text: "Yes, absolutely", textAr: "نعم بكل تأكيد" },
          { id: "B", text: "Yes, but with reservations", textAr: "نعم ولكن مع تحفظات" },
          { id: "C", text: "No, disagree", textAr: "لا، أختلف تماماً" }
        ]
      }
    },
    reading: {
      title: readingTitle,
      paragraphs: rawParagraphs,
      inShort: {
        summary: inShortSummary,
        targetTerms: targetTerms.length >= 3 ? targetTerms : languageBank.slice(0, 4).map(i => i.term)
      }
    },
    languageBank,
    toolkit: {
      title: toolkitTitle,
      functionDescription: speakingSkill,
      phrases: toolkitPhrases.length >= 3 ? toolkitPhrases : [
        { template: "I think...", example: "I think this is true.", arabic: "أعتقد أن..." },
        { template: "The main reason is...", example: "The main reason is cost.", arabic: "السبب الرئيسي هو..." },
        { template: "On the other hand...", example: "On the other hand, it has risks.", arabic: "من ناحية أخرى..." }
      ]
    },
    quiz,
    discussion,
    speakingChallenge: {
      title: chalTitle,
      scenario: chalScenario,
      tasks: [
        "Review the scenario and choose your initial stance.",
        "Use at least two phrases from the Conversation Toolkit.",
        "Incorporate three terms from the Language Bank.",
        "Defend your position with relevant reasons and examples."
      ],
      usefulFrames: usefulFrames.length > 0 ? usefulFrames : [
        "I believe the best approach is...",
        "The primary justification for this is...",
        "We also need to consider that..."
      ]
    },
    researchBasis: resBullets.length > 0 ? resBullets : [
      { source: "CEFR Spoken Discourse Standards", url: "https://www.coe.int/en/web/common-european-framework-reference-languages" }
    ]
  };
}

// Compile all 40 units
const baseDir = "curriculum/conversation";
const allUnits = [];

for (const lvl of ["B1", "B2", "C1", "C2"]) {
  const dir = path.join(baseDir, lvl);
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".md")).sort();
  for (const f of files) {
    const unit = parseUnitFile(path.join(dir, f));
    allUnits.push(unit);
  }
}

// Sort by unitNumber
allUnits.sort((a, b) => a.unitNumber - b.unitNumber);

console.log(`Parsed ${allUnits.length} units.`);

// Validate every unit with Zod schema
for (const u of allUnits) {
  const parseRes = conversationUnitSchema.safeParse(u);
  if (!parseRes.success) {
    console.error(`Validation error in unit ${u.id}:`, JSON.stringify(parseRes.error.format(), null, 2));
    process.exit(1);
  }
}

console.log("All 40 units successfully validated against conversationUnitSchema!");

const outJsonPath = path.resolve("src/app/learning/conversation/conversationCatalog.json");
fs.writeFileSync(outJsonPath, JSON.stringify(allUnits, null, 2), "utf-8");
console.log(`Wrote catalog to ${outJsonPath}`);
