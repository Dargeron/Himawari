import {historyLabel} from './locale.js';
import {literals} from './content.js';

// This observer only reads snapshots. Assistance never changes the controller.
const diaryFlags = {
  infoGorra:1891,infoWarehouse:1892,infoHoboSandwich:1893,infoCrash:1894,
  infoVistNena:1895,infoFermat:1896,infoEvilGirl:1897,infoNeighbour:1898,
  infoLoop:1899,infoAllergy:1900,infoSniper:1901,infoWeapon:1903,
  infoSchoolNeighbour:1905,infoGirlParents:1906
};
const diaryEvents = {
  wood:{literal:1960,text:'我在废品场拿到了木板、钉子和锤子。'},
  barricade:{literal:2318,text:'我用床和木板封住了门。这一天剩下的时间，我都只能待在家里。'},
  love:{literal:1958,text:'清洁工决定追求爱情，放下职责，然后离开了。'},
  gun:{literal:2286,text:'我在仓库找到狙击手的枪，把它扔进了一块土豆田。'},
  herbicide:{literal:2221,text:'我用除草剂打扫了费马的厕所，再往瓶子里灌满清水。'},
  neighbourStopped:{literal:2470,text:'我阻止了邻居的袭击。随后，一个狙击手射杀了向日葵。'},
  substitute:{literal:2325,text:'公园里的孩子提起一位代课老师，他还没到学校。'},
  schoolEntry:{literal:2351,text:'我以那位学校正在等的代课老师的身份进了学校，并得到了去教室的路线。'}
};
const endingDiary = {1:1898,2:1901,3:1902,4:1904};
const endingReveals = {1:[2468,2469],2:[2470],3:[2472],4:[2474,2475],5:[2477,2478,2479]};
const clueTexts = {
  first:'普通的闲聊，也许比看起来更重要。先听听，再决定今天要做什么。',
  connections:'一个眼熟的徽记，可以把人和地方连起来。沿着你确实注意到的联系找下去。',
  neighbour:'执行计划的人，也有自己的生活。留意邻居和清洁工在乎什么。',
  feelings:'职责和感情，正把一个人拉向不同的方向。他说起她时，仔细听。',
  sniper:'一声枪响，需要的不只是一个愿意开枪的人。想想你已经了解到的那些准备。',
  weapon:'就算暂时进不去，知道危险从哪里开始也很有用。其他地方，也许能提供越过障碍的办法。',
  poison:'回想一下，谁听到你的向日葵时，反应有些古怪。他们周围某件普通的东西，也许值得仔细看看。',
  fermat:'费马的反应还是很可疑。当你有理由在那里多待一会儿时，留意身边的东西。',
  destroyer:'那个声音有些耳熟。之前的交谈，也许能把她和某个留下个人痕迹的地方联系起来。',
  school:'要进学校，也许得先了解它每天的安排。外面的人，可能比门卫知道得更多。',
  inside:'你已经到了学校。听清路线，留意哪些房间和你调查的人有关。',
  preparations:'有些发现能留到下次循环；白天做的事却不能。看看今天你已经重新做过哪些防备。'
};
function guideNight(s){return s.screen.kind==='intro'&&!s.screen.finished&&/^(endIntro[12]|noLove2?|noGun|noPoison2?|noEvil[23]?|victory[234]?)$/.test(s.state.introNode);}
export function guideDay(s){return Math.max(1,s.state.loop-(guideNight(s)?1:0));}
function validDay(n){return Number.isSafeInteger(n)&&n>=1;}
function nativeText(id){return literals[id].text.trim().replace(/^[-–]\s*/,'');}
function factText(id){if(id.startsWith('flag:'))return nativeText(diaryFlags[id.slice(5)]);if(id.startsWith('ending:'))return nativeText(endingDiary[id.slice(7)]);return diaryEvents[id.slice(6)].text;}
const validFacts=new Set([...Object.keys(diaryFlags).map(k=>'flag:'+k),...Object.keys(diaryEvents).map(k=>'event:'+k),'ending:3','ending:4']);

export function createGuide(saved) {
  const memory={version:1,facts:[],seenEndings:[],clue:null};
  if(saved?.version===1){
    for(const fact of Array.isArray(saved.facts)?saved.facts:[]){if(validFacts.has(fact?.id)&&validDay(fact.loop)&&!memory.facts.some(f=>f.id===fact.id))memory.facts.push({id:fact.id,loop:fact.loop});}
    memory.seenEndings=[...new Set((Array.isArray(saved.seenEndings)?saved.seenEndings:[]).filter(n=>Number.isInteger(n)&&n>=1&&n<=5))];
    if(validDay(saved.clue?.day)&&Object.hasOwn(clueTexts,saved.clue.id))memory.clue={day:saved.clue.day,id:saved.clue.id};
  }
  function add(id,day){if(!memory.facts.some(f=>f.id===id))memory.facts.push({id,loop:day});}
  function observe(s){
    const day=guideDay(s),ids=new Set(s.screen.parts.map(p=>p.id));
    for(const [flag] of Object.entries(diaryFlags))if(s.state[flag])add('flag:'+flag,day);
    for(const [flag,n] of [['infoNeighbour',1],['infoSniper',2]])if(s.state[flag]&&!memory.seenEndings.includes(n))memory.seenEndings.push(n);
    for(const [event,entry] of Object.entries(diaryEvents))if(ids.has(entry.literal))add('event:'+event,day);
    for(const [ending,reveals] of Object.entries(endingReveals))if(s.screen.kind==='intro'&&s.screen.ending===Number(ending)&&reveals.some(id=>ids.has(id))){
      const n=Number(ending);if(!memory.seenEndings.includes(n))memory.seenEndings.push(n);if(n===3||n===4)add('ending:'+n,day);
    }
  }
  // Old saves lack observer memory. Only text actually in their reading history
  // can recover an experienced ending; infoFinalboss is set too early in Unity.
  function recoverHistory(history){for(const h of Array.isArray(history)?history:[]){if(typeof h?.text!=='string'||!validDay(h.loop))continue;for(const [ending,ids] of Object.entries(endingReveals)){if(ids.some(id=>historyLabel(h.text).includes(literals[id].text))){const n=Number(ending);if(!memory.seenEndings.includes(n))memory.seenEndings.push(n);if(n===3||n===4)add('ending:'+n,h.loop);}}}}
  function forecast(s){
    if(s.screen.finished)return {known:true,ending:0,text:'向日葵活下来了。明天到了。'};
    const st=s.state,next=!st.itemLove?1:!st.itemGun?2:!st.itemPoison?3:!st.infoEvilGirl?4:0;
    if(next===0)return {known:true,ending:0,text:'我知道的那些威胁，今晚都已经处理好了。'};
    if(!memory.seenEndings.includes(next))return {known:false,ending:0,text:'今晚还不确定。我还没见过接下来会发生什么。'};
    return {known:true,ending:next,text:[null,'照目前的情况，今晚会遭到邻居的袭击。','照目前的情况，今晚会遭到狙击手的枪击。','照目前的情况，今晚会遇到毒药。','照目前的情况，今晚会遇到太阳毁灭者。'][next]};
  }
  function chooseClue(s){
    const st=s.state;
    if(memory.seenEndings.includes(1)&&!st.itemLove)return st.infoAllergy?'feelings':st.infoGorra&&!st.infoWarehouse?'connections':'neighbour';
    if(memory.seenEndings.includes(2)&&!st.itemGun)return st.infoWeapon?'weapon':'sniper';
    if(memory.seenEndings.includes(3)&&!st.itemPoison)return st.infoFermat?'fermat':'poison';
    if(memory.seenEndings.includes(4)&&!st.infoEvilGirl)return memory.facts.some(f=>f.id==='event:schoolEntry')?'inside':st.infoGirlParents||st.infoSchoolNeighbour?'school':'destroyer';
    if(st.infoEvilGirl||memory.seenEndings.length)return 'preparations';
    return st.infoGorra?'connections':'first';
  }
  function clue(s){const day=guideDay(s),used=memory.clue?.day===day;return {day,used,available:!used&&!guideNight(s)&&!s.screen.finished,text:used?clueTexts[memory.clue.id]:''};}
  function requestClue(s){const status=clue(s);if(status.available)memory.clue={day:status.day,id:chooseClue(s)};return clue(s);}
  function summary(s){return {day:guideDay(s),facts:memory.facts.map(f=>({...f,text:factText(f.id)})),forecast:forecast(s),clue:clue(s),preparations:[s.state.itemLove?'清洁工已经选择了爱情。':'',s.state.itemGun?'狙击手的武器已经移走。':'',s.state.itemPoison?'除草剂已经换成清水。':''].filter(Boolean)};}
  return {observe,recoverHistory,forecast,clue,requestClue,summary,exportSave:()=>structuredClone(memory)};
}
