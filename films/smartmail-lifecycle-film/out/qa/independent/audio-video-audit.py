from pathlib import Path
import subprocess,json,hashlib
import numpy as np
from scipy.signal import correlate,butter,sosfiltfilt,find_peaks
from scipy.ndimage import gaussian_filter1d
R=Path.cwd();Q=R/'out/qa/independent';fps=30;sr=48000
files=[R/'out/smartmail-lifecycle-with-music.mp4',R/'out/smartmail-lifecycle-sfx-only.mp4']
def probe(p):return json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
def pcm(p,rate=sr):return np.frombuffer(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-vn','-f','f32le','-ac','2','-ar',str(rate),'-']),dtype='<f4').reshape(-1,2).copy()
def phash(p):return hashlib.sha256(subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c:v','copy','-f','h264','-'])).hexdigest()
probes=[probe(p) for p in files];hashes=[phash(p) for p in files]
audios=[pcm(p) for p in files];levels=[]
for p,a in zip(files,audios):
 levels.append({'file':p.name,'sample_peak_dbfs':float(20*np.log10(np.max(np.abs(a)))),'whole_file_rms_dbfs':float(20*np.log10(np.sqrt(np.mean(a*a)))),'clipped_samples':int(np.sum(abs(a)>=1.0))})
cues=json.load(open(R/'src/audio-cues.json'));align=[]
for c in cues:
 raw=pcm(R/'public'/c['src']);raw=raw[:round(c['duration']/fps*sr)].mean(1);n=round(c['from']/fps*sr);a=max(0,n-3200);b=min(len(audios[1]),n+len(raw)+3200)
 vals=[]
 for final in audios:
  search=final[a:b].mean(1);corr=correlate(search,raw,mode='valid',method='fft');k=int(np.argmax(corr));v=search[k:k+len(raw)];conf=float(np.dot(v,raw)/np.sqrt(np.dot(v,v)*np.dot(raw,raw)))
  vals.append({'start_error_frames':float((a+k-n)/sr*fps),'normalized_correlation':conf,'estimated_source_gain':float(np.dot(v,raw)/np.dot(raw,raw))})
 peak=int(np.argmax(abs(raw)));align.append({'from':c['from'],'target':c['target'],'label':c['label'],'source_peak_frames':float(peak/sr*fps),'source_peak_target_rounding_error_frames':float(c['from']+peak/sr*fps-c['target']),'music':vals[0],'sfx_only':vals[1]})
# Independent onset detection on the music-only residual removes cue-created attacks.
res=(audios[0]-audios[1])[:].mean(1)[::4];rs=sr/4
band=sosfiltfilt(butter(4,[40,180],btype='band',fs=rs,output='sos'),res)
env=np.sqrt(np.maximum(0,gaussian_filter1d(band*band,rs*.004)));attack=np.maximum(0,env-gaussian_filter1d(env,rs*.030))
peaks,_=find_peaks(attack,distance=int(rs*.20),prominence=np.percentile(attack,95)*.17)
ons=[]
for p in peaks:
 a=max(0,p-int(rs*.05));cross=np.where(attack[a:p+1]>attack[p]*.22)[0];ons.append((a+int(cross[0]))/rs if len(cross) else p/rs)
ons=np.array(ons)
timeline=json.load(open(R/'analysis/timeline.json'));cuts=[]
for s in timeline['SHOTS'][1:]:
 t=s['from']/fps;near=float(ons[np.argmin(abs(ons-t))]);cuts.append({'scene':s['id'],'frame':s['from'],'nearest_lowband_music_attack_seconds':near,'cut_minus_attack_frames':float((t-near)*fps)})
report={'method':'Independent ffprobe, encoded-picture hashing, final PCM decode, every-cue source correlation in both exports, low-band attack detection on music-minus-SFX residual. No subjective audition.', 'files':[{'file':p.name,'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'streams':[{'type':s['codec_type'],'codec':s['codec_name'],'duration':s.get('duration'),'frames':s.get('nb_frames'),'width':s.get('width'),'height':s.get('height'),'fps':s.get('r_frame_rate'),'sample_rate':s.get('sample_rate')}for s in q['streams']]}for p,q in zip(files,probes)],'encoded_picture_hashes':hashes,'same_encoded_picture':hashes[0]==hashes[1],'levels':levels,'cues':align,'lowband_music_cuts':cuts}
(Q/'audio-video-measurements.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'same_encoded_picture':report['same_encoded_picture'],'levels':levels,'all_cue_start_errors_sfx_only_max_f':max(abs(c['sfx_only']['start_error_frames']) for c in align),'all_cue_start_errors_music_max_f':max(abs(c['music']['start_error_frames']) for c in align),'lowest_source_correlation_sfx':min(c['sfx_only']['normalized_correlation'] for c in align),'lowest_source_correlation_music':min(c['music']['normalized_correlation'] for c in align),'lowband_music_cuts':cuts},indent=2))
