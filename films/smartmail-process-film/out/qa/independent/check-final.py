from pathlib import Path
from datetime import datetime, timezone
import subprocess, json, hashlib, numpy as np
from scipy.io import wavfile
from scipy.signal import correlate

ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).resolve().parent
SR=48000
FPS=30
TOTAL=3247

def probe(p):
    return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def audio(p):
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-vn','-f','f32le','-ac','2','-ar',str(SR),'-'])
    return np.frombuffer(raw,dtype='<f4').reshape(-1,2).copy()
def streamhash(p):
    raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','h264','-'])
    return hashlib.sha256(raw).hexdigest()

files=[ROOT/'out/smartmail-process-with-music.mp4',ROOT/'out/smartmail-process-sfx-only.mp4']
probes={p.name:probe(p) for p in files}
signals=[audio(p) for p in files]
hashes=[streamhash(p) for p in files]
picture_hash=streamhash(ROOT/'out/smartmail-process-picture.mp4')
cues=json.loads((ROOT/'src/audio-cues.json').read_text())
sources=json.loads((ROOT/'analysis/audio-sources.json').read_text())['sources']

expected=np.zeros((TOTAL*SR//FPS,2),dtype=np.float64)
templates=[]
for c in cues:
    sr,y=wavfile.read(ROOT/'public'/c['src'])
    assert sr==SR
    y=y.astype(np.float64)/32768
    if y.ndim==1:y=np.repeat(y[:,None],2,axis=1)
    y=y[:min(len(y),round(c['duration']*SR/FPS))]
    start=round(c['from']*SR/FPS)
    end=min(start+len(y),len(expected))
    expected[start:end]+=y[:end-start]*c['volume']
    templates.append((c,start,y[:end-start]))

sfx=signals[1][:len(expected)]
pred=expected[:len(sfx)]
span=min(20*SR,len(sfx),len(pred))
globalcorr=correlate(sfx[:span].mean(axis=1),pred[:span].mean(axis=1),mode='full',method='fft')
lags=np.arange(-span+1,span)
mask=np.abs(lags)<SR//4
global_lag=int(lags[mask][np.argmax(globalcorr[mask])])
measurements=[]
for c,start,y in templates:
    key=Path(c['src']).stem
    left=max(0,start-SR//4);right=min(len(sfx),start+len(y)+SR//4)
    # Remove the other declared cues to measure each actual component attack.
    other=pred[left:right].copy()
    own_a=max(left,start);own_b=min(right,start+len(y))
    other[own_a-left:own_b-left]-=y[own_a-start:own_b-start]*c['volume']
    isolated=(sfx[left:right]-other).mean(axis=1)
    template=y.mean(axis=1)*c['volume']
    corr=correlate(isolated,template,mode='valid',method='fft')
    actual=left+int(np.argmax(corr))
    residual=(actual-start)*FPS/SR
    peakf=actual*FPS/SR+sources[key]['peak_f']
    measurements.append({'label':c['label'],'beat':c['beat'],'declared_target_frame':c['target'],
                         'actual_source_start_frame':actual*FPS/SR,'source_start_residual_frames':residual,
                         'actual_attack_frame':peakf,'attack_residual_frames':peakf-c['target']})

sr,music=wavfile.read(ROOT/'public/audio/music-bed.wav')
music=music.astype(np.float64)/32768
length=min(len(signals[0]),len(music),len(expected))
mixpred=music[:length]+expected[:length]
mixout=signals[0][:length]
mixrms=float(np.sqrt(np.mean((mixout-mixpred)**2)))
sfxrms=float(np.sqrt(np.mean((sfx-pred)**2)))
stats=[]
for p,sig in zip(files,signals):
    q=probes[p.name]
    v=next(s for s in q['streams'] if s['codec_type']=='video')
    a=next(s for s in q['streams'] if s['codec_type']=='audio')
    stats.append({'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
                  'video_codec':v['codec_name'],'audio_codec':a['codec_name'],'width':v['width'],'height':v['height'],
                  'fps':v['r_frame_rate'],'frames':int(v['nb_frames']),'duration':float(v['duration']),
                  'audio_sample_rate':a['sample_rate'],'audio_start_time':a.get('start_time'),
                  'peak_dbfs':float(20*np.log10(np.max(abs(sig)))),'clipped_samples':int(np.sum(abs(sig)>=1))})
    subprocess.run(['ffmpeg','-v','error','-xerror','-i',str(p),'-f','null','-'],check=True)
report={'reviewed_utc':datetime.now(timezone.utc).isoformat(),'pipeline':'Remotion 4.0.484 picture/PCM audio, H.264 copied into MP4 with AAC 48 kHz',
        'streams':stats,'video_sha256':hashes,'picture_sha256':picture_hash,'same_picture':hashes[0]==hashes[1]==picture_hash,
        'global_audio_lag_samples':global_lag,'global_audio_lag_frames':global_lag*FPS/SR,
        'all_cue_measurements':measurements,'maximum_source_start_residual_frames':max(abs(m['source_start_residual_frames']) for m in measurements),
        'maximum_attack_residual_frames':max(abs(m['attack_residual_frames']) for m in measurements),
        'sfx_codec_residual_rms':sfxrms,'music_mix_codec_residual_rms':mixrms,
        'decode_error_checks_passed':True}
(OUT/'final-media-check.json').write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ['all_cue_measurements']},indent=2))
