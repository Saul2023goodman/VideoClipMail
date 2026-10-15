"""Compare a detached installation's actual renders and frozen media inputs."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib, json, subprocess, sys
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
detached = Path(sys.argv[1]).resolve()
frames = [int(s) for s in sys.argv[2].split(',')]
digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
lock = json.loads((root/'analysis/picture-lock-v6.json').read_text())
inputs = []
for name, expected in lock['inputs'].items():
    actual, portable = digest(root/name), digest(detached/name)
    assert actual == portable == expected, name
    inputs.append({'path': name, 'sha256': actual})
comparisons = []
for frame in frames:
    name = f'out/qa/f{frame:04d}.png'
    a = np.asarray(Image.open(root/name).convert('RGB')).astype(np.int16)
    b = np.asarray(Image.open(detached/name).convert('RGB')).astype(np.int16)
    assert a.shape == b.shape == (1080, 1920, 3), name
    difference = np.abs(a-b)
    count = int(np.any(difference != 0, axis=2).sum())
    assert count == 0, (frame, count)
    comparisons.append({'frame': frame, 'differentPixels': count,
                        'maximumChannelDifference': int(difference.max()),
                        'productionSha256': digest(root/name),
                        'detachedSha256': digest(detached/name)})
assert (detached/'node_modules').is_dir()
assert (detached/'node_modules').resolve() != (root/'node_modules').resolve()
assert digest(root/'package-lock.json') == digest(detached/'package-lock.json')
checks = []
for installation in [root, detached]:
    result = subprocess.run(['npm', 'run', 'check'], cwd=installation,
                            capture_output=True, text=True)
    assert result.returncode == 0, result.stdout+result.stderr
    checks.append({'directory': str(installation), 'command': 'npm run check',
                   'exitCode': result.returncode, 'output': result.stdout+result.stderr})
install_log = root/'analysis/portable-v6-install.txt'
report = {
    'revision': 'lifecycle-v6',
    'checkedAtUtc': datetime.now(timezone.utc).isoformat(),
    'detachedInstallation': str(detached),
    'dependencyInstall': 'Own npm ci completed successfully; see analysis/portable-v6-install.txt',
    'cleanInstallEvidenceSha256': digest(install_log),
    'finalSourceTypeChecks': checks,
    'independentNodeModules': True,
    'packageLockSha256': digest(root/'package-lock.json'),
    'frozenRenderingInputs': inputs,
    'actualProductionCompositionRenders': comparisons,
    'passed': True,
}
(root/'analysis/portable-v6-qa.json').write_text(json.dumps(report, indent=2)+'\n')
print(f'Portable QA passed: {len(inputs)} inputs, {len(frames)} identical rendered frames')
