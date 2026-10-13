#!/usr/bin/env python3
"""Package the editable film, local media and review evidence without caches."""
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[1]
PREFIX = 'SmartMail-Ops-Chaos-Choreographed'
archive = ROOT / 'out/SmartMail-Ops-Editable-Project.zip'
files = set()
for folder in ['src','scripts','public/fonts','public/audio']:
    files.update(p for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name!='ui-select-click.wav')
files.update(p for p in (ROOT/'public/textures').glob('*') if p.is_file())
focused = ['dedupe-full.png','preview-full.png','edit-full.png','dedupe-mobile-candidate-0.png','dedupe-mobile-candidate-1.png','dedupe-mobile-controls-0.png','dedupe-header-0.png','editor-recipient-0.png','monitor-summary-0.png','layout.json']
files.update(ROOT/'public/textures/focused'/name for name in focused)
for name in ['README.md','DESIGN.md','AUDIO-LICENSES.md','LICENSE-video-shotcraft.txt','package.json','package-lock.json','tsconfig.json','styleframes.html','.gitignore']:
    path = ROOT/name
    if path.exists(): files.add(path)
archived_names = {'package-manifest.json','independent-review-pre-export.md'}
archived_folders = {'independent-review-pre-export-evidence'}
files.update(p for p in (ROOT/'analysis').rglob('*') if p.is_file() and p.name not in archived_names and not archived_folders.intersection(p.parts) and p.suffix in ['.json','.csv','.md','.txt','.png'])
files.add(ROOT/'references/selected-gallery.json')
files.add(ROOT/'out/smartmail-ops-english.srt')
files.add(ROOT/'out/qa/final/contact-sheet.jpg')
files.update(ROOT/f'out/qa/final/f{frame:04}.png' for frame in [90,174,230,360,510,643,712,830,930,1020,1110,1260,1380,1482,1550])
files.add(ROOT/'out/qa/workbench.png')
files.update((ROOT/'out/qa/phone').glob('*.png'))
assert all(p.is_file() for p in files)
manifest = {'project':PREFIX,'files':[{'path':str(p.relative_to(ROOT)),'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(files)]}
manifest_path = ROOT/'analysis/package-manifest.json'
manifest_path.write_text(json.dumps(manifest,indent=2))
files.add(manifest_path)
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for path in sorted(files):z.write(path,PREFIX+'/'+str(path.relative_to(ROOT)))
with zipfile.ZipFile(archive) as z:assert z.testzip() is None
print(json.dumps({'archive':str(archive),'files':len(files),'bytes':archive.stat().st_size}))
