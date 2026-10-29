const fs = require('fs');

const f1 = JSON.parse(fs.readFileSync('src/app/generated/reviewedFigmaObjectScenes.json', 'utf8'));
const f2 = JSON.parse(fs.readFileSync('src/app/generated/reviewedFigmaQuestionMedia.json', 'utf8'));
const f3 = JSON.parse(fs.readFileSync('src/app/generated/reviewedUsageIllustrations.json', 'utf8'));

const allReviewedKeys = new Set([
  ...Object.keys(f1),
  ...Object.keys(f2.scenes || f2),
  ...Object.keys(f3)
]);

console.log('Total reviewed scene keys in app:', allReviewedKeys.size);

// Check if any emotions exist in reviewed
const emotionKeys = [...allReviewedKeys].filter(k => k.includes('emotion') || k.includes('feel'));
console.log('Emotion keys in reviewed:', emotionKeys);

// Check word-images topics
const wordImages = fs.readdirSync('public/word-images');
const emotionTopics = wordImages.filter(w => w.includes('emotion') || w.includes('feel'));
console.log('Emotion topics in public/word-images:', emotionTopics);

emotionTopics.forEach(t => {
  const files = fs.readdirSync('public/word-images/' + t);
  console.log(`Images in public/word-images/${t}:`, files);
});

// Check figma reuse matching decisions
if (fs.existsSync('output/illustrations/figma-reuse/matching-decisions.json')) {
  const matches = JSON.parse(fs.readFileSync('output/illustrations/figma-reuse/matching-decisions.json', 'utf8'));
  const emotionMatches = Object.keys(matches).filter(k => k.includes('emotion'));
  console.log('Emotion matches in figma-reuse:', emotionMatches.length);
}
