import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine,flags} from '../src/engine.js';
const module=new WebAssembly.Module(fs.readFileSync(new URL('../recovery/recovered-core.wasm',import.meta.url)));
const original=createEngine({seed:2464,memory:new WebAssembly.Memory({initial:128}),coreFactory:runtime=>{
  const exports=new WebAssembly.Instance(module,{runtime}).exports;
  return {...exports,GameController_Constructor:exports.GameController_Constructorctor,IntroManager_Constructor:exports.IntroManager_Constructorctor};
}});
const remake=createEngine({seed:2464});
function compare(){assert.deepEqual(remake.snapshot(),original.snapshot());}
function act(kind,value){remake.action(kind,value);original.action(kind,value);compare();}
compare();
act('next');assert.equal(remake.snapshot().screen.kind,'map');
act('go',1);act('choice',1);assert.equal(remake.snapshot().state.t,1);act('choice',1);assert.equal(remake.snapshot().state.t,2);
// Exercise real UI actions over hundreds of loops, both possible random hobo
// states, four choice positions, free-text prompts and all five time phases.
let rng=4104;const rand=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/4294967296;};
const visited=new Set();const phases=new Set();let inputCount=0;
for(let i=0;i<18000;i++) {
  const {state,screen}=remake.snapshot();visited.add(state.place+':'+state.node+':'+state.introNode);phases.add(state.t);
  if(screen.finished)break;
  if(screen.kind==='intro')act('next');
  else if(screen.kind==='map')act('go',1+Math.floor(rand()*8));
  else if(screen.input){act('input',['8774','Martin',String(state.loop),'wrong'][Math.floor(rand()*4)]);inputCount++;}
  else if(screen.options.some(o=>o.raw.trim())){const available=screen.options.filter(o=>o.raw.trim());act('choice',available[Math.floor(rand()*available.length)].choice);}
  else if(screen.needsContinue)act('continue');
  else throw new Error('Unreachable UI state '+JSON.stringify(remake.snapshot()));
}
// Explicit fixtures compare the original ending resolver, and verify item reset
// and permanent knowledge after each failure. Victory is checked through GAME OVER.
const endings=[];
for(let ending=0;ending<5;ending++){
 const a=createEngine({seed:12});
 const b=createEngine({seed:12,memory:new WebAssembly.Memory({initial:128}),coreFactory:runtime=>{
  const ex=new WebAssembly.Instance(module,{runtime}).exports;
  return {...ex,GameController_Constructor:ex.GameController_Constructorctor,IntroManager_Constructor:ex.IntroManager_Constructorctor};
 }});
 for(const e of [a,b]){
  const u=new Uint8Array(e.debug.memory.buffer),g=e.debug.GC;
  for(const [idx,offset] of [[1,32],[2,44],[3,46],[4,19]])u[g+offset]=Number(ending>=idx);
  u[g+12]=1; // an existing persistent clue
  u[g+38]=1; // a temporary crowbar
  e.debug.core.GameController_TimeTravel(g,0);
 }
 assert.deepEqual(a.snapshot(),b.snapshot());const trail=[];
 for(let n=0;n<8;n++){
  const s=a.snapshot();trail.push(s.state.introNode);
  if(s.screen.finished||s.screen.kind==='map')break;
  a.action('next');b.action('next');assert.deepEqual(a.snapshot(),b.snapshot());
 }
 if(ending<4){assert.equal(a.snapshot().screen.kind,'map');assert.equal(a.snapshot().state.itemCrowbar,false);assert.equal(a.snapshot().state.infoCrash,true);}
 else assert.equal(a.snapshot().screen.finished,true);
 endings.push(trail);
}
// A saved game resumes with the same current text, choices and next consequence.
const save=remake.exportSave();const resumed=createEngine({seed:9});resumed.importSave(save);assert.deepEqual(resumed.snapshot(),remake.snapshot());
console.log(JSON.stringify({oracle:'original recovered WASM',actions:18000,visitedStates:visited.size,phases:[...phases],freeTextActions:inputCount,endings,saveRoundTrip:true},null,2));
