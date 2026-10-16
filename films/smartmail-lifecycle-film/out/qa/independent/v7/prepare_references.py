import json, pathlib, hashlib, subprocess, math
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path.cwd(); out=root/'out/qa/independent/v7'; (out/'reference-contacts').mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
active=json.loads((root/'references/gallery/active-v7.json').read_text())['activeCards']
lib=json.loads(pathlib.Path('/workspace/video-shotcraft/gallery/api/library.json').read_text())['cards']
lib={x['name']:x for x in lib}
checks=[]
for x in active:
 checks.append({'card':x['name'],'indexMatches':x==lib.get(x['name'])})
selected=[]
for x in json.loads((root/'references/shotcraft-v7/selection.json').read_text())['selected']:
 selected.append((x['selectedStyle'],root/x['exactSource'],x['sourceSha256'],root/x['originalClip']))
for x in json.loads((root/'references/shotcraft-v6/selection.json').read_text())['selected']:
 selected.append((x['style'],root/'references/shotcraft-v6'/pathlib.Path(x['source']).name,x['exactTsxSha256'],root/x['originalClip']))
prov=json.loads((root/'references/gallery/provenance.json').read_text())
for x in prov['local_originals']:
 p=root/x['file']
 if p.stem in ['BeforeAfterSliderScrub','ChangelogScrollBrake']:continue
 selected.append((p.stem,p,x['sha256'],root/'references/gallery'/f'{p.stem}.mp4'))
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
records=[]
for style,source,expected,clip in selected:
 meta=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_streams','-show_format','-of','json',str(clip)]))
 v=next(x for x in meta['streams'] if x['codec_type']=='video'); n=int(v['nb_frames']); inds=sorted(set([min(n-1,x) for x in [0,12,24,36,48,60,72,86,94,110,128,150,176,n-1]]))
 cols=4; cellw=480; cellh=302; sheet=Image.new('RGB',(cols*cellw,math.ceil(len(inds)/cols)*cellh),(16,20,28)); draw=ImageDraw.Draw(sheet)
 folder=out/'reference-contacts'/style;folder.mkdir(exist_ok=True)
 # select exact decoded frames; no browser render.
 filt='select='+ '+'.join(f'eq(n\\,{i})' for i in inds)
 subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(clip),'-vf',filt,'-vsync','0','-q:v','2',str(folder/'%03d.jpg')],check=True)
 for k,(i,jpg) in enumerate(zip(inds,sorted(folder.glob('*.jpg')))):
  im=Image.open(jpg).convert('RGB');im.thumbnail((480,270)); x=(k%cols)*cellw;y=(k//cols)*cellh;sheet.paste(im,(x,y));draw.text((x+8,y+274),f'{style} · f{i}',font=font,fill='white')
 dest=out/'reference-contacts'/f'{style}.jpg';sheet.save(dest,quality=90)
 for p in folder.glob('*.jpg'):p.unlink()
 folder.rmdir()
 records.append({'style':style,'source':str(source.relative_to(root)),'sourceSha256':sha(source),'matchesRecordedSource':sha(source)==expected,'clip':str(clip.relative_to(root)),'clipSha256':sha(clip),'frames':n,'fps':v['avg_frame_rate'],'dimensions':[v['width'],v['height']],'contact':str(dest.relative_to(root)),'contactFrames':inds})
(out/'reference-verification.json').write_text(json.dumps({'method':'FFmpeg exact frame decode of existing unchanged local reference clips; no new reference render.','galleryIndexChecks':checks,'references':records},indent=2)+'\n')
print(json.dumps({'indexChecks':checks,'references':[{'style':x['style'],'matchesRecordedSource':x['matchesRecordedSource'],'frames':x['frames'],'contact':x['contact']} for x in records]},indent=2))
