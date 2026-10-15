"""Measure shipped WAVs; distinguish energy landmarks from sample maxima."""
from pathlib import Path
import json,numpy as np
from scipy.io import wavfile
from scipy.ndimage import uniform_filter1d
R=Path(__file__).resolve().parents[1];p=R/'analysis/audio-sources.json';m=json.loads(p.read_text());method='Maximum of centered 5 ms stereo mean-square energy (240 samples at48kHz), not the single-sample absolute maximum'
for name,d in m['sources'].items():
 sr,y=wavfile.read(R/f'public/audio/{name}.wav');f=y.astype(np.float64)/32768;energy=uniform_filter1d(np.mean(f*f,axis=1),size=240);sample=int(np.argmax(energy));absolute=int(np.argmax(np.max(np.abs(f),axis=1)))
 assert abs(sample-d['peak_sample'])<2,(name,sample,d['peak_sample'])
 d.update({'landmark_method':method,'energy_peak_sample':sample,'energy_peak_f':sample/sr*30,'absolute_peak_sample':absolute,'absolute_peak_f':absolute/sr*30,'peak_f_compatibility_note':'Legacy peak_f refers to the selected short-term ENERGY landmark; use absolute_peak_f for sample maximum.'})
m['landmark_definition']=method;p.write_text(json.dumps(m,indent=2)+'\n')
print('Measured',len(m['sources']),'shipped WAV energy landmarks and sample maxima separately')
