import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const folder=path.join(root,'public/render-frames');
fs.mkdirSync(folder,{recursive:true});
const source=['campaign-native.mp4','maintenance-native.mp4'].map(n=>path.join(root,'public/native',n));
const fingerprint=source.map(p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex')).join(':');
const marker=path.join(folder,'source.json');
if(fs.existsSync(marker)&&JSON.parse(fs.readFileSync(marker,'utf8')).fingerprint===fingerprint&&fs.existsSync(path.join(folder,'f2519.jpg'))){console.log('Native render frame cache is current.');process.exit(0);}
const extract=(p,start)=>{
 const r=spawnSync('ffmpeg',['-y','-v','error','-threads','2','-i',p,'-q:v','1','-threads','2','-start_number',String(start),path.join(folder,'f%04d.jpg')],{stdio:'inherit'});
 if(r.status!==0)process.exit(r.status??1);
};
extract(source[0],0);extract(source[1],1530);
const frames=fs.readdirSync(folder).filter(n=>/^f\d{4}\.jpg$/.test(n));
if(frames.length!==2520)throw new Error(`Expected 2520 native frames, got ${frames.length}`);
fs.writeFileSync(marker,JSON.stringify({fingerprint,frames:frames.length,derived:true,shipped:false},null,2));
console.log('Prepared 2520 native render frames from the two local captures.');
