"""Curate lossless decoded inspection frames into a small, full-size review set.

This only writes independent review evidence; it does not alter film inputs/media.
"""
import argparse, hashlib, json, math, pathlib, shutil
from PIL import Image, ImageDraw, ImageFont

ap = argparse.ArgumentParser()
ap.add_argument('expected_sha256')
a = ap.parse_args()
P = pathlib.Path('/workspace/VideoClipMail/films/smartmail-lifecycle-film')
O = P / 'out/qa/independent/v8'
C = O / 'cache'
m = json.loads((O / 'encoded-metrics.json').read_text())
assert m['sha256'] == a.expected_sha256
assert hashlib.sha256((P / m['media']).read_bytes()).hexdigest() == a.expected_sha256

# Every proof retains the exact encoded frame's 1920x1080 dimensions.
proofs = [135,436,637,825,1028,1198,1380,1585,1880,1940,2026,2184,
          2260,2350,2448,2490,2535,2556,2568,2630,2740,2815,3060,3195]
for f in proofs:
    Image.open(C / f'full-{f:04d}.png').convert('RGB').save(
        O / f'f{f:04d}.jpg', quality=94, subsampling=0, optimize=True)

font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 20)
def board(name, frames, columns=4):
    tile_w, tile_h, bar = 480,270,32
    rows = math.ceil(len(frames)/columns)
    out = Image.new('RGB', (columns*tile_w, rows*(tile_h+bar)+40), '#e6ebf2')
    d = ImageDraw.Draw(out)
    d.text((10,7), name+' | current encoded V8 | 30 fps', font=font, fill='#182230')
    for i,f in enumerate(frames):
        x,y = (i%columns)*tile_w,(i//columns)*(tile_h+bar)+40
        p = C / f'thumb-{f:04d}.png'
        if p.exists():
            im = Image.open(p)
        else:
            im = Image.open(C / f'full-{f:04d}.png').resize((tile_w,tile_h),Image.Resampling.LANCZOS)
        out.paste(im,(x,y))
        d.text((x+10,y+273),f'f{f}  {f/30:.3f}s',font=font,fill='#182230')
    out.save(O/(name+'.jpg'),quality=92,subsampling=0,optimize=True)

board('film-overview',[135,330,436,570,637,750,825,947,1028,1144,1198,1350,
                       1380,1538,1585,1695,1880,1940,2184,2490,2630,2815,3060,3195])
board('followup-motion',[1926,1990,2026,2080,2125,2184,2242,2260,2290,2320,
                         2350,2382,2424,2448,2490,2535,2556,2568,2630,2672,2740,2798,2833])

# Dense sheets were inspected, but stay in local cache instead of the portable proof set.
dst = C / 'final-dense-sheets'
dst.mkdir(exist_ok=True)
for p in O.glob('film-*.jpg'):
    if p.name != 'film-overview.jpg':
        shutil.move(str(p), str(dst / p.name))

visuals = sorted(O.glob('f[0-9][0-9][0-9][0-9].jpg')) + [
    O/'film-overview.jpg', O/'followup-motion.jpg', O/'reference-contact.jpg']
total = sum(p.stat().st_size for p in visuals)
if total > 12*2**20:
    for p in visuals:
        if p.name.startswith('f') and p.stem[1:].isdigit():
            f = int(p.stem[1:])
            Image.open(C / f'full-{f:04d}.png').convert('RGB').save(
                p,quality=91,subsampling=0,optimize=True)
    total = sum(p.stat().st_size for p in visuals)
assert total <= 12*2**20, (total,total/2**20)

records = [{'path':str(p.relative_to(P)), 'bytes':p.stat().st_size,
            'sha256':hashlib.sha256(p.read_bytes()).hexdigest(),
            'dimensions':list(Image.open(p).size)} for p in visuals]
(O/'visual-proof-manifest.json').write_text(json.dumps({
    'mediaSha256':a.expected_sha256,'encoding':'Full-size JPEG; no chroma subsampling; quality94 (91 if size budget requires). Contact sheets quality92.',
    'totalBytes':total,'totalMiB':total/2**20,'files':records},indent=2)+'\n')
print(json.dumps({'proofFiles':len(visuals),'bytes':total,'MiB':total/2**20}))
