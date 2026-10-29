const fs = require('fs');

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b = pipeline.batches[1]; // Days & Months batch

const daysMonthsPrompts = {
  'days-months-1-usage-scene-1': 'Crisp, bright overhead photography of a clean desk calendar open to a monthly grid. A man\'s hand holding an elegant pen points neatly to the start of the workweek column. Beside the planner sits a clean ceramic mug of coffee and a pair of reading glasses on a spotless light oak wooden desk. Warm morning sunlight, pristine workspace. Zero large target text, zero brand logos, zero graphic overlays.',
  'days-months-1-usage-scene-2': 'Clean, bright office desk still life featuring an open weekly schedule planner. A man\'s hand with a sleek pen is checking off a task box late in the week column. Beside the planner rests an unbranded laptop edge and a small green succulent plant on a spotless modern white desk. Crisp natural daylight, professional and tidy. Zero answer text, zero brand logos, zero graphic overlays.',
  'days-months-1-usage-scene-3': 'Serene Sunday morning atmosphere on a sunlit wooden breakfast table. A clean, open personal journal notebook lies beside a plate of sliced fruit and a warm glass of tea. Gentle morning sun beams across the page. Calm, peaceful weekend ambiance with no full human figures. Clean, uncluttered, relaxing setting with zero readable text, zero brand logos, zero graphic overlays.',
  'days-months-1-usage-scene-4': 'A relaxing day off setting: A comfortable living room coffee table with a steaming cup of herbal tea, an unbranded closed book, and relaxing indoor plants bathed in warm afternoon sunlight, conveying pure leisure and relaxation from work. Completely peaceful, spotless environment with zero people, zero clutter, zero text, zero brand logos.',
  'days-months-2-usage-scene-1': 'Bright, sunny summertime desk workspace beside a sunlit window. A clean minimalist desktop calendar sits on a light wooden table next to a glass of iced lemon water with ice cubes and condensation catching the bright June sunlight. Fresh, airy, vibrant seasonal atmosphere. Zero humans, zero text leaks, zero brand logos.',
  'days-months-2-usage-scene-2': 'Warm early autumn desktop scene with golden afternoon sunlight. A clean leather-bound planner notebook rests on a polished wooden desk beside a clean ceramic mug and a couple of crisp fallen golden autumn leaves by the window sill. Cozy, quiet, studious atmosphere. Zero humans, zero text leaks, zero brand logos.',
  'days-months-2-usage-scene-3': 'Cozy winter workspace scene beside a frosty window. A clean minimalist wall calendar or desk planner lies near a warm knit wool scarf and a steaming ceramic mug of hot cocoa on a warm wooden desk. Crisp, serene, immaculate winter interior lighting. Zero humans, zero text leaks, zero brand logos.',
  'days-months-2-usage-scene-4': 'Organized university or college academic study desk. A clean student course binder, a neat stack of textbooks with blank covers, and a tidy pencil case sit on a clean library oak desk under warm study lamp lighting. Focused, intellectual, quiet academic atmosphere. Zero humans, zero text leaks, zero brand logos.',
  'days-months-2-usage-scene-5': 'Clean modern university lecture hall or study table setting. An open syllabus schedule booklet and a clean student notebook lie on a polished wooden desk with tiered classroom seating in the soft-focus background. Bright, tidy, educational atmosphere with zero humans, zero text leaks, zero brand logos.',
  'days-months-3-usage-scene-1': 'Crisp, close-up photograph of a modern minimalist desk calendar. A bright, bold circled date box on today\'s grid square stands out clearly. A man\'s hand holds a sleek wooden pencil beside it on a pristine white desk under crisp daylight. Professional, tidy, unmistakable focus on the current day. Zero answer text, zero brand logos.',
  'days-months-3-usage-scene-2': 'A clean weekly desktop organizer pad with Monday through Friday sections neatly laid out. A man\'s hand with a fine-tip pen underlines the current week section. A clean glass of water and a phone resting facedown sit nearby on a spotless oak table. Bright, organized, distraction-free. Zero text leaks, zero brand logos.',
  'days-months-3-usage-scene-3': 'A clean, modern monthly calendar page displayed on an elegant wooden stand on an executive desk. The current month grid is cleanly visible under bright natural window light. Next to it sits a small brass clock and a clean ceramic pen holder. Spotless, professional office setting. Zero humans, zero text leaks, zero brand logos.',
  'days-months-3-usage-scene-4': 'Clean, comprehensive full-year wall calendar hanging on a smooth modern white wall above a minimalist wooden credenza. A potted ficus plant and a clean ceramic vase stand on the credenza below. Bright, airy, Scandinavian interior aesthetic. Zero humans, zero text leaks, zero brand logos.',
  'days-months-3-usage-scene-5': 'Professional doctor or business appointment scene: A clean desk calendar showing a neatly penciled time slot with a clean reminder card beside a pair of eyeglasses on a doctor\'s or consultant\'s polished wooden desk. Warm, trustworthy, immaculate professional office ambiance. Zero humans, zero text leaks, zero brand logos.',
  'days-months-4-usage-scene-1': 'An elegant, classic hardcover personal diary with an attached ribbon bookmark and a brass clasp, resting on a clean mahogany nightstand beside a warm glowing bedside lamp. Tidy, intimate, reflective atmosphere with zero humans, zero readable text, zero brand logos.',
  'days-months-4-usage-scene-2': 'A clean, bright yellow paper sticky reminder note attached neatly to the side of a modern computer monitor on a clean desk. A man\'s hand with a pen has just placed it. In the background sits a neat stack of documents and a steaming cup of coffee. Clear, unmistakable reminder concept with zero readable text leaks, zero brand logos.'
};

let count = 0;
b.items.forEach(item => {
  if (daysMonthsPrompts[item.sceneId]) {
    item.optimizedPrompt = daysMonthsPrompts[item.sceneId];
    count++;
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Updated ${count} items in Batch 2 (Days & Months) with object-centric, human-free/men-only prompts.`);
