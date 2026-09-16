const fs = require("fs");
const path = "src/app/data/lessons.ts";
let content = fs.readFileSync(path, "utf8");

// Insert HADITH_NIYYAH_GROUPS before COURSE_UNITS
const groupDef = `export const HADITH_NIYYAH_GROUPS: Lesson[] = [
  {
    id: "hadith-niyyah-1",
    name: "Hadith: Niyyah",
    description: "Learn vocabulary from the Hadith of Intention.",
    topicId: "hadith-niyyah-1",
    wordIds: ["judged", "motive", "rewarded", "attain", "hijrah"],
    story: "In this section, you will learn about judged, motive, rewarded, attain, hijrah.",
  }
];

export const HADITH_NIYYAH_TOPICS = HADITH_NIYYAH_GROUPS.map((g) => ({
  id: g.id,
  name: g.name,
  itemsCount: g.wordIds.length,
}));\n\n`;

content = content.replace("export const COURSE_UNITS: Record<string, CourseUnit> = {", groupDef + "export const COURSE_UNITS: Record<string, CourseUnit> = {\n  \"hadith-niyyah\": {\n    id: \"hadith-niyyah\",\n    name: \"Islamic Studies - Niyyah\",\n    description: \"Islamic studies and terminology.\",\n    topics: HADITH_NIYYAH_TOPICS,\n    groups: HADITH_NIYYAH_GROUPS,\n    wordIds: [\"judged\", \"motive\", \"rewarded\", \"attain\", \"hijrah\"]\n  },");

// Insert module-6 into COURSE_MODULES
const moduleDef = `,
  {
    id: "module-6",
    level: 6,
    levelBadge: "Level 6 - Islamic Studies",
    title: "Islamic Studies",
    titleAr: "Islamic Studies",
    description: "Explore vocabulary for Islamic Studies",
    unitIds: ["hadith-niyyah"],
  }
];`;

content = content.replace("      \"space-center\",\n    ],\n  },\n];", "      \"space-center\",\n    ],\n  }" + moduleDef);

fs.writeFileSync(path, content);

