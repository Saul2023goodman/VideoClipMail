# SmartMail Ops — Show the decisions

108.23 seconds · English · 1920 × 1080 · 30 fps.

This reconstruction follows Student 001's 60-contact supervision campaign through the plugin's decisions. Source-content scans drive classification; duplicate records compare normalized keys and require explicit version/contact choices; real mail preview scrolls through every record; each attachment reference resolves before its scope is applied; candidate dates fail concrete scheduling rules before native calendar rows receive their assignments.

Explanation text follows fields, keys, files and dates. There is no burned-in subtitle strip. The English SRT is an optional accessibility sidecar.

- [Music + sound effects](out/smartmail-process-with-music.mp4)
- [Sound effects only](out/smartmail-process-sfx-only.mp4)
- [Editable project](out/SmartMail-Process-Editable-Project.zip)
- [Optional English SRT](out/smartmail-process-english.srt)
- [Independent review](analysis/independent-review.md)

The unchanged native application is captured with fictional names, example.invalid addresses and an offline provider. Prepared email bodies are imported input. The video does not claim AI writing or live message delivery. The original uploaded campaign supplies the institutions, task directions and attachment demands. The added duplicate/review examples make the decision mechanisms visible.

`Batch_inputs.zip` contains 61 candidate DOCX mails, an identical renamed source copy, one reference XLSX, four common PDFs and an uncertain notes document. After source idempotency, classification and two contact decisions, 60 tasks remain. Four PDFs fulfil 211 individual file requirements. The real scheduler produces 60 assignments across 15 dates; the offline execution fixture validates recipient, subject, required file names and scheduled time for every saved draft.

Run the portable project:

```bash
npm ci
npm run check
npm run render
```

The render helper uses installed Chromium when available. Set `REMOTION_BROWSER` to another executable if needed. `SMARTMAIL_RENDER_TEMP` can select a short temporary directory; do not use a long path for Chromium's socket directory. Both exports use the same encoded picture, with `bgm` selecting the music bed. The frozen local media are sufficient to render; re-capture is optional and requires the unchanged extension source plus Python dependencies.

The [motion spec](DESIGN.md), [native capture evidence](analysis/native-capture.json), [candidate-date trace](analysis/scheduler-trace.json), [holiday trace](analysis/holiday-trace.json), exact skill demo sources and locally rendered reference clips are included. `src/timeline.ts` supplies the film and workbench timing. `src/workbench.ts` separates eight scenes, the line transition, music and physical sound cues; object-annotation text, color and placement remain editable inside each scene.

Open the workbench from the video-shotcraft checkout:

```bash
node workbench/scripts/open.mjs /path/to/smartmail-process-film
```

The browser imports the film at http://localhost:5198/?import=project. Edit an object's annotation in its scene properties, adjust timing or sound tracks, then export. Import/edit/undo/export and picture-parity evidence are archived in `analysis/`.

The editable ZIP was extracted into a separate directory, installed from its lockfile with `npm ci`, checked with TypeScript and used to render classification and calendar frames. All 94 rendering inputs match the production bytes, and both rendered frames match production. See [portable verification](analysis/portable-render-verification.json). The independent review distinguishes measured sound timing/levels from unverified subjective listening.
