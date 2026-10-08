import fs from 'node:fs';
const root='output/illustrations/figma-reuse';
const full=process.argv.includes('--full');
const inventory=JSON.parse(fs.readFileSync(`${root}/${full?'full':'focus'}-inventory.json`,'utf8'));
const lessons=fs.readdirSync('src/app/data/usage').filter(f=>f.endsWith('.usage.json')).flatMap(f=>JSON.parse(fs.readFileSync(`src/app/data/usage/${f}`,'utf8')));
const scenes=new Map(lessons.flatMap(l=>l.usage.scenes.map(s=>[`${l.lessonId}-usage-scene-${s.chunkNumber}`,{lessonId:l.lessonId,unitId:l.unitId,...s}])));
const normal=s=>s.normalize('NFKC').replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,' ').trim();
const decisions=[];
for(const image of inventory.images){
 const fileName=image.name.startsWith('IMG|||')?image.name.split('|||')[1]:image.name;
 const match=fileName.match(/^(.+)-(?:usage-)?scene-(\d+)\.(avif|webp|png|jpg|jpeg)$/);
 if(!match){decisions.push({...image,status:'not-scene-record'});continue;}
 const sceneId=`${match[1]}-usage-scene-${match[2]}`;
 const scene=scenes.get(sceneId);
 if(!scene){decisions.push({...image,sceneId,status:'no-current-scene'});continue;}
 // A filename is not evidence that artwork supports a changed question.
 const same=image.texts.some(t=>normal(t)===normal(scene.scenario));
 const status=!same?'current-context-not-matched':image.imageRefs.length!==1?'ambiguous-image-fill':'candidate-for-visual-review';
 decisions.push({...image,sceneId,status,scene});
}
const candidates=decisions.filter(d=>d.status==='candidate-for-visual-review');
const summary=Object.fromEntries([...new Set(decisions.map(d=>d.status))].map(s=>[s,decisions.filter(d=>d.status===s).length]));
fs.writeFileSync(`${root}/${full?'full-':''}matching-decisions.json`,JSON.stringify({summary,decisions},null,2));
fs.writeFileSync(`${root}/${full?'full-':''}scene-candidates.json`,JSON.stringify(candidates,null,2));
console.log(JSON.stringify({summary,candidateScenes:new Set(candidates.map(c=>c.sceneId)).size,candidateSources:new Set(candidates.flatMap(c=>c.imageRefs)).size,sample:candidates.slice(0,4).map(c=>({sceneId:c.sceneId,nodeId:c.nodeId,scenario:c.scene.scenario}))}));
