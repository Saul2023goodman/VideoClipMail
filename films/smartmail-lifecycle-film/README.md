# SmartMail Ops — Import to follow-up

A 108.23-second English film about one 60-contact campaign, rebuilt with more action in the technical scenes. Real interface captures sit inside animated documents and mail objects. There is no fixed subtitle strip.

A mixed archive opens into one shared reader. ZIP package members identify DOCX/XLSX before the contents determine a purpose: mail fields become Mail, identity rows become Contacts, PDFs remain attachment assets, and uncertain notes stop for a native Ignore for Now decision. Sixty drafts regroup by institution and migrate to their measured native calendar slots. Review now surveys native messages 01/30/60, selects message 30 and dives into a clear frontal body with four requested files.

The duplicate decisions, attachment matching, runtime handoff, safe proposal replacement and evidence-based follow-up process retain their established motion. There is no fixed subtitle strip. The picture is 1920×1080, 30fps, 3247 frames, with the supplied House Vibez track and 72 retimed physical sound cues.

## Deliverables

- [With music](out/smartmail-lifecycle-with-music.mp4)
- [SFX only, identical picture](out/smartmail-lifecycle-sfx-only.mp4)
- [Portable editable project](out/SmartMail-Lifecycle-Editable-Project.zip)
- [Optional English SRT](out/smartmail-lifecycle-english.srt)
- [What changed in our approach](RETROSPECTIVE.md)
- [Product brief, decisions, visual direction and storyboard](DESIGN.md)

The final MP4s are separate downloads. The editable ZIP contains all rendering inputs and verification evidence; `npm run render` rebuilds both films.

## Edit or render

Node 20+ and a supported Chromium browser are required for editing. The complete render command also needs FFmpeg/FFprobe, Python 3 and the Python packages below for muxing and verification. Install the frozen JavaScript dependencies, then open Remotion Studio or render both audio variants:

```bash
npm ci
npm run dev
python3 -m pip install -r requirements-prep.txt
npm run render
```

The renderer automatically uses `/usr/bin/chromium` when available. Set `REMOTION_BROWSER` to another executable if needed. On systems with short Unix socket path limits, set `SMARTMAIL_RENDER_TEMP` to a short writable path.

`src/timeline.ts` defines the only shot timeline. `src/workbench.ts` exposes thirteen scenes, annotation text, accent colors, sounds and music to the Shotcraft workbench. `bgm` selects the soundtrack without changing picture or SFX. The optional SRT is never burned into the picture.

```bash
node /path/to/video-shotcraft/workbench/scripts/open.mjs /path/to/this/project
```

The workbench is available at http://localhost:5198. Thirteen scenes and their annotations, sounds and music are separate clips. The current manifest revision is lifecycle-v7. The original composition and imported project are compared with npm run parity; real import, text editing, undo, JSON and a short native video export are checked with npm run workbench:qa. Exact results and sampled frames are recorded in analysis/workbench-qa.json, analysis/workbench-parity.json and analysis/portable-v7-qa.json.

The portable ZIP includes the dependency lockfile and all captured media. A detached installation runs its own npm ci, type check and selected production-frame renders. It needs no application checkout to edit or render the film.

## Evidence and reproducibility

All people, addresses and mailbox records are fictional. Time is frozen. The unchanged application performs the real import, duplicate review, scheduling and follow-up decisions. Only external mailbox/provider transport is an offline fixture; this boundary is disclosed in the film. These are demonstration results, not claims of a live send.

The frozen later mailbox contains 85 sent records, 8 scheduled drafts and 24 incoming messages for 60 contacts. The unchanged business functions return 20 eligible contacts, 10 with human replies, 12 still waiting, 8 already scheduled, 6 at the attempt limit and 4 ambiguous. Native selection creates exactly 20 follow-ups. A separate call over all contacts produces 20 created / 40 skipped. A template update refreshes 19 managed bodies and preserves 1 manually edited body.

See `DESIGN.md` for the current storyboard, motion contracts and exact business results. Collection and final-file checks are in `analysis/native-capture.json`, `analysis/native-v6-compose.json`, `analysis/native-journey-v7.json`, `analysis/lifecycle-evidence.json`, `analysis/export-verification.json` and `analysis/final-review.md`. `references/gallery` contains locally rendered, unchanged original Shotcraft demonstrations and comparison frames; the hosted gallery was unavailable from this environment. Reference files are evidence only and are not imported by the final film.

The archive retains current review contact sheets, reference clips, exact motion sources, verification scripts and the final independent report. The full-size frames and reference contact sheets linked by that report are also included. Historical reports are labelled by version. Other bulk decoded-frame caches remain local and can be regenerated from the delivered film and reference clips.

Python preparation/QA requires `requirements-prep.txt`. Rebuilding native screenshots additionally requires the unchanged SmartMail application two directories above this film. The portable project includes all captured assets and does not require the application to edit or render.

Music: the supplied Mixkit House Vibez recording. Sound and source notices: [AUDIO-LICENSES.md](AUDIO-LICENSES.md) and [LICENSE-video-shotcraft.txt](LICENSE-video-shotcraft.txt). Remotion has its own license.
