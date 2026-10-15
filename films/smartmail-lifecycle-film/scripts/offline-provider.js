/* Offline boundary fixture. Native application modules run without changes.
 * Unknown transport operations fail; all prepared addresses are example.invalid.
 */
(() => {
 const DATA = __DATA__;
 const MAILBOX=__MAILBOX__;
 const key='__smartmail_batch_film_storage__',read=()=>JSON.parse(localStorage.getItem(key)||'{}');
 const listeners=new Set(),wait=ms=>new Promise(r=>setTimeout(r,ms));
 const account='student001@example.invalid';
 window.__requests=[];window.__phases=[];window.__saved=[];window.__filmFrame=0;window.__later=false;
 const empty={messages:[],complete:true,total:0,pages:1};
 const drafts=DATA.filter(d=>d.attachments.some(n=>n.includes('Research_Proposal'))).map((d,i)=>({
  id:'demo-proposal-'+i,ok:true,subject:d.subject,recipients:d.email,
  bodyHtml:'<p>Dear '+d.name+',</p><p>My CV, portfolio and research proposal are attached.</p><p>Kind regards,<br>Student 001</p>',
  cc:'',bcc:'',scheduleAt:'2026-10-22T09:00:00+11:00',scheduledDraft:true,
  attachments:d.attachments.map((name,j)=>({id:'file-'+i+'-'+j,kind:'attachment',name,size:3000}))
 }));
 window.chrome={...window.chrome,runtime:{getURL:p=>new URL(p,location.origin).href,
  onMessage:{addListener:f=>listeners.add(f),removeListener:f=>listeners.delete(f)},
  connect:o=>{if(o.name!=='NMDA_RUNTIME_FILE_SOURCE')throw new Error('Unsupported offline port');return{onMessage:{addListener(){}},onDisconnect:{addListener(){}},postMessage(){},disconnect(){}};}},
 storage:{local:{get:async ks=>{const d=read();if(ks==null)return d;return Object.fromEntries((typeof ks==='string'?[ks]:Array.isArray(ks)?ks:Object.keys(ks)).filter(k=>k in d).map(k=>[k,d[k]]));},
  set:async v=>localStorage.setItem(key,JSON.stringify({...read(),...v})),remove:async ks=>{const d=read();for(const k of typeof ks==='string'?[ks]:ks)delete d[k];localStorage.setItem(key,JSON.stringify(d));}}}};
 const broadcast=m=>{window.__phases.push({...m,frame:window.__filmFrame});listeners.forEach(f=>f(m));};
 chrome.runtime.sendMessage=async m=>{
  window.__requests.push({type:m.type,frame:window.__filmFrame});
  if(m.type==='NMDA_CONNECTION_STATUS')return{connected:true,authenticated:true,account,tabId:1};
  if(m.type==='NMDA_ACCOUNT_INFO')return{ok:true,account};
  if(m.type==='NMDA_OPEN_MAIL')return{ok:true,tabId:1};
  if(m.type==='NMDA_BATCH_MONITOR')return{ok:true};
  if(['NMDA_READ_MAILBOX_STATE','NMDA_READ_DEDUPE_HISTORY'].includes(m.type)){
   return window.__later?{ok:true,complete:true,...MAILBOX}:{ok:true,complete:true,account,sent:empty,drafts:empty,inbox:empty,historyMonths:0};
  }
  if(m.type==='NMDA_READ_SENT_DETAILS')return{ok:true,details:m.messageIds.map(id=>{const d=MAILBOX.sent.messages.find(v=>v.id===id);return{id,ok:!!d,body:d?.body||'',bodySource:'offline-frozen-sent-detail'};})};
  if(m.type==='NMDA_READ_SCHEDULED_DRAFTS')return{ok:true,drafts:window.__later?MAILBOX.drafts.messages:[],scheduled:window.__later?MAILBOX.drafts.messages:[],complete:true};
  if(m.type==='NMDA_EXECUTE_DRAFT'){
   const d=DATA.find(d=>d.email===m.task.recipients);
   if(!d||!m.task.body||m.task.subject!==d.subject||!m.task.scheduleAt)throw new Error('Offline input validation failed');
   const names=m.task.attachments.map(f=>f.name).sort();
   if(JSON.stringify(names)!==JSON.stringify([...d.attachments].sort()))throw new Error('Attachment scope differs for '+d.id);
   for(const [phase,message] of [['open','Opening new compose'],['fill','Applying recipient, subject and body'],['attachment','Verifying uploaded attachments'],['save','Confirming draft save']]){
    broadcast({type:'NMDA_EXECUTION_PROGRESS_BROADCAST',executionId:m.executionId,phase,message});await wait(20);
   }
   const out={draftId:'offline-draft-'+d.id,providerMessageId:'offline-draft-'+d.id,
    saved:true,saveOutcome:{id:'offline-draft-'+d.id,ok:true},attachment:{verified:true,uploaded:names.length},cleanup:{ok:true}};
   window.__saved.push({id:d.id,scheduleAt:m.task.scheduleAt,attachments:names,frame:window.__filmFrame});return{ok:true,outcome:out};
  }
  if(m.type==='NMDA_SCAN_DRAFT_ATTACHMENTS'){for(const d of drafts){const base=DATA.find(t=>t.subject===d.subject&&t.email===d.recipients);d.scheduleAt=window.__saved.find(v=>v.id===base?.id)?.scheduleAt||d.scheduleAt;d.bodyHtml='<p>'+base.body.replace(/&/g,'&amp;').replace(/</g,'&lt;').split(/\n\n/).join('</p><p>').replace(/\n/g,'<br>')+'</p>';}window.__maintenanceBefore=JSON.parse(JSON.stringify(drafts));return{ok:true,complete:true,drafts:JSON.parse(JSON.stringify(drafts))};}
  if(m.type==='NMDA_DRAFT_ATTACHMENT_MONITOR')return{ok:true};
  if(m.type==='NMDA_DRAFT_ATTACHMENT_SEED'){await wait(100);return{ok:true,source:{id:'demo-proposal-v2',name:'Student_001_Research_Proposal_v2.pdf'},seedDraftId:'demo-seed'};}
  if(m.type==='NMDA_DRAFT_ATTACHMENT_SEED_CLEANUP')return{ok:true,verified:true};
  if(m.type==='NMDA_DRAFT_ATTACHMENT_MUTATE'){
   for(const phase of ['read','clone','attachments','verify','swap']){
    broadcast({type:'NMDA_DRAFT_ATTACHMENT_PROGRESS_BROADCAST',executionId:m.executionId,phase,current:m.current,total:m.total,subject:m.summary.subject,
     message:({read:'Reading original content and time',clone:'Creating replacement draft',attachments:'Replacing the proposal',verify:'Verifying recipients, body, subject and time',swap:'Verified; completing replacement'})[phase]});await wait(20);
   }
   const d=drafts.find(d=>d.id===m.draftId);if(!d)throw new Error('Missing original draft');
   const before={subject:d.subject,recipients:d.recipients,bodyHtml:d.bodyHtml,scheduleAt:d.scheduleAt};
   d.attachments=d.attachments.map(a=>a.name.includes('Research_Proposal')?{...a,name:m.source.name,size:m.source.size,id:'new-'+a.id}:a);
   if(JSON.stringify(before)!==JSON.stringify({subject:d.subject,recipients:d.recipients,bodyHtml:d.bodyHtml,scheduleAt:d.scheduleAt}))throw new Error('Fixture content changed');
   window.__maintenanceAfter=JSON.parse(JSON.stringify(drafts));return{ok:true,verified:true,draftId:d.id};
  }
  throw new Error('Unsupported external operation in offline demo: '+m.type);
 };
})();
