from pathlib import Path
import subprocess,json,hashlib
from PIL import Image,ImageDraw,ImageFont
R=Path.cwd();Q=R/'out/qa/independent/v51/post-scroll';D=Q/'frames';D.mkdir(exist_ok=True)
p=R/'out/smartmail-lifecycle-with-music.mp4'
subprocess.run(['ffmpeg','-v','error','-i',str(p),'-vf','select=between(n\\,857\\,1033)','-fps_mode','vfr','-q:v','2',str(D/'seq-%04d.jpg')],check=True)
for i,f in enumerate(range(857,1034),1):(D/f'seq-{i:04d}.jpg').rename(D/f'f{f:04d}.jpg')
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',19)
ns=[857,869,881,896,905,910,929,953,969,985,996,1002,1005,1012,1032,1033]
can=Image.new('RGB',(1920,1192),'#0d141f');draw=ImageDraw.Draw(can)
for i,n in enumerate(ns):
 x=i%4*480;y=i//4*298;im=Image.open(D/f'f{n:04d}.jpg').resize((480,270),Image.Resampling.LANCZOS);can.paste(im,(x,y));draw.text((x+8,y+273),f'f{n:04d}  local{n-857:03d}',font=font,fill='white')
can.save(Q/'final-review-sequence.jpg',quality=94)
sel=Q/'selected';sel.mkdir(exist_ok=True)
for n in [857,910,929,969,996,1005,1032,1033]:
 im=Image.open(D/f'f{n:04d}.jpg');im.save(sel/f'f{n:04d}.jpg',quality=95)
 if n in [910,996,1005,1032]:im.resize((480,270),Image.Resampling.LANCZOS).save(Q/f'phone-f{n:04d}.png')
# Compare original and corrected native adaptation at equivalent scroll phases.
refs=[0,14,24,38,50,64,82,140];films=[857,869,896,934,967,1005,1011,1030]
can=Image.new('RGB',(1920,1192),'#0d141f');draw=ImageDraw.Draw(can)
for i,(a,b) in enumerate(zip(refs,films)):
 x=i%2*960;y=i//2*298
 for dx,path,label in [(0,R/f'out/qa/independent/v51/reference-cache/scroll-reference-{i+1:03d}.jpg',f'Original scroll f{a:03d}'),(480,D/f'f{b:04d}.jpg',f'Final native film f{b:04d}')]:
  im=Image.open(path).resize((480,270),Image.Resampling.LANCZOS);can.paste(im,(x+dx,y));draw.text((x+dx+8,y+273),label,font=font,fill='white')
can.save(Q/'scroll-reference-comparison.jpg',quality=94)
record={'input':str(p.relative_to(R)),'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'all_review_frames_decoded':list(range(857,1034)),'sheet_frames':ns,'selected_full_size':[857,910,929,969,996,1005,1032,1033],'phone_frames':[910,996,1005,1032],'comparison_reference_frames':refs,'comparison_final_frames':films,'method':'Independent exact zero-based MP4 frame select; JPEGq2; phone480x270 Lanczos; reference pairs follow normalized motion phase, not literal target-row graphics.'}
(Q/'final-review-manifest.json').write_text(json.dumps(record,indent=2));print(json.dumps({'sha256':record['sha256'],'review_frames':177}))
