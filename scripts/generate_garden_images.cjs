// scripts/generate_garden_images.cjs
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const gardenDir = path.resolve('public/word-images/garden');
const sceneDir = path.resolve('public/scene-images');

if (!fs.existsSync(gardenDir)) fs.mkdirSync(gardenDir, { recursive: true });
if (!fs.existsSync(sceneDir)) fs.mkdirSync(sceneDir, { recursive: true });

const gardenItems = [
  // Flowers
  { id: 'rose', label: 'Rose', category: 'Flowers', bg: '#fce7f3', fg: '#be123c', emoji: '🌹' },
  { id: 'tulip', label: 'Tulip', category: 'Flowers', bg: '#fee2e2', fg: '#dc2626', emoji: '🌷' },
  { id: 'sunflower', label: 'Sunflower', category: 'Flowers', bg: '#fef3c7', fg: '#b45309', emoji: '🌻' },
  { id: 'daisy', label: 'Daisy', category: 'Flowers', bg: '#fef9c3', fg: '#854d0e', emoji: '🌼' },
  { id: 'lily', label: 'Lily', category: 'Flowers', bg: '#f3e8ff', fg: '#7e22ce', emoji: '🌸' },
  { id: 'daffodil', label: 'Daffodil', category: 'Flowers', bg: '#fef08a', fg: '#a16207', emoji: '🏵️' },
  { id: 'violet', label: 'Violet', category: 'Flowers', bg: '#ede9fe', fg: '#6d28d9', emoji: '🪻' },
  { id: 'orchid', label: 'Orchid', category: 'Flowers', bg: '#fae8ff', fg: '#a21caf', emoji: '🌺' },
  { id: 'carnation', label: 'Carnation', category: 'Flowers', bg: '#ffe4e6', fg: '#e11d48', emoji: '💮' },
  { id: 'lavender', label: 'Lavender', category: 'Flowers', bg: '#e0e7ff', fg: '#4338ca', emoji: '🌿' },

  // Trees & Shrubs
  { id: 'oak-tree', label: 'Oak Tree', category: 'Trees & Shrubs', bg: '#dcfce7', fg: '#15803d', emoji: '🌳' },
  { id: 'pine-tree', label: 'Pine Tree', category: 'Trees & Shrubs', bg: '#d1fae5', fg: '#047857', emoji: '🌲' },
  { id: 'apple-tree', label: 'Apple Tree', category: 'Trees & Shrubs', bg: '#ecfdf5', fg: '#059669', emoji: '🍎' },
  { id: 'cherry-tree', label: 'Cherry Tree', category: 'Trees & Shrubs', bg: '#fdf2f8', fg: '#db2777', emoji: '🍒' },
  { id: 'palm-tree', label: 'Palm Tree', category: 'Trees & Shrubs', bg: '#e0f2fe', fg: '#0369a1', emoji: '🌴' },
  { id: 'hedge', label: 'Hedge', category: 'Trees & Shrubs', bg: '#dcfce7', fg: '#166534', emoji: '🌱' },
  { id: 'bush', label: 'Bush', category: 'Trees & Shrubs', bg: '#ecfccb', fg: '#4d7c0f', emoji: '🪴' },
  { id: 'ivy', label: 'Ivy', category: 'Trees & Shrubs', bg: '#dcfce7', fg: '#15803d', emoji: '🍃' },
  { id: 'vine', label: 'Vine', category: 'Trees & Shrubs', bg: '#d1fae5', fg: '#065f46', emoji: '🍇' },
  { id: 'fern', label: 'Fern', category: 'Trees & Shrubs', bg: '#dcfce7', fg: '#16a34a', emoji: '🌿' },

  // Garden Tools
  { id: 'shovel', label: 'Shovel', category: 'Garden Tools', bg: '#f1f5f9', fg: '#334155', emoji: '⛏️' },
  { id: 'rake', label: 'Rake', category: 'Garden Tools', bg: '#fef3c7', fg: '#b45309', emoji: '🧹' },
  { id: 'watering-can', label: 'Watering Can', category: 'Garden Tools', bg: '#e0f2fe', fg: '#0284c7', emoji: '🚿' },
  { id: 'wheelbarrow', label: 'Wheelbarrow', category: 'Garden Tools', bg: '#ffedd5', fg: '#c2410c', emoji: '🛒' },
  { id: 'hose', label: 'Hose', category: 'Garden Tools', bg: '#ccfbf1', fg: '#0f766e', emoji: '🌀' },
  { id: 'garden-gloves', label: 'Garden Gloves', category: 'Garden Tools', bg: '#fae8ff', fg: '#9333ea', emoji: '🧤' },
  { id: 'pruner', label: 'Pruner', category: 'Garden Tools', bg: '#fee2e2', fg: '#b91c1c', emoji: '✂️' },
  { id: 'trowel', label: 'Trowel', category: 'Garden Tools', bg: '#f1f5f9', fg: '#475569', emoji: '🥄' },
  { id: 'lawn-mower', label: 'Lawn Mower', category: 'Garden Tools', bg: '#dcfce7', fg: '#15803d', emoji: '🚜' },
  { id: 'spade', label: 'Spade', category: 'Garden Tools', bg: '#f8fafc', fg: '#1e293b', emoji: '♠️' },
  { id: 'pitchfork', label: 'Pitchfork', category: 'Garden Tools', bg: '#fef3c7', fg: '#92400e', emoji: '🔱' },
  { id: 'sprinkler', label: 'Sprinkler', category: 'Garden Tools', bg: '#e0f2fe', fg: '#0369a1', emoji: '💦' },

  // Parts of a Plant
  { id: 'root', label: 'Root', category: 'Parts of a Plant', bg: '#fef3c7', fg: '#78350f', emoji: '🥕' },
  { id: 'stem', label: 'Stem', category: 'Parts of a Plant', bg: '#dcfce7', fg: '#15803d', emoji: '🎋' },
  { id: 'leaf', label: 'Leaf', category: 'Parts of a Plant', bg: '#dcfce7', fg: '#16a34a', emoji: '🍃' },
  { id: 'petal', label: 'Petal', category: 'Parts of a Plant', bg: '#ffe4e6', fg: '#e11d48', emoji: '🌸' },
  { id: 'branch', label: 'Branch', category: 'Parts of a Plant', bg: '#ffedd5', fg: '#9a3412', emoji: '🪵' },
  { id: 'bark', label: 'Bark', category: 'Parts of a Plant', bg: '#fef3c7', fg: '#451a03', emoji: '🪵' },
  { id: 'bud', label: 'Bud', category: 'Parts of a Plant', bg: '#ecfdf5', fg: '#059669', emoji: '🌱' },
  { id: 'seed', label: 'Seed', category: 'Parts of a Plant', bg: '#fef3c7', fg: '#b45309', emoji: '🌰' },
  { id: 'thorn', label: 'Thorn', category: 'Parts of a Plant', bg: '#f1f5f9', fg: '#334155', emoji: '🌵' },
  { id: 'berry', label: 'Berry', category: 'Parts of a Plant', bg: '#fce7f3', fg: '#be185d', emoji: '🍓' },

  // Garden Creatures
  { id: 'butterfly', label: 'Butterfly', category: 'Garden Creatures', bg: '#fae8ff', fg: '#a21caf', emoji: '🦋' },
  { id: 'ladybug', label: 'Ladybug', category: 'Garden Creatures', bg: '#fee2e2', fg: '#dc2626', emoji: '🐞' },
  { id: 'bee', label: 'Bee', category: 'Garden Creatures', bg: '#fef9c3', fg: '#a16207', emoji: '🐝' },
  { id: 'worm', label: 'Worm', category: 'Garden Creatures', bg: '#ffe4e6', fg: '#9f1239', emoji: '🪱' },
  { id: 'snail', label: 'Snail', category: 'Garden Creatures', bg: '#ffedd5', fg: '#c2410c', emoji: '🐌' },
  { id: 'ant', label: 'Ant', category: 'Garden Creatures', bg: '#f1f5f9', fg: '#1e293b', emoji: '🐜' },
  { id: 'caterpillar', label: 'Caterpillar', category: 'Garden Creatures', bg: '#dcfce7', fg: '#16a34a', emoji: '🐛' },
  { id: 'spider', label: 'Spider', category: 'Garden Creatures', bg: '#f1f5f9', fg: '#0f172a', emoji: '🕷️' },
  { id: 'dragonfly', label: 'Dragonfly', category: 'Garden Creatures', bg: '#e0f2fe', fg: '#0284c7', emoji: '🦗' },
  { id: 'grasshopper', label: 'Grasshopper', category: 'Garden Creatures', bg: '#ecfccb', fg: '#65a30d', emoji: '🦗' },

  // Garden Features
  { id: 'lawn', label: 'Lawn', category: 'Garden Features', bg: '#dcfce7', fg: '#15803d', emoji: '⛳' },
  { id: 'flower-bed', label: 'Flower Bed', category: 'Garden Features', bg: '#fdf2f8', fg: '#be185d', emoji: '💐' },
  { id: 'path', label: 'Path', category: 'Garden Features', bg: '#f8fafc', fg: '#475569', emoji: '🛤️' },
  { id: 'fence', label: 'Fence', category: 'Garden Features', bg: '#fef3c7', fg: '#78350f', emoji: '🧱' },
  { id: 'gate', label: 'Gate', category: 'Garden Features', bg: '#f1f5f9', fg: '#334155', emoji: '🚪' },
  { id: 'greenhouse', label: 'Greenhouse', category: 'Garden Features', bg: '#d1fae5', fg: '#047857', emoji: '🏡' },
  { id: 'bird-feeder', label: 'Bird Feeder', category: 'Garden Features', bg: '#ffedd5', fg: '#c2410c', emoji: '🐦' },
  { id: 'garden-shed', label: 'Garden Shed', category: 'Garden Features', bg: '#fef3c7', fg: '#92400e', emoji: '🏚️' },
  { id: 'birdbath', label: 'Birdbath', category: 'Garden Features', bg: '#e0f2fe', fg: '#0369a1', emoji: '⛲' },
  { id: 'compost-bin', label: 'Compost Bin', category: 'Garden Features', bg: '#ecfdf5', fg: '#065f46', emoji: '♻️' }
];

async function generateSvgBuffer(item) {
  const badgeText = item.category.toUpperCase().replace(/&/g, '&amp;');

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
    
    <!-- Card Background -->
    <rect width="600" height="450" rx="32" fill="url(#grad-${item.id})"/>
    <rect x="2" y="2" width="596" height="446" rx="30" fill="none" stroke="${item.fg}" stroke-width="3" stroke-opacity="0.2"/>
    
    <!-- Central Icon/Pill Circle -->
    <circle cx="300" cy="180" r="96" fill="${item.fg}" fill-opacity="0.12" filter="url(#shadow)"/>
    <circle cx="300" cy="180" r="82" fill="#ffffff" stroke="${item.fg}" stroke-width="3" stroke-opacity="0.3"/>
    
    <!-- Emoji / Visual Center -->
    <text x="300" y="208" font-family="'Segoe UI Emoji', 'Apple Color Emoji', sans-serif" font-size="76" text-anchor="middle">
      ${item.emoji}
    </text>
    
    <!-- Word Label -->
    <text x="300" y="325" font-family="'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="800" fill="${item.fg}" text-anchor="middle" letter-spacing="-0.5">
      ${item.label}
    </text>
    
    <!-- Category Badge -->
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
      <linearGradient id="gardenSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="45%" stop-color="#bae6fd" />
        <stop offset="100%" stop-color="#ecfdf5" />
      </linearGradient>
      <linearGradient id="lawnGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#22c55e" />
        <stop offset="100%" stop-color="#15803d" />
      </linearGradient>
    </defs>
    
    <!-- Sky & Lawn Backdrop -->
    <rect width="1200" height="675" fill="url(#gardenSky)" />
    <ellipse cx="600" cy="720" rx="900" ry="320" fill="url(#lawnGrad)" />
    
    <!-- Sun & Sunlight -->
    <circle cx="1050" cy="120" r="60" fill="#facc15" opacity="0.9" />
    
    <!-- Distant Trees -->
    <circle cx="200" cy="380" r="140" fill="#16a34a" opacity="0.7" />
    <circle cx="340" cy="360" r="120" fill="#15803d" opacity="0.8" />
    <circle cx="950" cy="370" r="150" fill="#16a34a" opacity="0.7" />
    <circle cx="1080" cy="390" r="130" fill="#15803d" opacity="0.8" />
    
    <!-- Flower Beds -->
    <ellipse cx="600" cy="560" rx="380" ry="90" fill="#854d0e" opacity="0.8" />
    
    <!-- Decorative Floral & Nature Details -->
    <text x="400" y="560" font-size="64">🌹</text>
    <text x="480" y="540" font-size="64">🌻</text>
    <text x="560" y="570" font-size="64">🌷</text>
    <text x="640" y="535" font-size="64">🌼</text>
    <text x="720" y="565" font-size="64">🪻</text>
    <text x="800" y="540" font-size="64">🌸</text>
    
    <!-- Creatures -->
    <text x="320" y="240" font-size="54">🦋</text>
    <text x="850" y="280" font-size="48">🐝</text>
    <text x="240" y="580" font-size="44">🐞</text>
    
    <!-- Title Card Overlay -->
    <rect x="360" y="80" width="480" height="110" rx="28" fill="#ffffff" fill-opacity="0.92" stroke="#16a34a" stroke-width="3" />
    <text x="600" y="132" font-family="'Inter', sans-serif" font-size="34" font-weight="900" fill="#14532d" text-anchor="middle">
      THE GARDEN
    </text>
    <text x="600" y="166" font-family="'Inter', sans-serif" font-size="16" font-weight="700" fill="#16a34a" text-anchor="middle" letter-spacing="2">
      LEVEL 2 · A1 IMMERSION
    </text>
  </svg>`;

  return Buffer.from(svg);
}

async function run() {
  console.log('Generating 62 garden word WebP assets...');
  for (const item of gardenItems) {
    const svgBuffer = await generateSvgBuffer(item);
    const dest = path.join(gardenDir, `${item.id}.webp`);
    await sharp(svgBuffer).webp({ quality: 90 }).toFile(dest);
  }
  console.log('Generating garden hero scene WebP asset...');
  const heroBuffer = await generateHeroBuffer();
  await sharp(heroBuffer).webp({ quality: 90 }).toFile(path.join(sceneDir, 'garden-hero.webp'));
  console.log('Successfully generated all garden image assets!');
}

run().catch(console.error);
