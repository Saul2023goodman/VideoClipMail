#!/usr/bin/env python3
"""Extract consecutive action strips from the actual final MP4 for review."""
import hashlib,json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
ROOT=Path(__file__).resolve().parents[1]
video=ROOT/'out/smartmail-ops-with-music.mp4'
out=ROOT/'out/qa/motion';out.mkdir(parents=True,exist_ok=True)
ranges={'import':(45,125,8),'dedupe':(320,445,10),'preview':(555,680,10),'edit':(750,805,5),'schedule':(1428,1515,7),'maintenance':(1710,1870,10),'reply':(2045,2200,10)}
font=ImageFont.truetype(str(ROOT/'public/fonts/OpenSans-Bold.ttf'),16)
report={}
source_hash=hashlib.sha256(video.read_bytes()).hexdigest()
for name,(start,end,step) in ranges.items():
 seek=max(0,start//30-1)
 frames=list(range(start,end+1,step));select='+'.join(f'eq(n\\,{f-seek*30})' for f in frames)
 scratch=out/name;scratch.mkdir(exist_ok=True)
 subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-ss',str(seek),'-i',str(video),'-vf',f'select={select},scale=480:270','-fps_mode','passthrough','-frames:v',str(len(frames)),str(scratch/'%03d.png')],check=True)
 sheet=Image.new('RGB',(1920,300*((len(frames)+3)//4)),'#e4e8ef');draw=ImageDraw.Draw(sheet)
 for i,f in enumerate(frames):
  im=Image.open(scratch/f'{i+1:03d}.png');x=(i%4)*480;y=(i//4)*300;sheet.paste(im,(x,y+25));draw.text((x+8,y+4),f'{name} · f{f} · {f/30:.2f}s',font=font,fill='#182230')
 sheet.save(out/f'{name}-strip.jpg',quality=94)
 subprocess.run(['ffmpeg','-y','-v','error','-ss',str(start/30),'-i',str(video),'-t',str((end-start+1)/30),'-vf','scale=960:540','-c:v','libx264','-threads','2','-preset','fast','-crf','20','-an',str(out/f'{name}-motion.mp4')],check=True)
 report[name]={'from':start,'to':end,'frames':frames,'sourceSha256':source_hash,'strip':str((out/f'{name}-strip.jpg').relative_to(ROOT)),'clip':str((out/f'{name}-motion.mp4').relative_to(ROOT))}
(ROOT/'analysis/motion-qa.json').write_text(json.dumps(report,indent=2))
print(json.dumps({'actions':len(report),'actualExportFrames':sum(len(x['frames']) for x in report.values())}))
