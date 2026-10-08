import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const root = 'output/illustrations/batch-01';
const delivery = path.join(root, 'delivery');
fs.mkdirSync(delivery, { recursive: true });
const scenes = JSON.parse(fs.readFileSync(path.join(root, 'scenes.json'), 'utf8'));
const descriptions = {
  Red:'the color of a ripe tomato',Blue:'the color of a clear daytime sky',Yellow:'the color of a ripe lemon',Green:'the color of fresh grass',Orange:'the color of ripe citrus peel',Purple:'the color of many violet petals',Pink:'a light rosy flower color',Brown:'the color of natural wood bark',Black:'the appearance of near-total darkness',White:'the color of fresh snow',Cyan:'a bright blue-green sample',Magenta:'a vivid reddish-purple sample',Lime:'a bright yellow-green sample',Teal:'a dark blue-green sample',Indigo:'a deep blue-violet sample',Violet:'a blue-purple sample',Coral:'a warm red-orange sample',Salmon:'a pale reddish-orange sample',Turquoise:'a bright greenish-blue sample',Lavender:'a pale purple sample',Light:'a high-lightness gray-blue sample',Dark:'a very low-lightness blue sample',Bright:'a high-intensity rosy sample',Dull:'a low-intensity gray-rose sample',Vivid:'a strongly saturated rosy sample',Pale:'a low-color-intensity light rose sample',Deep:'a dark rich rosy sample',Warm:'a reddish-yellow sample',Cool:'a blue-toned sample',Neutral:'a gray-beige sample',
  Circle:'a flat round disc',Square:'a flat figure with four equal sides',Triangle:'a flat figure with three sides',Rectangle:'a wide four-sided flat figure',Oval:'a stretched round flat figure',Diamond:'a flat four-sided figure resting on one point',Pentagon:'a five-sided flat figure',Hexagon:'a six-sided flat figure',Octagon:'an eight-sided flat figure',Star:'a flat figure with five outward points',Sphere:'a round ball with curved surface lines',Cube:'a solid with equal square faces',Cylinder:'a solid with two circular ends and a curved side',Cone:'a solid tapering from a circular base to one point',Pyramid:'a solid with a polygon base and triangular sides meeting at an apex',Prism:'a solid with matching triangular ends',Cuboid:'a solid with rectangular faces',Hemisphere:'half of a ball with a flat circular base',Torus:'a rounded ring with a central hole',Tetrahedron:'a solid formed by four triangular faces',Line:'one narrow horizontal mark',Curve:'one bending mark',Straight:'one unbending horizontal mark',Zigzag:'a mark repeatedly changing direction',Spiral:'a curve winding outward around a centre',
  'Right Angle':'two segments meeting at a square corner','Acute Angle':'two segments enclosing less than a square corner','Obtuse Angle':'two segments enclosing more than a square corner',Parallel:'two separated lines that stay the same distance apart',Perpendicular:'two lines crossing at a square corner',Area:'a rectangle filled with small squares',Perimeter:'only the outside boundary of a rectangle',Volume:'a solid divided into small blocks',Radius:'a segment from a circle centre to its boundary',Diameter:'a segment across a circle through its centre',Circumference:'the curved boundary of a circle',Diagonal:'a segment joining opposite corners of a square',Symmetry:'a triangular figure divided into matching left and right halves',Vertex:'a dot marking the meeting point of two sides',Edge:'a highlighted straight boundary between two faces of a solid',Repeat:'the same small figure appearing several times',Sequence:'bars arranged in increasing height',Pattern:'alternating small squares and round figures',Tessellation:'adjacent tiles filling a square without gaps',Fractal:'a branching figure with the same forked structure at several sizes',Grid:'crossing horizontal and vertical lines forming cells',Array:'separate round objects arranged in equal rows',Matrix:'numbers arranged in rows and columns',Mosaic:'small square pieces forming a larger diamond motif',Kaleidoscope:'a radial motif with repeating reflected segments',
  Mix:'two differently colored paint circles overlapping to produce a third color',Blend:'a smooth transition between neighboring colors',Shade:'versions of one color progressing from lighter to darker',Tint:'versions of one color progressing toward white',Hue:'three equally strong different colors',Saturation:'versions of blue progressing from muted gray-blue to vivid blue',Gradient:'a continuous transition across several colors',Rainbow:'seven nested colored arcs in red, orange, yellow, green, blue, indigo and purple order',Spectrum:'adjacent color bands spanning red to purple',Pigment:'colored grains heaped in a shallow dish',
};
const reviewed = [];
const comparisons = [];
for (const scene of scenes) {
  const source = path.join(root, scene.id + '.png');
  const png = fs.readFileSync(source);
  const webp = await sharp(png).webp({ lossless: true, effort: 6 }).toBuffer();
  const avif = await sharp(png).avif({ quality: 90, effort: 5, chromaSubsampling: '4:4:4' }).toBuffer();
  const decodedPng = await sharp(png).ensureAlpha().raw().toBuffer();
  const decodedWebp = await sharp(webp).ensureAlpha().raw().toBuffer();
  if (!decodedPng.equals(decodedWebp)) throw new Error(`Lossless WebP changed pixels: ${scene.id}`);
  const metadata = await sharp(webp).metadata();
  if (metadata.width !== 1200 || metadata.height !== 675 || metadata.format !== 'webp') throw new Error(`Invalid delivery format: ${scene.id}`);
  const hash = crypto.createHash('sha256').update(webp).digest('hex');
  const file = path.join(delivery, `${scene.id}.${hash.slice(0, 16)}.webp`);
  fs.writeFileSync(file, webp);
  const sourceLessons = JSON.parse(fs.readFileSync(`src/app/data/usage/${scene.unitId}.usage.json`, 'utf8'));
  const lessonId = scene.id.replace(/-usage-scene-\d+$/, '');
  const chunk = Number(scene.id.match(/-usage-scene-(\d+)$/)[1]);
  const authored = sourceLessons.find(x => x.lessonId === lessonId)?.usage.scenes.find(x => x.chunkNumber === chunk);
  if (!authored || authored.scenario !== scene.scenario || authored.check.expectedAnswer !== scene.expectedAnswer) throw new Error(`Source drift: ${scene.id}`);
  const words = Array.isArray(authored.targetWords) ? authored.targetWords : [authored.targetWords];
  let alt;
  if (scene.unitId === 'colors') alt = 'Design samples, left to right: ' + words.map(x => descriptions[x] || x.toLowerCase()).join('; ') + '. Each sample has equal visual emphasis.';
  else if (scene.unitId === 'shapes-geometry') alt = 'Geometric examples, left to right: ' + words.map(x => descriptions[x]).join('; ') + '.';
  else if (scene.unitId === 'prepositions-of-place') alt = chunk === 1 ? 'A folder sits inside a desk tray, a notebook lies on the desktop, and a bag is below the desk.' : 'A printer stands behind a chair. A low table is in front of the chair, and a bin is beside the chair.';
  else {
    const countAlts = [
      'Three office trays contain 1, 2 and 3 folders. A clipboard is beside the third tray.',
      'Three trays contain 4, 5 and 6 cups. The kettle is closest to the middle tray.',
      'Three separate groups contain 7, 8 and 9 boxes. The third group is beside an open door.',
      'Three ticket stacks contain 10, 11 and 12 individually visible tickets, ordered left to right.',
      'Three notebook sets contain 13, 14 and 15 individually visible notebooks, ordered left to right.',
    ];
    if (lessonId === 'numbers-counting-1') alt = countAlts[chunk - 1];
    else if (lessonId === 'numbers-counting-3' && chunk === 1) alt = 'Three adults queue toward a service counter on the left. The middle adult holds a blue folder.';
    else {
      const digits = scene.shapes.filter(x => x.type === 'text').map(x => x.text);
      const marker = scene.shapes.find(x => x.name === 'selected-double-border');
      const selected = marker && scene.shapes.find(x => x.type === 'text' && x.x >= marker.x - 20 && x.x < marker.x + marker.w);
      alt = 'Displays, left to right: ' + digits.join('; ') + '.' + (selected ? ` The ${selected.text} display has a double border.` : '');
    }
  }
  if (!alt || alt.includes('undefined')) throw new Error(`Missing description: ${scene.id}`);
  const review = { sceneId: scene.id, lessonId, chunkNumber: chunk, unitId: scene.unitId, reviewedScenario: scene.scenario,
    reviewedAnswer: scene.expectedAnswer, imageAlt: alt, sha256: hash,
    key: `usage-illustrations/v1/${scene.id}/${hash}.webp`, localFile: file.replaceAll('\\', '/'),
    bytes: webp.length, width: 1200, height: 675, contentType: 'image/webp',
    reviewStatus: 'approved-media', reviewScope: 'Semantic comparison with authored context; complete-object counts, geometry/color meaning, selection shape cues, image boundaries and labels. Not a full WCAG conformance or learner-outcome audit.' };
  reviewed.push(review);
  comparisons.push({ sceneId: scene.id, pngBytes: png.length, webpBytes: webp.length, avifBytes: avif.length, webpDecodedPixelsIdentical: true });
}
const report = { reviewed: reviewed.length, format: 'lossless-webp', reason: 'Exact pixel/color preservation for assessed colors, numerals and line art; broad app compatibility.',
  pngBytes: comparisons.reduce((n,x)=>n+x.pngBytes,0), webpBytes: comparisons.reduce((n,x)=>n+x.webpBytes,0), avifBytes: comparisons.reduce((n,x)=>n+x.avifBytes,0), comparisons };
fs.writeFileSync(path.join(root, 'reviewed-upload-manifest.json'), JSON.stringify(reviewed, null, 2) + '\n');
fs.writeFileSync(path.join(root, 'format-review.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ reviewed: report.reviewed, pngBytes: report.pngBytes, webpBytes: report.webpBytes, avifBytes: report.avifBytes, format: report.format }));
