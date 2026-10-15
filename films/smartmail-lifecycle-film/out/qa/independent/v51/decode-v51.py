from pathlib import Path
import json, subprocess, hashlib
from PIL import Image, ImageDraw, ImageFont
ROOT=Path.cwd(); OUT=ROOT/'out/qa/independent/v51'; (OUT/'frames').mkdir(exist_ok=True,parents=True)
shots=json.loads((ROOT/'analysis/timeline.json').read_text())['SHOTS']
extras=[0,1,2,3,32,59,71,75,95,125,148,155,177,178,195,235,285,308,365,405,465,502,503,530,574,580,635,679,680,700,720,745,751,770,805,850,856,857,875,910,928,990,1032,1033,1034,1087,1105,1120,1170,1210,1211,1220,1264,1282,1344,1387,1388,1450,1471,1543,1593,1594,1595,1605,1609,1621,1630,1633,1651,1684,1699,1713,1740,1787,1816,1888,1889,1890,1930,1978,1979,1990,2015,2032,2050,2079,2080,2090,2111,2130,2146,2160,2174,2188,2206,2226,2240,2270,2286,2302,2320,2348,2361,2362,2420,2504,2551,2568,2612,2650,2716,2748,2780,2810,2832,2833,2834,2860,2905,2928,2948,2990,3011,3069,3070,3090,3123,3141,3159,3203,3230,3233,3240,3246]
frames=sorted(set(range(0,3247,12))|set(extras)|{s['from']+s['duration']-1 for s in shots})
def add_expr(parts):
 if len(parts)==1:return parts[0]
 k=len(parts)//2
 return '('+add_expr(parts[:k])+'+'+add_expr(parts[k:])+')'
expr=add_expr([f'eq(n\\,{n})' for n in frames])
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i','out/smartmail-lifecycle-with-music.mp4','-vf',f'select={expr}','-fps_mode','vfr','-q:v','2',str(OUT/'frames/seq-%04d.jpg')],check=True)
for i,f in enumerate(frames,1): (OUT/'frames'/f'seq-{i:04d}.jpg').rename(OUT/'frames'/f'f{f:04d}.jpg')
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',19)
def sheet(ns,path,cols=4):
 rows=(len(ns)+cols-1)//cols
 canvas=Image.new('RGB',(cols*480,rows*298),(13,20,31)); d=ImageDraw.Draw(canvas)
 for i,n in enumerate(ns):
  p=OUT/'frames'/f'f{n:04d}.jpg';im=Image.open(p);im.thumbnail((480,270))
  x=(i%cols)*480;y=(i//cols)*298;canvas.paste(im,(x,y)); d.text((x+8,y+273),f'f{n:04d}  {n/30:.3f}s',font=font,fill='#ffffff')
 canvas.save(OUT/path,quality=93)
for s in shots:
 available=[f for f in frames if s['from']<=f<s['from']+s['duration']]
 # evenly distributed up to sixteen frames, retaining first/last
 ns=[available[round(i*(len(available)-1)/15)] for i in range(16)] if len(available)>16 else available
 sheet(ns,f'{s["id"]}-sequence.jpg')
for name,ns in {
 'revision-detail':[1595,1609,1621,1630,1633,1651,1684,1699,1713,1740,1787,1816,1889],
 'reply-detail':[1979,1990,2015,2032,2050,2079,2090,2111,2130,2146,2160,2188,2206,2226,2240,2270,2286,2302,2320,2348,2361],
 'mosaic-detail':[2612,2650,2716,2748,2780,2810,2833],
 'cuts':[f for s in shots[1:] for f in [s['from']-1,s['from']]],
}.items(): sheet(ns,name+'.jpg')
phones=[285,574,1032,1105,1450,1630,1684,1713,2032,2160,2240,2348,2504,2551,2716,2780,3011,3203]
for f in phones:
 im=Image.open(OUT/'frames'/f'f{f:04d}.jpg'); im.resize((480,270),Image.Resampling.LANCZOS).save(OUT/f'phone-f{f:04d}.png')
record={'decoded_input':'out/smartmail-lifecycle-with-music.mp4','sha256':hashlib.sha256((ROOT/'out/smartmail-lifecycle-with-music.mp4').read_bytes()).hexdigest(),'method':'ffmpeg exact zero-based frame select from final MP4; JPEG q2; phone resizes Lanczos 480x270','frames':frames,'count':len(frames),'phone_frames':phones}
(OUT/'decoded-frame-manifest.json').write_text(json.dumps(record,indent=2))
print(json.dumps({'frames':len(frames),'sheets':len(shots)+4,'sha256':record['sha256']}))
