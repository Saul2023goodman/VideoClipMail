import subprocess,json,hashlib
from pathlib import Path
from PIL import Image,ImageDraw
R=Path.cwd();Q=R/'out/qa/independent';Q.mkdir(exist_ok=True)
F=R/'out/smartmail-lifecycle-with-music.mp4'
pairs=[('hero',F,[0,30,60,75,98,127,148,177],R/'references/gallery/SpotlightHeroCard.mp4',[0,34,56,68,88,124,142,171]),('deal',F,[680,706,716,730,742,766,790,856],R/'references/gallery/DeckDealFlyin.mp4',[0,26,36,50,62,86,110,149]),('mosaic',F,[2598,2620,2650,2662,2690,2726,2760,2810],R/'references/gallery/MosaicReframe.mp4',[0,22,52,64,92,128,162,212]),('outro',F,[3070,3074,3090,3110,3123,3141,3159,3203],R/'references/gallery/OutroGroupPhotoLaunch.mp4',[0,4,20,40,53,71,89,133]),('scrub',F,[1595,1609,1621,1633,1651,1699,1744,1786],R/'references/gallery/BeforeAfterSliderScrub.mp4',[0,14,26,38,56,104,149,149])]
def frames(file,nums,key):
 folder=Q/key;folder.mkdir(exist_ok=True)
 chosen=sorted(set(nums));vf='select='+ '+'.join('eq(n\\,%d)'%n for n in chosen)+',scale=480:270'
 subprocess.run(['ffmpeg','-y','-v','error','-i',str(file),'-vf',vf,'-fps_mode','vfr',str(folder/'%04d.jpg')],check=True)
 imgs=[Image.open(p).copy() for p in sorted(folder.glob('*.jpg'))]
 return {n:im for n,im in zip(chosen,imgs)}
for title,a,an,b,bn in pairs:
 aa=frames(a,an,title+'-final');bb=frames(b,bn,title+'-reference')
 sheet=Image.new('RGB',(1920,1160),'#e8eef5');d=ImageDraw.Draw(sheet)
 for k in range(8):
  col=k%4;row=(k//4)*2
  for rr,num,ims,label in [(row,an[k],aa,'FINAL'),(row+1,bn[k],bb,'REFERENCE')]:
   x=col*480;y=rr*290;sheet.paste(ims[num],(x,y));d.text((x+7,y+273),f'{label} {title} f{num}',fill='#182230')
 sheet.save(Q/(title+'-compare.jpg'),quality=94)
more=[857,869,881,893,905,917,929,941,953,965,977,989,1001,1013,1025,1033]
im=frames(F,more,'review-sequence');sheet=Image.new('RGB',(1920,1160),'#e8eef5');draw=ImageDraw.Draw(sheet)
for k,n in enumerate(more):x=k%4*480;y=k//4*290;sheet.paste(im[n],(x,y));draw.text((x+7,y+273),f'FINAL review f{n}',fill='#182230')
sheet.save(Q/'review-sequence.jpg',quality=94)
print('Created five direct final/reference comparisons and the 16-frame full-batch scroll sequence.')
