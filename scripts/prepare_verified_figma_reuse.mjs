import fs from 'node:fs';
import crypto from 'node:crypto';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = 'output/illustrations/figma-reuse';
const candidates = JSON.parse(fs.readFileSync(`${root}/visual-review-candidates.json`, 'utf8'));
const readings = JSON.parse(fs.readFileSync(`${root}/reading-review-candidates.json`, 'utf8'));
const inventory = JSON.parse(fs.readFileSync(`${root}/focus-inventory.json`, 'utf8'));
for (const reading of readings) {
  const name = reading.media.imagePath.split('/').at(-1);
  const source = inventory.images.find(i => i.name === name);
  if (!source) throw new Error(`Reading source absent: ${reading.clusterId}`);
  candidates.push({ ...source, kind: 'reading', clusterId: reading.clusterId, text: reading.text,
    localPath: reading.media.imagePath, alt: reading.media.imageAlt,
    sourceFile: `public/${reading.media.imagePath.replace(/^\.\//, '')}` });
}
// Recorded after inspecting the original source contact sheets, not inferred from filenames.
const withheld = new Map([
  [12, 'Empty desks do not depict eight students.'],
  [17, 'Fourteen figures do not depict thirteen people.'],
  [22, 'Twelve plates do not depict eighteen plates.'],
  [23, 'Twenty-one figures do not depict nineteen people.'],
  [24, 'The full seat count cannot be established from this view.'],
  [25, 'The student count cannot be established unambiguously.'],
  [26, 'An open book does not establish forty pages.'],
  [27, 'Unlabelled coin stacks do not establish fifty pounds.'],
  [29, 'An age numeral reveals the assessed answer; no grandfather is shown.'],
  [30, 'Overlapping cards do not establish eighty cards.'],
  [31, 'Unlabelled coin stacks do not establish ninety pounds.'],
  [32, 'The figure count cannot be established unambiguously at phone size.'],
  [33, 'The model does not establish one thousand homes.'],
  [34, 'A model crowd does not establish one million people.'],
  [35, 'Cars do not represent the people in the queue.'],
  [36, 'Cars do not represent the people in the queue.'],
  [37, 'Cars do not represent the people in the queue.'],
  [38, 'Printed page number reveals the assessed answer.'],
  [40, 'Award rosettes do not represent a woman finishing a race.'],
  [41, 'The floor count and person position are ambiguous.'],
  [42, 'Printed lesson number reveals the assessed answer.'],
  [43, 'Labelled cards reveal the assessed ordinal.'],
  [44, 'Overlapping cards do not establish the final lesson position.'],
  [49, 'The combined apple count is visually ambiguous.'],
  [51, 'Two groups of oranges do not demonstrate removal.'],
  [68, 'Fabric samples do not show the rainbow specified in the sentence.'],
  [74, 'A mug does not support a sentence about light walls.'],
  [90, 'A sky does not represent the poster specified in the sentence.'],
]);
const approvedGeometry = new Set([94, 96, 97, 98, 101, 104, 106, 108, 110]);
const geometryAlts = {
  94: 'A round clock, a window with four equal sides, and a sign with three straight sides.',
  96: 'Road signs with five, six, and eight straight sides, arranged from left to right.',
  97: 'A flat yellow figure with five outward points, a round wooden ball, and a solid with equal square faces.',
  98: 'Wooden solids: two circular ends joined by a curved side, a circular base tapering to one point, and triangular faces meeting above a polygon base.',
  101: 'A bending road, an unbending ruler, and folded paper repeatedly changing direction.',
  104: 'A rectangle filled with colored tiles, a rectangular outside boundary, and a transparent box filled with small blocks.',
  106: 'A line joining opposite corners of square paper, a butterfly with matching left and right wings, and a marked corner of a three-sided frame.',
  108: 'A board filled by repeating fitted tiles, a branching tree motif, and a board filled by adjacent triangular pieces.',
  110: 'An artwork assembled from many small colored pieces beside a viewing tube and its reflected multicolored view.',
};
const alts = {
  ten: 'Two articulated wooden hands with all fingers extended.',
  twelve: 'Calendar cards arranged as a complete year.',
  sixty: 'An analog stopwatch with a complete circular dial.',
  fifth: 'A row of weekday cards with one card raised.',
  addition: 'Separate groups of wooden counters beside a joining symbol.',
  subtraction: 'Upright counters beside counters laid down to represent removal.',
  multiplication: 'Wooden beads arranged in equal groups.',
  plus: 'Two groups of wooden blocks beside a joining symbol.',
  orange: 'A knitted hat on a plain tabletop.',
  purple: 'A pen resting on blank paper.',
  lime: 'A vivid yellow-green shirt hanging against a plain background.',
  dull: 'A faded painted wall behind a plain clay jug.',
  pale: 'A softly colored scarf folded on a wooden table.',
  cool: 'A blue ceramic cup against a blue wall.',
  mix: 'Red and blue paint combined into purple paint in a bowl.',
  saturation: 'Fabric samples with intense colors on a plain tabletop.',
};
const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, watch: null } });
let content;
try {
  content = (await server.ssrLoadModule('/src/app/exercises/content/authoredLessonContent.ts')).AUTHORED_LESSON_CONTENT;
} finally { await server.close(); }
const words = new Map(Object.values(content).flatMap(l => l.words.map(w => [w.id, w])));
const usage = fs.readdirSync('src/app/data/usage').filter(f => f.endsWith('.usage.json')).flatMap(f => JSON.parse(fs.readFileSync(`src/app/data/usage/${f}`, 'utf8')));
const scenes = new Map(usage.flatMap(l => l.usage.scenes.map(s => [`${l.lessonId}-usage-scene-${s.chunkNumber}`, s])));
const vectors = JSON.parse(fs.readFileSync('src/app/generated/reviewedUsageIllustrations.json', 'utf8'));
const previousReviews = fs.existsSync(`${root}/content-review.json`) ? JSON.parse(fs.readFileSync(`${root}/content-review.json`, 'utf8')) : [];
const previousByNode = new Map(previousReviews.map(r => [r.nodeId, r]));
const currentReadings = new Map(Object.values(content).flatMap(l => l.clusters.map(c => [c.id, c.microReading.text])));
fs.mkdirSync(`${root}/delivery`, { recursive: true });
const reviews = [], uploads = [];
for (const [index, candidate] of candidates.entries()) {
  let reason = withheld.get(index);
  if (candidate.kind === 'scene') reason = 'The clinical source needs a separate review of the depicted person and all anatomical relationships.';
  if (candidate.kind === 'geometry-scene' && !approvedGeometry.has(index)) reason = 'One or more comparison objects are inaccurate or ambiguous; retain the reviewed vector scene.';
  if (candidate.clusterId === 'colors-primary-bright') reason = 'The canvas omits the painted apple specified by the reading; the real apple is outside the painting.';
  if (candidate.clusterId === 'colors-light-and-optics') reason = 'The image demonstrates a prism rather than the rain-to-rainbow relationship in the reading.';
  const word = words.get(candidate.wordId);
  const sceneId = candidate.kind === 'geometry-scene' ? candidate.name.replace(/-scene-/, '-usage-scene-').replace(/\.avif$/, '') : candidate.sceneId;
  const scene = scenes.get(sceneId);
  const imageAlt = geometryAlts[index] || alts[candidate.wordId] || candidate.alt || vectors[sceneId]?.imageAlt;
  const review = { index, nodeId: candidate.nodeId, sourceRef: candidate.imageRefs[0], kind: candidate.kind,
    wordId: candidate.wordId, clusterId: candidate.clusterId, reviewedText: candidate.text, localPath: candidate.localPath, sceneId,
    reviewedSentence: word?.sentence.full, reviewedScenario: scene?.scenario, reviewedAnswer: scene?.check.expectedAnswer,
    imageAlt, status: reason ? 'withheld' : 'approved', reason: reason || 'Visible objects and visual clues support the current question.' };
  if (!reason) {
    if (!imageAlt || (!word && !scene && !candidate.clusterId)) throw new Error(`Missing content evidence at ${index}`);
    const previous = previousByNode.get(review.nodeId);
    if (previous && (previous.sourceRef !== review.sourceRef ||
        previous.reviewedSentence !== review.reviewedSentence ||
        previous.reviewedScenario !== review.reviewedScenario ||
        previous.reviewedAnswer !== review.reviewedAnswer ||
        previous.reviewedText !== review.reviewedText)) throw new Error(`New content review required: ${review.nodeId}`);
    if (candidate.clusterId && currentReadings.get(candidate.clusterId) !== candidate.text) throw new Error(`New reading review required: ${candidate.clusterId}`);
    // A similar filename or pixel average cannot establish equivalent quantities.
    // Local originals remain intact, but are not approved as fallbacks automatically.
    if (!candidate.localPath && vectors[sceneId]) {
      // Preserve the independently reviewed vector-derived image as a fallback.
      review.imageFallbacks = [{ imagePath: vectors[sceneId].imagePath, imageAlt: vectors[sceneId].imageAlt }];
    }
    const bytes = await sharp(candidate.sourceFile).rotate().resize({ width: 1200, height: 900, fit: 'inside', withoutEnlargement: true }).webp({ quality: 90, effort: 6 }).toBuffer();
    const sha256 = crypto.createHash('sha256').update(bytes).digest('hex');
    const id = candidate.wordId ? `sentence-${candidate.wordId}` : candidate.clusterId ? `reading-${candidate.clusterId}` : sceneId;
    const key = `question-images/v1/${id}/${sha256}.webp`;
    const localFile = `${root}/delivery/${sha256}.webp`;
    if (!fs.existsSync(localFile)) fs.writeFileSync(localFile, bytes);
    review.imagePath = key;
    const meta = await sharp(bytes).metadata();
    uploads.push({ id, key, localFile, sha256, bytes: bytes.length, width: meta.width, height: meta.height, reviewStatus: 'approved-media' });
  }
  reviews.push(review);
}
fs.writeFileSync(`${root}/content-review.json`, JSON.stringify(reviews, null, 2) + '\n');
fs.writeFileSync(`${root}/reviewed-upload-manifest.json`, JSON.stringify(uploads, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: reviews.length, approved: uploads.length, withheld: reviews.filter(r => r.status === 'withheld').length, bytes: uploads.reduce((n, r) => n + r.bytes, 0), vectorFallbacks: reviews.filter(r => r.imageFallbacks?.length).length }));
