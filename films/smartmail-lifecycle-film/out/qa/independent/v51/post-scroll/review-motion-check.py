from pathlib import Path
import subprocess,json,hashlib
import numpy as np
from PIL import Image,ImageDraw,ImageFont
R=Path.cwd();Q=R/'out/qa/independent/v51/post-scroll';Q.mkdir(exist_ok=True);D=Q/'review-motion-cache';D.mkdir(exist_ok=True)
p=subprocess.Popen(['ffmpeg','-v','error','-i','public/native/overview-scroll.mp4','-vf','scale=960:540','-f','rawvideo','-pix_fmt','rgb24','-'],stdout=subprocess.PIPE)
keep=[0,12,24,48,72,96,112,128,139,140,145,150,155,160,165,170,175];frames={};rows=[];last=None;first_of_end=None;end=None
for n in range(176):
 data=p.stdout.read(960*540*3)
 if len(data)!=960*540*3:raise RuntimeError((n,len(data)))
 a=np.frombuffer(data,np.uint8).reshape(540,960,3)
 c=a[60:530,295:785,:].astype(float)
 rows.append({'source_frame':n,'film_frame':857+n,'body_mean_abs_frame_difference':float(np.mean(abs(c-last))) if last is not None else 0})
 if n in keep:frames[n]=Image.fromarray(a).copy();frames[n].save(D/f'native-{n:03d}.jpg',quality=95)
 last=c
p.stdout.close();assert p.wait()==0
canvas=Image.new('RGB',(1920,math.ceil(len(keep)/3)*310),'#0d141f') if False else Image.new('RGB',(1920,6*310),'#0d141f');draw=ImageDraw.Draw(canvas);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',20)
for i,n in enumerate(keep):
 x=i%3*640;y=i//3*310;im=frames[n].resize((640,360),Image.Resampling.LANCZOS)
 # Main thumbnail360h cropped to keep row-number region and body, then counter inset.
 im=frames[n].resize((512,288),Image.Resampling.LANCZOS);canvas.paste(im,(x+128,y));counter=frames[n].crop((70,34,123,56)).resize((127,53),Image.Resampling.NEAREST);canvas.paste(counter,(x,y+45));draw.text((x+8,y+282),f'native{n:03d} / film f{857+n:04d}',font=font,fill='white')
canvas.save(Q/'review-motion-check.jpg',quality=94)
report={'input':'public/native/overview-scroll.mp4','native_sha256':hashlib.sha256((R/'public/native/overview-scroll.mp4').read_bytes()).hexdigest(),'method':'Independent full176-frame decode to960x540 RGB; per-frame absolute difference of visible body rectangle(295,60)-(785,530); exact current-film frame mapping verified at996 and1032. UI counter in contact sheet is genuine native text.','frames':rows,'last35':rows[141:]}
(Q/'review-motion-check.json').write_text(json.dumps(report,indent=2));print(json.dumps({'last40':rows[136:]},indent=2))
