from pathlib import Path
import json,math
R=Path(__file__).resolve().parents[1];m=json.loads((R/'analysis/audio-sources.json').read_text());B=json.loads((R/'src/beat-data.json').read_text());bf=lambda b:round((B['t0']+b*B['T'])*30)
action=lambda sceneBeat,localFrame:((bf(sceneBeat)+localFrame)/30-B['t0'])/B['T']
# peak_f denotes a 5ms stereo-energy maximum, not a single-sample maximum.
# Sparse physical cues, never one synthetic tick per data field or dealt card.
plan=[
 ('switch',.15,.18,'Spotlight takes power'),('sweep',4,.20,'Camera finds the contact KPI'),('light',6.5,.10,'Hero contour lap'),('paper-slide',10,.22,'Hero reseats'),
 ('page-turn',12,.20,'Mixed archive on the desk'),('switch',action(12,38),.18,'Identical source copy merges'),('paper-slide',action(12,75),.20,'Mixed source objects unpack together'),('switch',action(12,83),.14,'Package members identify DOCX and XLSX'),('sweep',action(12,139),.14,'Uniform content scan reaches the mail body'),('paper-slide',action(12,205),.20,'Identified sources enter their output pockets'),('page-turn',action(12,224),.18,'Uncertain notes enlarge for manual choice'),('click',action(12,244),.21,'Operator selects Ignore for Now'),
 ('transition',34,.18,'Duplicate versions on the desk'),('paper-slide',36,.20,'Complete version lifts from the desk'),('click',37.5,.21,'Operator keeps the complete version'),('page-turn',40.5,.20,'Two distinct addresses separate'),('click',45,.21,'Operator keeps both contacts'),
 ('riser',48,.12,'Batch prepares to deal'),('page-turn-big',49,.22,'First native card in flight'),('paper-slide',51,.17,'Hard accelerating paper run'),('paper-slide',53,.19,'Native sixty-card board settles'),
 ('paper-slide',action(58,24),.15,'Camera surveys native messages on the desk'),('switch',action(58,51),.15,'Message thirty is selected'),('sweep',action(58,73),.21,'Camera dives into the selected message'),('paper-slide',action(58,94),.15,'Native message lands in a clear frontal view'),
 ('click',70,.18,'Requested attachment path enters'),('paper-slide',72.5,.21,'Unique file name is matched'),('sweep',75.5,.18,'Requested file copies converge'),('switch',79.5,.20,'Native 211-link result settles'),
 ('paper-slide',action(82,48),.18,'Sixty drafts regroup by institution'),('paper-slide',action(82,86),.17,'The same drafts move into date columns'),('sweep',action(82,120),.18,'Drafts migrate into measured native calendar slots'),('switch',action(82,140),.18,'The actual sixty-draft plan settles'),
 ('paper-slide',94.75,.20,'One mail job leaves the selected queue'),('sweep',96,.20,'Mail job crosses Chrome runtime'),('click',98.25,.20,'Required files checked before Saved'),('transition',100.25,.18,'Native provider progress fills the stage'),('switch',105.25,.22,'Sixty offline draft saves confirmed'),
 ('page-turn',108,.20,'Original draft stays on the desk'),('paper-slide',111.25,.19,'Replacement copy clears the original'),('page-turn-big',112.75,.18,'Replacement file flips to version 2'),('switch',120.75,.19,'All unchanged fields checked'),('paper-slide',123,.20,'Verified replacement takes the original slot'),('click',125.75,.20,'Native fifty-nine updated result settles'),
 ('page-turn',128,.21,'Later mailbox snapshot'),('paper-slide',130.5,.19,'Changed-subject sends join by recipient'),('switch',132.5,.17,'One recipient history settles'),
 ('page-turn',134.5,.18,'Automatic-reply envelope opens'),('page-turn',141,.18,'Fast linked reply envelope opens'),('page-turn',147.5,.18,'Human reply envelope opens'),('switch',150.5,.16,'Human reply stops automatic follow-up'),('page-turn',154,.18,'Unmatched-thread envelope opens'),('switch',157,.16,'Unmatched reply is held for confirmation'),
 ('paper-slide',160,.20,'Latest actual send enters the date axis'),('sweep',164.5,.18,'Date axis accelerates past the due date'),('paper-slide',167.75,.18,'Today date brakes and settles'),('click',175.25,.19,'Reply queue and attempt checks pass'),
 ('paper-slide',177,.17,'Contact state mosaic enters'),('switch',179.5,.18,'Mailbox checks reframe the contacts'),('paper-slide',181,.19,'Independent tile dimensions settle'),('switch',185,.18,'Checks become next actions'),('paper-slide',187,.20,'Contact decisions fan out'),
 ('page-turn',192,.20,'Copied body parts are selected'),('click',195.5,.20,'Native Prepare Selected Follow-ups pressed'),('sweep',196.75,.18,'Copied body parts fly on separate arcs'),('paper-slide',199.5,.20,'Greeting template and signature land'),('transition',202.75,.18,'Twenty native follow-ups ready for review'),('click',204.25,.18,'Manual addition is clamped in place'),('switch',206.25,.18,'Nineteen template bodies updated'),
 ('riser',212,.17,'Final group photo rises'),('impact',212,.30,'SmartMail identity presses into place'),('light',214,.10,'Identity rule and sign-off settle'),
]
cues=[]
for key,beat,volume,label in plan:
 s=m['sources'][key];target=bf(beat);start=max(0,round(target-s['peak_f']));cues.append({'from':start,'duration':math.ceil(s['duration']*30),'src':'audio/'+key+'.wav','volume':volume,'target':target,'beat':beat,'peak_f':s['peak_f'],'label':label})
cues.sort(key=lambda c:c['from']);m.update({'output_offset_frames':0,'pipeline':'Remotion 48 kHz PCM, identical-picture AAC mux','cues':cues,'subjective_audio_audition':False})
(R/'src/audio-cues.json').write_text(json.dumps(cues,indent=2)+'\n');(R/'analysis/audio-sources.json').write_text(json.dumps(m,indent=2)+'\n');print(len(cues),'physical sound cues')
