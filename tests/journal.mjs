import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine,destinations} from '../src/engine.js';
import {createGuide,guideDay} from '../src/guide.js';
import {createJournal,journalText,endingPages} from '../src/journal.js';
import {installLocale, testLocale} from './helpers/locale.mjs';
const code = testLocale();
const L = await installLocale(code);

const clone=x=>JSON.parse(JSON.stringify(x));
let e=createEngine({seed:8}),j=createJournal(),g=createGuide(),s=e.snapshot();
assert.deepEqual(j.album(),[]);assert.deepEqual(j.catalog(),[]);j.observe(s);assert.equal(j.catalog().length,1);assert.equal(j.catalog()[0].text,s.screen.text);
assert.equal(j.ritual(s),true,'The opening home scene offers the ritual');const unchanged=e.exportSave();j.ritual(s);assert.deepEqual(e.exportSave(),unchanged);assert.equal(j.exportSave().ritualDays.length,1);
const record=j.addCard('recorded','passage:0'),a=j.addCard('theory','Something <script> imagined'),b=j.addCard('theory','Another idea');assert.equal(j.addCard('recorded','person:valentine'),null);assert.equal(j.addCard('other','bad'),null);
j.moveCard(a,999,-10);assert.deepEqual([j.board().cards[1].x,j.board().cards[1].y],[74,0]);assert.ok(j.connect(a,b,'A possibility'));assert.ok(!j.connect(a,a));j.editTheory(a,'A revised thought',true);j.markDiscoveries(['event:wood','event:wood']);
j=createJournal(j.exportSave());assert.equal(j.board().links.length,1);assert.equal(j.board().cards[1].crossed,true);assert.equal(j.cover().unread,1);j.clearUnread();assert.equal(j.cover().unread,0);j.removeCard(b);assert.equal(j.board().links.length,0);assert.equal(j.board().cards[0].record.text,L.literals[2464].text);
// Neither inferred original flags nor a partial ending opens an unseen page.
for(let ending=1;ending<=5;ending++){
 const test=createEngine({seed:12}),u=new Uint8Array(test.debug.memory.buffer),gc=test.debug.GC;for(const [idx,offset] of [[1,32],[2,44],[3,46],[4,19]])u[gc+offset]=Number(ending>idx);test.debug.core.GameController_TimeTravel(gc,0);
 let scene=test.snapshot(),mem=createJournal(),seen=new Set();
 for(let n=0;n<9;n++){
  mem.observe(scene);for(const p of scene.screen.parts)seen.add(p.id);
  for(const page of mem.album()){for(const p of page.parts)assert.ok(seen.has(p.id));assert.equal(page.number,ending);}
  if(scene.screen.parts[0]?.id===2466)assert.equal(mem.album().length,0);
  const beforeExport=mem.album();mem=createJournal(mem.exportSave());assert.deepEqual(mem.album(),beforeExport);
  if(scene.screen.finished||scene.screen.kind==='map')break;scene=test.action('next');
 }
 assert.equal(mem.album().length,1);assert.equal(mem.album()[0].number,ending);assert.deepEqual(mem.album()[0].parts,endingPages[ending].map(id=>({id})));
}
const history=[{loop:3,phase:'Night',location:'Home',text:L.literals[2470].text}];let legacy=createJournal();legacy.recoverHistory(history);assert.equal(legacy.album().length,1);assert.deepEqual(legacy.album()[0].parts,[{id:2470}]);assert.equal(legacy.album()[0].number,2);assert.ok(!legacy.catalog().some(c=>c.text.includes(L.literals[2475].text)));
const sanitized=createJournal({version:1,people:{filter:'bad'},objects:'bad',cards:[{id:'x',kind:'theory',text:'bad'}],endingSeen:[2479],passages:[],choices:'bad'});assert.equal(sanitized.catalog().length,0);assert.equal(sanitized.album().length,0);
// All eight travel actions remain owned by the original controller.
for(const d of destinations){const test=createEngine({seed:21}),mem=createJournal();const before=test.action('next'),after=test.action('go',d.id),gameSave=test.exportSave();mem.recordAction(before,'go',d.id,after);mem.observe(after);assert.deepEqual(test.exportSave(),gameSave);assert.deepEqual(mem.map(guideDay(before)).visits,[{day:guideDay(before),place:d.id,phase:before.state.phase}]);mem.togglePin(d.id);assert.deepEqual(mem.map(99).pins,[d.id]);assert.equal(mem.map(99).visits.length,0);}
// Actual option and outcome, not a guessed persistent result.
e=createEngine({seed:11});e.action('next');const home=e.action('go',1),after=e.action('choice',3);j=createJournal();j.recordAction(home,'choice',3,after);assert.deepEqual(j.echo(home,3).outcome,after.screen.parts);assert.equal(j.echo(home,2),null);const changed=clone(home);changed.screen.options[2].parts=[{id:1863}];assert.equal(j.echo(changed,3),null);j=createJournal(j.exportSave());assert.equal(j.echo(home,3).loop,1);
// Complete legal route, reloading the journal after each step. It cannot mutate
// engine saves, spend an extra clue, or expose text not actually displayed.
const route=JSON.parse(fs.readFileSync(new URL('./fixtures/winning-route.json',import.meta.url)));e=createEngine({seed:route.seed});j=createJournal();g=createGuide();const seen=new Set();let discoveries=0;
for(const action of [null,...route.actions]){const before=e.snapshot(),after=action?e.action(...action):before,engineSave=e.exportSave();if(action)j.recordAction(before,...action,after);const known=new Set(g.summary(after).facts.map(f=>f.id));g.observe(after);const fresh=g.summary(after).facts.filter(f=>!known.has(f.id)).map(f=>f.id);discoveries+=fresh.length;j.markDiscoveries(fresh);j.observe(after);for(const p of after.screen.parts)if(p.id)seen.add(p.id);for(const p of j.exportSave().passages)for(const part of p.parts)if(part.id)assert.ok(seen.has(part.id));assert.deepEqual(e.exportSave(),engineSave);const exported=j.exportSave();j=createJournal(exported);assert.deepEqual(j.exportSave(),exported);}
assert.equal(e.snapshot().screen.finished,true);assert.deepEqual(j.album().map(e=>e.number),[1,2,3,5]);assert.equal(discoveries,19);assert.ok(j.exportSave().choices.length>20);assert.ok(j.exportSave().visits.length>20);assert.ok(JSON.stringify(j.exportSave()).length<300000);assert.ok(journalText(j.album()[0].parts).includes(L.literals[2469].text));
console.log(JSON.stringify({journal:true,observedMaterialOnly:true,allFiveEndingAlbums:true,partialLegacyHistory:true,boardPersistence:true,ritualHasNoGameEffect:true,originalTimeRulesForAllEightDestinations:true,departurePhaseMarks:true,pinsSurviveLoops:true,choiceContextAndOutcome:true,saveReloadEveryAction:261,newFindings:discoveries,gameStateUnchanged:true},null,2));
