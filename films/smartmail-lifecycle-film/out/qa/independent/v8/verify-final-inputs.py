"""Read-only independent hash/lock audit for a producer-announced final candidate."""
import argparse, hashlib, json, pathlib, subprocess, datetime
ap=argparse.ArgumentParser()
ap.add_argument('music_sha256');ap.add_argument('sfx_sha256');ap.add_argument('picture_sha256')
a=ap.parse_args()
P=pathlib.Path('/workspace/VideoClipMail/films/smartmail-lifecycle-film')
O=P/'out/qa/independent/v8'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
media={}
for key,name,expected in [('with-music','smartmail-lifecycle-with-music.mp4',a.music_sha256),('sfx-only','smartmail-lifecycle-sfx-only.mp4',a.sfx_sha256),('picture','smartmail-lifecycle-picture.mp4',a.picture_sha256)]:
 p=P/'out'/name
 assert sha(p)==expected,(name,sha(p),expected)
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(p)]))
 packet=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-'],text=True).strip()
 media[key]={'file':str(p.relative_to(P)),'sha256':expected,'bytes':p.stat().st_size,'videoPacketHash':packet,'probe':probe}
assert len({r['videoPacketHash'] for r in media.values()})==1
(O/'media-check.json').write_text(json.dumps({**media,'videoPacketsIdentical':True},indent=2)+'\n')

lock=P/'analysis/picture-lock-v8.json'; l=json.loads(lock.read_text())
bad=[]
for rel,expected in l['inputs'].items():
 p=P/rel
 if not p.exists() or sha(p)!=expected: bad.append(rel)
original={'operations.js':'f064b078f8330cf7fc885e6cb1ce55e2ba899197f999cb5609b5ed870a26abf4',
 'app.js':'5a5d7dc65b96ed16f42f0ef84790247f7bd5b4ca2d599f19fc7ffc55739c110b',
 'app.css':'e49e247df8051f89ae6393ea696ed3f0d865684142ddf33c2e3980b939ccbcdf',
 'ui-system.css':'bb85c53ff54fb90fdbe8673d90b4f6488907b4ce0103606bb5de4224fd107a57'}
native={}
for rel,expected in original.items():
 p=P.parents[1]/rel;h=sha(p);native[rel]={'sha256':h,'matchesOriginal':h==expected}
assert not bad,bad
assert all(x['matchesOriginal'] for x in native.values())
(O/'lock-check.json').write_text(json.dumps({'lockFile':str(lock.relative_to(P)),'lockSha256':sha(lock),'revision':l.get('revision'),'atUtc':l.get('atUtc'),'checkedInputs':len(l['inputs']),'mismatches':bad,'nativeApplication':native},indent=2)+'\n')

reports=['analysis/export-verification.json','analysis/picture-lock-v8.json','analysis/workbench-qa.json','analysis/workbench-parity.json','analysis/portable-v8-qa.json','analysis/incremental-picture.json','analysis/portable-v8-pixel-diagnostics.json','analysis/source-format-v8.json']
inputs=reports+['DESIGN.md','README.md','analysis/v8-review-brief.md','analysis/mailbox-fixture.json',
 'analysis/followup-v8-evidence.json','analysis/native-followup-v8.json','src/FollowupScenes.tsx','src/followup-layout-v8.json',
 'src/lifecycle-data.json','src/audio-cues.json','src/beat-data.json','references/gallery/active-v8.json',
 'references/shotcraft-v8/selection.json','references/shotcraft-v7/selection.json','references/shotcraft-v6/selection.json']
inputs += ['references/shotcraft/final-review.md','references/shotcraft/aesthetic-rules.md',
           'analysis/audio-sources.json','scripts/finalize.mjs','scripts/retime-audio.py']
refs=json.loads((O/'reference-resolution.json').read_text())
for r in refs['variants']:
 for rel,expected in [(r['retainedSource'],r['retainedSourceSha256']),(r['clip'],r['clipSha256'])]:
  assert sha(P/rel)==expected,rel
  inputs.append(rel)
inputs += sorted(str(p.relative_to(P)) for folder in ['shotcraft','shotcraft-v6','shotcraft-v7','shotcraft-v8']
                 for p in (P/'references'/folder).glob('*.md') if p.name in {
                 'spotlight-hero-card.md','scanline-annotate-focus.md','element-body-moves.md',
                 'deck-deal-flyin.md','overhead-camera-moves.md','bezier-source-converge-merge.md',
                 'chart-live-moves.md','canvas-materialize-moves.md','card-flip-reveal.md',
                 'line-carry-transition.md','space-camera-moves.md','row-embed.md','outro-group-photo-launch.md'})
inputs=list(dict.fromkeys(inputs))
inputs += sorted(str(p.relative_to(P)) for p in (P/'out/qa/final').rglob('*') if p.is_file() and p.suffix=='.json')
records=[]
for rel in inputs:
 p=P/rel;records.append({'path':rel,'bytes':p.stat().st_size,'sha256':sha(p)})
(O/'input-hashes.json').write_text(json.dumps({'checkedAtUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'media':{k:{j:v for j,v in r.items() if j!='probe'} for k,r in media.items()},'inputs':records},indent=2)+'\n')
print(json.dumps({'media':{k:r['sha256'] for k,r in media.items()},'lockInputs':len(l['inputs']),'reports':len(reports),'hashRecords':len(records)}))
