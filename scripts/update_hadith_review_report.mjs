import fs from 'node:fs/promises';
const folder='docs/lesson-content-audit/';
const content=JSON.parse(await fs.readFile('src/app/learning/hadith/figmaHadithContent.json','utf8'));
const recorded=JSON.parse(await fs.readFile('src/app/learning/hadith/hadithRecordedSourceTexts.json','utf8'));
const definitions=JSON.parse(await fs.readFile('scripts/hadith_definition_repairs.json','utf8'));
let verification;
try { verification=JSON.parse(await fs.readFile(folder+'hadith-verification.json','utf8')); } catch(error) { if(error.code!=='ENOENT') throw error; }
const baselineWords=new Map();
const baselinePath=folder+'hadith-review-baseline-vocabulary.json';
let savedBaseline;
try { savedBaseline=JSON.parse(await fs.readFile(baselinePath,'utf8')); } catch (error) { if(error.code!=='ENOENT') throw error; }
if(savedBaseline) for(const [number,words] of Object.entries(savedBaseline)) baselineWords.set(Number(number),words);
else {
for(const batch of [1,2,3]) {
  const log=await fs.readFile(`.codex-hadith-review-${batch}.log`,'utf8');
  let number;
  for(const line of log.split(/\r?\n/)) {
    if(line.startsWith('HADITH ')) number=Number(line.match(/^HADITH (\d+)/)[1]);
    if(line.startsWith('VOCAB ')) baselineWords.set(number,JSON.parse(line.slice(6)));
  }
}
await fs.writeFile(baselinePath,JSON.stringify(Object.fromEntries(baselineWords),null,2)+'\n');
}
const vocabulary=[];
const sources=[];
for(const lesson of content.lessons) {
  baselineWords.get(lesson.number).forEach((word,index)=>{
    if(word.definition!==definitions[lesson.number][index]) vocabulary.push({lessonId:lesson.id,term:word.term,field:'definition',before:word.definition,after:definitions[lesson.number][index]});
  });
  for(const field of ['arabic','translation']) if(recorded[lesson.id][field]!==lesson.source[field]) sources.push({lessonId:lesson.id,field:`source.${field}`,comparison:'Original text used by immutable recorded audio',before:recorded[lesson.id][field],after:lesson.source[field]});
}
await fs.writeFile(folder+'hadith-vocabulary-corrections.json',JSON.stringify(vocabulary,null,2)+'\n');
await fs.writeFile(folder+'hadith-source-corrections.json',JSON.stringify(sources,null,2)+'\n');
const report=`# Hadith review — 8 October 2026

All 42 lessons were read individually: source displays, warmups, overviews, 210 core vocabulary records and their examples/Arabic wording, language extensions, generated practice, speaking prompts, and review prompts. This is an editorial review, not a certification of religious interpretation, CEFR level, or WCAG conformance.

## Improvements retained

The four-stage Read & Listen → Vocabulary → Practice → Review flow, bilingual reading layout toggle, consolidated language bank, active retrieval, and confidence-based review intervals are useful improvements. Preserve this structure.

## Issues and corrections

- ${sources.length} displayed source fields differed from the text represented by existing recordings. Corrections restore the missing conversation in 2; the main sayings in 11, 13, 32, 39 and 41; both narrations in 27; the main saying alongside Ibn Umar's addition in 40; full coverage of 24, 25, 26, 29 and 37; and punctuation/spacing in 17, 19 and 31.
- The replacement English renderings for 24, 25, 26, 29 and 37 are editorial translations from the classical Arabic, rather than copied modern translations. Their source references remain the Nawawi collection. Qualified linguistic/religious validation of nuanced interpretations remains a separate review, particularly 8, 14, 20, 28, 29, 34 and 41.
- ${vocabulary.length} core definitions were simplified. Removed invented consequences and unnecessary doctrinal claims from ordinary dictionary meanings. Religious senses stay explicit where needed. Hadith 4's examples now practise language without presenting a religious timeline as a biology claim.
- All 210 expressions have Arabic learner glosses that match their English grammatical form. Original Arabic source wording remains intact. Stable lesson IDs and terms identify the glosses.
- In 26, the invented combined expression “joint and daily duty” is now the single word “joint”, with a bodily definition and example. Existing media labels/URLs remain unchanged; unsuitable images use the placeholder. In 35, the envy example uses the taught verb, and the trade example avoids a blanket claim about commercial codes.
- Warmups in 4–42 now have a single scenario and appropriate choices, replacing export labels and unsupported sorting/multiple-selection instructions. Overview purposes are lesson-specific; word counts come from the actual vocabulary, and durations no longer pick up list numbers. The lesson-details disclosure includes learning goals.
- Generated practice previously tested lesson titles, citation recognition, or design instructions. It now tests the current lesson's expressions and meanings. Answer positions and sequence choices vary deterministically. Existing authored activities remain.
- Hadith 3's sequence answer now agrees with the displayed narration: testimony, prayer, zakat, Hajj, fasting. Another narration's order is not treated as an error; this exercise follows the source shown here.
- Corrected false error labels in 26 and 32. Corrected misleading contrasts in 6, 9, 20, 34, 39 and 41. Fixed duplicated words and awkward phrasing in examples and speaking models.
- Review now shows one question at a time, preserves self-ratings and revealed answers on return, and supplies concise answers instead of an entire Hadith. The complete A/B sample dialogue is shown, without microphone/design instructions.
- Navigation uses labelled tab panels; arrow keys move focus without changing stages. Completion indicators reflect actual saved completion. Changing lessons remounts lesson state; Reset clears the current score. Confidence validation moves focus to the fieldset and exposes the error relationship.
- Long translations use paragraphs. Bilingual cards stop stretching to the tallest column; Arabic line spacing is more compact. Missing or unrelated visual assets use an explicit placeholder and clue.
- The sticky navigation no longer floats 96 pixels above the bottom and across the reading area. Shared vocabulary examples preserve their own punctuation without adding duplicate quotation marks. Listening instructions describe the available interface accurately.
- All stored R2 image/audio references remain unchanged. Corrected text uses speech synthesis when the immutable recording has different text, preserving the full passage including parentheses.

## Further layout recommendations

The existing structure needs refinement rather than another redesign. For long Hadiths, aligned Arabic/English passage sections would make cross-reference easier; segmentation needs a separate checked bilingual alignment. The current paragraphs and reading toggle provide a usable immediate improvement. Keep the language bank optional and avoid restoring multiple questions above the current activity.

## Individual lesson coverage

| Hadith | Lesson | Reviewed sections | Source correction |
|---|---|---|---|
${content.lessons.map(l=>`| ${l.number} | ${l.title} | Overview, warmup, source, vocabulary, language bank, practice, speaking, review | ${sources.some(s=>s.lessonId===l.id)?'Corrected':'No display defect found'} |`).join('\n')}

## Verification

${verification ? verification.summary : 'Verification results are recorded after the final checks.'} The broader whole-app manual editorial review remains tracked separately in REVIEW.md and manual-review-progress.json; this Hadith review does not mark that work complete.

## Source checks

Affected source passages were checked against the cited Nawawi entries: [2](https://sunnah.com/nawawi40/2), [3](https://sunnah.com/nawawi40/3), [24](https://sunnah.com/nawawi40/24), [26](https://sunnah.com/nawawi40/26), [27](https://sunnah.com/nawawi40/27), [29](https://sunnah.com/nawawi40/29), [37](https://sunnah.com/nawawi40/37), [40](https://sunnah.com/nawawi40/40), [41](https://sunnah.com/nawawi40/41). “No display defect found” records the local editorial reading, not independent source certification.
`;
await fs.writeFile(folder+'HADITH-REVIEW.md',report);
console.log(`${content.lessons.length} lesson entries; ${vocabulary.length} definition corrections; ${sources.length} source field corrections.`);
