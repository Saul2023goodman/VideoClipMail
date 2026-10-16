import argparse,json,pathlib,hashlib,subprocess,math
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ap=argparse.ArgumentParser();ap.add_argument('media');ap.add_argument('expected_sha256');a=ap.parse_args();media=pathlib.Path(a.media);sha=hashlib.sha256(media.read_bytes()).hexdigest();assert sha==a.expected_sha256,(sha,a.expected_sha256)
P=pathlib.Path('/workspace/VideoClipMail/films/smartmail-lifecycle-film');O=P/'out/qa/independent/v8';C=O/'cache';C.mkdir(exist_ok=True,parents=True)
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(media)]));v=next(s for s in probe['streams'] if s['codec_type']=='video');n=int(v['nb_frames'])
ranges=[('hero',0,177),('intake',178,502),('duplicates',503,679),('batch',680,856),('review',857,1033),('files',1034,1210),('schedule',1211,1387),('execution',1388,1594),('revision',1595,1889),('history',1890,2361),('eligibility',2362,2833),('compose',2834,3069),('outro',3070,3246)]
sets={name:sorted(set(round(lo+(hi-lo)*i/23) for i in range(24))) for name,lo,hi in ranges};master=list(range(1890,2834,6));sets.update({'master-'+str(k//24+1):master[k:k+24] for k in range(0,len(master),24)})
needed=set(f for vals in sets.values() for f in vals);metrics=[];prev=None;f=0;cmd=['ffmpeg','-v','error','-threads','1','-i',str(media),'-map','0:v:0','-an','-vf','scale=480:270:flags=lanczos','-pix_fmt','rgb24','-f','rawvideo','-'];p=subprocess.Popen(cmd,stdout=subprocess.PIPE)
while True:
 b=p.stdout.read(480*270*3)
 if not b:break
 assert len(b)==480*270*3
 im=np.frombuffer(b,np.uint8).reshape(270,480,3);d=None if prev is None else np.abs(im.astype(np.int16)-prev.astype(np.int16));l=(im[:,:,0]*.2126+im[:,:,1]*.7152+im[:,:,2]*.0722)
 metrics.append({'frame':f,'meanLuma':round(float(l.mean()),5),'stdLuma':round(float(l.std()),5),'madFromPrevious':None if d is None else round(float(d.mean()),6),'changedGt8Fraction':None if d is None else round(float((d.max(axis=2)>8).mean()),7)})
 if f in needed:Image.fromarray(im).save(C/f'thumb-{f:04}.png')
 prev=im.copy();f+=1
assert p.wait()==0 and f==n,(f,n)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for name,frames in sets.items():
 sh=Image.new('RGB',(1920,math.ceil(len(frames)/4)*300+34),'#e6ebf2');dr=ImageDraw.Draw(sh);dr.text((8,5),name+' | actual V8 encoded frames | 30 fps',font=font,fill='#182230')
 for k,f in enumerate(frames):
  x=(k%4)*480;y=(k//4)*300+34;sh.paste(Image.open(C/f'thumb-{f:04}.png'),(x,y));dr.text((x+8,y+273),'f'+str(f)+'  '+format(f/30,'.3f')+'s',font=font,fill='#182230')
 sh.save(O/('film-'+name+'.jpg'),quality=92,subsampling=0)
full=[80,135,172,330,436,492,570,637,750,825,947,1028,1144,1198,1350,1380,1538,1585,1695,1820,1880,1926,1940,1990,2026,2070,2080,2081,2125,2166,2168,2184,2188,2202,2234,2242,2260,2284,2290,2305,2320,2338,2350,2360,2361,2362,2363,2364,2382,2424,2448,2450,2480,2490,2518,2535,2556,2560,2568,2600,2630,2665,2672,2700,2740,2790,2798,2815,2833,2900,3018,3060,3150,3195,3230,3246]
expr='+'.join(f'eq(n\\,{f})' for f in full);tmp=C/'full';tmp.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(media),'-vf','select='+expr,'-fps_mode','vfr','-y',str(tmp/'%03d.png')],check=True)
for i,f in enumerate(full,1):(tmp/f'{i:03d}.png').rename(C/f'full-{f:04d}.png')
(O/'encoded-metrics.json').write_text(json.dumps({'media':str(media.relative_to(P)),'sha256':sha,'probe':probe,'decodedFrames':n,'sampling':{'sceneSheets':sets,'fullFrames':full},'metrics':metrics},indent=2)+'\n')
print(json.dumps({'mediaSha256':sha,'frames':n,'sheets':len(sets),'fullFrames':len(full)}))
