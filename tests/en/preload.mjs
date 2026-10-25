import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash,webcrypto} from 'node:crypto';
import {createAssetLoader} from '../src/preload.js';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const data=new Map([
 ['assets/art/original/mapa_joc.webp',Buffer.from('original town drawing')],
 ['assets/art/original/hima3.webp',Buffer.from('original sunflower drawing')],
 ['assets/narration/sample.mp3',Buffer.from('complete narration recording')],
 ['assets/music/sample.m4a',Buffer.from('complete original music')],
 ['game.js',Buffer.from('window.testRuntimeStarted=(window.testRuntimeStarted||0)+1;')],
 ['style.css',Buffer.from('body { color: #342c25; }')]
]);
const manifest=Object.fromEntries([...data].map(([path,bytes])=>[path,{bytes:bytes.length,sha256:hash(bytes)}]));
const baseURL='https://himawari-test.invalid/';
const cache=()=>({values:new Map(),writes:0,async match(key){return this.values.get(key)?.clone();},async put(key,response){this.writes++;this.values.set(key,response.clone());},async delete(key){return this.values.delete(key);}});
const pathOf=url=>new URL(url).pathname.slice(1);
let requests=[],active=0,peak=0;
function fetcher(url){requests.push(pathOf(url));assert.equal(new URL(url).origin,new URL(baseURL).origin);active++;peak=Math.max(peak,active);return new Promise(resolve=>setImmediate(()=>{active--;resolve(new Response(data.get(pathOf(url))));}));}
let progress=[];const saved=cache();
const loader=options=>createAssetLoader({manifest,baseURL,fetcher,openCache:()=>saved,createURL:()=>`blob:local-${Math.random()}`,onProgress:s=>progress.push(s),...options});
const first=await loader().run();assert.equal(first.complete,true);assert.equal(requests.length,data.size);assert.equal(first.urls.size,data.size);assert.equal(peak,3);assert.equal(progress.at(-1).bytes,progress.at(-1).total);assert.equal(progress.at(-1).files,data.size);assert.ok(progress.some(s=>s.artworkReady));assert.ok(requests.slice(0,2).every(path=>path.endsWith('.webp')));
requests=[];const second=await loader().run();assert.equal(second.complete,true);assert.equal(requests.length,0);assert.equal(second.fromCache,data.size,'A return visit should require no media downloads');
// A failed request must keep the other complete assets for Retry.
const retryCache=cache();let failed=true,attempts=[];
const retryLoader=loader({openCache:()=>retryCache,fetcher:async url=>{const path=pathOf(url);attempts.push(path);return failed&&path==='assets/music/sample.m4a'?new Response('broken',{status:503}):new Response(data.get(path));}});
let result=await retryLoader.run();assert.equal(result.complete,false);assert.equal(result.failures.length,1);assert.equal(result.urls.size,data.size-1);
attempts=[];failed=false;result=await retryLoader.run();assert.equal(result.complete,true);assert.deepEqual(attempts,['assets/music/sample.m4a']);
// Closing the tab mid-download can reuse complete files on the next visit.
const recovered=await loader({openCache:()=>retryCache,fetcher:()=>{throw Error('No network expected');}}).run();assert.equal(recovered.fromCache,data.size);
// Cache entries are integrity checked; corruption is repaired from the network.
const corruptKey=[...saved.values.keys()].find(key=>pathOf(key)==='assets/art/original/mapa_joc.webp');saved.values.set(corruptKey,new Response('damaged'));requests=[];
assert.equal((await loader().run()).complete,true);assert.deepEqual(requests,['assets/art/original/mapa_joc.webp']);
// Updated assets use a content-specific cache key; unchanged assets are reused.
const old=data.get('assets/music/sample.m4a'),replacement=Buffer.from('updated original music bytes');data.set('assets/music/sample.m4a',replacement);
const updated={...manifest,'assets/music/sample.m4a':{bytes:replacement.length,sha256:hash(replacement)}};requests=[];
assert.equal((await loader({manifest:updated}).run()).complete,true);assert.deepEqual(requests,['assets/music/sample.m4a']);data.set('assets/music/sample.m4a',old);
// Private browsing or a full storage quota must not prevent downloading/play.
requests=[];result=await loader({openCache:()=>{throw Error('Storage denied');}}).run();assert.equal(result.complete,true);assert.equal(result.cacheWritable,false);assert.equal(requests.length,data.size);
const quota=cache();quota.put=async()=>{throw new Error('Quota exceeded');};requests=[];result=await loader({openCache:()=>quota}).run();assert.equal(result.complete,true);assert.equal(result.cacheWritable,false);assert.equal(result.urls.size,data.size);
// An incomplete response is never marked ready or retained as a valid file.
result=await loader({openCache:()=>cache(),fetcher:async url=>new Response(pathOf(url)==='game.js'?Buffer.from('incomplete script'):data.get(pathOf(url)))}).run();assert.equal(result.complete,false);assert.equal(result.urls.has('game.js'),false);
// Silent requests time out without imposing a short total download deadline.
result=await loader({manifest:{'game.js':manifest['game.js']},openCache:()=>null,stallMilliseconds:15,fetcher:(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))))}).run();assert.equal(result.complete,false);assert.equal(result.failures[0].message,'Connection stalled');
// Streamed bytes report actual progress, rather than an arbitrary timer.
const source=data.get('game.js');progress=[];
result=await loader({manifest:{'game.js':manifest['game.js']},openCache:()=>null,fetcher:async()=>new Response(new ReadableStream({async start(controller){controller.enqueue(source.subarray(0,8));await new Promise(r=>setImmediate(r));controller.enqueue(source.subarray(8));controller.close();}}))}).run();assert.equal(result.complete,true);assert.ok(progress.some(s=>s.bytes===8));assert.equal(progress.at(-1).bytes,source.length);

// UI integration: the game remains hidden until media, styles, and runtime are
// ready. Retry fetches only failed files and neither reads nor changes saves.
const {JSDOM}=await import(process.env.HIMAWARI_TEST_DEPENDENCIES?process.env.HIMAWARI_TEST_DEPENDENCIES+'/jsdom/lib/api.js':'jsdom');
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const sourceCode=fs.readFileSync(new URL('../src/preload.js',import.meta.url),'utf8').replace(/\bexport (?=(?:const|function|class|async)\b)/g,'');
async function browserFixture({local=false,cacheDenied=false}={}){
 const dom=new JSDOM(html,{url:local?'file:///game/index.html':baseURL,runScripts:'outside-only'}),w=dom.window,d=w.document;const stored=cache(),blobs=new Map();let calls=[],networkFail=!local;
 w.Blob=Blob;w.Response=Response;w.AbortController=AbortController;Object.defineProperty(w.crypto,'subtle',{value:webcrypto.subtle});
 w.caches={open:async()=>{if(cacheDenied)throw Error('Storage denied');return stored;}};
 w.URL.createObjectURL=blob=>{const key='blob:fixture-'+blobs.size;blobs.set(key,blob);return key;};
 w.fetch=async url=>{const path=pathOf(url);calls.push(path);return networkFail&&path==='assets/narration/sample.mp3'?new Response('error',{status:503}):new Response(data.get(path));};
 const originalAppend=d.body.append.bind(d.body);d.body.append=element=>{originalAppend(element);if(element.tagName==='SCRIPT'){setImmediate(async()=>{if(local)w.testRuntimeStarted=1;else w.eval(await blobs.get(element.src).text());element.dispatchEvent(new w.Event('load'));});}};
 new w.MutationObserver(records=>{if(records.some(r=>r.attributeName==='href'))d.getElementById('game-style').dispatchEvent(new w.Event('load'));}).observe(d.getElementById('game-style'),{attributes:true});
 w.localStorage?.setItem('himawari-existing-save','preserve this');
 w.eval(sourceCode+'\nwindow.runPreloader=bootPreloader;');
 await w.runPreloader(manifest);
 if(!local){assert.equal(w.testRuntimeStarted,undefined);assert.equal(d.getElementById('app').hidden,true);assert.equal(d.getElementById('loading-retry').hidden,false);assert.equal(d.getElementById('game-loading').dataset.error,'true');
  calls=[];networkFail=false;d.getElementById('loading-retry').click();
  const deadline=Date.now()+3000;while(!d.getElementById('game-loading').hidden&&Date.now()<deadline)await new Promise(r=>setTimeout(r,5));assert.equal(d.getElementById('game-loading').hidden,true,'Retry must complete before asset URLs are consumed');
  assert.deepEqual(calls,['assets/narration/sample.mp3']);assert.equal(w.HIMAWARI_ASSET('assets/art/original/mapa_joc.webp').startsWith('blob:'),true);
  assert.equal(w.localStorage.getItem('himawari-existing-save'),'preserve this');
 }
 assert.equal(w.testRuntimeStarted,1);assert.equal(d.getElementById('game-loading').hidden,true);assert.equal(d.getElementById('app').hidden,false);assert.equal(d.getElementById('app').inert,false);
 if(cacheDenied)assert.match(d.querySelector('.cover-content').textContent,/cache|缓存/);
 if(local)assert.equal(calls.length,0);
 dom.window.close();
}
await browserFixture();await browserFixture({cacheDenied:true});
// A file URL has no storage origin in jsdom, so exercise local boot separately.
{
 const dom=new JSDOM(html,{url:'file:///game/index.html',runScripts:'outside-only'}),w=dom.window,d=w.document;let scriptPath;
 d.body.append=element=>{scriptPath=element.src;setImmediate(()=>element.dispatchEvent(new w.Event('load')));};
 w.eval(sourceCode+'\nwindow.runPreloader=bootPreloader;');await w.runPreloader(manifest);assert.equal(scriptPath,'file:///game/game.js');assert.equal(d.getElementById('game-loading').hidden,true);assert.equal(d.getElementById('app').hidden,false);dom.window.close();
}
// The generated bootstrap must include exactly the assets in this edition,
// and portable HTML must bypass all networking without hiding the game.
const actual=JSON.parse(fs.readFileSync(new URL('../content/preload-assets.json',import.meta.url)));
for(const [path,entry] of Object.entries(actual)){const bytes=fs.readFileSync(new URL('../'+path,import.meta.url));assert.equal(bytes.length,entry.bytes);assert.equal(hash(bytes),entry.sha256);}
assert.equal(Object.keys(actual).filter(p=>p.startsWith('assets/art/original/')&&p.endsWith('.webp')).length,25);const scenes=JSON.parse(fs.readFileSync(new URL('../content/scene-illustrations.json',import.meta.url)));assert.equal(Object.keys(actual).filter(p=>p.startsWith('assets/art/scenes/')).length,Object.keys(scenes).length);assert.ok(Object.keys(actual).some(p=>p.endsWith('.mp3')));assert.equal(Object.keys(actual).filter(p=>p.endsWith('.m4a')).length,13);assert.ok(actual['game.js']&&actual['style.css']);
const report={passed:true,completePreload:true,actualByteProgress:true,boundedConcurrency:3,persistentCache:true,noRepeatDownloadsOnReturn:true,retryKeepsCompletedFiles:true,interruptedDownloadRecovery:true,hashValidation:true,versionSpecificCache:true,quotaFallback:true,stalledRequestRecovery:true,gameStartsOnlyAfterComplete:true,existingSavesUntouched:true,localFolderCompatibility:true,language:html.includes('lang="zh')?'zh-CN':'en',assetFiles:Object.keys(actual).length};
fs.writeFileSync(new URL('../content/preload-validation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
