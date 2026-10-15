// Mux already-rendered picture and the two audio passes; verify both outputs.
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const run=(c,a)=>{const r=spawnSync(c,a,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);};
const picture='out/smartmail-lifecycle-picture.mp4',duration=String(JSON.parse(fs.readFileSync('analysis/timeline.json','utf8')).TOTAL/30);
if(!fs.existsSync(picture))throw new Error('Render the complete picture first');
for(const v of ['music','sfx'])run('ffmpeg',['-y','-v','error','-i',picture,'-i',`out/smartmail-lifecycle-${v}.wav`,'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-t',duration,'-movflags','+faststart',`out/smartmail-lifecycle-${v==='music'?'with-music':'sfx-only'}.mp4`]);
run('python3',['scripts/verify-export.py']);run('python3',['scripts/final-contact.py']);
