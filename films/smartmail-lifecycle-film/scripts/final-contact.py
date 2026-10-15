"""Decode completed production picture and archive exact frame evidence."""
from pathlib import Path
import hashlib,json,subprocess
from PIL import Image,ImageDraw,ImageFont
R=Path(__file__).resolve().parents[1];VIDEO=R/'out/smartmail-lifecycle-picture.mp4';OUT=R/'out/qa/final';OUT.mkdir(parents=True,exist_ok=True)
t=json.loads((R/'analysis/timeline.json').read_text())
frames={0,3,32,59,75,95,125,148,155,177,195,235,285,365,405,465,502,530,580,635,679,700,720,745,770,805,850,875,910,990,1032,1087,1120,1170,1220,1264,1344,1388,1450,1543,1593,1630,1684,1740,1816,1888,1930,1990,2032,2080,2160,2240,2320,2361,2420,2504,2568,2612,2650,2716,2780,2810,2832,2860,2905,2948,2990,3011,3069,3090,3123,3159,3203,3230,3246}
frames.update({218,248,279,305,334,371,403,421,470,491,523,543,571,591,624,663,1048,1082,1114,1138,1155,1194,1398,1420,1446,1454,1478,1554,1580,1610,1641,1657,1665,1675,1716,1740,1779,1817,1855,1930,1958,1994,2015,2035,2054,2131,2147,2227,2243,2323,2339,2377,2426,2466,2477,2515,2527,2548,2569,2582,2848,2886,2890,2903,2946,2978,3017,3049})
frames.update({1175,1200,2486,2586,2592})

for s in t['SHOTS']:frames.update([s['from'],s['from']+round(s['duration']*.4),s['from']+s['duration']-1])
FRAMES=sorted(x for x in frames if x<t['TOTAL'])
def balanced(items):
 if len(items)==1:return items[0]
 mid=len(items)//2;return '('+balanced(items[:mid])+'+'+balanced(items[mid:])+')'
selector=balanced([f'eq(n,{f})' for f in FRAMES])
subprocess.run(['ffmpeg','-y','-v','error','-i',str(VIDEO),'-vf',f"select='{selector}'",'-fps_mode','vfr','-q:v','2',str(OUT/'selected-%03d.jpg')],check=True)
for i,f in enumerate(FRAMES,1):(OUT/f'selected-{i:03d}.jpg').replace(OUT/f'f{f:04d}.jpg')
font=ImageFont.truetype(str(R/'public/fonts/OpenSans-Regular.ttf'),19)
for page,start in enumerate(range(0,len(FRAMES),15),1):
 selected=FRAMES[start:start+15];sheet=Image.new('RGB',(1440,5*298),'#edf2f8');draw=ImageDraw.Draw(sheet)
 for i,f in enumerate(selected):
  x=i%3*480;y=i//3*298;im=Image.open(OUT/f'f{f:04d}.jpg').convert('RGB').resize((480,270));sheet.paste(im,(x,y));draw.text((x+10,y+273),f'{f/30:.2f}s / f{f}',font=font,fill='#182230')
 sheet.save(OUT/f'contact-{page}.jpg',quality=92)
Image.open(OUT/'f3203.jpg').save(OUT/'poster.png')
(OUT/'frame-manifest.json').write_text(json.dumps({'picture':VIDEO.name,'sha256':hashlib.sha256(VIDEO.read_bytes()).hexdigest(),'decodedFrames':FRAMES,'method':'One-pass ffmpeg decode of completed production picture'},indent=2)+'\n')
print('Archived',len(FRAMES),'decoded production frames')
