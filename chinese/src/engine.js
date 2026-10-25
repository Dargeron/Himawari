import {createCore} from './recovered-core.js';
import {literals, stringCaches} from './content.js';
import {inputValue,relocalizeValue} from './locale.js';

// The recovered controller retains its original packed object layout. These
// adapters replace Unity's rendering, string and audio calls without changing
// the controller's decisions. Display corrections never affect comparisons.
export const flags = ['infoCrash','infoVistNena','infoGorra','infoWarehouse','infoLoop',
  'infoNeighbour','infoSniper','infoEvilGirl','infoFinalboss','infoFermat',
  'infoTakeSandwich','infoHoboSandwich','infoAllergy','infoPoison','infoWeapon',
  'infoGirlParents','infoSchoolNeighbour','item2b1','itemWater','itemFlowers',
  'itemLove','itemGardenerIsGone','itemKillLady','itemBarricade','itemSandWich',
  'itemWeirdArtifact','itemCrowbar','v7_001','v7_009','itemDeadGirl','itemChocolate',
  'itemFirstTimePizza','itemGun','v5a7','itemPoison','v1a3','itemSchoolKey','hobo'];
export const destinations = [
  {id:1,method:'GotoCasa',key:'home',name:'家里',description:'窗里的一点光'},
  {id:2,method:'GotoParque',key:'park',name:'公园',description:'树下的秘密'},
  {id:3,method:'GotoAbocador',key:'scrapyard',name:'废品场',description:'别人遗忘的东西'},
  {id:4,method:'GotoAlmacen',key:'warehouse',name:'仓库区',description:'铁锈、灰尘，还有未解的事'},
  {id:5,method:'GotoPizza',key:'pizzeria',name:'费马的披萨店',description:'一片本地八卦'},
  {id:6,method:'GotoAigua',key:'waterplant',name:'水处理厂',description:'循着水走'},
  {id:7,method:'GotoPasseig',key:'avenue',name:'中央大道',description:'每个人都会经过'},
  {id:8,method:'GotoEscola',key:'school',name:'学校',description:'活到老，学到老'}
];
const GC=4000000, PM=4000256, IM=4000512, INV=4000768;
const INTRO_WRITER=4001024, END_WRITER=4001056, END_IMAGE=4001088;
const phaseNames=['Dawn','Morning','Noon','Afternoon','Dusk'];

export function createEngine({seed=Date.now(),coreFactory=createCore,memory={buffer:new ArrayBuffer(8388608)}}={}) {
  const bytes=new Uint8Array(memory.buffer), ints=new Int32Array(memory.buffer);
  let alloc=4100000, randomState=seed>>>0 || 1;
  const strings=new Map(), intern=new Map();
  const screen={kind:'intro',text:'',raw:'',parts:[],options:[],input:false,ending:0,music:0};
  const listeners=new Set();
  function u32(address) {return ints[address>>>2];}
  function set32(address,value) {ints[address>>>2]=value;}
  function reserve(size) {
    const address=alloc; alloc=(alloc+size+7)&~7;
    if(alloc>=memory.buffer.byteLength) throw new Error('故事内存已满。请保存并重新读取，继续游戏。');
    return address;
  }
  function literal(id) {
    const v=literals[id];
    return {raw:v?.raw??'',text:v?.text??'',parts:[{id:Number(id)}]};
  }
  function putString(value) {
    if(typeof value==='string')value={raw:value,text:value,parts:[{text:value}]};
    const key=JSON.stringify(value);
    if(intern.has(key))return intern.get(key);
    const p=reserve(12+value.raw.length*2+2);
    set32(p+8,value.raw.length);
    const utf=new Uint16Array(memory.buffer,p+12,value.raw.length+1);
    for(let i=0;i<value.raw.length;i++)utf[i]=value.raw.charCodeAt(i);
    strings.set(p,value);intern.set(key,p);return p;
  }
  function str(p) {return strings.get(p) || {raw:'',text:'',parts:[]};}
  function concat(...pointers) {
    const values=pointers.map(str);
    return putString({raw:values.map(v=>v.raw).join(''),text:values.map(v=>v.text).join(''),parts:values.flatMap(v=>v.parts)});
  }
  for(const [address,id] of Object.entries(stringCaches))set32(Number(address),putString(literal(id)));
  const staticEnd=alloc;
  const rootAddresses=[72,80,84,88,92,96,100].map(offset=>GC+offset).concat(IM+44);
  function compact() {
    // Only these persistent fields retain a generated string. Unity's temporary
    // concatenation arrays never survive a controller call. Reclaim them between
    // actions so long playthroughs and exported saves stay small.
    const roots=rootAddresses.map(address=>[address,u32(address),str(u32(address))]);
    for(const [p,value] of strings)if(p>=staticEnd){strings.delete(p);intern.delete(JSON.stringify(value));}
    alloc=staticEnd;
    for(const [address,p,value] of roots)if(p>=staticEnd)set32(address,putString(value));
  }
  // Object discovery type handles, normally filled by IL2CPP initialization.
  set32(1957464,PM);set32(1957456,IM);set32(1957460,INV);
  function options(...pointers) {screen.options=pointers.map((p,i)=>({...str(p),choice:i+1}));}
  function write(p) {
    const value=str(p);screen.text=value.text;screen.raw=value.raw;screen.parts=value.parts;
  }
  function showMap() {screen.kind='map';screen.text='';screen.raw='';screen.parts=[];screen.options=[];screen.ending=0;bytes[PM+57]=0;}
  const runtime={
    memory,
    f15638:()=>{}, // GC write barrier / base constructor.
    f16624:()=>{}, // Ending image colour.
    f20604:p=>putString(String(u32(p))),
    f22860:(image,sprite)=>{screen.ending=sprite-4001200+1;},
    f23815:()=>{},f23834:()=>{},f23889:()=>{},f24039:()=>{},
    f26874:(a,b,c)=>concat(a,b,c),
    f26888:(a,b)=>concat(a,b),
    f26893:(a,b)=>Number(str(a).raw===str(b).raw),
    f27066:p=>concat(...Array.from({length:u32(p+12)},(_,i)=>u32(p+16+i*4))),
    f29529:type=>type,
    f30625:()=>{randomState^=randomState<<13;randomState^=randomState>>>17;randomState^=randomState<<5;return (randomState>>>0)/4294967296;},
    f31839:()=>{},
    f31843:id=>{screen.music=id;},
    f31864:()=>{},
    f31865:()=>{},
    f31866:(writer,text)=>{screen.kind='intro';write(text);screen.options=[];},
    f31869:(pm,a,b,c,d)=>options(a,b,c,d),
    f31870:(pm,text)=>{screen.kind='story';write(text);},
    f31876:(pm,a,b,c)=>options(a,b,c),
    f31879:(pm,a)=>options(a),
    // HidePanel also enables the map behind the independent intro overlay.
    // At midnight that overlay has just opened: preserve it until HideIntro.
    f31885:()=>{if(!bytes[IM+40])showMap();},
    f31886:showMap,
    f31888:()=>{},
    f31890:(pm,text)=>{screen.kind='story';write(text);},
    f31891:(pm,a,b)=>options(a,b),
    f31901:()=>{},
    f32880:(type,count)=>{const p=reserve(16+count*4);set32(p+12,count);return p;},
    f33424:()=>{}, f34102:()=>{}
  };
  const core=coreFactory(runtime);
  core.GameController_Constructor(GC,0);
  core.IntroManager_Constructor(IM,0);
  set32(GC+64,1);
  set32(IM+12,GC);set32(IM+16,PM);set32(IM+20,INTRO_WRITER);set32(IM+24,END_WRITER);set32(IM+28,END_IMAGE);
  for(let i=0;i<5;i++)set32(IM+48+i*4,4001200+i);
  core.GameController_Start(GC,0);
  function snapshot() {
    const state=Object.fromEntries(flags.map((key,i)=>[key,Boolean(bytes[GC+12+i])]));
    state.t=u32(GC+64);state.loop=u32(GC+68);state.place=u32(GC+76);
    state.node=str(u32(GC+80)).raw;state.introNode=str(u32(IM+44)).raw;
    state.phase=phaseNames[Math.max(0,Math.min(4,state.t-1))];
    const inventory=[[37,'Strange artifact'],[35,'Barricade'],[42,'Chocolate'],[38,'Crowbar'],[31,'Flowers'],[44,'Gun'],[46,'Poison'],[36,'Sandwich'],[48,'School key']].filter(([offset])=>bytes[GC+offset]).map(([,name])=>name);
    return {state,screen:structuredClone({...screen,input:!!bytes[PM+57],needsContinue:screen.kind==='story'&&!bytes[PM+57]&&!screen.options.some(o=>o.raw.trim()),finished:screen.raw==='GAME OVER :)'}),inventory};
  }
  function notify() {const value=snapshot();for(const fn of listeners)fn(value);return value;}
  function action(kind,value) {
    if(alloc>6500000)compact();
    if(kind==='next') {
      if(screen.kind!=='intro'||snapshot().screen.finished)throw new Error('这里无法继续。');
      core.IntroManager_Next(IM,0);
    }
    else if(kind==='go') {
      if(screen.kind!=='map')throw new Error('请从地图选择目的地。');
      const d=destinations.find(d=>d.id===Number(value));if(!d)throw new Error('未知目的地。');
      bytes[PM+57]=0;screen.ending=0;core['GameController_'+d.method](GC,0);
    } else if(kind==='choice') {
      if(screen.kind!=='story'||bytes[PM+57])throw new Error('这里没有可选项。');
      if(value<1||value>screen.options.length)throw new Error('未知选项。');
      if(!screen.options[value-1].raw.trim())throw new Error('这个选项无法选择。');
      core['GameController_Option'+value](GC,0);
    } else if(kind==='continue') {
      // One original warehouse response clears every option. Give that
      // otherwise stranded response its normal default Option1 continuation.
      if(!snapshot().screen.needsContinue)throw new Error('需要作出选择。');
      core.GameController_Option1(GC,0);
    } else if(kind==='input') {
      if(!bytes[PM+57])throw new Error('这里无需回答。');
      bytes[PM+57]=0;core.GameController_TextOption(GC,putString(inputValue(value)),0);
    } else throw new Error('未知操作。');
    return notify();
  }
  function exportSave() {
    compact();
    const roots=new Set(rootAddresses.map(u32));
    return {format:'himawari-remake-1',seed,randomState,objects:{gc:Array.from(bytes.slice(GC,GC+104)),pm:Array.from(bytes.slice(PM,PM+64)),im:Array.from(bytes.slice(IM,IM+136))},strings:Array.from(strings).filter(([p])=>p>=staticEnd&&roots.has(p)),screen:structuredClone(screen),alloc};
  }
  function importSave(save) {
    if(save?.format!=='himawari-remake-1')throw new Error('这份存档不兼容。');
    // Dynamic strings must start after the immutable recovered string table.
    // Accepting a lower allocation boundary would let a malformed import make
    // later player input overwrite story memory.
    if(!Number.isInteger(save.alloc)||save.alloc>8388608||save.alloc<staticEnd)throw new Error('无效存档。');
    const validString=v=>v&&typeof v.raw==='string'&&typeof v.text==='string'&&v.raw.length<100000&&v.text.length<100000&&Array.isArray(v.parts)&&v.parts.every(p=>p&&((Number.isInteger(p.id)&&p.id>=0&&p.id<3947)||typeof p.text==='string'));
    if(!Array.isArray(save.strings)||!save.strings.every(entry=>Array.isArray(entry)&&entry.length===2&&Number.isInteger(entry[0])&&entry[0]>=staticEnd&&entry[0]%8===0&&validString(entry[1])&&entry[0]+14+entry[1].raw.length*2<=save.alloc))throw new Error('存档文字无效。');
    const ranges=save.strings.map(([p,v])=>[p,p+14+v.raw.length*2]).sort((a,b)=>a[0]-b[0]);
    if(ranges.some((range,i)=>i&&range[0]<ranges[i-1][1]))throw new Error('存档文字无效。');
    if(!['intro','map','story'].includes(save.screen?.kind)||!validString(save.screen)||!Array.isArray(save.screen.options)||save.screen.options.length>4||!save.screen.options.every((o,i)=>validString(o)&&o.choice===i+1)||!Number.isInteger(save.screen.music)||save.screen.music<0||save.screen.music>11)throw new Error('故事状态无效。');
    for(const [name,p,length] of [['gc',GC,104],['pm',PM,64],['im',IM,136]]) {
      if(!Array.isArray(save.objects?.[name])||save.objects[name].length!==length||!save.objects[name].every(n=>Number.isInteger(n)&&n>=0&&n<=255))throw new Error('存档对象无效。');
    }
    const pointers=new Set(strings.keys());for(const [p] of save.strings)pointers.add(p);
    const pointer=(object,offset)=>save.objects[object].slice(offset,offset+4).reduce((n,b,i)=>n+b*2**(i*8),0);
    for(const [object,offsets] of [['gc',[72,80,84,88,92,96,100]],['im',[44]]])for(const offset of offsets){const p=pointer(object,offset);if(p&&!pointers.has(p))throw new Error('存档指针无效。');}
    for(const [name,p] of [['gc',GC],['pm',PM],['im',IM]]) {
      bytes.set(save.objects[name],p);
    }
    for(const [p,original] of save.strings){const v=relocalizeValue(original);if(p<4100000||p+12+v.raw.length*2>=8388608)throw new Error('存档文字无效。');strings.set(p,v);intern.set(JSON.stringify(v),p);set32(p+8,v.raw.length);const utf=new Uint16Array(memory.buffer,p+12,v.raw.length+1);for(let i=0;i<v.raw.length;i++)utf[i]=v.raw.charCodeAt(i);}
    randomState=save.randomState>>>0;seed=save.seed;alloc=save.alloc;Object.assign(screen,relocalizeValue(save.screen),{options:save.screen.options.map(relocalizeValue)});return notify();
  }
  return {action,snapshot,exportSave,importSave,subscribe(fn){listeners.add(fn);return()=>listeners.delete(fn);},
    // Test-only access for original-WASM equivalence and ending fixture checks.
    debug:{memory,runtime,core,GC,IM,PM,set32,putString,str,
      capture(){return {gc:bytes.slice(GC,GC+104),pm:bytes.slice(PM,PM+64),im:bytes.slice(IM,IM+136),screen:structuredClone(screen),roots:rootAddresses.map(address=>[address,str(u32(address))]),randomState};},
      restore(save){bytes.set(save.gc,GC);bytes.set(save.pm,PM);bytes.set(save.im,IM);Object.assign(screen,structuredClone(save.screen));randomState=save.randomState;for(const [address,value] of save.roots||[])if(u32(address)>=staticEnd)set32(address,putString(value));}
    }};
}
