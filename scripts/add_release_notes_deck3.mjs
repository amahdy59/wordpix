import fs from 'node:fs';
import path from 'node:path';

const REL_PATH = 'src/app/data/releaseNotes.json';
const PUB_PATH = 'public/release-notes.json';

const data = JSON.parse(fs.readFileSync(REL_PATH, 'utf8'));

// Check if 0.1.93 already exists
if (data.releases.some(r => r.id === '0.1.93' || r.version === '0.1.93')) {
  console.log('Release 0.1.93 already exists.');
} else {
  const newRelease = {
    id: '0.1.93',
    version: '0.1.93',
    date: '2026-10-28',
    title: {
      en: 'Figma Deck 3 visual expansion & cloud delivery (3,469 Visuals)',
      ar: 'إدماج الدفعة الثالثة من الصور التعليمية في فيجما والتسليم السحابي (3,469 صورة)'
    },
    changes: [
      {
        id: 'deck3-visual-ingestion',
        category: 'added',
        en: 'Downloaded, WebP-optimized, and linked 3,469 cinematic widescreen context illustrations, reference phrase visuals, and reading/dialogue cover scenes from Figma Deck 3.',
        ar: 'تحميل وتحسين وربط 3,469 صورة توضيحية سينمائية عريضة للقصص والمحادثات والعبارات التعبيرية وسياقات التعلم من الدفعة الثالثة في فيجما.'
      },
      {
        id: 'deck3-r2-cloud-sync',
        category: 'improved',
        en: 'Optimized all images into lightweight WebP (quality 80) and synchronized to Cloudflare R2 bucket (wordpix-media) under content-addressed keys.',
        ar: 'تحويل كافة الصور إلى صيغة WebP فائقة الجودة (جودة 80) ومزامنتها بنجاح مع شبكة التوزيع السحابية Cloudflare R2.'
      },
      {
        id: 'deck3-browsable-galleries',
        category: 'improved',
        en: 'Populated browsable local galleries, manifests, and updated exact sentence exercise mappings in reviewedExactSentenceMedia.',
        ar: 'إنشاء معارض بصرية تفاعلية وملفات حصر شاملة وتحديث سجلات ربط التمارين والجمل التوضيحية.'
      }
    ]
  };

  data.releases.unshift(newRelease);
  fs.writeFileSync(REL_PATH, JSON.stringify(data, null, 2) + '\n');
  fs.writeFileSync(PUB_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log('Added release 0.1.93 to releaseNotes.json and public/release-notes.json.');
}
