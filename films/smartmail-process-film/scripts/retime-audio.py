"""Bind physical sound attacks to this reconstruction's source beat grid."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
meta=json.loads((ROOT/'analysis/audio-sources.json').read_text())['sources']
beat=json.loads((ROOT/'src/beat-data.json').read_text());bf=lambda b:round((beat['t0']+b*beat['T'])*30);total=bf(220)
plan=[
 (1,'page-turn',.22,'Campaign folder opens'),(6,'paper-slide',.26,'Sources collect into ZIP'),
 (10,'switch',.20,'Compare source hashes'),(12,'paper-slide',.23,'Merge identical source'),
 (14,'sweep',.18,'Start linear field scan'),(24,'click',.18,'Mail evidence routes source'),
 (26,'page-turn',.23,'Inspect reference table'),(32,'switch',.22,'Repeated identity columns route roster'),
 (35,'paper-slide',.22,'PDF assets enter direct pool'),(42,'page-turn',.20,'Uncertain document reaches review'),(48,'click',.23,'Operator chooses Ignore'),
 (52,'transition',.21,'Compare recipient versions'),(56,'switch',.20,'Email keys converge'),(62,'click',.25,'Select complete mail version'),
 (64,'page-turn',.23,'Inspect probable contact match'),(68,'switch',.18,'Name and school join'),(74,'click',.23,'Explicitly keep both contacts'),
 (78,'sweep',.20,'Reconcile sixty roster identities'),(84,'switch',.21,'Mailbox history checked'),
 (88,'sweep',.24,'Native vertical scroll'),(102,'paper-slide',.16,'Preview braking hold'),
 (107,'click',.21,'Try exact file path'),(110,'paper-slide',.23,'Extract unique basename'),(112,'switch',.23,'File candidate matches'),
 (114,'transition',.21,'Apply per-mail file scopes'),(124,'switch',.25,'211 links settled'),
 (130,'sweep',.23,'Ready line carries into scheduler'),(136,'page-turn',.19,'Native rules reveal'),
 (140,'paper-slide',.23,'First task reaches date'),(142,'click',.21,'First institution slot accepted'),
 (147,'click',.16,'Capacity rejection'),(149,'switch',.14,'Saturday rejection'),(151,'switch',.14,'Sunday rejection'),
 (153,'click',.15,'Three-day gap'),(155,'click',.15,'Four-day gap'),(157,'click',.15,'Five-day gap'),(159,'click',.15,'Six-day gap'),(161,'switch',.25,'Seven-day gap accepted'),
 (164,'paper-slide',.21,'Different institution shares minute'),(168,'page-turn',.21,'Holiday candidates'),(172,'switch',.23,'Valid post-holiday date'),
 (174,'transition',.20,'Real calendar assignments'),(175,'paper-slide',.25,'Native rows fly into slots'),(178,'page-turn',.18,'Remaining rows embed'),(180,'switch',.21,'Native plan complete'),
 (184,'paper-slide',.22,'Selected queue freezes'),(188,'sweep',.22,'Packet crosses runtime'),
 (193,'click',.18,'Open compose'),(195,'page-turn',.17,'Fill fields'),(197,'switch',.21,'Verify uploaded files'),(199,'click',.22,'Confirm save'),
 (200,'transition',.21,'Native queue reveal'),(208,'switch',.25,'Sixty saves settle'),(214,'impact',.32,'Identity lands'),(216,'light',.12,'Final identity hold')
]
cues=[]
for b,key,volume,label in plan:
 target=bf(b);start=max(0,round(target-meta[key]['peak_f']))
 cues.append({'from':start,'duration':min(total-start,round(meta[key]['duration']*30)),'src':'audio/'+key+'.wav','volume':volume,'target':target,'beat':b,'peak_f':meta[key]['peak_f'],'label':label})
target=bf(214);start=round(target-meta['riser']['peak_f'])
cues.append({'from':start,'duration':round(meta['riser']['duration']*30),'src':'audio/riser.wav','volume':.17,'target':target,'beat':214,'peak_f':meta['riser']['peak_f'],'label':'Identity rising lead-in'})
cues.sort(key=lambda c:c['from'])
(ROOT/'src/audio-cues.json').write_text(json.dumps(cues,indent=2)+'\n')
(ROOT/'analysis/audio-sources.json').write_text(json.dumps({'sources':meta,'output_offset_frames':0,'pipeline':'Remotion 48 kHz PCM, identical-picture AAC mux','cues':cues},indent=2)+'\n')
print('Retimed',len(cues),'physical cues')
