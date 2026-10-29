const fs = require('fs');

const pipelinePath = 'output/illustrations/generation_batches_pipeline.json';
const pipeline = JSON.parse(fs.readFileSync(pipelinePath, 'utf8'));
const b2 = pipeline.batches[2]; // Basic Emotions

const emotionPrompts = {
  'basic-emotions-1-usage-scene-1': 'Bright, authentic portrait of an adult man beaming with genuine joy and happiness after receiving good news. A bright, warm smile, relaxed eyes, and natural joyful posture in a clean, modern sunlit room. Crisp photography, tight medium shot, clear readable facial expression. Zero women, zero text, zero brand logos.',
  'basic-emotions-1-usage-scene-2': 'Dignified portrait of an adult man feeling proud and accomplished. Confident, upright posture with a warm, satisfied smile, holding a clean plain framed certificate or award. Clean professional office setting with soft natural daylight. Focused on the feeling of achievement. Zero women, zero text leaks, zero brand logos.',
  'basic-emotions-1-usage-scene-3': 'A candid, bright photograph of an adult man looking genuinely amused and chuckling at something funny. Crinkling eyes, spontaneous cheerful laugh, holding a clean coffee mug. Clean modern kitchen or breakroom setting. Clear unmistakable expression of amusement. Zero women, zero text, zero brand logos.',
  'basic-emotions-1-usage-scene-4': 'Touching, inspiring portrait of an adult man looking hopeful. He looks upward toward gentle morning window light with an optimistic, subtle smile and a look of renewal and belief that things will improve. Clean, serene minimalist room. Zero women, zero text, zero brand logos.',
  'basic-emotions-1-usage-scene-5': 'Intense, clear photographic depiction of an adult man looking scared and startled. Wide eyes, raised eyebrows, cautious defensive hand gesture in reaction to an unexpected loud noise or danger. Clean, sharp dramatic lighting, focused solely on the fearful expression. Zero women, zero text, zero brand logos.',
  'basic-emotions-2-usage-scene-1': 'Clear expressive portrait of an adult man looking disappointed. Slumped shoulders, downturned lips, looking down at a blank paper letter with a sad, disheartened expression after a missed opportunity. Clean office setting with soft cool lighting. Zero women, zero text, zero brand logos.',
  'basic-emotions-2-usage-scene-2': 'Relatable, clear scene of an adult man looking completely bored during a long wait. He rests his chin in his hand, eyes glazed and expressionless, tapping a pen on a clean table beside a ticking wall clock. Clean minimalist waiting room. Unmistakable boredom. Zero women, zero text, zero brand logos.',
  'basic-emotions-2-usage-scene-3': 'Authentic close-up photograph of an adult man looking exhausted and tired after a long work shift. Heavy drooping eyelids, rubbing his temples with his hand, sitting at a clean desk beside an empty coffee mug. Soft ambient lighting, clearly conveying fatigue and need for sleep. Zero women, zero text, zero brand logos.',
  'basic-emotions-2-usage-scene-4': 'Engaging portrait of an adult man looking curious and intrigued. One raised eyebrow, tilted head, examining an antique brass compass or intricate mechanical gear on a wooden desk with intense, focused interest. Warm study lighting, sharp detail. Zero women, zero text, zero brand logos.',
  'basic-emotions-2-usage-scene-5': 'Clean, subtle portrait of an adult man looking indifferent and unbothered. A slight neutral shrug, flat neutral mouth, relaxed eyes showing complete lack of interest or concern about a minor matter. Spotless neutral background, crisp lighting. Zero women, zero text, zero brand logos.',
  'basic-emotions-3-usage-scene-1': 'Expressive scene of an adult man feeling hungry. He looks eagerly toward a fresh loaf of bread and clean soup bowl on a table while his hand gently rests on his stomach with an appetizing, longing expression. Bright clean kitchen dining setting. Zero women, zero text, zero brand logos.',
  'basic-emotions-3-usage-scene-2': 'Clear photograph of an adult man feeling cold indoors. He wears a warm knit sweater and scarf, shivering slightly with arms wrapped around himself, cupping a steaming ceramic mug with both hands for warmth. Soft cool winter window light in a clean room. Zero women, zero text, zero brand logos.',
  'basic-emotions-3-usage-scene-3': 'Carefully staged portrait of an adult man feeling nauseous and unwell. Pale, uncomfortable facial expression, one hand on his upper stomach and one hand holding a glass of clear water on a clean table, looking uneasy. Clean, hygienic, dignified medical/home setting. Zero women, zero text, zero brand logos.',
  'basic-emotions-3-usage-scene-4': 'Peaceful, serene scene of an adult man feeling completely comfortable. Leaning back comfortably in a plush modern ergonomic armchair with a relaxed, tranquil smile, hands resting easily, completely at ease in a tidy, cozy living room. Bright natural daylight. Zero women, zero text, zero brand logos.'
};

let count = 0;
b2.items.forEach(item => {
  if (emotionPrompts[item.sceneId]) {
    item.optimizedPrompt = emotionPrompts[item.sceneId];
    count++;
  }
});

fs.writeFileSync(pipelinePath, JSON.stringify(pipeline, null, 2), 'utf8');
console.log(`Successfully updated ${count}/14 items in Batch 2 (Basic Emotions) with men-only/expression-focused prompts.`);
