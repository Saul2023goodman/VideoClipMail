from pathlib import Path
from PIL import Image
r=Path(__file__).resolve().parents[1]
# Genuine native UI slices, in CSS coordinates at 2x capture density.
els=[('import','01-classification',280,235,720,180,490,160,.64,-2,0,-260),('mail','mail-00',0,0,363,142,310,345,1.18,-5,-700,0),('followup','25-followup-review',21,175,364,142,1600,350,1.12,5,700,0),('calendar','12-calendar',290,260,900,300,1450,805,.60,-3,500,360),('monitor','19-monitor-overview',9,187,1160,200,440,825,.56,3,-400,360),('files','09-attachments-linked',42,700,900,150,760,960,.58,2,0,400),('rules','11-rules',600,256,720,140,1150,145,.65,-2,0,-400),('revision','18-maintenance-complete',8,180,900,150,1530,980,.56,-2,500,0),('queue','14-complete',11,97,1880,120,960,50,.64,0,0,-300)]
arr=[]
for i,(k,file,x,y,w,h,cx,cy,sc,rot,dx,dy) in enumerate(els):
 im=Image.open(r/f'public/native/{file}.png'); im.crop((x*2,y*2,(x+w)*2,(y+h)*2)).save(r/f'public/native/outro-{k}.png')
 arr.append(f"  {{key:'{k}',file:'outro-{k}.png',w:{w},h:{h},cx:{cx},cy:{cy},scale:{sc},rot:{rot},dx:{dx},dy:{dy},radius:10,cue:{4+i*3}}},")
s=(r/'references/shotcraft/OutroGroupPhotoLaunch.tsx').read_text()
s=s.replace("import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing }", "import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing }")
s=s.replace("from '../../_fixtures/PageCam2D'","from './lib/PageCam2D'").replace("from '../../_fixtures/Polish'","from './lib/Polish'")
s=s.replace("import layout from '../../_textures/live-layout.json';", "import {beatF,COLORS} from './timeline';\nimport {Mark} from './ui';\nconst BRAND={name:'SmartMail Ops',font:'OpenFilm',ink:'#182230'};")
s=s.replace("import { BRAND, PITCH, ShotcraftMark } from '../../_fixtures/Brand';",'')
s=s.replace('const PAGE_H = layout.projects.pageH;','const PAGE_H = 1080;').replace('const WBR_PAGE_H = layout.wbr.pageH;','const WBR_PAGE_H = 1080;')
a=s.index('const ELS: FlyEl[] = [');b=s.index('\n];',a)+3;s=s[:a]+"const ELS:FlyEl[]=[\n"+'\n'.join(arr)+'\n];'+s[b:]
s=s.replace('export const OutroGroupPhotoLaunch: React.FC = () => {\n  const frame = useCurrentFrame();', '''export const Outro: React.FC<{duration?:number;primaryText?:string;secondaryText?:string;accent?:string}> = ({duration:clipDuration=177,primaryText=BRAND.name,secondaryText='Import. Review. Schedule. Follow up.',accent='#1769e0'}) => {
  const raw=useCurrentFrame();
  const anchors=[0,beatF(211)-beatF(208),beatF(212)-beatF(208),beatF(213)-beatF(208),beatF(214)-beatF(208),clipDuration-1];
  const frame=interpolate(raw,anchors,[0,38,46,58,72,144],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const LETTERS=primaryText.split('');''')
s=s.replace('src="textures/live/projects-full.png"','src="native/20-dashboard.png"').replace('cy: 700, zoom: 0.75','cy: 540, zoom: 1.0')
s=s.replace('textures/live/${el.file}','native/${el.file}').replace('<ShotcraftMark size={154} tone="light" />','<Mark size={138} />')
s=s.replace('{PITCH.en.motto}','{secondaryText}').replace("fontFamily: MONO, fontSize: 32, letterSpacing: '0.16em'","fontFamily: BRAND.font, fontSize: 38, letterSpacing: '0.015em'")
s=s.replace("'#0f0d0a'","'#081422'")
s=s.replace('rgba(250,247,242,','rgba(239,245,252,').replace('rgba(30,25,18,','rgba(8,20,34,').replace('rgba(255,244,224,','rgba(220,238,255,').replace('rgba(255,246,228,','rgba(225,240,255,').replace('rgba(62,48,32,','rgba(8,20,34,').replace('rgba(255,253,248,','rgba(255,255,255,').replace('rgba(60,44,24,','rgba(8,20,34,')
s=s.replace('oklch(78% 0.085 80)','#9bc4ff').replace('oklch(84% 0.08 82 / 0.6)','rgba(155,196,255,.6)').replace('oklch(86% 0.1 82 / 0.9)','rgba(155,196,255,.9)').replace('oklch(86% 0.1 82 / 0.35)','rgba(155,196,255,.35)').replace('oklch(86% 0.1 82 / 0)','rgba(155,196,255,0)').replace('oklch(52% 0.115 65)','${accent}')
# accent expression inside normal string literals
s=s.replace("background: '${accent}'",'background: accent').replace('oklch(42% 0.008 82)','#52647a').replace('oklch(90% .008 82)','#dce5f1')
s=s.replace('color: BRAND.ink','color: BRAND.ink').replace("fontSize: 118","fontSize: 116")
(r/'src/Outro.tsx').write_text(s)
