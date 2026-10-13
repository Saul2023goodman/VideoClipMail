# SmartMail Ops — Chaos, choreographed

## Production brief

Original autonomous creative production with video-shotcraft. The user asked for a bold, insightful, coherent English-language film and confirmed SmartMail Ops as its subject. The user explicitly requested attention to details throughout the product, with the Apple Preview-inspired review surface as one stage rather than the film's only focus. Creative choices are recorded here and carried through without additional approval gates.

SmartMail Ops is a Chrome extension for preparing, reviewing, scheduling and maintaining personalized outreach drafts in NetEase Mail. The audience is researchers, founders and small teams coordinating thoughtful outreach. The core proposition is to scale preparation while preserving individual intent. No AI writing, guaranteed outcomes or live sends are claimed.

Delivery: 54 seconds, 1620 frames, 1920×1080, 30 fps, English titles, English UI and English fictional content. Provide music and SFX-only MP4 versions, editable Remotion source and an editable workbench manifest.

## Requirements to decisions

| Requirement | Execution and evidence |
|---|---|
| Bold creativity | A physical folded message opens the film; accelerating file-row landings, a freeze/annotation/thaw rail, a schedule reveal and a multi-element closing launch vary the motion. |
| Product-wide details | Separate shots cover classifier roles, roster matching, duplicate decisions, review navigation, semantic highlights, inline editing, attachment scope, local-time and institution schedule rules, draft maintenance, contact monitoring and performance. |
| Preview is one stage | Only two of eleven shots cover review: one establishes its continuous pages and thumbnail rail; one focuses on editing and deliberate attention. |
| Coherence and insight | A blue continuity line follows the workflow. Copy progresses from source purpose to individual choices, thoughtful timing, context-aware follow-up and human outcomes. |
| Product accuracy | All app surfaces are native screenshots from the unchanged imported extension. Only the opening envelope, stage, titles, framing and cinematic annotations are graphic constructions. |
| English | All film copy, fixtures, edit labels and deliverable documentation are English. |
| Privacy | Frozen fictional names and reserved example.org addresses. An offline simulated account and fictional mailbox facts are used. No live mail was accessed or sent. |
| Portability | Local Open Sans fonts with their license, local screenshot textures and audio. No external fonts or render-time services. |
| Editability | src/timeline.ts is the timing source of truth for SHOTS, captions and SFX. Workbench clip schemas expose headlines, labels, size and accent. |

## Visual direction and source tokens

Three directions considered: light editorial control room; neon mail storm; Chaos, choreographed. Select the third because expressive, physical motion can reveal the product's orderly workflow without changing its native identity. The neon storm is rejected as unrelated to the product.

Native ui-system.css tokens: background #f4f6f8; surface #fff; ink #182230; muted #667085; accent #1769e0; darker blue #1257bd; blue-soft #eaf2ff; border #dfe5ec; green #16834a; 12px radius. Inter/system sans is the native stack. Portable Open Sans is used for film titles as a deliberate sans fallback; proprietary system fonts are not redistributed. Film type: 82–128px headlines, 56px narrative captions, review annotation and closing line; 32px auxiliary chapter/state/platform labels. The final rail uses layout zoom 1.78 and native crop scale 2, so even its 9px native field labels reach 32.04px before the focus lift. Fine overview screenshot text serves as context rather than the primary proof.

The dark stage (#091a32 with restrained blue illumination) extends the product's dark text and blue controls. White and cool grey dominate the workflow. No unrelated purple neon, amber paper, repeated glints, camera shake or synthetic notification tones. Native caution colors remain inside screenshots as native UI evidence.

Styleframes were made in styleframes.html and inspected as out/qa/style-signal.png, style-review.png and style-launch.png before animation implementation. Their purpose is palette, material, typography and framing; the storyboard below supersedes their placeholder labels.

## Gallery selection and adaptation

Validated against gallery/api/library.json and archived in references/selected-gallery.json:

| Card / style key | Exact demo source | Adopted grammar | Adaptation |
|---|---|---|---|
| row-embed / row-embed | demos/ui-entrance/row-embed/RowEmbed.tsx | Cues 12/22/31/39/46, 12f accelerated descent, 16° flattening, .995 press recovery, 5f seam growth and 8f decay; landing hold. | Real classification file rows and inspector fields replace the demo's metadata rows. Blue seams replace warm accents. |
| speed-ramp-freeze / freeze-annotate | demos/rhythm/speed-ramp-freeze/FreezeAnnotateReal.tsx | Freeze 45, thaw 112, land 134; page-space 652px pitch / 26px-per-source-frame, quintic thaw, 16px lift / 1.03 focus, ink 54–64, arrow 64–73, fade 104–112. | A readable native highlight excerpt freezes; the same rail thaws into native recipient editing and B/I/U controls. Layout zoom 1.78 frames the page-space motion. Blue underline/arrow replace the reference's circle/brackets/pin; velocity blur/timecode are omitted. |
| outro-group-photo-launch / outro-group-photo-launch | demos/outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx | Nine elements, cues 4+3i, 12f overshoot, contact press, 4° crane to flat at 40, recede 42–50, letterpress 42+i×1.8, rule 58–70, closing line 68–80, deterministic dust. | Blue/white captured fragments from all workflow stages surround SmartMail Ops. No repeated per-element glow. Ending extended to provide a long brand hold. |

Dynamic references were downloaded from the author's Gallery release and contact sheets are stored beside them. Reference note: the freeze-annotate Gallery preview shows a simpler placeholder treatment than the current exact demo source. The production baseline uses the indexed variant and the demo's timing grammar, not pixel identity with that preview. An independent reviewer must report this reference drift explicitly.

PageCam.tsx is copied from video-shotcraft/assets/lib and retains its layout-scale zoom and pivot math. The native background is recolored to the product token.

## Final storyboard and feature coverage

All ranges are half-open, and derive from src/timeline.ts. Hard scene changes align to the 120 BPM score grid (15 frames per beat). One primary action per shot; steady reading holds follow the motion.

| Shot / frames / time | Native feature or proof | Primary action | Headline / caption | Sound |
|---|---|---|---|---|
| Signal / 0–150 / 0–5s | Graphic introduction to deliberate outreach | One folded message arrives, opens, settles; action lasts over 3 seconds. | The next conversation starts here. / One message. A deliberate workflow. | Paper slide, physical click. |
| Sources / 150–300 / 5–10s | Real CSV mail, reference roster and PDF attachment roles; parsed fields; enlarged native Reference Roster 8 / Mail ↔ Roster 9 results | row-embed on three file rows and two inspector fields, then hold and match proof | Sources, understood. / Mail, rosters and attachments. Classified together. | Five alternating physical switch clicks at landings. |
| Dedupe / 300–420 / 10–14s | Both native same-recipient candidates, selected/unchecked states, shared address and keep controls | Two-version comparison settles into focus | One recipient. Your decision. / Compare versions. Keep the message you mean. | Physical switch click. |
| Preview / 420–570 / 14–19s | Continuous mail pages, thumbnail rail, native semantic legend | PageCam gently flattens and settles | See the whole message. / Thumbnail navigation. Continuous pages. Full context. | Paper turn. |
| Detail / 570–750 / 19–25s | Native highlighted recipient, institution and salutation/name; readable recipient input and B/I/U controls | Moving rail freezes, annotates, thaws into the editor and holds | Read clearly. Edit in place. / Native highlights. Editing in place. | Physical switch click, pen stroke, paper movement. |
| Attachments / 750–870 / 25–29s | Native Match Mail Hints policy and covered attachment requirements | One filename-to-scope connection resolves | The right file. The right mail. / Match filenames. Choose exactly which mail. | Physical switch click. |
| Schedule / 870–1050 / 29–35s | Singapore local time, one contact/institution/day, 7-day spacing, workdays and holiday avoidance; applied matrix | Rules reveal the resulting native institution schedule | Good timing is thoughtful. / Local time. Institution limits. Room between sends. | Click, paper slide. |
| Maintenance / 1050–1170 / 35–39s | Native Fast Attachments utility and old attachment group | A restrained depth-to-flat reveal | New attachment. Same intention. / Replace attachments. Keep content and send times. | Paper slide. |
| Monitor / 1170–1320 / 39–44s | Native contact summary and human reply changing the next step; contextual follow-up rules | Contact progression comes into focus | Know what happens next. / A human reply changes the next step. | Physical switch click. |
| Performance / 1320–1440 / 44–48s | Native reach, follow-up depth and emerging human replies | Full-width title and proof panels settle; no invented metric animation | Measure effort. Notice people. / Reach. Follow-up depth. Human conversations. | Physical switch click. |
| Launch / 1440–1620 / 48–54s | Native source, dedupe, review, edit, attachment, schedule, maintenance, monitoring and reach fragments | Gallery group-photo launch with inward contact press; long wordmark and closing line hold | SmartMail Ops / Scale the preparation. Keep the intention. / A Chrome extension for NetEase Mail. | Original riser builds during assembly, then deep impact and one restrained light sweep. No caption bar. |

## Data and capture methodology

scripts/capture-product.py serves the unchanged extension over a temporary local HTTP origin and uses Playwright with system Chromium. Chrome extension loading is blocked by cloud administrator policy, so Chrome runtime and storage APIs are simulated in the isolated capture context. All non-local requests are blocked; unknown operations, including send operations, throw. This is a product demonstration fixture, not a live mailbox demonstration.

Initial sources are frozen in analysis/fictional-campaign.csv and analysis/fictional-roster.csv: eight contacts across four fictional institutions, one deliberately repeated message, one fictional PDF. The real importer classifies files, matches the roster, resolves exact duplicate versions and lets the operator keep different contacts when similarity checks ask. The real attachment policy matches source filenames. The real scheduler assigns November 7 and 14, 2030, at 07:30 Singapore time. No Create Drafts action is invoked.

The monitoring stage switches the offline mailbox fixture to three historical sent-mail records and one human reply. The native Operations module derives monitoring and performance; no UI numbers or screenshot text are manually painted. Draft attachment scanning also uses three offline fictional draft records sharing an attachment version; replacement is not invoked. A synthetic demo@example.org account may appear in screenshot chrome. No customer information, credentials or real mailbox state is present.

Overview screenshots and cutouts are at 2× CSS resolution. scripts/capture-focused.py repeats the same offline workflow at 4× for enlarged proof. Both duplicate headers are captured at the app's native compact viewport layout, including its own source-text ellipsis; the film crops away the lower body and sticky action overlay. public/textures/layout.json and focused/layout.json record native coordinates. scripts/extract-cutouts.py records the closing group's derived native crop coordinates in analysis/derived-cutouts.json. Capture files remain reviewable, and original application source is not modified. A Unicode-only Inter fallback supplies the missing U+2197 and U+21E7 symbols from the installed DejaVu Sans; Latin typography and geometry remain unchanged.

## Sound plan and source rights

The visual timeline was established before sound design. scripts/prepare-audio.py composes an original restrained electronic instrumental at 120 BPM (seed 7319) with bass, soft percussion and warm sustained chords. It is generated locally, contains no sampled music and follows the exact 15-frame beat grid. The score builds from the opening to the launch and fades with the visual ending.

Physical SFX are from the skill's documented Mixkit Sound Effects Free License assets. Individual provenance is in AUDIO-LICENSES.md. The two click sources are the explicitly physical switch-light and switch-click-quick assets; the row burst alternates them with descending gain and accelerating spacing. Prepared sources are normalized and their peak/trim offsets measured in public/audio/analysis.json. Long assets have explicit windows. An original noise riser is normalized to a 0.34 source peak for a clearer build. No game-like confirmation bleeps are used. Objective checks can confirm mix levels and timing; perceptual listening remains a stated review limitation in this cloud.

src/timeline.ts derives every cue from its shot and separates source attack offsets from the common output offset. Final audio QA must measure the rendered pipeline, record any compensation and verify cue residuals. The no-music version keeps the identical picture and SFX timeline.

## Completion checks

Required: TypeScript passes; keyframes inspected; final video metadata and audio peaks verified; both audio variants share identical decoded video frames; independent clean-context review against the selected cards and final-review.md; workbench import and original/imported frame parity. Final evidence is written to out/qa/ and analysis/.

## Final verification record

The native workbench reconstruction matched the original with zero differing pixels at 15 frames spanning every shot, including row landings, freeze/thaw, schedule reveal and closing letterpress. Evidence: analysis/parity-qa.json and out/qa/parity/. Headline editing, undo and project JSON export are checked separately.

The final pipeline renders one silent H.264 picture and PCM audio from the same Main/timeline twice using bgm true/false and an audio-only visual bypass. FFmpeg muxes both AAC MP4s with standard encoder edit-list compensation and the canonical 54-second end time. The renderer's 16-sample PCM tail is excluded at the mux boundary. Four SFX cross-correlation probes measure a common output offset of 0.005 frames; source attack rounding accounts for a maximum residual of 0.452 frames. No output compensation is needed. Evidence: analysis/audio-qa.json and pcm-audio-qa.json. The ending impact is the strongest declared cue; perceptual audition is outside the cloud review's verified scope.

Both exports retain the same copied video stream, with 1620 frames, 1920×1080, 30 fps and 54 seconds. Final-video frames are extracted in out/qa/final/.

The revision-3 workbench imports all 44 clips, exposes English headline/caption/annotation controls, restores a test edit with Undo and exports the full project JSON. Its native Export video command also completes an eight-frame proof render using the installed system browser. Evidence: analysis/workbench-qa.json, workbench-project.json and workbench-export-probe.json. The two original Git repositories remain clean.
