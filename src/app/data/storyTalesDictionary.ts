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
  "bedroom-1": {
    groupId: "bedroom-1",
    groupName: "Bedroom 1",
    themeTitle: "The Bedroom",
    passages: [
      {
        partNumber: 1,
        title: "My New Bedroom - Part 1",
        titleArabic: "غرفة نومي الجديدة - الجزء الأول",
        text: "When I moved into my new flat last month, the bedroom was completely empty. The first thing I bought was a comfortable bed with a wooden bed frame and a soft mattress. I put two pillows and a duvet on top, with clean white sheets and a warm blanket for cold nights. Next to the bed, I placed a small nightstand with a lamp and an alarm clock. On the other side of the room, I set up a dresser with six drawers for my clothes. I also bought a tall wardrobe for my jackets and shirts, and I keep a row of hangers inside for everything to stay neat.",
        textArabic:
          "عندما انتقلت إلى شقتي الجديدة الشهر الماضي، كانت غرفة النوم فارغة تمامًا. أول شيء اشتريته كان سريرًا مريحًا بهيكل خشبي ومرتبة ناعمة. وضعت وسادتين ولحافًا في الأعلى، مع ملاءات بيضاء نظيفة وبطانية دافئة لليالي الباردة. بجوار السرير، وضعت طاولة جانبية صغيرة عليها مصباح وساعة منبه. على الجانب الآخر من الغرفة، قمت بإعداد خزانة ذات ستة أدراج لملابسي. واشتريت أيضًا خزانة ملابس طويلة لستراتي وقمصاني، وأحتفظ بصف من الشماعات بالداخل ليبقى كل شيء مرتبًا.",
      },
      {
        partNumber: 2,
        title: "My New Bedroom - Part 2",
        titleArabic: "غرفة نومي الجديدة - الجزء الثاني",
        text: "In the corner, I have a desk and a chair where I study. My laptop, charger, and headphones sit on the desk. Above the desk, I hung a bookshelf for my books and a few photo albums. The wall has a poster and a picture frame with a family photo. I chose soft curtains for the window and added blinds for privacy. There is a small rug on the floor beside the bed, and a ceiling light with a dimmer connected to the light switch by the door. On quiet evenings, I light a candle, put on my pajamas and slippers, and read before sleep. My bedroom is simple, but it feels like home.",
        textArabic:
          "في الزاوية، لدي مكتب وكرسي حيث أدرس. جهاز الكمبيوتر المحمول والشاحن وسماعات الرأس موجودة على المكتب. فوق المكتب، علقت رف كتب لكتبي وبضعة ألبومات صور. يحتوي الجدار على ملصق وإطار صورة به صورة عائلية. اخترت ستائر ناعمة للنافذة وأضفت ستائر معتمة للخصوصية. توجد سجادة صغيرة على الأرض بجانب السرير، ومصباح سقف مزود بخافت إضاءة متصل بمفتاح الإضاءة بجوار الباب. في الأمسيات الهادئة، أشعل شمعة، وأرتدي ملابس النوم والنعال، وأقرأ قبل النوم. غرفة نومي بسيطة، لكنها تشعرني وكأنني في منزلي.",
      },
      {
        partNumber: 3,
        title: "Bedroom Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة لغرفة النوم",
        text: "Here are some useful bedroom idioms and phrases:\n- 'hit the sack' / 'turn in': to go to bed.\n- 'sleep like a log': sleep very deeply.\n- 'tidy up': make a room clean and organised.\n- 'make the bed': arrange sheets, blankets, and pillows neatly.",
        textArabic:
          "إليك بعض المصطلحات والعبارات المفيدة المتعلقة بغرفة النوم:\n- 'hit the sack' / 'turn in': يذهب إلى الفراش.\n- 'sleep like a log': ينام بعمق شديد.\n- 'tidy up': ينظف الغرفة ويرتبها.\n- 'make the bed': يرتب الملاءات والبطانيات والوسائد بعناية.",
      },
    ],
    quiz: [
      {
        id: "bedroom-1-q1",
        question: "What did the writer place next to the bed?",
        options: [
          "A desk",
          "A small nightstand with a lamp and an alarm clock",
          "A bookshelf",
          "A tall wardrobe",
        ],
        correctIndex: 1,
        explanation:
          "The text states: 'Next to the bed, I placed a small nightstand with a lamp and an alarm clock.'",
        explanationArabic:
          "ينص النص على: 'بجوار السرير، وضعت طاولة جانبية صغيرة عليها مصباح وساعة منبه'.",
      },
      {
        id: "bedroom-1-q2",
        question: "Why did the writer add blinds to the window?",
        options: ["To block the cold", "For decoration", "For privacy", "To keep out the noise"],
        correctIndex: 2,
        explanation:
          "The text says: 'I chose soft curtains for the window and added blinds for privacy.'",
        explanationArabic: "يقول النص: 'اخترت ستائر ناعمة للنافذة وأضفت ستائر معتمة للخصوصية'.",
      },
      {
        id: "bedroom-1-q3",
        question: "What does the idiom 'sleep like a log' mean?",
        options: [
          "To have trouble sleeping",
          "To sleep on a hard surface",
          "To sleep very deeply without waking",
          "To wake up early",
        ],
        correctIndex: 2,
        explanation: "'Sleep like a log' means to sleep very deeply and peacefully.",
        explanationArabic: "يعني 'sleep like a log' أن تنام بعمق شديد وبسلام.",
      },
    ],
  },
  "bedroom-2": {
    groupId: "bedroom-2",
    groupName: "Bedroom 2",
    themeTitle: "The Bedroom",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Flatmates",
        titleArabic: "حوار قصير: زملاء السكن",
        text: "Tom: I finally set up my new bed frame yesterday. It took me two hours!\nAisha: That sounds tiring. Did you get a new mattress too?\nTom: Yes, a memory foam one. And I bought a duvet and two soft pillows.\nAisha: Nice! What about storage?\nTom: I got a wardrobe and a chest of drawers. Now I can actually put my things away.\nAisha: And the lighting?\nTom: I added a reading light on the nightstand and a desk lamp. Much better now.\nAisha: It sounds like a proper bedroom now.",
        textArabic:
          "توم: قمت أخيرًا بتركيب إطار سريري الجديد بالأمس. استغرق الأمر مني ساعتين!\nعائشة: يبدو ذلك متعبًا. هل حصلت على مرتبة جديدة أيضًا؟\nتوم: نعم، مرتبة من الإسفنج الرغوي. واشتريت لحافًا ووسادتين ناعمتين.\nعائشة: رائع! وماذا عن التخزين؟\nتوم: حصلت على خزانة ملابس وخزانة ذات أدراج. الآن يمكنني فعليًا ترتيب أشيائي.\nعائشة: والإضاءة؟\nتوم: أضفت مصباح قراءة على الطاولة الجانبية ومصباح مكتب. أفضل بكثير الآن.\nعائشة: تبدو وكأنها غرفة نوم مناسبة الآن.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes",
        titleArabic: "الأخطاء الشائعة",
        text: "- 'I did my homework at the desk.' (Not 'I made my homework on the desk'.)\n- 'I turned on the light.' (Not 'I opened the light'. We 'turn on/off' lights.)\n- 'I have a piece of furniture in my room.' (Furniture is uncountable. Don't say 'a furniture'.)\n- 'I went to bed at 10.' (Use 'went to bed' or 'fell asleep', not 'slept at 10'.)\n- 'I put my clothes on the hanger.' (Not 'in the hanger'.)",
        textArabic:
          "- 'I did my homework at the desk.' (وليس 'I made my homework on the desk'.)\n- 'I turned on the light.' (وليس 'I opened the light'. نحن نقوم بتشغيل/إطفاء الأضواء.)\n- 'I have a piece of furniture in my room.' (كلمة Furniture غير معدودة. لا تقل 'a furniture'.)\n- 'I went to bed at 10.' (استخدم 'went to bed' أو 'fell asleep'، وليس 'slept at 10'.)\n- 'I put my clothes on the hanger.' (وليس 'in the hanger'.)",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "British vs American Vocabulary:\n- British: 'wardrobe', 'duvet', 'chest of drawers', 'spare room'\n- American: 'closet', 'comforter', 'dresser', 'guest room'\n\nAlso, 'bedroom' is always written as one word. In English-speaking cultures, 'making the bed' (straightening sheets, fluffing pillows) is considered a daily habit.",
        textArabic:
          "المفردات البريطانية مقابل الأمريكية:\n- بريطاني: 'wardrobe', 'duvet', 'chest of drawers', 'spare room'\n- أمريكي: 'closet', 'comforter', 'dresser', 'guest room'\n\nبالإضافة إلى ذلك، تُكتب كلمة 'bedroom' دائمًا ككلمة واحدة. في الثقافات الناطقة باللغة الإنجليزية، يُعتبر 'ترتيب السرير' (تسوية الملاءات، وتنفش الوسائد) عادة يومية.",
      },
    ],
    quiz: [
      {
        id: "bedroom-2-q1",
        question: "What type of mattress did Tom get?",
        options: ["Spring mattress", "Memory foam mattress", "Air mattress", "Water mattress"],
        correctIndex: 1,
        explanation: "Tom states in the dialogue, 'Yes, a memory foam one.'",
        explanationArabic: "يذكر توم في الحوار، 'نعم، مرتبة من الإسفنج الرغوي'.",
      },
      {
        id: "bedroom-2-q2",
        question: "Which of the following is correct to say in English?",
        options: [
          "I opened the light.",
          "I made my homework.",
          "I turned on the light.",
          "I put my clothes in the hanger.",
        ],
        correctIndex: 2,
        explanation: "You should say 'I turned on the light', not 'I opened the light'.",
        explanationArabic: "يجب أن تقول 'I turned on the light'، وليس 'I opened the light'.",
      },
      {
        id: "bedroom-2-q3",
        question: "What is the American English equivalent for the British word 'wardrobe'?",
        options: ["Closet", "Dresser", "Comforter", "Guest room"],
        correctIndex: 0,
        explanation: "The American English equivalent for 'wardrobe' is 'closet'.",
        explanationArabic: "المرادف باللغة الإنجليزية الأمريكية لكلمة 'wardrobe' هو 'closet'.",
      },
    ],
  },
  "bathroom-1": {
    groupId: "bathroom-1",
    groupName: "Bathroom Lesson 1",
    themeTitle: "Morning Routine",
    passages: [
      {
        partNumber: 1,
        title: "Reading Passage (Part 1)",
        titleArabic: "قطعة القراءة (الجزء الأول)",
        text: "Every morning starts in the bathroom. You turn on the faucet at the sink to wash your hands with hand soap and warm water. Then you squeeze toothpaste onto your toothbrush and brush your teeth for two minutes. After that, you might gargle with mouthwash to keep your breath fresh.",
        textArabic:
          "تبدأ كل صباح في الحمام. تقوم بتشغيل الصنبور عند الحوض لغسل يديك بصابون اليدين والماء الدافئ. ثم تضع معجون الأسنان على فرشاة أسنانك وتغسل أسنانك لمدة دقيقتين. بعد ذلك، قد تتغرغر بغسول الفم للحفاظ على رائحة أنفاسك منعشة.",
      },
      {
        partNumber: 2,
        title: "Reading Passage (Part 2)",
        titleArabic: "قطعة القراءة (الجزء الثاني)",
        text: "Next, it is time for a shower. You step into the bathtub, pull the shower curtain closed, and adjust the shower head. You use shower gel or body wash to clean your body, and shampoo followed by conditioner for your hair. When you are finished, you dry off with a bath towel and step onto the bath mat.",
        textArabic:
          "بعد ذلك، حان وقت الاستحمام. تخطو إلى حوض الاستحمام، وتسحب ستارة الدش لإغلاقها، وتضبط رأس الدش. تستخدم جل الاستحمام أو غسول الجسم لتنظيف جسمك، والشامبو يليه البلسم لشعرك. عند الانتهاء، تجفف نفسك بمنشفة حمام وتخطو على حصيرة الحمام.",
      },
      {
        partNumber: 3,
        title: "Idioms and Phrases",
        titleArabic: "المصطلحات والعبارات",
        text: '"Throw in the towel" means to give up. "Clean up your act" means to improve your behavior. "Come clean" means to admit the truth. "Wash your hands of" means to refuse responsibility. "Down the drain" means wasted. "Dry off" means to remove water from your body.',
        textArabic:
          '"Throw in the towel" تعني الاستسلام. "Clean up your act" تعني تحسين سلوكك. "Come clean" تعني الاعتراف بالحقيقة. "Wash your hands of" تعني رفض تحمل المسؤولية. "Down the drain" تعني ضاع سدى. "Dry off" تعني إزالة الماء من جسمك.',
      },
    ],
    quiz: [
      {
        id: "bathroom-1-q1",
        question: "What do you use to wash your hands?",
        options: ["Toothpaste", "Hand soap", "Mouthwash", "Shampoo"],
        correctIndex: 1,
        explanation: "The passage says you wash your hands with hand soap and warm water.",
        explanationArabic: "يقول النص أنك تغسل يديك بصابون اليدين والماء الدافئ.",
      },
      {
        id: "bathroom-1-q2",
        question: 'What is the idiom that means "to give up"?',
        options: ["Clean up your act", "Come clean", "Throw in the towel", "Down the drain"],
        correctIndex: 2,
        explanation: '"Throw in the towel" is an idiom that means to give up.',
        explanationArabic: '"Throw in the towel" هو مصطلح يعني الاستسلام.',
      },
      {
        id: "bathroom-1-q3",
        question: "What do you step onto after drying off with a bath towel?",
        options: ["The sink", "The bath mat", "The mirror", "The shower head"],
        correctIndex: 1,
        explanation:
          "The passage states that when you are finished, you dry off with a bath towel and step onto the bath mat.",
        explanationArabic:
          "ينص النص على أنه عند الانتهاء، تجفف نفسك بمنشفة حمام وتخطو على حصيرة الحمام.",
      },
    ],
  },
  "bathroom-2": {
    groupId: "bathroom-2",
    groupName: "Bathroom Lesson 2",
    themeTitle: "Getting Ready and Culture",
    passages: [
      {
        partNumber: 1,
        title: "Dialogue: Getting Ready",
        titleArabic: "حوار: الاستعداد",
        text: 'Mom asks, "Did you brush your teeth yet?" Ali answers, "Yes, I used the toothbrush and toothpaste. And I even used mouthwash!" Mom reminds him to comb his hair and asks him to put his dirty clothes in the laundry basket. Ali says he will be ready in ten minutes.',
        textArabic:
          'تسأل الأم: "هل غسلت أسنانك بعد؟" يجيب علي: "نعم، استخدمت فرشاة الأسنان ومعجون الأسنان. وحتى أنني استخدمت غسول الفم!" تذكره الأم بتمشيط شعره وتطلب منه وضع ملابسه المتسخة في سلة الغسيل. يقول علي إنه سيكون جاهزًا في غضون عشر دقائق.',
      },
      {
        partNumber: 2,
        title: "Cultural Notes",
        titleArabic: "ملاحظات ثقافية",
        text: 'In British English, people say "tap," but in American English, it\'s "faucet." British say "toilet," while Americans use "bathroom" for at home and "restroom" for public places. Asking for the "toilet" in the US can sound too direct.',
        textArabic:
          'في الإنجليزية البريطانية، يقول الناس "tap"، ولكن في الإنجليزية الأمريكية، هي "faucet". يقول البريطانيون "toilet"، بينما يستخدم الأمريكيون "bathroom" في المنزل و "restroom" للأماكن العامة. قد يبدو السؤال عن "toilet" في الولايات المتحدة مباشرًا للغاية.',
      },
      {
        partNumber: 3,
        title: "Common Mistakes",
        titleArabic: "أخطاء شائعة",
        text: 'We say "brush your teeth," not "wash your teeth." You use a hair dryer to dry your hair, not a hairbrush. Also, you look at yourself in the mirror, not in the glass. We "turn on" or "turn off" a faucet, we don\'t "open" or "close" it.',
        textArabic:
          'نقول "brush your teeth" (تغسل أسنانك)، وليس "wash your teeth". تستخدم مجفف الشعر لتجفيف شعرك، وليس فرشاة الشعر. أيضًا، تنظر إلى نفسك في المرآة (mirror)، وليس في الزجاج (glass). نحن نفتح (turn on) أو نغلق (turn off) الصنبور، ولا نفتحه (open) أو نغلقه (close) حرفياً.',
      },
    ],
    quiz: [
      {
        id: "bathroom-2-q1",
        question: "What did Ali's mom ask him to put in the laundry basket?",
        options: ["The toothbrush", "His dirty clothes", "The shampoo", "The hair dryer"],
        correctIndex: 1,
        explanation:
          "In the dialogue, Mom tells Ali to put his dirty clothes in the laundry basket.",
        explanationArabic: "في الحوار، تخبر الأم علي بوضع ملابسه المتسخة في سلة الغسيل.",
      },
      {
        id: "bathroom-2-q2",
        question: "What is the American English word for a public toilet?",
        options: ["Restroom", "Tap", "Flannel", "Loo"],
        correctIndex: 0,
        explanation: 'In American English, people use the word "restroom" for public places.',
        explanationArabic:
          'في الإنجليزية الأمريكية، يستخدم الناس كلمة "restroom" للإشارة إلى الأماكن العامة.',
      },
      {
        id: "bathroom-2-q3",
        question: "Which phrase is correct in English?",
        options: ["Wash your teeth", "Open the faucet", "Brush your teeth", "Look in the glass"],
        correctIndex: 2,
        explanation:
          "In English, we 'brush' teeth, not 'wash' them. We also 'turn on' the faucet and look in the 'mirror'.",
        explanationArabic:
          "في اللغة الإنجليزية، نحن نغسل (brush) الأسنان، وليس (wash). كما أننا نفتح (turn on) الصنبور وننظر في المرآة (mirror).",
      },
    ],
  },
  kitchen: {
    groupId: "kitchen",
    groupName: "The Kitchen",
    themeTitle: "Cooking at Home",
    passages: [
      {
        partNumber: 1,
        title: "Cooking at Home - Appliances",
        titleArabic: "الطهي في المنزل - الأجهزة المنزلية",
        text: "My kitchen is my favourite room in the house. Every evening after work, I spend about an hour there preparing dinner. The kitchen has all the appliances I need: a large refrigerator to keep food fresh, a stove with four burners, and an oven for baking. I also use the microwave to heat leftovers quickly. On the counter, I keep my most-used small appliances — a kettle for tea, a toaster for breakfast, a coffee maker, and a blender for smoothies. The dishwasher saves me a lot of time after meals, so I rarely wash dishes by hand anymore.",
        textArabic:
          "مطبخي هو غرفتي المفضلة في المنزل. كل مساء بعد العمل، أقضي حوالي ساعة هناك في إعداد العشاء. يحتوي المطبخ على جميع الأجهزة التي أحتاجها: ثلاجة كبيرة للحفاظ على الطعام طازجًا، وموقد بأربع عيون، وفرن للخبز. أستخدم الميكروويف أيضًا لتسخين بقايا الطعام بسرعة. أحتفظ على طاولة المطبخ بالأجهزة الصغيرة الأكثر استخدامًا — غلاية للشاي، ومحمصة خبز للإفطار، وآلة صنع القهوة، وخلاط للعصائر المثلجة. توفر غسالة الأطباق الكثير من وقتي بعد الوجبات، لذلك نادرًا ما أغسل الأطباق يدويًا بعد الآن.",
      },
      {
        partNumber: 2,
        title: "Cooking at Home - Cookware & Utensils",
        titleArabic: "الطهي في المنزل - أواني وأدوات الطبخ",
        text: "I have a full set of cooking tools. My favourite pan is a non-stick frying pan I use almost every day. For soups and sauces, I reach for a large saucepan or a pot. When I make stir-fry, I use the wok. The pressure cooker is perfect for beans and stews because it cooks everything much faster. In the drawer next to the stove, I keep my utensils: a spatula for flipping, a ladle for serving soup, tongs for grilling, and a whisk for eggs and batters. The peeler and grater sit in a small container beside the cutting board, along with a sharp knife. I store dry food in the pantry and fresh items inside the refrigerator, while the freezer is full of frozen vegetables and ice cream. Cooking at home is cheaper, healthier, and honestly, more relaxing than eating out.",
        textArabic:
          "لدي مجموعة كاملة من أدوات الطهي. المقلاة المفضلة لدي هي مقلاة غير لاصقة أستخدمها كل يوم تقريبًا. بالنسبة للشوربات والصلصات، أتناول قدرًا كبيرًا أو طنجرة. وعندما أعد القلي السريع، أستخدم مقلاة الووك. وتعتبر حلة الضغط مثالية للبقوليات واليخنات لأنها تطهو كل شيء بشكل أسرع بكثير. في الدرج بجوار الموقد، أحتفظ بأدواتي: ملعقة مسطحة للتقليب والقلب، ومغرفة لسكب الحساء، وملاقط للشواء، ومضرب بيض للبيض والخلطات. توجد المقشرة والمبشرة في وعاء صغير بجانب لوح التقطيع، مع سكين حاد. أقوم بتخزين الأطعمة الجافة في خزانة المؤن والأطعمة الطازجة داخل الثلاجة، بينما يمتلئ الفريزر بالخضروات المجمدة والآيس كريم. الطهي في المنزل أرخص وأكثر صحة وبصراحة أكثر استرخاءً من تناول الطعام في الخارج.",
      },
      {
        partNumber: 3,
        title: "Kitchen Idioms & Phrases",
        titleArabic: "مصطلحات وعبارات المطبخ",
        text: "Here are key kitchen idioms and phrasal verbs:\n- 'too many cooks spoil the broth': too many people involved make the outcome worse.\n- 'cook up': prepare food quickly, or invent a plan or excuse.\n- 'a watched pot never boils': time feels slower when waiting impatiently.\n- 'out of the frying pan, into the fire': going from one bad situation to an even worse one.\n- 'stir up': cause trouble or strong emotions; or mix by stirring.",
        textArabic:
          "إليك أهم مصطلحات وأفعال المطبخ المركبة:\n- 'too many cooks spoil the broth' (كثرة الطباخين تفسد الطبخة): كثرة المشاركين تجعل النتيجة أسوأ.\n- 'cook up': يعد طعامًا بسرعة، أو يبتكر خطة أو عذرًا.\n- 'a watched pot never boils' (القدر المراقب لا يغلي أبدًا): يبدو الوقت أبطأ عند الانتظار بفارغ الصبر.\n- 'out of the frying pan, into the fire' (كالمستجير من الرمضاء بالنار): الانتقال من موقف سيئ إلى موقف أسوأ منه.\n- 'stir up': يثير المشاكل أو المشاعر القوية؛ أو يخلط بالتحريك.",
      },
    ],
    quiz: [
      {
        id: "kitchen-q1",
        question: "Which appliance does the writer use to quickly heat leftovers?",
        options: ["The oven", "The microwave", "The toaster", "The blender"],
        correctIndex: 1,
        explanation: "The passage mentions: 'I also use the microwave to heat leftovers quickly.'",
        explanationArabic: "يذكر النص: 'أستخدم الميكروويف أيضًا لتسخين بقايا الطعام بسرعة'.",
      },
      {
        id: "kitchen-q2",
        question: "Why does the writer use a pressure cooker for beans and stews?",
        options: [
          "Because it is non-stick",
          "Because it uses less electricity",
          "Because it cooks everything much faster",
          "Because it is easy to wash by hand",
        ],
        correctIndex: 2,
        explanation:
          "The writer states that the pressure cooker is perfect because it cooks everything much faster.",
        explanationArabic: "يذكر الكاتب أن حلة الضغط مثالية لأنها تطهو كل شيء بشكل أسرع بكثير.",
      },
      {
        id: "kitchen-q3",
        question: "What does the idiom 'out of the frying pan, into the fire' mean?",
        options: [
          "Cooking dinner very quickly",
          "Going from a bad situation to an even worse one",
          "Burning food on the stove",
          "Having too many people in the kitchen",
        ],
        correctIndex: 1,
        explanation:
          "'Out of the frying pan, into the fire' means moving from one bad situation into an even worse one.",
        explanationArabic:
          "يعني تعبير 'out of the frying pan, into the fire' الانتقال من وضع سيئ إلى وضع أسوأ منه.",
      },
    ],
  },
  "kitchen-1": {
    groupId: "kitchen-1",
    groupName: "The Kitchen 1",
    themeTitle: "Kitchen Dialogue & Culture",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Preparing Dinner",
        titleArabic: "حوار قصير: إعداد العشاء",
        text: "Sami: What are you cooking up tonight?\nLina: I'm making a vegetable stir-fry in the wok and a chicken soup in the saucepan.\nSami: Can I help? Let me slice and dice the carrots and onions.\nLina: That would be wonderful! The cutting board and sharp knife are on the counter.\nSami: Should I heat up the frying pan too?\nLina: Not yet. Let's simmer down the sauce first on low heat so it doesn't burn.\nSami: Perfect! It all boils down to good timing.",
        textArabic:
          "سامي: ماذا تطبخين الليلة؟\nلينا: أقوم بإعداد خضار مقلي سريع في مقلاة الووك وشوربة دجاج في القدر.\nسامي: هل يمكنني المساعدة؟ دعيني أقطع الجزر والبصل إلى مكعبات صغيرة.\nلينا: سيكون ذلك رائعًا! لوح التقطيع والسكين الحاد على طاولة المطبخ.\nسامي: هل يجب أن أسخن المقلاة أيضًا؟\nلينا: ليس بعد. دعنا نترك الصلصة تغلي على نار هادئة أولاً حتى لا تحترق.\nسامي: ممتاز! الأمر كله يتلخص في التوقيت الجيد.",
      },
      {
        partNumber: 2,
        title: "More Kitchen Idioms & Expressions",
        titleArabic: "المزيد من مصطلحات وتعبيرات المطبخ",
        text: "Here are more essential kitchen expressions:\n- 'boil down to': the most important point or reason (e.g., 'Success boils down to practice').\n- 'slice and dice': cut into small pieces; also to analyse data in detail.\n- 'heat up': make something warmer, or become more intense.\n- 'simmer down': calm down, or cook gently at low heat.\n- 'recipe for disaster': a plan or situation likely to fail or cause serious trouble.",
        textArabic:
          "إليك المزيد من تعبيرات المطبخ الأساسية:\n- 'boil down to' (يتلخص في): النقطة الأساسية أو السبب الأهم (مثل: 'النجاح يتلخص في الممارسة').\n- 'slice and dice': التقطيع إلى قطع صغيرة؛ وأيضًا تحليل البيانات بالتفصيل.\n- 'heat up': تسخين شيء ما، أو زيادة حدة الموقف.\n- 'simmer down': يهدأ، أو يطهو بلطف على نار هادئة.\n- 'recipe for disaster' (وصفة لكارثة): خطة أو وضع من المرجح أن يفشل أو يسبب مشاكل كبيرة.",
      },
      {
        partNumber: 3,
        title: "Cultural Notes & Common Kitchen Mistakes",
        titleArabic: "ملاحظات ثقافية وأخطاء شائعة في المطبخ",
        text: "Cultural Differences & Language Tips:\n- British vs. American: In the UK, people often say 'cooker', 'hob', and 'fridge', while in the US, 'stove', 'cooktop', and 'refrigerator' are standard.\n- Collocations: We say 'turn on the stove' (not 'open the stove') and 'wash the dishes' or 'do the dishes'.\n- Countable vs Uncountable: Food staples like 'flour', 'rice', 'oil', and 'sugar' are uncountable, so use 'some flour' or 'a cup of flour' rather than plural forms.",
        textArabic:
          "الفروق الثقافية والنصائح اللغوية:\n- الإنجليزية البريطانية مقابل الأمريكية: في المملكة المتحدة، غالبًا ما يقول الناس 'cooker' و 'hob' و 'fridge'، بينما في الولايات المتحدة، تعتبر 'stove' و 'cooktop' و 'refrigerator' هي الشائعة.\n- المتلازمات اللفظية: نقول 'turn on the stove' (نشعل الموقد) وليس 'open the stove'، ونقول 'wash the dishes' أو 'do the dishes' لغسيل الأطباق.\n- الأسماء المعدودة وغير المعدودة: الأطعمة الأساسية مثل 'flour' (الدقيق) و 'rice' (الأرز) و 'oil' (الزيت) و 'sugar' (السكر) هي أسماء غير معدودة، لذلك استخدم 'some flour' أو 'a cup of flour' بدلاً من صيغ الجمع.",
      },
    ],
    quiz: [
      {
        id: "kitchen-1-q1",
        question: "What does Sami offer to do in the dialogue?",
        options: [
          "Wash the dishes in the dishwasher",
          "Slice and dice the carrots and onions",
          "Bake bread in the oven",
          "Make smoothies with the blender",
        ],
        correctIndex: 1,
        explanation: "In the dialogue, Sami says: 'Let me slice and dice the carrots and onions.'",
        explanationArabic: "في الحوار، يقول سامي: 'دعيني أقطع الجزر والبصل إلى مكعبات صغيرة'.",
      },
      {
        id: "kitchen-1-q2",
        question: "What does the idiom 'recipe for disaster' mean?",
        options: [
          "A very delicious cooking recipe",
          "A plan likely to fail or cause trouble",
          "A meal cooked on very high heat",
          "A cookbook with missing instructions",
        ],
        correctIndex: 1,
        explanation:
          "'Recipe for disaster' refers to an action or plan that is very likely to lead to trouble or failure.",
        explanationArabic:
          "يشير تعبير 'recipe for disaster' إلى خطة أو تصرف من المرجح جدًا أن يؤدي إلى المشاكل أو الفشل.",
      },
      {
        id: "kitchen-1-q3",
        question: "Which of the following is the correct English phrase?",
        options: ["Open the stove", "Turn on the stove", "Make the dishes", "Do the fridge"],
        correctIndex: 1,
        explanation: "In English, we say 'turn on the stove', not 'open the stove'.",
        explanationArabic:
          "في اللغة الإنجليزية، نقول 'turn on the stove' (تشغيل الموقد) وليس 'open the stove'.",
      },
    ],
  },
  "living-room": {
    groupId: "living-room",
    groupName: "Living Room 1",
    themeTitle: "The Living Room",
    passages: [
      {
        partNumber: 1,
        title: "A Room for Everyone - Part 1",
        titleArabic: "غرفة للجميع - الجزء الأول",
        text: "The living room is the heart of our home. It is where the whole family comes together in the evening to relax, chat, and spend time with each other. In the centre of the room, there is a large sofa and two armchairs arranged around a coffee table. My father usually sits in the rocking chair by the window and reads the newspaper. My younger brother prefers the ottoman — he uses it as a seat while he plays on the game console connected to the television.",
        textArabic:
          "غرفة المعيشة هي قلب منزلنا. إنها المكان الذي تجتمع فيه العائلة بأكملها في المساء للاسترخاء والحديث وقضاء الوقت مع بعضهم البعض. في وسط الغرفة، توجد أريكة كبيرة وكرسيان بذراعين مرتبة حول طاولة قهوة. يجلس والدي عادةً على الكرسي الهزاز بجوار النافذة ويقرأ الجريدة. يفضل أخي الأصغر المقعد العثماني — حيث يستخدمه كمقعد أثناء لعبه على منصة الألعاب المتصلة بالتلفزيون.",
      },
      {
        partNumber: 2,
        title: "A Room for Everyone - Part 2",
        titleArabic: "غرفة للجميع - الجزء الثاني",
        text: "We have a tall bookshelf against the wall, filled with books, photo frames, and a small plant in a vase. Next to it is the TV stand with a sound bar and the Wi-Fi router tucked behind it. All the cables go into a power strip hidden behind the cabinet. The room feels warm because of the details: a soft rug on the floor, cushions on the sofa, a throw blanket on the armchair, and matching curtains. For lighting, we have a ceiling light for bright evenings and a floor lamp in the corner for softer light. On weekends, we play board games on the dining table or listen to music through the speaker.",
        textArabic:
          "لدينا رف كتب طويل على الحائط، مليء بالكتب وإطارات الصور ونبتة صغيرة في مزهرية. وبجواره يوجد حامل التلفزيون مع مكبر صوت وجهاز توجيه الواي فاي خلفه. تتصل جميع الكابلات بمشترك كهربائي مخفي خلف الخزانة. تبدو الغرفة دافئة بسبب التفاصيل: سجادة ناعمة على الأرض، ووسائد على الأريكة، وبطانية خفيفة على الكرسي بذراعين، وستائر متناسقة. للإضاءة، لدينا مصباح سقف للأمسيات المضيئة ومصباح أرضي في الزاوية لإضاءة أكثر هدوءًا. في عطلات نهاية الأسبوع، نلعب ألعاب الطاولة على طاولة الطعام أو نستمع إلى الموسيقى عبر مكبر الصوت.",
      },
      {
        partNumber: 3,
        title: "Living Room Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة لغرفة المعيشة",
        text: "Here are useful idioms and phrasal verbs for the living room:\n- 'couch potato': a lazy person who spends too much time sitting and watching TV.\n- 'put your feet up': relax, especially after a tiring day.\n- 'curl up': sit or lie in a comfortable, warm position.\n- 'tidy up': make a place neat and organised.\n- 'turn on / turn off': switch an appliance or light on or off.\n- 'gather around': come together in a group.",
        textArabic:
          "إليك مصطلحات وأفعال مركبة مفيدة لغرفة المعيشة:\n- 'couch potato': شخص كسول يقضي الكثير من الوقت في الجلوس ومشاهدة التلفزيون.\n- 'put your feet up': يسترخي، خاصة بعد يوم متعب.\n- 'curl up': يجلس أو يستلقي في وضع مريح ودافئ.\n- 'tidy up': ينظف المكان ويرتبه.\n- 'turn on / turn off': يشغل أو يطفئ جهازًا أو ضوءًا.\n- 'gather around': يجتمعون معًا في مجموعة.",
      },
    ],
    quiz: [
      {
        id: "living-room-q1",
        question: "Where does the father usually sit to read the newspaper?",
        options: [
          "On the ottoman",
          "In the rocking chair by the window",
          "On the large sofa",
          "At the dining table",
        ],
        correctIndex: 1,
        explanation:
          "The text states: 'My father usually sits in the rocking chair by the window and reads the newspaper.'",
        explanationArabic:
          "ينص النص على: 'يجلس والدي عادةً على الكرسي الهزاز بجوار النافذة ويقرأ الجريدة'.",
      },
      {
        id: "living-room-q2",
        question: "What does the younger brother use the ottoman for?",
        options: [
          "As a footrest while sleeping",
          "As a seat while playing video games",
          "To store his board games",
          "To hold the sound bar",
        ],
        correctIndex: 1,
        explanation:
          "The text states: 'My younger brother prefers the ottoman — he uses it as a seat while he plays on the game console connected to the television.'",
        explanationArabic:
          "ينص النص على: 'يفضل أخي الأصغر المقعد العثماني — حيث يستخدمه كمقعد أثناء لعبه على منصة الألعاب المتصلة بالتلفزيون'.",
      },
      {
        id: "living-room-q3",
        question: "What does the idiom 'couch potato' mean?",
        options: [
          "A person who loves gardening",
          "A chef who cooks with potatoes",
          "A lazy person who spends too much time sitting and watching TV",
          "Someone who buys furniture",
        ],
        correctIndex: 2,
        explanation:
          "A 'couch potato' refers to a lazy person who spends too much time sitting and watching television.",
        explanationArabic:
          "يشير مصطلح 'couch potato' إلى شخص كسول يقضي الكثير من الوقت في الجلوس ومشاهدة التلفزيون.",
      },
    ],
  },
  "living-room-1": {
    groupId: "living-room-1",
    groupName: "Living Room 2",
    themeTitle: "The Living Room",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Rearranging the Room",
        titleArabic: "حوار قصير: إعادة ترتيب الغرفة",
        text: "Sara: I think we should move the sofa closer to the window. What do you think?\nOmar: Maybe. But then where do we put the floor lamp?\nSara: We could put it in the corner, next to the bookshelf. It would look nice there.\nOmar: Okay. And the coffee table — should we keep it in the centre?\nSara: Yes, but let's add a rug underneath. The floor feels cold in winter.\nOmar: Good idea. I also want to hang some picture frames on that empty wall.\nSara: I was thinking the same thing! And maybe a wall clock above the TV stand.\nOmar: What about the cushions? These ones are getting old.\nSara: Let's get new cushions and a throw blanket for the armchair. Something warm.\nOmar: Sounds great. A few small changes can really make the living room feel brand new.",
        textArabic:
          "سارة: أعتقد أنه يجب علينا نقل الأريكة بالقرب من النافذة. ما رأيك؟\nعمر: ربما. ولكن أين سنضع المصباح الأرضي حينها؟\nسارة: يمكننا وضعه في الزاوية، بجوار رف الكتب. سيبدو جميلاً هناك.\nعمر: حسنًا. وطاولة القهوة — هل نبقيها في المنتصف؟\nسارة: نعم، ولكن دعنا نضع سجادة تحتها. فالأرضية تبدو باردة في الشتاء.\nعمر: فكرة جيدة. أريد أيضًا تعليق بعض إطارات الصور على ذلك الجدار الفارغ.\nسارة: كنت أفكر في الشيء نفسه! وربما ساعة حائط فوق حامل التلفزيون.\nعمر: ماذا عن الوسائد؟ هذه الوسائد أصبحت قديمة.\nسارة: دعنا نشتري وسائد جديدة وبطانية خفيفة للكرسي بذراعين. شيء دافئ.\nعمر: يبدو رائعًا. بعض التغييرات الصغيرة يمكن أن تجعل غرفة المعيشة تبدو وكأنها جديدة تمامًا.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes",
        titleArabic: "الأخطاء الشائعة",
        text: "- 'I sat on the sofa.' (Not 'I sat in the sofa'. You sit 'on' a sofa, but 'in' an armchair.)\n- 'Please turn off the light.' (Not 'Please close the light'. In English, we 'turn on' and 'turn off' lights.)\n- 'We watched TV all day.' (Not 'We watched the television whole day'.)\n- 'She put cushions on the sofa.' (Not 'in the sofa'.)\n- 'I enjoy watching movies at home.' (Not 'I enjoy to watch'. 'Enjoy' is followed by a gerund with -ing.)",
        textArabic:
          "- 'I sat on the sofa.' (وليس 'I sat in the sofa'. أنت تجلس 'on' على الأريكة، ولكن 'in' في الكرسي بذراعين.)\n- 'Please turn off the light.' (وليس 'Please close the light'. في اللغة الإنجليزية، نحن نستخدم 'turn on' و 'turn off' للإضاءة والأجهزة.)\n- 'We watched TV all day.' (وليس 'We watched the television whole day'.)\n- 'She put cushions on the sofa.' (وليس 'in the sofa'.)\n- 'I enjoy watching movies at home.' (وليس 'I enjoy to watch'. الفعل 'enjoy' يتبعه اسم فاعل ينتهي بـ -ing.)",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "British vs American Vocabulary:\n- British: 'sitting room' or 'lounge' / American: 'living room' or 'family room'\n- British: 'settee' / American: 'couch' or 'sofa'\n- British: 'telly' / American: 'TV'\n\nGrammar Rule:\n'Furniture' is an uncountable noun. Say 'a piece of furniture' or 'some furniture' — never 'a furniture' or 'furnitures'.\n\nCulture:\nComplimenting a host's living room ('What a cosy room!') is a common English social habit.",
        textArabic:
          "المفردات البريطانية مقابل الأمريكية:\n- بريطاني: 'sitting room' أو 'lounge' / أمريكي: 'living room' أو 'family room'\n- بريطاني: 'settee' / أمريكي: 'couch' أو 'sofa'\n- بريطاني: 'telly' / أمريكي: 'TV'\n\nقاعدة نحوية:\nكلمة 'Furniture' (أثاث) اسم غير معدود. قل 'a piece of furniture' أو 'some furniture' — ولا تقل أبداً 'a furniture' أو 'furnitures'.\n\nثقافة:\nإن مجاملة غرفة معيشة المضيف ('يا لها من غرفة دافئة ومريحة!') هي عادة اجتماعية شائعة في الثقافة الإنجليزية.",
      },
    ],
    quiz: [
      {
        id: "living-room-1-q1",
        question: "Where did Sara suggest placing the floor lamp?",
        options: [
          "Under the coffee table",
          "In the corner, next to the bookshelf",
          "On top of the TV stand",
          "Next to the entrance door",
        ],
        correctIndex: 1,
        explanation:
          "In the dialogue, Sara says: 'We could put it in the corner, next to the bookshelf. It would look nice there.'",
        explanationArabic:
          "في الحوار، تقول سارة: 'يمكننا وضعه في الزاوية، بجوار رف الكتب. سيبدو جميلاً هناك'.",
      },
      {
        id: "living-room-1-q2",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "Please close the light before leaving.",
          "I bought three new furnitures yesterday.",
          "I sat on the sofa and watched TV all day.",
          "I enjoy to watch movies at home.",
        ],
        correctIndex: 2,
        explanation:
          "You sit 'on' the sofa and 'turn off' lights. 'Furniture' is uncountable, and 'enjoy' takes a gerund (-ing).",
        explanationArabic:
          "أنت تجلس على الأريكة (on the sofa) وتطفئ الأضواء (turn off). كلمة 'furniture' غير معدودة، والفعل 'enjoy' يتبعه صيغة (-ing).",
      },
      {
        id: "living-room-1-q3",
        question: "What is a British English equivalent commonly used for 'living room'?",
        options: ["Settee", "Sitting room or lounge", "Den", "Closet"],
        correctIndex: 1,
        explanation:
          "In British English, people often say 'sitting room' or 'lounge' for the living room.",
        explanationArabic:
          "في الإنجليزية البريطانية، غالبًا ما يقول الناس 'sitting room' أو 'lounge' للإشارة إلى غرفة المعيشة.",
      },
    ],
  },
  farm: {
    groupId: "farm",
    groupName: "The Farm",
    themeTitle: "A Day on the Farm",
    passages: [
      {
        partNumber: 1,
        title: "A Day on the Farm - Part 1",
        titleArabic: "يوم في المزرعة - الجزء الأول",
        text: "My uncle owns a small farm about an hour from the city. Last summer, I spent a week there helping him with daily tasks. Every morning started early. At sunrise, we went to the barn to feed the animals. The cows were in a large field surrounded by a wooden fence. My uncle milked them by hand while I carried the buckets to the dairy. The chickens roamed freely in the yard, and I collected eggs from the hen house every morning.",
        textArabic:
          "يمتلك عمي مزرعة صغيرة على بعد حوالي ساعة من المدينة. في الصيف الماضي، أمضيت أسبوعًا هناك أساعده في المهام اليومية. كان كل صباح يبدأ مبكرًا. عند شروق الشمس، كنا نذهب إلى الحظيرة لإطعام الحيوانات. كانت الأبقار في حقل كبير محاط بسياج خشبي. كان عمي يحلبها يدويًا بينما كنت أحمل الدلاء إلى غرفة الألبان. وكان الدجاج يتجول بحرية في الفناء، وكنت أجمع البيض من قن الدجاج كل صباح.",
      },
      {
        partNumber: 2,
        title: "A Day on the Farm - Part 2",
        titleArabic: "يوم في المزرعة - الجزء الثاني",
        text: "The farm also had goats, sheep, and a few pigs in a muddy pen. A big sheepdog helped my uncle move the sheep from the field to the barn. The horse stayed in a separate stable and was used for riding around the property. After the animals were taken care of, we worked in the fields. My uncle drove the tractor to plough the soil, and I helped plant seeds in neat rows. The crops included wheat, corn, and sunflowers. A scarecrow stood in the middle of the wheat field to keep birds away. Water came from a well near the farmhouse, and there was an irrigation system to water the larger fields. The hay was stored in the barn for winter, stacked in large bales. In the evening, we sat on the porch of the farmhouse and watched the sunset. Life on the farm is hard work, but it taught me where our food really comes from.",
        textArabic:
          "كانت المزرعة تحتوي أيضًا على ماعز وخراف وبضعة خنازير في حظيرة موحلة. وساعد كلب حراسة كبير عمي في نقل الأغنام من الحقل إلى الحظيرة. وكان الحصان يقيم في إسطبل منفصل ويُستخدم للركوب والتجول في أنحاء المزرعة. بعد الاعتناء بالحيوانات، عملنا في الحقول. قاد عمي الجرار لحراثة التربة، وساعدت أنا في غرس البذور في صفوف مرتبة. وشملت المحاصيل القمح والذرة ودوار الشمس. ووقف فزاعة في منتصف حقل القمح لإبعاد الطيور. وجاء الماء من بئر بالقرب من منزل المزرعة، وكان هناك نظام ري لسقي الحقول الكبيرة. وتم تخزين القش في الحظيرة لفصل الشتاء، مكدسًا في بالات كبيرة. وفي المساء، جلسنا على شرفة منزل المزرعة وشاهدنا غروب الشمس. الحياة في المزرعة عمل شاق، لكنها علمتني من أين يأتي طعامنا حقًا.",
      },
      {
        partNumber: 3,
        title: "Farm Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة عن المزرعة",
        text: "Here are key farm idioms and phrasal verbs:\n- 'reap what you sow': get results based on your actions (good or bad).\n- 'the cream of the crop': the very best of a group.\n- 'till the soil': prepare the ground for planting.\n- 'round up': gather animals or people together.\n- 'make hay while the sun shines': take advantage of a good situation while it lasts.\n- 'separate the wheat from the chaff': distinguish the good from the bad.",
        textArabic:
          "إليك أهم المصطلحات والأفعال المركبة المتعلقة بالمزرعة:\n- 'reap what you sow': تحصد ما تزرعه (تحصل على نتائج بناءً على أفعالك).\n- 'the cream of the crop': نخبة الشيء أو أفضل ما في المجموعة.\n- 'till the soil': يفلح أو يحرث التربة استعدادًا للزراعة.\n- 'round up': يجمع الحيوانات أو الأشخاص معًا.\n- 'make hay while the sun shines': يغتنم الفرصة ما دامت متاحة.\n- 'separate the wheat from the chaff': يميز الغث من السمين (يميز الجيد من السيئ).",
      },
    ],
    quiz: [
      {
        id: "farm-q1",
        question: "What did the narrator collect from the hen house every morning?",
        options: ["Fresh milk", "Eggs", "Wheat seeds", "Clean water"],
        correctIndex: 1,
        explanation: "The text states: 'I collected eggs from the hen house every morning.'",
        explanationArabic: "ينص النص على: 'كنت أجمع البيض من قن الدجاج كل صباح'.",
      },
      {
        id: "farm-q2",
        question: "Why was a scarecrow placed in the middle of the wheat field?",
        options: [
          "To measure the wind",
          "To keep birds away",
          "To support tall plants",
          "To mark property borders",
        ],
        correctIndex: 1,
        explanation:
          "The text mentions that a scarecrow stood in the middle of the wheat field to keep birds away.",
        explanationArabic: "يذكر النص أن الفزاعة وُضعت في منتصف حقل القمح لإبعاد الطيور.",
      },
      {
        id: "farm-q3",
        question: "What does the idiom 'the cream of the crop' mean?",
        options: [
          "The very best of a group",
          "To gather farm animals",
          "To waste time working",
          "Fresh milk from the cow",
        ],
        correctIndex: 0,
        explanation:
          "'The cream of the crop' means the very best part or top individuals of a group.",
        explanationArabic: "'The cream of the crop' تعني أفضل ما في المجموعة أو نخبة الشيء.",
      },
    ],
  },
  "farm-1": {
    groupId: "farm-1",
    groupName: "The Farm 1",
    themeTitle: "Farm Operations & Nuances",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Visiting the Farm",
        titleArabic: "حوار قصير: زيارة المزرعة",
        text: "Kareem: Wow, this farm is huge! What do we do first?\nUncle: Let's feed the chickens. Grab that bucket of grain.\nKareem: They're so fast! How many eggs do they lay each day?\nUncle: About fifteen to twenty. You can collect them from the hen house later.\nKareem: What about the cows? Can I try milking one?\nUncle: Sure, but you need to be gentle. Sit on the stool and pull slowly.\nKareem: This is harder than it looks! What's in that big building?\nUncle: That's the barn. We store hay and equipment there.\nKareem: And what's that machine in the field?\nUncle: That's the tractor. After lunch, I'll teach you how to drive it.",
        textArabic:
          "كريم: واو، هذه المزرعة ضخمة جدًا! ماذا سنفعل أولاً؟\nالعم: دعنا نطعم الدجاج. خذ دلو الحبوب هذا.\nكريم: إنها سريعة جدًا! كم بيضة تضع كل يوم؟\nالعم: حوالي خمس عشرة إلى عشرين بيضة. يمكنك جمعها من قن الدجاج لاحقًا.\nكريم: وماذا عن الأبقار؟ هل يمكنني محاولة حلب واحدة؟\nالعم: بالتأكيد، لكن يجب أن تكون لطيفًا. اجلس على المقعد الصغير واسحب ببطء.\nكريم: هذا أصعب مما يبدو! ماذا يوجد في ذلك المبنى الكبير؟\nالعم: تلك هي الحظيرة. نحن نخزن القش والمعدات هناك.\nكريم: وما تلك الآلة في الحقل؟\nالعم: ذلك هو الجرار الزراعي. بعد الغداء، سأعلمك كيفية قيادته.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes",
        titleArabic: "الأخطاء الشائعة",
        text: "- 'The farmer raises / keeps animals.' (Not 'The farmer grows animals'. 'Grow' is for plants/crops; 'raise' or 'keep' is for animals.)\n- 'The sheep is eating grass.' (Not 'eating grasses'. 'Grass' is uncountable in this context.)\n- 'He fed the chickens this morning.' (Not 'feeded'. 'Feed' is irregular: feed-fed-fed.)\n- 'There are many sheep on the farm.' (Not 'sheeps'. 'Sheep' has the same form in singular and plural.)\n- 'The cow gives us milk.' (Not 'a milk'. 'Milk' is uncountable.)",
        textArabic:
          "- 'The farmer raises / keeps animals.' (وليس 'grows animals'. كلمة 'grow' تُستخدم للنباتات والمحاصيل، بينما 'raise' أو 'keep' للحيوانات.)\n- 'The sheep is eating grass.' (وليس 'grasses'. كلمة 'grass' غير معدودة في هذا السياق.)\n- 'He fed the chickens this morning.' (وليس 'feeded'. الفعل 'feed' غير قياسي: feed-fed-fed.)\n- 'There are many sheep on the farm.' (وليس 'sheeps'. كلمة 'sheep' لها نفس الصيغة في المفرد والجمع.)\n- 'The cow gives us milk.' (وليس 'a milk'. كلمة 'milk' غير معدودة.)",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "- Farm vs Ranch: In British English, 'farm' is universal. In American English, a 'ranch' specifically raises cattle or horses on large open land, while a 'farm' grows crops or keeps smaller animals.\n- British vs American: British 'plough' / American 'plow'; British 'maize' / American 'corn'; British 'cockerel' / American 'rooster'.\n- Collective Nouns: English uses specific collective terms: 'a herd of cows', 'a flock of sheep', 'a litter of piglets', 'a pack of dogs'.\n- Farm-to-Table: 'Farm-to-table' describes fresh food supplied directly from local farms to consumers or restaurants.",
        textArabic:
          "- Farm مقابل Ranch: في الإنجليزية البريطانية، تُعد كلمة 'farm' المصطلح العام. وفي الإنجليزية الأمريكية، يشير 'ranch' تحديدًا إلى تربية الماشية أو الخيول على أراضٍ واسعة، بينما تزرع 'farm' المحاصيل أو تربي حيوانات أصغر.\n- بريطاني مقابل أمريكي: البريطاني 'plough' مقابل الأمريكي 'plow'؛ البريطاني 'maize' مقابل الأمريكي 'corn'؛ البريطاني 'cockerel' مقابل الأمريكي 'rooster'.\n- أسماء المجموعات: تستخدم الإنجليزية أسماء جمع مميزة: 'a herd of cows' (قطيع أبقار)، 'a flock of sheep' (قطيع أغنام)، 'a litter of piglets' (مجموعة خنازير صغيرة)، 'a pack of dogs' (مجموعة كلاب).\n- من المزرعة إلى المائدة: يصف مصطلح 'Farm-to-table' الطعام الطازج الذي ينتقل مباشرة من المزارع إلى المستهلكين أو المطاعم.",
      },
    ],
    quiz: [
      {
        id: "farm-1-q1",
        question: "How many eggs do the chickens lay each day according to the uncle?",
        options: ["Five to ten", "About fifteen to twenty", "Over fifty", "Only two or three"],
        correctIndex: 1,
        explanation:
          "The uncle tells Kareem that the chickens lay about fifteen to twenty eggs each day.",
        explanationArabic: "يخبر العم كريم أن الدجاج يضع حوالي خمس عشرة إلى عشرين بيضة كل يوم.",
      },
      {
        id: "farm-1-q2",
        question: "Which sentence is grammatically correct?",
        options: [
          "The farmer grows ten cows.",
          "There are many sheeps in the field.",
          "There are many sheep on the farm.",
          "He feeded the animals yesterday.",
        ],
        correctIndex: 2,
        explanation:
          "'Sheep' is both singular and plural (one sheep, ten sheep), so 'There are many sheep on the farm' is correct.",
        explanationArabic:
          "كلمة 'Sheep' هي مفرد وجمع في آن واحد (one sheep, ten sheep)، لذا فإن الجملة 'There are many sheep on the farm' هي الصحيحة.",
      },
      {
        id: "farm-1-q3",
        question: "What is the collective noun used in English for a group of cows?",
        options: ["A flock of cows", "A herd of cows", "A pack of cows", "A litter of cows"],
        correctIndex: 1,
        explanation: "In English, the proper collective noun for cows is 'a herd of cows'.",
        explanationArabic:
          "في اللغة الإنجليزية، اسم الجمع الصحيح للأبقار هو 'a herd of cows' (قطيع من الأبقار).",
      },
    ],
  },
  "butterfly-garden": {
    groupId: "butterfly-garden",
    groupName: "Butterfly Garden",
    themeTitle: "The Garden: Life and Growth",
    passages: [
      {
        partNumber: 1,
        title: "My Grandmother's Garden - Part 1",
        titleArabic: "حديقة جدتي - الجزء الأول",
        text: "Every spring, my grandmother spends her mornings in the garden behind her house. She grows flowers, vegetables, and herbs, and she takes care of everything herself.\n\nThe garden has a small lawn surrounded by a low hedge. Along the fence, there are flower beds full of roses, tulips, and sunflowers. She waters them every morning with a hose or a watering can, depending on how much rain there has been. If the soil is too dry, she uses a sprinkler.",
        textArabic:
          "في كل ربيع، تقضي جدتي صباحها في الحديقة الواقعة خلف منزلها. تزرع الزهور والخضروات والأعشاب، وتعتني بكل شيء بنفسها.\n\nتحتوي الحديقة على مساحة عشبية صغيرة محاطة بسياج نباتي منخفض. على طول السور، توجد أحواض زهور مليئة بالورود والتوليب وعباد الشمس. تسقيها كل صباح بخرطوم أو مرشة مياه، اعتمادًا على كمية الأمطار المتساقطة. وإذا كانت التربة جافة جدًا، فإنها تستخدم رشاش الماء.",
      },
      {
        partNumber: 2,
        title: "My Grandmother's Garden - Part 2",
        titleArabic: "حديقة جدتي - الجزء الثاني",
        text: "In the vegetable patch, she plants tomatoes, carrots, lettuce, and peppers. She prepares the soil with a rake and a shovel before planting the seeds. Once the seedlings start to grow, she adds fertiliser and removes any weeds by hand or with a small trowel.\n\nThere is a greenhouse at the back of the garden where she grows herbs like basil and mint all year round. Inside, she keeps pots on wooden shelves and uses a thermometer to check the temperature. She also has a compost bin where she puts leftover food and garden waste. After a few months, it turns into rich compost that she mixes into the soil.\n\nMy grandmother says that gardening keeps her active and calm. I enjoy helping her — especially when it is time to pick the ripe vegetables and bring them to the kitchen.",
        textArabic:
          "في حوض الخضروات، تزرع الطماطم والجزر والخس والفلفل. تُجهز التربة بالمشط الزراعي والمجرفة قبل زراعة البذور. وبمجرد أن تبدأ الشتلات في النمو، تضيف السماد وتزيل أي أعشاب ضارة يدويًا أو باستخدام مجرفة يدوية صغيرة.\n\nيوجد بيت زجاجي (دفيئة) في الجزء الخلفي من الحديقة حيث تزرع أعشابًا مثل الريحان والنعناع طوال العام. في الداخل، تحتفظ بالأواني على أرفف خشبية وتستخدم مقياس حرارة لفحص درجة الحرارة. لديها أيضًا صندوق سماد عضوي تضع فيه بقايا الطعام ومخلفات الحديقة. وبعد بضعة أشهر، يتحول إلى سماد غني تخلطه بالتربة.\n\nتقول جدتي إن البستنة تبقيها نشيطة وهادئة. وأنا أستمتع بمساعدتها — خاصة عندما يحين وقت قطف الخضار الناضجة ونقلها إلى المطبخ.",
      },
      {
        partNumber: 3,
        title: "Garden Idioms & Key Expressions",
        titleArabic: "مصطلحات وتعبيرات الحديقة",
        text: "English features many expressive idioms inspired by gardens and plants:\n- 'Green thumb' (or 'green fingers'): a natural talent for growing plants.\n- 'Nip it in the bud': to stop a problem before it gets worse.\n- 'Come up roses': to turn out well or have a successful result.\n- 'Put down roots': to settle in a place and feel at home.\n- 'In full bloom': flowers fully open; at the peak of beauty.",
        textArabic:
          "تتميز اللغة الإنجليزية بالعديد من التعبيرات الاصطلاحية المستوحاة من الحدائق والنباتات:\n- 'Green thumb' (أو 'green fingers'): موهبة فطرية في زراعة النباتات والاعتناء بها.\n- 'Nip it in the bud': إيقاف المشكلة في مهدها قبل أن تتفاقم.\n- 'Come up roses': أن تسير الأمور على ما يرام وتحقق نتيجة ممتازة.\n- 'Put down roots': الاستقرار في مكان ما والشعور بالانتماء والراحة فيه.\n- 'In full bloom': تفتح الأزهار بالكامل وبلوغها ذروة جمالها.",
      },
    ],
    quiz: [
      {
        id: "butterfly-garden-q1",
        question: "What flowers grow along the fence in the grandmother's garden?",
        options: [
          "Roses, tulips, and sunflowers",
          "Lilies, daisies, and orchids",
          "Violets, daffodils, and lavender",
          "Carnations, asters, and marigolds",
        ],
        correctIndex: 0,
        explanation:
          "The text states: 'Along the fence, there are flower beds full of roses, tulips, and sunflowers.'",
        explanationArabic:
          "ينص النص على: 'على طول السور، توجد أحواض زهور مليئة بالورود والتوليب وعباد الشمس.'",
      },
      {
        id: "butterfly-garden-q2",
        question: "What does the grandmother grow in her greenhouse all year round?",
        options: [
          "Carrots and lettuce",
          "Herbs like basil and mint",
          "Sunflowers and roses",
          "Tomatoes and peppers",
        ],
        correctIndex: 1,
        explanation:
          "The text explains that there is a greenhouse where she grows herbs like basil and mint all year round.",
        explanationArabic:
          "يوضح النص أن هناك دفيئة زراعية تزرع فيها أعشابًا مثل الريحان والنعناع طوال العام.",
      },
      {
        id: "butterfly-garden-q3",
        question: "What does the idiom 'nip it in the bud' mean?",
        options: [
          "To harvest ripe vegetables early",
          "To water plants with a sprinkler",
          "To stop a problem before it gets worse",
          "To settle down and build a home",
        ],
        correctIndex: 2,
        explanation:
          "'Nip it in the bud' means to stop or prevent a problem early before it spreads or worsens.",
        explanationArabic:
          "يعني تعبير 'nip it in the bud' إيقاف المشكلة أو منعها مبكرًا قبل أن تنتشر أو تتفاقم.",
      },
    ],
  },
  "butterfly-garden-1": {
    groupId: "butterfly-garden-1",
    groupName: "Butterfly Garden Care",
    themeTitle: "Garden Conversations & Insights",
    passages: [
      {
        partNumber: 1,
        title: "Dialogue: Over the Garden Fence",
        titleArabic: "حوار: عبر سياج الحديقة",
        text: "Ali and Mrs. B chat over the garden fence about plant care:\nAli: 'Your garden looks wonderful this year! How do you keep it so green?'\nMrs B: 'Thank you! I water the lawn every morning and add fertiliser once a month.'\nAli: 'I tried growing tomatoes last summer, but they didn't survive.'\nMrs B: 'Did you use good soil? Tomatoes need rich compost and plenty of sunlight.'\nAli: 'I think the soil was too dry. I didn't water them enough.'\nMrs B: 'That's probably it. You should also use a sprinkler or a drip hose — it saves time.'\nAli: 'What about weeds? They keep taking over my flower beds.'\nMrs B: 'Pull them out early, before they spread. A small trowel helps a lot.\nAli: 'Do you grow anything in winter?'\nMrs B: 'Yes, I use the greenhouse for herbs. Basil and mint grow all year if you keep it warm.'",
        textArabic:
          "علي والسيدة بي يتحدثان عبر سياج الحديقة حول العناية بالنباتات:\nعلي: 'حديقتك تبدو رائعة هذا العام! كيف تحافظين على خضرتها ونضارتها هكذا؟'\nالسيدة بي: 'شكرًا لك! أسقي العشب كل صباح وأضيف السماد مرة واحدة في الشهر.'\nعلي: 'حاولت زراعة الطماطم في الصيف الماضي، لكنها لم تعش.'\nالسيدة بي: 'هل استخدمت تربة جيدة؟ تحتاج الطماطم إلى سماد عضوي غني وضوء شمس وافر.'\nعلي: 'أعتقد أن التربة كانت جافة جدًا؛ لم أسقِها بما يكفي.'\nالسيدة بي: 'هذا هو السبب على الأرجح. يجب عليك أيضًا استخدام مرشة أو خرطوم تنقيط فهو يوفر الوقت.'\nعلي: 'ماذا عن الأعشاب الضارة؟ إنها تستمر في اجتياح أحواض الزهور لدي.'\nالسيدة بي: 'اقتلعها مبكرًا قبل أن تنتشر، فالمجرفة اليدوية الصغيرة تساعد كثيرًا.'\nعلي: 'هل تزرعين أي شيء في الشتاء؟'\nالسيدة بي: 'نعم، أستخدم البيت الزجاجي للأعشاب. ينمو الريحان والنعناع طوال العام إذا حافظت على دفئه.'",
      },
      {
        partNumber: 2,
        title: "Phrasal Verbs & Common Mistakes",
        titleArabic: "أفعال مركبة وأخطاء شائعة",
        text: "Useful Gardening Phrasal Verbs:\n- 'Dig up': remove from the ground; also discover information.\n- 'Weed out': remove unwanted plants or items.\n- 'Branch out': try something new or expand.\n- 'Grow on someone': gradually become liked.\n\nCommon Mistakes to Avoid:\n- Use 'in the soil' or 'in the ground' for gardening (not 'in the earth').\n- Say 'the flowers are dead' or 'have died' (never 'are died').\n- Say 'I have been watering the plants since morning' for ongoing actions.\n- Say 'in the garden' (enclosed area), not 'on the garden'.\n- Use 'cut' for past tense ('I cut the grass yesterday', not 'cutted').",
        textArabic:
          "أفعال مركبة مفيدة في البستنة:\n- 'Dig up': يقتلع من الأرض؛ وأيضًا: يكتشف معلومات.\n- 'Weed out': يتخلص من النباتات غير المرغوب فيها أو العناصر الزائدة.\n- 'Branch out': يجرب شيئًا جديدًا أو يتوسع.\n- 'Grow on someone': ينال الإعجاب تدريجيًا.\n\nأخطاء شائعة يجب تجنبها:\n- استخدم 'in the soil' أو 'in the ground' عند الحديث عن الزراعة (وليس 'in the earth').\n- قل 'the flowers are dead' أو 'have died' (ولا تقل أبدًا 'are died').\n- قل 'I have been watering the plants since morning' للأفعال المستمرة منذ الصباح.\n- قل 'in the garden' للمساحات المحاطة (وليس 'on the garden').\n- استخدم 'cut' في صيغة الماضي ('I cut the grass yesterday'، وليس 'cutted').",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية واستخدامات لغوية",
        text: "Gardening culture and vocabulary in English:\n- Garden vs Yard: In British English, 'garden' refers to the outdoor space around a house. In American English, 'yard' is more common for the grass area, while 'garden' specifically means a planted flower or vegetable area.\n- Allotments: In the UK, allotments are small plots of land rented by individuals to grow fruits and vegetables. They are very popular and foster strong community bonds.\n- Garden Centre vs Nursery: A garden centre sells plants, tools, and garden furniture, while a nursery specializes in propagating and growing young plants and seedlings.\n- Lawn Care Verbs: English has dedicated collocations like 'mow the lawn', 'trim the hedge', 'prune the roses', and 'rake the leaves'.",
        textArabic:
          "ثقافة البستنة والمفردات في اللغة الإنجليزية:\n- حديقة (Garden) مقابل فناء (Yard): في الإنجليزية البريطانية، تشير كلمة 'garden' إلى المساحة الخارجية المحيطة بالمنزل. وفي الإنجليزية الأمريكية، تُعد كلمة 'yard' أكثر شيوعًا لمساحة العشب، بينما تعني 'garden' تحديدًا المنطقة المزروعة بالزهور أو الخضار.\n- الحدائق المجتمعية المستأجرة (Allotments): في بريطانيا، تُعد الـ allotments قطع أراضٍ صغيرة يستأجرها الأفراد لزراعة الفواكه والخضار وتتمتع بشعبية واسعة.\n- مركز البستنة والمشتل: يبيع مركز البستنة (Garden Centre) النباتات والأدوات وأثاث الحدائق، بينما يتخصص المشتل (Nursery) في إكثار وتربية النباتات الصغيرة والشتلات.\n- أفعال العناية بالحديقة: تحتوي الإنجليزية على متلازمات لغوية دقيقة مثل: 'mow the lawn' (قص العشب)، 'trim the hedge' (تهذيب السياج)، 'prune the roses' (تقليم الورود)، و 'rake the leaves' (جرف أوراق الشجر).",
      },
    ],
    quiz: [
      {
        id: "butterfly-garden-1-q1",
        question: "What two things did Mrs. B say tomatoes need to survive?",
        options: [
          "Rich compost and plenty of sunlight",
          "Dry sand and complete darkness",
          "Cold water and shaded locations",
          "Chemical sprays and gravel",
        ],
        correctIndex: 0,
        explanation: "Mrs. B mentions: 'Tomatoes need rich compost and plenty of sunlight.'",
        explanationArabic: "تذكر السيدة بي: 'تحتاج الطماطم إلى سماد عضوي غني وضوء شمس وافر.'",
      },
      {
        id: "butterfly-garden-1-q2",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "I cutted the grass yesterday.",
          "The flowers are died.",
          "I planted a seed in the soil.",
          "She grows vegetables on her garden.",
        ],
        correctIndex: 2,
        explanation:
          "'I planted a seed in the soil' is correct because 'soil' is the standard word for gardening soil, and prepositions/tenses are correct.",
        explanationArabic:
          "'I planted a seed in the soil' هي الجملة الصحيحة لأن كلمة 'soil' هي المصطلح القياسي للتربة الزراعية.",
      },
      {
        id: "butterfly-garden-1-q3",
        question: "In British English, what is an 'allotment'?",
        options: [
          "A small rented plot of land used to grow food",
          "A large shopping mall for gardening tools",
          "An automatic lawn mower system",
          "A type of rare butterfly",
        ],
        correctIndex: 0,
        explanation:
          "In British culture, allotments are small rented plots of land where people cultivate fruits, vegetables, and flowers.",
        explanationArabic:
          "في الثقافة البريطانية، الـ allotments هي قطع أراضٍ صغيرة مستأجرة يقوم الأفراد بزراعة الخضار والفواكه والزهور فيها.",
      },
    ],
  },
  "amusement-park": {
    groupId: "amusement-park",
    groupName: "The Park",
    themeTitle: "A Sunday in the Park",
    passages: [
      {
        partNumber: 1,
        title: "A Sunday in the Park - Part 1",
        titleArabic: "يوم أحد في الحديقة - الجزء الأول",
        text: "Every Sunday, my family and I go to the park near our neighbourhood. It is a large green space with something for everyone. The children head straight to the playground, where there are swings, slides, and a climbing frame. My younger sister loves the seesaw, while my brother prefers the monkey bars. There is soft ground under the equipment, so it is safe if they fall. My parents usually sit on a bench near the pond. The pond has ducks and sometimes small fish. There is a wooden bridge across it and a narrow path that goes around the water.",
        textArabic:
          "كل يوم أحد، أذهب أنا وعائلتي إلى الحديقة القريبة من حيّنا. إنها مساحة خضراء واسعة تحتوي على ما يناسب الجميع. يتجه الأطفال مباشرة إلى ملعب الألعاب، حيث توجد الأراجيح والزلاقات وهيكل التسلق. تحب أختي الصغرى أرجوحة التوازن، بينما يفضل أخي عقلة التسلق. وتوجد أرضية ناعمة تحت الألعاب، لذا فهي آمنة إذا سقطوا. وعادة ما يجلس والداي على مقعد بالقرب من البركة. وتضم البركة بطًا وأحيانًا أسماكًا صغيرة. وهناك جسر خشبي يعبرها وممر ضيق يلتف حول المياه.",
      },
      {
        partNumber: 2,
        title: "A Sunday in the Park - Part 2",
        titleArabic: "يوم أحد في الحديقة - الجزء الثاني",
        text: "I like to jog on the running track that circles the park. There is also a cycling lane next to it for people on bicycles. Near the entrance, there is a water fountain where joggers stop to drink. In the centre of the park, there is a large open field where families have picnics on blankets. Some people play football or throw a frisbee. There are tall trees that give shade, and flower beds with roses and lavender along the main path. The park also has a small café near the car park, public toilets, and a few rubbish bins placed around the paths. I always feel relaxed after a visit.",
        textArabic:
          "أحب الركض على مضمار الجري الذي يحيط بالحديقة. ويوجد أيضًا مسار للدراجات بجواره للأشخاص الذين يركبون الدراجات. بالقرب من المدخل، توجد نافورة مياه حيث يتوقف ممارسو رياضة الجري للشرب. وفي وسط الحديقة، يوجد حقل مفتوح كبير حيث تقيم العائلات نزهات على البسط. ويلعب بعض الأشخاص كرة القدم أو يرمون القرص الطائر. وتوجد أشجار طويلة تمنح الظل، وأحواض زهور بها ورود وخزامى على طول الممر الرئيسي. كما تضم الحديقة مقهى صغيرًا بالقرب من موقف السيارات، ودورات مياه عامة، وبعض سلال المهملات الموزعة حول الممرات. ودائمًا ما أشعر بالاسترخاء بعد كل زيارة.",
      },
      {
        partNumber: 3,
        title: "Park Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة للحديقة",
        text: "Here are key park idioms and phrases:\n- 'a walk in the park': something very easy ('The exam was a walk in the park').\n- 'go for a stroll': take a slow, relaxed walk ('Let's go for a stroll after lunch').\n- 'hang out': spend time relaxing somewhere ('We like to hang out in the park on weekends').\n- 'run into': meet someone unexpectedly ('I ran into my old teacher while jogging').\n- 'cool down': become less hot and rest after exercise ('After running, I sat by the fountain to cool down').\n- 'take a breather': pause to rest ('Let's take a breather on this bench').",
        textArabic:
          "إليك أهم المصطلحات والعبارات المتعلقة بالحديقة:\n- 'a walk in the park': شيء سهل للغاية ('كان الامتحان سهلاً للغاية').\n- 'go for a stroll': القيام بنزهة مشي بطيئة ومريحة ('دعنا نذهب للتنزه بعد الغداء').\n- 'hang out': قضاء وقت للاسترخاء في مكان ما ('نحب قضاء الوقت في الحديقة في عطلات نهاية الأسبوع').\n- 'run into': مقابلة شخص ما دون تخطيط ('قابلت معلمي القديم بالصدفة أثناء الركض').\n- 'cool down': التهدئة والراحة بعد ممارسة الرياضة ('بعد الجري، جلست بجانب النافورة للاستراحة').\n- 'take a breather': أخذ قسط من الراحة ('دعنا نأخذ استراحة قصيرة على هذا المقعد').",
      },
    ],
    quiz: [
      {
        id: "amusement-park-q1",
        question: "Why is it safe for children if they fall at the playground?",
        options: [
          "There is soft ground under the equipment",
          "The equipment is very low to the ground",
          "Adults always catch them",
          "There are safety nets everywhere",
        ],
        correctIndex: 0,
        explanation:
          "The text explains that there is soft ground under the playground equipment, making it safe if children fall.",
        explanationArabic:
          "يوضح النص أن هناك أرضية ناعمة تحت معدات الملعب، مما يجعلها آمنة إذا سقط الأطفال.",
      },
      {
        id: "amusement-park-q2",
        question: "Where do families have picnics on blankets in the park?",
        options: [
          "On the wooden bridge",
          "Inside the small café",
          "In the large open field in the centre",
          "Along the running track",
        ],
        correctIndex: 2,
        explanation:
          "The passage states that in the centre of the park, there is a large open field where families have picnics on blankets.",
        explanationArabic:
          "ينص النص على أنه في وسط الحديقة، يوجد حقل مفتوح كبير حيث تقيم العائلات نزهات على البسط.",
      },
      {
        id: "amusement-park-q3",
        question: "What does the idiom 'a walk in the park' mean?",
        options: [
          "A very long journey",
          "Something very easy",
          "An intense workout",
          "A relaxing picnic",
        ],
        correctIndex: 1,
        explanation:
          "'A walk in the park' is an idiom meaning something that is very easy and simple to do.",
        explanationArabic:
          "'A walk in the park' هو مصطلح يعني شيئًا سهلاً وبسيطًا للغاية في إنجازه.",
      },
    ],
  },
  "amusement-park-1": {
    groupId: "amusement-park-1",
    groupName: "The Park (Part 2)",
    themeTitle: "Park Activities & Usage",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Meeting at the Park",
        titleArabic: "حوار قصير: لقاء في الحديقة",
        text: "Yusuf: Hey! I didn't expect to see you here. Are you jogging?\nHana: Yes, I try to run around the track twice every morning.\nYusuf: I brought my nephew to the playground. He's on the swings.\nHana: This park is great for kids — so much space.\nYusuf: After the playground, we'll feed the ducks by the pond.\nHana: I love that spot. The bridge over the pond is really pretty.\nYusuf: Have you been to the new café near the car park?\nHana: Not yet! Is it good?\nYusuf: Yes, fresh juice and sandwiches. Let's go after your run.",
        textArabic:
          "يوسف: مرحبًا! لم أتوقع رؤيتك هنا. هل تمارسين رياضة الجري؟\nهناء: نعم، أحاول الركض حول المضمار مرتين كل صباح.\nيوسف: لقد أحضرت ابن أخي إلى الملعب. إنه على الأراجيح.\nهناء: هذه الحديقة رائعة للأطفال — ففيها مساحة واسعة جدًا.\nيوسف: بعد الملعب، سنطعم البط بجوار البركة.\nهناء: أنا أحب ذلك المكان. الجسر فوق البركة جميل حقًا.\nيوسف: هل زرتِ المقهى الجديد بالقرب من موقف السيارات؟\nهناء: ليس بعد! هل هو جيد؟\nيوسف: نعم، عصائر طازجة وشطائر. دعنا نذهب بعد انتهائك من الجري.",
      },
      {
        partNumber: 2,
        title: "More Park Phrases & Expressions",
        titleArabic: "المزيد من عبارات وتعبيرات الحديقة",
        text: "Here are additional useful phrases for the park:\n- 'play catch': throw a ball back and forth ('The children were playing catch on the field').\n- 'out in the open': outside, in an unenclosed space ('It feels great to be out in the open after a week indoors').\n- 'off the beaten path': away from popular routes ('There's a quiet trail off the beaten path behind the pond').\n- 'curl up': sit comfortably in a relaxed position ('She curled up on the grass with a book').",
        textArabic:
          "إليك المزيد من العبارات المفيدة المتعلقة بالحديقة:\n- 'play catch': رمي الكرة وتبادلها ذهابًا وإيابًا ('كان الأطفال يلعبون رمي الكرة في الحقل').\n- 'out in the open': في الهواء الطلق وفي مساحة غير مغلقة ('إنه شعور رائع بالتواجد في الهواء الطلق بعد قضاء أسبوع في الداخل').\n- 'off the beaten path': بعيدًا عن الطرق والمسارات الشائعة ('يوجد مسار هادئ بعيد عن الطرق المألوفة خلف البركة').\n- 'curl up': الجلوس براحة واسترخاء ('استرخت جالسة على العشب وبيدها كتاب').",
      },
      {
        partNumber: 3,
        title: "Common Mistakes & Cultural Notes",
        titleArabic: "أخطاء شائعة وملاحظات ثقافية",
        text: "Common Mistakes:\n- Say 'go for a walk' or 'go jogging' (not 'make a walk' or 'make jogging').\n- Say 'throw rubbish in the bin' (not 'throw rubbish on the floor/ground').\n- Say 'sit on a bench' (not 'sit in a bench').\n\nCultural & Usage Notes:\n- British vs American English: British speakers say 'rubbish bin' and 'car park', while American speakers say 'trash can' and 'parking lot'.\n- Public parks in many English-speaking countries encourage community activities like parkruns, weekend sports leagues, and feeding ducks with grain instead of bread.",
        textArabic:
          "أخطاء شائعة:\n- قل 'go for a walk' أو 'go jogging' (وليس 'make a walk' أو 'make jogging').\n- قل 'throw rubbish in the bin' (وليس 'throw rubbish on the floor/ground').\n- قل 'sit on a bench' (وليس 'sit in a bench').\n\nملاحظات ثقافية واستخدامية:\n- الإنجليزية البريطانية مقابل الأمريكية: يستخدم المتحدثون البريطانيون 'rubbish bin' و 'car park'، بينما يستخدم الأمريكيون 'trash can' و 'parking lot'.\n- تشجع الحدائق العامة في العديد من البلدان الناطقة باللغة الإنجليزية الأنشطة المجتمعية مثل سباقات الجري الجماعية، ودوريات الرياضة في عطلة نهاية الأسبوع، وإطعام البط بالحبوب بدلاً من الخبز.",
      },
    ],
    quiz: [
      {
        id: "amusement-park-1-q1",
        question: "What does Yusuf plan to do after visiting the playground?",
        options: [
          "Jog around the track",
          "Feed the ducks by the pond",
          "Go straight to the car park",
          "Play football on the open field",
        ],
        correctIndex: 1,
        explanation:
          "In the dialogue, Yusuf says: 'After the playground, we'll feed the ducks by the pond.'",
        explanationArabic: "يذكر يوسف في الحوار: 'بعد الملعب، سنطعم البط بجوار البركة'.",
      },
      {
        id: "amusement-park-1-q2",
        question: "What does the phrase 'off the beaten path' mean?",
        options: [
          "On the main asphalt road",
          "Away from popular routes",
          "Directly at the entrance",
          "Inside the public café",
        ],
        correctIndex: 1,
        explanation:
          "'Off the beaten path' refers to a place or trail that is away from the main, heavily used routes.",
        explanationArabic:
          "'Off the beaten path' تشير إلى مكان أو مسار بعيد عن الطرق والمسارات الرئيسية المزدحمة.",
      },
      {
        id: "amusement-park-1-q3",
        question: "Which word is used in British English for the American 'trash can'?",
        options: ["Car park", "Rubbish bin", "Waste box", "Litter pack"],
        correctIndex: 1,
        explanation:
          "In British English, 'rubbish bin' is used for what American English calls a 'trash can'.",
        explanationArabic:
          "في الإنجليزية البريطانية، تُستخدم كلمة 'rubbish bin' للإشارة إلى ما يُعرف بـ 'trash can' في الإنجليزية الأمريكية.",
      },
    ],
  },
  playground: {
    groupId: "playground",
    groupName: "The Playground",
    themeTitle: "After School at the Playground",
    passages: [
      {
        partNumber: 1,
        title: "After School at the Playground - Part 1",
        titleArabic: "بعد المدرسة في الملعب - الجزء الأول",
        text: "Every afternoon after school, the playground near our building fills with children. It is a bright, colourful space with equipment for different ages.\n\nThe younger children run straight to the sandbox to build castles and dig with small shovels. Next to the sandbox, there is a row of swings — some for toddlers with safety bars, and bigger ones for older children. My little sister always asks me to push her higher.\n\nThe climbing wall is very popular with the older children. It has coloured holds and a soft mat underneath for safety. Beside it, there is a tall slide with a ladder. The children climb up, slide down, and run back to do it again.",
        textArabic:
          "في كل فترة ما بعد الظهر بعد المدرسة، يمتلئ الملعب القريب من مبنانا بالأطفال. إنه مكان مشرق وملون يحتوي على معدات مخصصة لمختلف الأعمار.\n\nيركض الأطفال الأصغر سنًا مباشرة إلى صندوق الرمل لبناء القلاع والحفر بمجارف صغيرة. وبجانب صندوق الرمل، يوجد صف من الأراجيح — بعضها للأطفال الصغار مزودة بقضبان أمان، وأخرى أكبر للأطفال الأكبر سنًا. ودائمًا ما تطلب مني أختي الصغيرة أن أدفعها لأعلى.\n\nيحظى جدار التسلق بشعبية كبيرة بين الأطفال الأكبر سنًا. ويحتوي على مقابض ملونة وحصيرة ناعمة تحته لضمان السلامة. وبجانبه، توجد زحلوقة طويلة بها سلم. يتسلق الأطفال لأعلى، ثم يتزحلقون لأسفل، ويركضون عائدين لتكرار ذلك مجددًا.",
      },
      {
        partNumber: 2,
        title: "After School at the Playground - Part 2",
        titleArabic: "بعد المدرسة في الملعب - الجزء الثاني",
        text: "In the centre of the playground, there is a roundabout that spins when you push it, and a seesaw where two children sit on opposite ends and go up and down. There is also a set of monkey bars that stretches across a metal frame — only the bravest children make it to the other side.\n\nAround the edges, there are benches where parents sit and watch. A drinking fountain stands near the entrance, and there are signs reminding everyone to play safely and take turns.\n\nThe ground is covered with rubber tiles to cushion any falls. The whole area is surrounded by a low fence with a gate that keeps small children inside.\n\nThe playground is where friendships begin. Children learn to share, take turns, and help each other — all while having fun.",
        textArabic:
          "في وسط الملعب، توجد لعبة دوامة تدور عندما تدفعها، وأرجوحة توازن يجلس فيها طفلان على طرفين متقابلين ويصعدان ويهبطان. كما توجد أيضًا مجموعة من عقل التسلق تمتد عبر إطار معدني — فقط الأطفال الأكثر شجاعة يتمكنون من الوصول إلى الجانب الآخر.\n\nوحول الحواف، توجد مقاعد يجلس عليها الآباء للمراقبة. وتقف نافورة مياه للشرب بالقرب من المدخل، وتوجد لافتات تذكر الجميع باللعب بأمان وتبادل الأدوار.\n\nالأرضية مغطاة ببلاط مطاطي لتخفيف أثر السقوط. والمنطقة بأكملها محاطة بسياج منخفض به بوابة تبقي الأطفال الصغار بالداخل.\n\nالملعب هو المكان الذي تبدأ فيه الصداقات؛ حيث يتعلم الأطفال المشاركة، وتبادل الأدوار، ومساعدة بعضهم البعض — وكل ذلك أثناء الاستمتاع بوقتهم.",
      },
      {
        partNumber: 3,
        title: "Playground Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة متعلقة بالملعب",
        text: "Here are some useful playground idioms and phrasal verbs:\n- 'child's play': something very easy to do.\n- 'swing into action': start doing something quickly and energetically.\n- 'take turns': alternate, let each person have a go.\n- 'hang on': hold tightly; wait a moment.\n- 'play it safe': be careful and avoid risks.\n- 'go around': spin or revolve; be enough for everyone.\n- 'climb up / slide down': move upward or downward on playground equipment.",
        textArabic:
          "إليك بعض المصطلحات والأفعال المركبة المفيدة المتعلقة بالملعب:\n- 'child's play': أمر سهل للغاية (لعب عيال).\n- 'swing into action': يبدأ في فعل شيء ما بسرعة وحيوية.\n- 'take turns': يتبادل الأدوار ويتيح لكل شخص فرصة للتجربة.\n- 'hang on': يمسك بإحكام؛ أو ينتظر للحظة.\n- 'play it safe': يتوخى الحذر ويتجنب المخاطر.\n- 'go around': يدور؛ أو يكفي الجميع.\n- 'climb up / slide down': يتسلق لأعلى / يتزحلق لأسفل على معدات اللعب.",
      },
    ],
    quiz: [
      {
        id: "playground-q1",
        question: "What safety feature is placed underneath the climbing wall?",
        options: ["A sandbox", "A soft mat", "A rubber swing", "A wooden fence"],
        correctIndex: 1,
        explanation:
          "The passage states that the climbing wall has coloured holds and a soft mat underneath for safety.",
        explanationArabic:
          "يوضح النص أن جدار التسلق يحتوي على مقابض ملونة وحصيرة ناعمة تحته لضمان السلامة.",
      },
      {
        id: "playground-q2",
        question: "What covers the playground ground to cushion falls?",
        options: ["Rubber tiles", "Hard concrete", "Stone gravel", "Wooden planks"],
        correctIndex: 0,
        explanation:
          "The text mentions that the ground is covered with rubber tiles to cushion any falls.",
        explanationArabic: "يذكر النص أن الأرضية مغطاة ببلاط مطاطي لتخفيف أثر السقوط.",
      },
      {
        id: "playground-q3",
        question: "What does the idiom 'child's play' mean?",
        options: [
          "A game played only by adults",
          "Something very easy to do",
          "A dangerous activity",
          "Playing on the monkey bars",
        ],
        correctIndex: 1,
        explanation: "'Child's play' is an idiom that means something is very easy to do.",
        explanationArabic: "'Child's play' هو مصطلح يعني أن الشيء سهل وبسيط للغاية في تنفيذه.",
      },
    ],
  },
  "playground-1": {
    groupId: "playground-1",
    groupName: "Playground 1",
    themeTitle: "Playground Conversations & Culture",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: At the Playground",
        titleArabic: "حوار قصير: في الملعب",
        text: "Layla: Can I go on the climbing wall first? Please!\nDad: Sure, but be careful. Hold on to the coloured holds tightly.\nLayla: I made it to the top! Can I try the monkey bars next?\nDad: Yes, but take turns — there's a queue.\nLayla: Okay. After that, can we go on the swings?\nDad: Of course. I'll push you. But first, drink some water at the fountain.\nLayla: Dad, look! The roundabout is free. Can I go?\nDad: Go ahead, but don't spin too fast — you'll get dizzy.\nLayla: This is so much fun! I love the playground.\nDad: Me too. But it's almost dinner time — five more minutes, okay?",
        textArabic:
          "ليلى: هل يمكنني الذهاب إلى جدار التسلق أولاً؟ أرجوك!\nالأب: بالتأكيد، ولكن كوني حذرة. تمسكي بالمقابض الملونة بإحكام.\nليلى: لقد وصلت إلى القمة! هل يمكنني تجربة عقل التسلق بعد ذلك؟\nالأب: نعم، ولكن تبادلي الأدوار — فهناك طابور.\nليلى: حسناً. بعد ذلك، هل يمكننا الذهاب إلى الأراجيح؟\nالأب: بالطبع. سأدفعك. ولكن أولاً، اشربي بعض الماء من النافورة.\nليلى: يا أبي، انظر! الدوامة فارغة. هل يمكنني الذهاب؟\nالأب: تفضلي، ولكن لا تدوري بسرعة كبيرة حتى لا تصابي بالدوار.\nليلى: هذا ممتع للغاية! أنا أحب الملعب.\nالأب: وأنا أيضًا. ولكن حان وقت العشاء تقريبًا — خمس دقائق إضافية، اتفقنا؟",
      },
      {
        partNumber: 2,
        title: "Common Mistakes",
        titleArabic: "الأخطاء الشائعة",
        text: "- Use 'on' for equipment: Say 'The children play on the slide' (not 'in the slide').\n- Irregular past tense: Say 'She fell from the climbing frame' (not 'falled').\n- Correct collocation: Say 'It's my turn' when waiting in line (not 'my round').\n- Word order: Say 'He climbed up the ladder' (not 'climbed the ladder up').\n- 'Fun' vs 'Funny': Say 'The slide is fun' (enjoyable), not 'funny' (which means humorous/laughable).",
        textArabic:
          "- استخدام حرف الجر 'on' مع الألعاب: قل 'The children play on the slide' (وليس 'in the slide').\n- الماضي غير القياسي: قل 'She fell from the climbing frame' (وليس 'falled').\n- الاستخدام الصحيح للكلمات: قل 'It's my turn' عند الانتظار في الدور (وليس 'my round').\n- ترتيب الكلمات: قل 'He climbed up the ladder' (وليس 'climbed the ladder up').\n- الفرق بين 'Fun' و 'Funny': قل 'The slide is fun' (ممتع)، وليس 'funny' (التي تعني مضحكًا ومثيرًا للضحك).",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "British vs American Playground Terms:\n- British: 'roundabout' / American: 'merry-go-round'\n- British: 'see-saw' / American: 'teeter-totter'\n- British: 'climbing frame' / American: 'jungle gym'\n\nCultural Insights:\n- 'Take turns' is a foundational social habit taught early in British and American culture.\n- In US schools, outdoor play is called 'recess', while in the UK it is called 'break' or 'playtime'.\n- Safety standards require impact-absorbing surfaces like rubber tiles or soft mulch under all playground equipment.",
        textArabic:
          "المصطلحات البريطانية مقابل الأمريكية لألعاب الملعب:\n- بريطاني: 'roundabout' / أمريكي: 'merry-go-round'\n- بريطاني: 'see-saw' / أمريكي: 'teeter-totter'\n- بريطاني: 'climbing frame' / أمريكي: 'jungle gym'\n\nرؤى ثقافية:\n- 'تبادل الأدوار' (Take turns) هي عادة اجتماعية أساسية يتم تعليمها مبكراً في الثقافة البريطانية والأمريكية.\n- في المدارس الأمريكية، يُطلق على اللعب في الهواء الطلق 'recess'، بينما يُطلق عليه في المملكة المتحدة 'break' أو 'playtime'.\n- تتطلب معايير السلامة أسطحًا ممتصة للصدمات مثل البلاط المطاطي أو النشارة الناعمة تحت جميع معدات الملعب.",
      },
    ],
    quiz: [
      {
        id: "playground-1-q1",
        question: "Why did Dad tell Layla to wait before using the monkey bars?",
        options: [
          "Because it was raining",
          "Because they were broken",
          "Because there was a queue and she needed to take turns",
          "Because she was too young",
        ],
        correctIndex: 2,
        explanation: "Dad reminded Layla to take turns because there was a queue.",
        explanationArabic: "ذكّر الأب ليلى بتبادل الأدوار لأن هناك طابور انتظار.",
      },
      {
        id: "playground-1-q2",
        question:
          "What is the American English equivalent for the British word 'roundabout' (in a playground)?",
        options: ["Jungle gym", "Merry-go-round", "Teeter-totter", "Slide"],
        correctIndex: 1,
        explanation: "The American English term for a playground 'roundabout' is 'merry-go-round'.",
        explanationArabic:
          "المصطلح باللغة الإنجليزية الأمريكية للعبة 'roundabout' في الملعب هو 'merry-go-round'.",
      },
      {
        id: "playground-1-q3",
        question: "Which sentence uses the correct preposition and grammar?",
        options: [
          "The children play in the slide.",
          "She falled from the frame.",
          "The children play on the swings.",
          "Wait, it is my round!",
        ],
        correctIndex: 2,
        explanation:
          "We use the preposition 'on' for playground equipment like swings, slide, and seesaw.",
        explanationArabic: "نستخدم حرف الجر 'on' مع معدات الملعب مثل 'on the swings'.",
      },
    ],
  },
  classroom: {
    groupId: "classroom",
    groupName: "The Classroom",
    themeTitle: "Inside the Classroom",
    passages: [
      {
        partNumber: 1,
        title: "My English Classroom - Part 1",
        titleArabic: "فصل اللغة الإنجليزية - الجزء الأول",
        text: "Our English classroom is on the second floor of the school building. It is a bright, spacious room with large windows that let in plenty of natural light.\n\nAt the front of the room, there is a whiteboard where the teacher writes vocabulary and grammar rules. Next to it, there is a projector screen that the teacher uses for presentations and videos. The teacher's desk sits in the corner with a laptop, a stack of textbooks, and a cup of pens and markers.",
        textArabic:
          "يقع فصل اللغة الإنجليزية لدينا في الطابق الثاني من مبنى المدرسة. إنها غرفة مشرقة وواسعة بها نوافذ كبيرة تسمح بدخول الكثير من الضوء الطبيعي.\n\nفي مقدمة الفصل، توجد سبورة بيضاء حيث يكتب المعلم المفردات وقواعد النحو. وبجوارها، توجد شاشة عرض بروجكتور يستخدمها المعلم للعروض التقديمية ومقاطع الفيديو. ويقع مكتب المعلم في الزاوية وعليه كمبيوتر محمول وكومة من الكتب الدراسية وكوب من الأقلام وأقلام التحديد.",
      },
      {
        partNumber: 2,
        title: "My English Classroom - Part 2",
        titleArabic: "فصل اللغة الإنجليزية - الجزء الثاني",
        text: "The students sit at individual desks arranged in rows. Each desk has a drawer for storing notebooks, pencils, and erasers. Some students keep a pencil case with highlighters, a ruler, and a sharpener. There is a bookshelf at the back of the room filled with dictionaries, readers, and reference books.\n\nOn the walls, there are posters with grammar charts, a world map, and a bulletin board where the teacher pins student work. During lessons, we often work in pairs or groups to complete worksheets and practise dialogues. It is where I started to feel confident speaking English.",
        textArabic:
          "يجلس الطلاب في مكاتب فردية مرتبة في صفوف. يحتوي كل مكتب على درج لتخزين الدفاتر وأقلام الرصاص والمحايات. ويحتفظ بعض الطلاب بمقلمة بها أقلام تظليل ومسطرة ومبراة. وتوجد خزانة كتب في الجزء الخلفي من الغرفة مليئة بالقواميس والكتب المرجعية.\n\nوعلى الجدران، توجد ملصقات بها مخططات نحوية وخريطة للعالم ولوحة إعلانات يثبت عليها المعلم أعمال الطلاب. وخلال الدروس، غالبًا ما نعمل في أزواج أو مجموعات لإكمال أوراق العمل والتدرب على المحادثات. إنه المكان الذي بدأت أشعر فيه بالثقة في التحدث بالإنجليزية.",
      },
      {
        partNumber: 3,
        title: "Classroom Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة للفصل الدراسي",
        text: "Here are key classroom idioms and phrasal verbs:\n- 'hit the books': study hard (e.g., 'I need to hit the books — the exam is tomorrow').\n- 'learn by heart': memorise completely.\n- 'hand in': submit homework or an assignment.\n- 'rub out' / 'erase': remove writing from paper or a board.\n- 'pay attention': listen and focus carefully.\n- 'look up': search for information in a dictionary or online.\n- 'take notes': write down key points during a lesson.",
        textArabic:
          "إليك أهم المصطلحات والأفعال المركبة للفصل الدراسي:\n- 'hit the books': يدرس بجد واجتهاد (مثال: 'أحتاج أن أدرس بجد — الامتحان غدًا').\n- 'learn by heart': يحفظ عن ظهر قلب تمامًا.\n- 'hand in': يسلّم الواجب المنزلي أو التكليف.\n- 'rub out' / 'erase': يمسح الكتابة من الورقة أو السبورة.\n- 'pay attention': ينتبه ويركز بعناية.\n- 'look up': يبحث عن معلومة في القاموس أو عبر الإنترنت.\n- 'take notes': يدوّن النقاط الرئيسية أثناء الدرس.",
      },
    ],
    quiz: [
      {
        id: "classroom-q1",
        question: "Where is the English classroom located in the school building?",
        options: ["On the ground floor", "On the second floor", "In the basement", "On the roof"],
        correctIndex: 1,
        explanation:
          "The passage states: 'Our English classroom is on the second floor of the school building.'",
        explanationArabic:
          "ينص النص على: 'يقع فصل اللغة الإنجليزية لدينا في الطابق الثاني من مبنى المدرسة.'",
      },
      {
        id: "classroom-q2",
        question: "What does the teacher use the projector screen for?",
        options: [
          "To store extra textbooks",
          "For presentations and videos",
          "To block the sunlight",
          "To hang student art projects",
        ],
        correctIndex: 1,
        explanation:
          "The text explains that the teacher uses the projector screen for presentations and videos.",
        explanationArabic: "يوضح النص أن المعلم يستخدم شاشة العرض للعروض التقديمية ومقاطع الفيديو.",
      },
      {
        id: "classroom-q3",
        question: "What does the idiom 'hit the books' mean?",
        options: [
          "To drop books on the floor",
          "To study hard",
          "To buy new school supplies",
          "To read a story aloud",
        ],
        correctIndex: 1,
        explanation: "'Hit the books' is an idiom meaning to study hard, especially for an exam.",
        explanationArabic:
          "'Hit the books' هو مصطلح يعني الدراسة بجد واجتهاد، خاصة من أجل الامتحان.",
      },
    ],
  },
  "classroom-1": {
    groupId: "classroom-1",
    groupName: "Classroom Interaction & Culture",
    themeTitle: "Communication and Language Notes",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Asking for Help",
        titleArabic: "حوار قصير: طلب المساعدة في الفصل",
        text: "Student: Excuse me, could you explain this grammar rule again?\nTeacher: Of course. Look at the whiteboard — I'll write another example.\nStudent: Should I write it down in my notebook?\nTeacher: Yes, and highlight the key words with your highlighter.\nStudent: I don't have one. Can I borrow a marker?\nTeacher: Here you go. Also, there's a good explanation on page 42 of your textbook.\nStudent: Thank you. Should I hand in the worksheet today?\nTeacher: No, finish it at home and hand it in tomorrow.",
        textArabic:
          "الطالب: معذرة، هل يمكنك شرح هذه القاعدة النحوية مرة أخرى؟\nالمعلم: بالطبع. انظر إلى السبورة البيضاء — سأكتب مثالاً آخر.\nالطالب: هل يجب أن أدوّنها في دفتري؟\nالمعلم: نعم، وظلل الكلمات المفتاحية بقلم التظليل الخاص بك.\nالطالب: ليس لدي قلم. هل يمكنني استعارة قلم تحديد؟\nالمعلم: تفضل. وأيضاً، هناك شرح جيد في الصفحة 42 من كتابك الدراسي.\nالطالب: شكراً لك. هل يجب أن أسلّم ورقة العمل اليوم؟\nالمعلم: لا، أكملها في المنزل وسلّمها غداً.",
      },
      {
        partNumber: 2,
        title: "Common Classroom Mistakes",
        titleArabic: "أخطاء شائعة في الفصل الدراسي",
        text: "- 'The teacher explained the lesson to us.' (Not 'explained us the lesson' — 'explain' requires 'to' before the person).\n- 'I left my book at home.' (Not 'I forgot my book at home' — use 'leave' when mentioning a specific location).\n- 'Can I borrow your pen?' (Not 'lend your pen' — you borrow from someone, but they lend to you).\n- 'She is good at English.' (Not 'good in' — use 'good at' for school subjects and skills).\n- 'I made a mistake.' (Not 'did a mistake' — the proper collocation is 'make a mistake').",
        textArabic:
          "- 'The teacher explained the lesson to us.' (وليس 'explained us the lesson' — الفعل 'explain' يتطلب حرف الجر 'to' قبل الشخص).\n- 'I left my book at home.' (وليس 'I forgot my book at home' — استخدم 'leave' عند ذكر مكان محدد).\n- 'Can I borrow your pen?' (وليس 'lend your pen' — أنت تقترض/تستعير 'borrow' من شخص، بينما هو يُقرضك 'lend').\n- 'She is good at English.' (وليس 'good in' — نستخدم 'good at' مع المواد والمهارات الدراسية).\n- 'I made a mistake.' (وليس 'did a mistake' — المتلازمة اللفظية الصحيحة هي 'make a mistake').",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "British vs American Vocabulary:\n- British: 'rubber', 'maths', 'timetable', 'revise'.\n- American: 'eraser', 'math', 'schedule', 'review/study'.\n\nClassroom Etiquette:\nIn English-speaking classrooms, students raise their hands before speaking and say 'Excuse me' when asking questions.\n\nStationery vs Stationary:\n'Stationery' (with an 'e') refers to writing supplies like pens and paper, whereas 'stationary' (with an 'a') means not moving.\n\nWork Terms:\n'Homework' (tasks done at home) and 'coursework' (ongoing assessed study) are uncountable nouns.",
        textArabic:
          "المفردات البريطانية مقابل الأمريكية:\n- بريطاني: 'rubber' (ممحاة)، 'maths' (رياضيات)، 'timetable' (جدول حصص)، 'revise' (يراجع).\n- أمريكي: 'eraser'، 'math'، 'schedule'، 'review/study'.\n\nآداب الفصل الدراسي:\nفي الفصول بالدول الناطقة بالإنجليزية، يرفع الطلاب أيديهم قبل التحدث ويقولون 'Excuse me' عند طرح الأسئلة.\n\nالفرق بين Stationery و Stationary:\nكلمة 'Stationery' (بحرف e) تعني الأدوات القرطاسية والمكتبية، بينما 'stationary' (بحرف a) تعني ثابتاً أو غير متحرك.\n\nمصطلحات المهام الدراسية:\nكلمتا 'Homework' (الواجب المنزلي) و 'coursework' (العمل الدراسي الفصلي) هما اسمان غير معدودين.",
      },
    ],
    quiz: [
      {
        id: "classroom-1-q1",
        question: "When does the teacher want the student to hand in the worksheet?",
        options: [
          "Before leaving the class today",
          "Tomorrow after finishing it at home",
          "Next Monday",
          "At the end of the school week",
        ],
        correctIndex: 1,
        explanation:
          "The teacher explicitly says: 'No, finish it at home and hand it in tomorrow.'",
        explanationArabic: "يقول المعلم بوضوح: 'لا، أكملها في المنزل وسلّمها غداً.'",
      },
      {
        id: "classroom-1-q2",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "The teacher explained us the grammar rules.",
          "I forgot my textbook at home.",
          "Can I lend your pencil for a minute?",
          "I made a mistake on the grammar exercise.",
        ],
        correctIndex: 3,
        explanation:
          "'I made a mistake' is correct. 'Make a mistake' is the proper collocation, whereas 'explain' needs 'to', 'left' is used for locations, and 'borrow' means take temporarily.",
        explanationArabic:
          "'I made a mistake' هي الجملة الصحيحة. 'Make a mistake' هو التعبير الصحيح، في حين أن 'explain' تحتاج إلى 'to'، وتُستخدم 'left' عند ذكر الأماكن، و'borrow' تعني الاستعارة.",
      },
      {
        id: "classroom-1-q3",
        question: "What is the correct meaning of 'stationery' spelled with an 'e'?",
        options: [
          "Writing supplies such as pens, paper, and envelopes",
          "An object that is fixed and not moving",
          "A school bus schedule",
          "A type of dictionary",
        ],
        correctIndex: 0,
        explanation:
          "'Stationery' with an 'e' refers to writing materials and school supplies, while 'stationary' with an 'a' means standing still.",
        explanationArabic:
          "'Stationery' المكتوبة بحرف 'e' تشير إلى الأدوات المكتبية واللوازم المدرسية مثل الأقلام والورق، بينما 'stationary' بحرف 'a' تعني ثابت أو غير متحرك.",
      },
    ],
  },
  library: {
    groupId: "library",
    groupName: "The Library",
    themeTitle: "The Library",
    passages: [
      {
        partNumber: 1,
        title: "An Afternoon at the Library - Part 1",
        titleArabic: "بعد الظهر في المكتبة - الجزء الأول",
        text: "I visit the public library near my home at least twice a week. It is a quiet, welcoming place where I can study, read, and borrow books for free.\n\nThe library has two floors. The ground floor has the main hall with rows of bookshelves organised by category: fiction, non-fiction, science, history, and children's books. Each shelf has labels so you can find what you need quickly. There is also a catalogue computer where you can search for a book by title, author, or subject.\n\nAt the reception desk, the librarian helps visitors find books, renew loans, and pay small fines for overdue items. You need a library card to borrow books — up to five at a time, for three weeks.",
        textArabic:
          "أزور المكتبة العامة القريبة من منزلي مرتين في الأسبوع على الأقل. إنها مكان هادئ ومرحب حيث يمكنني الدراسة والقراءة واستعارة الكتب مجانًا.\n\nتتكون المكتبة من طابقين. يحتوي الطابق الأرضي على القاعة الرئيسية مع صفوف من أرفف الكتب المنظمة حسب الفئة: القصص الخيالية، والكتب غير الخيالية، والعلوم، والتاريخ، وكتب الأطفال. يحتوي كل رف على ملصقات حتى تتمكن من العثور على ما تحتاجه بسرعة. يوجد أيضًا جهاز كمبيوتر للفهرس حيث يمكنك البحث عن كتاب حسب العنوان أو المؤلف أو الموضوع.\n\nفي مكتب الاستقبال، يساعد أمين المكتبة الزوار في العثور على الكتب، وتجديد الإعارات، ودفع غرامات صغيرة مقابل المواد المتأخرة. أنت بحاجة إلى بطاقة مكتبة لاستعارة الكتب — حتى خمسة كتب في المرة الواحدة، لمدة ثلاثة أسابيع.",
      },
      {
        partNumber: 2,
        title: "An Afternoon at the Library - Part 2",
        titleArabic: "بعد الظهر في المكتبة - الجزء الثاني",
        text: "The first floor has a reading room with long tables, comfortable chairs, and good lighting. Many students come here to study for exams. There is a 'Quiet Zone' sign, so everyone speaks in a whisper or stays silent.\n\nIn the corner, there is a reference section with encyclopedias, atlases, and academic journals that you can read but not take home. The library also has a small computer area with free internet access and a printer.\n\nEvery Saturday, the library organises a story time for young children and a book club meeting for adults. There is a noticeboard near the entrance with information about upcoming events. I love the library because it offers so much more than just books — it's a community space for learning and discovery.",
        textArabic:
          "يحتوي الطابق الأول على غرفة قراءة بها طاولات طويلة وكراسي مريحة وإضاءة جيدة. يأتي العديد من الطلاب إلى هنا للدراسة من أجل الامتحانات. توجد لافتة 'منطقة هادئة'، لذلك يتحدث الجميع بهمس أو يلتزمون الصمت.\n\nفي الزاوية، يوجد قسم للمراجع يضم موسوعات وأطالس ومجلات أكاديمية يمكنك قراءتها ولكن لا يمكنك أخذها إلى المنزل. تحتوي المكتبة أيضًا على منطقة كمبيوتر صغيرة مع خدمة إنترنت مجانية وطابعة.\n\nفي كل يوم سبت، تنظم المكتبة وقتًا للقصص للأطفال الصغار واجتماعًا لنادي الكتاب للبالغين. توجد لوحة إعلانات بالقرب من المدخل تحتوي على معلومات حول الفعاليات القادمة. أنا أحب المكتبة لأنها تقدم أكثر بكثير من مجرد كتب — إنها مساحة مجتمعية للتعلم والاكتشاف.",
      },
      {
        partNumber: 3,
        title: "Library Idioms & Key Phrases",
        titleArabic: "مصطلحات وعبارات رئيسية للمكتبة",
        text: "Here are key idioms and phrasal verbs used in library and learning contexts:\n- 'by the book': following rules exactly (\"The librarian does everything by the book — no exceptions.\")\n- 'an open book': a person with no secrets, easy to understand (\"He's an open book — you always know what he's thinking.\")\n- 'take out': borrow from the library (\"I took out three novels last week.\")\n- 'look up': search for information (\"Can you look up the author's name in the catalogue?\")\n- 'check out': borrow an item or examine something (\"I checked out a history book from the library.\")\n- 'turn over a new leaf': start behaving in a better way\n- 'read between the lines': understand the hidden meaning\n- 'browse through': look casually at books or items.",
        textArabic:
          "إليك مصطلحات وعبارات فعلية رئيسية تُستخدم في سياق المكتبة والتعلم:\n- 'by the book': اتباع القواعد بدقة (\"أمين المكتبة يفعل كل شيء وفقًا للقواعد — دون استثناءات.\")\n- 'an open book': شخص ليس لديه أسرار ويسهل فهمه (\"إنه كتاب مفتوح — أنت دائمًا تعرف ما يفكر فيه.\")\n- 'take out': يستعير من المكتبة (\"استعرت ثلاث روايات الأسبوع الماضي.\")\n- 'look up': يبحث عن معلومة (\"هل يمكنك البحث عن اسم المؤلف في الفهرس؟\")\n- 'check out': يستعير مادة أو يفحص شيئًا (\"استعرت كتاب تاريخ من المكتبة.\")\n- 'turn over a new leaf': يبدأ صفحة جديدة ويتصرف بشكل أفضل\n- 'read between the lines': يفهم المعنى الخفي وما بين السطور\n- 'browse through': يتصفح الكتب أو المواد بعفوية.",
      },
    ],
    quiz: [
      {
        id: "library-q1",
        question: "How many books can a visitor borrow at a time, and for how long?",
        options: [
          "Up to three books for two weeks",
          "Up to five books for three weeks",
          "Up to ten books for a month",
          "Unlimited books for one week",
        ],
        correctIndex: 1,
        explanation:
          "The text states that you need a library card to borrow books — up to five at a time, for three weeks.",
        explanationArabic:
          "ينص النص على أنك بحاجة إلى بطاقة مكتبة لاستعارة الكتب — حتى خمسة كتب في المرة الواحدة، لمدة ثلاثة أسابيع.",
      },
      {
        id: "library-q2",
        question: "What is special about the books in the reference section?",
        options: [
          "They are free to take home permanently",
          "They can be read in the library but cannot be taken home",
          "They are only for young children",
          "They are written in foreign languages only",
        ],
        correctIndex: 1,
        explanation:
          "The passage explains that the reference section contains encyclopedias, atlases, and academic journals that you can read but not take home.",
        explanationArabic:
          "يوضح النص أن قسم المراجع يحتوي على موسوعات وأطالس ومجلات أكاديمية يمكنك قراءتها ولكن لا يمكنك أخذها إلى المنزل.",
      },
      {
        id: "library-q3",
        question: "What does the idiom 'by the book' mean?",
        options: [
          "Writing a story book",
          "Following rules and regulations exactly",
          "Buying expensive books",
          "Reading slowly word by word",
        ],
        correctIndex: 1,
        explanation:
          "'By the book' means following the rules strictly and exactly without making exceptions.",
        explanationArabic: "يعني مصطلح 'by the book' اتباع القواعد بدقة وصرامة دون استثناءات.",
      },
    ],
  },
  "library-1": {
    groupId: "library-1",
    groupName: "The Library 1",
    themeTitle: "The Library",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Asking the Librarian",
        titleArabic: "حوار قصير: سؤال أمين المكتبة",
        text: "Visitor: Excuse me, I'm looking for a book on world history. Can you help?\nLibrarian: Of course. Do you have a specific title in mind?\nVisitor: Not really. Something for a B1 English learner.\nLibrarian: Let me check the catalogue. We have a few simplified readers in the non-fiction section.\nVisitor: Great. How many books can I borrow at once?\nLibrarian: Up to five, for three weeks. Do you have a library card?\nVisitor: Not yet. How do I get one?\nLibrarian: Fill in this form with your name and address. I'll print your card right away.\nVisitor: Thank you. Is there a quiet place where I can sit and read?\nLibrarian: Yes, the reading room is upstairs. Just remember — it's a quiet zone, so no phone calls.",
        textArabic:
          "الزائر: معذرة، أنا أبحث عن كتاب في التاريخ العالمي. هل يمكنك المساعدة؟\nأمين المكتبة: بالطبع. هل لديك عنوان محدد في ذهنك؟\nالزائر: ليس حقًا. شيء مناسب لمتعلم للغة الإنجليزية في المستوى B1.\nأمين المكتبة: دعني أتحقق من الفهرس. لدينا بعض الكتب المبسطة في قسم الكتب غير الخيالية.\nالزائر: رائع. كم عدد الكتب التي يمكنني استعارتها في وقت واحد؟\nأمين المكتبة: ما يصل إلى خمسة كتب، لمدة ثلاثة أسابيع. هل لديك بطاقة مكتبة؟\nالزائر: ليس بعد. كيف يمكنني الحصول على واحدة؟\nأمين المكتبة: املأ هذا النموذج باسمك وعنوانك. سأطبع بطاقتك على الفور.\nالزائر: شكرًا لك. هل هناك مكان هادئ حيث يمكنني الجلوس والقراءة؟\nأمين المكتبة: نعم، غرفة القراءة في الطابق العلوي. فقط تذكر — إنها منطقة هادئة، لذا يُمنع إجراء المكالمات الهاتفية.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes & Usage",
        titleArabic: "الأخطاء الشائعة والاستخدام اللغوي",
        text: '- Borrow vs Lend: You lend TO someone and borrow FROM someone. Say "He borrowed a book from me" or "I lent him a book" (Never "I borrowed him a book").\n- Expressing Purpose: Say "I went to the library to borrow a book" with \'to + verb\' (Not "for lend a book").\n- -ed vs -ing Adjectives: Use -ing for the cause and -ed for feelings: "The book is interesting; I am interested" (Not "The book is interested").\n- Recommending: Say "Can you recommend a good book to me?" (Not "recommend me a good book").\n- For vs Since: Use \'for\' with duration ("for two hours") and \'since\' with a point in time ("since 3 PM").',
        textArabic:
          '- الاستعارة مقابل الإعارة (Borrow vs Lend): أنت تُعير (lend TO) لشخص ما وتستعير (borrow FROM) من شخص ما. قل "He borrowed a book from me" أو "I lent him a book" (ولا تقل أبدًا "I borrowed him a book").\n- التعبير عن الغرض: قل "I went to the library to borrow a book" باستخدام \'to + المصدر\' (وليس "for lend a book").\n- الصفات المنتهية بـ -ed و -ing: استخدم -ing للسبب و -ed للمشاعر: "The book is interesting; I am interested" (وليس "The book is interested").\n- التوصية بالاقتراح: قل "Can you recommend a good book to me?" (وليس "recommend me a good book").\n- المدة مقابل نقطة البداية (For vs Since): استخدم \'for\' للمدة ("for two hours") و \'since\' لنقطة زمنية محددة ("since 3 PM").',
      },
      {
        partNumber: 3,
        title: "Cultural Notes & Library Etiquette",
        titleArabic: "ملاحظات ثقافية وآداب المكتبة",
        text: "Public Libraries Are Free:\nIn the UK, US, and most English-speaking countries, public libraries are free to join. Anyone with proof of address can get a library card.\n\nBritish vs American Differences:\n- British: 'catalogue', 'ground floor'\n- American: 'catalog', 'first floor'\n\nLibrary Etiquette:\nAlways speak in a whisper, keep mobile phones silent, do not consume food or drinks near books, and return borrowed materials before the due date to avoid fines.\n\nClassification Systems:\nBooks are organised using systems such as the Dewey Decimal Classification (000–999) to help visitors locate specific categories independently.",
        textArabic:
          "المكتبات العامة مجانية:\nفي المملكة المتحدة والولايات المتحدة ومعظم الدول الناطقة بالإنجليزية، الانضمام للمكتبات العامة مجاني. يمكن لأي شخص يحمل إثبات عنوان الحصول على بطاقة مكتبة.\n\nالفروق بين الإنجليزية البريطانية والأمريكية:\n- بريطاني: 'catalogue' (فهرس)، 'ground floor' (الطابق الأرضي)\n- أمريكي: 'catalog' (فهرس)، 'first floor' (الطابق الأول)\n\nآداب المكتبة:\nتحدث دائمًا بهمس، واجعل الهواتف صامتة، ولا تتناول الأطعمة أو المشروبات بجوار الكتب، وأعد المواد المستعارة قبل تاريخ الاستحقاق لتجنب الغرامات.\n\nأنظمة التصنيف:\nتُنظم الكتب باستخدام أنظمة مثل تصنيف ديوي العشري (000–999) لمساعدة الزوار في تحديد موقع الفئات بسهولة وبشكل مستقل.",
      },
    ],
    quiz: [
      {
        id: "library-1-q1",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "I borrowed him my favorite book.",
          "I went to the library for lend a book.",
          "He borrowed a novel from me yesterday.",
          "The history book was very interested.",
        ],
        correctIndex: 2,
        explanation:
          "You borrow FROM someone and lend TO someone. 'He borrowed a novel from me yesterday' is the correct sentence.",
        explanationArabic:
          "أنت تستعير من شخص (borrow FROM) وتُعير إلى شخص (lend TO). الجملة 'He borrowed a novel from me yesterday' هي الصحيحة.",
      },
      {
        id: "library-1-q2",
        question: "How does the visitor in the dialogue get a library card?",
        options: [
          "By paying a membership fee of $20",
          "By filling in a form with their name and address",
          "By passing an English reading test",
          "By donating three books to the library",
        ],
        correctIndex: 1,
        explanation:
          "The librarian tells the visitor: 'Fill in this form with your name and address. I'll print your card right away.'",
        explanationArabic:
          "يخبر أمين المكتبة الزائر: 'املأ هذا النموذج باسمك وعنوانك. سأطبع بطاقتك على الفور'.",
      },
      {
        id: "library-1-q3",
        question: "What is the American English spelling for the British word 'catalogue'?",
        options: ["Catalog", "Catallog", "Catelog", "Cataloge"],
        correctIndex: 0,
        explanation:
          "In American English, the word is spelled 'catalog', whereas British English uses 'catalogue'.",
        explanationArabic:
          "في الإنجليزية الأمريكية، تُكتب الكلمة 'catalog'، بينما تستخدم الإنجليزية البريطانية 'catalogue'.",
      },
    ],
  },
  market: {
    groupId: "market",
    groupName: "The Market",
    themeTitle: "Shopping at the Market",
    passages: [
      {
        partNumber: 1,
        title: "Shopping at the Market - Part 1",
        titleArabic: "التسوق في السوق - الجزء الأول",
        text: "Every Saturday morning, I go to the outdoor market in the town centre. It is much bigger than a supermarket, and I enjoy the atmosphere — the colours, the smells, and the sound of vendors calling out their prices.\n\nThe fruit and vegetable stalls are always the busiest. Fresh apples, oranges, bananas, and berries are arranged in neat rows. The vegetables — tomatoes, potatoes, onions, peppers, and lettuce — are weighed on a scale, and you pay by the kilogram.",
        textArabic:
          "في كل صباح سبت، أذهب إلى السوق المفتوح في وسط المدينة. إنه أكبر بكثير من السوبرماركت، وأنا أستمتع بالأجواء هناك — الألوان والروائح وأصوات البائعين وهم ينادون على أسعارهم.\n\nتكون أكشاك الفواكه والخضروات دائمًا هي الأكثر ازدحامًا. حيث يتم ترتيب التفاح والبرتقال والموز والتوت الطازج في صفوف أنيقة. أما الخضروات — مثل الطماطم والبطاطس والبصل والفلفل والخس — فتوزن على الميزان، وتدفع ثمنها بالكيلوغرام.",
      },
      {
        partNumber: 2,
        title: "Shopping at the Market - Part 2",
        titleArabic: "التسوق في السوق - الجزء الثاني",
        text: "Next to the produce section, there is a butcher's stall with different cuts of meat: chicken, lamb, and beef. Across from it, the fishmonger sells fresh fish, shrimp, and squid laid out on ice. The cheese stall offers dozens of varieties, and you can taste samples before buying.\n\nThere is also a bakery stall with fresh bread, pastries, and cakes, while a spice vendor sells bags of cumin, turmeric, cinnamon, and dried herbs. I always bring my shopping bag and compare prices between stalls. Some vendors give discounts if you buy in bulk, and when the market is about to close, you can sometimes get a real bargain.",
        textArabic:
          "بجوار قسم المنتجات الطازجة، يوجد كشك الجزار الذي يقدم قطعًا مختلفة من اللحوم: الدجاج ولحم الضأن ولحم البقر. وفي الجهة المقابلة له، يبيع بائع السمك الأسماك الطازجة والروبيان والحبار الموضوعة على الثلج. ويقدم كشك الجبن عشرات الأصناف، حيث يمكنك تذوق عينات قبل الشراء.\n\nيوجد أيضًا كشك للمخبوزات يحتوي على خبز طازج وفطائر وكعك، بينما يبيع بائع التوابل أكياسًا من الكمون والكركم والقرفة والأعشاب المجففة. أحضر دائمًا حقيبة التسوق الخاصة بي وأقارن الأسعار بين الأكشاك. يمنحك بعض البائعين خصمًا إذا اشتريت بالجملة، وعندما يوشك السوق على الإغلاق، يمكنك أحيانًا الحصول على صفقة رابحة حقيقية.",
      },
      {
        partNumber: 3,
        title: "Market Idioms & Key Phrases",
        titleArabic: "مصطلحات وعبارات شائعة في السوق",
        text: "Here are useful market idioms and phrases:\n- 'shop around': compare prices at different places before choosing.\n- 'a bargain': something bought at a lower price than expected.\n- 'pick up': buy casually or quickly.\n- 'stock up (on)': buy a large amount for later use.\n- 'sell like hotcakes': sell very quickly and in large numbers.\n- 'rip off / a rip-off': an unfairly high price.\n- 'in bulk': in large quantities.\n- 'keep the change': let the seller keep the extra change.",
        textArabic:
          "إليك مصطلحات وعبارات مفيدة مستخدمة في السوق:\n- 'shop around': مقارنة الأسعار في أماكن مختلفة قبل الشراء.\n- 'a bargain': صفقة رابحة؛ شيء تم شراؤه بسعر أقل من المتوقع.\n- 'pick up': شراء شيء بسرعة أو بشكل عابر.\n- 'stock up (on)': التخزين؛ شراء كميات كبيرة للاستخدام لاحقًا.\n- 'sell like hotcakes': يُباع بسرعة فائقة وبكميات كبيرة.\n- 'rip off / a rip-off': غش أو سعر باهظ وغير عادل.\n- 'in bulk': بكميات كبيرة أو بالجملة.\n- 'keep the change': احتفظ بالباقي؛ السماح للبائع بالاحتفاظ بباقي النقود.",
      },
    ],
    quiz: [
      {
        id: "market-q1",
        question: "How are vegetables sold at the market stalls?",
        options: [
          "They are sold individually in plastic containers",
          "They are weighed on a scale and paid for by the kilogram",
          "They are sold only in pre-packed boxes",
          "They are given for free with every meat purchase",
        ],
        correctIndex: 1,
        explanation:
          "According to the text, vegetables are weighed on a scale and you pay by the kilogram.",
        explanationArabic: "وفقًا للنص، يتم وزن الخضروات على الميزان وتدفع ثمنها بالكيلوغرام.",
      },
      {
        id: "market-q2",
        question: "What can customers do at the cheese stall before buying?",
        options: [
          "Make their own cheese on the spot",
          "Taste samples of the varieties",
          "Negotiate half price for every sample",
          "Exchange cheese for vegetables",
        ],
        correctIndex: 1,
        explanation:
          "The passage mentions that the cheese stall offers dozens of varieties and you can taste samples before buying.",
        explanationArabic:
          "يذكر النص أن كشك الجبن يقدم عشرات الأصناف ويمكنك تذوق عينات قبل الشراء.",
      },
      {
        id: "market-q3",
        question: "What does the idiom 'sell like hotcakes' mean?",
        options: [
          "To be baked only during winter",
          "To be sold at a very high price",
          "To sell very quickly and in large numbers",
          "To be sold only in bakeries",
        ],
        correctIndex: 2,
        explanation: "'Sell like hotcakes' means to sell very quickly and in large numbers.",
        explanationArabic:
          "يعني المصطلح 'sell like hotcakes' أن يباع الشيء بسرعة كبيرة وبأعداد وفيرة.",
      },
    ],
  },
  "market-1": {
    groupId: "market-1",
    groupName: "Market Dialogue & Usage",
    themeTitle: "Market Communication & Culture",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: At the Fruit Stall",
        titleArabic: "حوار قصير: عند كشك الفواكه",
        text: "Customer: Good morning! How much are the strawberries?\nVendor: Two pounds fifty a punnet. Or two punnets for four pounds.\nCustomer: I'll take two, please. And a kilo of oranges.\nVendor: Sure. Anything else? The bananas are on special today.\nCustomer: How much per kilo?\nVendor: One pound twenty. They're really sweet this week.\nCustomer: Okay, I'll take half a kilo. Do you have any lemons?\nVendor: Yes, right here. Thirty pence each or five for a pound.\nCustomer: Five, please. How much is everything?\nVendor: That's six pounds ninety altogether. Cash or card?",
        textArabic:
          "الزبون: صباح الخير! كم سعر الفراولة؟\nالبائع: جنيهان ونصف للعلبة. أو علبتان مقابل أربعة جنيهات.\nالزبون: سآخذ اثنتين، من فضلك. وكيلوغراماً من البرتقال.\nالبائع: بالتأكيد. أي شيء آخر؟ الموز عليه عرض خاص اليوم.\nالزبون: كم سعر الكيلوغرام؟\nالبائع: جنيه وعشرون بنساً. إنه حلو المذاق حقاً هذا الأسبوع.\nالزبون: حسناً، سآخذ نصف كيلو. هل لديك ليمون؟\nالبائع: نعم، هنا تماماً. ثلاثون بنساً للواحدة أو خمس حبات مقابل جنيه واحد.\nالزبون: خمسة، من فضلك. كم الحساب الإجمالي؟\nالبائع: ستة جنيهات وتسعون بنساً في المجموع. نقداً أم بالبطاقة؟",
      },
      {
        partNumber: 2,
        title: "Common Mistakes",
        titleArabic: "أخطاء شائعة",
        text: "- 'How much does this cost?' (Not 'How much costs this?'. In questions, use 'does' as an auxiliary verb.)\n- 'I want to buy some bread.' (Not 'a bread'. 'Bread' is uncountable; say 'some bread' or 'a loaf of bread'.)\n- 'The fruit is very fresh today.' (Not 'fruits'. 'Fruit' is uncountable when referring to fruit in general.)\n- 'She bought vegetables at the market.' (Not 'buyed'. 'Buy' is irregular: buy-bought-bought.)\n- 'I paid two pounds for the tomatoes.' (Not 'I paid the tomatoes two pounds'. Use 'pay + amount + for + item'.)",
        textArabic:
          "- 'How much does this cost؟' (وليس 'How much costs this؟'. في الأسئلة، نستخدم 'does' كفعل مساعد.)\n- 'I want to buy some bread.' (وليس 'a bread'. كلمة 'bread' غير معدودة؛ قل 'some bread' أو 'a loaf of bread'.)\n- 'The fruit is very fresh today.' (وليس 'fruits'. كلمة 'fruit' اسم غير معدود عند الحديث عن الفاكهة بشكل عام.)\n- 'She bought vegetables at the market.' (وليس 'buyed'. الفعل 'buy' شاذ: buy-bought-bought.)\n- 'I paid two pounds for the tomatoes.' (وليس 'I paid the tomatoes two pounds'. استخدم التركيب 'pay + المبلغ + for + السلعة'.)",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "Market vs Supermarket:\nIn English-speaking countries, a 'market' refers to outdoor or covered stalls, while a 'supermarket' is a large self-service shop.\n\nBritish vs American Terms:\n- British: 'stall', 'queue', 'till', 'shop'\n- American: 'stand' / 'booth', 'line', 'register' / 'checkout', 'store'\n\nHaggling & Labels:\nHaggling (bargaining) is common in traditional markets but rare in UK/US supermarkets. Additionally, look for labels like 'Organic' (grown without synthetic chemicals) and 'Fair trade' (producers get fair pay).",
        textArabic:
          "السوق مقابل السوبرماركت:\nفي البلدان الناطقة بالإنجليزية، يشير 'market' عادة إلى الأكشاك المفتوحة أو المغطاة، بينما 'supermarket' هو متجر كبير بنظام الخدمة الذاتية.\n\nالمصطلحات البريطانية مقابل الأمريكية:\n- بريطاني: 'stall' (كشك)، 'queue' (طابور)، 'till' (خزينة الدفع)، 'shop' (محل)\n- أمريكي: 'stand' / 'booth'، 'line'، 'register' / 'checkout'، 'store'\n\nالمفاصلة والعلامات:\nالمساومة أو الفصال (haggling) شائعة في الأسواق الشعبية لكنها نادرة في المتاجر الكبرى في بريطانيا وأمريكا. كذلك، ابحث عن ملصقات مثل 'Organic' (عضوي بدون مواد كيميائية) و'Fair trade' (تجارة عادلة تضمن سعراً عادلاً للمنتجين).",
      },
    ],
    quiz: [
      {
        id: "market-1-q1",
        question: "In the dialogue, how much do two punnets of strawberries cost?",
        options: ["Two pounds fifty", "Three pounds", "Four pounds", "Six pounds ninety"],
        correctIndex: 2,
        explanation:
          "The vendor explains that strawberries are two pounds fifty for one punnet, or two punnets for four pounds.",
        explanationArabic:
          "يوضح البائع أن سعر علبة الفراولة الواحدة هو جنيهان ونصف، أو علبتان مقابل أربعة جنيهات.",
      },
      {
        id: "market-1-q2",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "How much costs this?",
          "I paid two pounds for the tomatoes.",
          "I want to buy a bread.",
          "She buyed vegetables yesterday.",
        ],
        correctIndex: 1,
        explanation:
          "The correct structure is 'pay + amount + for + item': 'I paid two pounds for the tomatoes.'",
        explanationArabic:
          "التركيب الصحيح هو 'pay + المبلغ + for + السلعة': 'I paid two pounds for the tomatoes.'.",
      },
      {
        id: "market-1-q3",
        question: "What is the American English equivalent of the British word 'stall'?",
        options: ["Queue", "Till", "Stand or booth", "Checkout"],
        correctIndex: 2,
        explanation:
          "In American English, a market stall is commonly referred to as a stand or booth.",
        explanationArabic: "في الإنجليزية الأمريكية، يُشار إلى كشك السوق بكلمة stand أو booth.",
      },
    ],
  },
  bakery: {
    groupId: "bakery",
    groupName: "The Bakery",
    themeTitle: "The Bakery on the Corner",
    passages: [
      {
        partNumber: 1,
        title: "The Bakery on the Corner (Part 1)",
        titleArabic: "المخبز في زاوية الشارع (الجزء الأول)",
        text: "There is a small bakery on the corner of our street. Every morning, the smell of fresh bread fills the air long before the shop opens at seven.\n\nThe baker, Mr Ahmad, starts work at four in the morning. He mixes flour, water, yeast, and salt to make the dough. After kneading it by hand, he lets it rise for about an hour. Then he shapes the dough into loaves, rolls, and baguettes before placing them in the large oven.\n\nBy the time the first customers arrive, the shelves are full. There are white bread loaves, wholemeal bread, sourdough, and flatbread. On one side of the counter, there are sweet pastries: croissants, Danish pastries, cinnamon rolls, and doughnuts glazed with sugar. The display case also has cakes — chocolate cake, carrot cake, and cheesecake — all made fresh daily.",
        textArabic:
          "يوجد مخبز صغير في زاوية شارعنا. كل صباح، تملأ رائحة الخبز الطازج الأجواء قبل وقت طويل من فتح المحل في الساعة السابعة.\n\nيبدأ الخباز، السيد أحمد، عمله في الرابعة صباحًا. يقوم بخلط الدقيق والماء والخميرة والملح لصنع العجين. وبعد عجنه يدويًا، يتركه يختمر لمدة ساعة تقريبًا. ثم يشكل العجين إلى أرغفة ولفائف وخبز باغيت فرنسي قبل وضعها في الفرن الكبير.\n\nوبحلول موعد وصول أول الزبائن، تكون الرفوف مليئة. هناك أرغفة الخبز الأبيض، وخبز القمح الكامل، والخبز المخمر، والخبز المفرود. على أحد جانبي طاولة العرض، توجد المعجنات الحلوة: الكرواسون، والمعجنات الدنماركية، ولفائف القرفة، والدونات المغطاة بالسكر. كما تحتوي واجهة العرض على الكعك — كعكة الشوكولاتة، وكعكة الجزر، وكعكة الجبن (تشيز كيك) — وجميعها طازجة يوميًا.",
      },
      {
        partNumber: 2,
        title: "The Bakery on the Corner (Part 2)",
        titleArabic: "المخبز في زاوية الشارع (الجزء الثاني)",
        text: "Mr Ahmad's wife manages the front of the shop. She serves customers, wraps orders in paper bags, and operates the till. Regular customers often order birthday cakes or wedding cakes in advance.\n\nThe bakery also sells biscuits, muffins, and scones with jam and cream. On Fridays, they make a special olive bread that sells out within an hour.\n\nI go there every Saturday to buy a loaf of sourdough and two croissants. The bread is always warm, the crust is golden and crunchy, and the inside is soft. Nothing beats fresh bread from a local bakery.",
        textArabic:
          "تدير زوجة السيد أحمد واجهة المحل. تقوم بخدمة الزبائن، وتغليف الطلبات في أكياس ورقية، وتشغيل آلة تسجيل المدفوعات (الكاشير). غالبًا ما يطلب الزبائن الدائمون كعكات أعياد الميلاد أو كعكات الزفاف مسبقًا.\n\nيبيع المخبز أيضًا البسكويت، وفطائر المافن، وحلوى السكونز مع المربى والقشدة. وفي أيام الجمعة، يصنعون خبز زيتون مميزًا ينفد في غضون ساعة.\n\nأذهب إلى هناك كل يوم سبت لشراء رغيف من الخبز المخمر وقطعتين من الكرواسون. الخبز دائمًا دافئ، وقشرته ذهبية ومقرمشة، والداخل طري. لا شيء يضاهي الخبز الطازج من مخبز محلي.",
      },
      {
        partNumber: 3,
        title: "Bakery Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة خاصة بالمخبز",
        text: "Here are key idioms and expressions inspired by baking:\n- 'The best thing since sliced bread': something excellent or very useful.\n- 'A piece of cake': something very easy to do.\n- 'Sell like hotcakes': sell very quickly and in large numbers.\n- 'Earn / make your daily bread': earn money to live on.\n- 'A baker's dozen': thirteen instead of twelve.\n- 'Half-baked': not fully thought through or poorly planned.\n- 'Knead the dough': press and fold dough firmly with your hands.\n- 'Roll out': flatten dough using a rolling pin.",
        textArabic:
          "إليك أهم المصطلحات والتعابير المستوحاة من عالم الخبز:\n- 'The best thing since sliced bread': شيء ممتاز أو مفيد للغاية.\n- 'A piece of cake': شيء سهل جدًا وبسيط.\n- 'Sell like hotcakes': يُباع بسرعة فائقة وبكميات كبيرة.\n- 'Earn / make your daily bread': يكسب لقمة عيشه وقوته اليومي.\n- 'A baker's dozen': ثلاثة عشر بدلاً من اثني عشر (دستة الخباز).\n- 'Half-baked': غير ناضج أو غير مدروس جيدًا.\n- 'Knead the dough': يعجن العجين ويضغط عليه بيديه.\n- 'Roll out': يفرد العجين باستخدام الشوبك (المرقاق).",
      },
    ],
    quiz: [
      {
        id: "bakery-q1",
        question: "What time does Mr Ahmad start work at the bakery?",
        options: [
          "At four in the morning",
          "At seven in the morning",
          "At five in the morning",
          "At six in the morning",
        ],
        correctIndex: 0,
        explanation:
          "The text states that the baker, Mr Ahmad, starts work at four in the morning to make dough.",
        explanationArabic:
          "ينص النص على أن الخباز، السيد أحمد، يبدأ عمله في الساعة الرابعة صباحًا لصنع العجين.",
      },
      {
        id: "bakery-q2",
        question: "What special item does the bakery make only on Fridays?",
        options: ["Chocolate cheesecake", "Special olive bread", "Wedding cakes", "Cinnamon rolls"],
        correctIndex: 1,
        explanation: "On Fridays, they make a special olive bread that sells out within an hour.",
        explanationArabic: "في أيام الجمعة، يصنعون خبز زيتون مميزًا ينفد في غضون ساعة واحدة.",
      },
      {
        id: "bakery-q3",
        question: "What does the idiom 'sell like hotcakes' mean?",
        options: [
          "To be sold at a discount",
          "To sell very slowly",
          "To sell very quickly and in large quantities",
          "To be served hot from the oven",
        ],
        correctIndex: 2,
        explanation: "'Sell like hotcakes' means to sell very quickly in large numbers.",
        explanationArabic:
          "يعني مصطلح 'sell like hotcakes' أن يُباع الشيء بسرعة فائقة وبكميات كبيرة.",
      },
    ],
  },
  "bakery-1": {
    groupId: "bakery-1",
    groupName: "Bakery Counter & Dialogue",
    themeTitle: "At the Bakery Counter",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Ordering at the Bakery",
        titleArabic: "حوار قصير: الطلب عند طاولة المخبز",
        text: "Customer: Good morning! Could I have a loaf of sourdough, please?\nBaker: Of course. Sliced or unsliced?\nCustomer: Unsliced, please. And two croissants.\nBaker: Freshly baked this morning. Anything else?\nCustomer: What's that cake in the display case?\nBaker: That's our carrot cake — it's made with cream cheese frosting.\nCustomer: It looks delicious. I'll take a slice.\nBaker: Would you like it in a box or a bag?\nCustomer: A bag is fine. How much is everything?\nBaker: That's five pounds twenty altogether. Cash or card?",
        textArabic:
          "الزبون: صباح الخير! هل يمكنني الحصول على رغيف من الخبز المخمر، من فضلك؟\nالخباز: بالطبع. مقطع أم غير مقطع؟\nالزبون: غير مقطع، من فضلك. واثنان من الكرواسون.\nالخباز: خُبز طازجًا هذا الصباح. أي شيء آخر؟\nالزبون: ما تلك الكعكة في واجهة العرض؟\nالخباز: هذه كعكة الجزر الخاصة بنا — مصنوعة بتزيين كريمة الجبن.\nالزبون: تبدو لذيذة. سآخذ شريحة.\nالخباز: هل تفضل وضعها في صندوق أم كيس؟\nالزبون: الكيس مناسب. كم المجموع لكل شيء؟\nالخباز: خمسة جنيهات وعشرون بنسًا إجمالاً. نقدًا أم بالبطاقة؟",
      },
      {
        partNumber: 2,
        title: "Common Mistakes with Bakery Vocabulary",
        titleArabic: "أخطاء شائعة مع مفردات المخبز",
        text: "- Say 'I want a loaf of bread, please' or 'some bread'. (Bread is uncountable; never say 'a bread').\n- Say 'The cake is delicious' or 'absolutely delicious'. (Never say 'very delicious' because delicious is already strong).\n- Say 'She has been baking a cake for three hours'. (Use 'for' with durations, not 'since').\n- Say 'I like bread with butter'. (Do not use 'breads' when talking about bread generally).\n- Say 'The dough is soft enough now'. ('Enough' comes after the adjective, not before).",
        textArabic:
          "- قل 'I want a loaf of bread, please' أو 'some bread'. (كلمة bread غير معدودة؛ لا تقل أبدًا 'a bread').\n- قل 'The cake is delicious' أو 'absolutely delicious'. (لا تقل 'very delicious' لأن delicious صفة قوية بحد ذاتها).\n- قل 'She has been baking a cake for three hours'. (استخدم 'for' مع الفترات الزمنية، وليس 'since').\n- قل 'I like bread with butter'. (لا تجمع كلمة 'breads' عند الحديث عن الخبز بوجه عام).\n- قل 'The dough is soft enough now'. (تأتي كلمة 'enough' بعد الصفة وليس قبلها).",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "In British English, people often say 'the baker's' to refer to the bakery shop. Some vocabulary differences between dialects include British 'biscuit' versus American 'cookie', and British 'icing' versus American 'frosting'. Afternoon tea is a classic British tradition featuring hot tea served with scones, clotted cream, and jam alongside dainty cakes. Today, artisanal sourdough bakeries focusing on traditional fermentation have become hugely popular worldwide.",
        textArabic:
          "في الإنجليزية البريطانية، غالبًا ما يقول الناس 'the baker's' للإشارة إلى متجر المخبز. تشمل بعض فروق المفردات بين اللهجات: 'biscuit' بالبريطانية مقابل 'cookie' بالأمريكية، و'icing' بالبريطانية مقابل 'frosting' بالأمريكية. يُعد شاي بعد الظهر تقليدًا بريطانيًا كلاسيكيًا يُقدم فيه الشاي الساخن مع كعك السكونز والقشدة المخثرة والمربى إلى جانب الكعكات الصغيرة. واليوم، اكتسبت المخابز الحرفية المتخصصة في الخبز المخمر طبيعيًا شعبية هائلة حول العالم.",
      },
    ],
    quiz: [
      {
        id: "bakery-1-q1",
        question: "What frosting is used on the carrot cake in the dialogue?",
        options: [
          "Chocolate fudge frosting",
          "Cream cheese frosting",
          "Vanilla butter frosting",
          "Caramel glaze",
        ],
        correctIndex: 1,
        explanation: "The baker explains that the carrot cake is made with cream cheese frosting.",
        explanationArabic: "يوضح الخباز أن كعكة الجزر مصنوعة بتزيين كريمة الجبن.",
      },
      {
        id: "bakery-1-q2",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "I want to buy a bread.",
          "The cake is very delicious.",
          "The dough is enough soft.",
          "I want a loaf of bread, please.",
        ],
        correctIndex: 3,
        explanation: "Because 'bread' is uncountable, we say 'a loaf of bread' or 'some bread'.",
        explanationArabic:
          "نظرًا لأن كلمة 'bread' غير معدودة، نقول 'a loaf of bread' أو 'some bread'.",
      },
      {
        id: "bakery-1-q3",
        question: "What is the American English equivalent of the British word 'icing'?",
        options: ["Cookie", "Frosting", "Scone", "Batter"],
        correctIndex: 1,
        explanation:
          "British English uses 'icing' while American English typically uses 'frosting' for cake topping.",
        explanationArabic:
          "تستخدم الإنجليزية البريطانية كلمة 'icing' بينما تستخدم الإنجليزية الأمريكية عادة 'frosting' لتزيين الكعك.",
      },
    ],
  },
  office: {
    groupId: "office",
    groupName: "The Post Office - Part 1",
    themeTitle: "Sending Mail and Parcels",
    passages: [
      {
        partNumber: 1,
        title: "Sending a Parcel - Part 1",
        titleArabic: "إرسال طرد - الجزء الأول",
        text: "Yesterday, I went to the post office to send a birthday present to my cousin in another city. It was my first time sending a parcel, so I was not sure what to do. When I arrived, there was a short queue at the counter. While I waited, I looked around. There were shelves with padded envelopes, cardboard boxes, packing tape, and bubble wrap. I picked up a medium-sized box and some tape.",
        textArabic:
          "بالأمس، ذهبت إلى مكتب البريد لإرسال هدية عيد ميلاد لابن عمي في مدينة أخرى. كانت هذه أول مرة أرسل فيها طردًا، لذلك لم أكن متأكدًا مما يجب فعله. عندما وصلت، كان هناك طابور قصير عند شباك الخدمة. بينما كنت أنتظر، نظرت حولي. كانت هناك رفوف بها مظاريف مبطنة، وصناديق كرتونية، وشريط تغليف، ولفائف فقاعية. أخذت صندوقًا متوسط الحجم وبعض الشريط اللاصق.",
      },
      {
        partNumber: 2,
        title: "Sending a Parcel - Part 2",
        titleArabic: "إرسال طرد - الجزء الثاني",
        text: "At the counter, the postal worker weighed my parcel on a scale. It was just under two kilograms. She asked if I wanted to send it by standard delivery or express delivery. Standard takes three to five working days; express arrives the next day but costs more. I chose standard. She gave me a form to fill in with the sender's address and the recipient's address. I also wrote the postcode carefully because an incorrect postcode can delay the delivery. I paid the postage fee and she stuck stamps and a tracking label on the box, giving me a receipt with a tracking number. Before leaving, I bought a book of stamps and posted two letters in the red pillar box outside. My cousin received the parcel two days later and called to thank me.",
        textArabic:
          "عند شباك الخدمة، وزنت موظفة البريد طردي على ميزان. كان وزنه أقل بقليل من كيلوغرامين. وسألتني عما إذا كنت أرغب في إرساله عبر التوصيل العادي أو التوصيل السريع. يستغرق التوصيل العادي من ثلاثة إلى خمسة أيام عمل، بينما يصل السريع في اليوم التالي لكنه يكلف أكثر. اخترت التوصيل العادي. وأعطتني استمارة لملئها بعنوان المرسل وعنوان المستلم. وكتبت الرمز البريدي بعناية لأن الرمز البريدي غير الصحيح قد يؤخر التسليم. دفعت رسوم البريد ولصقت هي الطوابع وملصق التتبع على الصندوق، وأعطتني إيصالاً به رقم التتبع. قبل المغادرة، اشتريت دفتر طوابع ووضعت رسالتين في صندوق البريد الأحمر بالخارج. استلم ابن عمي الطرد بعد يومين واتصل بي لشكري.",
      },
      {
        partNumber: 3,
        title: "Postal Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وعبارات البريد",
        text: "Here are common idioms and phrasal verbs related to the post:\n- 'snail mail': regular postal mail (as opposed to email).\n- 'return to sender': send something back to the person who sent it.\n- 'drop off': leave a parcel or letter at a post office.\n- 'pick up': collect a package from a sorting office.\n- 'sign for': provide a signature to confirm receipt of delivery.\n- 'keep someone posted': keep someone informed of updates.",
        textArabic:
          "إليك مصطلحات وعبارات فعلية شائعة متعلقة بالبريد:\n- 'snail mail': البريد العادي البطيء (مقارنة بالبريد الإلكتروني).\n- 'return to sender': إعادة الشيء إلى الشخص المرسل.\n- 'drop off': تسليم أو ترك طرد أو رسالة في مكتب البريد.\n- 'pick up': استلام طرد من مكتب الفرز.\n- 'sign for': التوقيع لتأكيد استلام الشحنة.\n- 'keep someone posted': إبقاء شخص ما على اطلاع دائم بآخر المستجدات.",
      },
    ],
    quiz: [
      {
        id: "office-q1",
        question: "Why did the writer go to the post office?",
        options: [
          "To send a birthday present to their cousin",
          "To collect an important package",
          "To complain about a delayed delivery",
          "To open a new bank account",
        ],
        correctIndex: 0,
        explanation:
          "The text mentions: 'Yesterday, I went to the post office to send a birthday present to my cousin in another city.'",
        explanationArabic:
          "يذكر النص: 'بالأمس، ذهبت إلى مكتب البريد لإرسال هدية عيد ميلاد لابن عمي في مدينة أخرى'.",
      },
      {
        id: "office-q2",
        question: "Why is writing the postcode carefully so important?",
        options: [
          "It is required for purchasing stamps",
          "An incorrect postcode can delay the delivery",
          "It determines the color of the stamps",
          "The postal worker cannot weigh the parcel without it",
        ],
        correctIndex: 1,
        explanation:
          "The postal worker explained that an incorrect postcode can delay the delivery.",
        explanationArabic: "أوضحت موظفة البريد أن الرمز البريدي غير الصحيح يمكن أن يؤخر التسليم.",
      },
      {
        id: "office-q3",
        question: "What does the idiom 'snail mail' mean?",
        options: [
          "Mail delivered exclusively by trains",
          "Letters with incorrect address labels",
          "Regular physical postal mail as opposed to email",
          "Packages that have been damaged in transit",
        ],
        correctIndex: 2,
        explanation:
          "'Snail mail' refers to traditional physical post, which is slower compared to electronic mail (email).",
        explanationArabic:
          "يشير مصطلح 'snail mail' إلى البريد الفعلي التقليدي، وهو أبطأ مقارنة بالبريد الإلكتروني.",
      },
    ],
  },
  "l5-—-the-post-office-2": {
    groupId: "l5-—-the-post-office-2",
    groupName: "The Post Office - Part 2",
    themeTitle: "Postal Counter & Traditions",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: At the Postal Counter",
        titleArabic: "حوار قصير: عند شباك البريد",
        text: "Customer: I'd like to send this parcel to Manchester, please.\nClerk: Certainly. Let me weigh it first. It's one point eight kilos.\nCustomer: How much is standard delivery?\nClerk: That will be four pounds fifty. Express delivery is eight pounds and arrives tomorrow.\nCustomer: Standard is fine. Do I need to fill in a form?\nClerk: Yes, write the sender and recipient addresses clearly here.\nCustomer: Do I need to include the postcode?\nClerk: Definitely — without it, there could be a delivery delay.\nCustomer: Can I track the parcel?\nClerk: Yes, here is your receipt with a tracking number to follow online.",
        textArabic:
          "الزبون: أود إرسال هذا الطرد إلى مانشستر، من فضلك.\nالموظف: بالتأكيد. دعني أزنه أولاً. وزنه كيلوغرام واحد وثمانمائة غرام.\nالزبون: كم تبلغ تكلفة التوصيل العادي؟\nالموظف: أربعة جنيهات وخمسون بنساً. التوصيل السريع ثمانية جنيهات ويصل غداً.\nالزبون: التوصيل العادي مناسب. هل أحتاج إلى ملء استمارة؟\nالموظف: نعم، اكتب عنوان المرسل والمستلم بوضوح هنا.\nالزبون: هل يلزم كتابة الرمز البريدي؟\nالموظف: بالتأكيد — بدونه، قد يحدث تأخير في التسليم.\nالزبون: هل يمكنني تتبع الطرد؟\nالموظف: نعم، إليك إيصالك مع رقم التتبع للمتابعة عبر الإنترنت.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes with Postal Terms",
        titleArabic: "أخطاء شائعة في المصطلحات البريدية",
        text: "Here are key grammar and vocabulary rules when discussing postal services:\n- Say 'a letter' or 'an email', not 'a mail'. In British English, 'mail' is uncountable.\n- Say 'I posted the letter at the post office' or 'in the postbox'. Use 'at' for the building and 'in' for the slot.\n- Say 'The package arrived three days ago' or 'after three days'. Do not combine 'after' and 'ago'.\n- The past tense of 'stick' is 'stuck' (e.g. 'She stuck the stamp on the envelope'). 'Sticked' is incorrect.\n- Use 'recipient' for the receiver, not 'destinatary'.",
        textArabic:
          "إليك قواعد لغوية ومصطلحات أساسية عند التحدث عن الخدمات البريدية:\n- قل 'a letter' (رسالة) أو 'an email' (بريد إلكتروني)، وليس 'a mail'. كلمة 'mail' في الإنجليزية البريطانية اسم غير معدود.\n- قل 'I posted the letter at the post office' (أرسلت الرسالة في مكتب البريد) أو 'in the postbox' (في صندوق البريد).\n- قل 'The package arrived three days ago' أو 'after three days'. لا تجمع بين 'after' و 'ago'.\n- الماضي من الفعل 'stick' هو 'stuck' (مثل: ألصقت الطابع على المظروف). كلمة 'sticked' غير صحيحة.\n- استخدم كلمة 'recipient' للإشارة إلى المستلم، وليس 'destinatary'.",
      },
      {
        partNumber: 3,
        title: "Cultural Notes: British vs American Post",
        titleArabic: "ملاحظات ثقافية: البريد البريطاني مقابل الأمريكي",
        text: "In the UK, postal services are run by Royal Mail, famous for red vans and iconic red pillar boxes dating back to 1852. In the US, post is handled by the USPS with blue collection boxes.\nKey vocabulary differences include:\n- British: 'post', 'postbox', 'postcode', 'parcel'\n- American: 'mail', 'mailbox', 'zip code', 'package'\n\nIn addition, 'Signed For' delivery requires a signature upon arrival, while 'Tracked' delivery lets customers trace the journey online. During the festive season, Royal Mail announces the 'last posting date' for Christmas cards, maintaining a beloved holiday tradition.",
        textArabic:
          "في المملكة المتحدة، تتولى هيئة البريد الملكي (Royal Mail) الخدمات البريدية، وتشتهر بشاحناتها وصناديق بريدها الحمراء الشهيرة التي تعود إلى عام 1852. وفي الولايات المتحدة، تتولى خدمة البريد الأمريكية (USPS) ذلك بصناديقها الزرقاء.\nتشمل أبرز الفروق في المفردات:\n- بريطاني: 'post', 'postbox', 'postcode', 'parcel'\n- أمريكي: 'mail', 'mailbox', 'zip code', 'package'\n\nبالإضافة إلى ذلك، تتطلب خدمة 'Signed For' توقيعاً عند الاستلام، بينما تتيح خدمة 'Tracked' تتبع مسار الطرد عبر الإنترنت. وخلال موسم الأعياد، يعلن البريد الملكي عن 'آخر موعد للإرسال' لبطاقات عيد الميلاد حفاظاً على هذا التقليد المحبب.",
      },
    ],
    quiz: [
      {
        id: "l5-—-the-post-office-2-q1",
        question:
          "In the dialogue, what was the price difference between standard and express delivery?",
        options: [
          "Standard was £4.50 and express was £8.00",
          "Standard was £2.00 and express was £10.00",
          "Standard was free and express was £5.00",
          "Both options cost £4.50",
        ],
        correctIndex: 0,
        explanation:
          "The clerk stated that standard delivery was £4.50 and express delivery was £8.00.",
        explanationArabic:
          "ذكر الموظف أن التوصيل العادي بـ 4.50 جنيهات والتوصيل السريع بـ 8.00 جنيهات.",
      },
      {
        id: "l5-—-the-post-office-2-q2",
        question: "What is the American English equivalent of the British word 'postcode'?",
        options: ["Area code", "Zip code", "Mail number", "Tracking tag"],
        correctIndex: 1,
        explanation: "In American English, 'postcode' is referred to as 'zip code'.",
        explanationArabic:
          "في الإنجليزية الأمريكية، يُطلق على الرمز البريدي 'postcode' اسم 'zip code'.",
      },
      {
        id: "l5-—-the-post-office-2-q3",
        question: "Which sentence is grammatically correct?",
        options: [
          "She sticked the stamp on the envelope.",
          "I sent him a mail yesterday.",
          "She stuck the stamp on the envelope.",
          "Write the address of the destinatary.",
        ],
        correctIndex: 2,
        explanation:
          "'Stick' is an irregular verb (stick - stuck - stuck), so 'She stuck the stamp on the envelope' is correct.",
        explanationArabic:
          "الفعل 'stick' غير قياسي (stick - stuck - stuck)، لذا فإن جملة 'She stuck the stamp on the envelope' هي الصحيحة.",
      },
    ],
  },
  spa: {
    groupId: "spa",
    groupName: "The Space Center",
    themeTitle: "Exploring the Space Center",
    passages: [
      {
        partNumber: 1,
        title: "A Day at the Space Center",
        titleArabic: "يوم في مركز الفضاء",
        text: "During the school holidays, my father took me and my brother to the National Space Center. It was a three-hour drive, but the visit was worth every minute. The first thing we saw was a full-size replica of a rocket standing outside the building. Inside, the ground floor had an exhibition about the history of space exploration. We learned that the first person in space was Yuri Gagarin in 1961, and the first moon landing was in 1969 during the Apollo 11 mission. Upstairs, there was an interactive section where visitors could try on a spacesuit and sit in a mock-up of a spacecraft cockpit. The spacesuit was surprisingly heavy — astronauts train for months to get used to working in them.",
        textArabic:
          "خلال العطلة المدرسية، أخذني والدي أنا وأخي إلى المركز الوطني للفضاء. كانت الرحلة بالسيارة تستغرق ثلاث ساعات، لكن الزيارة كانت تستحق كل دقيقة. كان أول ما رأيناه هو نموذج بالحجم الطبيعي لصاروخ يقف خارج المبنى. وفي الداخل، احتوى الطابق الأرضي على معرض حول تاريخ استكشاف الفضاء. تعلمنا أن أول إنسان يصعد إلى الفضاء كان يوري جاجارين في عام 1961، وكان أول هبوط على سطح القمر في عام 1969 خلال مهمة أبولو 11. وفي الطابق العلوي، كان هناك قسم تفاعلي حيث يمكن للزوار تجربة ارتداء بدلة فضاء والجلوس في نموذج لقمرة قيادة مركبة فضائية. كانت بدلة الفضاء ثقيلة بشكل مدهش — حيث يتدرب رواد الفضاء لأشهر ليعتادوا على العمل بها.",
      },
      {
        partNumber: 2,
        title: "The Planetarium & Space Station",
        titleArabic: "القبة السماوية ومحطة الفضاء",
        text: "The planetarium was my favourite part. We sat in reclining chairs while a dome-shaped screen above us showed a film about the solar system. We flew past Jupiter's moons, through Saturn's rings, and out to the edge of the Milky Way. It felt like we were really floating in space. There was also a section about the International Space Station. A display showed what astronauts eat — dried food in pouches that they add water to. Another screen showed how astronauts exercise in zero gravity to keep their muscles strong. Before we left, we visited the gift shop and I bought a poster of the planets, while my brother got freeze-dried ice cream!",
        textArabic:
          "كانت القبة السماوية الجزء المفضل لدي. جلسنا في مقاعد مائلة بينما عرضت شاشة مقببة فوقنا فيلماً عن النظام الشمسي. حلقنا بجوار أقمار المشتري، وعبر حلقات زحل، وصولاً إلى حافة مجرة درب التبانة. شعرنا وكأننا نطفو حقاً في الفضاء. كان هناك أيضاً قسم عن محطة الفضاء الدولية. وأظهر معرض ما يأكله رواد الفضاء — طعام مجفف في أكياس يضيفون إليها الماء. وعرضت شاشة أخرى كيف يمارس رواد الفضاء التمارين الرياضية في بيئة انعدام الجاذبية للحفاظ على قوة عضلاتهم. وقبل أن نغادر، زرنا متجر الهدايا واشتريت ملصقاً للكواكب، بينما حصل أخي على مثلجات مجففة بالتجميد!",
      },
      {
        partNumber: 3,
        title: "Space Idioms & Expressions",
        titleArabic: "تعبيرات ومصطلحات الفضاء",
        text: "Space inspires many colourful English idioms:\n- 'over the moon': extremely happy ('She was over the moon when she passed her test.')\n- 'reach for the stars': aim very high and be ambitious ('Don't give up — reach for the stars!')\n- 'out of this world': extraordinary and amazing ('The planetarium show was out of this world.')\n- 'once in a blue moon': very rarely ('I only visit the museum once in a blue moon.')\n- 'down to earth': practical and realistic ('Despite his success, he remains very down to earth.')\n- 'take off': leave the ground or become successful quickly ('The rocket took off on schedule.')",
        textArabic:
          "يلهم الفضاء العديد من التعبيرات والمصطلحات الإنجليزية المميزة:\n- 'over the moon': سعيد للغاية ('كانت في غاية السعادة عندما اجتازت اختبارها.')\n- 'reach for the stars': يطمح للأفضل ويكون طموحاً ('لا تستسلم — اسعَ لتحقيق أعلى الأهداف!')\n- 'out of this world': رائع وغير عادي ('كان عرض القبة السماوية رائعاً للغاية.')\n- 'once in a blue moon': نادراً جداً ('أنا أزور المتحف نادراً جداً.')\n- 'down to earth': متواضع وعملي وواقعي ('على الرغم من نجاحه، فإنه يظل شخصاً متواضعاً وواقعياً.')\n- 'take off': ينطلق أو يحقق نجاحاً سريعاً ('انطلق الصاروخ في الموعد المحدد.')",
      },
    ],
    quiz: [
      {
        id: "spa-q1",
        question:
          "According to the exhibition, who was the first human to travel into outer space?",
        options: [
          "Neil Armstrong in 1969",
          "Yuri Gagarin in 1961",
          "Buzz Aldrin in 1965",
          "Michael Collins in 1971",
        ],
        correctIndex: 1,
        explanation:
          "The text mentions that Yuri Gagarin became the first person in space in 1961.",
        explanationArabic: "يذكر النص أن يوري جاجارين أصبح أول إنسان يصعد إلى الفضاء في عام 1961.",
      },
      {
        id: "spa-q2",
        question:
          "How do astronauts prepare food on the International Space Station according to the display?",
        options: [
          "They cook fresh meals on electric stoves",
          "They add water to dried food pouches",
          "They grow all their meals inside greenhouses",
          "They eat only liquid pills",
        ],
        correctIndex: 1,
        explanation:
          "The exhibition explained that astronauts eat dried food in pouches that they rehydrate with water.",
        explanationArabic:
          "أوضح المعرض أن رواد الفضاء يتناولون طعاماً مجففاً في أكياس يضيفون إليها الماء.",
      },
      {
        id: "spa-q3",
        question: "What does the idiom 'out of this world' mean in everyday English?",
        options: [
          "Extremely amazing or extraordinary",
          "Located on another planet",
          "Difficult to understand",
          "Very expensive to buy",
        ],
        correctIndex: 0,
        explanation:
          "'Out of this world' is used idiomatically to describe something extraordinary or fantastic.",
        explanationArabic:
          "يُستخدم المصطلح 'out of this world' مجازياً لوصف شيء مذهل أو استثنائي للغاية.",
      },
    ],
  },
  "l7-—-the-space-center-2": {
    groupId: "l7-—-the-space-center-2",
    groupName: "The Space Center 2",
    themeTitle: "Rocket Science & Space Culture",
    passages: [
      {
        partNumber: 1,
        title: "Guided Tour Mini Dialogue",
        titleArabic: "حوار الجولة الإرشادية لمركز الفضاء",
        text: "Guide: 'This is a full-size replica of the Saturn V rocket used in the Apollo missions.'\nVisitor: 'How tall is it?'\nGuide: 'About one hundred and eleven metres — taller than the Statue of Liberty.'\nVisitor: 'How fast does a rocket travel?'\nGuide: 'To escape Earth's gravity, it needs to reach about forty thousand kilometres per hour.'\nVisitor: 'That's incredible! How long does it take to reach the Moon?'\nGuide: 'Apollo 11 took about three days to get there.'\nVisitor: 'Do astronauts feel scared during launch?'\nGuide: 'Many say they feel excited rather than scared. They've trained for years, so they trust the equipment.'\nVisitor: 'Can ordinary people go to space now?'\nGuide: 'Yes, space tourism is growing through private flights, though tickets remain expensive.'",
        textArabic:
          "المرشد: 'هذا نموذج بالحجم الطبيعي لصاروخ زحل 5 المستخدم في مهمات أبولو.'\nالزائر: 'كم يبلغ ارتفاعه؟'\nالمرشد: 'حوالي 111 متراً — أي أطول من تمثال الحرية.'\nالزائر: 'ما مدى سرعة انطلاق الصاروخ؟'\nالمرشد: 'للهروب من جاذبية الأرض، يحتاج الصاروخ للوصول إلى سرعة حوالي أربعين ألف كيلومتر في الساعة.'\nالزائر: 'هذا مذهل! كم من الوقت يستغرق الوصول إلى القمر؟'\nالمرشد: 'استغرقت أبولو 11 حوالي ثلاثة أيام للوصول إلى هناك.'\nالزائر: 'هل يشعر رواد الفضاء بالخوف أثناء الإطلاق؟'\nالمرشد: 'يقول الكثيرون إنهم يشعرون بالحماس بدلاً من الخوف. لقد تدربوا لسنوات، لذا فهم يثقون في المعدات.'\nالزائر: 'هل يمكن للناس العاديين الذهاب إلى الفضاء الآن؟'\nالمرشد: 'نعم، سياحة الفضاء آخذة في النمو من خلال الرحلات الخاصة، على الرغم من أن التذاكر لا تزال باهظة الثمن.'",
      },
      {
        partNumber: 2,
        title: "Common Space Grammar & Usage Mistakes",
        titleArabic: "أخطاء شائعة في قواعد ومفردات الفضاء",
        text: "When discussing space, keep these essential language corrections in mind:\n- Incorrect: 'The Earth goes around the Sun.' -> Correct: 'The Earth orbits the Sun' or 'revolves around the Sun.' ('Rotate' means spinning on its own axis).\n- Incorrect: 'There is no gravity in space.' -> Correct: 'There is microgravity in space' / 'Astronauts experience weightlessness.' (Gravity keeps planets in orbit; astronauts float in free fall).\n- Incorrect: 'The astronaut weared a spacesuit.' -> Correct: 'The astronaut wore a spacesuit.' ('Wear' is irregular: wear–wore–worn).\n- Incorrect: 'He is interested to become an astronaut.' -> Correct: 'He is interested in becoming an astronaut.' (Always use 'interested in + -ing').\n- Incorrect: 'The moon is a star.' -> Correct: 'The Moon is a natural satellite.' (Stars produce light through nuclear fusion, while moons reflect sunlight).",
        textArabic:
          "عند التحدث عن الفضاء، تذكر هذه التصحيحات اللغوية الأساسية:\n- خطأ: 'The Earth goes around the Sun.' -> صحيح: 'The Earth orbits the Sun' أو 'revolves around the Sun.' (حيث أن 'rotate' تعني الدوران حول المحور).\n- خطأ: 'There is no gravity in space.' -> صحيح: 'There is microgravity in space' أو 'Astronauts experience weightlessness.' (الجاذبية موجودة وتبقي الأجرام في مداراتها؛ والرواد يطفون بسبب السقوط الحر المستمر).\n- خطأ: 'The astronaut weared a spacesuit.' -> صحيح: 'The astronaut wore a spacesuit.' (الفعل غير منتظم: wear–wore–worn).\n- خطأ: 'He is interested to become an astronaut.' -> صحيح: 'He is interested in becoming an astronaut.' (التركيب الصحيح هو 'interested in + -ing').\n- خطأ: 'The moon is a star.' -> صحيح: 'The Moon is a natural satellite.' (النجوم تنتج الضوء بالاندماج النووي، بينما يعكس القمر ضوء الشمس).",
      },
      {
        partNumber: 3,
        title: "Space Agencies & Global Terminology",
        titleArabic: "وكالات الفضاء والمصطلحات الدولية",
        text: "Space exploration is a global endeavor with diverse terms:\n- Space Agencies: NASA represents the United States, ESA (European Space Agency) represents 22 European nations, and Roscosmos is the Russian agency.\n- Space Travellers: English speakers use 'Astronaut', Russian terminology uses 'Cosmonaut', and Chinese spacefarers are known as 'Taikonauts'.\n- Landmark Missions: Apollo 11 (first manned moon landing, 1969), the Hubble Space Telescope (launched in 1990 for deep-space astronomy), and Mars rovers Curiosity and Perseverance.\n- Spelling Differences: British English writes 'centre', 'programme', and 'colour', while American English uses 'center', 'program', and 'color'. In aerospace science, American spelling is widely adopted internationally.",
        textArabic:
          "استكشاف الفضاء مسعى عالمي يضم مصطلحات وتسميات متنوعة:\n- وكالات الفضاء: تمثل ناسا (NASA) الولايات المتحدة، وتمثل إيسا (ESA) 22 دولة أوروبية، وروسكوزموس (Roscosmos) هي الوكالة الروسية.\n- رواد الفضاء: يستخدم المتحدثون بالإنجليزية مصطلح 'Astronaut'، والمصطلح الروسي هو 'Cosmonaut'، بينما يُعرف رواد الفضاء الصينيون بـ 'Taikonauts'.\n- مهمات تاريخية: أبولو 11 (أول هبوط مأهول على القمر عام 1969)، وتلسكوب هابل الفضائي (أُطلق عام 1990 لرصد أعماق الفضاء)، ومركبات استكشاف المريخ كوريوسيتي وبيرسيفيرانس.\n- فروق الهجاء: يكتب الإنجليزية البريطانية 'centre' و'programme' و'colour'، بينما تستخدم الإنجليزية الأمريكية 'center' و'program' و'color'. وفي علوم الفضاء، يُعتمد الهجاء الأمريكي على نطاق واسع دولياً.",
      },
    ],
    quiz: [
      {
        id: "l7-—-the-space-center-2-q1",
        question:
          "How fast does a rocket need to travel to escape Earth's gravity according to the tour guide?",
        options: [
          "About 5,000 kilometres per hour",
          "About 40,000 kilometres per hour",
          "About 100,000 kilometres per hour",
          "About 1,000 kilometres per hour",
        ],
        correctIndex: 1,
        explanation:
          "The guide explains that reaching approximately 40,000 km/h is necessary to overcome Earth's gravitational pull.",
        explanationArabic:
          "يوضح المرشد أن الوصول إلى سرعة تقارب 40,000 كم/ساعة ضروري للهروب من الجاذبية الأرضية.",
      },
      {
        id: "l7-—-the-space-center-2-q2",
        question:
          "Which sentence follows correct English grammar for expressing an interest in a profession?",
        options: [
          "He is interested to become an astronaut.",
          "He is interested in becoming an astronaut.",
          "He is interested become an astronaut.",
          "He is interesting to become an astronaut.",
        ],
        correctIndex: 1,
        explanation:
          "The adjective 'interested' requires the preposition 'in' followed by a gerund ('-ing' form).",
        explanationArabic:
          "الصفة 'interested' تتطلب حرف الجر 'in' متبوعاً باسم الفعل بصيغة '-ing'.",
      },
      {
        id: "l7-—-the-space-center-2-q3",
        question: "What is the specific Russian term used for space travellers?",
        options: ["Astronaut", "Cosmonaut", "Taikonaut", "Spacenaut"],
        correctIndex: 1,
        explanation:
          "'Cosmonaut' is the Russian term for a space traveller, while 'Taikonaut' is used for Chinese astronauts.",
        explanationArabic:
          "'Cosmonaut' هو المصطلح الروسي لرائد الفضاء، بينما يُستخدم 'Taikonaut' لرواد الفضاء الصينيين.",
      },
    ],
  },
  "camping-site": {
    groupId: "camping-site",
    groupName: "The Camping Site",
    themeTitle: "A Weekend in the Countryside",
    passages: [
      {
        partNumber: 1,
        title: "A Weekend in the Countryside - Part 1",
        titleArabic: "عطلة نهاية الأسبوع في الريف - الجزء الأول",
        text: "Last summer, my family went camping for the first time. We drove to a campsite in the Lake District, about three hours from our home. When we arrived, the campsite warden showed us to our pitch — a flat area of grass where we could set up our tent. My father and I unpacked the car and started putting up the tent. It took about forty minutes because neither of us had done it before. The instructions were confusing, but eventually we managed to get all the poles in place and hammer the pegs into the ground with a mallet. The campsite had basic facilities: a shower block with hot water, a toilet block, a washing-up area for cleaning dishes, and a small shop that sold essentials like bread, milk, and firewood.",
        textArabic:
          "في الصيف الماضي، ذهبت عائلتي للتخييم لأول مرة. قدنا سيارتنا إلى موقع تخييم في منطقة البحيرات (ليك ديستريكت)، على بعد حوالي ثلاث ساعات من منزلنا. وعندما وصلنا، أرشدنا مشرف موقع التخييم إلى موضع خيمتنا — وهو مساحة مستوية من العشب حيث يمكننا نصب خيمتنا. قمت أنا ووالدي بتفريغ أمتعة السيارة وبدأنا في نصب الخيمة. استغرق الأمر حوالي أربعين دقيقة لأن أيًا منا لم يفعل ذلك من قبل. كانت التعليمات مربكة، لكننا تمكنا في النهاية من وضع جميع الأعمدة في مكانها وتثبيت الأوتاد في الأرض باستخدام مطرقة خشبية. كان موقع التخييم يحتوي على مرافق أساسية: مبنى للاستحمام به ماء ساخن، ومبنى للمراحيض، ومكان لغسل الأطباق، ومتجر صغير يبيع الضروريات مثل الخبز والحليب وحطب الوقود.",
      },
      {
        partNumber: 2,
        title: "A Weekend in the Countryside - Part 2",
        titleArabic: "عطلة نهاية الأسبوع في الريف - الجزء الثاني",
        text: "In the evening, we lit a campfire in the fire pit and cooked sausages on a portable barbecue. We also roasted marshmallows on sticks. The sky was incredibly clear, and we could see thousands of stars — something we never see in the city because of light pollution. The next morning, I woke up early. The air was cool and fresh, and I could hear birds singing. We had breakfast outside — cereal, toast cooked on a camping stove, and hot chocolate. After breakfast, we went on a hike through the woods and along the lake. We saw rabbits, squirrels, and a heron standing in the shallow water. When it was time to leave on Sunday afternoon, we took down the tent, packed up our gear, and made sure we left no rubbish behind. The campsite rule is 'Leave no trace.'",
        textArabic:
          "في المساء، أشعلنا نار المخيم في موقد النار وطهونا النقانق على شواية محمولة. كما قمنا بتحميص المارشميلو على أعواد خشبية. كانت السماء صافية بشكل لا يُصدق، واستطعنا رؤية آلاف النجوم — وهو أمر لا نراه أبدًا في المدينة بسبب التلوث الضوئي. في صباح اليوم التالي، استيقظت مبكرًا. كان الهواء عليلًا ومنعشًا، وسمعت تغريد الطيور. تناولنا وجبة الإفطار في الهواء الطلق — رقائق الحبوب، وتوست مطهو على موقد التخييم، وشوكولاتة ساخنة. بعد الإفطار، ذهبنا في نزهة سيرًا على الأقدام عبر الغابة وعلى طول البحيرة. رأينا أرانب وسناجب وطائر مالك الحزين يقف في المياه الضحلة. وعندما حان وقت المغادرة بعد ظهر يوم الأحد، قمنا بفك الخيمة وحزمنا أمتعتنا وتأكدنا من عدم ترك أي قمامة خلفنا. فقاعدة موقع التخييم هي 'لا تترك أثرًا'.",
      },
      {
        partNumber: 3,
        title: "Camping Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة للتخييم",
        text: "Here are key camping idioms and expressions:\n- 'pitch a tent': set up or erect a tent.\n- 'rough it': live simply without normal comforts or electricity.\n- 'under the stars': sleeping outdoors at night.\n- 'in the middle of nowhere': in a remote, isolated place.\n- 'the great outdoors': nature and countryside.\n- 'put up / take down': erect or dismantle a tent.\n- 'pack up': collect your things and prepare to leave.\n- 'happy camper': a contented, satisfied person.",
        textArabic:
          "إليك أهم مصطلحات وتعبيرات التخييم:\n- 'pitch a tent': ينصب خيمة أو يثبتها.\n- 'rough it': يعيش ببساطة دون وسائل الراحة المعتادة أو الكهرباء.\n- 'under the stars': النوم في الهواء الطلق ليلاً تحت السماء.\n- 'in the middle of nowhere': في مكان ناءٍ ومنعزل تماماً.\n- 'the great outdoors': الطبيعة الخلابة والريف المفتوح.\n- 'put up / take down': ينصب الخيمة / يفكك الخيمة.\n- 'pack up': يحزم الأمتعة ويستعد للمغادرة.\n- 'happy camper': شخص راضٍ وسعيد ومطمئن.",
      },
    ],
    quiz: [
      {
        id: "camping-site-q1",
        question: "Why did setting up the tent take forty minutes for the family?",
        options: [
          "They were missing the tent poles and pegs",
          "Neither of them had done it before and the instructions were confusing",
          "It started raining heavily as soon as they arrived",
          "The campsite warden asked them to move to another pitch",
        ],
        correctIndex: 1,
        explanation:
          "The text explains that setting up the tent took forty minutes because neither of them had pitched a tent before and the instructions were confusing.",
        explanationArabic:
          "يوضح النص أن نصب الخيمة استغرق أربعين دقيقة لأن أيًا منهما لم يقم بنصب خيمة من قبل وكانت التعليمات مربكة.",
      },
      {
        id: "camping-site-q2",
        question: "Why could the family see thousands of stars at the campsite?",
        options: [
          "They used a high-powered telescope",
          "The campsite lights illuminated the sky",
          "The sky was clear and free of city light pollution",
          "They were camped on a high mountain summit",
        ],
        correctIndex: 2,
        explanation:
          "The passage notes that the sky was clear and they were away from city light pollution, making thousands of stars visible.",
        explanationArabic:
          "يشير النص إلى أن السماء كانت صافية وكانوا بعيدين عن التلوث الضوئي في المدينة، مما جعل آلاف النجوم مرئية بوضوح.",
      },
      {
        id: "camping-site-q3",
        question: "What does the idiom 'rough it' mean?",
        options: [
          "To hike on an uneven, rocky path",
          "To live simply without normal comforts or modern amenities",
          "To cancel a trip due to bad weather",
          "To get lost in the woods",
        ],
        correctIndex: 1,
        explanation:
          "'Rough it' means to live or stay somewhere with basic conditions and without modern comforts.",
        explanationArabic:
          "يعني مصطلح 'rough it' العيش أو الإقامة في ظروف بسيطة دون وسائل الراحة الحديثة.",
      },
    ],
  },
  "camping-site-1": {
    groupId: "camping-site-1",
    groupName: "The Camping Site 1",
    themeTitle: "Campsite Living & Etiquette",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Checking In at the Campsite",
        titleArabic: "حوار قصير: تسجيل الوصول في موقع التخييم",
        text: "Warden: Good afternoon! Do you have a booking?\nFather: Yes, under the name Hussain. Two nights, Friday and Saturday.\nWarden: Perfect. You're on pitch 14, right next to the meadow and close to the shower block. Here is your map and campsite guide.\nFather: Thank you! Are campfires allowed on the pitch?\nWarden: Yes, but only in the designated fire pits. Please make sure the fire is completely extinguished before sleeping. Also, quiet hours start at 10 PM.\nFather: Excellent. We'll make sure to leave no trace!",
        textArabic:
          "المشرف: طاب مساؤكم! هل لديكم حجز؟\nالأب: نعم، باسم حسين. ليلتان، الجمعة والسبت.\nالمشرف: ممتاز. أنتم في الموضع رقم 14، بجوار المرج مباشرة وقريب من مبنى الاستحمام. إليكم الخريطة ودليل موقع التخييم.\nالأب: شكراً لك! هل يُسمح بإشعال نيران المخيم في الموضع؟\nالمشرف: نعم، ولكن فقط في مواقد النار المخصصة. يرجى التأكد من إطفاء النار تماماً قبل النوم. أيضاً، تبدأ ساعات الهدوء في الساعة العاشرة مساءً.\nالأب: رائع. سنحرص على عدم ترك أي أثر!",
      },
      {
        partNumber: 2,
        title: "Common Mistakes & Collocations",
        titleArabic: "الأخطاء الشائعة والمتلازمات اللفظية",
        text: "- 'We put up / pitched our tent.' (Not 'We built a tent' or 'We opened a tent'.)\n- 'We lit a campfire.' (Not 'We opened a fire' or 'We burned a fire'.)\n- 'We took down the tent.' (Not 'We closed the tent' or 'We broke the tent'.)\n- 'We went camping for the weekend.' (Not 'We did camping'.)\n- 'We packed up our gear.' (Remember that 'gear' and 'equipment' are uncountable; do not say 'gears' or 'equipments'.)\n- 'We set off early.' ('Set off' means to begin a journey.)",
        textArabic:
          "- 'We put up / pitched our tent.' (وليس 'We built a tent' أو 'We opened a tent'.)\n- 'We lit a campfire.' (وليس 'We opened a fire' أو 'We burned a fire'.)\n- 'We took down the tent.' (وليس 'We closed the tent' أو 'We broke the tent'.)\n- 'We went camping for the weekend.' (وليس 'We did camping'.)\n- 'We packed up our gear.' (تذكر أن 'gear' و 'equipment' أسماء غير معدودة؛ لا تقل 'gears' أو 'equipments'.)\n- 'We set off early.' ('Set off' تعني بدء الرحلة والانطلاق.)",
      },
      {
        partNumber: 3,
        title: "Cultural & Countryside Notes",
        titleArabic: "ملاحظات ثقافية وقواعد الريف",
        text: "British vs American Camping Terms:\n- British: 'pitch' (tent site), 'torch' (portable light), 'caravan' (towed camper), 'washing-up area'\n- American: 'campsite', 'flashlight', 'RV / trailer', 'dishwashing station'\n\nOutdoor Etiquette:\n- 'Leave No Trace': Always carry out all rubbish and protect wildlife habitats.\n- 'Quiet Hours': Campers respect quiet hours (usually 10 PM – 7 AM) so everyone enjoys peaceful rest.\n- A 'happy camper' is an idiom describing anyone satisfied and cheerful with their current situation.",
        textArabic:
          "المصطلحات البريطانية مقابل الأمريكية للتخييم:\n- بريطاني: 'pitch' (موضع الخيمة)، 'torch' (مصباح يدوي)، 'caravan' (مقطورة سكنية)، 'washing-up area' (مكان غسل الأطباق)\n- أمريكي: 'campsite'، 'flashlight'، 'RV / trailer'، 'dishwashing station'\n\nآداب الأنشطة الخارجية:\n- 'لا تترك أثراً' (Leave No Trace): احرص دائماً على أخذ كافة النفايات وحماية موائل الحياة البرية.\n- 'ساعات الهدوء': يلتزم المخيمون بساعات الهدوء (عادة من 10 مساءً حتى 7 صباحاً) ليستمتع الجميع بالراحة والسكينة.\n- 'Happy camper' هو مصطلح مجازي يصف أي شخص راضٍ ومبتهج بوضعه الحالي.",
      },
    ],
    quiz: [
      {
        id: "camping-site-1-q1",
        question: "Which verb phrase correctly describes setting up a tent in English?",
        options: ["Build a tent", "Pitch a tent", "Open a tent", "Mount a tent"],
        correctIndex: 1,
        explanation:
          "In English, the standard collocation for erecting a tent is 'pitch a tent' or 'put up a tent'.",
        explanationArabic:
          "في اللغة الإنجليزية، المتلازمة اللفظية القياسية لنصب الخيمة هي 'pitch a tent' أو 'put up a tent'.",
      },
      {
        id: "camping-site-1-q2",
        question:
          "What is the British English term for the designated spot where you pitch your tent?",
        options: ["Pitch", "Deck", "Cabin", "Terminal"],
        correctIndex: 0,
        explanation:
          "In British English, a 'pitch' is the designated ground space allocated for a tent or caravan.",
        explanationArabic:
          "في الإنجليزية البريطانية، تُسمى المساحة الأرضية المخصصة لنصب الخيمة أو إيقاف المقطورة بـ 'pitch'.",
      },
      {
        id: "camping-site-1-q3",
        question: "What is the essential meaning of the outdoor rule 'Leave no trace'?",
        options: [
          "Never leave your tent unattended",
          "Take away all rubbish and leave nature undisturbed",
          "Camp only in well-lit urban areas",
          "Do not hike on marked trails",
        ],
        correctIndex: 1,
        explanation:
          "'Leave no trace' means cleaning up all waste and leaving the natural environment exactly as you found it.",
        explanationArabic:
          "يعني مبدأ 'Leave no trace' جمع كافة المخلفات وترك البيئة الطبيعية تماماً كما وجدتها دون أي مساس بها.",
      },
    ],
  },
  "construction-site": {
    groupId: "construction-site",
    groupName: "The Construction Site",
    themeTitle: "Building a New School",
    passages: [
      {
        partNumber: 1,
        title: "Building a New School - Part 1: Groundwork & Foundations",
        titleArabic: "بناء مدرسة جديدة - الجزء الأول: الأعمال التمهيدية والأساسات",
        text: "A new primary school is being built on our street. The construction site has been busy for several months, and I often watch the workers from my bedroom window. Before building started, the construction company put up a tall fence around the site with warning signs that said 'Danger — Construction Site — Keep Out' and 'Hard Hats Must Be Worn'. Inside the fence, bulldozers cleared the land and excavators dug deep trenches for the foundations. The foundations are the most important part of any building. Workers poured concrete into the trenches and let it set for several days. Once the foundations were solid, they started building the walls using bricks and cement.",
        textArabic:
          "يتم بناء مدرسة ابتدائية جديدة في شارعنا. لقد كان موقع البناء نشطًا لعدة أشهر، وغالبًا ما أشاهد العمال من نافذة غرفة نومي. وقبل بدء البناء، وضعت شركة المقاولات سياجًا عاليًا حول الموقع به لافتات تحذيرية تقول 'خطر — موقع بناء — ممنوع الدخول' و'يجب ارتداء الخوذات الواقية'. وداخل السياج، قامت الجرافات بتمهيد الأرض وحفرت الحفارات خنادق عميقة للأساسات. وتعتبر الأساسات أهم جزء في أي مبنى. حيث صب العمال الخرسانة في الخنادق وتركوها لتجف وتتصلب لعدة أيام. وبمجرد أن أصبحت الأساسات صلبة، بدأوا في بناء الجدران باستخدام الطوب والأسمنت.",
      },
      {
        partNumber: 2,
        title: "Building a New School - Part 2: Machinery & Trades",
        titleArabic: "بناء مدرسة جديدة - الجزء الثاني: الآلات والحرف المختلفة",
        text: "A large crane stands in the middle of the site. It lifts heavy steel beams and pallets of bricks to the upper floors. The crane operator sits in a small cabin at the very top — it must be an amazing view! The workers wear personal protective equipment: hard hats, high-visibility jackets, steel-toed boots, and sometimes ear protection because of the loud machinery. Safety is very important on a construction site. I noticed that different workers do different jobs. Bricklayers build the walls, electricians install the wiring, plumbers fit the pipes and water systems, and carpenters work with wood for the doors and window frames. The project manager told my father that the school should be finished by next September. It is fascinating to watch something being built from nothing.",
        textArabic:
          "تقف رافعة ضخمة في وسط الموقع. ترفع عوارض فولاذية ثقيلة ومنصات نقالة من الطوب إلى الطوابق العليا. يجلس مشغل الرافعة في كابينة صغيرة في القمة تمامًا — لا بد أن المنظر من هناك مذهل! يرتدي العمال معدات الوقاية الشخصية: خوذات صلبة، وسترات عالية الوضوح، وأحذية بأصابع فولاذية، وأحيانًا واقيات للأذن بسبب ضوضاء الآلات العالية. السلامة مهمة للغاية في موقع البناء. لاحظت أن العمال يؤدون مهام مختلفة. فعمال البناء يبنون الجدران، وفنيو الكهرباء يركبون الأسلاك، والسباكون يركبون الأنابيب وأنظمة المياه، والنجارون يعملون بالخشب للأبواب وإطارات النوافذ. وأخبر مدير المشروع والدي أنه من المتوقع الانتهاء من المدرسة بحلول سبتمبر القادم. إنه لأمر رائع حقًا أن تشاهد بناء شيء من لا شيء.",
      },
      {
        partNumber: 3,
        title: "Key Idioms & Phrasal Verbs of Construction",
        titleArabic: "أهم المصطلحات والأفعال المركبة الخاصة بالبناء",
        text: "Construction provides many rich idiomatic expressions in English:\n- 'build from the ground up': create something from nothing (e.g., 'They built the company from the ground up.')\n- 'lay the foundations': establish the basis for future success (e.g., 'Good study habits lay the foundations for academic success.')\n- 'hit the nail on the head': say or do exactly the right thing (e.g., 'You hit the nail on the head with that explanation.')\n- 'a hard hat area': a place where safety precautions are required.\n- 'under construction': currently being built or repaired.\n- 'on solid ground': in a secure and stable situation.",
        textArabic:
          "يوفر عالم البناء العديد من التعبيرات الاصطلاحية الغنية في اللغة الإنجليزية:\n- 'build from the ground up': ينشئ أو يبني شيئًا من نقطة الصفر (مثال: 'قاموا ببناء الشركة من نقطة الصفر.')\n- 'lay the foundations': يضع الأساس لشيء ما أو للنجاح المستقبلي (مثال: 'عادات الدراسة الجيدة تضع الأساس للنجاح الأكاديمي.')\n- 'hit the nail on the head': يصيب كبد الحقيقة أو يفعل الشيء الصحيح بدقة (مثال: 'لقد أصبت عين الصواب بهذا التفسير.')\n- 'a hard hat area': منطقة يلزم فيها ارتداء الخوذة الواقية واتخاذ احتياطات السلامة.\n- 'under construction': قيد الإنشاء أو تحت الترميم.\n- 'on solid ground': في موقف آمن ومستقر وقائم على أرضية صلبة.",
      },
    ],
    quiz: [
      {
        id: "construction-site-q1",
        question: "What safety signs were displayed around the construction site fence?",
        options: [
          "'Danger — Construction Site — Keep Out' and 'Hard Hats Must Be Worn'",
          "'Authorized Parking Only'",
          "'Speed Limit 20 mph'",
          "'Quiet Zone — Hospital Nearby'",
        ],
        correctIndex: 0,
        explanation:
          "The warning signs on the tall fence said 'Danger — Construction Site — Keep Out' and 'Hard Hats Must Be Worn'.",
        explanationArabic:
          "نصت اللافتات التحذيرية على السياج العالي على 'خطر — موقع بناء — ممنوع الدخول' و'يجب ارتداء الخوذات الواقية'.",
      },
      {
        id: "construction-site-q2",
        question:
          "Why are concrete foundations poured into trenches before wall construction begins?",
        options: [
          "To ensure the building has a solid, stable base before raising brick walls",
          "To collect rainwater for the machinery",
          "To create an underground garden",
          "To dispose of excess cement quickly",
        ],
        correctIndex: 0,
        explanation:
          "Foundations are the most critical part of any building; concrete is poured and allowed to solidify so the walls stand firmly.",
        explanationArabic:
          "تعتبر الأساسات الجزء الأهم في أي مبنى؛ حيث تُصب الخرسانة لتتصلب حتى تقف الجدران بثبات وأمان.",
      },
      {
        id: "construction-site-q3",
        question: "What does the idiom 'build from the ground up' mean?",
        options: [
          "To create or establish something entirely from the beginning",
          "To demolish an old building with a bulldozer",
          "To dig underground tunnels",
          "To paint the roof of a house",
        ],
        correctIndex: 0,
        explanation:
          "'Build from the ground up' means to create or develop something completely from scratch or nothing.",
        explanationArabic:
          "يعني التعبير الاصطلاحي 'build from the ground up' إنشاء أو بناء شيء بالكامل من البداية أو نقطة الصفر.",
      },
    ],
  },
  "construction-site-1": {
    groupId: "construction-site-1",
    groupName: "The Construction Site 1",
    themeTitle: "Site Dialogue, Common Errors & Industry Culture",
    passages: [
      {
        partNumber: 1,
        title: "On-Site Tour Dialogue",
        titleArabic: "حوار: جولة في موقع العمل",
        text: "Site Manager: 'Welcome to the site! Before we step past the barriers, you will need a hard hat and a high-vis jacket.'\nVisitor: 'Thank you. How long has this school project been underway?'\nSite Manager: 'We started six months ago. Laying the foundations took about eight weeks. We have completed the ground floor walls, and the bricklayers are currently working on the first floor.'\nVisitor: 'What is that large machine over there?'\nSite Manager: 'That is the excavator. We used it to dig trenches for the drainage pipes. And our tower crane lifts heavy steel beams up to five tonnes to the upper floors. Once structural work wraps up, electricians and plumbers will complete the interior.'",
        textArabic:
          "مدير الموقع: 'مرحبًا بك في الموقع! قبل أن نتخطى الحواجز، ستحتاج إلى خوذة واقية وسترة عالية الوضوح.'\nالزائر: 'شكرًا لك. منذ متى بدأ هذا المشروع المدرسي؟'\nمدير الموقع: 'بدأنا منذ ستة أشهر. استغرق وضع الأساسات حوالي ثمانية أسابيع. لقد انتهينا من جدران الطابق الأرضي، ويعمل عمال البناء حاليًا في الطابق الأول.'\nالزائر: 'ما تلك الآلة الكبيرة هناك؟'\nمدير الموقع: 'تلك هي الحفارة. استخدمناها لحفر الخنادق لأنابيب الصرف. ورافعتنا البرجية ترفع العوارض الفولاذية الثقيلة التي يصل وزنها إلى خمسة أطنان إلى الطوابق العليا. وبمجرد انتهاء الأعمال الإنشائية، سيكمل فنيو الكهرباء والسباكون الأعمال الداخلية.'",
      },
      {
        partNumber: 2,
        title: "Common Mistakes & Usage Guide",
        titleArabic: "الأخطاء الشائعة ودليل الاستخدام اللغوي",
        text: "Pay attention to these common pitfalls in construction vocabulary:\n- Say 'under construction' (NOT 'in construction'). Similarly, say 'under repair' or 'under renovation'.\n- Say 'He works as a bricklayer' when referring to a profession (use 'as', not 'like'). 'Like' is only for comparisons: 'He works like a machine.'\n- Say 'The crane is very tall' (cranes and buildings are 'tall', not 'high'). For fear of high places, say 'afraid of heights' (noun).\n- The verb 'build' is irregular: build → built → built (never 'builded').\n- The noun 'equipment' is uncountable: say 'a lot of equipment' or 'pieces of equipment' (never 'equipments').",
        textArabic:
          "انتبه لهذه الأخطاء الشائعة عند استخدام مفردات البناء:\n- قل 'under construction' (وليس 'in construction') للتعبير عن أن المبنى قيد الإنشاء. وبالمثل: 'under repair' (تحت الإصلاح) أو 'under renovation' (تحت الترميم).\n- قل 'He works as a bricklayer' عند الحديث عن مهنة شخص ما (استخدم 'as' وليس 'like'). تُستخدم 'like' للتشبيه فقط: 'يعمل مثل الآلة'.\n- قل 'The crane is very tall' (تُوصف الرافعات والمباني بـ 'tall' وليس 'high'). وللخوف من الأماكن المرتفعة قل 'afraid of heights' (اسم).\n- الفعل 'build' شاذ: تصريفاته هي build → built → built (ولا توجد كلمة 'builded').\n- كلمة 'equipment' اسم غير معدود: قل 'a lot of equipment' أو 'pieces of equipment' (ولا تجمعها بإضافة s كـ 'equipments').",
      },
      {
        partNumber: 3,
        title: "Construction Culture, Safety & Apprenticeships",
        titleArabic: "ثقافة البناء والسلامة المهنية وبرامج التدريب",
        text: "In the UK, construction sites are strictly regulated by the Health and Safety Executive (HSE). Every high-risk activity requires a formal 'risk assessment'. Skilled trades like plumbing, electrical work, and masonry are highly respected career paths entered through paid apprenticeships combining college study with hands-on site work. Before any major project begins, builders must secure 'planning permission' from the local council. On daily breaks, workers traditionally enjoy 'builder's tea' — a strong, sweet black tea with milk that has become a beloved cultural staple across Britain.",
        textArabic:
          "في المملكة المتحدة، تخضع مواقع البناء لرقابة صارمة من قبل هيئة الصحة والسلامة (HSE). يتطلب كل نشاط عالي المخاطر 'تقييمًا رسميًا للمخاطر'. وتعتبر المهن الحرفية الماهرة مثل السباكة والأعمال الكهربائية والبناء مسارات مهنية مرموقة يُلتحق بها عبر برامج تدريب مهني مدفوعة الأجر تجمع بين الدراسة الجامعية والعمل الميداني. وقبل بدء أي مشروع كبير، يجب على البنائين الحصول على 'تصريح تخطيط/بناء' من المجلس المحلي. وأثناء فترات الاستراحة اليومية، يستمتع العمال عادة بـ 'شاي البنائين' (builder's tea) — وهو شاي أسود قوي ومحلى بالحليب أصبح رمزًا ثقافيًا محبوبًا في جميع أنحاء بريطانيا.",
      },
    ],
    quiz: [
      {
        id: "construction-site-1-q1",
        question: "Which phrase is grammatically correct when describing a building in progress?",
        options: [
          "The school is under construction.",
          "The school is in construction.",
          "The school is on construction.",
          "The school is at construction.",
        ],
        correctIndex: 0,
        explanation:
          "The correct idiomatic prepositional phrase is 'under construction' (like 'under repair' and 'under renovation').",
        explanationArabic:
          "العبارة الاصطلاحية الصحيحة نحويًا هي 'under construction' (مثل 'under repair' و'under renovation').",
      },
      {
        id: "construction-site-1-q2",
        question: "How is the noun 'equipment' correctly used in English?",
        options: [
          "It is uncountable and does not take a plural 's' (e.g. 'a lot of equipment')",
          "It is always plural and must end with 's'",
          "It is only used with numbers like 'five equipments'",
          "It can only be used as a verb",
        ],
        correctIndex: 0,
        explanation:
          "'Equipment' is an uncountable noun. To count items, say 'pieces of equipment' or 'items of equipment'.",
        explanationArabic:
          "كلمة 'equipment' اسم غير معدود ولا تُجمع بإضافة s. ولعد الأدوات نقول 'pieces of equipment'.",
      },
      {
        id: "construction-site-1-q3",
        question: "What is 'builder's tea' in British cultural tradition?",
        options: [
          "A strong, hearty cup of black tea served with milk and sugar",
          "A herbal green tea with lemon",
          "An iced fruit punch served in summer",
          "A specialized cleaning fluid for masonry",
        ],
        correctIndex: 0,
        explanation:
          "'Builder's tea' is a strong cup of tea with milk and sugar, traditionally associated with British tradespeople.",
        explanationArabic:
          "'builder's tea' هو شاي أسود قوي ومُعد مع الحليب والسكر، ويرتبط تقليديًا بالعمال والحرفيين في بريطانيا.",
      },
    ],
  },
  "first-aid-room": {
    groupId: "first-aid-room",
    groupName: "The First Aid Room",
    themeTitle: "Inside the First Aid Room",
    passages: [
      {
        partNumber: 1,
        title: "Inside the First Aid Room - Part 1",
        titleArabic: "داخل غرفة الإسعافات الأولية - الجزء الأول",
        text: "The first aid room is one of the most important places in any school or workplace. Inside, you will find a well-stocked first aid kit containing essential supplies like bandages, gauze, and adhesive tape. Antiseptic wipes and antibiotic ointment help prevent infections when treating cuts and bruises.\n\nIf someone suffers a sprain or fracture, the room has splints, elastic bandages, and a sling to immobilize the injury. For more serious situations, there is a stretcher and even a defibrillator mounted on the wall near the CPR poster.",
        textArabic:
          "تعد غرفة الإسعافات الأولية واحدة من أهم الأماكن في أي مدرسة أو مكان عمل. بالداخل، ستجد حقيبة إسعافات أولية مجهزة جيدًا تحتوي على مستلزمات أساسية مثل الضمادات والشاش والشريط اللاصق. تساعد المناديل المطهرة والمراهم المضادة للحيويات في منع العدوى عند علاج الجروح والكدمات.\n\nإذا تعرض شخص ما لالتواء أو كسر، فإن الغرفة تحتوي على جبائر وضمادات مرنة ومعلاق لشل حركة الإصابة. وفي الحالات الأكثر خطورة، توجد نقالة وحتى جهاز مزيل الرجفان مثبت على الحائط بالقرب من ملصق الإنعاش القلبي الرئوي.",
      },
      {
        partNumber: 2,
        title: "Inside the First Aid Room - Part 2",
        titleArabic: "داخل غرفة الإسعافات الأولية - الجزء الثاني",
        text: "The trained first aid officer knows how to check a pulse, apply pressure to stop bleeding, and elevate an injured limb. In case of choking or an allergic reaction, an EpiPen is available in the medicine cabinet. The emergency contact card on the wall lists important phone numbers, and the incident report form must be completed after every treatment.\n\nWhether it is a small blister or a bee sting, or something more serious like a concussion or heat stroke, knowing where to find the right equipment can make all the difference.",
        textArabic:
          "يعرف مسؤول الإسعافات الأولية المدرب كيفية فحص النبض، والضغط لوقف النزيف، ورفع الطرف المصاب. وفي حال التعرض للاختناق أو رد فعل تحسسي، يتوفر قلم إبينفرين (EpiPen) في خزانة الأدوية. توضح بطاقة جهات الاتصال في حالات الطوارئ على الحائط أرقام الهواتف المهمة، ويجب تعبئة نموذج تقرير الحادث بعد كل علاج.\n\nسواء كانت نفطة صغيرة أو لسعة نحلة، أو شيئًا أكثر خطورة مثل ارتجاج في المخ أو ضربة شمس، فإن معرفة مكان العثور على المعدات المناسبة يمكن أن يحدث فرقًا كبيرًا.",
      },
      {
        partNumber: 3,
        title: "First Aid Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة للإسعافات الأولية",
        text: "Here are key phrases and idioms used in first aid:\n- 'patch someone up': to give basic medical treatment (e.g., 'The nurse patched him up after the fall.')\n- 'under the weather': feeling ill or unwell.\n- 'on the mend': getting better after illness or injury.\n- 'come around' / 'come to': to regain consciousness after fainting.\n- 'break out in': to suddenly develop a rash or skin condition.\n- 'dress a wound': to clean and cover an injury.\n- 'a clean bill of health': confirmation that someone is healthy.",
        textArabic:
          "إليك العبارات والمصطلحات الرئيسية المستخدمة في الإسعافات الأولية:\n- 'patch someone up': يقدم علاجًا طبيًا أوليًا (مثل: 'عالجته الممرضة وضمدت جراحه بعد السقوط.')\n- 'under the weather': يشعر بالمرض أو التوعك.\n- 'on the mend': يتماثل للشفاء بعد مرض أو إصابة.\n- 'come around' / 'come to': يستعيد الوعي بعد الإغماء.\n- 'break out in': يصاب فجأة بطفح جلدي.\n- 'dress a wound': ينظف الجرح ويغطيه.\n- 'a clean bill of health': تأكيد أو شهادة على تمتع الشخص بصحة جيدة.",
      },
    ],
    quiz: [
      {
        id: "first-aid-room-q1",
        question: "What supplies are used to prevent infection when treating cuts and bruises?",
        options: [
          "Splints and slings",
          "Antiseptic wipes and antibiotic ointment",
          "A stretcher and defibrillator",
          "An EpiPen and CPR poster",
        ],
        correctIndex: 1,
        explanation:
          "The text states that antiseptic wipes and antibiotic ointment help prevent infections when treating cuts and bruises.",
        explanationArabic:
          "ينص النص على أن المناديل المطهرة والمراهم المضادة للحيويات تساعد في منع العدوى عند علاج الجروح والكدمات.",
      },
      {
        id: "first-aid-room-q2",
        question: "What document must be completed after treating someone in the first aid room?",
        options: [
          "An incident report form",
          "An emergency contact card",
          "A CPR guide sheet",
          "A hospital admission pass",
        ],
        correctIndex: 0,
        explanation:
          "The text mentions that the incident report form must be completed after every treatment.",
        explanationArabic: "يذكر النص أنه يجب تعبئة نموذج تقرير الحادث بعد كل علاج.",
      },
      {
        id: "first-aid-room-q3",
        question: "What does the idiom 'on the mend' mean?",
        options: [
          "Feeling ill or unwell",
          "Regaining consciousness after fainting",
          "Getting better after an illness or injury",
          "Developing a sudden skin condition",
        ],
        correctIndex: 2,
        explanation:
          "'On the mend' means recovering and getting better after an illness or injury.",
        explanationArabic: "يعني مصطلح 'on the mend' التماثل للشفاء والتحسن بعد مرض أو إصابة.",
      },
    ],
  },
  "first-aid-room-1": {
    groupId: "first-aid-room-1",
    groupName: "First Aid Procedures",
    themeTitle: "Treatments and First Aid Scenarios",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: In the First Aid Room",
        titleArabic: "حوار قصير: في غرفة الإسعافات الأولية",
        text: "Officer: Hello Sarah, please take a seat. What happened to your arm?\nSarah: I tripped during gym class and grazed my elbow, and my wrist hurts when I move it.\nOfficer: Let's examine it. First, I'll use an antiseptic wipe to clean the graze and dress the wound with a sterile plaster. Then I'll check your wrist for swelling.\nSarah: Do you think it's broken or just a sprain?\nOfficer: It looks like a mild sprain. I will apply an elastic bandage to support it and give you an ice pack to reduce the swelling. I'll also fill out an incident report form for your teacher.",
        textArabic:
          "المسؤول: مرحبًا سارة، تفضلي بالجلوس. ماذا حدث لذراعك؟\nسارة: تعثرت أثناء حصة الرياضة وخُدش كوعي، ومعصمي يؤلمني عندما أحركه.\nالمسؤول: دعيني أفحصه. أولاً، سأستخدم منديلًا مطهرًا لتنظيف الخدش وتضميد الجرح بضمادة لاصقة معقمة. ثم سأفحص معصمك للتحقق من وجود أي تورم.\nسارة: هل تعتقد أنه مكسور أم مجرد التواء؟\nالمسؤول: يبدو وكأنه التواء خفيف. سأضع ضمادة مرنة لدعمه وأعطيك كيس ثلج لتخفيف التورم. سأقوم أيضًا بملء نموذج تقرير الحادث لمعلمك.",
      },
      {
        partNumber: 2,
        title: "Treating Different Types of Injuries",
        titleArabic: "علاج أنواع مختلفة من الإصابات",
        text: "Different injuries require specific treatments in first aid:\n- Cuts and Bleeding: Apply firm pressure to stop bleeding, clean with antiseptic wipes, apply antibiotic ointment, and cover with a bandage or adhesive tape.\n- Burns: Cool immediately under cold running water for at least 10 minutes, apply burn gel, and do not bandage tightly.\n- Sprains and Fractures: Immobilize the injured area using splints, elastic bandages, or a sling, and elevate the limb to reduce swelling.\n- Severe Emergencies: Use an EpiPen immediately for severe allergic reactions, and follow the CPR poster and defibrillator instructions for cardiac emergencies.",
        textArabic:
          "تتطلب الإصابات المختلفة علاجات محددة في الإسعافات الأولية:\n- الجروح والنزيف: اضغط بقوة لوقف النزيف، ونظف بالمناديل المطهرة، وضع مرهمًا مضادًا للحيويات، وغطّه بضمادة أو شريط لاصق.\n- الحروق: قم بتبريد الحرق فورًا تحت الماء الجاري البارد لمدة 10 دقائق على الأقل، وضع جل الحروق، ولا تلف الضمادة بإحكام.\n- الالتواءات والكسور: ثبّت المنطقة المصابة باستخدام الجبائر أو الضمادات المرنة أو المعلاق، وارفع الطرف لتقليل التورم.\n- حالات الطوارئ الشديدة: استخدم قلم الإبينفرين فورًا في حالات الحساسية المفرطة، واتبع إرشادات ملصق الإنعاش وجهاز مزيل الرجفان في حالات توقف القلب.",
      },
      {
        partNumber: 3,
        title: "First Aid Best Practices & Common Mistakes",
        titleArabic: "أفضل ممارسات الإسعافات الأولية والأخطاء الشائعة",
        text: "Essential first aid rules to remember:\n- Never put ice directly on a burn; always use cool running water.\n- Do not remove embedded objects from deep wounds yourself; support them and call emergency services.\n- Use the correct collocation: 'dress a wound' (clean and cover an injury), not 'dress a sickness'.\n- The phrase 'first aid' is uncountable: 'First aid was administered promptly.'\n- Always complete an incident report form after treating any patient to record what happened and the treatment given.",
        textArabic:
          "قواعد أساسية في الإسعافات الأولية يجب تذكرها:\n- لا تضع الثلج مباشرة على الحرق؛ استخدم دائمًا الماء الجاري البارد.\n- لا تنزع الأجسام المغروسة من الجروح العميقة بنفسك؛ ثبّتها واطلب خدمات الطوارئ.\n- استخدم التعبير الصحيح: 'dress a wound' (تنظيف وتغطية الجرح)، وليس 'dress a sickness'.\n- مصطلح 'first aid' غير معدود ويعامل معاملة المفرد: 'First aid was administered promptly.'\n- املأ دائمًا نموذج تقرير الحادث بعد علاج أي مصاب لتوثيق ما حدث والعلاج المقدم.",
      },
    ],
    quiz: [
      {
        id: "first-aid-room-1-q1",
        question: "What is the recommended first step when treating a burn?",
        options: [
          "Apply ice directly to the burn",
          "Cool it under cold running water for at least 10 minutes",
          "Wrap it tightly with adhesive tape",
          "Break any blisters immediately",
        ],
        correctIndex: 1,
        explanation:
          "Burns should be cooled under cold running water for at least 10 minutes to reduce heat and tissue damage.",
        explanationArabic:
          "يجب تبريد الحروق تحت الماء الجاري البارد لمدة 10 دقائق على الأقل لتقليل الحرارة وتلف الأنسجة.",
      },
      {
        id: "first-aid-room-1-q2",
        question: "In the dialogue, how did the officer treat Sarah's sprained wrist?",
        options: [
          "By applying an elastic bandage and an ice pack",
          "By using a defibrillator",
          "By putting her arm in a full plaster cast",
          "By giving her an EpiPen injection",
        ],
        correctIndex: 0,
        explanation:
          "The officer used an elastic bandage to support the wrist and provided an ice pack to minimize swelling.",
        explanationArabic: "استخدم المسؤول ضمادة مرنة لدعم المعصم وقدم كيس ثلج لتقليل التورم.",
      },
      {
        id: "first-aid-room-1-q3",
        question: "When should an EpiPen be administered?",
        options: [
          "For minor cuts and scrapes",
          "For severe allergic reactions",
          "For mild headaches",
          "For simple sprains and bruises",
        ],
        correctIndex: 1,
        explanation:
          "An EpiPen is an auto-injector specifically used in emergencies for severe allergic reactions (anaphylaxis).",
        explanationArabic:
          "قلم الإبينفرين (EpiPen) هو حقنة تلقائية تُستخدم خصيصًا في حالات الطوارئ لردود الفعل التحسسية الشديدة (التأق).",
      },
    ],
  },
  "pet-shop": {
    groupId: "pet-shop",
    groupName: "The Pet Shop",
    themeTitle: "Choosing a Pet",
    passages: [
      {
        partNumber: 1,
        title: "Choosing a Pet - Part 1",
        titleArabic: "اختيار حيوان أليف - الجزء الأول",
        text: "Last weekend, my family visited the pet shop in the shopping centre to choose a pet for my younger brother's birthday. It was his first pet, so we wanted something easy to care for. The shop was full of animals. Near the entrance, there were glass tanks with goldfish, tropical fish, and a small turtle. The fish came in all colours — red, orange, blue, and striped. The shop assistant explained how to set up an aquarium with a filter, a heater, and some gravel at the bottom. Further inside, there were cages with hamsters, guinea pigs, and rabbits. The hamsters were running on tiny wheels, and the guinea pigs were munching on hay. My brother liked the rabbits best — they were soft and calm.",
        textArabic:
          "في عطلة نهاية الأسبوع الماضي، زارت عائلتي متجر الحيوانات الأليفة في المركز التجاري لاختيار حيوان أليف بمناسبة عيد ميلاد أخي الأصغر. كان هذا أول حيوان أليف له، لذلك أردنا شيئًا يسهل الاعتناء به. كان المتجر مليئًا بالحيوانات. بالقرب من المدخل، كانت هناك أحواض زجاجية بها أسماك ذهبية، وأسماك استوائية، وسلحفاة صغيرة. كانت الأسماك بجميع الألوان — الأحمر والبرتقالي والأزرق والمخطط. شرح لنا البائع كيفية إعداد حوض أسماك مزود بفلتر وسخان وبعض الحصى في القاع. وفي الداخل أكثر، كانت هناك أقفاص بها فئران هامستر، وخنازير غينيا، وأرانب. كانت الهامسترات تجري على عجلات صغيرة، وكانت خنازير غينيا تمضغ القش. نالت الأرانب إعجاب أخي أكثر من غيرها — فقد كانت ناعمة وهادئة.",
      },
      {
        partNumber: 2,
        title: "Choosing a Pet - Part 2",
        titleArabic: "اختيار حيوان أليف - الجزء الثاني",
        text: "In the bird section, there were parakeets, canaries, and a large parrot that could say a few words. The parrot kept saying 'Hello!' every time someone walked past. The back of the shop had supplies: bags of pet food, bowls, leads, collars, toys, and grooming brushes. There were also beds, carriers, and scratching posts for cats. A noticeboard near the door advertised local dog-walking services and pet adoption events. In the end, my brother chose a pair of guinea pigs. The shop assistant gave us a care guide and explained what food they need, how often to clean the cage, and how to handle them gently. Having a pet teaches responsibility and patience — and it brings a lot of joy to the whole family.",
        textArabic:
          "في قسم الطيور، كانت هناك طيور البادجي، والكناري، وببغاء كبير يمكنه نطق بعض الكلمات. استمر الببغاء في قول 'مرحبًا!' في كل مرة يمر فيها شخص ما. واحتوى الجزء الخلفي من المتجر على المستلزمات: أكياس طعام الحيوانات الأليفة، والأوعية، والمقاود، والأطواق، والألعاب، وفرش التزيين والعناية. كانت هناك أيضًا أسرّة، وحقائب نقل، وأعمدة خدش للقطط. وأعلنت لوحة إعلانات بالقرب من الباب عن خدمات تمشية الكلاب المحلية وفعاليات تبني الحيوانات الأليفة. في النهاية، اختار أخي زوجًا من خنازير غينيا. أعطانا مساعد المتجر دليل رعاية وشرح لنا الطعام الذي تحتاجه، وكم مرة يجب تنظيف القفص، وكيفية التعامل معها بلطف. إن امتلاك حيوان أليف يعلم المسؤولية والصبر — ويجلب الكثير من البهجة لجميع أفراد الأسرة.",
      },
      {
        partNumber: 3,
        title: "Pet Shop Idioms & Phrasal Verbs",
        titleArabic: "مصطلحات وأفعال مركبة لمتجر الحيوانات الأليفة",
        text: "Here are key pet-related idioms and phrasal verbs:\n- 'look after' / 'take care of': be responsible for a pet or person.\n- 'pick out': choose from a group (e.g., 'My brother picked out two guinea pigs.').\n- 'clean out': empty and clean a cage thoroughly.\n- 'settle in': become comfortable in a new home.\n- 'let the cat out of the bag': reveal a secret accidentally.\n- 'a fish out of water': someone who feels uncomfortable in an unfamiliar situation.\n- 'pet peeve': something minor that annoys you a lot.\n- 'raining cats and dogs': raining very heavily.",
        textArabic:
          "إليك أهم المصطلحات والأفعال المركبة المتعلقة بالحيوانات الأليفة:\n- 'look after' / 'take care of': الاعتناء أو تحمل مسؤولية حيوان أليف أو شخص.\n- 'pick out': يختار أو ينتقي من مجموعة (مثل: 'اختار أخي اثنين من خنازير غينيا.').\n- 'clean out': يفرغ القفص وينظفه تمامًا.\n- 'settle in': يستقر ويشعر بالراحة في مكان جديد.\n- 'let the cat out of the bag': يفشي سرًا عن غير قصد.\n- 'a fish out of water': شخص يشعر بعدم الارتياح في موقف غير مألوف (كالسمكة خارج الماء).\n- 'pet peeve': أمر صغير يثير انزعاجك بشدة.\n- 'raining cats and dogs': تمطر بغزارة شديدة.",
      },
    ],
    quiz: [
      {
        id: "pet-shop-q1",
        question: "What animal did the writer's brother ultimately choose to take home?",
        options: [
          "A large talking parrot",
          "A pair of guinea pigs",
          "A golden retriever puppy",
          "A small turtle",
        ],
        correctIndex: 1,
        explanation:
          "In the story, the brother chose a pair of guinea pigs after looking around the shop.",
        explanationArabic: "في القصة، اختار الأخ زوجًا من خنازير غينيا بعد التجول في المتجر.",
      },
      {
        id: "pet-shop-q2",
        question: "What did the shop assistant explain regarding setting up an aquarium?",
        options: [
          "It only needs fresh tap water and bread crumbs",
          "It requires a filter, a heater, and gravel at the bottom",
          "It must be kept in direct sunlight all day",
          "It should never contain more than one single fish",
        ],
        correctIndex: 1,
        explanation:
          "The shop assistant explained how to set up an aquarium with a filter, a heater, and some gravel at the bottom.",
        explanationArabic:
          "شرح مساعد المتجر كيفية إعداد حوض أسماك مزود بفلتر وسخان وبعض الحصى في القاع.",
      },
      {
        id: "pet-shop-q3",
        question: "What does the idiom 'let the cat out of the bag' mean?",
        options: [
          "To buy a new kitten from the store",
          "To reveal a secret accidentally",
          "To let an animal escape from its cage",
          "To take a pet to the vet clinic",
        ],
        correctIndex: 1,
        explanation:
          "The idiom 'let the cat out of the bag' means to accidentally reveal a secret.",
        explanationArabic:
          "المصطلح 'let the cat out of the bag' يعني إفشاء سر أو كشفه عن طريق الخطأ.",
      },
    ],
  },
  "pet-shop-1": {
    groupId: "pet-shop-1",
    groupName: "The Pet Shop (Part 2)",
    themeTitle: "Pet Care & Advice",
    passages: [
      {
        partNumber: 1,
        title: "Mini Dialogue: Asking for Advice",
        titleArabic: "حوار قصير: طلب النصيحة",
        text: "Mum: We're looking for a pet for our son. Something easy to care for.\nAssistant: How old is your son? That helps me suggest the right animal.\nMum: He's eight. He wants a rabbit, but I'm not sure.\nAssistant: Rabbits are lovely, but they need daily cleaning and a large hutch.\nSon: What about a hamster? They're so cute!\nAssistant: Hamsters are great first pets. They're small and easy to feed.\nSon: Do they need a cage?\nAssistant: Yes, with a wheel, a water bottle, and some bedding. We have everything here.\nMum: How long do hamsters live?\nAssistant: About two to three years. Guinea pigs live longer — five to seven years.",
        textArabic:
          "الأم: نحن نبحث عن حيوان أليف لابننا. شيء يسهل الاعتناء به.\nالمساعد: كم عمر ابنك؟ هذا يساعدني في اقتراح الحيوان المناسب.\nالأم: يبلغ من العمر ثماني سنوات. يريد أرنبًا، لكني لست متأكدة.\nالمساعد: الأرانب لطيفة، لكنها تحتاج إلى تنظيف يومي وحظيرة كبيرة.\nالابن: ماذا عن الهامستر؟ إنها لطيفة للغاية!\nالمساعد: الهامسترات حيوانات أليفة أولى رائعة. إنها صغيرة ويسهل إطعامها.\nالابن: هل تحتاج إلى قفص؟\nالمساعد: نعم، مع عجلة وقارورة ماء وفرشة أرضية. لدينا كل شيء هنا.\nالأم: كم تعيش الهامسترات؟\nالمساعد: حوالي سنتين إلى ثلاث سنوات. بينما تعيش خنازير غينيا لفترة أطول — من خمس إلى سبع سنوات.",
      },
      {
        partNumber: 2,
        title: "Common Mistakes & Word Formation",
        titleArabic: "الأخطاء الشائعة وتكوين الكلمات",
        text: "Common Mistakes:\n- Say 'I have a fish as a pet' (do not forget the article 'a').\n- Use 'cute' or 'amusing' for small pets rather than 'funny' (unless they truly make you laugh).\n- Say 'She feeds the cat every day' (no preposition 'at' before 'every').\n- 'Mouse' has an irregular plural: 'mice' (not 'mouses').\n- The spelling is 'biting' (drop the 'e', add '-ing'), not 'bitting'.\n\nWord Formation:\n- feed (v) → feed / feeder (n) → fed (adj)\n- groom (v) → groomer / grooming (n) → groomed (adj)\n- adopt (v) → adopter / adoption (n) → adopted / adoptable (adj)\n- care (v) → carer / care (n) → caring / careful (adj)",
        textArabic:
          "أخطاء شائعة:\n- قل 'I have a fish as a pet' (لا تنس أداة التنكير 'a').\n- استخدم 'cute' أو 'amusing' للحيوانات الأليفة الصغيرة بدلاً من 'funny' (إلا إذا كانت تجعلك تضحك حقاً).\n- قل 'She feeds the cat every day' (بدون حرف الجر 'at' قبل 'every').\n- كلمة 'Mouse' جمعها شاذ: 'mice' (وليس 'mouses').\n- الإملاء الصحيح هو 'biting' (بحذف الـ 'e' وإضافة '-ing')، وليس 'bitting'.\n\nتكوين الكلمات:\n- feed (يطعم) ← feed / feeder (علف / مُطعم) ← fed (مُطعَم / ممتلئ)\n- groom (يهندم / ينظف) ← groomer / grooming (مُصفف / عناية) ← groomed (مُعتنى به)\n- adopt (يتبنى) ← adopter / adoption (متبنٍ / تبنٍ) ← adopted / adoptable (مُتبنى / قابل للتبني)\n- care (يعتني) ← carer / care (راعٍ / رعاية) ← caring / careful (حنون / حذر)",
      },
      {
        partNumber: 3,
        title: "Cultural & Usage Notes",
        titleArabic: "ملاحظات ثقافية ولغوية",
        text: "Cultural & Usage Notes:\n- 'Adopt, Don't Shop': In the UK and US, this popular campaign encourages adopting pets from rescue shelters rather than buying from breeders or pet stores.\n- British vs American English: British 'pet shop', 'lead', and 'tin of pet food' correspond to American 'pet store', 'leash', and 'can of pet food'. Both use 'vet' for veterinarian.\n- Popular Pets: Dogs and cats are the most popular companions in English-speaking countries. Hamsters, rabbits, and guinea pigs are common pets for children.\n- Microchipping: In the UK, all dogs and cats must be microchipped by law so owners can be traced if pets are lost.",
        textArabic:
          "ملاحظات ثقافية واستخدامات لغوية:\n- 'تبنَّ ولا تشترِ' (Adopt, Don't Shop): في المملكة المتحدة والولايات المتحدة، تشجع هذه الحملة الشهيرة على تبني الحيوانات الأليفة من ملاجئ الإنقاذ بدلاً من شرائها من المتاجر أو المربين.\n- الإنجليزية البريطانية مقابل الأمريكية: يقابل 'pet shop' و 'lead' و 'tin of pet food' البريطانية كلمات 'pet store' و 'leash' و 'can of pet food' الأمريكية. كلاهما يستخدم 'vet' لطبيب بيطري.\n- الحيوانات الأليفة الشائعة: الكلاب والقطط هي الأكثر شعبية في البلدان الناطقة بالإنجليزية، بينما تعد الهامسترات والأرانب وخنازير غينيا شائعة للأطفال.\n- الرقاقة الإلكترونية (Microchipping): في المملكة المتحدة، يلزم القانون زرع شريحة إلكترونية لجميع الكلاب والقطط لتسهيل العثور على أصحابها عند فقدانها.",
      },
    ],
    quiz: [
      {
        id: "pet-shop-1-q1",
        question:
          "According to the shop assistant in the dialogue, how long do guinea pigs typically live?",
        options: ["1 to 2 years", "2 to 3 years", "5 to 7 years", "10 to 15 years"],
        correctIndex: 2,
        explanation:
          "The assistant states: 'Hamsters live about two to three years. Guinea pigs live longer — five to seven years.'",
        explanationArabic:
          "يذكر المساعد: 'تعيش الهامسترات حوالي سنتين إلى ثلاث سنوات. بينما تعيش خنازير غينيا لفترة أطول — من خمس إلى سبع سنوات.'",
      },
      {
        id: "pet-shop-1-q2",
        question:
          "What is the American English equivalent for the British word 'lead' (for a dog)?",
        options: ["Harness", "Collar", "Leash", "Muzzle"],
        correctIndex: 2,
        explanation:
          "In British English people say 'lead', while in American English it is called a 'leash'.",
        explanationArabic:
          "في الإنجليزية البريطانية يقول الناس 'lead'، بينما تسمى في الإنجليزية الأمريكية 'leash'.",
      },
      {
        id: "pet-shop-1-q3",
        question: "Which of the following sentences is grammatically correct?",
        options: [
          "She feeds the cat at every day.",
          "I bought two mouses for my son.",
          "The dog is biting the chew toy.",
          "I have a fish as pet.",
        ],
        correctIndex: 2,
        explanation:
          "'The dog is biting the chew toy' is correct. 'Bite' drops the 'e' to become 'biting' with a single 't'.",
        explanationArabic:
          "'The dog is biting the chew toy' هي الجملة الصحيحة. الفعل 'bite' تحذف منه 'e' ليصبح 'biting' بحرف 't' واحد.",
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
  };
}
