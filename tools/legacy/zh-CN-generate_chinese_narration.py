#!/usr/bin/env python3
"""Offline Mandarin narration. Successful paid requests are cached and reused.
Use --key-file with a credential outside the project; no runtime API access.
"""
from pathlib import Path
import argparse,base64,concurrent.futures,difflib,hashlib,json,re,urllib.request,urllib.error
ROOT=Path(__file__).resolve().parents[1]
def cn_number(n):
 if n==0:return '零'
 digits='零一二三四五六七八九';out='';zero=False
 for value,unit in [(10000,'万'),(1000,'千'),(100,'百'),(10,'十'),(1,'')]:
  d,n=divmod(n,value)
  if d:
   if zero:out+='零';zero=False
   if not (unit=='十' and d==1 and not out):out+=digits[d]
   out+=unit
  elif out and n:zero=True
 return out
def main():
 p=argparse.ArgumentParser();p.add_argument('--key-file',type=Path);p.add_argument('--manifest-only',action='store_true');a=p.parse_args()
 config=json.loads((ROOT/'content/narrator.json').read_text());voice=config['voice_id'];model=config['model_id'];out=ROOT/'assets/narration-zh';out.mkdir(exist_ok=True)
 en=json.loads((ROOT/'content/narration.en.json').read_text());entries=json.loads((ROOT/'content/literals.json').read_text());unique={};aliases={}
 for k in en:
  if not k.isdigit():continue
  phrase=entries[k]['text'].strip()
  if phrase in unique:aliases[k]=unique[phrase]
  else:unique[phrase]=k
 for n in range(301):unique[cn_number(n)]='number:'+str(n)
 for word,text in {'hundred':'百','thousand':'千','million':'百万','billion':'十亿','ten':'十','tenThousand':'万','hundredMillion':'亿','and':'零','minus':'负','point':'点','Martin':'马丁'}.items():
  if text in unique:aliases['word:'+word]=unique[text]
  else:unique[text]='word:'+word
 batches=[];items=[];text=''
 for phrase,i in unique.items():
  # The selected opening audition is already cached, never purchase it twice.
  if i=='2464':continue
  tag='[worried] ' if i in ('2465','2466','2467','2472','2474','2310') else '[quietly] ' if i in ('2476','2477','2478','2479') else ''
  if not items:tag=tag or '[tense] '
  segment=tag+phrase+'\n\n'
  if items and len(text)+len(segment)>3500:batches.append((text,items));items=[];text='';segment=(tag or '[tense] ')+phrase+'\n\n'
  start=len(text)+len(segment)-len(phrase)-2;text+=segment;items.append({'id':i,'start':start,'end':start+len(phrase)})
 if items:batches.append((text,items))
 extra='[quietly] ';extra_items=[]
 for letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ':
  extra+='字母';start=len(extra);extra+=letter+'。\n\n';extra_items.append({'id':'letter:'+letter,'start':start,'end':start+1})
 batches.append((extra,extra_items))
 # Character pronunciation is data, not new story content. An offline syllable
 # table lets the same narrator pronounce player-entered Chinese names too.
 syllables=json.loads((ROOT/'content/name-syllables.json').read_text())
 text='[quietly] ';items=[]
 for syllable,char in syllables.items():
  segment='这个字读作：'+char+'。\n\n'
  if len(text)+len(segment)>3500:batches.append((text,items));text='[quietly] ';items=[]
  start=len(text)+len('这个字读作：');text+=segment;items.append({'id':'syllable:'+syllable,'start':start,'end':start+1})
 if items:batches.append((text,items))
 def name(text):return 'mandarin-'+hashlib.sha256((voice+model+text).encode()).hexdigest()[:16]
 missing=[(n,t,it,name(t)) for n,(t,it) in enumerate(batches) if not (out/(name(t)+'.json')).exists()]
 def request(path,payload=None):
  req=urllib.request.Request('https://api.elevenlabs.io'+path,data=json.dumps(payload,ensure_ascii=False).encode() if payload is not None else None,headers={'xi-api-key':key,'Content-Type':'application/json'})
  try:
   with urllib.request.urlopen(req,timeout=300) as r:return json.load(r)
  except urllib.error.HTTPError as e:raise RuntimeError('HTTP '+str(e.code)+': '+e.read().decode()[:350]) from None
 if missing and not a.manifest_only:
  key=a.key_file.read_text().strip();sub=request('/v1/user/subscription');remaining=sub['character_limit']-sub['character_count'];estimate=sum(len(t) for _,t,_,_ in missing)
  print(json.dumps({'batches':len(batches),'missing':len(missing),'maximum_estimated_credits':estimate,'remaining_included_credits':remaining}),flush=True)
  if estimate>remaining:raise SystemExit('Not enough included credits; no narration requests sent.')
  def generate(job):
   n,t,it,nm=job
   # Never automatically retry an interrupted paid request.
   data=request('/v1/text-to-speech/'+voice+'/with-timestamps?output_format=mp3_44100_128',{'text':t,'model_id':model,'language_code':'zh','voice_settings':config['voice_settings'],'seed':4104})
   audio=base64.b64decode(data.pop('audio_base64'));(out/(nm+'.mp3')).write_bytes(audio)
   data.update(items=it,source_text=t,voice_id=voice,model_id=model,language_code='zh');(out/(nm+'.json')).write_text(json.dumps(data,ensure_ascii=False))
   print(json.dumps({'completed_batch':n,'passages':len(it),'bytes':len(audio)}),flush=True)
  failures=[]
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
   jobs={pool.submit(generate,j):j[0] for j in missing}
   for f in concurrent.futures.as_completed(jobs):
    try:f.result()
    except Exception as e:failures.append(str(e));print(str(e),flush=True)
  if failures:raise SystemExit('Narration incomplete. Inspect failed requests before resuming.')
 manifest={}
 opening=out/'Mandarin-opening.json'
 data=json.loads(opening.read_text());alignment=data.get('alignment') or data['normalized_alignment'];(out/'Mandarin-opening.mp3').stat()
 manifest['2464']={'file':'assets/narration-zh/Mandarin-opening.mp3','start':0,'end':round(max(alignment['character_end_times_seconds']),3)}
 for t,it in batches:
  nm=name(t);f=out/(nm+'.json')
  if not f.exists():continue
  d=json.loads(f.read_text());alignment=d.get('alignment') or d.get('normalized_alignment');aligned=''.join(alignment['characters']);mapping={}
  for block in difflib.SequenceMatcher(None,t,aligned,autojunk=False).get_matching_blocks():
   for j in range(block.size):mapping[block.a+j]=block.b+j
  starts=alignment['character_start_times_seconds'];ends=alignment['character_end_times_seconds']
  for n,item in enumerate(it):
   indices=[mapping[j] for j in range(item['start'],item['end']) if j in mapping]
   meaningful=[j for j in range(item['start'],item['end']) if t[j].isalnum()]
   if any(j not in mapping for j in meaningful):raise SystemExit('Alignment missing spoken characters for '+item['id'])
   if not indices:raise SystemExit('No alignment for '+item['id'])
   start=max(0,starts[indices[0]]-.06);end=ends[indices[-1]]+.12
   if n+1<len(it):
    next_indices=[mapping[j] for j in range(it[n+1]['start'],it[n+1]['end']) if j in mapping]
    if next_indices:end=min(end,starts[next_indices[0]]-.015)
   manifest[item['id']]={'file':'assets/narration-zh/'+nm+'.mp3','start':round(start,3),'end':round(max(start+.05,end),3)}
 for alias,original in aliases.items():
  if original in manifest:manifest[alias]=manifest[original]
 required={k for k in en if k.isdigit()};missing_ids=required-set(manifest)
 if missing_ids:raise SystemExit('Missing narration IDs: '+str(sorted(missing_ids)))
 (ROOT/'content/narration.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print(json.dumps({'authored_passages':len(required),'clips':len(manifest)}),flush=True)
if __name__=='__main__':main()
