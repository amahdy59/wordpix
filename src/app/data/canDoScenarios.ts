// Authentic Real-World CEFR Action-Oriented Can-Do Scenarios for WordPix

export interface CanDoTransferChallenge {
  id: string;
  topic: string;
  cefr: "A1" | "A2" | "B1" | "B2" | "C1";
  scenarioEn: string;
  scenarioAr: string;
  taskEn: string;
  taskAr: string;
  modelResponseEn: string;
  modelResponseAr: string;
  keyPhrases: readonly { en: string; ar: string }[];
}

export const CAN_DO_SCENARIOS: Record<string, CanDoTransferChallenge> = {
  restaurant: {
    id: "restaurant",
    topic: "Dining & Food",
    cefr: "A2",
    scenarioEn:
      "You are having dinner at a restaurant and need to ask about food allergies before ordering.",
    scenarioAr: "أنت تتناول العشاء في مطعم وتريد الاستفسار عن حساسية الطعام قبل تأكيد الطلب.",
    taskEn:
      "Ask the waiter politely if the house soup contains dairy or nuts, and request a fresh table setting.",
    taskAr:
      "اسأل النادل بأدب عما إذا كان الحساء يحتوي على مشتقات الحليب أو المكسرات، واطلب ترتيب أدوات مائدة نظيفة.",
    modelResponseEn:
      "Excuse me, does the house soup contain any dairy or nuts? I have a slight allergy.",
    modelResponseAr: "معذرة، هل يحتوي حساء اليوم على أي مشتقات ألبان أو مكسرات؟ لديّ حساسية خفيفة.",
    keyPhrases: [
      { en: "Does this contain...?", ar: "هل يحتوي هذا على...؟" },
      { en: "I have an allergy to...", ar: "لديّ حساسية من..." },
      { en: "Could I please have...?", ar: "هل يمكنني الحصول على... من فضلك؟" },
    ],
  },
  hotel: {
    id: "hotel",
    topic: "Hotel & Lodging",
    cefr: "A2",
    scenarioEn:
      "You just checked into your hotel room and notice there is no hot water in the shower.",
    scenarioAr: "سجلت وصولك للتو إلى غرفتك بالفندق ولاحظت عدم وجود ماء ساخن في الدش.",
    taskEn:
      "Call the front desk to report the issue politely and request extra blankets and pillows.",
    taskAr: "اتصل بمكتب الاستقبال للإبلاغ عن المشكلة بأدب واطلب بطانيات ووسائد إضافية.",
    modelResponseEn:
      "Hello, this is room 304. There is no hot water in the shower. Could maintenance please check it?",
    modelResponseAr:
      "مرحبًا، هذه الغرفة 304. لا يوجد ماء ساخن في الدش، هل يمكن لقسم الصيانة التحقق من ذلك من فضلكم؟",
    keyPhrases: [
      { en: "There is an issue with...", ar: "توجد مشكلة في..." },
      { en: "Could someone check...?", ar: "هل يمكن لأحد فحص...؟" },
      { en: "Could we have extra pillows?", ar: "هل يمكننا الحصول على وسائد إضافية؟" },
    ],
  },
  hospital: {
    id: "hospital",
    topic: "Healthcare & Clinic",
    cefr: "B1",
    scenarioEn:
      "You are describing your symptoms to a doctor during a scheduled morning consultation.",
    scenarioAr: "أنت تشرح أعراضك الصحية للطبيب خلال استشارة طبية صباحية.",
    taskEn:
      "Explain that you have had a dry cough, mild fever, and sore throat for three days, and ask for a prescription.",
    taskAr:
      "اشرح أنك تعاني من سعال جاف وحمى خفيفة والتهاب في الحلق منذ ثلاثة أيام، واطلب وصفة علاجية مناسبة.",
    modelResponseEn:
      "I have had a persistent dry cough and mild fever for three days. What medication do you recommend?",
    modelResponseAr:
      "أعاني من سعال جاف مستمر وحمى خفيفة منذ ثلاثة أيام. ما هو الدواء الذي توصي به؟",
    keyPhrases: [
      { en: "I have been experiencing...", ar: "أشعر منذ فترة بـ..." },
      { en: "How often should I take this?", ar: "كم مرة يجب أن أتناول هذا الدواء؟" },
      { en: "Are there any side effects?", ar: "هل توجد أي آثار جانبية؟" },
    ],
  },
  office: {
    id: "office",
    topic: "Workplace & Office",
    cefr: "B1",
    scenarioEn: "You need to update a colleague on a project deliverable before the team deadline.",
    scenarioAr: "تريد إحاطة زميل في العمل بمستجدات المشروع قبل الموعد النهائي للفريق.",
    taskEn:
      "Explain that the draft report is ready for review and ask if they can provide feedback by 3 PM.",
    taskAr:
      "وضّح أن مسودة التقرير جاهزة للمراجعة واسأله إن كان بإمكانه تزويدك بملاحظاته بحلول الساعة 3 عصرًا.",
    modelResponseEn:
      "The quarterly report draft is ready for review. Could you take a look and share feedback by 3 PM?",
    modelResponseAr:
      "مسودة التقرير الفصلي جاهزة للمراجعة. هل يمكنك إلقاء نظرة ومشاركتي ملاحظاتك بحلول الثالثة عصرًا؟",
    keyPhrases: [
      { en: "The draft is ready for review", ar: "المسودة جاهزة للمراجعة" },
      { en: "Could you share your thoughts?", ar: "هل يمكنك مشاركتي رأيك؟" },
      { en: "Let's reach a decision together", ar: "دعنا نتوصل إلى قرار معًا" },
    ],
  },
  airport: {
    id: "airport",
    topic: "Travel & Airport",
    cefr: "A2",
    scenarioEn: "Your flight gate has changed and you need to confirm where your boarding gate is.",
    scenarioAr: "تغيرت بوابة صعود رحلتك الجوية وتريد التأكد من موقع البوابة الجديدة في المطار.",
    taskEn:
      "Ask an airport agent at the information desk to verify your boarding pass and gate number.",
    taskAr: "اسأل موظف الاستعلامات في المطار للتحقق من بطاقة صعود الطائرة ورقم البوابة الجديدة.",
    modelResponseEn:
      "Excuse me, my boarding pass shows Gate 14, but the screen changed. Could you confirm the current gate?",
    modelResponseAr:
      "معذرة، بطاقة صعودي تُظهر البوابة 14، لكن الشاشة تغيرت. هل يمكنك تأكيد البوابة الحالية؟",
    keyPhrases: [
      { en: "Which gate is flight...?", ar: "أي بوابة مخصصة للرحلة...؟" },
      { en: "Is the flight on schedule?", ar: "هل موعد الرحلة في وقته؟" },
      { en: "Where is baggage claim?", ar: "أين تقع منطقة استلام الأمتعة؟" },
    ],
  },
  supermarket: {
    id: "supermarket",
    topic: "Shopping & Groceries",
    cefr: "A1",
    scenarioEn: "You are looking for fresh ingredients at the grocery store.",
    scenarioAr: "أنت تبحث عن مكونات طازجة داخل متجر البقالة أو السوبرماركت.",
    taskEn:
      "Ask an assistant where to find olive oil and whether they have organic produce in stock.",
    taskAr: "اسأل المساعد عن مكان زيت الزيتون وما إذا كانت لديهم منتجات عضوية متوفرة.",
    modelResponseEn:
      "Excuse me, which aisle can I find olive oil in? And do you have organic vegetables?",
    modelResponseAr: "معذرة، في أي ممر أجد زيت الزيتون؟ وهل تتوفر لديكم خضروات عضوية؟",
    keyPhrases: [
      { en: "Which aisle is... in?", ar: "في أي ممر يقع...؟" },
      { en: "Do you have any in stock?", ar: "هل يتوفر لديكم أي مخزون منه؟" },
      { en: "How much does this cost?", ar: "كم ثمن هذا؟" },
    ],
  },
  bedroom: {
    id: "bedroom",
    topic: "Home & Furniture",
    cefr: "A1",
    scenarioEn:
      "You are shopping for home furniture and need to ask about bed and mattress dimensions.",
    scenarioAr: "أنت تتسوق لشراء أثاث منزلي وتريد السؤال عن مقاسات السرير والمرتبة.",
    taskEn:
      "Ask the store assistant if the wooden bed frame includes a mattress, and whether delivery is available.",
    taskAr:
      "اسأل موظف المتجر عما إذا كان إطار السرير الخشبي يشمل المرتبة وما إذا كانت خدمة التوصيل متوفرة.",
    modelResponseEn:
      "Does this queen-size bed frame come with a mattress, and do you offer home delivery?",
    modelResponseAr: "هل يأتي إطار هذا السرير الكبير مع مرتبة، وهل تقدمون خدمة التوصيل للمنزل؟",
    keyPhrases: [
      { en: "Does it come with...?", ar: "هل يأتي مزودًا بـ...؟" },
      { en: "Do you offer delivery?", ar: "هل تقدمون خدمة التوصيل؟" },
      { en: "What are the dimensions?", ar: "ما هي الأبعاد والمقاسات؟" },
    ],
  },
  bathroom: {
    id: "bathroom",
    topic: "Home Fixtures",
    cefr: "A1",
    scenarioEn: "You are describing bathroom repairs to a plumber.",
    scenarioAr: "أنت تشرح أعمال إصلاح الحمام للسباك.",
    taskEn:
      "Explain that the sink faucet is leaking water and the shower drain needs to be unblocked.",
    taskAr: "اشرح أن صنبور المغسلة يسرب الماء وأن مصرف الدش يحتاج إلى تسليك.",
    modelResponseEn:
      "The bathroom sink faucet is constantly dripping, and the shower drain seems clogged.",
    modelResponseAr: "صنبور مغسلة الحمام يقطر باستمرار، ويبدو أن مصرف الدش مسدود.",
    keyPhrases: [
      { en: "The faucet is leaking", ar: "الصنبور يسرب الماء" },
      { en: "The drain is clogged", ar: "المصرف مسدود" },
      { en: "Could you fix this today?", ar: "هل يمكنك إصلاح هذا اليوم؟" },
    ],
  },
  general: {
    id: "general",
    topic: "Everyday Communication",
    cefr: "A2",
    scenarioEn:
      "You are in an everyday social setting and want to introduce yourself and describe your daily routine.",
    scenarioAr: "أنت في مناسبة اجتماعية وتريد تقديم نفسك وشرح روتينك اليومي بوضوح.",
    taskEn:
      "Introduce yourself, mention where you live, and share what you enjoy doing in your free time.",
    taskAr: "قدّم نفسك، واذكر أين تعيش، وشارك ما تستمتع بالقيام به في أوقات فراغك.",
    modelResponseEn:
      "Hello! It is a pleasure to meet you. I live nearby, and in my free time I enjoy learning languages.",
    modelResponseAr:
      "مرحبًا! يسرني التعرف إليك. أعيش هنا بالقرب، وفي أوقات فراغي أستمتع بتعلم اللغات.",
    keyPhrases: [
      { en: "It is a pleasure to meet you", ar: "يسرني التعرف إليك" },
      { en: "In my daily routine, I...", ar: "في روتيني اليومي، أقوم بـ..." },
      { en: "Could you tell me more about...?", ar: "هل يمكنك إخباري بالمزيد عن...؟" },
    ],
  },
};

export function getCanDoScenarioForUnit(unitIdOrTopic?: string): CanDoTransferChallenge {
  if (!unitIdOrTopic) return CAN_DO_SCENARIOS.general;
  const normalized = unitIdOrTopic.toLowerCase().trim();
  for (const [key, scenario] of Object.entries(CAN_DO_SCENARIOS)) {
    if (normalized.includes(key)) {
      return scenario;
    }
  }
  return CAN_DO_SCENARIOS.general;
}
