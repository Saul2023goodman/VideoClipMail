#!/usr/bin/env python3
"""Verify delivery streams and extract the same final-picture review frames."""
import json
import subprocess
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FRAMES = [0,24,90,149,162,174,196,230,299,327,360,419,442,510,569,615,643,674,682,712,749,782,830,869,912,930,971,1020,1049,1080,1110,1169,1205,1260,1319,1350,1380,1439,1444,1468,1482,1510,1550,1607,1619]
report = {}
for variant in ['with-music','sfx-only']:
    path = ROOT / f'out/smartmail-ops-{variant}.mp4'
    data = json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-of','json',str(path)]))
    video = next(s for s in data['streams'] if s['codec_type']=='video')
    audio = next(s for s in data['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'],video['r_frame_rate'],int(video['nb_frames'])) == (1920,1080,'30/1',1620)
    assert video['codec_name']=='h264' and audio['codec_name']=='aac'
    assert float(video['duration'])==54 and float(audio['duration'])==54
    stream_hash = subprocess.check_output(['ffmpeg','-v','error','-i',str(path),'-map','0:v:0','-c','copy','-f','streamhash','-hash','sha256','-'],text=True).strip()
    report[variant] = {'video':{k:video[k] for k in ['codec_name','width','height','r_frame_rate','nb_frames','duration','pix_fmt']},
                       'audio':{k:audio[k] for k in ['codec_name','sample_rate','channels','duration']},
                       'bytes':path.stat().st_size,'videoStreamHash':stream_hash}
report['identicalVideoStreams'] = report['with-music']['videoStreamHash']==report['sfx-only']['videoStreamHash']
assert report['identicalVideoStreams']
(ROOT / 'analysis/export-qa.json').write_text(json.dumps(report,indent=2))

folder = ROOT / 'out/qa/final'
folder.mkdir(parents=True,exist_ok=True)
select = '+'.join(f'eq(n\\,{f})' for f in FRAMES)
subprocess.run(['ffmpeg','-y','-v','error','-i',str(ROOT/'out/smartmail-ops-with-music.mp4'),'-vf',f'select={select}','-fps_mode','passthrough',str(folder/'seq-%03d.png')],check=True)
font = ImageFont.truetype(str(ROOT/'public/fonts/OpenSans-Bold.ttf'),23)
sheet = Image.new('RGB',(1920,2250),'#e4e8ef')
draw = ImageDraw.Draw(sheet)
for i,frame in enumerate(FRAMES):
    source = folder / f'seq-{i+1:03}.png'
    target = folder / f'f{frame:04}.png'
    source.replace(target)
    image = Image.open(target).convert('RGB')
    assert image.size==(1920,1080)
    thumb = image.resize((384,216),Image.Resampling.LANCZOS)
    x,y=(i%5)*384,(i//5)*250
    draw.text((x+12,y+4),f'f{frame:04} · {frame/30:.2f}s',font=font,fill='#182230')
    sheet.paste(thumb,(x,y+34))
sheet.save(folder/'contact-sheet.jpg',quality=94)
phone = ROOT / 'out/qa/phone'
phone.mkdir(exist_ok=True)
for frame in [90,230,360,510,643,712,830,930,1110,1260,1380,1550]:
    Image.open(folder/f'f{frame:04}.png').resize((480,270),Image.Resampling.LANCZOS).save(phone/f'f{frame:04}.png')
print(json.dumps({'identicalVideoStreams':True,'frames':1620,'duration':54,'reviewFrames':len(FRAMES)}))
