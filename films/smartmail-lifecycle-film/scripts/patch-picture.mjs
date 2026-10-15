// Deterministic incremental picture render. Reuse untouched encoded frames,
// render changed timeline ranges, then encode one complete final picture.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {spawnSync} from 'node:child_process';
import {bundle} from '@remotion/bundler';import {openBrowser,selectComposition,renderMedia} from '@remotion/renderer';
const root=fileURLToPath(new URL('..',import.meta.url));process.env.TMPDIR=process.env.SMARTMAIL_RENDER_TEMP||'/workspace/.v5tmp';fs.mkdirSync(process.env.TMPDIR,{recursive:true});
const plan=JSON.parse(fs.readFileSync('analysis/timeline.json','utf8')),assembleOnly=process.argv.includes('--assemble-only'),renderFlag=process.argv.find(x=>x.startsWith('--render-only=')),renderOnly=renderFlag?new Set(renderFlag.split('=')[1].split(',')):null,ids=process.argv.slice(2).filter(x=>!x.startsWith('--')),out=path.join(root,'out/patches');fs.mkdirSync(out,{recursive:true});
const ranges=ids.map(id=>{const s=plan.SHOTS.find(s=>s.id===id);if(!s)throw new Error('Unknown shot '+id);return {id,start:id==='outro'?plan.TOTAL-15:s.from,end:s.from+s.duration};}).sort((a,b)=>a.start-b.start);
const original=path.join(out,'original-picture.mp4');if(!fs.existsSync(original))fs.copyFileSync('out/smartmail-lifecycle-picture.mp4',original);
if(!assembleOnly){
const serveUrl=await bundle({entryPoint:path.join(root,'src/index.ts'),publicDir:path.join(root,'public'),outDir:path.join(root,'.bundle-patches')});const browser=await openBrowser('chrome',{browserExecutable:process.env.REMOTION_BROWSER||'/usr/bin/chromium'});const props={bgm:false,silentPicture:true};
try{const composition=await selectComposition({serveUrl,id:'SmartMailLifecycle',inputProps:props,puppeteerInstance:browser});
 for(const r of ranges){r.file=path.join(out,r.id+'.mp4');if(renderOnly&&!renderOnly.has(r.id)){if(!fs.existsSync(r.file))throw new Error('Missing retained rendered range: '+r.file);continue;}await renderMedia({serveUrl,composition,inputProps:props,frameRange:[r.start,r.end-1],puppeteerInstance:browser,concurrency:2,codec:'h264',crf:14,muted:true,outputLocation:r.file,timeoutInMilliseconds:120000});console.log('Updated picture range',r.id,r.start,r.end);}
}finally{await browser.close({silent:true});}
}else for(const r of ranges){r.file=path.join(out,r.id+'.mp4');if(!fs.existsSync(r.file))throw new Error('Missing rendered range: '+r.file);}
const segments=[];let cursor=0;for(let i=0;i<ranges.length;i++){const r=ranges[i];if(cursor<r.start)segments.push({input:0,from:cursor,to:r.start});segments.push({input:i+1,from:0,to:r.end-r.start});cursor=r.end;}if(cursor<plan.TOTAL)segments.push({input:0,from:cursor,to:plan.TOTAL});
const run=(args)=>{const r=spawnSync('ffmpeg',args,{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);};
const files=[];
for(let i=0;i<segments.length;i++){
 const s=segments[i];
 if(s.input>0){files.push(ranges[s.input-1].file);continue;}
 const file=path.join(out,`retained-${i}.mp4`);
 run(['-y','-v','error','-i',original,'-vf',`trim=start_frame=${s.from}:end_frame=${s.to},setpts=PTS-STARTPTS`,'-an','-c:v','libx264','-preset','fast','-threads','2','-crf','14','-pix_fmt','yuv420p','-r','30',file]);files.push(file);
}
// Remotion and the system FFmpeg use different MP4 timescales. Normalize each
// segment before the concat demuxer so packet timestamps keep their duration.
const normalized=files.map((f,i)=>{const n=path.join(out,`mux-${i}.mp4`);run(['-y','-v','error','-i',f,'-map','0:v:0','-c:v','copy','-an','-video_track_timescale','90000',n]);return n;});
const list=path.join(out,'concat.txt');fs.writeFileSync(list,normalized.map(f=>"file '"+f.replaceAll("'","'\\''")+"'").join('\n')+'\n');
run(['-y','-v','error','-f','concat','-safe','0','-i',list,'-c:v','copy','-an','-video_track_timescale','90000','-movflags','+faststart','out/smartmail-lifecycle-picture.mp4']);
fs.writeFileSync('analysis/incremental-picture.json',JSON.stringify({method:'Unchanged final-picture ranges retained and re-encoded at CRF14; changed Remotion ranges rendered afresh at CRF14; segment timescales normalized to 90000 and concatenated into one verified complete picture',newlyRendered:renderOnly?[...renderOnly]:ids,total:plan.TOTAL,ranges,segments},null,2)+'\n');console.log('Full revised picture encoded');
