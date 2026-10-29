const fs = require('fs');

// Classroom improvements
const classroomPath = 'src/app/data/usage/classroom.usage.json';
const classroomData = JSON.parse(fs.readFileSync(classroomPath, 'utf8'));

const classroomImprovements = {
  // Lesson 1
  'classroom-1-1': {
    scenario: "On a clean seminar table, an instructor sets down a sharpened wooden pencil beside a blank notebook and an eraser.",
    question: "Which writing instrument rests beside the notebook for taking quick notes?",
    imagePrompt: "Crisp, bright close-up photography of a freshly sharpened classic yellow wooden pencil resting neatly beside an open blank paper notebook on a clean oak desk. Soft natural daylight, pristine workspace, minimal clean stationery. Zero people, zero readable text, zero brand logos."
  },
  'classroom-1-2': {
    scenario: "To measure paper margins accurately, an architect places a clear plastic ruler along the edge of a drafting sheet.",
    question: "Which tool is placed along the edge of the sheet to measure straight lines?",
    imagePrompt: "Top-down clean photography of a clear transparent acrylic ruler with fine measurement markings laid straight on a clean white desk beside a blank sketchbook. Bright modern workspace, sharp crisp lighting. Zero people, zero text leaks, zero brand logos."
  },
  'classroom-1-3': {
    scenario: "On a design workshop table, a fine colored pencil lies ready beside a neat sketchpad for adding color accents.",
    question: "Which tool is selected to draw and color fine details on the sketchpad?",
    imagePrompt: "Close-up photograph of a sleek cedar-wood colored pencil with vibrant blue lead resting on a clean white drafting table beside a plain sketchpad. Bright daylight, minimalist art studio setting. Zero people, zero text, zero brand logos."
  },
  'classroom-1-4': {
    scenario: "Before the lecture starts, a student unzips a neat fabric pencil case to organize pens, pencils, and erasers.",
    question: "Which pouch keeps all the loose writing tools organized together?",
    imagePrompt: "A sleek grey canvas zipper pencil case sitting open on a clean wooden lecture desk, neatly holding pens and pencils inside. Immaculate student workspace in soft morning light. Zero people, zero brand logos, zero text."
  },
  'classroom-1-5': {
    scenario: "For the professional training session, each attendee receives a spiral-bound printed workbook containing practical exercises.",
    question: "Which document holds the course exercises and practice tasks?",
    imagePrompt: "A neat spiral-bound training workbook with a blank clean textured cardstock cover resting on a modern conference desk beside a pen. Bright, airy, professional training atmosphere. Zero people, zero readable text, zero brand logos."
  },
  // Lesson 2
  'classroom-2-1': {
    scenario: "During the lecture, a participant takes a crisp white sheet of paper from the stack to jot down main takeaways.",
    question: "What surface is taken from the stack to write down lecture notes?",
    imagePrompt: "A single clean, crisp white sheet of blank paper resting diagonally on a polished light oak desk beside a sleek ballpoint pen. Minimalist, serene, bright natural lighting. Zero people, zero text, zero brand logos."
  },
  'classroom-2-2': {
    scenario: "On the reference library table, a thick hardcover dictionary stands ready for students looking up advanced vocabulary.",
    question: "Which reference volume provides definitions and pronunciations for unfamiliar words?",
    imagePrompt: "A thick, elegant cloth-bound reference dictionary resting open on a polished library wooden study table under a warm brass desk lamp. Academic, focused, dust-free setting. Zero readable text, zero brand logos."
  },
  'classroom-2-3': {
    scenario: "In the training room, an ergonomic wooden and metal chair is neatly tucked under each individual study desk.",
    question: "Which piece of furniture provides comfortable seating for learners during class?",
    imagePrompt: "Clean, stylish modern Scandinavian ergonomic study chair neatly placed at a light wood training desk in a sunlit seminar room. Clean architectural lines, bright natural daylight. Zero people, zero brand logos."
  },
  'classroom-2-4': {
    scenario: "At the front of the presentation hall, a large white projection screen displays high-definition slides for the audience.",
    question: "Which wide surface displays the projected digital slides to the whole room?",
    imagePrompt: "A large, clean matte-white presentation screen mounted at the front of a modern, well-lit executive lecture hall. Polished wooden floors, clean lines, contemporary interior. Zero people, zero slide text, zero brand logos."
  },
  'classroom-2-5': {
    scenario: "Along the classroom wall, a solid oak shelf neatly holds reference volumes, course folders, and neat storage bins.",
    question: "Which wall unit holds the organized books and reference materials off the floor?",
    imagePrompt: "A clean modern light wood bookshelf mounted on a smooth white wall, neatly holding a few plain hardcover books and a small potted succulent. Minimal, tidy, sunlit room. Zero people, zero text, zero brand logos."
  },
  // Lesson 3
  'classroom-3-1': {
    scenario: "Arriving at the adult training center, a professional sets down a sleek waterproof commuter backpack beside the desk.",
    question: "Which bag is used to carry laptops, notes, and personal supplies to class?",
    imagePrompt: "A clean, modern charcoal grey minimalist commuter backpack made of matte water-resistant fabric, standing upright beside a clean wooden desk leg in a modern office space. Professional, adult, spotless. Zero people, zero brand logos."
  },
  'classroom-3-2': {
    scenario: "To post an announcement on the board, an assistant cuts a neat strip of clear adhesive tape from a heavy desktop dispenser.",
    question: "Which adhesive strip is pulled from the dispenser to fasten notices cleanly?",
    imagePrompt: "A heavy minimalist matte black desktop tape dispenser with a neat roll of clear transparent adhesive tape on a clean wooden desk. Crisp morning light, pristine stationery. Zero people, zero text, zero brand logos."
  },
  'classroom-3-3': {
    scenario: "To keep the weekly handouts bundled securely, the trainer wraps a thick elastic rubber band around the paper stack.",
    question: "Which flexible loop holds the stack of paper handouts neatly together?",
    imagePrompt: "A neat bundle of clean white document sheets held securely together by a classic beige elastic rubber band on a modern desk surface. Clean, organized, functional. Zero people, zero text, zero brand logos."
  },
  'classroom-3-4': {
    scenario: "In the technical drawing workshop, a draftsman uses a precision brass compass to draw a perfect geometric circle.",
    question: "Which instrument is used to scribe accurate circles and arcs on technical plans?",
    imagePrompt: "A precision stainless steel drawing compass tool resting neatly on a clean white drafting sheet beside a pencil on an architect's desk. Crisp studio lighting, elegant geometry. Zero people, zero text, zero brand logos."
  },
  'classroom-3-5': {
    scenario: "During the interactive language lab, a learner uses a slim digital tablet with a stylus to complete grammar drills.",
    question: "Which touchscreen mobile device displays digital exercises and accepts stylus input?",
    imagePrompt: "A modern slim digital tablet with a clean glowing interface resting on an ergonomic wooden stand beside a white digital stylus on a clean study desk. Bright, contemporary tech workspace. Zero people, zero text, zero brand logos."
  },
  // Lesson 4
  'classroom-4-1': {
    scenario: "Beside the instructor's workstation, a compact laser printer smoothly delivers newly printed course syllabi into the output tray.",
    question: "Which machine produces physical paper copies of digital documents?",
    imagePrompt: "A clean, modern white compact desktop laser printer resting on a wooden side credenza in an office, with clean blank white paper neatly resting in the output tray. Bright, tidy, dust-free environment. Zero people, zero brand logos."
  },
  'classroom-4-2': {
    scenario: "To advance slides smoothly without returning to the podium, the presenter holds a compact black projector remote in hand.",
    question: "Which handheld device controls the presentation slides from across the room?",
    imagePrompt: "Close-up photograph of a sleek ergonomic black presentation clicker remote resting neatly on a clean wooden podium surface beside a glass of water. Professional conference room setting. Zero people, zero brand logos."
  },
  'classroom-4-3': {
    scenario: "In an evening adult seminar, a focused adult student sits at his desk taking careful notes in a journal.",
    question: "Who is the adult attendee actively participating in the learning session?",
    imagePrompt: "An adult man in professional casual attire seated attentively at a clean desk in a modern seminar room, writing in a clean notebook. Warm natural daylight, focused educational posture. Zero women, zero readable text, zero brand logos."
  },
  'classroom-4-4': {
    scenario: "After the day's classes end, a dependable maintenance worker mops and polishes the wide hallway floor to keep the facility clean.",
    question: "Who ensures the school facilities and corridors remain clean and sanitized?",
    imagePrompt: "An adult male janitor in neat professional work uniform rolling a clean commercial yellow mop bucket along a spotless, gleaming polished hallway. Bright, hygienic, dignified workplace photography. Zero women, zero text, zero brand logos."
  },
  'classroom-4-5': {
    scenario: "Supporting the lead instructor, a dedicated teaching assistant distributes supplementary exercise handouts to students.",
    question: "Who assists the professor by managing handouts and supporting learners?",
    imagePrompt: "An adult male teaching assistant in a smart collared shirt neatly placing printed syllabus stacks onto training room desks before class. Professional, bright educational environment. Zero women, zero readable text, zero brand logos."
  },
  // Lesson 5
  'classroom-5-1': {
    scenario: "After attending the evening session, the learner finishes his assigned homework at his home desk before the next class.",
    question: "What assigned study tasks does a student complete independently outside class hours?",
    imagePrompt: "A quiet home study desk in warm evening lamp lighting, featuring an open notebook with neat handwriting, a pen, and a warm ceramic mug. Peaceful, focused study atmosphere. Zero people, zero readable text, zero brand logos."
  },
  'classroom-5-2': {
    scenario: "On the front reception counter, a polished brass bell sits ready for visitors who need assistance from the office staff.",
    question: "Which metal chime is tapped to signal for reception staff at the front desk?",
    imagePrompt: "A gleaming, polished solid brass service call bell resting on a clean wooden reception counter in a professional office lobby. Elegant, welcoming, crisp lighting. Zero people, zero text, zero brand logos."
  }
};

classroomData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `classroom-${lIdx + 1}-${sIdx + 1}`;
    if (classroomImprovements[key]) {
      scene.scenario = classroomImprovements[key].scenario;
      scene.check.question = classroomImprovements[key].question;
    }
  });
});

fs.writeFileSync(classroomPath, JSON.stringify(classroomData, null, 2), 'utf8');
console.log('Updated classroom.usage.json with elevated adult scenarios and questions.');
