#!/usr/bin/env python3
"""Build ordinary static files plus a completely offline one-file edition."""
from pathlib import Path
import base64,json,re,argparse,hashlib
ROOT=Path(__file__).resolve().parents[1]
def main():
 p=argparse.ArgumentParser();p.add_argument('--portable',action='store_true');a=p.parse_args()
 # The data files are the editable source of truth. Display text is separate
 # from original comparison strings, so spelling fixes cannot break puzzles.
 literals=json.loads((ROOT/'content/literals.json').read_text());caches=json.loads((ROOT/'content/string-caches.json').read_text())
 (ROOT/'src/content.js').write_text('export const literals = '+json.dumps(literals,ensure_ascii=False)+';\nexport const stringCaches = '+json.dumps(caches)+';\n')
 narration=json.loads((ROOT/'content/narration.json').read_text())
 (ROOT/'src/narration-manifest.js').write_text('export const narrationManifest = '+json.dumps(narration)+';\n')
 scenes=json.loads((ROOT/'content/scene-illustrations.json').read_text())
 (ROOT/'src/scene-manifest.js').write_text('export const sceneIllustrations = '+json.dumps(scenes)+';\n')
 modules=['recovered-core.js','content.js','engine.js','narration-manifest.js','audio.js','graphics.js','scene-manifest.js','scenes.js','cinematic.js','guide.js','journal.js','notebook-ui.js','app.js'];chunks=[]
 for name in modules:
  text=(ROOT/'src'/name).read_text();text=re.sub(r'^import .*?;\n','',text,flags=re.M);text=re.sub(r'\bexport (?=(?:const|function|class|async)\b)','',text);chunks.append(text)
 bundle='/* Himawari 2026 — standalone offline runtime. */\n(()=>{\n'+ '\n'.join(chunks)+'\n})();\n';(ROOT/'game.js').write_text(bundle)
 assets=sorted([*ROOT.glob('assets/art/original/*.webp'),*ROOT.glob('assets/art/scenes/*.webp'),*ROOT.glob('assets/music/*.m4a'),*ROOT.glob('assets/narration/*.mp3')]);manifest={str(f.relative_to(ROOT)):{'bytes':f.stat().st_size,'sha256':hashlib.sha256(f.read_bytes()).hexdigest()} for f in assets}
 (ROOT/'content/assets.json').write_text(json.dumps(manifest,indent=2))
 # Bootstrap knows every required media file plus the complete game runtime.
 preload_assets=dict(manifest)
 for filename in ['game.js','style.css']:
  data=(ROOT/filename).read_bytes()
  preload_assets[filename]={'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest()}
 preload_source=re.sub(r'\bexport (?=(?:const|function|class|async)\b)','',(ROOT/'src/preload.js').read_text())
 preload='(()=>{\n'+preload_source+'\nbootPreloader('+json.dumps(preload_assets,separators=(',',':'))+');\n})();\n'
 (ROOT/'preload.js').write_text(preload)
 (ROOT/'content/preload-assets.json').write_text(json.dumps(preload_assets,indent=2)+'\n')
 html_path=ROOT/'index.html';html=html_path.read_text()
 version=hashlib.sha256(preload.encode()).hexdigest()[:16]
 html=re.sub(r'src="preload\.js(?:\?v=[a-f0-9]+)?"','src="preload.js?v='+version+'"',html)
 html_path.write_text(html)
 if a.portable:
  embedded={str(f.relative_to(ROOT)):base64.b64encode(f.read_bytes()).decode() for f in assets}
  assetcode='const embedded='+json.dumps(embedded,separators=(',',':'))+';const urls=new Map();window.HIMAWARI_ASSET=function(path){if(urls.has(path))return urls.get(path);const b64=embedded[path];if(!b64)return path;const raw=atob(b64);const chunks=[];for(let offset=0;offset<raw.length;offset+=65536){const s=raw.slice(offset,offset+65536);chunks.push(Uint8Array.from(s,c=>c.charCodeAt(0)));}const type=path.endsWith(".webp")?"image/webp":path.endsWith(".mp3")?"audio/mpeg":"audio/mp4";const url=URL.createObjectURL(new Blob(chunks,{type}));urls.set(path,url);delete embedded[path];return url;};'
  html=(ROOT/'index.html').read_text().replace('<link id="game-style" rel="stylesheet" href="style.css">','<style>'+ (ROOT/'style.css').read_text()+'</style>')
  # All media is already in the portable HTML; no network preload is needed.
  html=html.replace('id="game-loading" aria-labelledby=', 'id="game-loading" hidden aria-labelledby=').replace('<div id="app" hidden inert>','<div id="app">')
  html=re.sub(r'<script src="preload\.js[^>]*></script>',lambda _: '<script>'+assetcode+'\n'+bundle.replace('</script','<\\/script')+'</script>',html)

  output=ROOT.parent/'Himawari.html';output.write_text(html);print(json.dumps({'portable':str(output),'bytes':output.stat().st_size}))
 print(json.dumps({'bundle_bytes':len(bundle.encode()),'assets':len(assets),'asset_bytes':sum(x['bytes'] for x in manifest.values())}))
if __name__=='__main__':main()
