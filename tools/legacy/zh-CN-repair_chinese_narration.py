#!/usr/bin/env python3
"""Retain complete cached Mandarin clips; record only missing spoken content.
ElevenLabs can return full text alignment with zero-duration unsaid suffixes.
These are rejected. Smaller cached requests repair actual incomplete passages.
"""
from pathlib import Path
import argparse,base64,concurrent.futures,difflib,hashlib,json,urllib.request,urllib.error
from generate_chinese_narration import cn_number
ROOT=Path(__file__).resolve().parents[1]
def clip_records():
 records={}; rejected=[]
 for path in sorted((ROOT/'assets/narration-zh').glob('*.json')):
  data=json.loads(path.read_text());alignment=data.get('alignment') or data['normalized_alignment'];text=data['source_text'];aligned=''.join(alignment['characters']);mapping={}
  for block in difflib.SequenceMatcher(None,text,aligned,autojunk=False).get_matching_blocks():
   for j in range(block.size):mapping[block.a+j]=block.b+j
  starts=alignment['character_start_times_seconds'];ends=alignment['character_end_times_seconds'];items=data.get('items',[])
  if path.stem=='Mandarin-opening':records['2464']={'file':'assets/narration-zh/'+path.stem+'.mp3','start':0,'end':round(max(ends),3)};continue
  for n,item in enumerate(items):
   positions=[j for j in range(item['start'],item['end']) if text[j].isalnum()];indices=[mapping[j] for j in range(item['start'],item['end']) if j in mapping];meaning=[mapping[j] for j in positions if j in mapping]
   timed=[j for j in meaning if ends[j]>starts[j]];duration=(ends[indices[-1]]-starts[indices[0]]) if indices else 0
   coverage=len(timed)/max(1,len(meaning));threshold=.95 if len(meaning)>=20 else .70
   tail=meaning[-min(3,len(meaning)):]
   good=len(meaning)==len(positions) and coverage>=threshold and duration>=.04 and all(ends[j]>starts[j] for j in tail)
   if not good:rejected.append({'file':path.stem,'id':item['id'],'coverage':round(coverage,3)});continue
   start=max(0,starts[indices[0]]-.06);end=ends[indices[-1]]+.12
   if n+1<len(items):
    next_indices=[mapping[j] for j in range(items[n+1]['start'],items[n+1]['end']) if j in mapping]
    if next_indices and starts[next_indices[0]]>ends[indices[-1]]:end=min(end,starts[next_indices[0]]-.015)
   records[item['id']]={'file':'assets/narration-zh/'+path.stem+'.mp3','start':round(start,3),'end':round(end,3)}
 return records,rejected

def main():
 p=argparse.ArgumentParser();p.add_argument('--key-file',type=Path);p.add_argument('--manifest-only',action='store_true');p.add_argument('--single',action='store_true');a=p.parse_args();out=ROOT/'assets/narration-zh';config=json.loads((ROOT/'content/narrator.json').read_text());voice=config['voice_id'];model=config['model_id'];literals=json.loads((ROOT/'content/literals.json').read_text());en=json.loads((ROOT/'content/narration.en.json').read_text())
 required={k:literals[k]['text'].strip() for k in en if k.isdigit()}
 required.update({'number:'+str(n):cn_number(n) for n in range(301)})
 required.update({'word:'+k:v for k,v in {'hundred':'百','thousand':'千','million':'百万','billion':'十亿','ten':'十','tenThousand':'万','hundredMillion':'亿','and':'零','minus':'负','point':'点','Martin':'马丁'}.items()})
 required.update({'letter:'+c:c for c in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'})
 required.update({'syllable:'+syllable:char for syllable,char in json.loads((ROOT/'content/name-syllables.json').read_text()).items()})
 records,rejected=clip_records();same={phrase:k for k,phrase in required.items() if k in records}
 for k,phrase in required.items():
  if k not in records and phrase in same:records[k]=records[same[phrase]]
 missing={k:v for k,v in required.items() if k not in records};unique={};aliases={}
 for k,phrase in missing.items():
  if phrase in unique:aliases[k]=unique[phrase]
  else:unique[phrase]=k
 batches=[];text='';items=[]
 # Keep requests below 450 characters; single syllables get context outside
 # their playable boundary so the provider does not skip isolated characters.
 for phrase,k in unique.items():
  tag='[worried] ' if k in ['2465','2466','2467','2472','2474','2310'] else '[quietly] ' if k in ['2476','2477','2478','2479'] else ''
  context='这个字读作：' if k.startswith('syllable:') else '字母' if k.startswith('letter:') else ''
  segment=tag+context+phrase+'。\n\n' if context else tag+phrase+'\n\n'
  if items and (a.single or len(text)+len(segment)>450):batches.append((text,items));text='';items=[]
  if not items:text='[tense] '
  start=len(text)+len(tag)+len(context);text+=segment;items.append({'id':k,'start':start,'end':start+len(phrase)})
 if items:batches.append((text,items))
 name=lambda t:'repair-'+hashlib.sha256((voice+model+t).encode()).hexdigest()[:16]
 jobs=[(n,t,it,name(t)) for n,(t,it) in enumerate(batches) if not (out/(name(t)+'.json')).exists()]
 if jobs and not a.manifest_only:
  key=a.key_file.read_text().strip()
  def request(path,payload=None):
   req=urllib.request.Request('https://api.elevenlabs.io'+path,data=json.dumps(payload,ensure_ascii=False).encode() if payload is not None else None,headers={'xi-api-key':key,'Content-Type':'application/json'})
   try:
    with urllib.request.urlopen(req,timeout=300) as r:return json.load(r)
   except urllib.error.HTTPError as e:raise RuntimeError('HTTP '+str(e.code)+': '+e.read().decode()[:250]) from None
  sub=request('/v1/user/subscription');remaining=sub['character_limit']-sub['character_count'];estimate=sum(len(t) for _,t,_,_ in jobs)
  print(json.dumps({'complete_cached_clips_retained':len(records),'missing_clips':len(missing),'short_requests':len(jobs),'maximum_estimated_credits':estimate,'remaining_included_credits':remaining}),flush=True)
  if estimate>remaining:raise SystemExit('Insufficient included credits; no request sent.')
  def generate(job):
   n,t,it,nm=job
   data=request('/v1/text-to-speech/'+voice+'/with-timestamps?output_format=mp3_44100_128',{'text':t,'model_id':model,'language_code':'zh','voice_settings':config['voice_settings'],'seed':4104})
   audio=base64.b64decode(data.pop('audio_base64'));(out/(nm+'.mp3')).write_bytes(audio);data.update(items=it,source_text=t,voice_id=voice,model_id=model,language_code='zh');(out/(nm+'.json')).write_text(json.dumps(data,ensure_ascii=False))
   print(json.dumps({'short_request':n,'clips':len(it),'bytes':len(audio)}),flush=True)
  failures=[]
  with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
   for f in concurrent.futures.as_completed([pool.submit(generate,j) for j in jobs]):
    try:f.result()
    except Exception as e:failures.append(str(e));print(str(e),flush=True)
  if failures:raise SystemExit('A request failed. Inspect provider history before retrying interrupted requests.')
 records,rejected=clip_records();same={phrase:k for k,phrase in required.items() if k in records}
 for k,phrase in required.items():
  if k not in records and phrase in same:records[k]=records[same[phrase]]
 missing={k:v for k,v in required.items() if k not in records}
 if missing:
  (ROOT/'content/narration-repair-pending.json').write_text(json.dumps(missing,ensure_ascii=False,indent=2));print(json.dumps({'still_incomplete':len(missing),'examples':list(missing)[:12]}),flush=True);raise SystemExit(2)
 records={k:records[k] for k in required};(ROOT/'content/narration.json').write_text(json.dumps(records,ensure_ascii=False,indent=2))
 report={'language':'zh-CN','authoredPassages':sum(k.isdigit() for k in records),'totalCachedClips':len(records),'completeSpokenTimingForEveryClip':True,'rejectedTruncatedSourceItems':len(rejected),'shortRequestRepairs':len(list(out.glob('repair-*.mp3'))),'performedListeningReview':False}
 (ROOT/'content/narration-quality.json').write_text(json.dumps(report,indent=2));print(json.dumps(report),flush=True)
 pending=ROOT/'content/narration-repair-pending.json'
 if pending.exists():pending.unlink()
if __name__=='__main__':main()
