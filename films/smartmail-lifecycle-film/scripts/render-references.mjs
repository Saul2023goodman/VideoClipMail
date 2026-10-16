// Render the exact original demos when the hosted Gallery cannot be fetched.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
const ROOT=fileURLToPath(new URL('..',import.meta.url));
const SKILL=process.env.SHOTCRAFT_ROOT||'/workspace/video-shotcraft';
process.env.TMPDIR='/workspace/.v5tmp';fs.mkdirSync(process.env.TMPDIR,{recursive:true});
const examples=process.argv.includes('--v8')?[
 ['LineCarryTransition','transition/line-carry-transition/LineCarryTransition.tsx',190],
 ['ExplodedView','camera/space-camera-moves/ExplodedView.tsx',170],
 ['RowEmbed','ui-entrance/row-embed/RowEmbed.tsx',68],
]:process.argv.includes('--v7')?[
 ['OverheadTabletopDrop','camera/overhead-camera-moves/OverheadTabletopDrop.tsx',140],
 ['UnitDotSwarmRegroupV2','data/chart-live-moves/UnitDotSwarmRegroupV2.tsx',192],
]:process.argv.includes('--v6')?[
 ['ScanlineAnnotateFocus','effects/scanline-annotate-focus/ScanlineAnnotateFocus.tsx',150],
 ['ContactShadowLift','ui-entrance/element-body-moves/ContactShadowLift.tsx',150],
 ['BezierSourceConvergeMerge','ui-entrance/bezier-source-converge-merge/BezierSourceConvergeMerge.tsx',168],
 ['CardFlipReveal','transition/card-flip-reveal/CardFlipReveal.tsx',150],
 ['TimelineTravel','data/timeline-travel/TimelineTravel.tsx',160],
 ['PanelToCanvasMaterialize','interaction/canvas-materialize-moves/PanelToCanvasMaterialize.tsx',150],
]:[
 ['SpotlightHeroCard','opening/spotlight-hero-card/SpotlightHeroCard.tsx',172],
 ['DeckDealFlyin','ui-entrance/deck-deal-flyin/DeckDealFlyin.tsx',150],
 ['MosaicReframe','transition/mosaic-reframe/MosaicReframe.tsx',214],
 ['BeforeAfterSliderScrub','data/before-after-slider-scrub/BeforeAfterSliderScrub.tsx',150],
 ['OutroGroupPhotoLaunch','outro/outro-group-photo-launch/OutroGroupPhotoLaunch.tsx',145],
];
const entry=path.join(ROOT,'.reference-entry.tsx');
fs.writeFileSync(entry,`import React from 'react';import {registerRoot,Composition} from 'remotion';\n`+
 examples.map(([name,file])=>`import {${name}} from ${JSON.stringify(path.join(SKILL,'demos',file))};`).join('\n')+
 `\nregisterRoot(()=> <>${examples.map(([name,,n])=>`<Composition id="${name}" component={${name}} durationInFrames={${n}} fps={30} width={1920} height={1080}/>`).join('')}</>);`);
const assets=path.join(ROOT,'.reference-public');fs.mkdirSync(assets,{recursive:true});
fs.cpSync(path.join(SKILL,'demos/_textures'),path.join(assets,'textures/live'),{recursive:true,dereference:true,force:true});
const serveUrl=await bundle({entryPoint:entry,publicDir:assets,outDir:path.join(ROOT,'.bundle-references')});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
try{for(const [id,,duration]of examples){
 const composition=await selectComposition({serveUrl,id,puppeteerInstance:browser});
 const outputLocation=path.join(ROOT,'references/gallery',id+'.mp4');
 await renderMedia({serveUrl,composition,puppeteerInstance:browser,outputLocation,codec:'h264',crf:20,scale:.5,muted:true,concurrency:2,timeoutInMilliseconds:120000});
 console.log('Rendered exact reference',id,duration);
}}finally{await browser.close({silent:true});}
