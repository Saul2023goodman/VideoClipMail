import path from 'node:path';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderStill,renderMedia} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url)),mode=process.argv[2]||'stills';
const renderTemp=process.env.SMARTMAIL_RENDER_TEMP;
if(renderTemp){fs.mkdirSync(renderTemp,{recursive:true});process.env.TMPDIR=path.resolve(renderTemp);}
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.bundle-'+mode)});
const browserExecutable=process.env.REMOTION_BROWSER||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined);
const browser=await openBrowser('chrome',{browserExecutable});
try{
 const audioOnly=['music-audio','sfx'].includes(mode),inputProps={bgm:mode!=='sfx',audioOnly,silentPicture:['picture','stills','smoke'].includes(mode)};
 const composition=await selectComposition({serveUrl,id:'SmartMailProcess',inputProps,puppeteerInstance:browser,timeoutInMilliseconds:120000});
 const common={serveUrl,composition,inputProps,puppeteerInstance:browser,concurrency:2,timeoutInMilliseconds:120000};
 if(mode==='stills'){
  const supplied=process.argv.slice(3).map(Number),timeline=JSON.parse(fs.readFileSync(path.join(root,'analysis/timeline.json'),'utf8'));
  const frames=supplied.length?supplied:timeline.SHOTS.flatMap(s=>[s.from+Math.round(s.duration*.3),s.from+Math.round(s.duration*.75)]);
  for(const frame of frames){await renderStill({...common,frame,output:path.join(root,`out/qa/f${String(frame).padStart(4,'0')}.png`),imageFormat:'png'});console.log('Still '+frame);}
 }else{
  const outputLocation=path.join(root,'out',audioOnly?(mode==='sfx'?'smartmail-process-sfx.wav':'smartmail-process-music.wav'):mode==='smoke'?'portable-smoke.mp4':'smartmail-process-picture.mp4');
  let last=-1;
  await renderMedia({...common,frameRange:mode==='smoke'?[1280,1460]:undefined,codec:audioOnly?'wav':'h264',outputLocation,crf:audioOnly?undefined:17,muted:!audioOnly,sampleRate:48000,audioCodec:audioOnly?'pcm-16':'aac',onProgress:({progress,renderedFrames})=>{const p=Math.floor(progress*20)*5;if(p>last){last=p;console.log(`Render ${p}% · ${renderedFrames} frames`);}}});
  console.log(outputLocation);
 }
}finally{await browser.close({silent:true});}
