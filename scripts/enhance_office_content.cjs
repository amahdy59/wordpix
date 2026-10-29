const fs = require('fs');

const officePath = 'src/app/data/usage/office-supplies.usage.json';
const officeData = JSON.parse(fs.readFileSync(officePath, 'utf8'));

const officeImprovements = {
  // Lesson 1
  'office-supplies-1-1': {
    scenario: "On the executive conference table, an elegant black rollerball pen rests beside a signature document ready for signing.",
    question: "Which writing instrument with fluid ink is used to sign the official document?",
    imagePrompt: "Close-up photograph of a sleek matte black metal ballpoint pen resting on a crisp white document page on a polished mahogany desk. Soft warm office lighting, professional and clean. Zero people, zero readable text, zero brand logos."
  },
  'office-supplies-1-2': {
    scenario: "To remove a pencil sketch mark without damaging the drafting paper, the designer uses a soft white vinyl eraser.",
    question: "Which tool cleanly removes graphite pencil marks from paper?",
    imagePrompt: "A clean, pure white rectangular vinyl drafting eraser resting on a clean wooden drafting table beside a wooden pencil. Crisp, minimalist studio lighting. Zero people, zero text, zero brand logos."
  },
  'office-supplies-1-3': {
    scenario: "To quickly mask a typed typo on a printed invoice, the accountant glides a compact dispenser of white correction tape across the line.",
    question: "Which handheld dispenser applies an opaque white strip to cover ink errors instantly?",
    imagePrompt: "A sleek ergonomic translucent correction tape dispenser resting on a clean office desk beside a document. Bright natural office daylight, clean modern stationery. Zero people, zero readable text, zero brand logos."
  },
  'office-supplies-1-4': {
    scenario: "During the client meeting, the attorney takes quick legal notes on a classic yellow lined legal pad with a stiff cardboard backing.",
    question: "Which ruled yellow paper tablet is commonly used for taking detailed business and legal notes?",
    imagePrompt: "A pristine canary yellow ruled legal writing pad resting on a clean executive desk beside an elegant pen and a pair of reading glasses. Natural daylight, uncluttered workspace. Zero people, zero readable text, zero brand logos."
  },
  // Lesson 2
  'office-supplies-2-1': {
    scenario: "To send a confidential contract by courier, the office administrator slips the folded document into a crisp white mailing envelope.",
    question: "Which paper packet encloses and protects letters and contracts during mailing?",
    imagePrompt: "A clean, crisp white business mailing envelope resting on a modern wooden desk beside an address stamp and a fountain pen. Elegant, minimalist office atmosphere. Zero people, zero text, zero brand logos."
  },
  'office-supplies-2-2': {
    scenario: "To identify the project archive box, an office assistant peels a self-adhesive white label from the backing sheet.",
    question: "Which sticky paper tag is adhered to folders and boxes to mark their contents?",
    imagePrompt: "A clean sheet of crisp white rectangular self-adhesive office labels resting on a clean wooden workspace beside a permanent marker. Clean, organized desk setting. Zero people, zero text, zero brand logos."
  },
  'office-supplies-2-3': {
    scenario: "To keep a stack of client receipts bundled securely, the accountant snaps a durable rubber band around the middle.",
    question: "Which elastic band keeps loose receipts and cards gathered tightly together?",
    imagePrompt: "A neat small bundle of clean document cards held securely together by a classic flexible rubber band on a polished office surface. Clean, organized, minimal. Zero people, zero text, zero brand logos."
  },
  'office-supplies-2-4': {
    scenario: "To mount receipts neatly onto an expense report, the clerk applies a clean swipe of a solid non-toxic glue stick.",
    question: "Which twist-up cylindrical adhesive applies solid glue cleanly without wrinkling paper?",
    imagePrompt: "A modern cylindrical white twist-up glue stick with its cap resting beside it on a clean white desk, alongside a piece of craft paper. Crisp bright daylight, clean and tidy. Zero people, zero brand logos."
  },
  // Lesson 3
  'office-supplies-3-1': {
    scenario: "To eliminate desktop clutter, all pens, paperclips, and note pads are arranged neatly in a compartmentalized wooden desk organizer.",
    question: "Which multi-compartment caddy keeps daily desktop stationery arranged and within easy reach?",
    imagePrompt: "A stylish modern light oak compartmentalized desk organizer tray holding pens, clips, and small pads neatly on an executive desk. Spotless, dust-free Scandinavian office aesthetic. Zero people, zero text, zero brand logos."
  },
  'office-supplies-3-2': {
    scenario: "Working late at the office, the consultant illuminates his paperwork with the warm, focused beam of an adjustable LED desk lamp.",
    question: "Which adjustable task light directs focused illumination onto a work surface?",
    imagePrompt: "A sleek minimalist matte black adjustable architectural LED desk lamp casting a warm, focused pool of light onto a clean wooden workspace. Refined, quiet evening office atmosphere. Zero people, zero text, zero brand logos."
  },
  'office-supplies-3-3': {
    scenario: "Along the back edge of the workstation, a silicone cable organizer keeps phone chargers and monitor cords neatly separated and off the floor.",
    question: "Which channel clip manages charging cords and prevents messy cable tangles?",
    imagePrompt: "A sleek silicone multi-slot cable organizer clip mounted along the edge of a clean light oak desk, neatly holding several white and grey cables in place. Tidy, modern tech workspace. Zero people, zero brand logos."
  },
  'office-supplies-3-4': {
    scenario: "Before dispatching the outgoing carton of manuals, the mailroom clerk seals the top flaps with heavy-duty brown packing tape.",
    question: "Which wide, reinforced adhesive roll securely seals heavy cardboard boxes for shipping?",
    imagePrompt: "A sturdy roll of wide brown kraft packing tape with a metal dispenser edge resting atop a neatly folded cardboard parcel box on an office packing table. Crisp clean utility setting. Zero people, zero text, zero brand logos."
  },
  // Lesson 4
  'office-supplies-4-1': {
    scenario: "To mail delicate electronic components safely, the clerk encloses them in a bubble-lined cushioned padded envelope.",
    question: "Which protective mailing pouch contains internal bubble cushioning to safeguard fragile items?",
    imagePrompt: "A clean kraft paper padded bubble mailer envelope resting on an office mailing counter beside a shipping label. Crisp natural daylight, pristine and durable packaging. Zero people, zero text, zero brand logos."
  },
  'office-supplies-4-2': {
    scenario: "To slice open incoming correspondence neatly without tearing the documents inside, the secretary uses a slim stainless steel letter opener.",
    question: "Which slender bladed desktop tool cleanly slits open paper envelope seams?",
    imagePrompt: "An elegant, polished stainless steel letter opener blade resting across a clean sealed white envelope on a rich wooden desk. Sophisticated, spotless executive office setting. Zero people, zero text, zero brand logos."
  }
};

officeData.forEach((lesson, lIdx) => {
  lesson.usage.scenes.forEach((scene, sIdx) => {
    const key = `office-supplies-${lIdx + 1}-${sIdx + 1}`;
    if (officeImprovements[key]) {
      scene.scenario = officeImprovements[key].scenario;
      scene.check.question = officeImprovements[key].question;
    }
  });
});

fs.writeFileSync(officePath, JSON.stringify(officeData, null, 2), 'utf8');
console.log('Updated office-supplies.usage.json with elevated adult scenarios and questions.');
