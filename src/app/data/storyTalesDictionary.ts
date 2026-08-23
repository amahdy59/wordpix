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
  "plumbing-fixtures": {
    groupId: "plumbing-fixtures",
    groupName: "Plumbing Fixtures",
    themeTitle: "The Morning Routine",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Waking Up",
        titleArabic: "الجزء الأول: الاستيقاظ",
        text: "The sun rises and warms the bathroom tiles. Mark steps in and turns on the sink to wash his face. He admires the new shiny faucet.",
        textArabic:
          "تشرق الشمس وتدفئ بلاط الحمام. يدخل مارك ويشغل الحوض لغسل وجهه. يعجبه الصنبور اللامع الجديد.",
      },
      {
        partNumber: 2,
        title: "Part 2: A Warm Shower",
        titleArabic: "الجزء الثاني: دش دافئ",
        text: "He steps into the shower and adjusts the showerhead. The warm water flows down the drain, relaxing his muscles.",
        textArabic:
          "يخطو إلى الدش ويضبط رأس الدش. يتدفق الماء الدافئ عبر البالوعة، مما يريح عضلاته.",
      },
      {
        partNumber: 3,
        title: "Part 3: A Clean Start",
        titleArabic: "الجزء الثالث: بداية نظيفة",
        text: "After drying off, he flushes the toilet and considers drawing a bath in the bathtub later tonight to unwind.",
        textArabic:
          "بعد أن يجفف نفسه، يطرد الماء في المرحاض ويفكر في ملء حوض الاستحمام الليلة للاسترخاء.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What did Mark turn on to wash his face?",
        options: ["The toilet", "The sink", "The bathtub", "The bidet"],
        correctIndex: 1,
        explanation: "He turned on the sink to wash his face.",
        explanationArabic: "قام بتشغيل الحوض لغسل وجهه.",
      },
      {
        id: "q2",
        question: "Where does the warm water flow?",
        options: ["Down the drain", "Into the mirror", "Out the window", "Onto the ceiling"],
        correctIndex: 0,
        explanation: "The water flows down the drain.",
        explanationArabic: "يتدفق الماء إلى أسفل في البالوعة.",
      },
      {
        id: "q3",
        question: "What is Mark considering doing later tonight?",
        options: [
          "Fixing the faucet",
          "Cleaning the drain",
          "Drawing a bath in the bathtub",
          "Changing the showerhead",
        ],
        correctIndex: 2,
        explanation: "He considers drawing a bath in the bathtub to unwind.",
        explanationArabic: "إنه يفكر في ملء حوض الاستحمام للاسترخاء.",
      },
    ],
  },
  "daily-toiletries": {
    groupId: "daily-toiletries",
    groupName: "Daily Toiletries",
    themeTitle: "Getting Ready for the Day",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Hair Care",
        titleArabic: "الجزء الأول: العناية بالشعر",
        text: "Sarah grabs her favorite shampoo and lathers her hair. Then, she applies conditioner to make it soft and smooth.",
        textArabic:
          "تمسك سارة بالشامبو المفضل لديها وترغي شعرها. ثم تضع بلسماً لجعله ناعماً وأملساً.",
      },
      {
        partNumber: 2,
        title: "Part 2: Dental Hygiene",
        titleArabic: "الجزء الثاني: نظافة الأسنان",
        text: "She squeezes minty toothpaste onto her toothbrush and brushes thoroughly. Finally, she rinses with mouthwash.",
        textArabic:
          "تضغط معجون أسنان بنكهة النعناع على فرشاة أسنانها وتنظفها جيداً. أخيراً، تتمضمض بغسول الفم.",
      },
      {
        partNumber: 3,
        title: "Part 3: Fresh and Ready",
        titleArabic: "الجزء الثالث: منتعشة ومستعدة",
        text: "Before leaving, she uses a bar of soap to wash her hands, applies lotion to her skin, and puts on some deodorant.",
        textArabic:
          "قبل المغادرة، تستخدم قطعة صابون لغسل يديها، وتضع لوشن على بشرتها، وتضع بعض مزيل العرق.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does Sarah use to make her hair soft?",
        options: ["Soap", "Conditioner", "Toothpaste", "Mouthwash"],
        correctIndex: 1,
        explanation: "She applies conditioner to make it soft and smooth.",
        explanationArabic: "تضع بلسماً لجعله ناعماً وأملساً.",
      },
      {
        id: "q2",
        question: "What does she squeeze onto her toothbrush?",
        options: ["Lotion", "Shampoo", "Deodorant", "Toothpaste"],
        correctIndex: 3,
        explanation: "She squeezes minty toothpaste onto her toothbrush.",
        explanationArabic: "تضغط معجون أسنان بنكهة النعناع على فرشاة أسنانها.",
      },
      {
        id: "q3",
        question: "How does Sarah finish her dental hygiene routine?",
        options: [
          "By applying lotion",
          "By using a bar of soap",
          "By rinsing with mouthwash",
          "By using deodorant",
        ],
        correctIndex: 2,
        explanation: "Finally, she rinses with mouthwash.",
        explanationArabic: "أخيراً، تتمضمض بغسول الفم.",
      },
    ],
  },
  "bathroom-linens": {
    groupId: "bathroom-linens",
    groupName: "Linens & Textiles",
    themeTitle: "Warm and Dry",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Stepping Out",
        titleArabic: "الجزء الأول: الخروج",
        text: "After a long shower, John pulls back the shower-curtain. He steps onto the soft, absorbent bath-mat to avoid slipping.",
        textArabic:
          "بعد دش طويل، يسحب جون ستارة الدش. يخطو على سجادة حمام ناعمة وماصة لتجنب الانزلاق.",
      },
      {
        partNumber: 2,
        title: "Part 2: Drying Off",
        titleArabic: "الجزء الثاني: التجفيف",
        text: "He grabs a large bath-towel from the rack to dry his body. Then, he uses a smaller hand-towel for his face.",
        textArabic: "يلتقط منشفة استحمام كبيرة من الرف لتجفيف جسده. ثم يستخدم منشفة يد أصغر لوجهه.",
      },
      {
        partNumber: 3,
        title: "Part 3: Cozy Comfort",
        titleArabic: "الجزء الثالث: راحة دافئة",
        text: "Feeling clean, he hangs up the washcloth he used. Finally, he wraps himself in a warm, fluffy bathrobe.",
        textArabic:
          "شاعراً بالنظافة، يعلق منشفة الوجه التي استخدمها. وأخيراً، يلف نفسه بروب استحمام دافئ ومنفوش.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does John pull back to step out of the shower?",
        options: ["The hand-towel", "The bathrobe", "The shower-curtain", "The bath-mat"],
        correctIndex: 2,
        explanation: "He pulls back the shower-curtain.",
        explanationArabic: "يسحب ستارة الدش.",
      },
      {
        id: "q2",
        question: "What does he step onto to avoid slipping?",
        options: ["The bath-towel", "The bath-mat", "The washcloth", "The hand-towel"],
        correctIndex: 1,
        explanation: "He steps onto the soft bath-mat.",
        explanationArabic: "يخطو على سجادة الحمام الناعمة.",
      },
      {
        id: "q3",
        question: "What does John wrap himself in at the end?",
        options: ["A bath-towel", "A hand-towel", "A washcloth", "A bathrobe"],
        correctIndex: 3,
        explanation: "He wraps himself in a warm, fluffy bathrobe.",
        explanationArabic: "يلف نفسه بروب استحمام دافئ ومنفوش.",
      },
    ],
  },
  "grooming-tools": {
    groupId: "grooming-tools",
    groupName: "Grooming Tools",
    themeTitle: "Looking Sharp",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: A Quick Check",
        titleArabic: "الجزء الأول: فحص سريع",
        text: "Emma looks into the bathroom mirror to start her grooming routine. She uses tweezers to perfectly shape her eyebrows.",
        textArabic:
          "تنظر إيما في مرآة الحمام لتبدأ روتين العناية الخاص بها. تستخدم ملقطاً لتشكيل حاجبيها بشكل مثالي.",
      },
      {
        partNumber: 2,
        title: "Part 2: Styling Hair",
        titleArabic: "الجزء الثاني: تصفيف الشعر",
        text: "She grabs her hairbrush and comb to detangle her hair. Then, she turns on the hairdryer to style it.",
        textArabic: "تمسك بفرشاة شعرها ومشطها لفك تشابك شعرها. ثم تقوم بتشغيل مجفف الشعر لتصفيفه.",
      },
      {
        partNumber: 3,
        title: "Part 3: Final Touches",
        titleArabic: "الجزء الثالث: اللمسات الأخيرة",
        text: "Finally, she uses nail-clippers to trim her nails and a cotton-swab to fix a tiny smudge of makeup.",
        textArabic:
          "أخيراً، تستخدم قصافة أظافر لتقليم أظافرها وعود قطن لإصلاح تلطخ صغير في المكياج.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does Emma look into to start her routine?",
        options: ["A hairdryer", "The mirror", "A razor", "A hairbrush"],
        correctIndex: 1,
        explanation: "She looks into the bathroom mirror.",
        explanationArabic: "تنظر في مرآة الحمام.",
      },
      {
        id: "q2",
        question: "What does she use to shape her eyebrows?",
        options: ["Nail-clippers", "A comb", "Tweezers", "A cotton-swab"],
        correctIndex: 2,
        explanation: "She uses tweezers to shape her eyebrows.",
        explanationArabic: "تستخدم ملقطاً لتشكيل حاجبيها.",
      },
      {
        id: "q3",
        question: "What does she use to detangle her hair?",
        options: ["A hairbrush and comb", "A razor and tweezers", "Nail-clippers", "A hairdryer"],
        correctIndex: 0,
        explanation: "She grabs her hairbrush and comb to detangle her hair.",
        explanationArabic: "تمسك بفرشاة شعرها ومشطها لفك تشابك شعرها.",
      },
    ],
  },
  "bathroom-utilities": {
    groupId: "bathroom-utilities",
    groupName: "Bathroom Utilities",
    themeTitle: "Cleaning Up",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Tidy Space",
        titleArabic: "الجزء الأول: مساحة مرتبة",
        text: "Liam checks the bathroom supplies. He makes sure there is enough toilet-paper on the holder and empties the trash-can.",
        textArabic:
          "يتحقق ليام من مستلزمات الحمام. يتأكد من وجود ما يكفي من ورق التواليت في الحامل ويفرغ سلة المهملات.",
      },
      {
        partNumber: 2,
        title: "Part 2: Deep Cleaning",
        titleArabic: "الجزء الثاني: تنظيف عميق",
        text: "He uses a toilet-brush to scrub the bowl. Then, he grabs a sponge to wipe down the tiles and sink.",
        textArabic: "يستخدم فرشاة مرحاض لفرك الحوض. ثم يمسك إسفنجة لمسح البلاط والحوض.",
      },
      {
        partNumber: 3,
        title: "Part 3: Finishing Chores",
        titleArabic: "الجزء الثالث: إنهاء المهام",
        text: "He keeps a plunger nearby just in case of clogs. Finally, he steps on the scale and puts his clothes in the laundry-basket.",
        textArabic:
          "يحتفظ بمكبس قريباً في حالة حدوث انسداد. أخيراً، يخطو على الميزان ويضع ملابسه في سلة الغسيل.",
      },
    ],
    quiz: [
      {
        id: "q1",
        question: "What does Liam make sure there is enough of?",
        options: ["Toilet-paper", "Sponges", "Trash-cans", "Loofahs"],
        correctIndex: 0,
        explanation: "He makes sure there is enough toilet-paper on the holder.",
        explanationArabic: "يتأكد من وجود ما يكفي من ورق التواليت في الحامل.",
      },
      {
        id: "q2",
        question: "What does he use to wipe down the tiles?",
        options: ["A plunger", "A toilet-brush", "A sponge", "A scale"],
        correctIndex: 2,
        explanation: "He grabs a sponge to wipe down the tiles.",
        explanationArabic: "يمسك إسفنجة لمسح البلاط.",
      },
      {
        id: "q3",
        question: "Where does Liam put his clothes?",
        options: ["In the trash-can", "In the laundry-basket", "On the scale", "On the plunger"],
        correctIndex: 1,
        explanation: "He puts his clothes in the laundry-basket.",
        explanationArabic: "يضع ملابسه في سلة الغسيل.",
      },
    ],
  },

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
  // ── THE GARDEN ───────────────────────────────────────────────────────────
  flowers: {
    groupId: "flowers",
    groupName: "Flowers",
    themeTitle: "The Secret Botanical Garden",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The Morning Bloom",
        titleArabic: "الجزء الأول: تفتح الصباح",
        text: "Early at sunrise, Maya and Grandma Leila walked into the courtyard. The morning dew glistened on a velvet crimson rose standing proudly in the garden bed. Beside it, an early pink tulip opened its delicate cup, while a giant golden sunflower turned its bright head toward the rising sun.",
        textArabic:
          "في وقت مبكر عند شروق الشمس، دخلت مايا والجدة ليلى إلى الفناء. تبللت قطرات الندى على وردة قرمزية مخملية تقف بشموخ في حوض الحديقة. وبجانبها، فتحت زهرة توليب وردية مبكرة كأسها الرقيق، بينما أدارت زهرة عباد شمس ذهبية عملاقة رأسها المشرق نحو الشمس المشرقة.",
      },
      {
        partNumber: 2,
        title: "Part 2: Rare Blossoms in the Shade",
        titleArabic: "الجزء الثاني: أزهار نادرة في الظل",
        text: "Maya knelt along the stone border to inspect a cheerful white daisy with a bright yellow center. Nearby, a graceful trumpet-shaped lily released its sweet scent. Under the cool hedge, clusters of sweet purple violets and early yellow daffodils bloomed together in harmony.",
        textArabic:
          "ركعت مايا على طول الحافة الحجرية لفحص زهرة أُقحوان بيضاء مبتهجة ذات مركز أصفر لامع. وبالقرب منها، أطلقت زهرة زنبق أنيقة بوقية الشكل عطرها الزكي. وتحت السِّياج الظليل، تفتحت مجموعات من البنفسج الأرجواني والنرجس الأصفر المبكر معًا في تناغم.",
      },
      {
        partNumber: 3,
        title: "Part 3: The Calming Aroma",
        titleArabic: "الجزء الثالث: العبير المهدئ",
        text: "In the warm glass alcove, Grandma Leila pointed out an exotic purple orchid with symmetrical petals. They snipped a ruffled pink carnation for the breakfast vase and harvested fresh lavender spikes that filled their baskets with a wonderfully calming aroma.",
        textArabic:
          "في الرواق الزجاجي الدافئ، أشارت الجدة ليلى إلى زهرة أوركيد أرجوانية نادرة ذات بتلات متناسقة. قطفتا زهرة قرنفل وردية مموجة لمزهرية الإفطار وجمعتا سنابل الخزامى (اللافندر) الطازجة التي ملأت سلتهما بعبير مهدئ رائع.",
      },
    ],
    quiz: [
      {
        id: "flow_q1",
        question:
          "Which flower is famous for having a large golden blossom that turns to face the sun throughout the day?",
        options: ["Sunflower", "Violet", "Daisy", "Carnation"],
        correctIndex: 0,
        explanation:
          "The sunflower is known for heliotropism, turning its giant golden bloom toward the sunlight.",
        explanationArabic:
          "تتميز زهرة عباد الشمس بتتبع ضوء الشمس طوال النهار بقرصها الذهبي الكبير.",
      },
      {
        id: "flow_q2",
        question:
          "What fragrant plant with purple flower spikes is harvested for its soothing and calming scent?",
        options: ["Lavender", "Tulip", "Daffodil", "Lily"],
        correctIndex: 0,
        explanation:
          "Lavender is an aromatic botanical celebrated for its calming herbal fragrance.",
        explanationArabic: "الخزامى (اللافندر) نبات عطري مشهور برائحته المهدئة المريحة للأعصاب.",
      },
      {
        id: "flow_q3",
        question: "Why did Maya and Grandma Leila walk into the garden at early sunrise?",
        options: [
          "To discover and admire the freshly blooming flowers in the morning dew",
          "To repair a broken wooden gate",
          "To paint the stone garden path",
          "To find shelter from a heavy rainstorm",
        ],
        correctIndex: 0,
        explanation:
          "Maya and Grandma Leila went out at sunrise to enjoy the beauty of the newly opened morning blossoms.",
        explanationArabic:
          "خرجت مايا والجدة ليلى عند الشروق للاستمتاع بجمال الأزهار المتفتحة بندى الصباح.",
      },
    ],
  },

  "trees-shrubs": {
    groupId: "trees-shrubs",
    groupName: "Trees & Shrubs",
    themeTitle: "The Whispering Grove",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The Woodland Giants",
        titleArabic: "الجزء الأول: عمالقة الغابة",
        text: "Omar stepped into the shaded nature sanctuary on a warm afternoon. He marveled at a majestic three-hundred-year-old oak tree with massive spreading boughs. Nearby, the crisp, resinous scent of an evergreen pine tree drifted through the woodland breeze.",
        textArabic:
          "دخل عمر إلى المحمية الطبيعية الظليلة في فترة ما بعد الظهر الدافئة. تعجب من شجرة بلوط مهيبة يبلغ عمرها ثلاثمائة عام ذات أغصان ضخمة ممتدة. وبالقرب منها، فاحت رائحة شجرة الصنوبر الدائمة الخضرة الزكية عبر نسيم الغابة.",
      },
      {
        partNumber: 2,
        title: "Part 2: Orchard & Exotic Trees",
        titleArabic: "الجزء الثاني: أشجار البستان والأشجار الاستوائية",
        text: "Walking toward the sunny orchard, Omar noticed a domestic apple tree laden with crisp fruit and a flowering cherry tree dropping soft pink petals. Near the sunlit wall stood an exotic palm tree with long, arching fronds.",
        textArabic:
          "أثناء سيره نحو البستان المشمس، لاحظ عمر شجرة تفاح مثقلة بالثمار المقرمشة وشجرة كرز مزهرة تتساقط منها بتلات وردية ناعمة. وبالقرب من الجدار المشمس، وقفت نخلة استوائية ذات سعف طويل مقوس.",
      },
      {
        partNumber: 3,
        title: "Part 3: Green Boundaries & Ground Cover",
        titleArabic: "الجزء الثالث: الحدود الخضراء والغطاء الأرضي",
        text: "A neatly trimmed boxwood hedge created a clean boundary along the path, while a flowering berry bush provided nesting shelter for birds. Clinging green ivy climbed the brick wall, a wild vine twined around the gate, and a delicate feathery fern thrived in the cool shade.",
        textArabic:
          "شكّل سياج نباتي مقلم بعناية حدًا نظيفًا على طول الممر، بينما وفرت شجيرة التوت المزهرة مأوى لتعشيش الطيور. تسلق اللبلاب الأخضر الجدار الآجوري، والتفت عريشة برية حول البوابة، ونما سرخس رقيق في الظل الرطب.",
      },
    ],
    quiz: [
      {
        id: "trees_q1",
        question:
          "Which tree is an evergreen conifer with needle-shaped foliage and woody pinecones?",
        options: ["Pine tree", "Oak tree", "Cherry tree", "Apple tree"],
        correctIndex: 0,
        explanation:
          "The pine tree is a conifer that retains its needle-like leaves throughout the entire year.",
        explanationArabic:
          "شجرة الصنوبر هي شجرة مخروطية دائمة الخضرة تحتفظ بإبرها الخضراء طوال العام.",
      },
      {
        id: "trees_q2",
        question:
          "What is a dense, continuous row of closely planted shrubs used to mark a garden boundary?",
        options: ["A hedge", "A vine", "A fern", "A palm tree"],
        correctIndex: 0,
        explanation: "A hedge is a closely grown barrier of bushes used to enclose or divide land.",
        explanationArabic:
          "السياج النباتي هو صف كثيف من الشجيرات المزروعة متقاربة لتحديد حدود الحديقة.",
      },
      {
        id: "trees_q3",
        question: "What was Omar admiring as he walked along the sanctuary path in the story?",
        options: [
          "The diverse canopy of old trees, trimmed boundary hedges, climbing ivy, and shaded ferns",
          "A brand new sports car",
          "A modern shopping mall",
          "A large indoor swimming pool",
        ],
        correctIndex: 0,
        explanation:
          "Omar explored the natural grove and admired the rich variety of trees, hedges, and climbing greenery.",
        explanationArabic:
          "استكشف عمر البستان وأعجب بتنوع الأشجار العتيقة والأسوار النباتية واللبلاب والسرخس.",
      },
    ],
  },

  "garden-tools": {
    groupId: "garden-tools",
    groupName: "Garden Tools",
    themeTitle: "The Spring Planting Expedition",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Digging & Ground Preparation",
        titleArabic: "الجزء الأول: الحفر وتجهيز الأرض",
        text: "On Saturday morning, Zain and Maya geared up to prepare the vegetable patch. Zain drove a heavy steel shovel into the packed earth to turn the soil, while Maya used a flat-edged spade to carve clean borders and a wide rake to level the garden bed.",
        textArabic:
          "صباح يوم السبت، استعد زين ومايا لتجهيز قطعة زراعة الخضار. غرس زين مجرفة فولاذية ثقيلة في الأرض لتقليب التربة، بينما استخدمت مايا مجرفة تسوية مسطحة لتحديد الحواف ومجرفة أسنان عريضة لتسوية الحوض.",
      },
      {
        partNumber: 2,
        title: "Part 2: Transport & Irrigation",
        titleArabic: "الجزء الثاني: النقل والري",
        text: "They wheeled several loads of rich compost in a sturdy wheelbarrow. Maya filled a galvanized watering can for the potted herbs, uncoiled the long rubber hose, and connected a rotating sprinkler that cast cool mist across the lawn.",
        textArabic:
          "نقلا عدة أحمال من السماد العضوي الغني في عربة يد متينة. ملأت مايا رشاش مياه معدني لري الأعشاب في الأصائص، وفردت خرطوم المياه المطاطي الطويل، ووصلت مرشة مياه دوارة نشرت رذاذاً منعشاً على العشب.",
      },
      {
        partNumber: 3,
        title: "Part 3: Pruning & Finishing Touches",
        titleArabic: "الجزء الثالث: التقليم واللمسات النهائية",
        text: "Wearing thick leather garden gloves to protect her hands, Maya used a pointed trowel to plant tomato seedlings and a sharp spring-loaded pruner to snip dead rose twigs. Zain used a four-tined pitchfork to spread straw mulch and finished by pushing the lawn mower to trim the grass.",
        textArabic:
          "مرتدية قفازات حديقة جلدية سميكة لحماية يديها، استخدمت مايا مجرفة شتل يدوية لغرس شتلات الطماطم ومقص تقليم حاد لقص الأغصان الذابلة. واستخدم زين مذراة لنثر القش، ثم دفع جزازة العشب لتهذيب الحديقة.",
      },
    ],
    quiz: [
      {
        id: "tools_q1",
        question:
          "Which small handheld tool with a curved scoop is used for digging small planting holes for seedlings?",
        options: ["A trowel", "A lawn mower", "A rake", "A pitchfork"],
        correctIndex: 0,
        explanation:
          "A trowel is a small handheld scooping tool essential for planting individual seedlings and bulbs.",
        explanationArabic:
          "مجرفة الشتل اليدوية هي أداة صغيرة مخصصة لحفر ثقوب الشتلات وغرس النباتات.",
      },
      {
        id: "tools_q2",
        question:
          "What rotating device connects to a garden hose to distribute water evenly across the entire turf?",
        options: ["A sprinkler", "A wheelbarrow", "A pruner", "A shovel"],
        correctIndex: 0,
        explanation:
          "A sprinkler is an irrigation device that sprays pressurized water over grass and garden beds.",
        explanationArabic:
          "مرشة المياه (الرشاش) هي أداة متصلة بالخرطوم لرش وتوزيع الماء بانتظام على العشب.",
      },
      {
        id: "tools_q3",
        question: "Why did Maya wear heavy leather garden gloves while working in the garden?",
        options: [
          "To protect her fingers and hands from blisters, soil, and sharp rose thorns",
          "To keep her hands clean while painting",
          "Because it was freezing winter with heavy snowfall",
          "To hold the heavy lawn mower handle tighter",
        ],
        correctIndex: 0,
        explanation:
          "Garden gloves protect gardeners' hands from dirt, blisters, and sharp pricks from thorny plants.",
        explanationArabic:
          "تحمي قفازات الحديقة الأيدي من الأوساخ والفقاعات والأشواك الحادة أثناء التقليم والزراعة.",
      },
    ],
  },

  "parts-of-a-plant": {
    groupId: "parts-of-a-plant",
    groupName: "Parts of a Plant",
    themeTitle: "The Miracle of the Sprouting Seed",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The Underground Anchor & The Sturdy Stem",
        titleArabic: "الجزء الأول: المرساة الأرضية والساق القوية",
        text: "In the botany greenhouse, Maya examined a healthy young sunflower. Beneath the rich dark loam, a dense network of underground roots anchored the plant and absorbed water. Rising straight up, a sturdy green stem transported nutrients to every leaf.",
        textArabic:
          "في دفيئة علم النبات، فحصت مايا نبتة عباد شمس يافعة. تحت التربة الداكنة الخصبة، ثبّتت شبكة كثيفة من الجذور النبتة وامتصت الماء. وبرزت ساق خضراء قوية نقلت الغذاء إلى كل ورقة.",
      },
      {
        partNumber: 2,
        title: "Part 2: Foliage, Bark & Blossoms",
        titleArabic: "الجزء الثاني: الأوراق واللحاء والأزهار",
        text: "Each broad green leaf captured sunlight for energy. Looking outside at the old orchard trees, Maya noticed how rugged woody bark shielded the main trunk and how a wide branch spread overhead, displaying soft velvety petals on every blossom.",
        textArabic:
          "التقطت كل ورقة خضراء عريضة ضوء الشمس لإنتاج الطاقة. وبالنظر خارجاً إلى أشجار البستان القديمة، لاحظت مايا كيف يحمي اللحاء الخشبي الخشن الجذع وكيف يمتد غصن عريض حاملاً بتلات مخملية ناعمة.",
      },
      {
        partNumber: 3,
        title: "Part 3: From Bud to Seed and Fruit",
        titleArabic: "الجزء الثالث: من البرعم إلى البذرة والثمرة",
        text: "She watched a tightly wrapped green bud slowly open into bloom. Along the wild brambles, she carefully avoided a sharp protective thorn and picked a ripe, juicy red berry filled with tiny seeds ready to sprout new life next spring.",
        textArabic:
          "شاهدت برعماً أخضر مغلقاً يتفتح ببطء ليصبح زهرة. وعلى طول شجيرات العليق، تفادت بحذر شوكة حادة وقطفت حبة توت حمراء ناضجة مليئة بالبذور الصغيرة الجاهزة لتنبت من جديد في الربيع القادم.",
      },
    ],
    quiz: [
      {
        id: "plant_q1",
        question:
          "Which essential plant part grows underground to anchor the plant and absorb moisture and soil nutrients?",
        options: ["Root", "Petal", "Thorn", "Bark"],
        correctIndex: 0,
        explanation:
          "Roots are the subterranean organ that anchors the plant and takes up water and essential minerals.",
        explanationArabic:
          "الجذور هي العضو النباتي الممتد تحت الأرض لتثبيت النبات وامتصاص الماء والمعادن.",
      },
      {
        id: "plant_q2",
        question:
          "What is the rugged, protective outer covering of a tree trunk and its woody branches called?",
        options: ["Bark", "Bud", "Seed", "Leaf"],
        correctIndex: 0,
        explanation:
          "Bark is the tough outer layer of woody plants that protects them from frost, injury, and disease.",
        explanationArabic:
          "اللحاء هو الطبقة الخارجية الخشنة الواقية لجذع الشجرة وأغصانها ضد العوامل الجوية.",
      },
      {
        id: "plant_q3",
        question:
          "What developmental cycle did Maya observe occurring in the greenhouse and orchard?",
        options: [
          "How seeds sprout into roots and stems, grow leaves and buds, and produce petals and berries",
          "How stones turn into soil overnight",
          "How birds build nests inside water hoses",
          "How wooden fences transform into trees",
        ],
        correctIndex: 0,
        explanation:
          "The story highlights the life cycle of plants from roots and stems to buds, flowers, and seeded berries.",
        explanationArabic:
          "توضح القصة دورة حياة النبات من الجذور والساق إلى البراعم والبتلات وثمار التوت الحاملة للبذور.",
      },
    ],
  },

  "garden-creatures": {
    groupId: "garden-creatures",
    groupName: "Garden Creatures",
    themeTitle: "The Busy Microscopic Kingdom",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: Aerial Pollinators & Protectors",
        titleArabic: "الجزء الأول: الملقحات والحماة المجنحة",
        text: "On a quiet morning, the garden came alive with buzzing activity. A colorful monarch butterfly fluttered gently between the lavender blooms, while a helpful red ladybug with black spots crawled along a rose leaf, hunting harmful aphids. Nearby, a fuzzy honey bee gathered golden pollen.",
        textArabic:
          "في صباح هادئ، دبت الحياة والنشاط في الحديقة. رفرفت فراشة ملكية ملونة برقة بين زهور الخزامى، بينما زحفت دعسوقة حمراء منقطة بالأسود على ورقة الورد تفترس حشرات المن الضارة. وبالقرب منها، جمعت نحلة زغبية حبوب اللقاح الذهبية.",
      },
      {
        partNumber: 2,
        title: "Part 2: Soil Tillers & Slow Crawlers",
        titleArabic: "الجزء الثاني: حارثو التربة والزواحف البطيئة",
        text: "Down in the rich damp compost, a pink earthworm burrowed through the soil, creating airy channels that helped roots breathe. A slow garden snail carried its spiral shell across the stone border, while an industrious black ant carried a pine needle twice its size back to the colony mound.",
        textArabic:
          "في الأسفل داخل السماد الرطب، حفرت دودة الأرض أنفاقاً في التربة مما ساعد الجذور على التنفس. وحمل حلزون بطيء قوقعته اللولبية عابراً الحافة الحجرية، بينما حملت نملة سوداء مجتهدة إبرة صنوبر تفوق حجمها إلى تل المستعمرة.",
      },
      {
        partNumber: 3,
        title: "Part 3: Master Weavers & Skilled Leapers",
        titleArabic: "الجزء الثالث: نساجو الشباك والقفازون الماهرون",
        text: "Under a broad squash leaf, a plump green caterpillar munched peacefully before spinning its cocoon. A yellow garden spider spun a breathtaking geometric web that sparkled with dew, while an iridescent blue dragonfly hovered over the pond and a green grasshopper leaped into the tall lawn.",
        textArabic:
          "تحت ورقة عريضة، قضمَت يرقة خضراء أوراق الشجر بهدوء قبل غزل شرنقتها. ونسج عنكبوت حديقة أصفر شبكة هندسية مذهلة تلمع بالندى، بينما حلّق يعسوب أزرق فوق البركة وقفز جندب أخضر في العشب العالي.",
      },
    ],
    quiz: [
      {
        id: "creat_q1",
        question:
          "Which beneficial insect is a small red beetle with black spots that protects plants by eating garden aphids?",
        options: ["Ladybug", "Snail", "Spider", "Worm"],
        correctIndex: 0,
        explanation:
          "Ladybugs are beneficial garden predators that feed extensively on destructive plant aphids.",
        explanationArabic:
          "الدعسوقة هي خنفساء صغيرة حمراء منقطة تفيد الحديقة بافتراس حشرات المن الضارة بالنبات.",
      },
      {
        id: "creat_q2",
        question:
          "Which fast, iridescent insect has four transparent wings and hovers effortlessly over ponds to hunt mosquitoes?",
        options: ["Dragonfly", "Ant", "Caterpillar", "Grasshopper"],
        correctIndex: 0,
        explanation:
          "Dragonflies are agile aerial predators with transparent wings that excel at catching flying insects near water.",
        explanationArabic:
          "اليعسوب حشرة رشيقة سريعة بأربعة أجنحة شفافة تصطاد البعوض فوق المسطحات المائية.",
      },
      {
        id: "creat_q3",
        question:
          "How do the various creatures in the story work together to maintain a healthy garden ecosystem?",
        options: [
          "Bees pollinate flowers, ladybugs control pests, earthworms aerate soil, and spiders catch flies",
          "All creatures eat all the plants until none are left",
          "They only appear during winter snowstorms",
          "They build wooden sheds and repair fences",
        ],
        correctIndex: 0,
        explanation:
          "Each creature plays a distinct ecological role: pollination, pest control, soil aeration, and natural balance.",
        explanationArabic:
          "يلعب كل كائن دوراً بيئياً هاماً: النحل للتلقيح، الدعسوقة لمكافحة الآفات، الديدان لتهوية التربة، والعناكب للصيد.",
      },
    ],
  },

  "garden-features": {
    groupId: "garden-features",
    groupName: "Garden Features",
    themeTitle: "The Backyard Sanctuary",
    passages: [
      {
        partNumber: 1,
        title: "Part 1: The Lawn & Floral Pathways",
        titleArabic: "الجزء الأول: المسطح الأخضر والممرات المزهرة",
        text: "The family worked together to transform their backyard into a serene haven. In the center, a manicured green lawn provided an open space for relaxing. A vibrant flower bed surrounded the perimeter with roses and lilies, and a winding gravel path led to each quiet corner.",
        textArabic:
          "تعاونت العائلة لتحويل فنائها الخلفي إلى واحة هادئة. في الوسط، وفر مسطح عشبي أخضر منسق مساحة للاسترخاء. وأحاط حوض زهور زاهٍ بالمحيط بالورد والزنبق، وقاد ممر حصوي ملتوٍ إلى كل ركن هادئ.",
      },
      {
        partNumber: 2,
        title: "Part 2: Boundaries & Protected Growing",
        titleArabic: "الجزء الثاني: الحدود والزراعة المحمية",
        text: "A white wooden fence enclosed the property for privacy, and an arched iron gate welcomed visitors with friendly charm. Near the sunniest corner, a glass greenhouse trapped warmth to nurture delicate vegetable seedlings throughout the cooler months.",
        textArabic:
          "أحاط سياج خشبي أبيض بالمنزل لتوفير الخصوصية، ورحبت بوابة حديدية مقوسة بالزوار بسحر ودود. وبالقرب من الزاوية الأكثر شمسًا، حبست دفيئة زجاجية الحرارة لرعاية شتلات الخضار في الأشهر الباردة.",
      },
      {
        partNumber: 3,
        title: "Part 3: Welcoming Wildlife & Eco-Friendly Care",
        titleArabic: "الجزء الثالث: استقبال الطيور والعناية البيئية",
        text: "A cedar bird feeder hung from the oak tree, attracting goldfinches, while a pedestal birdbath offered clean drinking water. All mowers and tools were stored inside the dry wooden garden shed, and grass clippings were recycled inside the dark compost bin to make natural fertilizer.",
        textArabic:
          "عُلّق مطعم طيور خشبي على شجرة البلوط لجذب الطيور، وقدم مغسل طيور حجري ماءً نظيفاً للشرب والاستحمام. وحُفظت الأدوات داخل كوخ الحديقة الخشبي، بينما أُعيد تدوير قصاصات العشب في صندوق السماد العضوي لإنتاج سماد طبيعي.",
      },
    ],
    quiz: [
      {
        id: "feat_g_q1",
        question:
          "What is a glass-enclosed garden structure designed to trap heat and nurture delicate seedlings in all seasons?",
        options: ["A greenhouse", "A garden shed", "A compost bin", "A birdbath"],
        correctIndex: 0,
        explanation:
          "A greenhouse uses glass walls to trap solar warmth, creating an ideal microclimate for young plants.",
        explanationArabic:
          "الدفيئة (البيت الزجاجي) مبنى زجاجي يحتجز الدفء لتوفير مناخ مثالي لنمو الشتلات والنباتات الحساسة.",
      },
      {
        id: "feat_g_q2",
        question:
          "What outdoor feature consists of a shallow stone basin on a pedestal filled with fresh water for avian visitors?",
        options: ["A birdbath", "A fence", "A flower bed", "A lawn"],
        correctIndex: 0,
        explanation:
          "A birdbath is an ornamental water basin provided for wild birds to drink and bathe.",
        explanationArabic:
          "مغسل الطيور (حوض استحمام الطيور) هو حوض مائي ضحل مخصص لشرب الطيور ونظافتها.",
      },
      {
        id: "feat_g_q3",
        question:
          "How did the family practice eco-friendly gardening with their plant trimmings and grass clippings?",
        options: [
          "They placed them into a ventilated compost bin to decompose into organic fertilizer",
          "They burned them on the manicured green lawn",
          "They threw them outside over the neighbor's fence",
          "They stored them permanently in the wooden shed",
        ],
        correctIndex: 0,
        explanation:
          "Composting organic garden clippings produces nutrient-dense natural fertilizer for future seasons.",
        explanationArabic:
          "إعادة تدوير قصاصات النباتات داخل صندوق السماد العضوي ينتج سماداً طبيعياً غنياً يغذي تربة الحديقة.",
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
        question:
          "Which essential vocabulary item or feature is featured prominently as the " +
          w1.toLowerCase() +
          " in Part 1?",
        options: ["The " + w1.toLowerCase(), "An empty crate", "A broken tool", "A noisy engine"],
        correctIndex: 0,
        explanation:
          "The narrative focuses on the " +
          w1.toLowerCase() +
          " as a key element of the " +
          groupName.toLowerCase() +
          " scene.",
        explanationArabic: "يركز النص على " + w1 + " كعنصر رئيسي في المشهد.",
      },
      {
        id: groupId + "_q2",
        question: "How was the " + w3.toLowerCase() + " utilized during the activity in Part 2?",
        options: [
          "To carefully inspect, organize, and prepare the " + groupName.toLowerCase() + " area",
          "It was discarded and forgotten",
          "It was painted bright blue",
          "It was left outdoors in the rain",
        ],
        correctIndex: 0,
        explanation:
          "Alex used the " + w3.toLowerCase() + " to inspect and organize the area properly.",
        explanationArabic: "استخدم أليكس " + w3 + " لتنظيم وتجهيز المكان بالشكل المناسب.",
      },
      {
        id: groupId + "_q3",
        question: "What was the overall outcome of Alex's efforts by the end of the day in Part 3?",
        options: [
          "All tasks were successfully completed and the " +
            groupName.toLowerCase() +
            " was in perfect condition",
          "Everything was left unfinished and disorganized",
          "The project was canceled due to bad weather",
          "Alex moved away to another town",
        ],
        correctIndex: 0,
        explanation:
          "By the end of the story, Alex completed all tasks smoothly and the space was perfectly arranged.",
        explanationArabic: "بحلول نهاية القصة، اكتملت جميع المهام بنجاح وأصبح المكان في أفضل حال.",
      },
    ],

    "airport-story": {
      id: "airport-story",
      titleEn: "The Airport Adventure",
      titleAr: "مُغَامَرَةُ المَطَار",
      paragraphs: [
        {
          en: "We arrive at the airport terminal and print our boarding pass. Then we push the luggage cart to the counter.",
          ar: "نَصِلُ إِلَى مَبْنَى الرُّكَّابِ فِي المَطَارِ وَنَطْبَعُ بِطَاقَةَ الصُّعُودِ. ثُمَّ نَدْفَعُ عَرَبَةَ الأَمْتِعَةِ إِلَى المَكْتَبِ.",
        },
        {
          en: "Next, we go through the security check and walk to the departure gate. A friendly flight attendant greets us as we board.",
          ar: "بَعْدَ ذَلِكَ، نَمُرُّ عَبْرَ التَّفْتِيشِ الأَمْنِيِّ وَنَمْشِي إِلَى بَوَّابَةِ المُغَادَرَةِ. يُحَيِّينَا مُضِيفُ طَيَرَانٍ وَدُودٌ عِنْدَ الصُّعُودِ.",
        },
      ],
    },
    "train-story": {
      id: "train-story",
      titleEn: "The Fast Train",
      titleAr: "القِطَارُ السَّرِيع",
      paragraphs: [
        {
          en: "I buy a pass at the ticket machine and stand on the train platform. Soon, the large locomotive arrives on the railway track.",
          ar: "أَشْتَرِي تِذْكَرَةً مِنْ آلَةِ التَّذَاكِرِ وَأَقِفُ عَلَى رَصِيفِ القِطَارِ. سُرْعَانَ مَا تَصِلُ القَاطِرَةُ الكَبِيرَةُ عَلَى السِّكَّةِ الحَدِيدِيَّةِ.",
        },
        {
          en: "I show my pass to the train conductor and sit in the passenger car. The commuter train travels quickly across the country.",
          ar: "أُبْرِزُ تِذْكَرَتِي لِمُحَصِّلِ التَّذَاكِرِ وَأَجْلِسُ فِي عَرَبَةِ الرُّكَّابِ. يُسَافِرُ قِطَارُ الرُّكَّابِ بِسُرْعَةٍ عَبْرَ البِلَادِ.",
        },
      ],
    },
    "hotel-story": {
      id: "hotel-story",
      titleEn: "A Nice Hotel",
      titleAr: "فُنْدُقٌ جَمِيل",
      paragraphs: [
        {
          en: "We check in at the hotel reception and the bellboy helps with our bags in the hotel lobby. I use my room key to open the door.",
          ar: "نُسَجِّلُ الدُّخُولَ فِي مَكْتَبِ اسْتِقْبَالِ الفُنْدُقِ وَيُسَاعِدُنَا حَامِلُ الأَمْتِعَةِ فِي حَقَائِبِنَا فِي بَهْوِ الفُنْدُقِ. أَسْتَخْدِمُ مِفْتَاحَ غُرْفَتِي لِفَتْحِ البَابِ.",
        },
        {
          en: "In the morning, we order room service and enjoy the beautiful balcony view. Later, housekeeping cleans the room.",
          ar: "فِي الصَّبَاحِ، نَطْلُبُ خِدْمَةَ الغُرَفِ وَنَسْتَمْتِعُ بِإِطْلَالَةِ الشُّرْفَةِ الجَمِيلَةِ. لاحِقًا، يَقُومُ تَنْظِيفُ الغُرَفِ بِتَنْظِيفِ الغُرْفَةِ.",
        },
      ],
    },
  };
}
