#!/usr/bin/env python3
"""Make lighter original drawings; keep author PNGs, dimensions and alpha."""
from pathlib import Path
from PIL import Image, ImageChops
import io, json, hashlib, math
ROOT=Path(__file__).resolve().parents[1]
EN=ROOT
rows={}
for path in sorted(EN.glob('assets/art/original/*.webp')):
 original=path.read_bytes()
 with Image.open(path.with_suffix('.png')) as author:
  # Keep the tiny controls, blank textures, and hand-lettered UI lossless.
  lossless=path.name in {'continueBtn.webp','CUADRO_DE_TEXTO.webp','InputFieldBackground.webp','UISprite.webp','blanco.webp','negro.webp'}
  output=io.BytesIO();author.save(output,'WEBP',quality=95,lossless=lossless,method=6,exact=True)
  compressed=output.getvalue()
  if len(compressed)>len(original):compressed=original;lossless=True
  recovered=author.convert('RGBA')
  with Image.open(io.BytesIO(compressed)) as image:
   rendered=image.convert('RGBA');assert rendered.size==recovered.size
   assert rendered.getchannel('A').tobytes()==recovered.getchannel('A').tobytes()
   psnr=[]
   for bg in ['white','black']:
    a=Image.alpha_composite(Image.new('RGBA',rendered.size,bg),rendered).convert('RGB')
    b=Image.alpha_composite(Image.new('RGBA',recovered.size,bg),recovered).convert('RGB')
    hist=ImageChops.difference(a,b).histogram();mse=sum((i%256)**2*n for i,n in enumerate(hist))/(rendered.width*rendered.height*3)
    psnr.append(99.0 if mse==0 else 10*math.log10(255**2/mse))
   assert min(psnr)>=40,(path.name,psnr)
   if lossless:assert rendered.tobytes()==recovered.tobytes(),path.name
  path.write_bytes(compressed)
  rows[str(path.relative_to(EN))]={'sourceBytes':len(original),'compressedBytes':len(compressed),'sha256':hashlib.sha256(compressed).hexdigest(),'lossless':lossless,'quality':None if lossless else 95,'minimumRenderedPSNR':round(min(psnr),2),'dimensions':list(rendered.size),'alphaUnchanged':True,'authorPNGUnchanged':True}
report={'sourceBytes':sum(r['sourceBytes'] for r in rows.values()),'compressedBytes':sum(r['compressedBytes'] for r in rows.values()),'fullResolution':True,'transparencyUnchanged':True,'authorPNGsUnchanged':True,'assets':rows}
for root in [EN]:
 (root/'content/art-compression.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k!='assets'}))
