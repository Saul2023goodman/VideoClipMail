// Run the unchanged product's domain code against a reproducible later mailbox.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const ROOT=fileURLToPath(new URL('..',import.meta.url));
const APP=path.resolve(ROOT,'../..');
const NOW='2027-02-15T09:00:00+11:00';
const NativeDate=Date;
globalThis.Date=class extends NativeDate{
 constructor(...args){super(...(args.length?args:[NOW]));}
 static now(){return new NativeDate(NOW).getTime();}
};
await import(path.join(APP,'operations.js'));
const O=globalThis.NMDAOperations;
const data=JSON.parse(fs.readFileSync(path.join(ROOT,'src/demo-data.json')));
const plan=JSON.parse(fs.readFileSync(path.join(ROOT,'analysis/scheduler-plan.json')));
const times=new Map(plan.assignments.map(a=>[a.task.recipients,a.scheduleAt+'+11:00']));
const template='I wanted to follow up on my doctoral supervision enquiry. Would you be open to a short conversation about research fit for the 2027 intake?';
const sent=data.map(d=>({id:'sent-'+d.id,recipients:[{name:d.name,email:d.email}],subject:d.subject,body:d.body,sentAt:times.get(d.email)}));
const extra=(i,stamp,seq,subject)=>sent.push({id:`history-${data[i].id}-${seq}`,recipients:[{name:data[i].name,email:data[i].email}],subject:subject||'Re: '+data[i].subject,body:data[i].body,sentAt:stamp});
// A manually sent second message with a changed subject still belongs to this contact.
extra(0,'2027-02-06T09:00:00+11:00',1,'Updated portfolio and doctoral enquiry');
for(let i=30;i<42;i++)extra(i,'2027-02-12T09:00:00+11:00',1);
for(let i=50;i<56;i++){extra(i,'2027-02-01T09:00:00+11:00',1);extra(i,'2027-02-08T09:00:00+11:00',2);}
const inbox=[];
for(let i=10;i<20;i++){
 const d=data[i],base=sent.find(s=>s.id==='sent-'+d.id),instant=i>=16;
 inbox.push({id:'inbound-'+d.id,sender:{name:d.name,email:d.email},subject:instant?'Re: '+d.subject:'Out of office: '+d.subject,
  receivedAt:new NativeDate(new NativeDate(base.sentAt).getTime()+(instant?90000:7200000)).toISOString(),
  inReplyTo:base.id,references:base.id,flags:instant?{}:{autoReply:true},
  preview:instant?'Thank you for your email.':'I am currently out of the office with limited access to email.'});
}
for(let i=20;i<30;i++){
 const d=data[i],base=sent.find(s=>s.id==='sent-'+d.id);
 inbox.push({id:'inbound-'+d.id,sender:{name:d.name,email:d.email},subject:'Re: '+d.subject,
  receivedAt:new NativeDate(new NativeDate(base.sentAt).getTime()+3*86400000).toISOString(),inReplyTo:base.id,references:base.id,
  preview:'Your proposal connects with my research. Please send an outline and arrange a meeting.'});
}
for(let i=56;i<60;i++)inbox.push({id:'inbound-'+data[i].id,sender:{name:data[i].name,email:data[i].email},
 subject:'Workshop logistics',receivedAt:'2027-02-11T12:00:00+11:00',preview:'Could you confirm the workshop room?'});
const drafts=data.slice(42,50).map(d=>({id:'scheduled-'+d.id,recipients:[{name:d.name,email:d.email}],subject:'Fwd: '+d.subject,
 scheduledDraft:true,scheduleAt:'2027-02-17T09:00:00+11:00',savedAt:'2027-02-14T09:00:00+11:00'}));
const box=messages=>({messages,total:messages.length,pages:1,complete:true});
const mailbox={now:NOW,account:'student001@example.invalid',sent:box(sent),drafts:box(drafts),inbox:box(inbox),historyMonths:0};
let store=O.createStore(mailbox.account);
store=O.setFollowUpPolicy(store,'',{delayDays:7,maxAttempts:2,composeMode:'forward',templateBody:template}).store;
const ingested=O.ingestMailboxSnapshot(store,sent,drafts,inbox,{now:NOW,historyMonths:0});store=ingested.store;
for(const r of Object.values(store.outboundRecords)){
 const mail=sent.find(m=>m.id===r.providerMessageId);
 if(mail)store=O.setOutboundContentSnapshot(store,r.id,{body:mail.body,source:'frozen-mailbox-detail'}).store;
}
const groups=O.monitoringRoots(store),byEmail=new Map(groups.map(g=>[(g.lastOutbound?.recipients||[]).map(r=>r.email).sort().join(';'),g]));
const decisions=data.map((d,i)=>{const g=byEmail.get(d.email);if(!g)throw new Error('Missing monitor contact '+d.email);
 const e=O.evaluateFollowUpEligibility(store,g.rootTaskId,{now:NOW});
 return {index:i,id:d.id,name:d.name,email:d.email,institution:d.institution,rootTaskId:g.rootTaskId,
  eligible:e.eligible,reason:e.reason,sequence:e.sequence,completedFollowUps:e.completedFollowUps,dueAt:e.dueAt||'',
  lastSentAt:e.lastOutbound?.sentAt||g.lastOutbound?.sentAt,scheduledAt:e.scheduledDraft?.scheduleAt||'',
  observations:g.replies||[],outbounds:g.outbounds,policy:e.policy};});
const counts={};for(const d of decisions)counts[d.reason]=(counts[d.reason]||0)+1;
if(JSON.stringify(counts)!==JSON.stringify({due:20,'human-managed-conversation':10,waiting:12,'scheduled-follow-up-exists':8,'max-attempts-reached':6,'ambiguous-reply':4}))throw new Error(JSON.stringify(counts));
const created=O.createFollowUpTasks(store,decisions.map(d=>d.rootTaskId),{now:NOW});
if(created.created.length!==20||created.skipped.length!==40)throw new Error('Wrong follow-up partition');
const manual=O.updateDerivedTaskContent(created.store,created.created[0].id,{body:created.created[0].body+'\n\nI will be in Melbourne in March.'});
const changed=O.setFollowUpPolicy(manual.store,'',{templateBody:template+' I can also share the updated portfolio.'});
const refreshed=O.refreshTemplateManagedFollowUps(changed.store);
if(refreshed.refreshed.length!==19||!refreshed.skipped.some(s=>s.reason==='manually-edited'))throw new Error('Template ownership check failed');
const report={frozenNow:NOW,counts,contactCount:60,sentRecordCount:sent.length,inboundCount:inbox.length,scheduledDraftCount:drafts.length,
 policy:{delayDays:7,maxAttempts:2,composeMode:'forward',templateBody:template},decisions,
 generated:{created:created.created,skipped:created.skipped},templateRefresh:{updated:refreshed.refreshed,skipped:refreshed.skipped},
 source:'Unchanged operations.js; actual public functions; offline example.invalid mailbox fixture'};
for(const [file,value]of[['analysis/mailbox-fixture.json',mailbox],['analysis/lifecycle-evidence.json',report],['src/lifecycle-data.json',report]])fs.writeFileSync(path.join(ROOT,file),JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify({contacts:60,counts,sent:sent.length,generated:created.created.length,templateUpdated:refreshed.refreshed.length}));
