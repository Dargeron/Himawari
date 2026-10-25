#!/usr/bin/env python3
"""Cache Harry's narration. Credentials are never copied into a build.
Existing successful batches are reused. Included-credit preflight prevents
paid overage. A interrupted paid request is never retried automatically.
Usage: python3 tools/generate_narration.py --key-file /private/key
"""
from pathlib import Path
import argparse,base64,concurrent.futures,difflib,hashlib,json,os,re,time,urllib.request,urllib.error
ROOT=Path(__file__).resolve().parents[1]
CONFIG=json.loads((ROOT/'content/narrator.json').read_text())
VOICE=CONFIG['voice_id'];MODEL=CONFIG['model_id'];OUT=ROOT/'assets/narration'

def main():
 p=argparse.ArgumentParser();p.add_argument('--key-file',type=Path);p.add_argument('--workers',type=int,default=2);p.add_argument('--only-first',action='store_true');p.add_argument('--manifest-only',action='store_true');a=p.parse_args()
 key=a.key_file.read_text().strip() if a.key_file else os.environ.get('ELEVENLABS_API_KEY','')
 if not key and not a.manifest_only:raise SystemExit('Supply credentials privately.')
 OUT.mkdir(parents=True,exist_ok=True);entries=json.loads((ROOT/'content/literals.json').read_text());unique={};alias={}
 for k,v in entries.items():
  i=int(k);s=v['text'].strip()
  if not (1838<=i<=2355 or 2465<=i<=2479):continue
  if not re.search('[A-Za-z]',s) or len(s)<5:continue
  if re.match(r'^(Going to |Option [1-4] - |Default case|Resetting |Text answer:|intro\d*$)',s):continue
  if s=='< Continue >':continue
  if s in unique:alias[str(i)]=unique[s]
  else:unique[s]=str(i)
 # The original approved Harry opening is reused byte for byte.
 for i in range(301):unique[str(i)]='number:'+str(i)
 batches=[];items=[];text=''
 for phrase,i in unique.items():
  tag='[worried] ' if i in ('2465','2466','2467','2472','2474') else '[quietly] ' if i in ('2476','2477','2478','2479') else ''
  if not items:tag=tag or '[tense] '
  segment=tag+phrase+'\n\n'
  if items and len(text)+len(segment)>4500:
   batches.append((text,items));items=[];text='';segment=(tag or '[tense] ')+phrase+'\n\n'
  start=len(text)+len(segment)-len(phrase)-2;text+=segment
  items.append({'id':i,'start':start,'end':start+len(phrase)})
 if items:batches.append((text,items))
 # A separate supplemental batch preserves all cached story batches. It lets
 # offline playback say arbitrary loop counts and spell player-entered names
 # using Harry, without a second narrator or runtime API credentials.
 extra='[quietly] ';extra_items=[]
 for word in ['hundred','thousand','million','billion','and','minus','point','Martin']:
  start=len(extra);extra+=word+'.\n\n';extra_items.append({'id':'word:'+word,'start':start,'end':start+len(word)})
 for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
  extra+='The letter ';start=len(extra);extra+=letter+'.\n\n';extra_items.append({'id':'letter:'+letter,'start':start,'end':start+1})
 batches.append((extra,extra_items))
 missing=[]
 for n,(text,items) in enumerate(batches):
  name='harry-'+hashlib.sha256((VOICE+MODEL+text).encode()).hexdigest()[:16]
  if not (OUT/(name+'.json')).exists():missing.append((n,text,items,name))
 if a.only_first:missing=missing[:1]
 if not a.manifest_only and missing:
  req=urllib.request.Request('https://api.elevenlabs.io/v1/user/subscription',headers={'xi-api-key':key})
  with urllib.request.urlopen(req,timeout=45) as r:sub=json.load(r)
  remaining=sub['character_limit']-sub['character_count'];estimated=sum(len(t) for _,t,_,_ in missing)*0.5
  print(json.dumps({'unique_passages':len(unique),'batches':len(batches),'missing_batches':len(missing),'estimated_credits':estimated,'remaining_credits':remaining}),flush=True)
  if estimated>remaining or sub.get('can_extend_character_limit',False):
   if estimated>remaining:raise SystemExit('Not enough included credits. No request sent.')
  def generate(job):
   n,text,items,name=job
   payload={'text':text,'model_id':MODEL,'language_code':'en','voice_settings':CONFIG['voice_settings'],'seed':4104}
   req=urllib.request.Request(f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE}/with-timestamps?output_format=mp3_44100_128',data=json.dumps(payload).encode(),headers={'xi-api-key':key,'Content-Type':'application/json'},method='POST')
   for attempt in range(4):
    try:
     with urllib.request.urlopen(req,timeout=300) as r:data=json.load(r)
     break
    except urllib.error.HTTPError as e:
     if e.code==429 and attempt<3:time.sleep(3*(attempt+1));continue
     raise RuntimeError(f'Batch {n}: HTTP {e.code}: '+e.read().decode()[:500]) from None
    except (TimeoutError,OSError):raise RuntimeError(f'Batch {n}: interrupted paid request; inspect provider history before retrying.') from None
   audio=base64.b64decode(data.pop('audio_base64'));(OUT/(name+'.mp3')).write_bytes(audio)
   data.update(items=items,source_text=text,voice_id=VOICE,model_id=MODEL)
   (OUT/(name+'.json')).write_text(json.dumps(data,ensure_ascii=False))
   print(json.dumps({'completed_batch':n,'passages':len(items),'audio_bytes':len(audio)}),flush=True)
  failures=[]
  with concurrent.futures.ThreadPoolExecutor(max_workers=max(1,min(2,a.workers))) as pool:
   futures={pool.submit(generate,j):j[0] for j in missing}
   for f in concurrent.futures.as_completed(futures):
    try:f.result()
    except Exception as e:failures.append(str(e));print(str(e),flush=True)
 else:failures=[]
 manifest={'2464':{'file':'assets/narration/Harry-opening.mp3','start':0,'end':35.5}}
 for text,items in batches:
  name='harry-'+hashlib.sha256((VOICE+MODEL+text).encode()).hexdigest()[:16];file=OUT/(name+'.json')
  if not file.exists():continue
  data=json.loads(file.read_text());alignment=data.get('alignment') or data.get('normalized_alignment')
  if not alignment:raise SystemExit('No alignment in '+name)
  aligned=''.join(alignment['characters']);mapping={}
  if aligned==text:mapping=dict(enumerate(range(len(text))))
  else:
   for block in difflib.SequenceMatcher(None,text,aligned,autojunk=False).get_matching_blocks():
    for j in range(block.size):mapping[block.a+j]=block.b+j
  starts=alignment['character_start_times_seconds'];ends=alignment['character_end_times_seconds']
  for n,item in enumerate(items):
   indices=[mapping[j] for j in range(item['start'],item['end']) if j in mapping]
   if len(indices)<0.9*(item['end']-item['start']):raise SystemExit('Alignment mismatch for '+str(item['id']))
   start=max(0,starts[indices[0]]-0.025);end=ends[indices[-1]]+0.10
   if n+1<len(items):
    next_indices=[mapping[j] for j in range(items[n+1]['start'],items[n+1]['end']) if j in mapping]
    if next_indices:end=min(end,starts[next_indices[0]]-0.015)
   manifest[item['id']]={'file':'assets/narration/'+name+'.mp3','start':round(start,3),'end':round(max(start+.05,end),3)}
 for i,first in alias.items():
  if first in manifest:manifest[i]=manifest[first]
 (ROOT/'content/narration.json').write_text(json.dumps(manifest,indent=2));(ROOT/'src/narration-manifest.js').write_text('export const narrationManifest = '+json.dumps(manifest)+';\n')
 print(json.dumps({'narrated_literals':len(manifest),'failed_batches':failures}),flush=True)
 if failures:raise SystemExit(1)
if __name__=='__main__':main()
