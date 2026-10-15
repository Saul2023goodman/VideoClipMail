from pathlib import Path
from datetime import datetime,timezone
import hashlib,json,subprocess,zipfile,collections
import numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
R=Path.cwd();Q=R/'out/qa/independent/v51/post-scroll'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
meta=json.loads((R/'analysis/audio-sources.json').read_text());sources=[]
for key,w in meta['sources'].items():
 p=R/'public/audio'/f'{key}.wav';sr,y=wavfile.read(p);a=y.astype(np.float64)/32768
 energy=uniform_filter1d(np.mean(a*a,axis=1),size=round(sr*.005))
 e=int(np.argmax(energy));absolute=int(np.argmax(np.max(np.abs(a),axis=1)))
 sources.append({'name':key,'sha256':sha(p),'sample_rate':sr,'samples':len(y),'duration':len(y)/sr,'energy_landmark_sample':e,'absolute_peak_sample':absolute,'energy_metadata_matches':e==w['energy_peak_sample'],'absolute_metadata_matches':absolute==w['absolute_peak_sample'],'legacy_peak_f_matches_energy':abs(w['peak_f']-e/sr*30)<1e-10,'sample_peak_dbfs':float(20*np.log10(np.max(abs(a))))})
timestamps=[]
for file in ['smartmail-lifecycle-with-music.mp4','smartmail-lifecycle-sfx-only.mp4']:
 p=R/'out'/file
 d=json.loads(subprocess.check_output(['ffprobe','-v','error','-select_streams','v:0','-show_frames','-show_entries','frame=best_effort_timestamp_time,pkt_duration_time','-of','json',str(p)]))['frames']
 times=np.array([float(v['best_effort_timestamp_time']) for v in d]);err=times-np.arange(len(times))/30
 timestamps.append({'file':file,'sha256':sha(p),'bytes':p.stat().st_size,'decoded_frames':len(d),'first_pts':times[0],'last_pts':times[-1],'maximum_abs_pts_error_s':float(np.max(abs(err))),'minimum_delta_s':float(np.min(np.diff(times))),'maximum_delta_s':float(np.max(np.diff(times))),'strictly_monotonic':bool(np.all(np.diff(times)>0))})
originals=[{'file':str(p.relative_to(R)),'sha256':sha(p)} for p in (R/'public/audio').glob('*.mp3')]
# Independent read-only inventory of supplied ZIP proves content-level duplicate identity.
z=zipfile.ZipFile(R/'analysis/fixtures/Batch_inputs.zip');files=[v for v in z.infolist() if not v.is_dir()];h=collections.defaultdict(list)
for v in files:h[hashlib.sha256(z.read(v)).hexdigest()].append(v.filename)
zip_record={'entries':len(files),'unique_hashes':len(h),'same_byte_groups':[{'sha256':k,'files':v} for k,v in h.items() if len(v)>1]}
# Check current detached inputs; this does not rerun npm ci or the workbench UI.
portable=Path('/workspace/lifecycle-portable-check/SmartMail-Lifecycle-Editable-Project');inputs=[]
for d in ['src','public']:
 for p in sorted((R/d).rglob('*')):
  if p.is_file():
   rel=p.relative_to(R);other=portable/rel
   inputs.append({'file':str(rel),'sha256':sha(p),'detached_exists':other.exists(),'matches_detached':other.exists() and sha(p)==sha(other)})
report={'measured_utc':datetime.now(timezone.utc).isoformat(),'pipeline':{'remotion':json.loads((R/'package.json').read_text())['dependencies']['remotion'],'video':'H.264 High / MP4 / timescale90000','audio':'AAC LC stereo 48000Hz from PCM render; measured offset separately in audio-video-measurements.json','ffmpeg':subprocess.check_output(['ffmpeg','-version'],text=True).splitlines()[0]},'source_landmark_definition':'SciPy uniform_filter1d mean(square(stereo)), centered240sample window /5ms at48000Hz, defaultorigin0; argmax. Absolute peak=max(abs(channel sample)).','source_audio':sources,'timestamps':timestamps,'original_music':originals,'zip':zip_record,'detached_rendering_inputs':{'count':len(inputs),'mismatches':[v for v in inputs if not v['matches_detached']],'method':'Byte hash comparison only; no independent npm installation or full render rerun.'}}
(Q/'numeric-recheck.json').write_text(json.dumps(report,indent=2))
print(json.dumps({**report,'source_audio':[{'name':s['name'],'energy_metadata_matches':s['energy_metadata_matches'],'absolute_metadata_matches':s['absolute_metadata_matches']}for s in sources]},indent=2))
