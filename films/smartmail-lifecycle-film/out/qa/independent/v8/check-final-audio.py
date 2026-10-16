import pathlib,subprocess,json,hashlib,sys
import numpy as np
from scipy.signal import correlate
from scipy.io import wavfile
P=pathlib.Path('/workspace/VideoClipMail/films/smartmail-lifecycle-film');O=P/'out/qa/independent/v8';path=pathlib.Path(sys.argv[1]);expected=sys.argv[2];sha=hashlib.sha256(path.read_bytes()).hexdigest();assert sha==expected
rate=48000;raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vn','-ac','2','-ar',str(rate),'-f','f32le','-']);x=np.frombuffer(raw,np.float32).reshape(-1,2);mono=x.mean(axis=1)
cues=json.loads((P/'src/audio-cues.json').read_text());probes=[]
for target in [178,1974,2026,2126,2236,2254,2314,2334,2448,2512,2698,2794,2834,3129]:
 cs=[c for c in cues if c['target']==target]
 if not cs:continue
 c=cs[0];sr,t=wavfile.read(P/'public'/c['src']);assert sr==rate
 t=t.astype(np.float32)/32768
 if t.ndim>1:t=t.mean(axis=1)
 t=t[:min(len(t),round(c['duration']*rate/30))];start=round(c['from']*rate/30);search=round(rate*.08);lo=max(0,start-search);hi=min(len(mono),start+len(t)+search);seg=mono[lo:hi];cc=correlate(seg,t,mode='valid',method='fft');s=np.r_[0,np.cumsum(seg.astype(float)**2)];den=np.sqrt(np.maximum(1e-15,s[len(t):]-s[:-len(t)]))*np.linalg.norm(t);ncc=cc/den;i=int(np.argmax(ncc));lag=lo+i-start;probes.append({'targetFrame':target,'source':c['src'],'nominalStartFrame':c['from'],'measuredLagSamples':lag,'measuredLagFrames':lag/rate*30,'ncc':float(ncc[i]),'energyLandmarkResidualFrames':c['from']+lag/rate*30+c['peak_f']-target})
report={'method':'Independent FFmpeg decode of final SFX-only AAC to 48k stereo float. Normalized FFT correlation of current prepared source samples in ±80ms windows around declared cue starts; energy-landmark errors retain the separate source peak_f value. This does not establish subjective audition.','media':str(path.relative_to(P)),'mediaSha256':sha,'sampleRate':rate,'decodedSamples':len(x),'maxAbsoluteSample':float(np.max(np.abs(x))),'peakDbfs':float(20*np.log10(max(np.max(np.abs(x)),1e-12))),'clipsAtOrAbove1':int((np.abs(x)>=1).sum()),'probes':probes,'maxAbsEnergyLandmarkErrorFrames':max(abs(p['energyLandmarkResidualFrames']) for p in probes)}
(O/'encoded-audio-check.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:v for k,v in report.items() if k!='probes'},indent=2))
