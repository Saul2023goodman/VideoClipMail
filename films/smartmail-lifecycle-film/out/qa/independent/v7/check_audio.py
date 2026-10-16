import json,pathlib,subprocess,hashlib
import numpy as np
from scipy.signal import correlate
root=pathlib.Path.cwd();out=root/'out/qa/independent/v7';rate=48000;fps=30
names=['out/smartmail-lifecycle-with-music.mp4','out/smartmail-lifecycle-sfx-only.mp4']
def decode(p,mono=False):
 return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-threads','1','-i',str(p),'-vn','-ar',str(rate),'-ac','1' if mono else '2','-f','f32le','-']),np.float32)
stats={};waves={}
for p in names:
 a=decode(root/p).reshape(-1,2);waves[p]=a
 stats[p]={'decodedSamplesPerChannel':len(a),'sampleRate':rate,'channels':2,'samplePeakDbfs':float(20*np.log10(np.max(np.abs(a)))),'samplesAtOrAboveFullScale':int((np.abs(a)>=1).sum()),'rmsDbfs':float(20*np.log10(np.sqrt(np.mean(a*a))))}
sfx=waves[names[1]].mean(axis=1);music=waves[names[0]].mean(axis=1);cues=json.load(open('src/audio-cues.json'));records=[]
for c in cues:
 src=decode(root/'public'/c['src'],True);src=src[:round(c['duration']*rate/fps)]
 expected=round(c['from']*rate/fps);radius=round(.12*rate);start=max(0,expected-radius);end=min(len(sfx),expected+len(src)+radius)
 part=sfx[start:end]
 score=correlate(part,src,mode='valid',method='fft');k=int(np.argmax(score));actual=start+k;aligned=sfx[actual:actual+len(src)]
 corr=float(np.dot(aligned,src)/(np.linalg.norm(aligned)*np.linalg.norm(src)))
 records.append({'label':c['label'],'source':c['src'],'declaredStartFrame':c['from'],'declaredActionFrame':c['target'],'measuredStartFrame':actual*fps/rate,'offsetFrames':(actual-expected)*fps/rate,'normalizedCorrelation':corr,'declaredLandmarkFrame':c['from']+c['peak_f'],'declaredLandmarkActionErrorFrames':c['from']+c['peak_f']-c['target']})
source=json.load(open('analysis/audio-sources.json'));export=json.load(open('analysis/export-verification.json'))
result={'method':'Independent float32 full-stream stereo decode at 48 kHz. Cross-correlate each declared source WAV against the decoded SFX-only output in a +/-120ms window around the declared start. These are objective signal checks, not perceptual listening.','stats':stats,'cuesChecked':len(records),'maximumAbsoluteStartOffsetFrames':max(abs(x['offsetFrames']) for x in records),'minimumNormalizedCorrelation':min(x['normalizedCorrelation'] for x in records),'maximumDeclaredLandmarkActionErrorFrames':max(abs(x['declaredLandmarkActionErrorFrames']) for x in records),'alignment':records,'allCueDurationsExplicit':all(isinstance(c.get('duration'),int) for c in cues),'sourceSamplesLongerThanFiveSeconds':[k for k,v in source['sources'].items() if v['duration']>5],'producerExportReportSha256':hashlib.sha256((root/'analysis/export-verification.json').read_bytes()).hexdigest(),'producerMaximumSceneCutErrorFrames':export['maximum_cut_error_frames'],'producerMeasuredOutputOffsetFrames':export['measured_output_offset_frames'],'perceptualAuditionPerformed':False,'unverifiable':['In-mix audibility of each SFX to human hearing','Subjective musical fit and timbre','Clicks, spatial balance, fatigue or unwanted tonal artifacts perceptible during real-time listening']}
(out/'audio-verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k not in ['alignment','unverifiable']},indent=2))
