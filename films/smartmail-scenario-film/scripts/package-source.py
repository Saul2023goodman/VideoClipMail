#!/usr/bin/env python3
"""Package editable source and native media; exclude derived render caches."""
import hashlib,json,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
PREFIX='SmartMail-Ops-One-Campaign'
archive=ROOT/'out/SmartMail-Ops-Editable-Project.zip'
files=set()
for folder in ['src','scripts','public/fonts','public/audio','public/native','references']:
 files.update(p for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
for name in ['README.md','DESIGN.md','AUDIO-LICENSES.md','LICENSE-video-shotcraft.txt','package.json','package-lock.json','tsconfig.json','.gitignore']:
 files.add(ROOT/name)
exclude={'package-manifest.json','native-window-probe.png','native-f11-probe.png','native-recorder-probe.mp4','source-fallback-qa.json','native-save-01.png','native-save-02.png','native-save-region.png','detail-review-contact.jpg'}
files.update(p for p in (ROOT/'analysis').rglob('*') if p.is_file() and p.name not in exclude and not p.name.endswith('-log.txt') and p.suffix in {'.json','.csv','.md','.png','.jpg'})
files.add(ROOT/'out/smartmail-ops-english.srt')
files.add(ROOT/'out/qa/final/contact-sheet.jpg')
files.add(ROOT/'out/qa/workbench.png')
files.update(p for p in (ROOT/'out/qa/phone').glob('*.png'))
files.update(p for p in (ROOT/'out/qa/motion').glob('*') if p.is_file())
independent=ROOT/'out/qa/independent'
for name in ['mobile-readability.jpg','detail-motion/save.jpg','detail-motion/save/02.png','detail-motion/save/13.png']:
 files.add(independent/name)
files.update(p for p in independent.rglob('corrected-*') if p.is_file())
assert all(p.is_file() for p in files)
manifest={'project':PREFIX,'files':[{'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(files)]}
manifest_path=ROOT/'analysis/package-manifest.json';manifest_path.write_text(json.dumps(manifest,indent=2));files.add(manifest_path)
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(files):z.write(p,PREFIX+'/'+str(p.relative_to(ROOT)))
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'archive':str(archive),'files':len(files),'bytes':archive.stat().st_size}))
