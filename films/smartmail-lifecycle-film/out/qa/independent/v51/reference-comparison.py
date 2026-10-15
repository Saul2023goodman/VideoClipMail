from pathlib import Path
import json,subprocess,math
from PIL import Image,ImageDraw,ImageFont
R=Path.cwd();Q=R/'out/qa/independent/v51';D=Q/'reference-cache';D.mkdir(exist_ok=True)
beat=json.loads((R/'src/beat-data.json').read_text());bf=lambda n:math.floor((beat['t0']+n*beat['T'])*30+.5)
def inv(value,xs,ys):
 if value<=ys[0]:return xs[0]
 for i in range(len(ys)-1):
  if value<=ys[i+1]:return round(xs[i]+(xs[i+1]-xs[i])*(value-ys[i])/(ys[i+1]-ys[i]))
 return xs[-1]
heroXs=[0,bf(2),bf(4),bf(5),bf(6.5),bf(8.5),bf(10)-1,bf(12)];heroYs=[0,34,56,68,88,124,142,172]
outroXs=[0,bf(211)-bf(208),bf(212)-bf(208),bf(213)-bf(208),bf(214)-bf(208),176];outroYs=[0,38,46,58,72,144]
sets=[
 ('hero','SpotlightHeroCard.mp4',[0,34,56,68,88,124,142,171],lambda n:inv(n,heroXs,heroYs)),
 ('deal','DeckDealFlyin.mp4',[0,26,36,62,86,101,110,149],lambda n:680+n),
 ('scroll','changelog-scroll-brake.mp4',[0,14,24,38,50,64,82,140],lambda n:857+round(n/150*176)),
 ('scrub','BeforeAfterSliderScrub.mp4',[0,14,26,38,56,80,104,149],lambda n:1595+n),
 ('mosaic','MosaicReframe.mp4',[0,22,52,56,84,128,160,213],lambda n:bf(176)+n),
 ('outro','OutroGroupPhotoLaunch.mp4',[0,16,28,40,50,66,90,132],lambda n:3070+inv(n,outroXs,outroYs)),
]
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
manifest=[]
def decode(path,ns,prefix):
 expr='+'.join(f'eq(n\\,{n})' for n in sorted(set(ns)))
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',str(path),'-vf','select='+expr,'-fps_mode','vfr','-q:v','2',str(D/(prefix+'-%03d.jpg'))],check=True)
 return {n:D/(prefix+f'-{i:03d}.jpg') for i,n in enumerate(sorted(set(ns)),1)}
for name,ref,ns,mp in sets:
 actual=[mp(n) for n in ns]
 rf=decode(R/'references/gallery'/ref,ns,name+'-reference');af=decode(R/'out/smartmail-lifecycle-with-music.mp4',actual,name+'-film')
 canvas=Image.new('RGB',(1920,1192),'#0d141f');draw=ImageDraw.Draw(canvas)
 for i,(a,b) in enumerate(zip(ns,actual)):
  # Two phase pairs per row: reference then current for each phase.
  y=(i//2)*298;x=(i%2)*960
  for dx,p,label in [(0,rf[a],f'Original {name} f{a:03d}'),(480,af[b],f'Current film f{b:04d}')]:
   im=Image.open(p).convert('RGB').resize((480,270),Image.Resampling.LANCZOS);canvas.paste(im,(x+dx,y));draw.text((x+dx+8,y+273),label,font=font,fill='white')
 canvas.save(Q/(name+'-reference-comparison.jpg'),quality=93)
 manifest.append({'name':name,'reference':ref,'reference_frames':ns,'film_frames':actual,'caveat':'scroll comparison is phase-normalized, documented native full-review braking adaptation; not an exact curve or graphic reproduction' if name=='scroll' else 'Camera/crop/textures/colors and documented musical retiming are adaptations; paired phases are not pixel equality assertions'})
(Q/'reference-comparison-manifest.json').write_text(json.dumps(manifest,indent=2))
print(json.dumps(manifest,indent=2))
