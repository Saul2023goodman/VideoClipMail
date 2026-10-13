# Independent final review — SmartMail Ops scenario film

Review date: 2026-10-13. Creation mode: autonomous. Reviewer did not implement the film or publish it. No application or film source was edited by this reviewer.

**Final verdict: no outstanding required fixes in the reviewed picture, scenario, feature coverage or measured audio/stream criteria.** The film fulfills the continuous operator-scenario brief. The independently identified saved-message ghost was fixed and verified in the regenerated delivery MP4s. Subjective full-film music/SFX listening and every cue's perceived salience remain outside this review's verified scope; this verdict does not claim those checks passed.

## Review basis and evidence

Read DESIGN.md, README.md, src/timeline.ts, src/ContinuousScene.tsx, src/Main.tsx, the selected Gallery record and exact CursorFlyover.tsx, cursor-flyover.md, the Gallery MP4/contact, final-review.md and all aesthetic rules. Also examined capture-native.py, the application's attachment integrity comparisons, audio preparation/export/QA scripts, final streams, and workbench QA/parity evidence.

The first complete exports have an identical compressed picture stream SHA-256 of `0b2636f10612f17e028c630e8a5f9c3919638e01db470876c16a1fd07ea2b736`. They contain 2,520 H.264 frames, 1920×1080 at 30 fps, duration 84.000 s, and stereo AAC at 48 kHz. These are complete outputs, not the earlier film or partial mux files. The initial stream record is retained in independent-streams-before-fix.json. The **corrected final exports** were independently re-probed and have identical picture stream SHA-256 `99882cbc80a88d276c195f2885bbf02de4f47046aab3666acc523797ceb0aa69`, with the same 84.000 s / 2,520-frame / 1080p30 / stereo 48 kHz AAC specifications. Current independent results are in independent-streams.json, independent-audio.json and independent-stem-parity.json. Both variants were also independently decoded at f905 and f927 and their decoded pixels match.

Visual review included 38 full-resolution decoded picture frames, whole-film consecutive samples at 0.5-second intervals, the final export keyframes, all seven consecutive action strips, and frame-by-frame sampled handoffs around f675–720, f903–930 and f2165–2205. After correction, all 28 consecutive frames f903–930 were independently decoded from the final music MP4 and inspected; representative frames were independently decoded from SFX-only as well. The corrected sequence and two full-resolution examples are `out/qa/independent/corrected-save-sequence.jpg`, `corrected-f0905.png` and `corrected-f0927.png`. Supporting evidence is under `out/qa/independent/`, `out/qa/final/` and `out/qa/motion/`. The review at 480 px width is in `out/qa/independent/mobile-readability.jpg`.

## Numbered findings

1. **P1 ✓ Product goal and audience are clear.** This is a campaign operator preparing invitations and then handling a human conversation. The opening states eight people and one brief; the ending names SmartMail Ops and its campaign/conversation benefit. Evidence: f60, f150, f2090, f2350 and f2460.

2. **P2 / P4 ✓ The rebuilt requirement is visible in the film.** One application plane persists. Cursor travel, classification, selections, real typing, scrolling, scheduling and native maintenance progress advance the action. Captions attach to concrete circumstances. The campaign, contacts and v1/v2 brief recur coherently. This reads as a guided operator scenario, with readable pauses, rather than detached feature slides. Evidence: whole-film consecutive samples and import, dedupe, preview, edit, schedule, maintenance and reply strips. The maintenance footage comes from a separate matched capture; the current DESIGN describes a continuous plane accurately rather than claiming an uninterrupted original recording.

3. **P3 ✓ No unsupported product feature claim found within the stated simulation scope.** The film calls reach “reached” and a human reply a conversation to handle; it does not equate sends with opens or replies with conversions. “Stop new follow-ups” agrees with the native valid-reply decision at f2185. Real NetEase execution and service-worker integration are not validated by this film.

4. **F1 ✓ Mandatory coverage extends well beyond Preview.** Each item has native evidence:

   | Required function | Actual export evidence |
   | --- | --- |
   | Import classification and roster | f150 and f240; invitations, roster and PDF have distinct native purposes |
   | Duplicate decision | f350–432; two Maya drafts, complete candidate selected |
   | Continuous Preview and thumbnail navigation | f555–675; stacked messages, scroll and Alex thumbnail response |
   | Inline edit, formatting and confirmation | f750–805; Nora selected and Maya typed; f835 bold action; f885 save; f930 confirmation |
   | Filename matching and scope | f1090–1150; Match Mail Hints, Auto-matched 8 mail, Covered 8/8 |
   | Local-time/institution scheduling | f1265–1380; Singapore, local time, one contact and seven-day controls; f1450–1510 two send dates |
   | Scheduled attachment maintenance | f1630–1870; three matching drafts, v2 chosen, native read/clone/attachment/verify/swap progression and completed batch |
   | Reply eligibility and next action | f2010–2185; Alex Waiting → Has Reply, valid reply Yes, manual reply/stop automatic follow-up |
   | Reach and conversation metrics | f2285 and f2350; 3/8 reached and Alex's human reply |

5. **F2 / F3 ✓ Operations provide new information.** Preview is not the entire pitch: its rail, the copied greeting and formatting are distinct operations. Maintenance adds a subsequent change to scheduled work, and monitoring adds a human response. The final metrics consolidate that response rather than introducing an unrelated claim. The attachment scope step is the weakest causal beat: coverage is already 8/8 under All Mail before switching to matching. That does not invalidate the demonstrated function, but a more precise caption could explain the guardrail supplied by filename matching. Evidence: f1070–1150.

6. **V1–V4 ✓ Native visual direction is retained.** Cool white, blue, ink text, pale borders and restrained rounded surfaces agree with the recorded product tokens. The film uses native UI typography and a separate Open Sans caption layer. There is no unrelated dark skin, flashing overlay, glow sequence or beat-driven whole-frame shake. Evidence: f350, f780, f1125, f1744, f2090 and f2460.

7. **S1 / S3 / S5 ✓ Cursor-flyover grammar is adapted, with an explicit reference conflict.** The camera easing `.55,0,.18,1`, restrained pullback on large travel, separate cursor path, constant-size pointer, .84 click contraction and 18-frame click ring are present. Native controls replace the demo's module coordinates. The slower workflow timing and frontal camera serve reading. This is an adaptation, not an exact Gallery reproduction.

8. **S2 ⚠ Reference versions conflict; exact reference fidelity cannot be certified.** The selected Gallery index uses style key `cursor-flyover`. Its retained MP4 is a dark generic dashboard, 195 frames / 6.5 s; the card and exact current TSX describe a porcelain workbench, 240 frames / 8 s, with four richer UI responses. The conflict is confirmed against both retained media and code, and documented in AUDIO-LICENSES.md/README.md. The film is assessed against the documented adapted motion, not whichever conflicting reference happens to look more similar. **S4 ✓** targets use measured native positions; no excessive motion blur is used. **S6 N/A:** no missing-preview or reference-only variant is claimed.

9. **B1 / B2 ✓ Storyboard, captions, native state and action cues align.** The canonical ten sections total 2,520 frames. The important order is import → dedupe → review/edit → attachment scope → scheduling → changed brief → reply → outcome. Real app-tab transitions preserve orientation. Minor ranges in the prose storyboard are broader than the canonical section boundaries; this does not change the action order. Evidence: timeline.ts and decoded action strips.

10. **B3 ✓ Ending identity receives sufficient time.** The wordmark reaches full opacity around f2444 and the ending panel settles around f2450. The fade begins at f2507, leaving approximately 1.9 s of fully readable identity. The opening bundle's move lasts over 3 s. No short, unreadable brand sting is used. **B4 ✓** no unexplained removal of a mandatory story beat found.

11. **D1 / D2 / D5 ✓ Data follows the frozen fictional scope.** The eight names, four institutions and reserved example.org addresses are fixture data. Capture blocks non-local requests and throws for unknown/send operations. No customer, secret or live-mail data was found in the viewed film. Provider phases and mutations are simulated; the real app subsequently compares body, recipient, subject, time and attachment state against the fixture. This demonstrates the native UI and business checks, not actual provider clone/delete execution.

12. **D3 / D4 ✓ Application evidence is native.** Screens, layout metadata and crops originate from the actual app. The file bundle and reply excerpt are documented narrative graphics, and Nora's moving card is a native crop. No replacement product UI was found. Fonts, content and native states appear loaded in the reviewed frames; the maintenance recapture fixes the recipient scalar shape. The fixture PDF is a placeholder asset, not a substantive document review demonstration.

13. **A2 / A9 ✓ Final decoded audio timing is measured, not assumed.** Independent correlation used ten physical-SFX probes at f95, f300, f762, f885, f1425, f1488, f1710, f2070, f2080 and f2250. Median output offset is 0.0 frame; maximum target-peak residual is 0.44125 frame. No systematic late output offset is present. Source peak offsets are kept in public/audio/analysis.json; target frames are separate in timeline.ts. The pipeline is Remotion 4.0.484 WAV stems, then FFmpeg AAC/MP4 at 48 kHz. Evidence: independent-audio.json and audio-qa.json.

14. **A3 ✓ Timing framework fits the restrained edit.** Score is a reproducible 120 BPM composition; section starts land on its 15-frame beat grid. There is no hard editorial montage or repeated whole-frame beat impact sequence; native interface changes follow the interaction clock. This verifies the section structure, not every internal musical transient or its perceived fit by ear. **A4 N/A:** the storyboard does not adopt a riser/impact/sparkle finale.

15. **A5 / A7 ✓ SFX selection and duration are controlled.** Active cues use paper, mechanical switches and typewriter hits; no listed synthetic game-feedback UI tone is used. Every cue has a finite duration, including the typing hits. No active >5-second sample is left unbounded. The licenses and originals are recorded. Source material labels support the physical-sound choice; subjective texture audition is not certified here.

16. **A8 ✓ Both outputs use the same picture and SFX stem.** Compressed video stream hashes match. Pre-mux music minus SFX-only WAV equals the source score at gain .54, with maximum residual 0.5 PCM LSB and correlation 0.999999922 across all 4,032,000 samples. Evidence: independent-streams.json and independent-stem-parity.json. No visual variant or alternate cue timing is concealed in the music export.

17. **A1 / A6 ⚠ Levels and presence pass; subjective salience is not fully verified.** Decoded peaks are −12.21 dBFS for SFX-only and −10.08 dBFS for the music mix, with ample clipping headroom. The probes correlate strongly to the actual SFX. Some paper cues are low in whole-window RMS versus music: Nora's handoff −16.4 dB, reply arrival −14.9 dB and Performance entry −19.3 dB. RMS alone does not establish masking, because frequency content and attack matter. These are listening targets, not a proven inaudibility failure. Full-film subjective audio audition is an explicit limitation of this review's tool interface.

18. **Q / aesthetic Q1, Q2, Q3 ✓ Resolved handoff defect, verified in the corrected final export.** At f904–907 and f926–929, hires-0895 blended the saved message over the native source at a different vertical position. TO/subject, greeting and body duplicated into separated lines. Full-resolution proof: `out/qa/independent/detail-motion/save/02.png` (f905) and `save/13.png` (f927); sequence `save.jpg`. The producer removed the redundant corrected-message still, retaining the native moving source. Independent inspection of all final frames f903–930 confirms single stable TO/subject, greeting and body text through camera travel and the Confirm action. Both delivery variants match at f905 and f927. Current proof is corrected-save-sequence.jpg and the two corrected full-resolution PNGs; the original diagnostic files are retained as before-fix evidence. Other tested high-resolution handoffs around f675–720 and f2165–2205 did not reproduce the separated double lines.

19. **Aesthetic Q4–Q6 / Q9 / Q10 ✓ Composition and material treatment are appropriate.** No repeated glints or overflowing light effects. The opening uses one file bundle as the action subject. Dense native UI stays frontal. Nora lands into the measured later-day slot, and the reply excerpt resolves into the native valid-reply decision. Native message density and layout are preserved. Dedicated orbit/material object shots under Q7 and the multi-element launch tableau under Q8 are **not applicable to the user's continuous operator-film direction**; the recorded ending keeps the app and campaign result visible instead.

20. **Aesthetic Q11 ✓ Main narrative and critical evidence are readable, with minor density reservations.** Unscaled 56 px captions, 32 px campaign metadata, and a 102 px closing identity are readable at 480 px review width. Greeting, attachment matches, scheduled dates, the reply excerpt and next action receive useful close-ups. Native tertiary text is smaller and does not all survive mobile reduction; main captions carry those explanations. The maintenance micro-labels and roster rows are the densest supporting evidence. No caption clipping or rounded-mask leak was found. Evidence: mobile-readability.jpg; f780, f1125, f1510, f1744, f2185 and f2460.

21. **Aesthetic R1–R4 ✓ Pacing and camera behavior support the story.** Key outcomes retain reading time, motion uses nonlinear easing, the file bundle and Nora have physical destinations, and no regular beat-scale pump or handheld noise was observed. Short near-static reading periods are purposeful. The camera does sometimes travel through blank native space during navigation (notably f975–1020 and f1205–1230); tighter navigation travel would improve economy, but it does not turn the film into slides.

22. **Aesthetic C1 / C2 ✓ English captions describe the visible circumstance or outcome.** No detached abstract slogan or lengthy unexplained animation segment is used. Brand close is clean. A detached lead-in title card would conflict with this brief, so captions guide new native areas instead. **C3 ✓** Nora and the reply illustration share the application plane; fixed captions are outside the frontal product window, not detached 3D annotations.

23. **Aesthetic S2–S5 / process P1–P4 ✓ Verification and declaration are substantive.** Cue targets are centralized and tied to actions; alternating typewriter samples decrease in gain. Final output timing is measured separately from source attack time. Native before/action/after proof, Gallery adaptation decisions and a complete feature map exist. This independent reviewer found a defect the technical checks missed; the corrected final MP4s have now passed the affected-frame recheck.

24. **Q determinism ✓ Code is frame-driven within the observed scope.** Camera, cursor, illustrations and captions use the absolute film frame; music uses a fixed seed. No Date.now or Math.random occurs in src. Workbench parity reports twelve matching boundary/action frames with zero differing pixels, and its UI QA records import, text editing, undo and JSON export. These are meaningful partial parity checks, not proof that every editable state or full repeated export is identical.

## Required fix

None outstanding. Finding 18 is closed by independent decoding of f903–930, matching representative decoded frames from both variants, and renewed final stream probes. Optional improvements and unable-to-verify scope remain below.

## Suggestions, in priority order

1. Listen specifically to the low paper cues in the music version before adjusting gain; do not infer audibility solely from the aggregate peak check.
2. Reduce camera travel through empty native space during navigation; preserve the meaningful action and reading budget.
3. Explain the filename-matching guardrail more precisely, since both default All Mail and the chosen matching policy cover all eight messages in this fixture.
4. Preserve the documented simulation scope with the source package. A cinematic native demonstration is not a live-provider execution test.

## Unable to verify

1. Subjective music/SFX taste and every cue's perceived audibility during full-film playback. Objective presence, headroom, stem parity and timing are verified.
2. An exact Gallery visual or temporal reproduction because retained preview and current code conflict; no such reproduction is claimed.
3. Real extension installation, service worker, live mailbox/API transport, clone/delete behavior and live sending. These are intentionally outside the isolated capture.
4. Publication, immutable remote download integrity, final ZIP contents and a fresh-machine render. The reviewer did not publish or independently run those delivery steps.
