import assert from 'node:assert/strict';
import {createAudio} from '../src/audio.js';
import {narrationManifest} from '../src/narration-manifest.js';
// Media positions and source loading do not complete synchronously in browsers.
// Keep the previous position visible until the requested seek is acknowledged.
const objects=[];
class DelayedAudio extends EventTarget {
 constructor(){super();this.src='';this.volume=1;this.position=0;this.paused=true;this.readyState=0;this.seeking=false;this.error=null;this.plays=[];objects.push(this);}
 get currentTime(){return this.position;}
 set currentTime(value){this.target=value;if(this.readyState){this.seeking=true;}else throw Object.assign(new Error('Metadata pending'),{name:'InvalidStateError'});}
 load(){this.readyState=0;this.seeking=false;}
 play(){this.paused=false;this.plays.push(this.position);return Promise.resolve();}
 pause(){this.paused=true;}
 metadata(){this.position=0;this.readyState=1;this.dispatchEvent(new Event('loadedmetadata'));}
 finishSeek(){this.position=this.target;this.seeking=false;this.dispatchEvent(new Event('seeked'));}
 event(name){this.dispatchEvent(new Event(name));}
}
globalThis.Audio=DelayedAudio;globalThis.window={};globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
let status;const audio=createAudio({narrationEnabled:true,musicEnabled:false,voiceVolume:.95,voiceRate:1,musicVolume:.15},s=>status=s),voice=objects[0];
const first=narrationManifest['2465'],second=narrationManifest['2466'];
audio.read([{id:2465},{id:2466}]);voice.position=first.end+2;voice.event('timeupdate');voice.event('ended');
voice.metadata();assert.equal(voice.target,first.start,'An obsolete position must not skip the opening clip while metadata is pending');
assert.equal(voice.plays.length,0,'A nonzero clip must stay silent until its initial seek completes');
voice.position=first.end+2;voice.event('timeupdate');voice.event('ended');
assert.equal(status.completed,false);voice.finishSeek();assert.deepEqual(voice.plays,[first.start]);
// A backward jump inside the same recording must also await the new position.
const oldPlays=voice.plays.length;audio.read([{id:2466}]);voice.event('timeupdate');voice.event('ended');assert.equal(voice.plays.length,oldPlays);voice.finishSeek();assert.equal(voice.plays.at(-1),second.start);
audio.read([{id:2465}]);voice.event('timeupdate');voice.event('ended');voice.finishSeek();assert.equal(voice.plays.at(-1),first.start);
// Rapid choices abandon all obsolete seeks, including a queued seeked event.
audio.read([{id:2465}]);audio.read([{id:2466}]);const rapidPlays=voice.plays.length;voice.event('seeked');voice.event('timeupdate');assert.equal(voice.plays.length,rapidPlays);voice.finishSeek();assert.equal(voice.plays.at(-1),second.start);
// Pausing or hiding the page during preparation may not start hidden speech.
audio.read([{id:2465}]);audio.toggle();const pausedPlays=voice.plays.length;voice.finishSeek();assert.equal(voice.plays.length,pausedPlays);assert.equal(status.paused,true);audio.toggle();assert.equal(voice.plays.at(-1),first.start);
audio.read([{id:2466}]);audio.suspend(true);const hiddenPlays=voice.plays.length;voice.finishSeek();assert.equal(voice.plays.length,hiddenPlays);audio.resume();assert.equal(voice.plays.at(-1),second.start);
// Replay must pause before seeking back, and completion must still advance once.
voice.position=first.end;audio.read([{id:2465},{id:2466}]);voice.finishSeek();voice.position=first.end;voice.event('timeupdate');voice.event('timeupdate');voice.finishSeek();assert.equal(voice.plays.at(-1),second.start);audio.replay();assert.equal(voice.paused,true);voice.finishSeek();assert.equal(voice.plays.at(-1),first.start);audio.stop();voice.event('seeked');assert.equal(voice.paused,true);
console.log(JSON.stringify({delayedMetadata:true,delayedSeek:true,backwardSeek:true,rapidChoices:true,staleMediaEvents:true,pauseDuringSeek:true,suspendDuringSeek:true,replayFromBeginning:true}));
