import {literals} from './content.js';

// This observer only reads snapshots. Assistance never changes the controller.
const diaryFlags = {
  infoGorra:1891,infoWarehouse:1892,infoHoboSandwich:1893,infoCrash:1894,
  infoVistNena:1895,infoFermat:1896,infoEvilGirl:1897,infoNeighbour:1898,
  infoLoop:1899,infoAllergy:1900,infoSniper:1901,infoWeapon:1903,
  infoSchoolNeighbour:1905,infoGirlParents:1906
};
const diaryEvents = {
  wood:{literal:1960,text:'I collected wooden planks, nails, and a hammer at the scrapyard.'},
  barricade:{literal:2318,text:'I barricaded the door with my bed and the planks. I had to stay home for the rest of the day.'},
  love:{literal:1958,text:'The street sweeper left after deciding to pursue love instead of duty.'},
  gun:{literal:2286,text:'I found the sniper’s gun in the warehouse and threw it into a potato field.'},
  herbicide:{literal:2221,text:'I used the herbicide to clean Fermat’s toilet and refilled its bottle with plain water.'},
  neighbourStopped:{literal:2470,text:'I stopped my neighbour’s attack. Then a sniper shot the sunflower.'},
  substitute:{literal:2325,text:'The children in the park mentioned a substitute teacher who had not arrived at school.'},
  schoolEntry:{literal:2351,text:'I entered the school as the expected substitute teacher and was given directions to the classroom.'}
};
const endingDiary = {1:1898,2:1901,3:1902,4:1904};
const endingReveals = {1:[2468,2469],2:[2470],3:[2472],4:[2474,2475],5:[2477,2478,2479]};
const clueTexts = {
  first:'Ordinary conversations may matter more than they seem. Listen before deciding what to do with the day.',
  connections:'A familiar emblem can connect people to places. Follow the connections you have actually noticed.',
  neighbour:'The people carrying out a plan have lives of their own. Watch what your neighbour and the street sweeper care about.',
  feelings:'Duty and affection are pulling someone in different directions. Listen closely when he talks about her.',
  sniper:'A shot needs more than someone willing to fire it. Think about what you have learned of the preparations.',
  weapon:'Knowing where a danger begins is useful even when you cannot get inside yet. Other places may offer a way past the obstacle.',
  poison:'Think back to people who reacted oddly to your sunflower. Something ordinary in their surroundings may deserve a closer look.',
  fermat:'Fermat’s reaction still seems suspicious. Pay attention to what is around you when you have a reason to spend time there.',
  destroyer:'That voice sounded familiar. Your earlier conversations may connect her to a place where people leave personal traces.',
  school:'Getting into the school may depend on understanding its everyday routine. The people outside it can know more than the gatekeeper.',
  inside:'You have reached the school. Listen to directions and notice which rooms connect to the person you are investigating.',
  preparations:'Some discoveries survive the loop; things you do during the day do not. Check which precautions you have repeated today.'
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
  function recoverHistory(history){for(const h of Array.isArray(history)?history:[]){if(typeof h?.text!=='string'||!validDay(h.loop))continue;for(const [ending,ids] of Object.entries(endingReveals)){if(ids.some(id=>h.text.includes(literals[id].text))){const n=Number(ending);if(!memory.seenEndings.includes(n))memory.seenEndings.push(n);if(n===3||n===4)add('ending:'+n,h.loop);}}}}
  function forecast(s){
    if(s.screen.finished)return {known:true,ending:0,text:'The sunflower survived. Tomorrow is here.'};
    const st=s.state,next=!st.itemLove?1:!st.itemGun?2:!st.itemPoison?3:!st.infoEvilGirl?4:0;
    if(next===0)return {known:true,ending:0,text:'The threats I know have been dealt with for tonight.'};
    if(!memory.seenEndings.includes(next))return {known:false,ending:0,text:'Tonight is uncertain. I haven’t seen what comes next.'};
    return {known:true,ending:next,text:[null,'Tonight, as things stand: my neighbour’s attack.','Tonight, as things stand: the sniper’s shot.','Tonight, as things stand: poison.','Tonight, as things stand: the Destroyer of Suns.'][next]};
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
  function summary(s){return {day:guideDay(s),facts:memory.facts.map(f=>({...f,text:factText(f.id)})),forecast:forecast(s),clue:clue(s),preparations:[s.state.itemLove?'The street sweeper has chosen love.':'',s.state.itemGun?'The sniper’s weapon has been removed.':'',s.state.itemPoison?'The herbicide has been replaced with water.':''].filter(Boolean)};}
  return {observe,recoverHistory,forecast,clue,requestClue,summary,exportSave:()=>structuredClone(memory)};
}
