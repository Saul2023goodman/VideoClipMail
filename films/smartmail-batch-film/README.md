# SmartMail Ops — Sixty enquiries, one controlled workflow

A complete 108-second English remake, 1920 × 1080 at 30 fps. Student 001's 60 supervision enquiries move through 11 universities, 211 attachment requirements, 15 weekly send dates and the plugin's processing stages.

The film shows input classification, normalized task fields, email-key roster matching, duplicate decisions, multi-mail review, per-mail file resolution, institution-aware scheduling, the frozen execution queue, verified attachment replacement across 59 drafts, and reply-aware follow-up eligibility. The actual unchanged extension interface is combined with moving technical explanations. The original eight-person film's footage and soundtrack are replaced.

## Deliverables

- `out/smartmail-batch-with-music.mp4` — uploaded House Vibez music and physical sound effects.
- `out/smartmail-batch-sfx-only.mp4` — identical encoded picture, with sound effects retained.
- `out/smartmail-batch-english.srt` — English captions; the video already includes them visually.
- `out/SmartMail-Batch-Editable-Project.zip` — source, media, frozen input fixtures, timing, licenses and review evidence.

## Render and edit

Use a recent Node release, Chromium/Chrome with H.264 playback support, and FFmpeg. Run `npm ci`, `npm run check`, then `npm run render`. The archive uses the bundled native video through Remotion's frame-controlled HTML5 player; the workspace may use a derived frame cache for faster rendering. The cache is excluded from the archive. Both paths use the same native source frames. The browser-decoded path is checked at a frame in every scene and avoids the environment's failed off-thread image proxy.

Browser decoding produces slightly brighter native white surfaces than the cached production render. Layout, native content and timing are preserved; the measured comparison is in `analysis/portable-verification.json`.

Set `REMOTION_BROWSER` to your Chrome executable if it is not `/usr/bin/chromium`. A small temporary partition can be avoided with `SMARTMAIL_RENDER_TEMP=/short/path/on/disk`; keep this path short for Chromium's local sockets.

`src/timeline.ts` is the sole scene/caption timing source, built from the measured 122.005 BPM music grid. `src/Scenes.tsx` contains the moving explanations, `src/Native.tsx` the native camera/cursor, and `src/audio-cues.json` the peak-aligned sound cues. Source assets and the preprocessed music bed are local, so rendering needs no live mailbox or application server.

The [video-shotcraft workbench](https://github.com/Vincentwei1021/video-shotcraft) imports the film as 82 editable clips: 11 scenes, 27 captions, 2 overlays, 41 sound cues and the music bed. Run its supported opener with this project directory:

```bash
node /path/to/video-shotcraft/workbench/scripts/open.mjs /path/to/this/project
```

Caption text, font size and accent can be adjusted separately; the campaign label is editable. Scene timing and audio are separate tracks. The local workbench is configured for this environment's system Chromium and two CPU cores, and uses the included Node asset-sync helper where rsync is unavailable.

To recapture native footage, use Python's Playwright and the unchanged extension source: `python scripts/capture-native.py --app /path/to/VideoClipMail`. To rebuild demo inputs from the uploaded bundle, run `python scripts/prepare-demo.py --bundle /path/to/unzipped/bundle`; that optional preparation needs openpyxl. Normal rendering does not require either step.

Optional source preparation and analysis dependencies are listed in `requirements-prep.txt`. To rebuild the prepared SFX from a video-shotcraft checkout, use `python scripts/prepare-audio.py --library /path/to/video-shotcraft/assets/audio/sfx`. The archive already contains the finished local audio assets.

## Data and verification scope

The supplied demonstration roster contributes 60 task IDs, institution assignments, provided subject categories and exact attachment demands. The English bodies are prepared input before import; SmartMail is not presented as an AI email writer. All recipient identities use numbered Supervisor labels and reserved example.invalid addresses. Profile URLs and personal role text are removed before capture. Supporting transcript and MOI samples are not uploaded or automatically attached.

Native import, matching, review, scheduling, execution-queue handling, attachment integrity checks and monitoring run against an isolated provider fixture. Provider responses and later mailbox outcomes are simulated and labelled OFFLINE DEMO in the film. Native capture verifies all 60 input scopes, 211 attachment links and all 59 replacement integrity checks. The live NetEase transport, actual delivery and performance timings are outside this demonstration's scope.

`DESIGN.md`, `analysis/export-verification.json`, `analysis/workbench-parity.json`, `analysis/workbench-qa.json`, `analysis/portable-verification.json` and `analysis/independent-review.md` record the production baseline and completed checks. The new film does not publish or contact anyone.

## Sources

Cursor/camera motion and the group-photo identity handoff adapt exact video-shotcraft recipe implementations included in `references/`. Full audio, font and code attribution is in `AUDIO-LICENSES.md`.

Optional creator credit and sharing links: [X @VincentWei93](https://x.com/VincentWei93), [Douyin @Vincent](https://www.douyin.com/user/MS4wLjABAAAAK1pkjBxilk2Oi_9h_vFyD-lTAu9CTlvhmOtkosDvvxg), [Xiaohongshu @Vincent](https://xhslink.cn/m/At9iP2d5C1V). The film belongs to the user. A voluntary [showcase](https://vincentwei1021.github.io/video-shotcraft/showcase.html) [submission form](https://github.com/Vincentwei1021/video-shotcraft/issues/new?template=showcase.yml) can include the user's own social account links. A Jianying/CapCut project can also be prepared on request.
