import { readFile, writeFile } from "node:fs/promises";
const path = "scripts/editorial_arabic_repairs.json";
const repairs = JSON.parse(await readFile(path, "utf8"));
const additions = {
  "real-estate-agency": { inspector: "فاحص عقارات", "listing-agreement": "اتفاقية تسويق عقار" },
  "property-types": {
    farmhouse: "منزل ريفي في مزرعة",
    ranch: "منزل بطابق واحد",
    "office-building": "مبنى مكاتب",
  },
  "home-features": {
    "home-office": "مكتب منزلي",
    terrace: "مساحة خارجية مستوية",
    deck: "منصة خارجية خشبية",
  },
  "moving-settling-in": {
    "hand-truck": "عربة نقل يدوية بعجلتين",
    pack: "يحزم الأمتعة",
    label: "يضع ملصقًا تعريفيًا",
    load: "يحمّل الأمتعة",
  },
  "startup-culture": {
    scale: "يوسّع نطاق الشركة",
    runway: "المدة المتبقية قبل نفاد التمويل",
    "business-plan": "خطة عمل",
    retrospective: "اجتماع مراجعة العمل السابق",
  },
  "freelancing-remote-work": {
    1099: "نماذج ضريبية أمريكية من فئة 1099",
    portfolio: "ملف أعمال",
    retainer: "أتعاب مقدّمة لحجز الخدمات",
    ergonomics: "تكييف بيئة العمل لتناسب المستخدم",
    "home-office": "مكتب منزلي",
  },
  "research-study": { index: "فهرس موضوعات", paper: "بحث أو ورقة علمية", reference: "مرجع" },
  "legal-documents": { lease: "عقد إيجار", amendment: "تعديل رسمي" },
  office: {
    monitor: "شاشة حاسوب",
    "water-cooler": "مُبرّد مياه",
    "conference-table": "طاولة اجتماعات",
  },
  "meeting-room": {
    "flip-chart": "لوح ورقي للعروض",
    chart: "مخطط بياني",
    present: "يقدّم عرضًا",
    table: "يؤجّل المناقشة (أمريكي)؛ يطرح رسميًا (بريطاني)",
    workshop: "ورشة عمل",
  },
  "coworking-space": { reception: "منطقة الاستقبال", workshop: "ورشة عمل" },
  bank: {
    vault: "خزنة محصّنة",
    wire: "يحوّل المال إلكترونيًا",
    "currency-exchange": "صرف العملات",
    "customer-service": "خدمة العملاء",
    "compliance-officer": "مسؤول امتثال",
    transfer: "يحوّل المال",
    withdraw: "يسحب المال",
    deposit: "يودع المال",
  },
  "financial-services": {
    "social-security": "الضمان الاجتماعي الأمريكي",
    policy: "وثيقة تأمين",
    return: "عائد استثمار",
    risk: "مخاطر",
    annuity: "عقد دفعات دورية",
  },
  "money-currency": { balance: "رصيد", "bank-account": "حساب مصرفي" },
  "currency-payment": { "wire-transfer": "تحويل مصرفي إلكتروني", balance: "رصيد" },
  "academic-life": {
    minor: "تخصص فرعي",
    syllabus: "خطة المقرر",
    rubric: "سُلّم تقييم",
    chancellor: "رئيس الجامعة أو رئيسها الفخري",
  },
  "student-life": {
    "financial-aid": "مساعدة مالية",
    "coffee-shop": "مقهى",
    tailgate: "تجمع قبل مباراة قرب السيارات",
    "spring-formal": "حفل طلابي رسمي في الربيع",
  },
  "business-communication": {
    email: "رسالة بريد إلكتروني",
    "touch-base": "يتواصل بإيجاز",
    alignment: "توافق الأهداف والخطط",
  },
  "office-supplies": {
    "fountain-pen": "قلم حبر سائل",
    "index-card": "بطاقة ملاحظات",
    label: "ملصق تعريفي",
    "mouse-pad": "لوحة فأرة الحاسوب",
  },
  embassy: { "application-form": "نموذج طلب", form: "نموذج", "conference-room": "قاعة اجتماعات" },
  "complex-feelings": {
    inspired: "مفعم بالإلهام",
    vulnerable: "عرضة للأذى العاطفي",
    ambivalent: "ذو مشاعر مختلطة",
  },
  library: { bookmark: "علامة صفحة", label: "ملصق تعريفي" },
};
for (const [unit, values] of Object.entries(additions))
  repairs[unit] = { ...repairs[unit], ...values };
await writeFile(path, JSON.stringify(repairs, null, 2) + "\n");
