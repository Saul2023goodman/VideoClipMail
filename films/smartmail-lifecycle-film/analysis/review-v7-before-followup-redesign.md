# Independent final review — SmartMail lifecycle V7

**Verdict: no must-fix product or visual defect found in the verified scope.** The three requested redesigns communicate format recognition, deliberate message inspection, and active batch scheduling. Objective export/audio checks pass. Perceptual audio audition is unverified; this is not an unconditional audio sign-off.

This was a clean-context, review-only assessment of the completed delivery files. No production source or media was edited. Autonomous free creation; English only; no fixed subtitle strip. The current [design](../DESIGN.md), [review brief](v7-review-brief.md), exact active cards/demo TSX, unchanged local reference clips, native truth records and current engineering reports were read. Historical review reports and `RETROSPECTIVE.md` were not read.

## Reviewed media and evidence

| Delivery file | SHA-256 |
|---|---|
| [With music](../out/smartmail-lifecycle-with-music.mp4) | `87d24797f9ce0a763ca671fb8912397a1cac00f4ebb0976748580595427c3053` |
| [SFX only](../out/smartmail-lifecycle-sfx-only.mp4) | `98bd74b85f26365fbc1d61903005a1fada4927fb295fc8adc1369c48e4d0e4f3` |

Both complete video streams were independently decoded without errors: **3247 frames, 1920×1080, 30 fps, 108.233333 s**. All 3247 decoded pictures match across the two audio variants. Visual inspection used 398 sequential samples across all thirteen scenes and cut boundaries, including six-frame sampling through the three redesigned scenes, followed by targeted full-size PNG inspection. Linked full-size JPEG proofs retain 1920×1080 dimensions and were saved at quality 96 with no chroma subsampling; lossless inspection caches remain local. Numeric and pixel-comparison evidence is unchanged. This is a frame-based review of the full timeline, not a claim of continuous real-time playback or inspection of every pixel in every frame.

Independent records: [delivery verification](../out/qa/independent/v7/delivery-verification.json), [curated full-size frame manifest](../out/qa/independent/v7/curated-frame-manifest.json), [reference verification](../out/qa/independent/v7/reference-verification.json), [truth cross-check](../out/qa/independent/v7/truth-verification.json), [audio verification](../out/qa/independent/v7/audio-verification.json), and [current engineering report hashes/checks](../out/qa/independent/v7/current-engineering-checks.json).

`✓` means supported by the inspected evidence. `△` marks a qualified finding or suggestion. `?` means the stated aspect could not be verified.

## P — Product goals

- **P1 ✓** The product and benefit are clear: a sixty-contact outreach workflow from import through follow-up. [f105](../out/qa/independent/v7/full-size/f0105.jpg), [f825](../out/qa/independent/v7/full-size/f0825.jpg), and [f3180](../out/qa/independent/v7/full-size/f3180.jpg) establish the workflow, batch scale and SmartMail identity.
- **P2 ✓** The requested priorities receive concrete visual arguments. The [import arc](../out/qa/independent/v7/intake-comparison.jpg) distinguishes package format from content purpose; the [review arc](../out/qa/independent/v7/review-comparison.jpg) selects a native message for inspection; the [scheduling arc](../out/qa/independent/v7/schedule-comparison.jpg) follows the same mail population into a real plan.
- **P3 ✓** No unsupported product claim was found. DOCX recognition precedes purpose routing; uncertain notes require a manual choice; PDFs take the asset path, with no OCR claim. The schedule says one per institution/day, matching the actual max-one-mail-per-institution-per-send-day rule. [f334](../out/qa/independent/v7/full-size/f0334.jpg), [f430](../out/qa/independent/v7/full-size/f0430.jpg), [f1355](../out/qa/independent/v7/full-size/f1355.jpg). Preview says **requested**, before the subsequent linking scene; message 30's four requirements match the native record.
- **P4 ✓** The recorded execution choices appear in the film: one shared inspection space, same-format sources with different outcomes, operator resolution, selection then frontal inspection, institution regrouping and measured native calendar landing. The three new scenes retain the established paper/blue/cool-desk language rather than introducing a separate visual system.

## F — Functional completeness

- **F1 ✓** All required feature groups have identifiable evidence:

| Feature | Actual encoded evidence |
|---|---|
| Mixed import, duplicate bytes, format and purpose | f178–502; [package/content evidence f334](../out/qa/independent/v7/full-size/f0334.jpg), [manual choice f430](../out/qa/independent/v7/full-size/f0430.jpg), [distinct totals f495](../out/qa/independent/v7/full-size/f0495.jpg) |
| Same-email version choice and same-name/different-email preservation | [f555](../out/qa/independent/v7/full-size/f0555.jpg), [f675](../out/qa/independent/v7/full-size/f0675.jpg) |
| Sixty-mail batch | f680–856; [f825](../out/qa/independent/v7/full-size/f0825.jpg) |
| Recipient, body and requested-file inspection | f857–1033; [recipient f959](../out/qa/independent/v7/full-size/f0959.jpg), [four requirements f1005](../out/qa/independent/v7/full-size/f1005.jpg) |
| Per-mail attachment matching and 211 links | f1034–1210; [native result f1200](../out/qa/independent/v7/full-size/f1200.jpg) |
| Active scheduling of sixty drafts | f1211–1387; [institution groups f1259](../out/qa/independent/v7/full-size/f1259.jpg), [date columns f1295](../out/qa/independent/v7/full-size/f1295.jpg), [native result f1355](../out/qa/independent/v7/full-size/f1355.jpg) |
| Single-job execution and sixty saved drafts | f1388–1594; [f1575](../out/qa/independent/v7/full-size/f1575.jpg) |
| Verified proposal-copy replacement | f1595–1889; [verification f1725](../out/qa/independent/v7/full-size/f1725.jpg), [59-result f1875](../out/qa/independent/v7/full-size/f1875.jpg) |
| Actual recipient history and four reply cases | f1890–2361; [reply evidence/contact arc](../out/qa/independent/v7/film-contacts/history-02.jpg), [human/unmatched outcomes](../out/qa/independent/v7/film-contacts/history-03.jpg) |
| Latest actual send, due date, reply/queue/attempt guards | f2362–2597; [Today f2490](../out/qa/independent/v7/full-size/f2490.jpg), [passed guards f2595](../out/qa/independent/v7/full-size/f2595.jpg) |
| Eligibility, follow-up generation and manual preservation | [20 ready/40 skipped f2805](../out/qa/independent/v7/full-size/f2805.jpg), [copied body f2955](../out/qa/independent/v7/full-size/f2955.jpg), [native generation f3000](../out/qa/independent/v7/full-size/f3000.jpg), [19 managed/1 manual f3060](../out/qa/independent/v7/full-size/f3060.jpg) |

- **F2 ✓** Each scene advances the workflow. Import totals, contact duplicate decisions, batch volume and chosen-message inspection have different meanings. The repeated mail objects preserve identity across those meanings. The finale reprises feature objects as a brand grouping rather than repeating another functional explanation.
- **F3 ✓** Page states carry the claims. The notes pause shows native Needs Review then Ignore for Now; selected message 30 is an actual native body; the calendar is the captured native assignment matrix. The authored file objects, envelopes, gates and mosaic function as explanatory projections. They should not be interpreted as literal additional native controls.

## V — Visual direction

- **V1 ✓** Open Sans editorial type, native screenshots, blue action accents, green results, restrained amber uncertainty, white paper and cool dark desks are coherent. Representative full-size checks: f334, f1005, f1355 and f3180 above.
- **V2 ✓** The motion has distinct roles: mechanical scanning, a physical version lift, accelerating deal, purposeful tabletop dive, spring migrations and a final group assembly. These do not collapse into a uniform slide/scroll treatment.
- **V3 ✓** No unrelated neon, warm Ink Press skin or integration-hub imagery appears. The exact references have been reskinned to SmartMail while retaining their motion grammar.
- **V4 ✓** The film is English throughout the inspected timeline. No fixed subtitle strip or prohibited alternate style appears. The small fictional/offline badge is the design's documented 22px exception.

## S — Exact cards and variants

- **S1 ✓** All twelve active mappings are identifiable. The following unchanged local clips were independently decoded and compared; their exact TSX hashes match the selection/provenance records. All twelve active Gallery records match the local index.

| Film use | Exact style and reference contact | Encoded-film evidence |
|---|---|---|
| Opening | [spotlight-hero-card](../out/qa/independent/v7/reference-contacts/SpotlightHeroCard.jpg) | f0–177, [opening arc](../out/qa/independent/v7/film-contacts/hero-01.jpg) |
| Import | [scanline-annotate-focus](../out/qa/independent/v7/reference-contacts/scanline-annotate-focus.jpg) | [scan arc](../out/qa/independent/v7/film-contacts/intake-03.jpg) |
| Duplicate choice | [contact-shadow-lift](../out/qa/independent/v7/reference-contacts/contact-shadow-lift.jpg) | [f503–630](../out/qa/independent/v7/film-contacts/duplicates-01.jpg) |
| Batch | [deck-deal-flyin](../out/qa/independent/v7/reference-contacts/DeckDealFlyin.jpg) | [f680–810](../out/qa/independent/v7/film-contacts/batch-01.jpg) |
| Preview | [overhead-tabletop-drop](../out/qa/independent/v7/reference-contacts/overhead-tabletop-drop.jpg) | [selection/dive](../out/qa/independent/v7/film-contacts/review-02.jpg) |
| Files | [bezier-source-converge-merge](../out/qa/independent/v7/reference-contacts/bezier-source-converge-merge.jpg) | [convergence](../out/qa/independent/v7/film-contacts/files-01.jpg) |
| Scheduling | [unit-dot-swarm-regroup](../out/qa/independent/v7/reference-contacts/unit-dot-swarm-regroup.jpg), exact `UnitDotSwarmRegroupV2` | [three migrations](../out/qa/independent/v7/schedule-comparison.jpg) |
| Proposal | [card-flip-reveal](../out/qa/independent/v7/reference-contacts/card-flip-reveal.jpg) | [copy/flip](../out/qa/independent/v7/film-contacts/revision-01.jpg) |
| Follow-up dates | [timeline-travel](../out/qa/independent/v7/reference-contacts/timeline-travel.jpg) | [date travel](../out/qa/independent/v7/film-contacts/eligibility-01.jpg) |
| Contact decisions | [mosaic-reframe](../out/qa/independent/v7/reference-contacts/MosaicReframe.jpg) | [reframe/fan](../out/qa/independent/v7/film-contacts/eligibility-03.jpg) |
| Compose | [panel-to-canvas](../out/qa/independent/v7/reference-contacts/panel-to-canvas.jpg) | [copy-buffer migration](../out/qa/independent/v7/film-contacts/compose-01.jpg) |
| Finale | [outro-group-photo-launch](../out/qa/independent/v7/reference-contacts/OutroGroupPhotoLaunch.jpg) | [assembly/brand](../out/qa/independent/v7/film-contacts/outro-01.jpg) |

- **S2 ✓** The chosen variants agree across index, card, exact source and local clip. In particular, review uses the tabletop selection/drop variant, and schedule uses the V2 unit swarm, not the other overhead/chart variants. `scroll-brake-moves` and `before-after-slider-scrub` are historical only.
- **S3 ✓** The three new-scene contracts are retained. Import uses a uniform 75-frame scan, bbox-lower-edge triggers and delayed bracket arms/type; native evidence is present before naming. Review preserves the locked 62° pan, eight-frame choice beat, 16px lift, simultaneous angle/scale/translation dive, overshoot and local-f94 settle ([f951](../out/qa/independent/v7/full-size/f0951.jpg)). Scheduling preserves persistent object identity, three 24-frame spring migrations, damping 13/stiffness 150/mass 0.8, deterministic stagger and velocity stretch; the result is native geometry rather than invented calendar targets.
- **S4 ✓** No critical card pitfall was found: no angled pan drift, competing camera holder, first-frame path jump, premature path erasure, visible back-face leak, simultaneously lifted duplicate candidates, or width/height reframe replaced by overall scale. The retained flip has anticipation/overshoot; the deal has substantial preparation and accelerating cues; copied compose rows become explicit source ghosts before landing.
- **S5 ✓** Adaptations preserve meaning. Real source crops replace generic analysis targets; actual messages replace generic web pages; institution/date/native-slot geometry replaces chart groups/bars/numerals. Requirements enter a requested-file receiver, and compose rows are explicitly a COPY buffer, so adaptation does not imply deleting the original mail.
- **S6 ✓ / ?** No custom-only or preview-less selected style is being presented as a verified Gallery match. The available comparison is the unchanged local original render. Hosted Gallery playback remains unverified because the recorded hosted access was unavailable; no hosted-playback claim is made.

## B — Storyboard and holds

- **B1 ✓** The encoded film follows all thirteen recorded ranges, including intake f178–502, review f857–1033 and schedule f1211–1387. The complete timeline is 3247 frames.
- **B2 ✓** Actions, native states, copy and sound anchors correspond. Notable new anchors are the native manual choice at f422, selected-message landing at f951 and native calendar settle at f1351. The attachment-linking scene follows requested-file inspection, avoiding a before/after claim reversal.
- **B3 ✓** Brand sign-off has comfortably more than one second after completion. Batch full-board and mosaic results breathe. The native calendar is settled from f1351 through f1387, **37 encoded frames inclusive**, meeting the 36-frame target. [f1355](../out/qa/independent/v7/full-size/f1355.jpg) and [ending schedule contact](../out/qa/independent/v7/film-contacts/schedule-04.jpg). This means settled graphic geometry, not byte-identical H.264 frames.
- **B4 ✓** No unexplained deletion or substitution of a key feature was found. The three revised scenes fit the recorded redesign, while the retained workflow remains complete.

## D — Data and native assets

- **D1 ✓** The film consistently represents a frozen fictional campaign and offline transport. Addresses are reserved `example.invalid` values, with Student 001 and fictional contacts.
- **D2 ✓** No customer/private mailbox, token, password or internal address was found in the inspected frames or frozen data used for the visible claims. This is evidence-based inspection, not a general security audit of the repository.
- **D3 ✓** Existing product UI is represented by native captures. The high-resolution native message, native notes choice, actual linked-file result and full native calendar are identifiable. Authored mail/file objects and data diagrams explain the workflow without replacing the native proof states.
- **D4 ✓** No unloaded font, broken image or blank native calendar slot was found. The sixty native destinations all join by task key; source/native assignment tuples match; every captured slot has actual painted detail. The selected message source is 3352×2180 pixels and is downsampled for the final view.
- **D5 ✓** Independent data cross-checks confirm 60 contacts, 211 links, 11 institutions, 15 dates, 09:00 weekday assignments, max one mail per institution/date, at least seven days between same-institution sends, 20 due/40 skipped, and 19 managed updates/one manually edited preservation. Product truth is supplied as fictional frozen data, not claimed as public customer data. [Truth record](../out/qa/independent/v7/truth-verification.json).

## A — Audio and rhythm

- **A1 △ / ?** The sources and declared direction use an electronic music bed with physical paper/switch/sweep/impact/light sounds. Independent decoded peaks are **−6.564 dBFS** with music and **−8.803 dBFS** for SFX only, with zero decoded samples at full scale. Subjective musical fit and in-mix balance were not auditioned.
- **A2 ✓ (objective)** All 72 declared source WAV cues were independently cross-correlated against the decoded SFX-only export. Maximum measured start residual is **0.0125 frame**. Declared short-term source-energy landmarks are within **0.395 frame** of action targets. The visible new action anchors above correspond to the relevant cues. This does not establish perceptual audibility.
- **A3 ✓ (reported measurement)** Current encoded-export verification measures all twelve scene cuts against decoded music-band attacks. Maximum error is **0.478 frame**, within three frames. The producer's method and report hash are retained in the independent audio record; those music attacks were not independently re-estimated in this review.
- **A4 ✓ (structure) / ? (perception)** Riser, identity impact and light accent are declared around the finale assembly/stamp/rule. The visible group-photo arc is present. Perceived musical climax and the sound sentence itself require real-time audition.
- **A5 ✓** Every cue has an explicit frame duration. No selected source sample exceeds five seconds; long-source bleed is therefore not implicated by this source set.
- **A6 ?** Every declared cue is objectively present/aligned in the decoded SFX-only export. Whether each remains distinctly audible under BGM to human hearing is unverified. Numeric correlation and headroom cannot substitute for listening.
- **A7 ✓ (source provenance) / ? (perception)** The UI sources are physical light-switch/click samples rather than the listed synthetic confirmation/notification tones. Perceived timbre was not auditioned.
- **A8 ✓** Both delivery variants exist; independent decoded picture hashes match for all 3247 frames. They use the same declared SFX timeline, with only the music bed differing. Separate AAC encodes are not claimed to have bit-identical decoded SFX samples.
- **A9 ✓ (objective)** Source-energy landmark lag is kept separate from output offset. The current pipeline records zero systematic output offset; independent cue correlation finds no systematic frame-scale delay. The current export report and independent measurements are identified by hash. [Audio evidence and limits](../out/qa/independent/v7/audio-verification.json).

## Q — Visual/technical quality and aesthetic checklist

- **Q1 ✓** Real captured UI and frozen fictional data satisfy the screenshot/data rule. The authored explanatory objects have clear identities; native result states anchor their claims.
- **Q2 ✓** No material blocky 3D-texture enlargement was found in the selected-message or hero full-size checks. Native review text is sharp after the dive; the source is more than twice the final displayed width. [f1005](../out/qa/independent/v7/full-size/f1005.jpg).
- **Q3 ✓ (sampled motion)** Camera travel is controlled; no unintended handheld jitter or repeated whole-picture beat pumping was observed in the reviewed arcs. Continuous real-time motion perception was not available.
- **Q4 ✓** The opening's single contour treatment is restrained. No batch glint spam or obvious light/mask leakage at rounded card corners was found. Flip side-light remains angle-linked rather than a detached sweep.
- **Q5 ✓** The opening has one focal KPI/card and a complete lock/push/lift/reseat arc, rather than several competing protagonists. [Opening contact](../out/qa/independent/v7/film-contacts/hero-01.jpg).
- **Q6 ✓** Dense information lands frontally. Tabletop perspective establishes selection; the page then becomes frontal before it is inspected. The calendar is frontal. The deal's tilted board is a volume shot, with separate large editorial copy.
- **Q7 ✓** The batch close-up retains visible stack height, side angle, orbit and the dark brushed desk, followed by the pull-out to the board. [Batch arc](../out/qa/independent/v7/film-contacts/batch-01.jpg).
- **Q8 ✓ (visual structure)** The ending gathers nine native workflow representatives from multiple directions around the wordmark, with crane/stage-light/particle treatment and a generous brand rest. [f3180](../out/qa/independent/v7/full-size/f3180.jpg). The perceived audio-energy peak remains unverified under A4.
- **Q9 ✓** Dealt mail lands in board slots. Schedule particles land in measured native task slots, joined by key. No unexplained permanent floating endpoint was found. Explanatory copy-buffer objects deliberately land inside the follow-up body.
- **Q10 ✓** The selected letter has genuine native density, recipient/subject/body and sign-off; it is not a sparse invented document. The later native generated preview provides the actual result. [f1005](../out/qa/independent/v7/full-size/f1005.jpg), [f3000](../out/qa/independent/v7/full-size/f3000.jpg).
- **Q11 △** Main chapter/claim copy and the requested-file annotation have strong size and contrast. Format/package labels, institutional labels and date rules use the auxiliary tier; native calendar cells and tabletop fine print remain contextual texture. The selected native body is approximately 32.3px before its small slow push, as explicitly recorded, and is readable at 1080p. It is a targeted inspection hold, not enough time to proofread the whole letter. The 22px scope badge remains the documented small-type exception. Small-window viewers should follow the large hierarchy rather than all native fine print. See suggestions below.
- **Q12 ✓** No unexplained blank transition, clipped primary headline, source ghost persisting in a final native state, or obvious rounded-mask seam was found in the sampled timeline/cut boundaries. The dark last frame is the intentional outro fade.
- **Q13 ✓ (source/engineering evidence)** No render-time `Math.random()` or `Date.now()` was found in the production source search. Independent rehashing found **zero mismatches in all 229 frozen src/public inputs**. The current detached-install report records its own `npm ci`, both type checks and **23 pixel-identical production-composition PNGs**. Workbench import/edit/undo/JSON/native eight-frame export passed. Workbench parity is **tolerance parity**, not exact equality: f857/f907/f927 each have one pixel above channel tolerance 2, with maximum channel deltas 7/7/6; all 23 comparisons pass the 0.001 difference-ratio bound. [Current engineering checks](../out/qa/independent/v7/current-engineering-checks.json). The reviewer did not rerun Chrome/Remotion jobs.

Every remaining aesthetic rule was considered:

| Rule | Finding |
|---|---|
| R1 | ✓ Brand rest exceeds one second; important results have holds. The small slow pushes are intentional, not camera noise. |
| R2 | ✓ Deal hard-accelerates with physical preparation; batch results rest. The intake's constant scan is the card's deliberate machine-reader exception, not an eased flight. |
| R3 | ✓ Opening action arc exceeds three seconds. The manual notes choice is enlarged and held; preview lands before inspection. Full-letter proofreading is outside the short hold. |
| R4 | ✓ No repeated whole-frame beat pump; deliberate large camera moves serve their scenes. No excess slam/flash treatment found. |
| Audio S1 | △/? Source vocabulary checked; subjective fit/timbre unverified, A1/A7. |
| Audio S2 | ✓ Declarative cue table and action anchors; batch accents do not declare sixty identical per-card sounds. Objective timing checked, A2. |
| Audio S3 | ✓ V7 cues align to V7 action anchors in actual outputs, not an earlier timeline. |
| Audio S4 | ✓/? Physical action sources have bounded windows; in-mix audibility requires audition, A5/A6. |
| Audio S5 | ✓ Output residual and source landmark lag are separated and measured, A9. |
| C1 | ✓ Scene headings/native evidence/page annotations explain the action; no fixed subtitle strip. Brand outro stays clean. |
| C2 | ✓ Copy names concrete actions and results: import, inspect, match, schedule, save, replace and follow up. |
| C3 | ✓ Object annotations follow the scene/page space where appropriate. The temporary review heading is the documented editorial exception and clears during the dive. Product Open Sans replaces the reference's unrelated serif styling. |
| Process P1 | ✓ Actual encoded frames were inspected before delivery; this report supplies independent evidence. |
| Process P2 | ✓ Exact cards, TSX and local original clips were compared per scene, including explicit rejected alternatives in the recorded design. |
| Process P3 | N/A to this review: no ambiguous production change was requested or implemented by the reviewer. |
| Process P4 | ✓ Required features map to distinct scenes; the principal card grammar is not reused as an unrelated second set-piece. |

## Must-fix, suggestions and unverifiable items

**Must-fix:** none identified within the verified product/visual/encoded-signal scope.

**Suggestions:**

1. For a longer instructional edit, extend the frontal message hold beyond f951–1033 (about 2.77s). The current film communicates what is inspected and makes the four requested files visible; it does not allow full-letter proofreading. [f1005](../out/qa/independent/v7/full-size/f1005.jpg).
2. The eleven institution names are a brief overview. If a later edit needs every name read, give that group state more time or enlarge the selected cohort label. The current RMIT color/identity path and final six-draft label are clear, while the native matrix's tiny body text is contextual. [f1259](../out/qa/independent/v7/full-size/f1259.jpg), [f1355](../out/qa/independent/v7/full-size/f1355.jpg).

**Unverifiable:** subjective music/SFX fit, masking, perceived timbre and fatigue during real-time listening; continuous real-time motion perception; hosted Gallery playback; live external mail delivery, which the film explicitly replaces with the offline fixture. The workbench and detached-render operations were assessed from the current recorded results/hashes, not rerun by this reviewer. The final ZIP had not yet been built when this report was frozen, so final ZIP completeness is a subsequent packaging check.

**Frozen review:** this report is complete for the two SHA-256-identified delivery files and the recorded current V7 engineering evidence. Packaging must follow this freeze. Any later production/media change requires a new review revision; this frozen report must not silently change.
