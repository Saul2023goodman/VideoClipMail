import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const run=(c,a)=>{const r=spawnSync(c,a,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);};
run(process.execPath,['scripts/metadata.mjs']);
for(const mode of ['picture','music-audio','sfx'])run(process.execPath,['scripts/render.mjs',mode]);
const duration=String(JSON.parse(fs.readFileSync('analysis/timeline.json','utf8')).TOTAL/30);
for(const v of ['music','sfx'])run('ffmpeg',['-y','-v','error','-i','out/smartmail-process-picture.mp4','-i',`out/smartmail-process-${v}.wav`,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t',duration,'-movflags','+faststart',`out/smartmail-process-${v==='music'?'with-music':'sfx-only'}.mp4`]);
