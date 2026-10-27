import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {imageKindOf} from './lib/image-format.mjs';
const require=createRequire(import.meta.url);
require('./lib/env.cjs').loadEnv();
const {createClient}=require('./lib/r2.cjs');
const root='output/illustrations/sentence-repairs-2026-10-26';
const manifest=JSON.parse(fs.readFileSync(root+'/reviewed-upload-manifest.json','utf8'));
const dry=process.argv.includes('--dry-run'),verifyOnly=process.argv.includes('--verify-only'),link=process.argv.includes('--link');
if(dry&&link)throw new Error('Dry run cannot link');
const publicBase=(process.env.VITE_ASSET_BASE_URL??'').replace(/\/+$/u,'');
if(!publicBase||new URL(publicBase).protocol!=='https:')throw new Error('HTTPS public base required');
const registryPath='src/app/generated/reviewedExactSentenceMedia.json';
const before=JSON.parse(fs.readFileSync(registryPath,'utf8'));
if(manifest.length!==13||new Set(manifest.map(x=>x.id)).size!==13)throw new Error('Expected 13 unique reviewed images');
for(const e of manifest){
 const file=path.resolve(e.localFile),allowed=path.resolve(root+'/delivery')+path.sep;
 if(!file.startsWith(allowed)||e.reviewStatus!=='approved-user-supplied'||!/^question-images\/v3\/[a-z0-9-]+\/[a-f0-9]{64}\.webp$/u.test(e.key))throw new Error('Invalid reviewed entry: '+e.id);
 const bytes=fs.readFileSync(file);
 if(bytes.length!==e.bytes||createHash('sha256').update(bytes).digest('hex')!==e.sha256||imageKindOf(bytes.subarray(0,16))!=='webp')throw new Error('Invalid delivery bytes: '+e.id);
 if(createHash('sha256').update(fs.readFileSync(e.sourceFile)).digest('hex')!==e.sourceSha256)throw new Error('Original source changed: '+e.id);
 const conflict=Object.values(before).find(x=>x.wordId===e.wordId&&x.sentence===e.sentence&&x.imagePath!==e.key);
 if(conflict)throw new Error('Existing exact binding requires review: '+e.id);
 if(before[e.id]&&JSON.stringify(before[e.id])!==JSON.stringify({wordId:e.wordId,sentence:e.sentence,imagePath:e.key,imageAlt:e.imageAlt}))throw new Error('Existing ID differs: '+e.id);
}
if(dry){console.log(JSON.stringify({mode:'dry-run',files:manifest.length,bytes:manifest.reduce((n,x)=>n+x.bytes,0),writes:0,existingBindingsPreserved:Object.keys(before).length}));process.exit(0);}
const client=createClient(),receipts=[];let uploaded=0,present=0;
for(const e of manifest){
 const bytes=fs.readFileSync(e.localFile),prior=await client.head(e.key);
 if(!prior){if(verifyOnly)throw new Error('Remote missing: '+e.id);if(await client.putIfAbsent(e.key,bytes,{contentType:'image/webp'}))uploaded++;else present++;}else present++;
 const [headers,remote]=await Promise.all([client.head(e.key),client.get(e.key)]);
 if(!headers||headers['content-type']?.split(';')[0]!=='image/webp'||Number(headers['content-length'])!==bytes.length||!remote?.equals(bytes))throw new Error('R2 verification failed: '+e.id);
 const url=publicBase+'/'+e.key,response=await fetch(url,{signal:AbortSignal.timeout(30000)}),cdn=Buffer.from(await response.arrayBuffer());
 if(!response.ok||response.headers.get('content-type')?.split(';')[0]!=='image/webp'||!cdn.equals(bytes))throw new Error('Public verification failed: '+e.id+' ('+response.status+')');
 receipts.push({id:e.id,key:e.key,sha256:e.sha256,bytes:e.bytes,url,verified:true});
 fs.writeFileSync(root+'/r2-upload-receipt.json',JSON.stringify({uploaded,present,verified:receipts.length,assets:receipts},null,2)+'\n');
 console.log('Verified '+receipts.length+'/13: '+e.wordId);
}
if(link){
 // Re-read after uploads so other completed imports remain intact.
 const current=JSON.parse(fs.readFileSync(registryPath,'utf8'));
 for(const [id,value]of Object.entries(before))if(JSON.stringify(current[id])!==JSON.stringify(value))throw new Error('Existing registry entry changed during import: '+id);
 for(const e of manifest){
  if(Object.values(current).some(x=>x.wordId===e.wordId&&x.sentence===e.sentence&&x.imagePath!==e.key))throw new Error('Concurrent binding conflict: '+e.id);
  current[e.id]={wordId:e.wordId,sentence:e.sentence,imagePath:e.key,imageAlt:e.imageAlt};
 }
 fs.writeFileSync(registryPath,JSON.stringify(current,null,2)+'\n');
 console.log('Linked 13 verified exact sentences; preserved '+Object.keys(before).length+' existing entries.');
}
console.log(JSON.stringify({uploaded,present,verified:receipts.length,linked:link?13:0,deleted:0,overwritten:0}));
