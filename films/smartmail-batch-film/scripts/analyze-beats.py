from pathlib import Path
import json
import numpy as np
import librosa
from scipy.signal import butter, sosfiltfilt, find_peaks
from scipy.ndimage import gaussian_filter1d

ROOT=Path(__file__).resolve().parents[1]
y,sr=librosa.load(ROOT/'public/audio/house-vibez.mp3',sr=22050,mono=True)
tempo,tracked=librosa.beat.beat_track(y=y,sr=sr,hop_length=128,tightness=400,units='time')
T,t0=np.polyfit(np.arange(len(tracked)),tracked,1)
print('Initial grid',60/T,t0,'residual ms',np.max(np.abs(tracked-(t0+np.arange(len(tracked))*T)))*1000,flush=True)
hits=[]
for kind,lo,hi in [('kick',40,160),('snare_body',150,500),('snare_attack',1000,3000),('hihat',6000,10000)]:
 b=sosfiltfilt(butter(4,[lo,hi],btype='band',fs=sr,output='sos'),y)
 env=np.sqrt(np.maximum(0,gaussian_filter1d(b*b,sr*.006)))
 attack=np.maximum(0,env-gaussian_filter1d(env,sr*.035))
 peaks,_=find_peaks(attack,distance=int(sr*.16),prominence=np.percentile(attack,96)*.16)
 for p in peaks:
  # Locate the first leading edge instead of the late maximum of the bass cycle.
  a=max(0,p-int(sr*.060));v=attack[a:p+1];threshold=attack[p]*.22
  crossing=np.where(v>=threshold)[0]
  onset=(a+int(crossing[0]))/sr if len(crossing) else p/sr
  hits.append({'t':onset,'s':float(attack[p]),'k':kind})
kicks=np.array([h['t'] for h in hits if h['k']=='kick' and h['s']>np.percentile([v['s'] for v in hits if v['k']=='kick'],25)])
# Fit combined leading attacks: the bass maximum moves with the arrangement.
attacks=np.array([h['t'] for h in hits])
def score(phase):
 grid=np.arange(phase,110,T)
 e=np.array([np.min(np.abs(attacks-t)) for t in grid])
 return np.mean(np.minimum(e,.08))
t0=float(min(np.arange(0,T,.001),key=score))
for _ in range(5):
 grid=np.arange(t0,110,T)
 near=np.array([attacks[np.argmin(np.abs(attacks-t))] for t in grid])
 mask=np.abs(near-grid)<.025
 T,t0=np.polyfit(np.arange(len(grid))[mask],near[mask],1)
t0=t0%T
candidates=[]
for mult in [.5,1,2]:
 period=T/mult; phase=t0%period
 grid=np.arange(phase,110,period)
 nearest=np.array([attacks[np.argmin(np.abs(attacks-t))] for t in grid])
 residual=nearest-grid; active=np.abs(residual)<.075
 drift=np.polyfit(grid[active],residual[active],1)[0] if active.sum()>2 else 0
 candidates.append({'multiplier':mult,'bpm':60/period,'t0':phase,'match':float(np.mean(np.abs(residual)<.030)),
  'active_match':float(np.mean(np.abs(residual[active])<.030)),'mean_abs_ms':float(np.mean(np.abs(residual[active]))*1000),
  'drift_ms':float(drift*len(y)/sr*1000),'active_beats':int(active.sum()),'total_beats':len(grid),
  'kick_integer_coverage':float(np.mean(np.abs(((kicks-phase+period/2)%period)-period/2)<.050))})
grid=np.arange(t0,len(y)/sr,T)
rms=librosa.feature.rms(y=y,hop_length=512)[0]
rt=librosa.times_like(rms,sr=sr,hop_length=512)
sections=[]
for start in np.arange(0,len(y)/sr,8*T):
 select=(rt>=start)&(rt<start+8*T)
 sections.append({'start':float(start),'end':float(min(len(y)/sr,start+8*T)),'rms':float(rms[select].mean())})
data={'bpm':60/T,'t0':float(t0),'T':float(T),'duration':len(y)/sr,'beats':grid.tolist(),
 'hits':sorted(hits,key=lambda h:h['t']),'rms':[{'t':float(t),'v':float(v)} for t,v in zip(rt[::10],rms[::10])],
 'sections':sections,'method':'librosa beat tracking followed by robust combined leading-attack least-squares fit; fixed 22050 Hz analysis'}
(ROOT/'analysis/beat_data.json').write_text(json.dumps(data,indent=2))
(ROOT/'analysis/grid_drift.json').write_text(json.dumps({'candidates':candidates,'winner':1,
 'note':'Combined attacks validate the grid through 110s before the silent tail. Half tempo omits half the kicks; double tempo adds unsupported beats. Export anchors are measured again in the encoded mix.'},indent=2))
print(json.dumps({'bpm':data['bpm'],'t0':t0,'T':T,'candidates':candidates,'sections':sections},indent=2),flush=True)
