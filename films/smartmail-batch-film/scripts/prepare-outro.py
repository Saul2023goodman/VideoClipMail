"""Make semantic native fragments, retaining their exact pixels and text."""
from pathlib import Path
from PIL import Image
import json
ROOT=Path(__file__).resolve().parents[1];P=ROOT/'public/native'
spec={
 'import':('files-b023.png',(0,0,650,128)),
 'roster':('roster-b053.png',(440,85,970,240)),
 'review':('preview-b071.png',(0,0,1100,430)),
 'files':('attachments-b094.png',(0,0,850,558)),
 'schedule':('schedule-b122.png',(500,0,1120,330)),
 'replace':('result-b179.png',(0,0,198,70)),
 'monitor':('b191.png',(80,582,796,786)),
 'execute':('b149.png',(140,1805,1240,1870)),
}
for k,(source,box) in spec.items():Image.open(P/source).crop(box).save(P/f'outro-{k}.png')
(ROOT/'analysis/outro-fragments.json').write_text(json.dumps(spec,indent=2))
