"""Portable editable project; no dependencies, build bundles or raw render cache."""
from pathlib import Path
import zipfile,sys,json,hashlib
R=Path(__file__).resolve().parents[1];TARGET=Path(sys.argv[1]).resolve() if len(sys.argv)>1 else R/'out/SmartMail-Lifecycle-Editable-Project.zip';PREFIX='SmartMail-Lifecycle-Editable-Project'
linked_manifest=R/'analysis/review-linked-assets-v6.json'
linked={}
if linked_manifest.is_file():
 manifest=json.loads(linked_manifest.read_text())
 assert hashlib.sha256((R/'analysis/final-review.md').read_bytes()).hexdigest()==manifest['frozenReportSha256']
 for asset in manifest['assets']:
  name=asset['path'];assert name.startswith('out/qa/independent/v6/') and '..' not in Path(name).parts
  assert hashlib.sha256((R/name).read_bytes()).hexdigest()==asset['sha256']
  linked[name]=asset
files=[p for n in ['src','public','scripts','analysis','references'] for p in (R/n).rglob('*') if p.is_file()]
files += [R/n for n in ['README.md','DESIGN.md','RETROSPECTIVE.md','AUDIO-LICENSES.md','LICENSE-video-shotcraft.txt','package.json','package-lock.json','tsconfig.json','requirements-prep.txt','.gitignore','.gitattributes']]
files += [p for p in (R/'out/qa/independent/v6').rglob('*') if p.is_file() and p.suffix in ['.png','.jpg','.json','.py','.mjs','.md','.framemd5']]
files += list((R/'out/qa/final').glob('contact-*.jpg')) + [R/'out/qa/final/poster.png',R/'out/qa/final/frame-manifest.json',R/'out/qa/workbench.png',R/'out/smartmail-lifecycle-english.srt']
with zipfile.ZipFile(TARGET,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(set(files)):
  rel=p.relative_to(R)
  if p.suffix in ['.log','.pyc'] or '__pycache__' in rel.parts:continue
  if rel.parts[:3]==('out','qa','independent') and {'frames','reference-cache','review-motion-cache','scroll-check'}.intersection(rel.parts) and rel.as_posix() not in linked:continue
  if rel.parts[0]=='analysis' and (p.name.startswith(('stills-','01-')) or p.name in ['native-sheet.jpg','intake-sheet.jpg','revision-inspect.jpg']):continue
  if not p.is_file():raise FileNotFoundError(p)
  z.write(p,PREFIX+'/'+rel.as_posix())
with zipfile.ZipFile(TARGET) as z:
 assert z.testzip() is None
 assert not any('/node_modules/' in n or '/.bundle-' in n for n in z.namelist())
assert TARGET.stat().st_size<100*1024**2
print(TARGET,round(TARGET.stat().st_size/1024**2,1),'MiB')
