# SmartMail Ops — Chaos, choreographed

A 54-second English product film about scaling preparation while keeping each message deliberate. Real application screenshots show the complete workflow: import classification, reference roster matching, duplicate choices, continuous review, semantic highlights, inline editing, attachment scope, institution scheduling, draft attachment maintenance, monitoring and performance.

The captured account and all contacts, drafts and mailbox facts are fictional offline fixtures. No live messages were accessed or sent. The original SmartMail Ops application was not modified.

## Files

- `out/smartmail-ops-with-music.mp4` — 1920×1080, 30 fps, original instrumental score and SFX.
- `out/smartmail-ops-sfx-only.mp4` — identical picture, retained SFX, music removed.
- `out/SmartMail-Ops-Editable-Project.zip` — portable source, local media, captions and review evidence. Final MP4 exports are supplied separately from this archive.
- `src/timeline.ts` — single timing source for shots, captions and sound cues.
- `src/scenes.tsx` — editable native-page and graphic scenes.
- `src/workbench.ts` — per-shot editing schemas and decomposition manifest.
- `DESIGN.md` — brief, visual direction, storyboard, product evidence and privacy method.
- `AUDIO-LICENSES.md` — sound and font sources.
- `analysis/` and `out/qa/` — production and review evidence.

## Run and edit

Requirements: Node 24 or a recent supported Node version, npm, FFmpeg and Chromium/Chrome. Install exact locked dependencies with `npm ci`. In the cloud, use `npm ci --cache /workspace/.cache/npm --no-audit --no-fund`.

Run `npm run check`, `npm run dev`, or `npm run render`. The render script exports one H.264 picture and PCM audio twice through the same Remotion timeline using `bgm: true` and `bgm: false`, then muxes both final AAC MP4s with FFmpeg. Set `REMOTION_BROWSER` to your Chrome executable if it is not installed at `/usr/bin/chromium`. A system browser keeps cloud rendering independent of the blocked browser download host.

Headlines, section labels, type size and accent are exposed per shot in the video-shotcraft workbench. From that repository, run `node workbench/scripts/open.mjs /path/to/this/project` to link and import the film. The manifest also exposes captions and separate SFX/music tracks. The workbench language is English.

The prepared screenshots, cutouts, fonts and WAV files are included, so editing or rendering does not require the original app or network services. Optional capture and audio-preparation scripts document how the frozen assets were made; capture requires the unchanged app and its offline Chrome bindings at the workspace paths used in this cloud.

In this cloud, the workbench is launched with a workspace-local adapter that adds the supported system-browser flags to its Export video command. No plugin source changes are needed. See `/workspace/video-tools/remotion-browser.cjs`. The native Export command is verified with an eight-frame render; the complete workbench reconstruction is checked against the original at fifteen frames across every shot.

## Further editing and optional sharing

MP4s can be imported directly into CapCut or another editor. For editing inside individual shots, use the included Remotion source or the workbench schemas.

The film is yours. Optional video-shotcraft author credit: [X @VincentWei93](https://x.com/VincentWei93), [Douyin @Vincent](https://www.douyin.com/user/MS4wLjABAAAAK1pkjBxilk2Oi_9h_vFyD-lTAu9CTlvhmOtkosDvvxg), [Xiaohongshu @Vincent](https://xhslink.cn/m/At9iP2d5C1V).

If you choose to share it in the [showcase](https://vincentwei1021.github.io/video-shotcraft/showcase.html), the [submission form](https://github.com/Vincentwei1021/video-shotcraft/issues/new?template=showcase.yml) can include links to your social profiles. No public submission is made automatically.
