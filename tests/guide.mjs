import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine} from '../src/engine.js';
import {createGuide,guideDay} from '../src/guide.js';
import {installLocale, testLocale} from './helpers/locale.mjs';
const code = testLocale();
const L = await installLocale(code);


const fresh=createEngine({seed:2464}),first=fresh.snapshot();let guide=createGuide();guide.observe(first);
assert.equal(guide.forecast(first).known,false);
assert.equal(guide.summary(first).facts.length,0);
assert.equal(guide.clue(first).used,false);
const before=fresh.exportSave();const clue=guide.requestClue(first);assert.equal(clue.used,true);assert.deepEqual(fresh.exportSave(),before,'A clue must not change the game');
guide=createGuide(guide.exportSave());assert.equal(guide.requestClue(first).text,clue.text,'Reloading must not grant another clue');
const another=fresh.action('next');guide.observe(another);assert.equal(guide.requestClue(another).text,clue.text,'Moving forward in a day must not replace its clue');

// Exercise each real ending and compare the preview with the actual revealed
// ending. The poison preamble must not expose the final destroyer or poison.
for(let ending=1;ending<=5;ending++){
 const e=createEngine({seed:12}),bytes=new Uint8Array(e.debug.memory.buffer),g=e.debug.GC;
 for(const [idx,offset] of [[1,32],[2,44],[3,46],[4,19]])bytes[g+offset]=Number(ending>idx);
 e.debug.core.GameController_TimeTravel(g,0);let s=e.snapshot();const help=createGuide();help.observe(s);
 assert.equal(guideDay(s),1);assert.equal(help.clue(s).available,false);assert.equal(help.requestClue(s).used,false,'Midnight is not another daily clue');
 for(let i=0;i<8&&!s.screen.finished&&s.screen.kind!=='map';i++){
  if(ending===3&&s.screen.parts.some(p=>p.id===2471)){assert.ok(s.state.infoFinalboss);assert.equal(help.exportSave().seenEndings.includes(3),false);assert.equal(help.exportSave().seenEndings.includes(4),false);assert.equal(help.forecast(s).known,false);}
  s=e.action('next');help.observe(s);
 }
 assert.ok(help.exportSave().seenEndings.includes(ending),'The actual death must be remembered');
 if(ending<5){const flags=structuredClone(s);flags.state.itemLove=ending>1;flags.state.itemGun=ending>2;flags.state.itemPoison=ending>3;flags.state.infoEvilGirl=false;assert.equal(help.forecast(flags).ending,ending);assert.equal(help.clue(s).available,true,'The next morning grants the next clue');help.requestClue(s);assert.equal(help.clue(s).used,true);}
}
// A stale intro node on a normal map must not count as midnight.
const stale={...another,state:{...another.state,loop:2,introNode:'noPoison2'}};assert.equal(guideDay(stale),2);
const premature={...first,state:{...first.state,infoFinalboss:true}};const careful=createGuide();careful.observe(premature);assert.equal(careful.exportSave().seenEndings.includes(4),false);assert.equal(careful.summary(premature).facts.some(f=>f.id==='ending:4'),false);
// Invalid or hostile saved UI values are ignored; imported text is never used.
const safe=createGuide({version:1,facts:[{id:'<img>',loop:1},{id:'event:wood',loop:1,text:'forged'},{id:'event:wood',loop:2}],seenEndings:[3,3,'4',0,99],clue:{day:1,id:'<script>'}});
assert.equal(safe.summary(first).facts.length,1);assert.match(safe.summary(first).facts[0].text,code==='zh-CN'?/废品场/:/scrapyard/);assert.equal(safe.clue(first).used,false);

// Use the entire legal route, including observer save/reload after every action.
const route=JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json',import.meta.url))),e=createEngine({seed:route.seed});let observer=createGuide(),days=new Map();
for(const action of [null,...route.actions]){
 const s=action?e.action(...action):e.snapshot();const unchanged=e.exportSave();observer.observe(s);
 const status=observer.clue(s);if(status.available){const result=observer.requestClue(s);assert.ok(!days.has(result.day));days.set(result.day,result.text);}else if(status.used)assert.equal(status.text,days.get(status.day));
 assert.deepEqual(e.exportSave(),unchanged);const known=observer.forecast(s);if(known.ending)assert.ok(observer.exportSave().seenEndings.includes(known.ending));
 observer=createGuide(observer.exportSave());
}
assert.equal(e.snapshot().screen.finished,true);assert.deepEqual(observer.exportSave().seenEndings.sort(),[1,2,3,5]);assert.equal(days.size,e.snapshot().state.loop-1);
const facts=observer.summary(e.snapshot()).facts;assert.ok(facts.some(f=>f.id==='event:gun'));assert.ok(facts.some(f=>f.id==='event:herbicide'));assert.ok(facts.some(f=>f.id==='flag:infoEvilGirl'));
console.log(JSON.stringify({assistance:true,spoilerGating:true,allFiveEndings:true,oneCluePerGameDay:true,midnightBoundary:true,saveReloadEveryAction:true,legalActions:route.actions.length,clueDays:days.size,diaryFacts:facts.length,gameStateUnchanged:true},null,2));
