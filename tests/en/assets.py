#!/usr/bin/env python3
"""Validate the playable asset references and cached Harry recordings offline."""
from pathlib import Path
import concurrent.futures,hashlib,json,re,subprocess,math
from PIL import Image, ImageChops
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'content/narration.json').read_text());literals=json.loads((ROOT/'content/literals.json').read_text());missing=[]
for k,v in literals.items():
 i=int(k);text=v['text'].strip()
 if not (1838<=i<=2355 or 2464<=i<=2479):continue
 if not re.search('[A-Za-z]',text) or len(text)<5:continue
 if re.match(r'^(Going to |Option [1-4] - |Default case|Resetting |Text answer:|intro\d*$)',text) or text=='< Continue >':continue
 if k not in manifest:missing.append(k)
assert not missing,('Missing narration',missing)
files=sorted({ROOT/entry['file'] for entry in manifest.values()}|set(ROOT.glob('assets/music/*.m4a')))
def probe(p):
 r=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(p)],capture_output=True,text=True,check=True)
 duration=float(json.loads(r.stdout)['format']['duration']);assert duration>0,p;return str(p.relative_to(ROOT)),duration
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:durations=dict(pool.map(probe,files))
for k,entry in manifest.items():
 assert 0<=entry['start']<entry['end']<=durations[entry['file']]+.25,(k,entry,durations[entry['file']])
for i in range(301):assert 'number:'+str(i) in manifest
original_art=json.loads((ROOT/'content/original-art.json').read_text())
assert len(original_art)==25
for name,entry in original_art.items():
 f=ROOT/entry['asset'];png=f.with_suffix('.png')
 assert hashlib.sha256(png.read_bytes()).hexdigest()==entry['pngSHA256'],name
 with Image.open(png) as author, Image.open(f) as im:
  original=author.convert('RGBA');compressed=im.convert('RGBA')
  assert hashlib.sha256(original.tobytes()).hexdigest()==entry['pixelsSHA256'],('Author PNG pixels changed',name)
  assert list(im.size)==entry['dimensions'],name
  assert compressed.getchannel('A').tobytes()==original.getchannel('A').tobytes(),('Artwork alpha changed',name)
  compression=json.loads((ROOT/'content/art-compression.json').read_text())['assets'][entry['asset']]
  assert hashlib.sha256(f.read_bytes()).hexdigest()==compression['sha256'],name
  if compression['lossless']:assert compressed.tobytes()==original.tobytes(),name
  for bg in ['white','black']:
   a=Image.alpha_composite(Image.new('RGBA',im.size,bg),compressed).convert('RGB')
   b=Image.alpha_composite(Image.new('RGBA',im.size,bg),original).convert('RGB')
   hist=ImageChops.difference(a,b).histogram();mse=sum((i%256)**2*n for i,n in enumerate(hist))/(im.width*im.height*3)
   assert mse==0 or 10*math.log10(255**2/mse)>=40,('Artwork compression quality',name)

assets=json.loads((ROOT/'content/assets.json').read_text())
for path,entry in assets.items():
 f=ROOT/path;assert f.is_file(),path
 assert f.stat().st_size==entry['bytes'] and hashlib.sha256(f.read_bytes()).hexdigest()==entry['sha256'],path
assert all(not p.startswith('assets/art/') or p.startswith(('assets/art/original/','assets/art/scenes/')) for p in assets)
config=json.loads((ROOT/'content/narrator.json').read_text());assert config['voice']=='Harry' and config['voice_id']=='SOYHLrjzK2X1ezoPC6cr'
opening_hash=hashlib.sha256((ROOT/'assets/narration/Harry-opening.mp3').read_bytes()).hexdigest()
assert opening_hash==config['opening_sha256'],'The approved original Harry opening has changed'
assert not any('frantic' in p.name.lower() for p in ROOT.glob('assets/narration/*'))
original=ROOT.parent/'voice-auditions/02-harry.mp3'
if original.exists():assert hashlib.sha256(original.read_bytes()).digest()==hashlib.sha256((ROOT/'assets/narration/Harry-opening.mp3').read_bytes()).digest()
for f in ROOT.rglob('*'):
 if f.is_file() and f.suffix in ('.js','.json','.html','.py','.md','.txt'):
  assert not re.search(rb'sk_[a-f0-9]{40,}',f.read_bytes()),'Credential found in '+str(f)
report={'narratedAuthoredLiterals':len([k for k in manifest if k.isdigit()]),'dynamicNumbers':301,'HarryRecordings':len(list(ROOT.glob('assets/narration/*.mp3'))),'musicTracks':13,'restoredOriginalSprites':len(original_art),'originalPNGUnchanged':True,'fullResolutionAndAlphaPreserved':True,'compressedOriginalArtwork':True,'minorTextCorrections':len(json.loads((ROOT/'content/text-corrections.json').read_text())),'narrationMinutes':round(sum(v for k,v in durations.items() if '/narration/' in k)/60,1),'allAssetReferencesValid':True,'originalHarryOpeningUnchanged':True,'credentialsExcluded':True}
(ROOT/'content/asset-validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
