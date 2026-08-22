// Comprehensive 3-Passage Extended Narrative Stories and Comprehension MCQ Quizzes
// Designed for maximum vocabulary retention, context immersion, and active recall.

export interface StoryPassage {
  partNumber: 1 | 2 | 3;
  title: string;
  titleArabic: string;
  text: string;
  textArabic: string;
}

export interface StoryQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  explanationArabic: string;
}

export interface GroupStoryBundle {
  groupId: string;
  groupName: string;
  themeTitle: string;
  passages: [StoryPassage, StoryPassage, StoryPassage];
  quiz: StoryQuizQuestion[];
}

export const STORY_TALES_DICTIONARY: Record<string, GroupStoryBundle> = {
  // ── THE BEDROOM ──────────────────────────────────────────────────────────
  furniture: {
    groupId: "furniture",
    groupName: "Furniture",
    themeTitle: "The Great Room Makeover",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The New Beginning",
        titleArabic: "الجزء الأول: البداية الجديدة",
        text: "Maya moved into her new sunny apartment on Saturday morning. The bedroom was completely empty until the moving truck arrived. First, she positioned the wooden bed against the main wall and placed a small nightstand right beside it for her alarm.",
        textArabic:
          "انتقلت مايا إلى شقتها الجديدة المشرقة صباح يوم السبت. كانت غرفة النوم فارغة تمامًا حتى وصلت شاحنة النقل. أولاً، وضعت السرير الخشبي بجانب الحائط الرئيسي ووضعت منضدة سرير صغيرة بجانبه مباشرة لمنبهها.",
      },
      {
        partNumber: 2,
        title: "Part 2: Organizing the Storage",
        titleArabic: "الجزء الثاني: تنظيم التخزين",
        text: "Next, Maya began unpacking her clothes. She neatly folded her warm sweaters into the deep dresser drawers and hung her winter jackets inside the tall wardrobe. She organized her socks in the chest of drawers and set a decorative mirror above it.",
        textArabic:
          "بعد ذلك، بدأت مايا في تفريغ ملابسها. قامت بطي ستراتها الدافئة بعناية داخل أدراج الخزانة العميقة وعلقت معاطفها الشتوية داخل خزانة الملابس الطويلة. ونظمت جواربها في خزانة الأدراج ووضعت مرآة ديكور فوقها.",
      },
      {
        partNumber: 3,
        title: "Part 3: The Cozy Study Corner",
        titleArabic: "الجزء الثالث: ركن الدراسة المريح",
        text: "Finally, near the window, she set up a sturdy study desk and pulled up a cushioned chair. She filled the wooden bookshelf with her favorite novels and placed a wooden stool nearby for guests. Her new bedroom was now complete and perfectly organized.",
        textArabic:
          "أخيرًا، بالقرب من النافذة، رتبت مكتب دراسة قوي وسحبت كرسيًا مبطنًا. وملأت رف الكتب الخشبي برواياتها المفضلة ووضعت مقعدًا خشبيًا بلا ظهر بالقرب منه للضيوف. أصبحت غرفة نومها الجديدة الآن مكتملة ومنظمة بشكل مثالي.",
      },
    ],
    quiz: [
      {
        id: "furn_q1",
        question: "Where did Maya place the nightstand?",
        options: [
          "Inside the wardrobe",
          "Right beside the bed",
          "Under the desk",
          "Behind the bookshelf",
        ],
        correctIndex: 1,
        explanation:
          "Maya positioned the bed against the wall and set the nightstand right beside it.",
        explanationArabic: "وضعت مايا السرير بجانب الحائط ووضعت منضدة السرير بجانبه مباشرة.",
      },
      {
        id: "furn_q2",
        question: "Where did Maya hang her winter jackets?",
        options: [
          "On the chair",
          "Inside the tall wardrobe",
          "In the dresser drawer",
          "On the stool",
        ],
        correctIndex: 1,
        explanation: "She hung her winter jackets neatly inside the tall wardrobe.",
        explanationArabic: "علقت معاطفها الشتوية بدقة داخل خزانة الملابس الطويلة.",
      },
      {
        id: "furn_q3",
        question: "What furniture did Maya use to build her study area near the window?",
        options: [
          "A desk and chair",
          "A bed and stool",
          "A wardrobe and mirror",
          "A chest of drawers",
        ],
        correctIndex: 0,
        explanation: "She set up a study desk and a cushioned chair near the window.",
        explanationArabic: "قامت بإعداد مكتب دراسة وكرسي مبطن بالقرب من النافذة.",
      },
    ],
  },

  bedding: {
    groupId: "bedding",
    groupName: "Bedding & Linen",
    themeTitle: "The Warmest Night of Winter",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Setting the Foundation",
        titleArabic: "الجزء الأول: تجهيز الأساس",
        text: "Winter arrived with chilly winds outside. Omar prepared his bedroom for the freezing night ahead. He checked the solid bed frame and made sure it rested firmly against the tall wooden headboard before setting the thick mattress in place.",
        textArabic:
          "حل فصل الشتاء مصحوبًا برياح باردة في الخارج. جهز عمر غرفة نومه لليلة الباردة المقبلة. فحص إطار السرير المتين وتأكد من استناده بإحكام على لوح رأس السرير الخشبي العالي قبل وضع المرتبة السميكة في مكانها.",
      },
      {
        partNumber: 2,
        title: "Part 2: Layering the Warm Linens",
        titleArabic: "الجزء الثاني: طبقات الأقمشة الدافئة",
        text: "Omar spread a crisp cotton sheet tightly over the mattress. To guarantee extra warmth, he added a fluffy down duvet and covered it with a thick patchwork comforter that his grandmother had stitched.",
        textArabic:
          "بسط عمر ملاءة قطنية ناصعة بإحكام فوق المرتبة. ولضمان دفء إضافي، أضاف لحافًا ناعمًا وغطاه بمفرش سميك مزخرف كانت جدته قد خاطته.",
      },
      {
        partNumber: 3,
        title: "Part 3: Pure Sleeping Comfort",
        titleArabic: "الجزء الثالث: راحة النوم التامة",
        text: "To finish making the bed, he slipped a soft pillow into a clean pillowcase and fluffed it up. He pulled a heavy wool blanket over everything and propped a decorative cushion in the corner. Omar slept soundly through the snowstorm.",
        textArabic:
          "لإنهاء ترتيب السرير، أدخل وسادة ناعمة في غطاء وسادة نظيف ونفضها. ثم سحب بطانية صوفية ثقيلة فوق كل شيء وأسند وسادة ديكور في الزاوية. نام عمر بعمق طوال العاصفة الثلجية.",
      },
    ],
    quiz: [
      {
        id: "bed_q1",
        question: "What did Omar put on top of the bed frame first?",
        options: ["A thick mattress", "A pillowcase", "A cushion", "A wool blanket"],
        correctIndex: 0,
        explanation:
          "Omar made sure the bed frame was secure and then set the thick mattress in place.",
        explanationArabic: "تأكد عمر من ثبات إطار السرير ثم وضع المرتبة السميكة في مكانها.",
      },
      {
        id: "bed_q2",
        question: "What went over the crisp cotton sheet to provide warmth?",
        options: ["A pillow", "A duvet and comforter", "A headboard", "A bed frame"],
        correctIndex: 1,
        explanation: "Omar layered a fluffy duvet and a thick comforter over the sheet.",
        explanationArabic: "وضع عمر لحافًا ناعمًا ومفرشًا سميكًا فوق الملاءة.",
      },
      {
        id: "bed_q3",
        question: "What covered the soft pillow before it was fluffed?",
        options: ["A pillowcase", "A comforter", "A mattress", "A headboard"],
        correctIndex: 0,
        explanation: "He slipped the pillow into a clean pillowcase.",
        explanationArabic: "أدخل الوسادة في غطاء وسادة نظيف.",
      },
    ],
  },

  features: {
    groupId: "features",
    groupName: "Room Features",
    themeTitle: "A Sunday in the Sunlit Room",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Morning Light",
        titleArabic: "الجزء الأول: ضوء الصباح",
        text: "Early on Sunday morning, golden sunlight illuminated the bedroom. Lina opened the heavy curtain and pulled up the wooden blinds. Bright daylight poured through the large window, warming the whole space.",
        textArabic:
          "في وقت مبكر من صباح يوم الأحد، أضاءت أشعة الشمس الذهبية غرفة النوم. فتحت لينا الستارة الثقيلة ورفعت الستائر الخشبية. تدفق ضوء النهار الساطع من خلال النافذة الكبيرة، مما جعل الغرفة دافئة.",
      },
      {
        partNumber: 2,
        title: "Part 2: Stepping Across the Floor",
        titleArabic: "الجزء الثاني: الخطو عبر الأرضية",
        text: "She walked through the bedroom door and stepped onto the soft decorative rug resting in the center of the room. Beneath it, the plush wall-to-wall carpet felt cozy and gentle on her bare feet.",
        textArabic:
          "عبرت من باب غرفة النوم وخطت على السجادة المزخرفة الناعمة الموضوعة في منتصف الغرفة. وتحتها، كانت الموكيت الوثير يمنح قدميها الحافيتين شعورًا بالدفء والراحة.",
      },
      {
        partNumber: 3,
        title: "Part 3: Lighting and Power",
        titleArabic: "الجزء الثالث: الإضاءة والطاقة",
        text: "As evening approached and shadows lengthened, Lina reached for the light switch on the wall to illuminate the ceiling light. She plugged her phone charger into the wall outlet and turned on the bedside lamp for reading.",
        textArabic:
          "مع اقتراب المساء وازدياد الظلال، مدت لينا يدها إلى مفتاح الإضاءة على الحائط لتشغيل ضوء السقف. ووصلت شاحن هاتفها بمقبس الحائط وشغلت مصباح السرير للقراءة.",
      },
    ],
    quiz: [
      {
        id: "feat_q1",
        question: "How did Lina let the morning sunlight enter her room?",
        options: [
          "By closing the door",
          "By opening the curtain and raising the blinds",
          "By plugging in the lamp",
          "By turning on the ceiling light",
        ],
        correctIndex: 1,
        explanation:
          "She opened the curtain and raised the blinds so daylight came through the window.",
        explanationArabic: "فتحت الستارة ورفعت الستائر الخشبية ليدخل ضوء النهار من النافذة.",
      },
      {
        id: "feat_q2",
        question: "What did Lina use to turn on the ceiling light at night?",
        options: ["The wall outlet", "The light switch", "The window", "The rug"],
        correctIndex: 1,
        explanation: "Lina pressed the light switch on the wall to turn on the ceiling light.",
        explanationArabic: "ضغطت لينا على مفتاح الإضاءة في الحائط لتشغيل ضوء السقف.",
      },
      {
        id: "feat_q3",
        question: "Where did Lina plug in her phone charger?",
        options: ["Into the wall outlet", "Under the carpet", "Behind the door", "Onto the blinds"],
        correctIndex: 0,
        explanation: "She plugged her charger into the electrical outlet.",
        explanationArabic: "وصلت شاحن هاتفها بمقبس الكهرباء في الحائط.",
      },
    ],
  },

  objects: {
    groupId: "objects",
    groupName: "Bedroom Objects",
    themeTitle: "The Morning Routine",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The Wake-Up Call",
        titleArabic: "الجزء الأول: نداء الاستيقاظ",
        text: "At precisely 7:00 AM, the digital alarm clock started beeping on the bedside table. Sam reached over and turned off the alarm clock. Beside it sat a framed picture frame showing his family vacation and a classic round clock on the wall.",
        textArabic:
          "في تمام الساعة السابعة صباحًا، بدأ منبه الساعة الرقمي يصدر رنينًا على طاولة السرير. مد سام يده وأوقف المنبه. وبجانبه كان هناك إطار صورة مؤطر يظهر عطلة عائلته وساعة كلاسيكية دائرية على الحائط.",
      },
      {
        partNumber: 2,
        title: "Part 2: Morning Touches",
        titleArabic: "الجزء الثاني: لمسات الصباح",
        text: "Fresh daylight revealed a green leafy plant sitting inside a ceramic vase filled with water. Next to it, an aromatic scented candle sat beside the monthly wall calendar where today's meetings were marked.",
        textArabic:
          "كشف ضوء النهار الجديد عن نبتة خضراء مورقة داخل مزهرية خزفية مملوءة بالماء. وبجانبها، جلبت شمعة معطرة موضوعة بجوار تقويم الحائط الشهري حيث تم تحديد مواعيد اجتماعات اليوم.",
      },
      {
        partNumber: 3,
        title: "Part 3: Tidy and Ready",
        titleArabic: "الجزء الثالث: الترتيب والاستعداد",
        text: "Sam pulled a soft tissue from the decorative tissue box, dried his face, and tossed it into the wastebasket. He took his clean ironed shirt off a wooden hanger and felt energized for the productive day ahead.",
        textArabic:
          "سحب سام منديلاً ناعماً من علبة المناديل الورقية، ومسح وجهه، وألقاه في سلة المهملات. ثم أخذ قميصه النظيف المكوي من على شماعة خشبية وشعر بالحيوية ليوم مليء بالإنتاجية.",
      },
    ],
    quiz: [
      {
        id: "obj_q1",
        question: "What woke Sam up at 7:00 AM?",
        options: ["The plant", "The alarm clock", "The candle", "The tissue box"],
        correctIndex: 1,
        explanation: "The digital alarm clock beeped to wake Sam up.",
        explanationArabic: "أصدر المنبه الرقمي صوت رنين لإيقاظ سام.",
      },
      {
        id: "obj_q2",
        question: "Where was the green plant standing?",
        options: ["Inside a ceramic vase", "In the wastebasket", "On a hanger", "Under the clock"],
        correctIndex: 0,
        explanation: "The plant stood inside a ceramic vase with water.",
        explanationArabic: "كانت النبتة موضوعة داخل مزهرية خزفية بالماء.",
      },
      {
        id: "obj_q3",
        question: "Where did Sam put his ironed shirt before wearing it?",
        options: [
          "In the wastebasket",
          "On a wooden hanger",
          "Inside the tissue box",
          "Behind the picture frame",
        ],
        correctIndex: 1,
        explanation: "Sam kept his ironed shirt hanging on a wooden hanger.",
        explanationArabic: "علق سام قميصه المكوي على شماعة ملابس خشبية.",
      },
    ],
  },

  personal: {
    groupId: "personal",
    groupName: "Personal Items",
    themeTitle: "Nora's Bedtime Routine",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Evening Comfort",
        titleArabic: "الجزء الأول: راحة المساء",
        text: "After finishing her homework, Nora prepared for a relaxing night. She changed into her warm flannel pajamas, slipped her feet into fuzzy slippers, and wrapped a cozy robe around herself.",
        textArabic:
          "بعد الانتهاء من واجباتها المدرسية، استعدت نورا لقضاء ليلة هادئة ومريحة. ارتدت بيجامتها الفانيلا الدافئة، وأدخلت قدميها في خف مريح (شبشب)، ولفّت حول نفسها روبًا مريحًا.",
      },
      {
        partNumber: 2,
        title: "Part 2: Treasured Memories",
        titleArabic: "الجزء الثاني: ذكريات عزيزة",
        text: "Her childhood teddy bear sat comfortably on her pillow beneath a large music poster on the wall. Nora took a couple of adventure books from her shelf, opened a vintage photo album, and smiled as she recalled fond memories.",
        textArabic:
          "كان دبها المحشو (دبدوب) يجلس براحة على وسادتها أسفل ملصق موسيقي كبير على الحائط. أخذت نورا كتابين من كتب المغامرات من رفها، وفتحت ألبوم صور كلاسيكي وابتسمت وهي تستعيد الذكريات الجميلة.",
      },
      {
        partNumber: 3,
        title: "Part 3: Settling Down for Sleep",
        titleArabic: "الجزء الثالث: الاستعداد للنوم",
        text: "Nora carefully took off her reading glasses and set them on the bedside table. She packed her school backpack for tomorrow, placed her gold chain necklace into her velvet jewelry box, and drifted off into sweet dreams.",
        textArabic:
          "خلعت نورا نظارتها للقراءة بحذر ووضعتها على طاولة السرير. ثم حزمت حقيبة ظهرها المدرسية للغد، ووضعت قلادتها الذهبية داخل صندوق المجوهرات المخملي، وغرقت في أحلام سعيدة.",
      },
    ],
    quiz: [
      {
        id: "pers_q1",
        question: "What three comfortable garments did Nora wear for bedtime?",
        options: [
          "Pajamas, slippers, and a robe",
          "Backpack, glasses, and books",
          "Poster, photo album, and jewelry box",
          "Teddy bear, shirt, and shoes",
        ],
        correctIndex: 0,
        explanation:
          "Nora changed into pajamas, fuzzy slippers, and wrapped a robe around herself.",
        explanationArabic: "ارتدت نورا البيجامة والخف المنزلي (الشبشب) والروب.",
      },
      {
        id: "pers_q2",
        question: "What sat below the poster on Nora's bed?",
        options: [
          "Her backpack",
          "Her childhood teddy bear",
          "Her jewelry box",
          "Her school books",
        ],
        correctIndex: 1,
        explanation: "Her teddy bear sat on her pillow below the poster.",
        explanationArabic: "كان دميتها المحشوة (الدبدوب) يجلس على وسادتها أسفل الملصق.",
      },
      {
        id: "pers_q3",
        question: "Where did Nora store her necklace before sleeping?",
        options: [
          "In her backpack",
          "In the velvet jewelry box",
          "Under her slippers",
          "Between her books",
        ],
        correctIndex: 1,
        explanation: "Nora placed her necklace safely inside her jewelry box.",
        explanationArabic: "وضعت نورا قلادتها بأمان داخل صندوق المجوهرات.",
      },
    ],
  },

  electronics: {
    groupId: "electronics",
    groupName: "Electronics",
    themeTitle: "The Evening Study Session",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Powering Up",
        titleArabic: "الجزء الأول: تشغيل الأجهزة",
        text: "Ali sat down at his workspace to start his evening project. He plugged his phone into the rapid charger next to his open laptop and powered on the system to check his course materials.",
        textArabic:
          "جلس علي عند مساحة عمله لبدء مشروعه المسائي. وصل هاتفه بالشاحن السريع بجوار حاسوبه المحمول المفتوح وشغل النظام لمراجعة المواد الدراسية.",
      },
      {
        partNumber: 2,
        title: "Part 2: Focus and Audio",
        titleArabic: "الجزء الثاني: التركيز والصوت",
        text: "To concentrate deeply, Ali put on his noise-cancelling headphones and loaded an interactive tutorial on his tablet. Ambient study music streamed smoothly through the wireless speaker in the room.",
        textArabic:
          "للتركيز بعمق، ارتدى علي سماعات الرأس العازلة للضوضاء وفتح درساً تفاعلياً على جهازه اللوحي (التابلت). وتدفقت موسيقى دراسية هادئة عبر مكبر الصوت اللاسلكي في الغرفة.",
      },
      {
        partNumber: 3,
        title: "Part 3: Perfect Lighting",
        titleArabic: "الجزء الثالث: الإضاءة المثالية",
        text: "As darkness fell outside, Ali adjusted his flexible reading light to illuminate his notebook. He used the infrared remote control to lower the background music volume before submitting his final assignment.",
        textArabic:
          "مع حلول الظلام في الخارج، عدل علي مصباح القراءة المرن لإضاءة دفتره. واستخدم جهاز التحكم عن بعد (الريموت) لخفض مستوى صوت الموسيقى قبل تسليم واجبه النهائي.",
      },
    ],
    quiz: [
      {
        id: "elec_q1",
        question: "What did Ali plug in next to his laptop?",
        options: [
          "His phone into the charger",
          "The wireless speaker",
          "The reading light",
          "The remote control",
        ],
        correctIndex: 0,
        explanation: "Ali plugged his phone into the charger beside his laptop.",
        explanationArabic: "وصل علي هاتفه بالشاحن بجانب حاسوبه المحمول.",
      },
      {
        id: "elec_q2",
        question: "What device did Ali use with his headphones to follow tutorials?",
        options: ["His tablet", "His clock", "His alarm", "His backpack"],
        correctIndex: 0,
        explanation: "Ali wore headphones while following tutorials on his tablet.",
        explanationArabic: "ارتدى علي سماعات الرأس أثناء متابعة الدروس على جهازه اللوحي.",
      },
      {
        id: "elec_q3",
        question: "How did Ali lower the background speaker volume?",
        options: [
          "With the remote control",
          "By unplugging the charger",
          "By turning off the laptop",
          "With the reading light",
        ],
        correctIndex: 0,
        explanation: "He used the remote control to adjust the speaker volume.",
        explanationArabic: "استخدم جهاز التحكم عن بعد لضبط مستوى صوت مكبر الصوت.",
      },
    ],
  },
};

export function getOrGenerateStoryBundle(
  groupId: string,
  groupName: string,
  words: { id: string; label: string; topic?: string }[]
): GroupStoryBundle {
  if (STORY_TALES_DICTIONARY[groupId]) {
    return STORY_TALES_DICTIONARY[groupId];
  }

  const labels = words.map((w) => w.label);
  const w1 = labels[0] || "item";
  const w2 = labels[1] || "object";
  const w3 = labels[2] || "tool";
  const w4 = labels[3] || "item";
  const w5 = labels[4] || "feature";

  return {
    groupId,
    groupName,
    themeTitle: "The Story of " + groupName,
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Discovering the Scene",
        titleArabic: "الجزء الأول: استكشاف المشهد",
        text:
          "Alex arrived at the " +
          groupName.toLowerCase() +
          " area early in the morning. Looking around carefully, the first thing that caught attention was the clean " +
          w1.toLowerCase() +
          ", placed conveniently next to the " +
          w2.toLowerCase() +
          ".",
        textArabic:
          "وصل أليكس إلى منطقة " +
          groupName +
          " في وقت مبكر من الصباح. وبالنظر حوله بعناية، كان أول ما لفت انتباهه هو " +
          w1 +
          " النظيف، الموضوع بجوار " +
          w2 +
          ".",
      },
      {
        partNumber: 2,
        title: "Part 2: Getting into Action",
        titleArabic: "الجزء الثاني: بدء العمل والنشاط",
        text:
          "It was time to get everything prepared. Alex carefully used the " +
          w3.toLowerCase() +
          " to inspect the area and made sure the " +
          w4.toLowerCase() +
          " was set up properly for everyone to use.",
        textArabic:
          "حان الوقت لتجهيز كل شيء. استخدم أليكس " +
          w3 +
          " بعناية لفحص المكان وتأكد من تجهيز " +
          w4 +
          " بالشكل المناسب ليستخدمه الجميع.",
      },
      {
        partNumber: 3,
        title: "Part 3: A Successful Day",
        titleArabic: "الجزء الثالث: يوم ناجح ومكتمل",
        text:
          "By the end of the day, all tasks were completed smoothly. Checking the " +
          w5.toLowerCase() +
          " one last time, Alex smiled knowing that the " +
          groupName.toLowerCase() +
          " was in perfect shape.",
        textArabic:
          "بحلول نهاية اليوم، اكتملت جميع المهام بسلاسة. وبالتحقق من " +
          w5 +
          " للمرة الأخيرة، ابتسم أليكس وهو يعلم أن كل شيء في " +
          groupName +
          " بأفضل حال.",
      },
    ],
    quiz: [
      {
        id: groupId + "_q1",
        question: "What was placed conveniently next to the " + w1.toLowerCase() + " in Part 1?",
        options: ["The " + w2.toLowerCase(), "A broken box", "A noisy truck", "Nothing at all"],
        correctIndex: 0,
        explanation:
          "In Part 1, the " +
          w1.toLowerCase() +
          " was placed right next to the " +
          w2.toLowerCase() +
          ".",
        explanationArabic: "في الجزء الأول، كان " + w1 + " موضوعًا بجوار " + w2 + ".",
      },
      {
        id: groupId + "_q2",
        question: "Which tool or item did Alex use to inspect the area in Part 2?",
        options: ["The " + w3.toLowerCase(), "An old map", "A telescope", "A whistle"],
        correctIndex: 0,
        explanation: "Alex used the " + w3.toLowerCase() + " to inspect and organize the area.",
        explanationArabic: "استخدم أليكس " + w3 + " لتنظيم وفحص المكان.",
      },
      {
        id: groupId + "_q3",
        question: "What was checked one last time before finishing in Part 3?",
        options: ["The " + w5.toLowerCase(), "The car keys", "The front gate", "The watch"],
        correctIndex: 0,
        explanation: "Alex checked the " + w5.toLowerCase() + " before concluding the day.",
        explanationArabic: "قام أليكس بفحص " + w5 + " قبل إنهاء اليوم.",
      },
    ],
  };
}
