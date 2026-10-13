# SmartMail Ops — One campaign, from import to reply

An 84-second English product film at 1920×1080, 30 fps. The story follows eight invitations through one application: imported files, Maya's duplicate drafts, a copied greeting, a shared brief, colleagues' send dates, a changed attachment, and Alex's human reply.

The image is a continuous application plane. Real native selections, typing, scrolling, scheduling and validation advance the story. Physical file illustrations enter the actual import area; Nora's real scheduled card moves into its later-date slot; an excerpt of Alex's fictional reply resolves into the native reply decision. Captions explain a problem, an action, or an outcome. There are no detached feature title cards.

## Deliverables

- `out/smartmail-ops-with-music.mp4`: original instrumental score and physical sound effects.
- `out/smartmail-ops-sfx-only.mp4`: the identical picture and sound effects, without the score.
- `out/smartmail-ops-english.srt`: English captions.
- `out/SmartMail-Ops-Editable-Project.zip`: editable source, native media, fonts, licenses, timing and review evidence.

The MP4s are separate downloads. The ZIP contains the media and source needed to edit and render them locally.

The canonical composition and timeline are in `src/Main.tsx` and `src/timeline.ts`. The continuous stage is in `src/ContinuousScene.tsx`. `src/workbench.ts` exposes ten workflow sections, eighteen captions, sound cues and the score as editable tracks. Section imports preserve the absolute native source frame and camera position at their boundaries.

## Render locally

Use Node 24 or a compatible current Node release, Chromium, and FFmpeg:

```bash
npm ci
npm run check
npm run render
```

The renderer uses `/usr/bin/chromium` when present. Set `REMOTION_BROWSER` to another installed Chromium executable when needed. The render creates one silent picture and two audio mixes from the same timeline, then muxes the music and SFX-only versions. The bundled local media is sufficient to render; no application server or live mailbox is required.

For the visual workbench, install the [video-shotcraft project](https://github.com/Vincentwei1021/video-shotcraft), then run its supported opener with this project's directory:

```bash
node /path/to/video-shotcraft/workbench/scripts/open.mjs /path/to/this/project
```

The workbench imports the film automatically. Caption text, campaign name, closing line, graphics accent, clip timing and audio can be edited. Native application footage retains its captured appearance.

## Native capture and scenario

All product surfaces come from the user's unchanged SmartMail Ops extension, initially uploaded at repository commit `13f54fcfc8daeeb6d1630560127fa5dcad55f22b`. Capture uses the actual importer, roster, duplicate decision, review editor, scheduler, attachment-maintenance interface and operations modules.

Names and reserved `example.org` addresses are fictional and frozen. The Chrome storage/runtime boundary is bound to an isolated in-memory mailbox. Non-local page requests are blocked; unknown and send operations throw. Draft replacement is an offline provider simulation: the real application performs its final body, recipient, subject, time and attachment comparisons against the frozen fixture. Extension installation, the service worker and live NetEase transport are outside this capture's verification scope. No live mail is read or sent.

The general native take is sampled at 10 fps, with scrolling and attachment validation at 30 fps; it is encoded on a 30 fps source timeline. The maintenance section is recaptured at 30 fps with native CSS animation time controlled by the film clock. The final camera, pointer and film graphics run at 30 fps. High-resolution detail regions are captured at 4×. Physical illustrations are film graphics and represent fixture content; they do not recreate application screens.

To recapture, install Python's Playwright, NumPy, SciPy and Pillow, and provide the original application root:

```bash
python scripts/capture-native.py --app /path/to/VideoClipMail
python scripts/capture-native.py --app /path/to/VideoClipMail --segment 1530 1890
python scripts/capture-native.py --app /path/to/VideoClipMail --hires
```

The native cutouts, layout metadata and measured maintenance phases document their source. `DESIGN.md` records the scenario, feature coverage, tokens, camera grammar and continuous storyboard. `analysis/` and `out/qa/` contain current export and workbench verification.

Final checks cover stream identity, duration, measured sound-cue alignment, seven consecutive action strips, workbench import/edit/undo, and fourteen sampled parity frames. Twelve parity samples lie outside the corrected-message interval; two additional samples verify that interval using native videos without the derived cache. The independent review records the story and motion findings and their verification limits.

## Sources

The cursor/eye timing and camera easing adapt the cursor-flyover recipe from [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft), revision `e1d15d91374490c59bbbc1a05c2da7efde429828`. The exact reference and gallery conflict are documented in `references/` and `AUDIO-LICENSES.md`. The film uses the native product's colors and interface; it does not incorporate Apple artwork. The music is original; physical SFX and font sources are documented in `AUDIO-LICENSES.md`.
