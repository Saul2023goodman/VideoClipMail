#!/usr/bin/env python3
"""Measure final mux timing against multiple physical SFX probes."""
import json,subprocess
from pathlib import Path
import numpy as np
from scipy.io.wavfile import read
from scipy.signal import correlate
root=Path(__file__).resolve().parents[1]
timeline=json.loads((root/'analysis/timeline.json').read_text())
SR=48000
report={'pipeline':{'remotion':'4.0.484','picture':'H.264','audio':'FFmpeg AAC 256k','sampleRate':SR,'container':'MP4 with standard edit-list priming compensation'},'sourceOffsets':'public/audio/analysis.json','date':'2026-10-13','probes':[]}
def decode(path):
 raw=subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-vn','-ac','1','-ar',str(SR),'-f','f32le','-'])
 return np.frombuffer(raw,dtype='<f4')
rendered=decode(root/'out/smartmail-ops-sfx-only.mp4')
report['sfxPeakDb']=float(20*np.log10(np.max(np.abs(rendered))))
report['musicPeakDb']=float(20*np.log10(np.max(np.abs(decode(root/'out/smartmail-ops-with-music.mp4')))))
for target in [300,885,1425,1710,2070]:
 cue=next(s for s in timeline['SFX'] if s['target']==target)
 sr,source=read(root/'public'/cue['src']);source=source.astype(float)/32768
 if source.ndim>1:source=source.mean(axis=1)
 source=source[:min(len(source),round(min(cue['duration']/30,.23)*SR))]
 expected=round(cue['from']/30*SR);left=max(0,expected-round(.15*SR))
 segment=rendered[left:expected+len(source)+round(.15*SR)]
 values=correlate(segment,source,mode='valid',method='fft')
 actualStart=left+int(np.argmax(values))
 residual=(actualStart-expected)/SR*30
 peak=actualStart+int(np.argmax(np.abs(source)))
 report['probes'].append({'targetFrame':target,'file':cue['src'],'designedStart':cue['from'],'measuredStartFrame':actualStart/SR*30,'pipelineOffsetFrames':residual,'measuredPeakFrame':peak/SR*30,'peakResidualFrames':peak/SR*30-target})
report['commonOffsetFrames']=float(np.median([p['pipelineOffsetFrames'] for p in report['probes']]))
report['maxAbsolutePeakResidualFrames']=max(abs(p['peakResidualFrames']) for p in report['probes'])
report['sectionStartsOnBeat']=all(s['from']%15==0 for s in timeline['SHOTS'])
report['passed']=report['maxAbsolutePeakResidualFrames']<=1 and report['musicPeakDb']<-.1 and report['sfxPeakDb']<-.1 and report['sectionStartsOnBeat']
(root/'analysis/audio-qa.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
if not report['passed']:raise SystemExit(1)
