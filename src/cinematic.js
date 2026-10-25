import {narrationManifest} from './narration-manifest.js';
// Presentation only. This module never reads or changes controller/save memory.
export function createCinematicUI({document,settings,requestFrame=globalThis.requestAnimationFrame,cancelFrame=globalThis.cancelAnimationFrame,now=()=>globalThis.performance.now()}){
 const game=document.getElementById('game'),text=document.getElementById('story-text'),button=document.getElementById('reveal-text'),scroll=document.getElementById('reader-scroll');
 let frame=0,letters=[],shown=0,enabled=false,done=false,status=null,elapsed=0,stamp=0,duration=1,lastAuto=0,follow=true;
 const show=n=>{const target=Math.min(letters.length,Math.max(shown,Math.floor(n)));for(let i=shown;i<target;i++)letters[i].style.opacity='1';shown=target;if(shown===letters.length){done=true;button.hidden=true;}}
 function stop(){for(const letter of letters)letter.style.opacity='1';if(frame)cancelFrame(frame);frame=0;enabled=false;letters=[];shown=0;status=null;done=false;game.classList.remove('cinematic');button.hidden=true;}
 function showAll(){show(letters.length);if(frame)cancelFrame(frame);frame=0;}
 function tick(time){frame=0;if(!enabled||done)return;const delta=Math.min(100,Math.max(0,time-stamp));stamp=time;
  if(!document.hidden){
   const voiced=settings.narrationEnabled&&status?.available&&!status.blocked;
   if(voiced&&status.playing&&!status.loading){const target=status.progress*duration;elapsed=Math.max(elapsed,target);elapsed=Math.min(duration,elapsed+delta/1000*(settings.voiceRate||1));show(elapsed/duration*letters.length);if(status.completed)showAll();}
   else if(!voiced){elapsed+=delta/1000;show(elapsed*28);}
   else if(status.completed)showAll();
   if(follow&&shown){const a=letters[shown-1].getBoundingClientRect(),b=scroll.getBoundingClientRect();if(Math.abs(scroll.scrollTop-lastAuto)>30)follow=false;else if(a.bottom>b.bottom-22&&b.height>0){scroll.scrollTop+=a.bottom-b.bottom+22;lastAuto=scroll.scrollTop;}}
  }
  if(!done)frame=requestFrame(tick);
 }
 function start(s,cinema){stop();enabled=!!cinema;game.classList.toggle('cinematic',enabled);game.dataset.illustrated=s.screen.kind==='map'?'false':'true';if(!enabled)return;
  if(settings.reducedMotion)return;
  duration=s.screen.parts.reduce((sum,p)=>{const clip=narrationManifest[p.id??('number:'+p.text)];return sum+(clip?clip.end-clip.start:0);},0)||Math.max(1,Array.from(text.textContent).length/28);
  for(const paragraph of text.children){const fragment=document.createDocumentFragment();for(const ch of Array.from(paragraph.textContent)){const span=document.createElement('span');span.className='cinematic-letter';span.textContent=ch;span.style.opacity='0';fragment.append(span);letters.push(span);}paragraph.replaceChildren(fragment);}
  button.hidden=!letters.length;elapsed=0;stamp=now();lastAuto=0;follow=true;frame=requestFrame(tick);
 }
 function audioStatus(value){if(enabled&&!done&&status?.available&&value.available&&value.progress+0.02<status.progress){shown=0;elapsed=0;for(const letter of letters)letter.style.opacity='0';scroll.scrollTop=0;lastAuto=0;follow=true;}status=value;}
 function refreshSettings(){if(enabled&&settings.reducedMotion)showAll();}
 button.addEventListener('click',showAll);
 document.addEventListener('visibilitychange',()=>{stamp=now();});
 return {start,status:audioStatus,stop,showAll,refreshSettings,get revealing(){return enabled&&!done&&letters.length>shown;}};
}
