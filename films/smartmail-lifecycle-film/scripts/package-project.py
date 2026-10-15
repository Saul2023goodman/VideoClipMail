"""Portable editable project; no dependencies, build bundles or raw render cache."""
from pathlib import Path
import zipfile
R=Path(__file__).resolve().parents[1];TARGET=R/'out/SmartMail-Lifecycle-Editable-Project.zip';PREFIX='SmartMail-Lifecycle-Editable-Project'
files=[p for n in ['src','public','scripts','analysis','references'] for p in (R/n).rglob('*') if p.is_file()]
files += [R/n for n in ['README.md','DESIGN.md','RETROSPECTIVE.md','AUDIO-LICENSES.md','LICENSE-video-shotcraft.txt','package.json','package-lock.json','tsconfig.json','requirements-prep.txt','.gitignore','.gitattributes']]
files += [p for p in (R/'out/qa/independent').rglob('*') if p.is_file() and p.suffix in ['.png','.jpg','.json','.py','.mjs','.md','.framemd5']]
files += list((R/'out/qa/final').glob('contact-*.jpg')) + [R/'out/qa/final/poster.png',R/'out/qa/final/frame-manifest.json',R/'out/qa/workbench.png',R/'out/smartmail-lifecycle-english.srt']
with zipfile.ZipFile(TARGET,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(set(files)):
  rel=p.relative_to(R)
  if p.suffix in ['.log','.pyc'] or '__pycache__' in rel.parts:continue
  if rel.parts[:3]==('out','qa','independent') and {'frames','reference-cache','review-motion-cache','scroll-check'}.intersection(rel.parts):continue
  if rel.parts[0]=='analysis' and (p.name.startswith(('stills-','01-')) or p.name in ['native-sheet.jpg','intake-sheet.jpg','revision-inspect.jpg']):continue
  if not p.is_file():raise FileNotFoundError(p)
  z.write(p,PREFIX+'/'+rel.as_posix())
with zipfile.ZipFile(TARGET) as z:
 assert z.testzip() is None
 assert not any('/node_modules/' in n or '/.bundle-' in n for n in z.namelist())
assert TARGET.stat().st_size<100*1024**2
print(TARGET,round(TARGET.stat().st_size/1024**2,1),'MiB')
