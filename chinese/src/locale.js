import {englishHistory} from './english-history.js';
import {literals} from './content.js';
export const phaseLabel = phase=>({Dawn:'黎明',Morning:'早晨',Noon:'中午',Afternoon:'下午',Dusk:'黄昏',Night:'夜晚'})[phase]||phase;
export const itemLabel = item=>({'Strange artifact':'古怪装置','Barricade':'路障','Chocolate':'巧克力','Crowbar':'撬棍','Flowers':'花束','Gun':'枪','Poison':'毒药','Sandwich':'三明治','School key':'学校钥匙'})[item]||item;
export const kindLabel = kind=>({'Diary entry':'日记记录','Quotation':'原文摘录','Person mentioned':'提到的人物','Place visited':'去过的地方','Object recorded':'记录过的物品','theory':'我的猜想','recorded':'已记录'})[kind]||kind;
export const locationLabel = location=>({'Home':'家里','The town':'小镇','The park':'公园','The scrapyard':'废品场','The warehouses':'仓库区','Fermat’s pizzeria':'费马的披萨店','The water plant':'水处理厂','The main avenue':'中央大道','The school':'学校'})[location]||location;
export function inputValue(value){
 const text=String(value),digits=text.replace(/[０-９]/g,c=>String.fromCharCode(c.charCodeAt(0)-0xfee0));
 // Only exact translated equivalents are aliases. Incorrect puzzle answers
 // remain incorrect; neither whitespace nor capitalization is auto-corrected.
 const raw=text==='马丁'?'Martin':digits;
 const display=raw==='Martin'?'马丁':text;
 return {raw,text:display,parts:[{text:display}]};
}
export function relocalizeValue(value){
 const parts=value.parts.map(p=>p.id===undefined?{...p,text:p.text==='Martin'?'马丁':p.text}:p);
 return {...value,parts,text:parts.map(p=>p.id===undefined?p.text:literals[p.id]?.text||'').join('')};
}
// Save history predates passage IDs. Translate only known authored source
// segments, leaving arbitrary player text untouched. Longest matches win.
const historyReplacements=Object.entries(literals).flatMap(([id,v])=>[...new Set([v.raw,englishHistory[id]])].filter(raw=>raw&&raw!==v.text&&raw.length>1).map(raw=>({raw,text:v.text}))).sort((a,b)=>b.raw.length-a.raw.length);
export function historyLabel(text){
 let result=String(text);for(const value of historyReplacements)if(result.includes(value.raw))result=result.split(value.raw).join(value.text);return result;
}
