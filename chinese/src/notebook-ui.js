import {phaseLabel,itemLabel,kindLabel} from './locale.js';
import {assetURL,createAudio} from './audio.js';
import {journalText} from './journal.js';
import {guideDay} from './guide.js';
import {destinations} from './engine.js';

// Presentation for the observational notebook. Game actions are deliberately
// not among its callbacks; opening, editing or replaying a memory is free.
export function createNotebookUI(api){
 const n$=id=>document.getElementById(id);
 const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;};
 const button=(text,handler,cls='quiet-button')=>{const b=el('button',cls,text);b.type='button';b.addEventListener('click',handler);return b;};
 const paragraphs=(node,text)=>{node.replaceChildren();for(const line of text.trim().split(/\n+/))node.append(el('p','',line));};
 const j=()=>api.getJournal(),facts=()=>api.getFacts();
 let editedCard=null,ritualTimer,discoveryTimer,resetTimer,resetDone=null,albumAudio=null,albumSettings=null,selectedEnding=null,albumEngaged=false;
 function commit(){api.save();}

 // 11. The player's conspiracy board.
 function sourcePreview(){const record=j().catalog(facts()).find(r=>r.id===n$('board-source').value);n$('board-preview').textContent=record?.text||'尚未记录与这次搜索相符的内容。';n$('board-pin').disabled=!record;}
 function sources(selected){
  const select=n$('board-source'),old=selected||select.value,query=n$('board-search').value.trim().toLowerCase(),category=n$('board-category').value;
  select.replaceChildren();for(const r of j().catalog(facts()).filter(r=>(!category||r.kind===category)&&(!query||(r.title+' '+r.text).toLowerCase().includes(query)))){
   const o=el('option','',kindLabel(r.kind)+' · '+r.title+' — '+r.text.slice(0,95).replace(/\s+/g,' '));o.value=r.id;select.append(o);
  }
  if([...select.options].some(o=>o.value===old))select.value=old;else if(select.options.length)select.selectedIndex=0;sourcePreview();
 }
 function drawStrings(){
  const {cards,links}=j().board(facts()),svg=n$('board-strings');svg.replaceChildren();
  for(const link of links){const a=cards.find(c=>c.id===link.from),b=cards.find(c=>c.id===link.to),line=document.createElementNS('http://www.w3.org/2000/svg','line');
   line.setAttribute('x1',String((a.x+11)*10));line.setAttribute('y1',String((a.y+2)*7.6));line.setAttribute('x2',String((b.x+11)*10));line.setAttribute('y2',String((b.y+2)*7.6));svg.append(line);
  }
 }
 const cardTitle=c=>c.kind==='theory'?'我的猜想：'+c.text.slice(0,55):c.record.title;
 function moveHandle(handle,card,node){
  let drag=null;
  handle.addEventListener('pointerdown',e=>{if(e.button!==0&&e.pointerType!=='touch')return;const r=n$('board-canvas').getBoundingClientRect();if(!r.width||!r.height)return;
   const latest=j().board(facts()).cards.find(c=>c.id===card.id);drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:latest.x,top:latest.y,width:r.width,height:r.height};handle.setPointerCapture?.(e.pointerId);node.classList.add('dragging');
  });
  handle.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;e.preventDefault();j().moveCard(card.id,drag.left+(e.clientX-drag.x)/drag.width*100,drag.top+(e.clientY-drag.y)/drag.height*100);const now=j().board(facts()).cards.find(c=>c.id===card.id);node.style.left=now.x+'%';node.style.top=now.y+'%';drawStrings();});
  const stop=e=>{if(!drag||drag.id!==e.pointerId)return;drag=null;node.classList.remove('dragging');if(handle.hasPointerCapture?.(e.pointerId))handle.releasePointerCapture(e.pointerId);commit();};
  handle.addEventListener('pointerup',stop);handle.addEventListener('pointercancel',stop);handle.addEventListener('lostpointercapture',stop);
  handle.addEventListener('keydown',e=>{const delta={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}[e.key];if(!delta)return;e.preventDefault();const now=j().board(facts()).cards.find(c=>c.id===card.id);j().moveCard(card.id,now.x+delta[0],now.y+delta[1]);const moved=j().board(facts()).cards.find(c=>c.id===card.id);node.style.left=moved.x+'%';node.style.top=moved.y+'%';drawStrings();commit();});
 }
 function inspectCard(id){
  const c=j().board(facts()).cards.find(c=>c.id===id);if(!c)return;editedCard=id;
  n$('card-heading').textContent=c.kind==='theory'?'我的猜想':c.record.title;n$('card-kind').textContent=c.kind==='theory'?'由你写下':kindLabel(c.record.kind)+' · 已记录';
  n$('card-text').hidden=c.kind==='theory';n$('edit-theory-form').hidden=c.kind!=='theory';
  if(c.kind==='theory'){n$('edit-theory').value=c.text;n$('edit-crossed').checked=c.crossed;}else paragraphs(n$('card-text'),c.record.text);
  api.open('card-dialog');
 }
 function board(){
  const {cards,links}=j().board(facts());n$('board-cards').replaceChildren();n$('board-empty').hidden=!!cards.length;
  n$('board-status').textContent=cards.length+' / 32张卡片';
  for(const c of cards){const node=el('article','board-card '+c.kind+(c.crossed?' crossed':''));node.dataset.card=c.id;node.style.left=c.x+'%';node.style.top=c.y+'%';
   const handle=button(c.kind==='theory'?'我的猜想':kindLabel(c.record.kind),()=>{},'card-handle');handle.setAttribute('aria-label','移动'+cardTitle(c)+'。使用方向键。');moveHandle(handle,c,node);
   const text=el('p','card-snippet',c.kind==='theory'?c.text:c.record.text),actions=el('div','card-actions');actions.append(button(c.kind==='theory'?'编辑':'阅读',()=>inspectCard(c.id)),button('移除图钉',()=>{j().removeCard(c.id);commit();board();n$('board-pin').focus();}));node.append(handle,text,actions);n$('board-cards').append(node);
  }
  for(const id of ['connection-from','connection-to']){const select=n$(id),old=select.value;select.replaceChildren();for(const c of cards){const o=el('option','',cardTitle(c));o.value=c.id;select.append(o);}if(cards.some(c=>c.id===old))select.value=old;}
  if(cards.length>1&&n$('connection-from').value===n$('connection-to').value)n$('connection-to').selectedIndex=1;
  n$('connection-form').querySelector('button').disabled=cards.length<2;
  n$('board-connections').replaceChildren();for(const l of links){const li=el('li'),a=cards.find(c=>c.id===l.from),b=cards.find(c=>c.id===l.to);li.append(el('span','',cardTitle(a)+' ↔ '+cardTitle(b)+(l.label?' — '+l.label:'')),button('删除连线',()=>{j().disconnect(l.from,l.to);commit();board();}));n$('board-connections').append(li);}
  drawStrings();
 }
 function openBoard(selected){api.close();n$('board-search').value='';n$('board-category').value='';sources(selected);board();api.open('board-dialog');}
 for(const id of ['board-button','title-board'])n$(id).addEventListener('click',()=>openBoard());
 n$('board-category').addEventListener('change',()=>sources());n$('board-search').addEventListener('input',()=>sources());n$('board-source').addEventListener('change',sourcePreview);
 function pin(kind,value){const id=j().addCard(kind,value,facts());if(!id){n$('board-status').textContent='板上已满。移除一张卡片，腾出位置。';return false;}commit();board();n$('board-status').textContent='Pinned. '+j().board(facts()).cards.length+' / 32张卡片';return true;}
 n$('board-pin').addEventListener('click',()=>pin('recorded',n$('board-source').value));
 n$('theory-form').addEventListener('submit',e=>{e.preventDefault();if(pin('theory',n$('theory-text').value))n$('theory-text').value='';});
 n$('edit-theory-form').addEventListener('submit',e=>{e.preventDefault();j().editTheory(editedCard,n$('edit-theory').value,n$('edit-crossed').checked);commit();n$('card-dialog').close();board();n$('board-cards').querySelector('[data-card="'+editedCard+'"] .card-handle')?.focus();});
 n$('connection-form').addEventListener('submit',e=>{e.preventDefault();if(j().connect(n$('connection-from').value,n$('connection-to').value,n$('connection-label').value)){commit();board();n$('connection-label').value='';n$('board-status').textContent='已画好连线。';}else n$('board-status').textContent='请选择两张不同的卡片。板上最多可有48条连线。';});
 n$('pin-passage').addEventListener('click',()=>{const parts=JSON.stringify(api.getCurrent().screen.parts),record=j().catalog(facts()).find(c=>c.parts&&JSON.stringify(c.parts)===parts);if(record){openBoard(record.id);pin('recorded',record.id);}});

 // 3. A quiet, optional gesture with no state-machine or clock effect.
 function ritualView(s){
  const home=!s.screen.finished&&s.screen.kind!=='map'&&(s.state.place===1||s.screen.kind==='intro')&&guideDay(s)>=s.state.loop;
  n$('sunflower-ritual').hidden=!home;n$('ritual-flower').src=assetURL('assets/art/original/hima3.webp');n$('ritual-status').textContent='';n$('sunflower-ritual').classList.remove('settling');clearTimeout(ritualTimer);
  n$('pin-passage').hidden=s.screen.kind==='map'||s.screen.finished;
 }
 n$('sunflower-ritual').addEventListener('click',()=>{if(!j().ritual(api.getCurrent()))return;const b=n$('sunflower-ritual');b.classList.remove('settling');void b.offsetWidth;b.classList.add('settling');n$('ritual-status').textContent='安静的一刻。';api.sound(.045);commit();clearTimeout(ritualTimer);ritualTimer=setTimeout(()=>{b.classList.remove('settling');n$('ritual-status').textContent='';},1800);});

 // 4. A diary tab, never an interruption to the authored dialogue.
 function discover(ids){if(!ids.length)return;j().markDiscoveries(ids);n$('discovery-text').textContent=ids.length===1?'日记里有一条新发现':'日记里有新的发现';n$('discovery-notice').hidden=false;api.sound(.035);clearTimeout(discoveryTimer);discoveryTimer=setTimeout(()=>{n$('discovery-notice').hidden=true;},6000);}
 n$('discovery-notice').addEventListener('click',()=>{n$('discovery-notice').hidden=true;api.onDiary();});
 function clearDiscovery(){clearTimeout(discoveryTimer);n$('discovery-notice').hidden=true;}

 // 6. The cover accumulates only the player's own recorded memories.
 function chrome(){
  const cover=j().cover(facts()),hasGame=api.isActive()||api.hasSave();n$('board-button').disabled=!hasGame;n$('title-board').hidden=!hasGame;
  for(const id of ['album-button','title-album'])n$(id).hidden=!cover.endings.length;
  n$('diary-unread').hidden=!cover.unread;n$('diary-unread').textContent=cover.unread?String(cover.unread):'';n$('menu-button').classList.toggle('new-finding',!!cover.unread);
  if(api.isActive())return;const box=n$('cover-memories');box.replaceChildren();const memories=cover.findings.length||cover.theories.length||cover.endings.length;box.hidden=!memories;if(!memories)return;
  box.append(el('p','eyebrow','保存了'+cover.day+'次循环的记忆'));
  for(const f of cover.findings){const card=el('p','cover-scrap',f.text);card.title=f.text;box.append(card);}
  for(const t of cover.theories){const card=el('p','cover-scrap cover-theory'+(t.crossed?' crossed':''));card.append(el('small','','我的猜想'),document.createTextNode(t.text));card.title=t.text;box.append(card);}
  if(cover.endings.length){const row=el('div','cover-photos');for(const e of cover.endings){const b=button('',()=>openAlbum(e.number),'cover-photo'),img=el('img');img.src=assetURL('assets/art/original/'+e.art+'.webp');img.alt=e.name+' — 第'+e.loop+'次循环经历';b.append(img);row.append(b);}box.append(row);}
 }

 // 7. Map annotations record departure phases, never travel costs.
 function mapMemory(map,list,s){
  const day=guideDay(s),group=el('div','map-memory');group.append(el('p','map-note','铅笔记下今天去过的地方。时间表示你离开地图时的时段。图钉是你自己的提醒。'));
  function repaint(){const memory=j().map(day);for(const d of destinations){const spot=map.querySelector('[data-destination="'+d.id+'"]'),phases=[...new Set(memory.visits.filter(v=>v.place===d.id).map(v=>phaseLabel(v.phase)))],pinned=memory.pins.includes(d.id);spot.querySelector('.map-pencil')?.remove();
    spot.setAttribute('aria-label',d.name+(phases.length?'。今天去过：'+phases.join(', '):'')+(pinned?'。已标记为想再去的地方':''));spot.title=spot.getAttribute('aria-label');
    if(phases.length||pinned){const mark=el('span','map-pencil',(pinned?'⚑ ':'')+phases.join(' · '));mark.setAttribute('aria-hidden','true');spot.append(mark);}
    const pin=list.querySelector('[data-pin="'+d.id+'"]');pin.setAttribute('aria-pressed',String(pinned));pin.textContent=(pinned?'取消标记：':'标记：')+d.name;pin.setAttribute('aria-label',(pinned?'取消重访提醒：':'标记重访提醒：')+d.name);
    list.querySelector('[data-visits="'+d.id+'"]').textContent=phases.length?'今天去过：'+phases.join(', '):'今天尚未记录来访';
   }
  }
  // Pin controls are separate from every destination button: travel still
  // takes precisely one original action and always advances the original clock.
  const existing=[...list.children];list.replaceChildren();for(const [i,d] of destinations.entries()){const row=el('div','city-list-row'),visit=el('span','city-visit');visit.dataset.visits=d.id;const pin=button('标记：'+d.name,()=>{j().togglePin(d.id);commit();repaint();});pin.dataset.pin=d.id;row.append(existing[i],visit,pin);list.append(row);}repaint();return group;
 }

 // 8. This transition observes a reset already performed by the controller.
 function cancelReset(){clearTimeout(resetTimer);resetTimer=null;resetDone=null;if(n$('loop-dialog').open)n$('loop-dialog').close();}
 function finishReset(){if(!resetDone)return;const done=resetDone;cancelReset();done();}
 function startReset(s,done){cancelReset();if(api.settings.reducedMotion||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){done();return;}
  n$('loop-heading').textContent='第'+guideDay(s)+'次循环';n$('loop-flower').src=assetURL('assets/art/original/hima5.webp');resetDone=done;api.open('loop-dialog');
  let frame=5;const tick=()=>{if(!resetDone)return;frame--;if(frame>=1){n$('loop-flower').src=assetURL('assets/art/original/hima'+frame+'.webp');resetTimer=setTimeout(tick,180);}else resetTimer=setTimeout(finishReset,250);};resetTimer=setTimeout(tick,180);
 }
 n$('skip-loop').addEventListener('click',finishReset);n$('loop-dialog').addEventListener('cancel',e=>{e.preventDefault();finishReset();});n$('loop-dialog').addEventListener('close',finishReset);

 // 10. Keep Harry's live passage separate from the album's explicit replay.
 function albumStatus(status){n$('album-pause').disabled=!status.available;n$('album-pause').textContent=status.playing?'暂停':'继续';n$('album-status').textContent=status.blocked?'点击继续，听中文旁白':status.loading?'朱利安 · 正在加载……':status.playing?'朱利安 · 正在朗读':status.paused?'朱利安 · 已暂停':status.completed?'朱利安 · 可重新播放':'';}
 function prepareAlbumAudio(){if(!albumAudio){albumSettings={...api.settings,musicEnabled:false,narrationEnabled:true};albumAudio=createAudio(albumSettings,albumStatus);}else Object.assign(albumSettings,api.settings,{musicEnabled:false,narrationEnabled:true});albumAudio.update();return albumAudio;}
 function albumPage(number){selectedEnding=j().album().find(e=>e.number===number)||j().album()[0];if(!selectedEnding)return;albumAudio?.stop();
  const e=selectedEnding;n$('album-meta').textContent=e.name+' · 首次经历：第'+e.loop+'次循环';n$('album-art').src=assetURL('assets/art/original/'+e.art+'.webp');n$('album-art').alt=e.name+' — 原版结局插画';paragraphs(n$('album-text'),journalText(e.parts));n$('album-status').textContent='';n$('album-pause').disabled=true;
  for(const b of n$('album-tabs').children)b.setAttribute('aria-pressed',String(Number(b.dataset.ending)===number));
 }
 function openAlbum(number){const pages=j().album();if(!pages.length)return;api.close();albumEngaged=true;api.mainAudio.suspend(true);n$('album-tabs').replaceChildren();for(const e of pages){const b=button(e.name,()=>albumPage(e.number),'secondary');b.dataset.ending=e.number;n$('album-tabs').append(b);}albumPage(number||pages[0].number);api.open('album-dialog');}
 function closeAlbum(){if(!albumEngaged)return;albumEngaged=false;albumAudio?.stop();if(api.isActive()&&!document.hidden)api.mainAudio.resume();}
 for(const id of ['album-button','title-album'])n$(id).addEventListener('click',()=>openAlbum());
 n$('album-play').addEventListener('click',()=>{if(selectedEnding){const voice=prepareAlbumAudio();voice.resume();voice.read(selectedEnding.parts,{force:true});}});
 n$('album-pause').addEventListener('click',()=>albumAudio?.toggle());n$('album-dialog').addEventListener('close',closeAlbum);
 // Explicit buttons also work in simple DOM test environments; the close
 // listener additionally covers Escape and native dialog dismissal.
 n$('album-dialog').querySelector('[data-close]').addEventListener('click',closeAlbum);
 function suspend(){albumAudio?.suspend(true);}
 function resumeMedia(){if(albumEngaged)albumAudio?.resume();}
 function refreshSettings(){if(albumAudio){Object.assign(albumSettings,api.settings,{musicEnabled:false,narrationEnabled:true});albumAudio.update();}}

 // 12. A memory button beside a choice can never make that choice for you.
 function echoButton(s,choice){const memory=j().echo(s,choice);if(!memory)return null;return button('第'+memory.loop+'次循环选过',()=>{n$('echo-meta').textContent='第'+memory.loop+'次循环 · '+phaseLabel(memory.phase);n$('echo-choice').textContent=journalText(memory.option);paragraphs(n$('echo-outcome'),journalText(memory.outcome)||(memory.map?'回到了城市地图。':''));n$('echo-items').textContent=[memory.gained.length?'获得：'+memory.gained.map(itemLabel).join('、')+'.':'',memory.lost.length?'不再携带：'+memory.lost.map(itemLabel).join('、')+'.':''].filter(Boolean).join(' ');api.open('echo-dialog');},'choice-echo');}
 return {openBoard,chrome,ritualView,discover,clearDiscovery,mapMemory,startReset,cancelReset,echoButton,suspend,resumeMedia,refreshSettings,isAlbumOpen:()=>albumEngaged,isResetting:()=>!!resetDone};
}
