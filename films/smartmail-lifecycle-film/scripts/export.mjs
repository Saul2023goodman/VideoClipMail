import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const run=(c,a)=>{const r=spawnSync(c,a,{stdio:'inherit'});if(r.status!==0)process.exit(r.status??1);};
run(process.execPath,['scripts/metadata.mjs']);
for(const mode of ['picture','music-audio','sfx'])run(process.execPath,['scripts/render.mjs',mode]);
run(process.execPath,['scripts/finalize.mjs']);
