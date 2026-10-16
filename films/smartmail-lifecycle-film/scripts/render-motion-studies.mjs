// Motion slices use the production composition, not separate approximate scene code.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {bundle} from '@remotion/bundler';
import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));
process.env.TMPDIR='/workspace/.v5tmp';fs.mkdirSync(process.env.TMPDIR,{recursive:true});
const version=process.argv.includes('--v7')?'v7':'v6';
const requested=process.argv.slice(2).filter(x=>x!=='--v7'),names=requested.length?requested:['intake','duplicates','files','execution','revision','history','eligibility','compose'];
const shots=JSON.parse(fs.readFileSync(path.join(root,'analysis/timeline.json'))).SHOTS.filter(s=>names.includes(s.id));
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.bundle-motion-studies')});
const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/chromium'});
const inputProps={bgm:false,silentPicture:true};
try{
 const composition=await selectComposition({serveUrl,id:'SmartMailLifecycle',inputProps,puppeteerInstance:browser});
 for(const s of shots){
  await renderMedia({serveUrl,composition,inputProps,puppeteerInstance:browser,outputLocation:path.join(root,'out',version+'-'+s.id+'-study.mp4'),codec:'h264',crf:20,scale:.5,muted:true,concurrency:2,frameRange:[s.from,s.from+s.duration-1],timeoutInMilliseconds:120000});
  console.log('Rendered motion study',s.id,s.duration);
 }
}finally{await browser.close({silent:true});}
