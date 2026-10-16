import json,pathlib,hashlib,subprocess,math,sys
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path.cwd();out=root/'out/qa/independent/v7';(out/'decoded').mkdir(exist_ok=True);(out/'film-contacts').mkdir(exist_ok=True)
expected=json.loads(pathlib.Path(sys.argv[1]).read_text()) if len(sys.argv)>1 else {}
files=['out/smartmail-lifecycle-with-music.mp4','out/smartmail-lifecycle-sfx-only.mp4']
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
media=[]
for name in files:
 p=root/name;h=sha(p)
 if name in expected and h!=expected[name]:raise RuntimeError(f'Unexpected SHA-256 for {name}: {h}')
 meta=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_streams','-show_format','-of','json',str(p)]))
 media.append({'file':name,'sha256':h,'bytes':p.stat().st_size,'probe':meta})
 (out/(p.stem+'-probe.json')).write_text(json.dumps(meta,indent=2)+'\n')
 md5file=out/(p.stem+'-video.framemd5')
 if not md5file.exists() or len([x for x in md5file.read_text().splitlines() if not x.startswith('#')])!=3247:
  with md5file.open('w') as fp:
   run=subprocess.run(['ffmpeg','-v','error','-threads','1','-i',str(p),'-map','0:v:0','-f','framemd5','-'],stdout=fp,stderr=subprocess.PIPE)
  (out/(p.stem+'-decode.log')).write_bytes(run.stderr)
  if run.returncode:raise RuntimeError(run.stderr.decode())
a=(out/'smartmail-lifecycle-with-music-video.framemd5').read_text();b=(out/'smartmail-lifecycle-sfx-only-video.framemd5').read_text()
rows=lambda t:[x for x in t.splitlines() if not x.startswith('#')]
parity=rows(a)==rows(b)
shots=json.load(open('analysis/timeline.json'))['SHOTS'];n=3247
indices=set(range(0,n,15))
for s in shots:
 start=s['from'];end=start+s['duration']-1
 indices.update(range(max(0,start-2),min(n,start+3)))
 indices.update(range(max(0,end-2),min(n,end+3)))
 if s['id'] in ['intake','review','schedule']:indices.update(range(start,end+1,6))
indices=sorted(indices)
terms=['not(mod(n\\,15))']
for shot in shots:
 start=shot['from'];end=start+shot['duration']-1
 terms.extend([f'between(n\\,{max(0,start-2)}\\,{min(n-1,start+2)})',f'between(n\\,{max(0,end-2)}\\,{min(n-1,end+2)})'])
 if shot['id'] in ['intake','review','schedule']:terms.append(f'between(n\\,{start}\\,{end})*not(mod(n-{start}\\,6))')
expr='select='+ '+'.join(terms)
run=subprocess.run(['ffmpeg','-v','error','-threads','1','-i',files[0],'-vf',expr,'-vsync','0','-q:v','3',str(out/'decoded/%04d.jpg')],stderr=subprocess.PIPE)
if run.returncode:raise RuntimeError(run.stderr.decode())
frames=sorted((out/'decoded').glob('*.jpg'))
if len(frames)!=len(indices):raise RuntimeError((len(frames),len(indices)))
for p,i in zip(frames,indices):p.rename(p.with_name(f'f{i:04d}.jpg'))
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
contacts=[]
for s in shots:
 picks=[i for i in indices if s['from']<=i<s['from']+s['duration']]
 for chunk in range(math.ceil(len(picks)/12)):
  chunkp=picks[chunk*12:(chunk+1)*12];sheet=Image.new('RGB',(1920,math.ceil(len(chunkp)/4)*302),(16,20,28));draw=ImageDraw.Draw(sheet)
  for k,i in enumerate(chunkp):
   im=Image.open(out/'decoded'/f'f{i:04d}.jpg');im.thumbnail((480,270));x=k%4*480;y=k//4*302;sheet.paste(im,(x,y));draw.text((x+8,y+274),f'{s["id"]} · f{i} · local {i-s["from"]}',font=font,fill='white')
  dest=out/'film-contacts'/f'{s["id"]}-{chunk+1:02d}.jpg';sheet.save(dest,quality=91);contacts.append({'scene':s['id'],'frames':chunkp,'file':str(dest.relative_to(root))})
report={'media':media,'fullVideoDecodeErrorFree':True,'allDecodedVideoFramesEqualAcrossAudioVariants':parity,'decodedFrames':len(rows(a)),'visuallySampledFrames':indices,'contacts':contacts,'method':'FFmpeg decoded both entire final MP4 video streams into per-frame hashes; visual samples are exact MP4 frames, dense 6f sampling through the three redesigned scenes plus 15f sampling over the entire timeline and all cut boundaries. No browser/Remotion rendering was used.'}
(out/'delivery-verification.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'sha256':{x['file']:x['sha256'] for x in media},'pictureParity':parity,'frames':len(rows(a)),'visualSamples':len(indices),'contacts':len(contacts)},indent=2))
