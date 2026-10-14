from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import json, subprocess, math, hashlib, sys

ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
OUT.mkdir(parents=True, exist_ok=True)
BEAT = json.loads((ROOT/'analysis/beat_data.json').read_text())
def b(n): return round((BEAT['t0']+n*BEAT['T'])*30)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)

def decode_frames(video, indices, folder):
    folder.mkdir(parents=True, exist_ok=True)
    indices=sorted(set(indices))
    def expr(nums):
        if len(nums)==1:return f'eq(n,{nums[0]})'
        mid=len(nums)//2
        return '('+expr(nums[:mid])+'+'+expr(nums[mid:])+')'
    select=expr(indices)
    subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',f"select='{select}'",
                    '-fps_mode','vfr','-q:v','2',str(folder/'decode-%04d.jpg')],check=True)
    for i,n in enumerate(indices,1):
        (folder/f'decode-{i:04d}.jpg').rename(folder/f'f{n:04d}.jpg')
    return {n:folder/f'f{n:04d}.jpg' for n in indices}

def sheet(name, frames, indices, cols=3, w=640):
    h=round(w*1080/1920)
    canvas=Image.new('RGB',(cols*w,math.ceil(len(indices)/cols)*(h+32)), '#d8dfe5')
    draw=ImageDraw.Draw(canvas)
    for i,n in enumerate(indices):
        im=Image.open(frames[n]).convert('RGB').resize((w,h),Image.Resampling.LANCZOS)
        x=(i%cols)*w;y=(i//cols)*(h+32)
        canvas.paste(im,(x,y+32))
        draw.text((x+10,y+5),f'{name} | f{n:04d} | {n/30:.3f}s',font=font,fill='#182230')
    canvas.save(OUT/(name+'.jpg'),quality=94)

groups = {
  '01-intro':[0,b(1),b(2),b(3),b(5),b(7)],
  '02-source-hash':[b(x) for x in [8,10,11,12,13]],
  '03-mail-scan':[b(x) for x in [14,16,18,20,22,24,25]],
  '04-roster-route':[b(x) for x in [26,27,28,30,32,33]],
  '05-assets-review':[b(x) for x in [34,36,38,40,41,42,45,47,49,51]],
  '06-exact-email':[b(x) for x in [52,55,57,58,59,60,61,62,63]],
  '07-probable-contact':[b(x) for x in [64,67,69,70,72,74,75,77]],
  '08-history':[b(x) for x in [78,80,82,84,86,87]],
  '09-full-batch':[b(88)+x for x in [0,16,32,48,64,80,96,112,128,144,160,176,192,202,215,232]],
  '10-file-resolution':[b(x) for x in [104,107,109,110,112,113]],
  '11-file-scopes':[b(x) for x in [114,116,118,120,122,124,126,127]],
  '12-line-carry':[b(128)+x for x in [0,8,16,24,32,40,48,56,64,72,80,90,102,120,144,175]],
  '13-scheduler':[b(x) for x in [140,142,144,146,148,150,152,154,156,158,160,162,164,166,167]],
  '14-holidays':[b(x) for x in [168,169,170,171,172,173]],
  '15-calendar-embed':[b(174)+x for x in [0,12,22,31,39,46,58,70,82,98,120,145]],
  '16-execution':[b(x) for x in [184,186,188,190,192,194,196,198,200,202,204,206,208,210,211]],
  '17-outro':[b(212)+x for x in [0,12,24,36,48,65,85,110]],
}
allframes=sorted(set(n for nums in groups.values() for n in nums if n<3247))
source=ROOT/('out/smartmail-process-with-music.mp4' if '--final' in sys.argv else 'out/smartmail-process-picture.mp4')
frames=decode_frames(source,allframes,OUT/'frames')
for name,nums in groups.items():sheet(name,frames,[n for n in nums if n<3247],cols=3)
manifest={'source':str(source.relative_to(ROOT)),'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'groups':groups,'frame_count':3247}
(OUT/'frame-manifest.json').write_text(json.dumps(manifest,indent=2))

for name in ['scanline-annotate-focus','changelog-scroll-brake','row-embed','line-carry-transition']:
    video=ROOT/f'references/gallery/{name}.mp4'
    info=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(video)]))['streams'][0]
    count=int(info['nb_frames'])
    indices=list(range(0,count,max(1,round(count/12))))
    ref=decode_frames(video,indices,OUT/'references'/name)
    sheet('reference-'+name,ref,indices,cols=4,w=480)
print('Independent final-picture and exact-demo strips extracted:',len(allframes),'full-resolution frames')
