const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, '..', 'public');
const wordImagesDir = path.join(publicDir, 'word-images');
const bathroomDir = path.join(wordImagesDir, 'bathroom');
const sceneDir = path.join(publicDir, 'scene-images');

// Ensure directories exist
if (!fs.existsSync(wordImagesDir)) fs.mkdirSync(wordImagesDir);
if (!fs.existsSync(bathroomDir)) fs.mkdirSync(bathroomDir);
if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir);

const bathroomItems = [
  {
    "id": "toilet",
    "label": "Toilet",
    "category": "Plumbing Fixtures",
    "bg": "#f8fafc",
    "fg": "#334155",
    "emoji": "\ud83d\udebd"
  },
  {
    "id": "sink",
    "label": "Sink",
    "category": "Plumbing Fixtures",
    "bg": "#e0f2fe",
    "fg": "#0369a1",
    "emoji": "\ud83d\udeb0"
  },
  {
    "id": "bathtub",
    "label": "Bathtub",
    "category": "Plumbing Fixtures",
    "bg": "#f1f5f9",
    "fg": "#0f172a",
    "emoji": "\ud83d\udec1"
  },
  {
    "id": "shower",
    "label": "Shower",
    "category": "Plumbing Fixtures",
    "bg": "#e0f2fe",
    "fg": "#0284c7",
    "emoji": "\ud83d\udebf"
  },
  {
    "id": "faucet",
    "label": "Faucet",
    "category": "Plumbing Fixtures",
    "bg": "#f8fafc",
    "fg": "#475569",
    "emoji": "\ud83d\udeb0"
  },
  {
    "id": "drain",
    "label": "Drain",
    "category": "Plumbing Fixtures",
    "bg": "#f1f5f9",
    "fg": "#1e293b",
    "emoji": "\ud83c\udf00"
  },
  {
    "id": "bidet",
    "label": "Bidet",
    "category": "Plumbing Fixtures",
    "bg": "#e0f2fe",
    "fg": "#0369a1",
    "emoji": "\ud83d\udebd"
  },
  {
    "id": "showerhead",
    "label": "Showerhead",
    "category": "Plumbing Fixtures",
    "bg": "#e0f2fe",
    "fg": "#0284c7",
    "emoji": "\ud83d\udebf"
  },
  {
    "id": "soap",
    "label": "Soap",
    "category": "Toiletries",
    "bg": "#fef3c7",
    "fg": "#b45309",
    "emoji": "\ud83e\uddfc"
  },
  {
    "id": "shampoo",
    "label": "Shampoo",
    "category": "Toiletries",
    "bg": "#fce7f3",
    "fg": "#be185d",
    "emoji": "\ud83e\uddf4"
  },
  {
    "id": "conditioner",
    "label": "Conditioner",
    "category": "Toiletries",
    "bg": "#dcfce7",
    "fg": "#15803d",
    "emoji": "\ud83e\uddf4"
  },
  {
    "id": "toothpaste",
    "label": "Toothpaste",
    "category": "Toiletries",
    "bg": "#e0f2fe",
    "fg": "#0284c7",
    "emoji": "\ud83e\udea5"
  },
  {
    "id": "toothbrush",
    "label": "Toothbrush",
    "category": "Toiletries",
    "bg": "#f1f5f9",
    "fg": "#334155",
    "emoji": "\ud83e\udea5"
  },
  {
    "id": "deodorant",
    "label": "Deodorant",
    "category": "Toiletries",
    "bg": "#ffedd5",
    "fg": "#c2410c",
    "emoji": "\ud83e\uddf4"
  },
  {
    "id": "lotion",
    "label": "Lotion",
    "category": "Toiletries",
    "bg": "#fae8ff",
    "fg": "#a21caf",
    "emoji": "\ud83e\uddf4"
  },
  {
    "id": "mouthwash",
    "label": "Mouthwash",
    "category": "Toiletries",
    "bg": "#d1fae5",
    "fg": "#047857",
    "emoji": "\ud83e\uddf4"
  },
  {
    "id": "bath-towel",
    "label": "Bath Towel",
    "category": "Linens & Textiles",
    "bg": "#fef9c3",
    "fg": "#a16207",
    "emoji": "\u30bf\u30aa\u30eb"
  },
  {
    "id": "hand-towel",
    "label": "Hand Towel",
    "category": "Linens & Textiles",
    "bg": "#fef3c7",
    "fg": "#b45309",
    "emoji": "\u30bf\u30aa\u30eb"
  },
  {
    "id": "washcloth",
    "label": "Washcloth",
    "category": "Linens & Textiles",
    "bg": "#ffedd5",
    "fg": "#c2410c",
    "emoji": "\ud83e\uddfd"
  },
  {
    "id": "bath-mat",
    "label": "Bath Mat",
    "category": "Linens & Textiles",
    "bg": "#f1f5f9",
    "fg": "#334155",
    "emoji": "\ud83d\udd32"
  },
  {
    "id": "bathrobe",
    "label": "Bathrobe",
    "category": "Linens & Textiles",
    "bg": "#fce7f3",
    "fg": "#be185d",
    "emoji": "\ud83d\udc58"
  },
  {
    "id": "shower-curtain",
    "label": "Shower Curtain",
    "category": "Linens & Textiles",
    "bg": "#e0f2fe",
    "fg": "#0284c7",
    "emoji": "\ud83d\udebf"
  },
  {
    "id": "mirror",
    "label": "Mirror",
    "category": "Bathroom Accessories",
    "bg": "#f8fafc",
    "fg": "#475569",
    "emoji": "\ud83e\ude9e"
  },
  {
    "id": "comb",
    "label": "Comb",
    "category": "Bathroom Accessories",
    "bg": "#ffedd5",
    "fg": "#c2410c",
    "emoji": "\ud83e\udeae"
  },
  {
    "id": "hairbrush",
    "label": "Hairbrush",
    "category": "Bathroom Accessories",
    "bg": "#fce7f3",
    "fg": "#be185d",
    "emoji": "\ud83e\udeae"
  },
  {
    "id": "hairdryer",
    "label": "Hairdryer",
    "category": "Bathroom Accessories",
    "bg": "#fef3c7",
    "fg": "#b45309",
    "emoji": "\ud83d\udca8"
  },
  {
    "id": "razor",
    "label": "Razor",
    "category": "Bathroom Accessories",
    "bg": "#f1f5f9",
    "fg": "#1e293b",
    "emoji": "\ud83e\ude92"
  },
  {
    "id": "tweezers",
    "label": "Tweezers",
    "category": "Bathroom Accessories",
    "bg": "#e0f2fe",
    "fg": "#0369a1",
    "emoji": "\ud83d\udd87\ufe0f"
  },
  {
    "id": "nail-clippers",
    "label": "Nail Clippers",
    "category": "Bathroom Accessories",
    "bg": "#f1f5f9",
    "fg": "#334155",
    "emoji": "\u2702\ufe0f"
  },
  {
    "id": "cotton-swab",
    "label": "Cotton Swab",
    "category": "Bathroom Accessories",
    "bg": "#fef9c3",
    "fg": "#a16207",
    "emoji": "\ud83e\udd62"
  },
  {
    "id": "toilet-paper",
    "label": "Toilet Paper",
    "category": "Bathroom Utilities",
    "bg": "#f8fafc",
    "fg": "#0f172a",
    "emoji": "\ud83e\uddfb"
  },
  {
    "id": "plunger",
    "label": "Plunger",
    "category": "Bathroom Utilities",
    "bg": "#fee2e2",
    "fg": "#dc2626",
    "emoji": "\ud83e\udea0"
  },
  {
    "id": "toilet-brush",
    "label": "Toilet Brush",
    "category": "Bathroom Utilities",
    "bg": "#f1f5f9",
    "fg": "#334155",
    "emoji": "\ud83e\udea5"
  },
  {
    "id": "trash-can",
    "label": "Trash Can",
    "category": "Bathroom Utilities",
    "bg": "#e2e8f0",
    "fg": "#334155",
    "emoji": "\ud83d\uddd1\ufe0f"
  },
  {
    "id": "scale",
    "label": "Scale",
    "category": "Bathroom Utilities",
    "bg": "#f8fafc",
    "fg": "#475569",
    "emoji": "\u2696\ufe0f"
  },
  {
    "id": "laundry-basket",
    "label": "Laundry Basket",
    "category": "Bathroom Utilities",
    "bg": "#ffedd5",
    "fg": "#9a3412",
    "emoji": "\ud83e\uddfa"
  },
  {
    "id": "sponge",
    "label": "Sponge",
    "category": "Bathroom Utilities",
    "bg": "#fef08a",
    "fg": "#854d0e",
    "emoji": "\ud83e\uddfd"
  },
  {
    "id": "loofah",
    "label": "Loofah",
    "category": "Bathroom Utilities",
    "bg": "#dcfce7",
    "fg": "#15803d",
    "emoji": "\ud83e\uddfd"
  }
];

async function generateSvgBuffer(item) {
  const badgeText = item.category.toUpperCase().replace(/&/g, '&amp;');
  // Fallback for missing emojis
  const safeEmoji = item.emoji === "タオル" ? "🛁" : item.emoji;

  const svg = `
  <svg width="600" height="450" viewBox="0 0 600 450" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${item.bg}" />
        <stop offset="100%" stop-color="#ffffff" />
      </linearGradient>
      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${item.fg}" flood-opacity="0.18"/>
      </filter>
    </defs>
    
    <rect width="600" height="450" rx="32" fill="url(#grad-${item.id})"/>
    <rect x="2" y="2" width="596" height="446" rx="30" fill="none" stroke="${item.fg}" stroke-width="3" stroke-opacity="0.2"/>
    
    <circle cx="300" cy="180" r="96" fill="${item.fg}" fill-opacity="0.12" filter="url(#shadow)"/>
    <circle cx="300" cy="180" r="82" fill="#ffffff" stroke="${item.fg}" stroke-width="3" stroke-opacity="0.3"/>
    
    <text x="300" y="208" font-family="'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" font-size="76" text-anchor="middle">
      ${safeEmoji}
    </text>
    
    <text x="300" y="325" font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="800" fill="${item.fg}" text-anchor="middle" letter-spacing="-0.5">
      ${item.label}
    </text>
    
    <rect x="150" y="358" width="300" height="36" rx="18" fill="${item.fg}" fill-opacity="0.15"/>
    <text x="300" y="382" font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="${item.fg}" text-anchor="middle" letter-spacing="1.5">
      ${badgeText}
    </text>
  </svg>`;

  return Buffer.from(svg);
}

async function generateHeroBuffer() {
  const svg = `
  <svg width="1200" height="675" viewBox="0 0 1200 675" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bathroomSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#bae6fd" />
        <stop offset="100%" stop-color="#f8fafc" />
      </linearGradient>
      <linearGradient id="tileGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#e2e8f0" />
        <stop offset="100%" stop-color="#cbd5e1" />
      </linearGradient>
    </defs>
    
    <rect width="1200" height="675" fill="url(#bathroomSky)" />
    <rect x="0" y="450" width="1200" height="225" fill="url(#tileGrad)" />
    
    <rect x="100" y="250" width="300" height="150" rx="20" fill="#ffffff" stroke="#94a3b8" stroke-width="4" />
    <circle cx="250" cy="325" r="40" fill="#e0f2fe" />
    
    <rect x="700" y="100" width="300" height="400" rx="10" fill="#f8fafc" stroke="#94a3b8" stroke-width="6" />
    <circle cx="850" cy="180" r="30" fill="#38bdf8" />
    
    <rect x="360" y="80" width="480" height="110" rx="28" fill="#ffffff" fill-opacity="0.92" stroke="#0284c7" stroke-width="3" />
    <text x="600" y="132" font-family="'Inter', sans-serif" font-size="34" font-weight="900" fill="#0c4a6e" text-anchor="middle">
      THE BATHROOM
    </text>
    <text x="600" y="166" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#0284c7" text-anchor="middle" letter-spacing="2">
      LEVEL 2 A1 IMMERSION
    </text>
  </svg>`;

  return Buffer.from(svg);
}

async function run() {
  console.log('Generating bathroom word WebP assets...');
  for (const item of bathroomItems) {
    const svgBuffer = await generateSvgBuffer(item);
    const dest = path.join(bathroomDir, `${item.id}.webp`);
    await sharp(svgBuffer).webp({ quality: 90 }).toFile(dest);
  }
  console.log('Generating bathroom hero scene WebP asset...');
  const heroBuffer = await generateHeroBuffer();
  await sharp(heroBuffer).webp({ quality: 90 }).toFile(path.join(sceneDir, 'bathroom-hero.webp'));
  console.log('Successfully generated all bathroom image assets!');
}

run().catch(console.error);
