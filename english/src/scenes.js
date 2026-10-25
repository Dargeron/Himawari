import {sceneIllustrations} from './scene-manifest.js';
import {originalScene} from './graphics.js';
export function illustrationKey(s){
 if(s.screen.kind==='map')return null;
 const ids=s.screen.parts.filter(p=>Number.isInteger(p.id)).map(p=>p.id);
 if(ids.includes(1890))return 'diary';
 const key=ids.join('-');if(sceneIllustrations[key])return key;
 for(const id of [...ids].reverse())if(sceneIllustrations[String(id)])return String(id);
 return null;
}
export function sceneArtPath(s){const key=illustrationKey(s);return key?sceneIllustrations[key].asset:'assets/art/original/'+originalScene(s)+'.webp';}
