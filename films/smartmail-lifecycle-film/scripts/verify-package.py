"""Audit the current editable archive against its frozen render and review inputs."""
from pathlib import Path
from urllib.parse import unquote, urlparse
import hashlib
import json
import re
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else ROOT / 'out/SmartMail-Lifecycle-Editable-Project.zip'
PREFIX = 'SmartMail-Lifecycle-Editable-Project/'
sha = lambda data: hashlib.sha256(data).hexdigest()
lock = json.loads((ROOT / 'analysis/picture-lock-v7.json').read_text())
manifest = json.loads((ROOT / 'analysis/review-linked-assets-v7.json').read_text())
report = ROOT / 'analysis/final-review.md'
assert sha(report.read_bytes()) == manifest['frozenReportSha256']
assert ARCHIVE.stat().st_size < 100 * 1024**2

with zipfile.ZipFile(ARCHIVE) as archive:
    names = archive.namelist()
    assert len(names) == len(set(names)), 'Duplicate archive entries'
    assert archive.testzip() is None
    assert all(n.startswith(PREFIX) and '..' not in Path(n).parts for n in names)
    assert not any('/node_modules/' in n or '/__pycache__/' in n or '/.bundle-' in n for n in names)
    contents = {n[len(PREFIX):]: archive.read(n) for n in names}
    for relative, data in contents.items():
        assert sha(data) == sha((ROOT / relative).read_bytes()), relative
    render_entries = {n for n in contents if n.startswith(('src/', 'public/'))}
    assert render_entries == set(lock['inputs']), 'Frozen render input set differs'
    for relative, digest in lock['inputs'].items():
        assert sha(contents[relative]) == digest, relative
    assert sha(contents['analysis/final-review.md']) == manifest['frozenReportSha256']
    for asset in manifest['assets']:
        assert sha(contents[asset['path']]) == asset['sha256'], asset['path']

    external_media = {'out/smartmail-lifecycle-with-music.mp4', 'out/smartmail-lifecycle-sfx-only.mp4'}
    local_links = set()
    for angled, plain in re.findall(r'\]\((?:<([^>]+)>|([^\s)]+))(?:\s+[^)]*)?\)', report.read_text()):
        target = unquote(angled or plain)
        if target.startswith('#') or urlparse(target).scheme:
            continue
        resolved = (report.parent / target.split('#', 1)[0]).resolve()
        relative = resolved.relative_to(ROOT).as_posix()
        assert resolved.is_file(), relative
        assert relative in contents or relative in external_media, relative
        local_links.add(relative)

result = {
    'revision': 'lifecycle-v7',
    'passed': True,
    'archive': ARCHIVE.name,
    'bytes': ARCHIVE.stat().st_size,
    'sha256': sha(ARCHIVE.read_bytes()),
    'entriesVerifiedAgainstWorkspace': len(contents),
    'frozenRenderInputsVerified': len(lock['inputs']),
    'frozenReviewSha256': manifest['frozenReportSha256'],
    'linkedReviewAssetsVerified': len(manifest['assets']),
    'localReportLinksVerified': len(local_links),
    'separatelyDeliveredMedia': sorted(external_media),
    'dependencyOrRenderCachesIncluded': False,
}
(ROOT / 'out/package-v7-verification.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
