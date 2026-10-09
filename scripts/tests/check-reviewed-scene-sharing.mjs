import test from "node:test";
import assert from "node:assert/strict";
import { reviewedMediaEntry } from "../lib/reviewed_scene_media_entry.mjs";
const review={sceneId:'fruits-1-usage-scene-2',sha256:'a'.repeat(64),reviewedScenario:'A melon is being selected.',reviewedQuestion:'Which melon has red flesh?',reviewedAnswer:'Watermelon',imageAlt:'A whole green-striped melon with a cut red-fleshed wedge.',imagePurpose:'word-reference',sharedAssetId:'watermelon-whole-and-wedge'};
test('separate reviewed questions can reuse one immutable image object',()=>{
 const first=reviewedMediaEntry(review);
 const second=reviewedMediaEntry({...review,sceneId:'fruits-2-usage-scene-3',reviewedQuestion:'Which melon is cut into a wedge?'});
 assert.equal(first.imagePath,second.imagePath);assert.notEqual(first.reviewedQuestion,second.reviewedQuestion);
});
test('sharing never replaces any existing identity or description',()=>{
 const existing=reviewedMediaEntry(review);
 assert.throws(()=>reviewedMediaEntry({...review,imageAlt:'A different description.'},{[review.sceneId]:existing}),/Preserving/);
 assert.throws(()=>reviewedMediaEntry(review,{}, {[review.sceneId]:existing}),/Preserving/);
});
test('shared asset names and purpose cannot escape the verified asset namespace',()=>{
 assert.throws(()=>reviewedMediaEntry({...review,sharedAssetId:'../other'}),/Invalid/);
 assert.throws(()=>reviewedMediaEntry({...review,imagePurpose:'unsupported'}),/Unsupported/);
 assert.throws(()=>reviewedMediaEntry({...review,sharedAssetId:undefined}),/descriptive/);
});
