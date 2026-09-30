import { readFile, writeFile } from "node:fs/promises";

const file = "src/app/data/usage/bedroom.usage.json";
const lessons = JSON.parse((await readFile(file, "utf8")).replace(/^\uFEFF/u, ""));

const specs = {
  "bedroom-1": [
    ["Maya makes the bed, leaves her phone on the nightstand, and puts clean clothes in the dresser.", "Where does Maya leave her phone?", "Nightstand", "An adult making a bed, with a phone on the nightstand and folded clothes going into a dresser."],
    ["Omar hangs his jacket in the wardrobe, then sits on the chair at his desk.", "Where does Omar hang his jacket?", "Wardrobe", "An adult hanging a jacket inside a wardrobe before sitting on a chair at a bedroom desk."],
    ["A stool stands below the mirror, and the bookshelf beside it holds Maya's books.", "What stands below the mirror?", "Stool", "A bedroom corner with a stool directly below a mirror and a bookshelf full of books beside it."],
    ["Leila takes a blanket from the chest of drawers and places a pillow at the top of the bed.", "Where was the blanket?", "Chest of Drawers", "An adult taking a folded blanket from a chest of drawers while a pillow rests at the top of the bed."],
    ["Samir spreads the sheet over the mattress and lays the duvet on top.", "What does Samir put directly over the mattress?", "Sheet", "An adult making a bed by spreading a sheet over the mattress and placing a duvet on top."],
  ],
  "bedroom-2": [
    ["Nadia puts a pillowcase on the pillow, pulls the comforter over the bed, and adds a cushion for decoration.", "What does Nadia pull over the bed?", "Comforter", "An adult making a bed with a pillowcase, a comforter covering the bed, and a decorative cushion."],
    ["The bed frame supports the mattress, the headboard is behind it, and a lamp stands beside the bed.", "What supports the mattress?", "Bed Frame", "A cutaway-style bedroom view clearly showing a bed frame below the mattress, a headboard behind it, and a bedside lamp."],
    ["Hassan opens the curtain to let light through the window, then closes the bedroom door.", "What does Hassan open at the window?", "Curtain", "An adult opening a curtain at a bright bedroom window while the room door is partly closed."],
    ["A small rug lies over part of the carpet, and the ceiling light shines above both.", "What is under the small rug?", "Carpet", "A clearly bounded rug lying over a larger fitted carpet, with a ceiling light above."],
    ["Rana presses the light switch, lowers the blinds, and plugs her charger into the outlet.", "Where does Rana plug in her charger?", "Outlet", "An adult plugging a charger into a wall outlet; a light switch and lowered window blinds are also clearly visible."],
  ],
  "bedroom-3": [
    ["The alarm clock wakes Karim at seven; a picture frame is beside it, and a wall clock hangs above the desk.", "What wakes Karim at seven?", "Alarm Clock", "A ringing alarm clock beside a picture frame, with a separate wall clock above a bedroom desk."],
    ["Salma waters the plant beside the vase while an unlit candle stays safely on the shelf.", "What does Salma water?", "Plant", "An adult watering a bedroom plant beside a vase, with an unlit candle safely placed on a separate shelf."],
    ["Tariq checks the calendar, takes a tissue from the tissue box, and puts the used tissue in the wastebasket.", "Where does Tariq put the used tissue?", "Wastebasket", "An adult placing a used tissue into a wastebasket, with a calendar and tissue box clearly visible."],
    ["Mona puts her shirt on a hanger, folds her pajamas, and leaves her slippers beside the wardrobe.", "What holds Mona's shirt?", "Hanger", "An adult placing a shirt on a hanger; folded pajamas and slippers beside a wardrobe remain visible."],
    ["A robe hangs behind the door, a teddy bear sits on the bed, and a poster is above the headboard.", "What hangs behind the door?", "Robe", "A robe hanging behind a bedroom door, a teddy bear on the bed, and a poster above the headboard."],
  ],
};

const readings = {
  "bedroom-1": ["Making the Bedroom Ready", "Maya makes the bed before work. She spreads a sheet over the mattress and places the duvet and blanket on top. Her phone stays on the nightstand. She hangs a jacket in the wardrobe, puts clean clothes in the dresser, and sits at the desk to check her plans."],
  "bedroom-2": ["A Brighter, Tidier Room", "Nadia changes the pillowcase and pulls the comforter over the bed. She opens the curtain and raises the blinds to let light through the window. A small rug lies over the carpet. Before leaving, she switches off the ceiling light and checks the outlet."],
  "bedroom-3": ["Karim's Evening Routine", "Karim checks the calendar and sets his alarm clock. He puts a clean shirt on a hanger and folds his pajamas. His slippers stay beside the wardrobe, and his robe hangs behind the door. Before sleeping, he waters the plant and places the teddy bear on the bed."],
};

const asArray = (value) => (Array.isArray(value) ? value : [value]);
const updated = lessons.map((lesson) => {
  const lessonSpecs = specs[lesson.lessonId];
  if (!lessonSpecs) return lesson;
  const scenes = asArray(lesson.usage.scenes);
  if (scenes.length !== lessonSpecs.length) throw new Error(`${lesson.lessonId}: scene count mismatch.`);
  const curatedScenes = scenes.map((scene, index) => {
    const [scenario, question, expectedAnswer, imageBrief] = lessonSpecs[index];
    const options = asArray(scene.targetWords);
    if (!options.includes(expectedAnswer)) throw new Error(`${lesson.lessonId}: invalid answer ${expectedAnswer}.`);
    return { ...scene, scenario, check: { question, options, expectedAnswer }, imageBrief };
  });
  const [title, text] = readings[lesson.lessonId];
  return {
    ...lesson,
    usage: {
      ...lesson.usage,
      goal: "Recognize and use common bedroom vocabulary in practical home routines.",
      canDoStatement: "I can describe where common bedroom objects are and how I use them",
      scenes: curatedScenes,
    },
    reading: {
      title,
      text,
      imageBrief: `Show the adult home routine from “${title}” with the important bedroom objects naturally arranged and no written labels.`,
    },
    exercises: [
      ...curatedScenes.map((scene) => ({
        prompt: scene.check.question,
        answer: scene.check.expectedAnswer,
        questionType: "context-cloze",
        responseMode: "choice",
        contextTag: `${lesson.lessonId}-scene-${scene.chunkNumber}`,
      })),
      {
        prompt: `Use “${asArray(curatedScenes[0].targetWords)[0]}” in one sentence about your bedroom.`,
        answer: curatedScenes[0].scenario,
        questionType: "production",
        responseMode: "sentence",
        contextTag: `${lesson.lessonId}-personal-use`,
      },
      {
        prompt: "Describe where two objects from this lesson are in relation to each other.",
        answer: curatedScenes[2].scenario,
        questionType: "transfer",
        responseMode: "sentence",
        contextTag: `${lesson.lessonId}-spatial-transfer`,
      },
    ],
    video: {
      title: `${lesson.lessonName}: Bedroom Words in Action`,
      idea: "A short adult home routine showing the target objects in use, followed by one evidence-based location question.",
      scriptStarter: curatedScenes[0].scenario,
    },
  };
});

await writeFile(file, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
console.log("Rewrote 15 repeated Bedroom scenes across lessons 1–3.");
