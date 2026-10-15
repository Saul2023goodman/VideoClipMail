from pathlib import Path
import json,math
R=Path(__file__).resolve().parents[1];m=json.loads((R/'analysis/audio-sources.json').read_text());B=json.loads((R/'src/beat-data.json').read_text());bf=lambda b:round((B['t0']+b*B['T'])*30)
# peak_f denotes a 5ms stereo-energy maximum, not a single-sample maximum.
# Sparse physical cues, never one synthetic tick per data field or dealt card.
plan=[
 ('switch',.15,.18,'Spotlight takes power'),('sweep',4,.20,'Camera finds the contact KPI'),('light',6.5,.10,'Hero contour lap'),('paper-slide',10,.22,'Hero reseats'),
 ('page-turn',12,.22,'Source archive opens'),('switch',14,.18,'Identical byte source merges'),('paper-slide',16,.22,'Mail structure inspected'),('page-turn',23,.19,'Roster identities inspected'),('page-turn',28,.20,'Uncertain source reaches review'),('click',32,.21,'Operator purpose choice'),
 ('transition',34,.18,'Recipient version gate'),('switch',36,.20,'Email normalization meets'),('click',38,.21,'Complete version selected'),('page-turn',40,.22,'Probable contact case'),('click',44,.21,'Both distinct addresses retained'),
 ('riser',48,.12,'Batch prepares to deal'),('page-turn-big',49,.22,'First native card in flight'),('paper-slide',51,.17,'Hard accelerating paper run'),('paper-slide',53,.19,'Native sixty-card board settles'),
 ('sweep',59,.23,'Full batch review scroll accelerates'),('paper-slide',68,.14,'Scroll brakes into the final mail'),
 ('click',70,.18,'Requested path checked'),('paper-slide',73,.21,'Basename resolves'),('transition',76,.19,'Per-mail file pool opens'),('switch',80,.21,'211 links confirmed'),
 ('page-turn',82,.20,'Scheduling rules'),('paper-slide',87,.23,'Native institution calendar arrives'),('switch',91,.20,'Full plan settles'),
 ('paper-slide',95,.20,'Queue snapshot frozen'),('sweep',98,.23,'Packet crosses runtime'),('transition',101,.19,'Provider progress revealed'),('switch',105,.22,'Sixty offline saves verified'),
 ('page-turn',108,.20,'Draft revision comparison'),('sweep',110,.18,'Comparison handle flings'),('paper-slide',114,.16,'Comparison scrub returns'),('switch',116,.19,'Protected fields verified'),('transition',121,.20,'Native revision result'),('click',125,.20,'Fifty-nine successful swaps'),
 ('page-turn',128,.21,'Later mailbox snapshot'),('paper-slide',130.5,.19,'Subject changes share recipient history'),('switch',132,.17,'History reconciles'),
 ('page-turn',134.5,.18,'Explicit automatic response'),('page-turn',141,.18,'Fast linked response'),('page-turn',147.5,.18,'Human reply evidence'),('page-turn',154,.18,'Unmatched topic needs confirmation'),
 ('paper-slide',160,.20,'Last actual send anchors deadline'),('switch',164,.20,'Deadline resolves'),('click',172,.19,'History safeguards pass'),
 ('paper-slide',177,.17,'Contact state mosaic enters'),('switch',179.5,.18,'Evidence becomes eligibility'),('paper-slide',181,.19,'Independent tile dimensions settle'),('switch',185,.18,'Eligibility becomes next action'),('paper-slide',187,.20,'Contact decisions fan out'),
 ('page-turn',192,.20,'Follow-up personalization begins'),('paper-slide',195,.22,'Greeting template and signature combine'),('transition',200,.20,'Twenty native follow-ups reviewed'),('switch',205,.20,'Managed template ownership verified'),
 ('riser',212,.17,'Final group photo rises'),('impact',212,.30,'SmartMail identity presses into place'),('light',214,.10,'Identity rule and sign-off settle'),
]
cues=[]
for key,beat,volume,label in plan:
 s=m['sources'][key];target=bf(beat);start=max(0,round(target-s['peak_f']));cues.append({'from':start,'duration':math.ceil(s['duration']*30),'src':'audio/'+key+'.wav','volume':volume,'target':target,'beat':beat,'peak_f':s['peak_f'],'label':label})
cues.sort(key=lambda c:c['from']);m.update({'output_offset_frames':0,'pipeline':'Remotion 48 kHz PCM, identical-picture AAC mux','cues':cues,'subjective_audio_audition':False})
(R/'src/audio-cues.json').write_text(json.dumps(cues,indent=2)+'\n');(R/'analysis/audio-sources.json').write_text(json.dumps(m,indent=2)+'\n');print(len(cues),'physical sound cues')
