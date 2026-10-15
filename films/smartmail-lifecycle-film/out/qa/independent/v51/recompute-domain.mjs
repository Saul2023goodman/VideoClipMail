import fs from 'node:fs';
const root=process.cwd(), app='/workspace/VideoClipMail';
// Match the native capture browser timezone; scheduleAt is a local datetime string.
process.env.TZ='Australia/Sydney';
const evidence=JSON.parse(fs.readFileSync(root+'/analysis/lifecycle-evidence.json'));
const box=JSON.parse(fs.readFileSync(root+'/analysis/mailbox-fixture.json'));
const NativeDate=Date, now=box.now;
globalThis.Date=class extends NativeDate {constructor(...args){super(...(args.length?args:[now]));}static now(){return new NativeDate(now).getTime();}};
await import(app+'/operations.js');await import(app+'/scheduler.js');
const O=globalThis.NMDAOperations,S=globalThis.NMDAScheduler;
let store=O.createStore(box.account);store=O.setFollowUpPolicy(store,'',evidence.policy).store;
store=O.ingestMailboxSnapshot(store,box.sent.messages,box.drafts.messages,box.inbox.messages,{now,historyMonths:0}).store;
for(const r of Object.values(store.outboundRecords)){const m=box.sent.messages.find(m=>m.id===r.providerMessageId);if(m)store=O.setOutboundContentSnapshot(store,r.id,{body:m.body,source:'frozen-mailbox-detail'}).store;}
const groups=O.monitoringRoots(store);const counts={},decisions=[],differences=[];
for(const wanted of evidence.decisions){const g=groups.find(g=>(g.lastOutbound?.recipients||[]).some(r=>r.email===wanted.email));const actual=O.evaluateFollowUpEligibility(store,g.rootTaskId,{now});
 counts[actual.reason]=(counts[actual.reason]||0)+1;const row={email:wanted.email,eligible:actual.eligible,reason:actual.reason,sequence:actual.sequence,completedFollowUps:actual.completedFollowUps,lastSentAt:actual.lastOutbound?.sentAt||g.lastOutbound?.sentAt,dueAt:actual.dueAt||''};decisions.push(row);for(const k of ['eligible','reason','sequence','completedFollowUps','lastSentAt','dueAt'])if(row[k]!==wanted[k])differences.push({email:row.email,key:k,expected:wanted[k],actual:row[k]});}
const generated=O.createFollowUpTasks(store,groups.map(g=>g.rootTaskId),{now});
const d=generated.created.find(d=>d.recipients.some(r=>r.email==='supervisor001@example.invalid'));
const edited=O.updateDerivedTaskContent(generated.store,d.id,{body:d.body+'\n\nI will be in Melbourne in March.'});
const newPolicy=O.setFollowUpPolicy(edited.store,'',{templateBody:evidence.policy.templateBody+' I can also share the updated portfolio.'});
const refreshed=O.refreshTemplateManagedFollowUps(newPolicy.store);
const plan=JSON.parse(fs.readFileSync(root+'/analysis/scheduler-plan.json'));
const freshPlan=S.buildPlan(plan.assignments.map(a=>({...a.task,scheduleAt:''})),plan.rules,new NativeDate('2026-10-14T12:00:06Z'));
const aMap=new Map(plan.assignments.map(a=>[a.task.id,a.scheduleAt]));
const scheduleDifferences=freshPlan.assignments.filter(a=>aMap.get(a.task.id)!==a.scheduleAt).map(a=>({id:a.task.id,expected:aMap.get(a.task.id),actual:a.scheduleAt}));
const obs=Object.values(store.replyObservations).map(o=>({email:o.sender,kind:o.kind,rule:o.evidence?.rule,heuristic:o.evidence?.heuristic,association:o.evidence?.association,replyDelaySeconds:o.evidence?.replyDelaySeconds}));
const report={runtimeTimezone:process.env.TZ,method:'Independent direct calls to unchanged operations.js and scheduler.js; reconstructed from frozen mailbox, without running production proof script.',now,contacts:groups.length,sent:box.sent.messages.length,incoming:box.inbox.messages.length,scheduled:box.drafts.messages.length,counts,decisionDifferences:differences,generated:generated.created.length,skipped:generated.skipped.length,generatedExample:{sequence:d.sequence,body:d.body,personalization:d.personalization,composeMode:d.composeMode,reviewDecision:d.reviewDecision,state:d.state,dispatch:d.dispatch},templateRefreshCount:refreshed.refreshed.length,manualBodyPreserved:refreshed.store.derivedTasks[d.id].body===edited.store.derivedTasks[d.id].body,replyObservations:obs,schedule:{assignments:freshPlan.assignments.length,dates:new Set(freshPlan.assignments.map(a=>a.scheduleAt.slice(0,10))).size,differences:scheduleDifferences},decisions};
fs.writeFileSync(root+'/out/qa/independent/v51/domain-recompute.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({...report,decisions:undefined,replyObservations:obs.filter(x=>['supervisor011@example.invalid','supervisor017@example.invalid','supervisor021@example.invalid','supervisor057@example.invalid'].includes(x.email))},null,2));
