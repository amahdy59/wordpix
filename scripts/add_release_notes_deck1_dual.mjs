import fs from 'node:fs';

const REL_PATH = 'src/app/data/releaseNotes.json';
const PUB_PATH = 'public/release-notes.json';

const data = JSON.parse(fs.readFileSync(REL_PATH, 'utf8'));

if (data.releases.some(r => r.id === '0.1.94' || r.version === '0.1.94')) {
  console.log('Release 0.1.94 already exists.');
} else {
  const newRelease = {
    id: '0.1.94',
    version: '0.1.94',
    date: '2026-10-28',
    title: {
      en: 'Figma Deck 1 ingestion, dual literal-figurative idiom linking & local browsing',
      ar: 'إدراج الدفعة الأولى من فيجما والربط المزدوج الحرفي والمجازي للتعبيرات الاصطلاحية وتوفير التصفح المحلي'
    },
    changes: [
      {
        id: 'deck1-dual-idiom-linking',
        category: 'added',
        en: 'Dual-linked 1,690 idioms and reference phrases with both figurative context scenes and literal interpretation illustrations across exercises and learning materials.',
        ar: 'ربط مزدوج لـ 1,690 تعبيراً اصطلاحياً وعبارة مرجعية بكل من المشاهد المجازية التعبيرية والمشاهد التوضيحية الحرفية عبر التمارين والمواد التعليمية.'
      },
      {
        id: 'deck1-public-browsing-gallery',
        category: 'improved',
        en: 'Established browsable directory in public/question-images/v2/_ALL_3411_DECK1_IMAGES with interactive gallery and CSV manifest covering all 3,411 Deck 1 images.',
        ar: 'إنشاء مجلد تصفح مباشر في public/question-images/v2/_ALL_3411_DECK1_IMAGES يحتوي على معرض تفاعلي وملف حصر شامل لكافة صور الدفعة الأولى البالغ عددها 3,411 صورة.'
      },
      {
        id: 'deck1-duplicate-resolution',
        category: 'improved',
        en: 'Resolved duplicate image versions by prioritizing highest fidelity assets as primary and preserving alternates in imageFallbacks.',
        ar: 'معالجة الصور المكررة باعتماد النسخ الأعلى دقة وجودة كصور أساسية مع الاحتفاظ بالبدائل في مصفوفة البدائل الاحتياطية دون فقدان أي بيانات.'
      }
    ]
  };

  data.version = '0.1.94';
  data.releases.unshift(newRelease);
  fs.writeFileSync(REL_PATH, JSON.stringify(data, null, 2) + '\n');
  fs.writeFileSync(PUB_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log('Added release 0.1.94 to releaseNotes.json and public/release-notes.json.');
}
