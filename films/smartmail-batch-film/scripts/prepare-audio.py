from pathlib import Path
import json,subprocess,sys,numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
ROOT=Path(__file__).resolve().parents[1]
LIB=Path(sys.argv[sys.argv.index('--library')+1]).resolve() if '--library' in sys.argv else Path('/workspace/video-shotcraft/assets/audio/sfx')
BEATS=json.loads((ROOT/'analysis/beat_data.json').read_text());SR=48000;FPS=30
bf=lambda b:round((BEATS['t0']+b*BEATS['T'])*FPS)
TOTAL=bf(220);OUT=ROOT/'public/audio';N=TOTAL*SR//FPS
sources={'paper-slide':'paper/paper-slide.mp3','page-turn':'paper/paper-page-turn.mp3','page-turn-big':'paper/paper-page-turn-big.mp3',
 'click':'ui/switch-click-quick.mp3','switch':'ui/switch-light.mp3','sweep':'transition/swoosh-quick.mp3',
 'transition':'transition/transition-soft.mp3','impact':'impact/impact-deep-whoosh.mp3','riser':'riser/riser-cine.mp3','light':'light/shimmer-sparkle-sweep.mp3'}
def decode(p):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','2','-ar',str(SR),'-'])
 return np.frombuffer(raw,dtype='<f4').reshape(-1,2).copy()
meta={}
for key,path in sources.items():
 y=decode(LIB/path)
 if key=='riser':y=y[:int(SR*1.35)]
 max_length={'paper-slide':1.0,'page-turn':.5,'page-turn-big':.65,'click':.18,'switch':.16,'sweep':.75,'transition':1.2,'impact':2.7,'riser':1.7,'light':1.45}[key]
 y=y[:int(max_length*SR)]
 peak=np.max(np.abs(y));y=y/max(peak,.001)*10**(-1.5/20)
 y[-min(2000,len(y)):]*=np.linspace(1,0,min(2000,len(y)))[:,None]
 env=uniform_filter1d(np.mean(y*y,axis=1),size=240)
 peak_sample=int(np.argmax(env));wavfile.write(OUT/(key+'.wav'),SR,(y*32767).astype(np.int16))
 meta[key]={'source':path,'duration':len(y)/SR,'peak_sample':peak_sample,'peak_f':peak_sample/SR*FPS,'max_db':-1.5}

# Every cue binds to an action beat; the sparse finale impact is snapped to its
# measured attack. Sources are peak-aligned, not aligned by their file heads.
plan=[
 (2,'page-turn',.25,'Dossier opens'),(12,'paper-slide',.32,'Sixty tasks gather into import'),
 (20,'click',.28,'Inspect mail source'),(24,'switch',.24,'Inspect reference roster'),(28,'click',.28,'Confirm classification'),
 (34,'sweep',.22,'Normalize fields'),(39,'paper-slide',.23,'Records enter normalized schema'),
 (49,'transition',.21,'Email keys reconcile'),(56,'switch',.22,'Distinct contacts retained'),
 (65,'click',.25,'Open batch review'),(69,'page-turn',.26,'Move to another institution'),(73,'page-turn-big',.23,'Move across the batch'),(77,'click',.23,'Return to review list'),
 (81,'switch',.23,'Open attachment scope'),(84,'click',.26,'Match mail filename hints'),(87,'switch',.23,'Set writing sample scope'),(88,'sweep',.22,'Show requirement distribution'),
 (99,'click',.26,'Open schedule rules'),(101,'switch',.23,'Set local time zone'),(105,'click',.23,'Set nine AM'),(108,'click',.24,'One per institution'),(111,'switch',.22,'Seven-day gap'),(115,'click',.28,'Apply native schedule'),(119,'paper-slide',.28,'Enquiries spread into dates'),
 (130,'click',.30,'Start frozen queue'),(133,'sweep',.25,'Show runtime handoff'),(144,'switch',.24,'Draft verification'),
 (155,'click',.26,'Open proposal maintenance'),(157,'switch',.26,'Choose fifty-nine targets'),(159,'paper-slide',.30,'Introduce revised proposal'),(162,'transition',.24,'Start clone-and-swap'),(168,'click',.28,'Verify unchanged content'),(177,'switch',.26,'Replacements confirmed'),
 (182,'sweep',.25,'Move to later mailbox state'),(186,'click',.28,'Sync history'),(190,'page-turn',.28,'Human replies separate'),(200,'click',.26,'Filter due contacts'),(204,'switch',.26,'Select eligible follow-up batch'),
 (211,'impact',.46,'Wordmark lands'),(214,'light',.18,'Final identity rule')]
hits=BEATS['hits'];cues=[]
for beat,key,volume,label in plan:
 target=(BEATS['t0']+beat*BEATS['T'])*FPS
 if key=='impact':
  candidates=[h for h in hits if abs(h['t']-target/FPS)<.070]
  if candidates:target=min(candidates,key=lambda h:abs(h['t']-target/FPS))['t']*FPS
 start=max(0,round(target-meta[key]['peak_f']))
 duration=min(TOTAL-start,round(meta[key]['duration']*FPS))
 cues.append({'from':start,'duration':duration,'src':'audio/'+key+'.wav','volume':volume,'target':round(target),
  'beat':beat,'peak_f':meta[key]['peak_f'],'label':label})
# The original rising attack leads into the identity landing.
target=bf(211);key='riser';start=round(target-meta[key]['peak_f'])
cues.append({'from':start,'duration':round(meta[key]['duration']*FPS),'src':'audio/riser.wav','volume':.22,'target':target,'beat':211,'peak_f':meta[key]['peak_f'],'label':'Finale rising lead-in'})
cues.sort(key=lambda c:c['from'])
(ROOT/'src/audio-cues.json').write_text(json.dumps(cues,indent=2))
(ROOT/'analysis/audio-sources.json').write_text(json.dumps({'sources':meta,'output_offset_frames':0,'pipeline':'Remotion PCM WAV 48000 Hz, FFmpeg AAC mux; measured after final export','cues':cues},indent=2))

music=decode(OUT/'house-vibez.mp3')[:N]
music=np.pad(music,((0,max(0,N-len(music))),(0,0)))[:N]
gain=np.full(N,.34,dtype=np.float32)
gain[:SR//2]=np.linspace(0,.34,SR//2)
gain[-int(SR*1.55):]=np.linspace(.34,0,int(SR*1.55))
music*=gain[:,None]
wavfile.write(OUT/'music-bed.wav',SR,np.clip(music*32767,-32768,32767).astype(np.int16))
print(json.dumps({'cues':len(cues),'music_seconds':N/SR,'peak':float(np.max(np.abs(music)))}))
