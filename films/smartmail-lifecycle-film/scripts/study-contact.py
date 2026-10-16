from pathlib import Path
import json,subprocess
from PIL import Image,ImageDraw,ImageFont
import sys
VERSION='v7' if '--v7' in sys.argv else 'v6'
R=Path(__file__).resolve().parents[1];O=R/f'out/qa/raw/{VERSION}-motion';O.mkdir(parents=True,exist_ok=True)
sets={
 'intake':[0,12,24,36,48,70,90,110,133,150,164,190,220,240,264,280,300,324],
 'duplicates':[0,16,24,32,40,52,68,90,94,112,130,155,176],
 'files':[0,24,48,64,80,96,110,120,132,146,160,176],
 'execution':[0,16,32,48,64,76,92,110,135,160,180,206],
 'revision':[0,14,30,46,58,62,66,70,74,78,86,100,130,150,170,190,210,230,260,294],
 'history':[0,16,32,48,64,86,88,95,104,111,118,125,138,150,160,175,184,200,218,235,255,275,330,470],
 'eligibility':[0,15,30,50,64,78,93,104,114,127,136,146,165,186,207,220,236,265,300,340,400,471],
 'compose':[0,14,34,52,56,60,66,74,82,95,110,135,145,159,174,182,195,212,235],
}
if VERSION=='v7':
 sets={
  'intake':[0,18,36,54,72,88,106,124,145,164,182,202,224,238,244,266,290,308,324],
  'review':[0,25,44,50,58,64,70,80,86,94,110,125,142,160,176],
  'schedule':[0,18,24,38,48,60,62,76,88,100,112,124,132,140,158,176],
 }
for name,frames in sets.items():
 if len(sys.argv)>1 and name not in sys.argv[1:]:continue
 clip=R/f'out/{VERSION}-{name}-study.mp4'
 if not clip.exists():continue
 selector='+'.join(f'eq(n\\,{f})' for f in frames)
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(clip),'-vf','select='+selector,'-fps_mode','vfr','-q:v','2',str(O/(name+'-%03d.jpg'))],check=True)
 sheet=Image.new('RGB',(1920,298*((len(frames)+3)//4)),'#edf2f8');d=ImageDraw.Draw(sheet);font=ImageFont.truetype(str(R/'public/fonts/OpenSans-Regular.ttf'),18)
 for i,f in enumerate(frames):
  p=O/(name+f'-{i+1:03d}.jpg');im=Image.open(p).resize((480,270));x=i%4*480;y=i//4*298;sheet.paste(im,(x,y));d.text((x+10,y+273),f'{name} · local {f}',font=font,fill='#182230')
 sheet.save(O/(name+'.jpg'),quality=93)
print('Motion contact sheets decoded from production-composition slices')
