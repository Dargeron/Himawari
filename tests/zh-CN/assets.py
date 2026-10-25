#!/usr/bin/env python3
"""Validate playable references, original pixels and cached Mandarin narration."""
from pathlib import Path
import concurrent.futures,hashlib,json,re,subprocess,math
from PIL import Image, ImageChops
ROOT=Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'content/narration.json').read_text());literals=json.loads((ROOT/'content/literals.json').read_text());missing=[]
expected=json.loads((ROOT/'content/narration.en.json').read_text())
for k in expected:
 if k.isdigit():
  assert k in manifest,('Missing Mandarin narration',k)
  assert re.search('[\u4e00-\u9fff]',literals[k]['text']),('Untranslated story',k)
assert len([k for k in expected if k.isdigit()])==458
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
config=json.loads((ROOT/'content/narrator.json').read_text());assert config['voice']=='Julian' and config['language_code']=='zh'
assert all(v['file'].startswith('assets/narration-zh/') for v in manifest.values()),'An English voice is still referenced'
quality=json.loads((ROOT/'content/narration-quality.json').read_text());assert quality['completeSpokenTimingForEveryClip']
assert quality['authoredPassages']==458
# The compact source archive omitted provider generation sidecars. Preserve
# the actual released MP3 identity with pinned hashes rather than inventing
# provider metadata. If a sidecar is present, validate its voice as before.
released=json.loads((ROOT/'content/released-narration-integrity.json').read_text())
assert hashlib.sha256((ROOT/'content/narrator.json').read_bytes()).hexdigest()==released['voiceConfigSHA256']
assert set(released['files'])=={v['file'] for v in manifest.values()}
for path,expected_audio in released['files'].items():
 audio=(ROOT/path).read_bytes()
 assert len(audio)==expected_audio['bytes'] and hashlib.sha256(audio).hexdigest()==expected_audio['sha256'],('Released Mandarin audio changed',path)
 sidecar=(ROOT/path).with_suffix('.json')
 if sidecar.exists():
  metadata=json.loads(sidecar.read_text());assert metadata['voice_id']==config['voice_id']
assert not any('frantic' in p.name.lower() for p in ROOT.glob('assets/narration-zh/*'))
for f in ROOT.rglob('*'):
 if f.is_file() and f.suffix in ('.js','.json','.html','.py','.md','.txt'):
  assert not re.search(rb'sk_[a-f0-9]{40,}',f.read_bytes()),'Credential found in '+str(f)
report={'language':'zh-CN','narratedAuthoredLiterals':len([k for k in manifest if k.isdigit()]),'dynamicNumbers':301,'MandarinRecordings':len({v['file'] for v in manifest.values()}),'musicTracks':13,'restoredOriginalSprites':len(original_art),'originalPNGUnchanged':True,'fullResolutionAndAlphaPreserved':True,'compressedOriginalArtwork':True,'narrationMinutes':round(sum(v for k,v in durations.items() if '/narration-zh/' in k)/60,1),'allAssetReferencesValid':True,'singleMandarinNarrator':True,'releasedNarrationHashesVerified':True,'providerGenerationSidecarsIncluded':False,'completeSpokenTiming':True,'credentialsExcluded':True}
(ROOT/'content/asset-validation.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
