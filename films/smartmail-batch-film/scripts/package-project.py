#!/usr/bin/env python3
"""Create a portable project without dependencies or the derived frame cache."""
from pathlib import Path
import zipfile,json
ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/'out/SmartMail-Batch-Editable-Project.zip'
PREFIX='SmartMail-Batch-Editable-Project'
roots=['src','public','scripts','analysis','references']
files=[ROOT/n for n in ['README.md','DESIGN.md','AUDIO-LICENSES.md','LICENSE-video-shotcraft.txt','package.json','package-lock.json','tsconfig.json','requirements-prep.txt','.gitignore','.gitattributes']]
for name in roots:
    files.extend(p for p in (ROOT/name).rglob('*') if p.is_file())
files.extend((ROOT/'out/qa/final').glob('contact-*.jpg'))
files.extend(p for p in (ROOT/'out/qa/independent').glob('*') if p.is_file() and p.suffix in ['.png','.jpg','.json'])
files.append(ROOT/'out/qa/workbench.png')
files.append(ROOT/'out/smartmail-batch-english.srt')
with zipfile.ZipFile(TARGET,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for p in sorted(set(files)):
        rel=p.relative_to(ROOT)
        if rel.parts[:3]==('public','native','frames') or p.suffix=='.log':
            continue
        if not p.is_file():
            raise FileNotFoundError(p)
        arc=PREFIX+'/'+rel.as_posix()
        if rel.as_posix()=='src/media.json':
            archive.writestr(arc,json.dumps({'cache':False})+'\n')
        else:
            archive.write(p,arc)
with zipfile.ZipFile(TARGET) as archive:
    assert archive.testzip() is None
    assert json.loads(archive.read(PREFIX+'/src/media.json')) == {'cache':False}
    assert not any('/native/frames/' in name or '/node_modules/' in name for name in archive.namelist())
print(str(TARGET)+' · '+str(round(TARGET.stat().st_size/1024**2,1))+' MiB')
