// Centralized Lesson Vocabulary Data Layer for WordPix
// Synchronized from Figma Design (Node 44:2 — The Bedroom)

export interface VocabItem {
  id: string;
  label: string;
  phonetic: string;
  img: string;
  topic: string;
  hotspot?: { x: string; y: string };
}

export interface TopicCategory {
  id: string;
  name: string;
  itemsCount: number;
}

export const BEDROOM_TOPICS: TopicCategory[] = [
  { id: "furniture", name: "Furniture", itemsCount: 10 },
  { id: "bedding", name: "Bedding & Linen", itemsCount: 10 },
  { id: "features", name: "Room Features", itemsCount: 10 },
  { id: "objects", name: "Bedroom Objects", itemsCount: 10 },
  { id: "personal", name: "Personal Items", itemsCount: 10 },
  { id: "electronics", name: "Electronics", itemsCount: 8 },
];

export const BEDROOM_VOCABULARY: VocabItem[] = [
  // ── Furniture ─────────────────────────────────────────────────────────────
  {
    id: "bed",
    label: "Bed",
    phonetic: "bed",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1613940512699-fc9150817bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "28%", y: "58%" },
  },
  {
    id: "nightstand",
    label: "Nightstand",
    phonetic: "night-stand",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "dresser",
    label: "Dresser",
    phonetic: "dres-ser",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "wardrobe",
    label: "Wardrobe",
    phonetic: "ward-robe",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "72%", y: "36%" },
  },
  {
    id: "desk",
    label: "Desk",
    phonetic: "desk",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "chair",
    label: "Chair",
    phonetic: "chair",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "bookshelf",
    label: "Bookshelf",
    phonetic: "book-shelf",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1594620302200-9a762244a156?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "mirror",
    label: "Mirror",
    phonetic: "mir-ror",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1618220179428-22790b461013?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "stool",
    label: "Stool",
    phonetic: "stool",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1503602642458-232111445657?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "chest-of-drawers",
    label: "Chest of Drawers",
    phonetic: "chest-of-drawers",
    topic: "furniture",
    img: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },

  // ── Bedding & Linen ────────────────────────────────────────────────────────
  {
    id: "pillow",
    label: "Pillow",
    phonetic: "pil-low",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1623944436679-5412c658a358?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "44%", y: "66%" },
  },
  {
    id: "blanket",
    label: "Blanket",
    phonetic: "blan-ket",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1600369672770-985fd30004eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "sheet",
    label: "Sheet",
    phonetic: "sheet",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "mattress",
    label: "Mattress",
    phonetic: "mat-tress",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "duvet",
    label: "Duvet",
    phonetic: "doo-vay",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "pillowcase",
    label: "Pillowcase",
    phonetic: "pil-low-case",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "comforter",
    label: "Comforter",
    phonetic: "com-fort-er",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "cushion",
    label: "Cushion",
    phonetic: "cush-ion",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1579656592043-a2e727a0062a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "bed-frame",
    label: "Bed Frame",
    phonetic: "bed-frame",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "headboard",
    label: "Headboard",
    phonetic: "head-board",
    topic: "bedding",
    img: "https://images.unsplash.com/photo-1540518614846-7ede433c517a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },

  // ── Room Features ──────────────────────────────────────────────────────────
  {
    id: "lamp",
    label: "Lamp",
    phonetic: "lamp",
    topic: "features",
    img: "https://images.unsplash.com/photo-1776476269609-c41ae855bb8e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
    hotspot: { x: "72%", y: "62%" },
  },
  {
    id: "curtain",
    label: "Curtain",
    phonetic: "cur-tain",
    topic: "features",
    img: "https://images.unsplash.com/photo-1528822855841-e8bf3134cdc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "window",
    label: "Window",
    phonetic: "win-dow",
    topic: "features",
    img: "https://images.unsplash.com/photo-1509644851169-2acc08aa25b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "door",
    label: "Door",
    phonetic: "door",
    topic: "features",
    img: "https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "rug",
    label: "Rug",
    phonetic: "rug",
    topic: "features",
    img: "https://images.unsplash.com/photo-1652634213812-f0deeb1de78e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "carpet",
    label: "Carpet",
    phonetic: "car-pet",
    topic: "features",
    img: "https://images.unsplash.com/photo-1562584082-823908f972b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "ceiling-light",
    label: "Ceiling Light",
    phonetic: "cei-ling-light",
    topic: "features",
    img: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "light-switch",
    label: "Light Switch",
    phonetic: "light-switch",
    topic: "features",
    img: "https://images.unsplash.com/photo-1558002038-1055907df827?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "blinds",
    label: "Blinds",
    phonetic: "blinds",
    topic: "features",
    img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "outlet",
    label: "Outlet",
    phonetic: "out-let",
    topic: "features",
    img: "https://images.unsplash.com/photo-1544717305-2782549b5136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },

  // ── Bedroom Objects ────────────────────────────────────────────────────────
  {
    id: "alarm-clock",
    label: "Alarm Clock",
    phonetic: "a-larm-clock",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "picture-frame",
    label: "Picture Frame",
    phonetic: "pic-ture-frame",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "clock",
    label: "Clock",
    phonetic: "clock",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "plant",
    label: "Plant",
    phonetic: "plant",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "vase",
    label: "Vase",
    phonetic: "vase",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "candle",
    label: "Candle",
    phonetic: "can-dle",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1603006905003-be475563bc59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "calendar",
    label: "Calendar",
    phonetic: "cal-en-dar",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "tissue-box",
    label: "Tissue Box",
    phonetic: "tis-sue-box",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "laundry-basket",
    label: "Laundry Basket",
    phonetic: "laun-dry-bas-ket",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "hanger",
    label: "Hanger",
    phonetic: "hang-er",
    topic: "objects",
    img: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },

  // ── Personal Items ─────────────────────────────────────────────────────────
  {
    id: "pajamas",
    label: "Pajamas",
    phonetic: "pa-ja-mas",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "slippers",
    label: "Slippers",
    phonetic: "slip-pers",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "robe",
    label: "Robe",
    phonetic: "robe",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1544441893-675973e31985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "poster",
    label: "Poster",
    phonetic: "pos-ter",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "books",
    label: "Books",
    phonetic: "books",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "photo-album",
    label: "Photo Album",
    phonetic: "pho-to-al-bum",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "glasses",
    label: "Glasses",
    phonetic: "glas-ses",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "backpack",
    label: "Backpack",
    phonetic: "back-pack",
    topic: "personal",
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },

  // ── Electronics ───────────────────────────────────────────────────────────
  {
    id: "phone",
    label: "Phone",
    phonetic: "phone",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "charger",
    label: "Charger",
    phonetic: "char-ger",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "laptop",
    label: "Laptop",
    phonetic: "lap-top",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "headphones",
    label: "Headphones",
    phonetic: "head-phones",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "tablet",
    label: "Tablet",
    phonetic: "tab-let",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "speaker",
    label: "Speaker",
    phonetic: "speak-er",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "reading-light",
    label: "Reading Light",
    phonetic: "read-ing-light",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
  {
    id: "remote-control",
    label: "Remote Control",
    phonetic: "re-mote-con-trol",
    topic: "electronics",
    img: "https://images.unsplash.com/photo-1593784991095-a205069470b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80",
  },
];

export const BEDROOM_HOTSPOT_WORDS = BEDROOM_VOCABULARY.filter((v) => v.hotspot);
