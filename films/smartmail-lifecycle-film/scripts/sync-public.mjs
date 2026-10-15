// Node-based asset sync for an execution image without the rsync binary.
import fs from 'node:fs';
import path from 'node:path';
const source=path.resolve(process.argv[2]),target=path.resolve(process.argv[3]);
if(source===target||!target.includes('.render-public'))throw new Error('Invalid render-cache destination');
fs.mkdirSync(target,{recursive:true});
for(const name of fs.readdirSync(target))if(!fs.existsSync(path.join(source,name))||name==='cardpreviews')fs.rmSync(path.join(target,name),{recursive:true,force:true});
for(const name of fs.readdirSync(source))if(name!=='cardpreviews'){
 fs.rmSync(path.join(target,name),{recursive:true,force:true});
 fs.cpSync(path.join(source,name),path.join(target,name),{recursive:true,dereference:true,force:true});
}
