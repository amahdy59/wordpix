import { readFile, writeFile } from "node:fs/promises";

const translations = {
  one: "واحد", two: "اثنان", three: "ثلاثة", four: "أربعة", five: "خمسة", six: "ستة", seven: "سبعة", eight: "ثمانية", nine: "تسعة", ten: "عشرة",
  "divided-by": "مقسوم على", lime: "أخضر ليموني", salmon: "سلموني", light: "فاتح",
  dull: "باهت", vivid: "زاهٍ", pale: "شاحب", deep: "داكن", warm: "دافئ", cool: "بارد",
  neutral: "محايد", mix: "يخلط", blend: "يمزج", shade: "درجة لونية داكنة", tint: "صبغة لونية فاتحة", hue: "درجة لونية", saturation: "التشبّع اللوني", coral: "مرجاني",
  gradient: "تدرّج لوني", rainbow: "قوس قزح", spectrum: "طيف", pigment: "صبغة",
  circle: "دائرة", rectangle: "مستطيل", oval: "بيضاوي", diamond: "مُعَيَّن", pentagon: "خماسي الأضلاع",
  hexagon: "سداسي الأضلاع", octagon: "ثماني الأضلاع", star: "نجمة", sphere: "كرة", cube: "مكعّب",
  cylinder: "أسطوانة", cone: "مخروط", pyramid: "هرم", cuboid: "متوازي المستطيلات", hemisphere: "نصف كرة", torus: "سطح حلقي",
  prism: "منشور", curve: "منحنى", tetrahedron: "رباعي الوجوه", straight: "مستقيم", zigzag: "متعرّج", spiral: "حلزوني",
  "right-angle": "زاوية قائمة", "acute-angle": "زاوية حادّة", "obtuse-angle": "زاوية منفرجة",
  area: "مساحة", perimeter: "محيط", volume: "حجم", radius: "نصف القطر", diameter: "قُطر", circumference: "محيط الدائرة", diagonal: "قطر مائل", symmetry: "تناظر", vertex: "رأس الشكل", edge: "حافة",
  repeat: "تكرار", sequence: "تسلسل", pattern: "نمط", tessellation: "تبليط هندسي", fractal: "شكل كسيري",
  line: "خط", parallel: "متوازٍ", perpendicular: "متعامد", grid: "شبكة", array: "مصفوفة", matrix: "مصفوفة رياضية", mosaic: "فسيفساء", kaleidoscope: "منظار الأشكال المتكررة",
  amused: "مستمتع", disappointed: "خائب الأمل", annoyed: "منزعج", bored: "ضجر", thoughtful: "متفكّر", indifferent: "غير مبالٍ", alert: "يقظ",
  hungry: "جائع", thirsty: "عطشان", full: "شبعان", dizzy: "يشعر بالدوار", nauseous: "يشعر بالغثيان",
  exhausted: "مُنهك", active: "نشيط", comfortable: "مرتاح", "morning-routine": "روتين صباحي", "homework-help": "مساعدة في الواجب المنزلي",
  love: "حب", trust: "ثقة", affection: "مودة",
};

const units = ["numbers-counting", "colors", "shapes-geometry", "basic-emotions", "family", "bedroom"];
const slug = (value) => value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

for (const unit of units) {
  const path = `src/app/data/usage/${unit}.usage.json`;
  let text = (await readFile(path, "utf8")).replace(/^\uFEFF/u, "");
  const lessons = JSON.parse(text);
  for (const lesson of lessons) {
    if (lesson.globalOrder > 20) continue;
    lesson.targetWordsArabic = lesson.targetWordsEnglish.map((word, index) => translations[slug(word)] ?? lesson.targetWordsArabic[index]);
  }
  await writeFile(path, `${JSON.stringify(lessons, null, 2)}\n`);
}

for (const unit of units.filter((unit) => ["numbers-counting", "colors", "shapes-geometry", "basic-emotions", "family"].includes(unit))) {
  const path = `src/app/data/bilingual/${unit}.json`;
  let text = (await readFile(path, "utf8")).replace(/^\uFEFF/u, "");
  const data = JSON.parse(text);
  for (const [key, entry] of Object.entries(data)) {
    const translation = translations[slug(key)];
    if (translation && entry && typeof entry === "object") entry.arabicTranslation = translation;
  }
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

console.log("Repaired Batch 1 Arabic target translations.");
