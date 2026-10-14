from pathlib import Path
import json,subprocess,sys,numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
ROOT=Path(__file__).resolve().parents[1]
LIB=Path(sys.argv[sys.argv.index('--library')+1]).resolve() if '--library' in sys.argv else Path('/workspace/video-shotcraft/assets/audio/sfx')
BEATS=json.loads((ROOT/'analysis/beat_data.json').read_text());SR=48000;FPS=30
bf=lambda b:round((BEATS['t0']+b*BEATS['T'])*FPS)
TOTAL=bf(220);OUT=ROOT/'public/audio';OUT.mkdir(parents=True,exist_ok=True);N=TOTAL*SR//FPS
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

# Freeze asset timing, then bind the current process film's action plan.
(ROOT/'analysis/audio-sources.json').write_text(json.dumps({'sources':meta},indent=2)+'\n')
subprocess.run([sys.executable,str(ROOT/'scripts/retime-audio.py')],check=True)
cues=json.loads((ROOT/'src/audio-cues.json').read_text())

music=decode(OUT/'house-vibez.mp3')[:N]
music=np.pad(music,((0,max(0,N-len(music))),(0,0)))[:N]
gain=np.full(N,.34,dtype=np.float32)
gain[:SR//2]=np.linspace(0,.34,SR//2)
gain[-int(SR*1.55):]=np.linspace(.34,0,int(SR*1.55))
music*=gain[:,None]
wavfile.write(OUT/'music-bed.wav',SR,np.clip(music*32767,-32768,32767).astype(np.int16))
print(json.dumps({'cues':len(cues),'music_seconds':N/SR,'peak':float(np.max(np.abs(music)))}))
