"""Check a normalized visual brief. Exit 0: fields resolved; 2: questions/errors remain.
This checks structure, IDs and explicit unknowns, not semantic or visual quality.
"""
import json,sys
from pathlib import Path

FIELDS={
 'character':['id','appearance','locked','reference'],
 'appearance':['age','build','skin','face','hair','clothing','accessories'],
 'environment':['id','time','layout','details','palette','lighting','reference'],
 'prop':['id','appearance','initial_owner','initial_location'],
 'shot':['id','seconds','narration','environment','cast','props','blocking','action','expression','framing','continuity','avoid','reference'],
 'action':['start','anticipation','movement','contact','end']}

def check(p):
 errors=[];questions=[];choices=[]
 if not isinstance(p,dict):return {'errors':['Brief must be an object'],'questions':[],'delegated_choices':[],'fields_resolved':False}
 def required(obj,keys,path):
  if not isinstance(obj,dict):errors.append(path+': expected object');return False
  for key in keys:
   if key not in obj:questions.append({'path':path+'/'+key,'reason':'Missing required visual/story field'})
  return True
 required(p,['version','story','aspect','references','creative_freedom','characters','environments','props','shots'],'')
 if p.get('version')!=1:errors.append('/version: expected 1')
 freedom=p.get('creative_freedom',[])
 if not isinstance(freedom,list) or any(not isinstance(x,str) for x in freedom):errors.append('/creative_freedom: expected list of exact field paths');freedom=[]
 refs=p.get('references',{})
 if not isinstance(refs,dict) or not refs:errors.append('/references: supply a nonempty reference-ID mapping');refs={}
 ids={}
 for collection,kind in [('characters','character'),('environments','environment'),('props','prop'),('shots','shot')]:
  rows=p.get(collection,[]);ids[collection]=set()
  if not isinstance(rows,list):errors.append('/'+collection+': expected list');continue
  if collection!='props' and not rows:questions.append({'path':'/'+collection,'reason':'At least one entry required'})
  for i,row in enumerate(rows):
   path=f'/{collection}/{i}'
   if not required(row,FIELDS[kind],path):continue
   ident=row.get('id')
   if not isinstance(ident,str) or not ident:errors.append(path+'/id: nonempty string required')
   elif ident in ids[collection]:errors.append(path+'/id: duplicate '+ident)
   else:ids[collection].add(ident)
   if kind=='character':required(row.get('appearance'),FIELDS['appearance'],path+'/appearance')
   if kind=='shot':required(row.get('action'),FIELDS['action'],path+'/action')
   ref=row.get('reference')
   if ref is not None and ref not in ['ASK','AGENT_CHOICE'] and (not isinstance(ref,str) or ref not in refs):errors.append(path+'/reference: unknown reference ID')
 for i,s in enumerate(p.get('shots',[]) if isinstance(p.get('shots'),list) else []):
  if not isinstance(s,dict):continue
  path=f'/shots/{i}'
  if not isinstance(s.get('environment'),str) or s.get('environment') not in ids['environments']:errors.append(path+'/environment: unknown location ID')
  for key,source in [('cast','characters'),('props','props')]:
   values=s.get(key)
   if not isinstance(values,list):errors.append(path+'/'+key+': expected ID list');continue
   for v in values:
    if not isinstance(v,str) or v not in ids[source]:errors.append(path+'/'+key+': unknown ID '+str(v))
  duration=s.get('seconds')
  if duration not in ['ASK','AGENT_CHOICE'] and (not isinstance(duration,(int,float)) or isinstance(duration,bool) or not 0<duration<3600):errors.append(path+'/seconds: positive finite duration required')
 used=set()
 def visit(value,path):
  if isinstance(value,dict):
   for k,v in value.items():visit(v,path+'/'+k)
  elif isinstance(value,list):
   for i,v in enumerate(value):visit(v,path+'/'+str(i))
  elif value is None or (isinstance(value,str) and value.strip().upper() in ['', 'ASK','TBD','UNKNOWN']):questions.append({'path':path,'reason':'Unresolved; ask before affected keyframes'})
  elif value=='AGENT_CHOICE':
   if path in freedom:choices.append(path);used.add(path)
   else:questions.append({'path':path,'reason':'Choice not explicitly delegated at this field path'})
 for k,v in p.items():
  if k!='creative_freedom':visit(v,'/'+k)
 for path in freedom:
  if path not in used:errors.append('/creative_freedom: unused or invalid delegated path '+path)
 return {'errors':errors,'questions':questions,'delegated_choices':choices,'fields_resolved':not errors and not questions and not choices,'note':'Resolve and record delegated choices, then clear their paths. Semantic completeness and visual capability still require review.'}

if __name__=='__main__':
 try:result=check(json.loads(Path(sys.argv[1]).read_text()))
 except (IndexError,OSError,ValueError) as e:print(json.dumps({'errors':[str(e)]}));sys.exit(2)
 print(json.dumps(result,indent=2,ensure_ascii=False));sys.exit(0 if result['fields_resolved'] else 2)
