import {sceneArtPath} from './scenes.js';
import {createCinematicUI} from './cinematic.js';
import {translatedSigns} from './signs.js';
import {phaseLabel,itemLabel,locationLabel,historyLabel} from './locale.js';
import {createEngine,destinations} from './engine.js';
import {createAudio,assetURL} from './audio.js';
import {originalScene,cityRegions} from './graphics.js';
import {createGuide,guideDay} from './guide.js';
import {createJournal} from './journal.js';
import {createNotebookUI} from './notebook-ui.js';
const $=id=>document.getElementById(id),SAVE_KEY='himawari-2026-zh-CN-save',SETTINGS_KEY='himawari-2026-zh-CN-settings';
const defaults={narrationEnabled:true,voiceVolume:.95,voiceRate:1,musicEnabled:true,musicVolume:.15,largeText:false,reducedMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false};
let settings={...defaults},engine=createEngine(),guide=createGuide(),active=false,current=engine.snapshot(),history=[],lastSignature='',toastTimer,saved=null,journal=createJournal(),pendingNarration=false,answerComposing=false;
// Settings and progress recover independently: a damaged preference entry must
// never hide a healthy autosave or make starting over bypass its confirmation.
try{settings={...defaults,...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}')};}catch{}
try{saved=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');}catch{}
journal=createJournal(saved?.journal);journal.recoverHistory(saved?.history);
for(const key of ['voiceVolume','musicVolume','voiceRate'])if(!Number.isFinite(settings[key]))settings[key]=defaults[key];
settings.voiceVolume=Math.max(0,Math.min(1,settings.voiceVolume));settings.musicVolume=Math.max(0,Math.min(.5,settings.musicVolume));settings.voiceRate=Math.max(.75,Math.min(1.5,settings.voiceRate));
let cinematic=null;
const audio=createAudio(settings,status=>{
 cinematic?.status(status);
 $('voice-toggle').disabled=!status.available;$('voice-replay').disabled=!status.available;
 $('voice-toggle').setAttribute('aria-label',status.playing?'暂停朗读':status.completed?'播放朗读':'继续朗读');$('voice-toggle').title=$('voice-toggle').getAttribute('aria-label');
 $('voice-toggle').querySelector('path').setAttribute('d',status.playing?'M8 5h3v14H8zm5 0h3v14h-3z':'M8 5v14l11-7z');
 $('voice-status').textContent=status.blocked?'点击播放，听中文旁白':status.loading?'朱利安 · 正在加载……':status.playing?'朱利安 · 正在朗读':!status.enabled?'朗读已关闭':status.paused?'朱利安 · 已暂停':'朱利安 · 旁白';
 $('voice-progress-fill').style.width=(status.completed&&status.available?100:status.progress*100)+'%';
});
const notebook=createNotebookUI({getJournal:()=>journal,getFacts:()=>active?guide.summary(current).facts:createGuide(saved?.guide).summary(current).facts,getCurrent:()=>current,isActive:()=>active,hasSave:()=>!!saved,save:saveNotebook,open:openDialog,close:closeDialogs,toast,sound:volume=>audio.sound(volume),settings,mainAudio:audio,onDiary:openDiary});
cinematic=createCinematicUI({document,settings});
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').hidden=true,4500);}
function save(){const payload={edition:1,engine:engine.exportSave(),guide:guide.exportSave(),journal:journal.exportSave(),history:history.slice(-120),savedAt:new Date().toISOString()};saved=payload;try{localStorage.setItem(SAVE_KEY,JSON.stringify(payload));$('save-status').textContent='已保存';}catch{$('save-status').textContent='请导出存档保存';}updateTitle();return payload;}
function saveNotebook(){if(active)return save();if(saved){saved={...saved,journal:journal.exportSave()};try{localStorage.setItem(SAVE_KEY,JSON.stringify(saved));}catch{toast('请导出存档，保存这些笔记。');}}updateTitle();return saved;}
function updateTitle(){$('diary-button').disabled=!active;$('resume-game').hidden=!saved;$('begin-game').textContent=saved?'新游戏':'开始';$('begin-game').className=saved?'secondary':'primary';notebook.chrome();}
function syncSettings(){for(const [id,key] of [['narration-enabled','narrationEnabled'],['music-enabled','musicEnabled'],['large-text','largeText'],['reduced-motion','reducedMotion']])$(id).checked=!!settings[key];for(const [id,key] of [['voice-volume','voiceVolume'],['music-volume','musicVolume'],['voice-rate','voiceRate']])$(id).value=settings[key];document.documentElement.classList.toggle('large-text',!!settings.largeText);document.documentElement.classList.toggle('reduced-motion',!!settings.reducedMotion);}
function setParagraphs(container,text){container.replaceChildren();for(const line of text.trim().split(/\n+/)){const p=document.createElement('p');p.textContent=line;container.append(p);}}
function isNight(s){return s.screen.kind==='intro'&&!s.screen.finished&&/^(endIntro[12]|noLove2?|noGun|noPoison2?|noEvil[23]?|victory[234]?)$/.test(s.state.introNode);}
function sceneInfo(s){const d=destinations.find(d=>d.id===s.state.place);if(s.screen.finished)return{key:'victory',name:'向日葵',kicker:'第二天'};if(s.screen.kind==='map')return{key:'town',name:'小镇',kicker:phaseLabel(s.state.phase)};if(s.screen.kind==='intro')return{key:s.state.introNode.startsWith('victory')?'victory':s.screen.ending?'ending':'home',name:'家里',kicker:isNight(s)?'夜晚':s.state.loop===1?'黎明':'又一天'};return{key:d?.key||'home',name:d?.name||'家里',kicker:phaseLabel(s.state.phase)};}
function continuation(screen){const options=screen.options.filter(o=>o.raw.trim());return options.length===1&&/^(?:>|<\s*Continue\s*>)$/i.test(options[0].raw.trim())?options[0]:null;}
function spokenChoices(screen){return screen.options.filter(o=>o.raw.trim()).flatMap(o=>[{text:String(o.choice)},...o.parts]);}
function render(s,{narrate=true,record=true,discoveries=true}={}){
 const priorFacts=new Set(guide.summary(s).facts.map(f=>f.id));current=s;guide.observe(s);journal.observe(s);notebook.ritualView(s);if(discoveries)notebook.discover(guide.summary(s).facts.filter(f=>!priorFacts.has(f.id)).map(f=>f.id));$('tonight-forecast').textContent=guide.forecast(s).text;const {screen,state}=s;const info=sceneInfo(s),isMap=screen.kind==='map',night=isNight(s),displayLoop=night?state.loop-1:state.loop;
 $('loop-label').textContent='第'+displayLoop+'次循环';$('phase-label').textContent=night?'夜晚':phaseLabel(state.phase);document.querySelector('.clock').setAttribute('aria-label','第'+displayLoop+'次循环'+'。时间：'+(night?'夜晚':phaseLabel(state.phase))+'。');$('game').dataset.phase=night?'night':state.phase.toLowerCase();
 $('scene-art').style.backgroundImage='url("'+assetURL(sceneArtPath(s))+'")';$('scene-art').replaceChildren();const signs=sceneArtPath(s).startsWith('assets/art/original/')?translatedSigns(originalScene(s)):null;if(signs)$('scene-art').append(signs);$('scene').classList.toggle('ending-scene',screen.kind==='intro'&&!!screen.ending||screen.finished);$('phase-flower').src=assetURL('assets/art/original/hima'+Math.max(1,Math.min(5,state.t))+'.webp');
 $('scene-name').textContent=info.name;$('scene-kicker').textContent=info.kicker;$('passage-label').textContent=isMap?'选择目的地':screen.finished?'终幕':night?'入夜':screen.kind==='intro'?'Himawari':info.name;
 $('phase-dots').replaceChildren();for(let i=1;i<=5;i++){const dot=document.createElement('i');dot.className=(night?5:state.t)>=i?'active':'';$('phase-dots').append(dot);}
 $('play-layout').classList.toggle('map-mode',isMap);$('inventory-count').textContent=s.inventory.length;$('inventory-button').setAttribute('aria-label',s.inventory.length?'背包，'+s.inventory.length+'件物品':'背包，空');
 const signature=JSON.stringify([screen.kind,screen.text,state.loop,state.t,screen.options.map(o=>o.text)]);
 if(record&&screen.text.trim()&&signature!==lastSignature){history.push({text:screen.text,location:info.name,loop:displayLoop,phase:night?'Night':state.phase});history=history.slice(-120);}
 lastSignature=signature;setParagraphs($('story-text'),isMap?'':screen.finished?'游戏结束 :)':screen.text);
 cinematic.start(s,night||screen.finished);
 $('story-text').classList.remove('entering');void $('story-text').offsetWidth;$('story-text').classList.add('entering');
 $('choices').replaceChildren();$('map-destinations').hidden=!isMap;$('answer-form').hidden=!screen.input;$('answer').value='';answerComposing=false;
 if(isMap){
  const group=$('map-destinations');group.replaceChildren();const map=document.createElement('div');map.className='city-map';const image=document.createElement('img');image.src=assetURL('assets/art/original/mapa_joc.webp');image.alt='原版手绘小镇';image.width=1280;image.height=974;map.append(image);map.append(translatedSigns('mapa_joc'));
  const links=document.createElement('details');links.className='city-links';const summary=document.createElement('summary');summary.textContent='目的地列表';links.append(summary);const list=document.createElement('div');list.className='city-link-buttons';links.append(list);
  for(const d of destinations){const b=document.createElement('button');b.className='destination city-hotspot';b.dataset.destination=d.id;b.setAttribute('aria-label',d.name);b.title=d.name;const [x,y,width,height]=cityRegions[d.id];Object.assign(b.style,{left:x+'%',top:y+'%',width:width+'%',height:height+'%'});const name=document.createElement('span');name.className='destination-name';name.textContent=d.name;b.append(name);b.addEventListener('click',()=>act('go',d.id));map.append(b);const link=document.createElement('button');link.className='secondary';link.textContent=d.name;link.addEventListener('click',()=>act('go',d.id));list.append(link);}
  const note=document.createElement('p');note.className='map-note';note.textContent='选择地图上的一栋建筑。';group.append(note,map,notebook.mapMemory(map,list,s),links);
 }
 else if(screen.finished){addContinue('返回标题',showTitle);}
 else if(screen.kind==='intro'){addContinue('继续',()=>act('next'));}
 else if(screen.needsContinue){addContinue('继续',()=>act('continue'));}
 else if(!screen.input&&continuation(screen)){const option=continuation(screen);addContinue('继续',()=>act('choice',option.choice));$('choices').lastElementChild.dataset.choice=option.choice;}
 else if(!screen.input){for(const option of screen.options.filter(o=>o.raw.trim())){const b=document.createElement('button');b.className='choice';b.dataset.choice=option.choice;b.setAttribute('aria-label','选项'+option.choice+'：'+option.text);const number=document.createElement('span');number.className='choice-number';number.textContent=option.choice;number.setAttribute('aria-hidden','true');const label=document.createElement('span');label.className='choice-label';label.textContent=option.text;const arrow=document.createElement('span');arrow.className='choice-arrow';arrow.textContent='→';arrow.setAttribute('aria-hidden','true');b.append(number,label,arrow);b.addEventListener('click',()=>act('choice',option.choice));const row=document.createElement('div');row.className='choice-row';row.append(b);const echo=notebook.echoButton(s,option.choice);if(echo)row.append(echo);$('choices').append(row);}}
 $('reader-scroll').scrollTop=0;if(window.innerWidth<=700)window.scrollTo({top:0,behavior:'instant'});
 $('read-choices').hidden=isMap||screen.kind==='intro'||screen.input||!audio.hasVoice(spokenChoices(screen));
 $('key-hint').textContent=screen.finished?'':screen.input?'输入答案':screen.kind==='intro'||screen.needsContinue||continuation(screen)?'按回车继续':isMap?'选择地点':'按1—4选择';
 audio.music(screen.finished||state.introNode.startsWith('victory')&&screen.kind==='intro'?2:night&&!state.introNode.startsWith('endIntro')?1:screen.music);if(narrate&&!document.hidden)audio.read(screen.parts);else{audio.stop();pendingNarration=narrate;}
 if(active){save();if(screen.input)$('answer').focus({preventScroll:true});else (isMap?$('map-destinations'):$('story-text')).focus({preventScroll:true});}
}
function addContinue(text,handler){const b=document.createElement('button');b.className='continue-button';if(text==='继续'){b.classList.add('drawn-continue');b.setAttribute('aria-label',text);const image=document.createElement('img');image.src=assetURL('assets/art/original/continueBtn.webp');image.alt='';image.width=413;image.height=122;b.append(image);const label=document.createElement('span');label.className='continue-translation';label.textContent='继续';label.setAttribute('aria-hidden','true');b.append(label);}else b.textContent=text+'  →';b.addEventListener('click',handler);$('choices').append(b);}
function act(kind,value){if(notebook.isResetting())return;try{const before=current,after=engine.action(kind,value);journal.recordAction(before,kind,value,after);audio.sound();const reset=isNight(before)&&!isNight(after)&&guideDay(after)>guideDay(before)&&!after.screen.finished;render(after,{narrate:!reset});if(reset){audio.suspend(false);notebook.startReset(after,()=>{if(!active)return;if(document.hidden)pendingNarration=true;else{audio.resume();audio.read(current.screen.parts);}});}}catch(error){toast(error.message);}}
function begin(){notebook.cancelReset();notebook.clearDiscovery();pendingNarration=false;engine=createEngine();guide=createGuide();journal=createJournal();history=[];lastSignature='';active=true;closeDialogs();$('title-screen').hidden=true;$('game').hidden=false;audio.resume();render(engine.snapshot(),{discoveries:false});}
function resume(){if(!saved)return;try{notebook.cancelReset();notebook.clearDiscovery();pendingNarration=false;const next=createEngine();next.importSave(saved.engine);engine=next;history=Array.isArray(saved.history)?saved.history.filter(h=>typeof h?.text==='string'&&typeof h?.location==='string'&&typeof h?.phase==='string'&&Number.isInteger(h?.loop)).slice(-120):[];guide=createGuide(saved.guide);if(saved.guide?.version!==1)guide.recoverHistory(history);journal=createJournal(saved.journal);journal.recoverHistory(history);lastSignature='';active=true;closeDialogs();$('title-screen').hidden=true;$('game').hidden=false;audio.resume();render(engine.snapshot(),{record:false,discoveries:false});}catch{toast('无法读取这份存档。请导入另一份存档，或开始新游戏。');}}
function showTitle(){cinematic.stop();notebook.cancelReset();notebook.clearDiscovery();pendingNarration=false;if(active)save();active=false;audio.suspend(false);$('game').hidden=true;$('title-screen').hidden=false;updateTitle();$('resume-game').hidden?$('begin-game').focus():$('resume-game').focus();}
function closeDialogs(){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}
function openDialog(id){$(id).showModal();}
$('begin-game').addEventListener('click',()=>saved?openDialog('restart-dialog'):begin());$('resume-game').addEventListener('click',resume);$('confirm-restart').addEventListener('click',begin);$('home-button').addEventListener('click',showTitle);
for(const id of ['title-settings','menu-button'])$(id).addEventListener('click',()=>openDialog('settings-dialog'));
for(const id of ['title-credits','credits-button'])$(id).addEventListener('click',()=>openDialog('credits-dialog'));
$('restart-game').addEventListener('click',()=>openDialog('restart-dialog'));
document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',event=>{if(event.target===d){const r=d.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)d.close();}}));
$('inventory-button').addEventListener('click',()=>{$('inventory-items').replaceChildren();if(!current.inventory.length){const p=document.createElement('p');p.className='dialog-note';p.textContent='背包是空的。';$('inventory-items').append(p);}for(const [i,name] of current.inventory.entries()){const row=document.createElement('div');row.className='inventory-item';const mark=document.createElement('span');mark.textContent=['◇','▥','▦','⌁','✿','⌐','♜','▱','⚿'][['Strange artifact','Barricade','Chocolate','Crowbar','Flowers','Gun','Poison','Sandwich','School key'].indexOf(name)]||'◇';row.append(mark,document.createTextNode(itemLabel(name)));$('inventory-items').append(row);}openDialog('inventory-dialog');});
$('history-button').addEventListener('click',()=>{$('history-items').replaceChildren();for(const entry of [...history].reverse()){const row=document.createElement('article');row.className='history-entry';const meta=document.createElement('p');meta.className='eyebrow';meta.textContent='第'+entry.loop+'次循环 · '+phaseLabel(entry.phase)+' · '+locationLabel(entry.location);const text=document.createElement('div');text.className='story-text';setParagraphs(text,historyLabel(entry.text));row.append(meta,text);$('history-items').append(row);}openDialog('history-dialog');});
function refreshDiary(){
 const view=guide.summary(current);$('diary-forecast').textContent=view.forecast.text;$('diary-day').textContent='第'+view.day+'次循环';
 const facts=$('diary-facts');facts.replaceChildren();if(!view.facts.length){const p=document.createElement('p');p.className='dialog-note';p.textContent='尚未记录发现。新的发现会留在这里，跨越每次循环。';facts.append(p);}else for(const fact of view.facts){const row=document.createElement('article');row.className='diary-entry';const meta=document.createElement('p');meta.className='eyebrow';meta.textContent='首次记录 · 第'+fact.loop+'次循环';const text=document.createElement('p');text.textContent=fact.text;row.append(meta,text);facts.append(row);}
 const preparations=$('diary-preparations');preparations.replaceChildren();for(const text of view.preparations){const li=document.createElement('li');li.textContent=text;preparations.append(li);}$('diary-preparation-note').hidden=!!view.preparations.length;
 $('daily-clue-text').textContent=view.clue.used?view.clue.text:current.screen.finished?'第二天到了。':view.clue.available?'今天可以查看一条温和的提示。打开日记不会消耗提示。':'新的一天开始后，就会有新的提示。';
 $('daily-clue-button').disabled=!view.clue.available;$('daily-clue-button').textContent=view.clue.used?'今天的提示已用过':'查看今天的提示';$('daily-clue-note').textContent=view.clue.used?'这条提示可以反复阅读。明天早晨会有新的提示。':'每个游戏日只有一条提示。推进剧情或保存、读档，都不会增加提示。';
}
function openDiary(){if(!active)return;closeDialogs();journal.clearUnread();notebook.clearDiscovery();save();refreshDiary();openDialog('diary-dialog');}
$('diary-button').addEventListener('click',openDiary);
$('daily-clue-button').addEventListener('click',()=>{guide.requestClue(current);save();refreshDiary();});
$('answer').addEventListener('compositionstart',()=>{answerComposing=true;});$('answer').addEventListener('compositionend',()=>{answerComposing=false;});
$('answer-form').addEventListener('submit',event=>{event.preventDefault();if(answerComposing||event.isComposing)return;act('input',$('answer').value);});
$('voice-toggle').addEventListener('click',()=>audio.toggle());$('voice-replay').addEventListener('click',()=>audio.replay());$('read-choices').addEventListener('click',()=>audio.read(spokenChoices(current.screen),{force:true}));
for(const [id,key,numeric] of [['narration-enabled','narrationEnabled'],['voice-volume','voiceVolume',true],['voice-rate','voiceRate',true],['music-enabled','musicEnabled'],['music-volume','musicVolume',true],['large-text','largeText'],['reduced-motion','reducedMotion']]){
 $(id).addEventListener(numeric?'input':'change',()=>{settings[key]=numeric?Number($(id).value):$(id).checked;syncSettings();audio.update();notebook.refreshSettings();cinematic.refreshSettings();if(key==='narrationEnabled'&&settings[key]&&active)audio.read(current.screen.parts);try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings));}catch{}});
}
function download(name,data){const url=URL.createObjectURL(new Blob([data],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export-save').addEventListener('click',()=>{if(!saved&&!active){toast('请先开始游戏，再导出存档。');return;}download('Himawari-save.json',JSON.stringify(active?save():saved));toast('存档已导出。');});
$('import-save').addEventListener('click',()=>$('import-file').click());$('import-file').addEventListener('change',async()=>{const file=$('import-file').files[0];if(!file)return;try{if(file.size>8000000)throw new Error('无效存档');const payload=JSON.parse(await file.text());const probe=createEngine();probe.importSave(payload.engine);saved=payload;try{localStorage.setItem(SAVE_KEY,JSON.stringify(saved));}catch{}resume();toast('存档已导入。');}catch{toast('这个文件不是有效的Himawari存档。');}$('import-file').value='';});
document.addEventListener('keydown',event=>{if(event.defaultPrevented||event.repeat||event.ctrlKey||event.metaKey||event.altKey||document.querySelector('dialog[open]')||!active||/INPUT|TEXTAREA|SELECT/.test(event.target.tagName))return;const screen=current.screen;if(event.code==='Space'&&event.target.tagName==='BUTTON')return;if(event.code==='Space'){event.preventDefault();audio.toggle();}else if(event.key==='Enter'&&event.target.tagName!=='BUTTON'){if(screen.kind==='intro'&&!screen.finished){event.preventDefault();act('next');}else if(screen.needsContinue){event.preventDefault();act('continue');}else if(continuation(screen)){event.preventDefault();act('choice',continuation(screen).choice);}}else if(/^[1-4]$/.test(event.key)&&screen.kind==='story'&&!screen.input){const choice=Number(event.key);if(screen.options.some(o=>o.choice===choice&&o.raw.trim())){event.preventDefault();act('choice',choice);}}});
function suspendMedia(){audio.suspend(true);notebook.suspend();}
function resumeMedia(){if(document.hidden)return;if(notebook.isAlbumOpen()){notebook.resumeMedia();return;}if(active&&!notebook.isResetting()){audio.resume();if(pendingNarration){pendingNarration=false;audio.read(current.screen.parts);}}}
window.addEventListener('pagehide',()=>{if(active)save();suspendMedia();});window.addEventListener('pageshow',resumeMedia);document.addEventListener('visibilitychange',()=>document.hidden?suspendMedia():resumeMedia());
syncSettings();updateTitle();$('cover-flower').src=assetURL('assets/art/original/hima3.webp');document.querySelector('.cover-art').append(translatedSigns('mapa_joc'));document.querySelector('.cover-art').style.backgroundImage='url("'+assetURL('assets/art/original/mapa_joc.webp')+'")';
// A read-only release diagnostic helps verify the browser without exposing or
// mutating gameplay. The controller remains private to the application.
window.Himawari=Object.freeze({version:'1.5.0-zh-CN',snapshot:()=>engine.snapshot(),narrator:'Julian',language:'zh-CN'});
