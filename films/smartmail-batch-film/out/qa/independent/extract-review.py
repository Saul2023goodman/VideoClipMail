from pathlib import Path
import json, math, subprocess, sys
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[3]
out = Path(__file__).resolve().parent
video = Path(sys.argv[1]).resolve()
prefix = sys.argv[2] if len(sys.argv) > 2 else 'export'
timeline = json.loads((root / 'analysis/timeline.json').read_text())
total = timeline['TOTAL']
groups = {}
for s in timeline['SHOTS']:
    groups['scene-' + s['id']] = [min(total-1, s['from']+round(s['duration']*u)) for u in (.03,.11,.19,.27,.35,.43,.51,.59,.67,.75,.83,.94)]
    if s['from']:
        groups['cut-' + s['id'] + '-consecutive'] = list(range(s['from']-6,s['from']+6))
groups.update({
    'opening-gather':list(range(158,206,4)),
    'opening-grid-consecutive':list(range(167,179)),
    'cursor-classify-consecutive':list(range(291,303)),
    'cursor-classify-travel':list(range(274,322,4)),
    'files-distribute':list(range(1320,1392,6)),
    'schedule-landing':list(range(1760,1832,6)),
    'schedule-consecutive':list(range(1816,1828)),
    'runtime-handoff':list(range(1980,2124,12)),
    'replacement-phase':list(range(2380,2524,12)),
    'reply-branch':list(range(2800,2908,9)),
    'outro-assembly':list(range(3074,3110,3)),
    'outro-land-consecutive':list(range(3083,3095)),
    'outro-stamp-consecutive':list(range(3111,3123)),
    'outro-hold':list(range(3170,3242,6)),
})
indices = sorted(set(f for frames in groups.values() for f in frames))
framesdir = out / (prefix + '-frames')
framesdir.mkdir(exist_ok=True)
def balanced(parts):
    if len(parts) == 1:
        return parts[0]
    mid = len(parts)//2
    return '('+balanced(parts[:mid])+'+'+balanced(parts[mid:])+')'
select = balanced([f'eq(n,{f})' for f in indices])
subprocess.run(['ffmpeg','-v','error','-y','-i',str(video),'-vf',f"select='{select}',scale=480:270",'-vsync','0',str(framesdir / 'f%04d.png')],check=True)
paths = dict(zip(indices,sorted(framesdir.glob('f*.png'))))
if len(paths) != len(indices):
    raise RuntimeError(f'Missing frames: extracted {len(paths)} of {len(indices)}')
for name, frames in groups.items():
    sheet = Image.new('RGB',(1920,298*3),'#e8ebf0')
    draw=ImageDraw.Draw(sheet)
    for i,f in enumerate(frames):
        im=Image.open(paths[f]).convert('RGB')
        x=i%4*480;y=i//4*298
        sheet.paste(im,(x,y+28));draw.text((x+8,y+6),f'{name} f{f} / {f/30:.3f}s',fill='#182230')
    sheet.save(out/(prefix+'-'+name+'.jpg'),quality=94)
(out/(prefix+'-frame-map.json')).write_text(json.dumps({'video':str(video),'groups':groups},indent=2))
print(f'{len(groups)} strips; {len(indices)} unique video frames')
