import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createEngine} from '../src/engine.js';
const path=new URL('./winning-route.json',import.meta.url);
if(!fs.existsSync(path))throw new Error('The normal-play victory route has not been verified yet.');
const route=JSON.parse(fs.readFileSync(path));
const module=new WebAssembly.Module(fs.readFileSync(new URL('../recovery/recovered-core.wasm',import.meta.url)));
const original=createEngine({seed:route.seed,memory:new WebAssembly.Memory({initial:128}),coreFactory:runtime=>{const x=new WebAssembly.Instance(module,{runtime}).exports;return {...x,GameController_Constructor:x.GameController_Constructorctor,IntroManager_Constructor:x.IntroManager_Constructorctor};}});
let remake=createEngine({seed:route.seed});const endings=new Set();
for(const [kind,value] of route.actions){original.action(kind,value);remake.action(kind,value);assert.deepEqual(remake.snapshot(),original.snapshot());const s=remake.snapshot();if(s.screen.ending)endings.add(s.screen.ending);const saved=remake.exportSave();const resumed=createEngine();resumed.importSave(saved);assert.deepEqual(resumed.snapshot(),s);remake=resumed;}
assert.equal(remake.snapshot().screen.finished,true);console.log(JSON.stringify({legalWinningRoute:true,actions:route.actions.length,loops:remake.snapshot().state.loop,endingsSeen:[...endings],originalOracle:true,resumeAfterEveryAction:true},null,2));
