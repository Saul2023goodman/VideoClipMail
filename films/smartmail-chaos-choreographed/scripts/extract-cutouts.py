#!/usr/bin/env python3
"""Extract traceable native regions for the closing group photo."""
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
TEXTURES = ROOT / 'public/textures'
regions = [
    ('focused/dedupe-mobile-candidate-0.png', 250, 4, (0, 0, 250, 116), 'focused/dedupe-header-0.png'),
    ('focused/edit-full.png', 1920, 4, (636, 199, 300, 50), 'focused/editor-recipient-0.png'),
    ('monitor-full.png', 1920, 2, (35, 287, 455, 125), 'focused/monitor-summary-0.png'),
]
records = []
for source, native_width, density, (x, y, w, h), output in regions:
    image = Image.open(TEXTURES / source)
    assert image.width == native_width * density
    image.crop(tuple(round(v * density) for v in (x, y, x+w, y+h))).save(TEXTURES / output)
    records.append({'source':source, 'output':output, 'density':density, 'nativeRect':{'x':x,'y':y,'w':w,'h':h}})
(ROOT / 'analysis/derived-cutouts.json').write_text(json.dumps(records, indent=2))
print(f'Extracted {len(records)} native regions')
