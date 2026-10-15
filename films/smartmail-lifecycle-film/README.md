# SmartMail Ops — Import to follow-up

A complete 108.23-second English product film rebuilt around a sixty-contact campaign and its later mailbox history. The picture uses genuine native application captures, deterministic Shotcraft motion and scene-specific annotations. There is no fixed subtitle strip.

The campaign moves through content-based source routing, two distinct duplicate decisions, complete batch review, per-mail attachment resolution, an institution-aware send plan, verified offline draft preparation and safe attachment revision. The later sequence shows recipient-based conversation history, automatic versus human and ambiguous replies, follow-up eligibility, personalized composition and template ownership.

## Deliverables

- [With music](out/smartmail-lifecycle-with-music.mp4)
- [SFX only, identical picture](out/smartmail-lifecycle-sfx-only.mp4)
- [Portable editable project](out/SmartMail-Lifecycle-Editable-Project.zip)
- [Optional English SRT](out/smartmail-lifecycle-english.srt)
- [What changed in our approach](RETROSPECTIVE.md)
- [Product brief, decisions, visual direction and storyboard](DESIGN.md)

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

The workbench is available at http://localhost:5198. The original composition and decomposed project are checked by `npm run parity`; browser import, editing, undo, JSON and a real short video export are exercised by `npm run workbench:qa`. Seventeen sampled frames across the thirteen scenes pass picture parity, including three frames of the corrected native scroll. After its own `npm ci` and TypeScript check, the detached installation rendered those three review frames identically, with all 153 rendering inputs matching production bytes. Earlier attachment-comparison and eligibility checks remain applicable to their unchanged scenes.

## Evidence and reproducibility

All people, addresses and mailbox records are fictional. Time is frozen. The unchanged application performs the real import, duplicate review, scheduling and follow-up decisions. Only external mailbox/provider transport is an offline fixture; this boundary is disclosed in the film. These are demonstration results, not claims of a live send.

The frozen later mailbox contains 85 sent records, 8 scheduled drafts and 24 incoming messages for 60 contacts. The unchanged business functions return 20 eligible contacts, 10 with human replies, 12 still waiting, 8 already scheduled, 6 at the attempt limit and 4 ambiguous. Native selection creates exactly 20 follow-ups. A separate call over all contacts produces 20 created / 40 skipped. A template update refreshes 19 managed bodies and preserves 1 manually edited body.

See `analysis/native-capture.json`, `analysis/lifecycle-evidence.json`, `analysis/export-verification.json` and `analysis/final-review.md`. `references/gallery` contains locally rendered, unchanged original Shotcraft demonstrations and comparison frames; the hosted gallery was unavailable from this environment. Reference files are evidence only and are not imported by the final film.

The archive retains review contact sheets, comparisons, selected full-resolution/phone-size evidence and verification scripts. Bulk decoded-frame caches remain local and can be regenerated from the delivered film.

Python preparation/QA requires `requirements-prep.txt`. Rebuilding native screenshots additionally requires the unchanged SmartMail application two directories above this film. The portable project includes all captured assets and does not require the application to edit or render.

Music: the supplied Mixkit House Vibez recording. Sound and source notices: [AUDIO-LICENSES.md](AUDIO-LICENSES.md) and [LICENSE-video-shotcraft.txt](LICENSE-video-shotcraft.txt). Remotion has its own license.
