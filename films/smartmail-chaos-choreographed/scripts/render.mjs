import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));
const mode=process.argv[2]||'stills';
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.bundle-'+mode)});
const browserExecutable=process.env.REMOTION_BROWSER||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
const chromiumOptions={}; // This film uses CSS 2.5D, so Chrome's native compositor is sufficient.
const browser=await openBrowser('chrome',{browserExecutable,chromeMode:'chrome-for-testing',chromiumOptions});
try {
 const bgm=mode!=='sfx';
 const audioOnly=['sfx','music-audio'].includes(mode);
 const inputProps={bgm,audioOnly,silentPicture:mode==='picture'};
 const composition=await selectComposition({serveUrl,id:'SmartMailOps',inputProps,puppeteerInstance:browser,timeoutInMilliseconds:120000});
 const common={serveUrl,composition,inputProps,puppeteerInstance:browser,chromiumOptions,concurrency:2,timeoutInMilliseconds:120000};
 if(mode==='stills'){
  const frames=process.argv.slice(3).map(Number);
  const defaults=[90,230,360,510,643,712,830,930,1020,1110,1260,1380,1550];
  for(const frame of frames.length?frames:defaults){
   await renderStill({...common,frame,output:path.join(root,`out/qa/f${String(frame).padStart(4,'0')}.png`),imageFormat:'png'});
   console.log(`Still ${frame}`);
  }
 }else {
  const outputLocation=path.join(root,'out',audioOnly?(mode==='sfx'?'smartmail-ops-sfx-only.wav':'smartmail-ops-with-music.wav'):'smartmail-picture.mp4');
  let last=-1;
  await renderMedia({...common,codec:audioOnly?'wav':'h264',outputLocation,crf:audioOnly?undefined:18,muted:!audioOnly,sampleRate:48000,audioCodec:audioOnly?'pcm-16':'aac',onProgress:({progress,renderedFrames})=>{const p=Math.floor(progress*100/5)*5;if(p>last){last=p;console.log(`Render ${p}% / ${renderedFrames} frames`);}}});
  console.log(outputLocation);
 }
}finally {await browser.close({silent:true});}
