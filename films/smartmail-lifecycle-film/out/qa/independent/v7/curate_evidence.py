import pathlib,subprocess,json,hashlib,datetime
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path.cwd();out=root/'out/qa/independent/v7';dest=out/'full-size';dest.mkdir(exist_ok=True)
indices=[105,262,334,430,495,555,675,825,911,929,951,959,1005,1200,1259,1295,1331,1355,1575,1725,1875,2145,2355,2490,2595,2805,2955,3000,3060,3180]
if not all((dest/f'f{i:04d}.png').exists() for i in indices):
 filt='select='+ '+'.join(f'eq(n\\,{i})' for i in indices)
 subprocess.run(['ffmpeg','-v','error','-threads','1','-i','out/smartmail-lifecycle-with-music.mp4','-vf',filt,'-vsync','0',str(dest/'%03d.png')],check=True)
 paths=sorted(dest.glob('[0-9][0-9][0-9].png'))
 assert len(paths)==len(indices)
 for p,i in zip(paths,indices):p.rename(dest/f'f{i:04d}.png')
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',18)
for scene,picks in {'intake':[214,262,285,322,352,400,430,495],'review':[857,881,899,911,929,951,959,1005],'schedule':[1229,1247,1259,1283,1295,1331,1355,1387]}.items():
 sheet=Image.new('RGB',(1920,604),(16,20,28));dr=ImageDraw.Draw(sheet)
 for k,i in enumerate(picks):
  p=out/'decoded'/f'f{i:04d}.jpg';p=p if p.exists() else dest/f'f{i:04d}.png';im=Image.open(p);im.thumbnail((480,270));x=k%4*480;y=k//4*302;sheet.paste(im,(x,y));dr.text((x+8,y+274),f'{scene} · final MP4 f{i}',font=font,fill='white')
 sheet.save(out/f'{scene}-comparison.jpg',quality=93)
lock=json.load(open('analysis/picture-lock-v7.json'));records={}
for f in ['analysis/export-verification.json','analysis/workbench-qa.json','analysis/workbench-parity.json','analysis/portable-v7-qa.json','analysis/picture-lock-v7.json','DESIGN.md']:
 p=root/f;records[f]={'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),'bytes':p.stat().st_size}
failed=[]
for f,h in lock['inputs'].items():
 p=root/f
 if hashlib.sha256(p.read_bytes()).hexdigest()!=h:failed.append(f)
qa=json.load(open('analysis/workbench-qa.json'));pa=json.load(open('analysis/workbench-parity.json'));po=json.load(open('analysis/portable-v7-qa.json'))
summary={'checkedAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'reports':records,'frozenInputsChecked':len(lock['inputs']),'frozenInputMismatches':failed,'workbenchRevision':qa['revision'],'workbenchClips':qa['clips'],'workbenchFrames':qa['exactFrames'],'workbenchPassedChecks':qa['passed'],'workbenchExportSmoke':qa['exportSmoke'],'parity':{'passed':pa['passed'],'frameCount':len(pa['results']),'channelTolerance':pa['channelTolerance'],'maximumDifferenceRatio':pa['maximumDifferenceRatio'],'framesWithPixelsAboveTolerance':[r for r in pa['results'] if r['differingPixels']]},'detached':{'revision':po['revision'],'passed':po['passed'],'independentNodeModules':po['independentNodeModules'],'typeCheckExitCodes':[x['exitCode'] for x in po['finalSourceTypeChecks']],'renderedFrames':len(po['actualProductionCompositionRenders']),'allReportedPixelExact':all(x['differentPixels']==0 and x['maximumChannelDifference']==0 and x['productionSha256']==x['detachedSha256'] for x in po['actualProductionCompositionRenders'])},'scope':'Report evidence reviewed and frozen source/public hashes independently verified; reviewer did not rerun Chrome or Remotion jobs.'}
(out/'current-engineering-checks.json').write_text(json.dumps(summary,indent=2)+'\n')
(out/'curated-frame-manifest.json').write_text(json.dumps([{'frame':i,'file':str((dest/f'f{i:04d}.png').relative_to(root)),'sha256':hashlib.sha256((dest/f'f{i:04d}.png').read_bytes()).hexdigest(),'dimensions':list(Image.open(dest/f'f{i:04d}.png').size)} for i in indices],indent=2)+'\n')
print(json.dumps({'frozenInputsChecked':len(lock['inputs']),'mismatches':failed,'fullSizeFrames':len(indices),'workbenchRevision':qa['revision'],'portableRevision':po['revision'],'parityAboveToleranceFrames':[r['f'] for r in pa['results'] if r['differingPixels']]},indent=2))
