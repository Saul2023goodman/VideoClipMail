#!/usr/bin/env python3
"""Extract entrance, midpoint and settling evidence from the final encoded video."""
from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw
ROOT=Path(__file__).resolve().parents[1]
DEST=ROOT/'out/qa/final';DEST.mkdir(parents=True,exist_ok=True)
shots=json.loads((ROOT/'analysis/timeline.json').read_text())['SHOTS']
frames=sorted({f for s in shots for f in [s['from']+24,s['from']+s['duration']//2,s['to']-16]})
expression='+'.join(f'eq(n\\,{f})' for f in frames)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'out/smartmail-batch-with-music.mp4'),'-vf',f'select={expression}', '-fps_mode','vfr',str(DEST/'seq-%02d.png')],check=True)
for i,f in enumerate(frames,1):
    (DEST/f'seq-{i:02d}.png').rename(DEST/f'f{f:04d}.png')
for chunk in range(0,len(shots),3):
    group=shots[chunk:chunk+3]
    sheet=Image.new('RGB',(1440,len(group)*300),'#e9edf1')
    d=ImageDraw.Draw(sheet)
    for row,s in enumerate(group):
        for col,f in enumerate([s['from']+24,s['from']+s['duration']//2,s['to']-16]):
            with Image.open(DEST/f'f{f:04d}.png') as im:
                sheet.paste(im.resize((480,270),Image.Resampling.LANCZOS),(col*480,row*300))
            d.text((col*480+8,row*300+278),f"{s['id']} / f{f}",fill='#182230')
    sheet.save(DEST/f'contact-{chunk//3+1}.jpg',quality=94)
(ROOT/'analysis/final-frame-evidence.json').write_text(json.dumps({'encodedSource':'out/smartmail-batch-with-music.mp4','frames':frames,'samplesPerScene':3},indent=2))
print('Extracted '+str(len(frames))+' final frames')
