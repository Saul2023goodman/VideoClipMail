"""Decode the completed picture once and archive review frames and contact sheets."""
from pathlib import Path
import hashlib,json,subprocess
from PIL import Image,ImageDraw,ImageFont

ROOT=Path(__file__).resolve().parents[1]
VIDEO=ROOT/'out/smartmail-process-picture.mp4'
OUT=ROOT/'out/qa/final'
OUT.mkdir(parents=True,exist_ok=True)
FRAMES=[0,75,180,218,310,326,363,370,437,488,492,548,630,679,820,883,
        912,946,1000,1080,1123,1240,1283,1300,1435,1458,1532,1534,
        1668,1730,1880,1900,1939,2045,2113,2169,2200,2260,2437,
        2465,2502,2570,2630,2667,2689,2726,2880,2970,3095,3150,3210,3246]
selector='+'.join(f'eq(n,{f})' for f in FRAMES)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(VIDEO),'-vf',f"select='{selector}'",
                '-fps_mode','vfr','-q:v','2',str(OUT/'selected-%03d.jpg')],check=True)
for i,frame in enumerate(FRAMES,1):
    (OUT/f'selected-{i:03d}.jpg').replace(OUT/f'f{frame:04d}.jpg')
font=ImageFont.truetype(str(ROOT/'public/fonts/OpenSans-Regular.ttf'),20)
for page,start in enumerate(range(0,len(FRAMES),18),1):
    selected=FRAMES[start:start+18]
    sheet=Image.new('RGB',(1440,6*297),'#f4f6f8')
    draw=ImageDraw.Draw(sheet)
    for i,f in enumerate(selected):
        x=(i%3)*480;y=(i//3)*297
        im=Image.open(OUT/f'f{f:04d}.jpg').convert('RGB').resize((480,270))
        sheet.paste(im,(x,y))
        draw.text((x+10,y+271),f'{f/30:.2f}s / f{f}',font=font,fill='#182230')
    sheet.save(OUT/f'contact-{page}.jpg',quality=90)
Image.open(OUT/'f2689.jpg').save(OUT/'poster.png')
(OUT/'frame-manifest.json').write_text(json.dumps({'picture':VIDEO.name,
    'sha256':hashlib.sha256(VIDEO.read_bytes()).hexdigest(),'decodedFrames':FRAMES,
    'method':'one-pass ffmpeg select, completed production picture'},indent=2)+'\n')
print(f'Archived {len(FRAMES)} final-picture frames, three contact sheets and poster')
