import { createServer } from "vite";
const server = await createServer({configFile:false, server:{middlewareMode:true,watch:null}, optimizeDeps:{noDiscovery:true}, appType:"custom"});
try {
  const {FIGMA_HADITH_LESSONS} = await server.ssrLoadModule("/src/app/learning/hadith/figmaHadithCatalog.ts");
  const {parseHadithVocabulary} = await server.ssrLoadModule("/src/app/learning/hadith/stages/HadithVocabularyStage.tsx");
  const {getParsedHadithStages} = await server.ssrLoadModule("/src/app/learning/hadith/hadithLessonContent.ts");
  const {getHadithExerciseSet} = await server.ssrLoadModule("/src/app/learning/hadith/hadithExerciseCatalog.ts");
  const start = Number(process.argv[2] ?? 1), end = Number(process.argv[3] ?? start + 5);
  for(const lesson of FIGMA_HADITH_LESSONS.filter((l)=>l.number>=start&&l.number<=end)) {
    const parsed = getParsedHadithStages(lesson);
    console.log(`\nHADITH ${lesson.number}: ${lesson.title}`);
    if (process.argv[4] === "intro") {
      console.log("OVERVIEW",JSON.stringify(parsed.overview));
      console.log("WARMUP",JSON.stringify(parsed.warmup));
      continue;
    }
    console.log("VOCAB",JSON.stringify(parseHadithVocabulary(lesson.stages.vocabulary.text,lesson.number)));
    console.log("REVIEW",JSON.stringify(parsed.review));
    console.log("SPEAK",JSON.stringify(parsed.speak));
    console.log("PRACTICE COUNT",getHadithExerciseSet(lesson.id)?.exercises.length);
  }
} finally {await server.close();}
