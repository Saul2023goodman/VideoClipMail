from pathlib import Path
import json,hashlib,subprocess,numpy as np
from scipy.io import wavfile
from scipy.signal import correlate,butter,sosfiltfilt,find_peaks
from scipy.ndimage import gaussian_filter1d
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'out';SR=48000;FPS=30
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def decoded(p,sr=SR):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-vn','-f','f32le','-ac','2','-ar',str(sr),'-'])
 return np.frombuffer(raw,dtype='<f4').reshape(-1,2).copy()
def picture_hash(p):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','h264','-'])
 return hashlib.sha256(raw).hexdigest()
music_path=OUT/'smartmail-lifecycle-with-music.mp4';sfx_path=OUT/'smartmail-lifecycle-sfx-only.mp4'
probes={p.name:probe(p) for p in [music_path,sfx_path]}
streams=[]
for name,p in probes.items():
 v=next(s for s in p['streams'] if s['codec_type']=='video');a=next(s for s in p['streams'] if s['codec_type']=='audio')
 assert (v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==(1920,1080,'30/1',3247)
 assert v['avg_frame_rate']=='30/1' and abs(float(v['duration'])-3247/FPS)<1/90000
 assert abs(float(a['duration'])-3247/FPS)<1/FPS
 assert a['codec_name']=='aac' and a['sample_rate']=='48000'
 streams.append({'file':name,'frames':v['nb_frames'],'duration':v['duration'],'audio_duration':a['duration'],'format':p['format']['format_name']})
hashes=[picture_hash(p) for p in [music_path,sfx_path]];assert hashes[0]==hashes[1]
timing_frames=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_entries','frame=best_effort_timestamp_time','-of','json',str(music_path)]))['frames']
timestamps=np.array([float(f['best_effort_timestamp_time']) for f in timing_frames]);assert len(timestamps)==3247
maximum_timing_error=float(np.max(abs(timestamps-np.arange(3247)/FPS)));assert maximum_timing_error<2e-6
music=decoded(music_path);sfx=decoded(sfx_path)
cues=json.loads((ROOT/'src/audio-cues.json').read_text());measurements=[]
for c in cues:
 beat=c['beat']
 sr,raw=wavfile.read(ROOT/'public'/c['src']);raw=raw.astype(np.float64)/32768
 start=round(c['from']/FPS*SR);a=max(0,start-4800);b=start+len(raw)+4800
 search=sfx[a:min(b,len(sfx))].mean(axis=1);template=raw[:min(len(raw),int(c['duration']/FPS*SR))].mean(axis=1)
 corr=correlate(search,template,mode='valid',method='fft');offset=int(np.argmax(corr));actual=a+offset
 measurements.append({'beat':beat,'cue':c['label'],'expected_start':c['from'],'measured_start':actual/SR*FPS,
  'offset_samples':actual-start,'offset_frames':(actual-start)/SR*FPS})
 assert abs(measurements[-1]['offset_frames'])<=.5,measurements[-1]
offset=float(np.median([m['offset_frames'] for m in measurements]));
beats=json.loads((ROOT/'analysis/beat_data.json').read_text());timeline=json.loads((ROOT/'analysis/timeline.json').read_text())
# Re-detect classified leading attacks directly from the encoded final mix.
ym=decoded(music_path,22050);ys=decoded(sfx_path,22050);n=min(len(ym),len(ys));y=(ym[:n]-ys[:n]).mean(axis=1);sr=22050;attacks=[]
for lo,hi in [(40,160),(150,500),(1000,3000),(6000,10000)]:
 band=sosfiltfilt(butter(4,[lo,hi],btype='band',fs=sr,output='sos'),y)
 env=np.sqrt(np.maximum(0,gaussian_filter1d(band*band,sr*.006)))
 attack=np.maximum(0,env-gaussian_filter1d(env,sr*.035));peaks,_=find_peaks(attack,distance=int(sr*.16),prominence=np.percentile(attack,96)*.16)
 for p in peaks:
  a=max(0,p-int(sr*.060));cross=np.where(attack[a:p+1]>=attack[p]*.22)[0]
  attacks.append((a+int(cross[0]))/sr if len(cross) else p/sr)
attacks=np.array(sorted(attacks));cuts=[]
for shot in timeline['SHOTS'][1:]:
 f=shot['from'];near=float(attacks[np.argmin(abs(attacks-f/FPS))]);error=(f/FPS-near)*FPS
 cuts.append({'scene':shot['id'],'frame':f,'measured_attack_seconds':near,'error_frames':error})
 assert abs(error)<=3,cuts[-1]
report={'streams':streams,'same_encoded_picture':True,'picture_sha256':hashes[0],
 'decoded_picture_frames':len(timestamps),'maximum_frame_timestamp_error_seconds':maximum_timing_error,
 'landmark_definition':json.loads((ROOT/'analysis/audio-sources.json').read_text()).get('landmark_definition'),'music_grid_measurement':'Band attacks in decoded music mix minus decoded SFX-only mix; AAC residuals remain','sfx_alignment':measurements,'measured_output_offset_frames':offset,'scene_cut_errors':cuts,
 'maximum_cut_error_frames':max(abs(x['error_frames']) for x in cuts),
 'music_peak_db':float(20*np.log10(np.max(abs(music)))),'sfx_peak_db':float(20*np.log10(np.max(abs(sfx)))),
 'mixkit_source_sha256':hashlib.sha256((ROOT/'public/audio/house-vibez.mp3').read_bytes()).hexdigest(),
 'passed':True}
assert report['music_peak_db']<-.1 and report['sfx_peak_db']<-.1
(ROOT/'analysis/export-verification.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
