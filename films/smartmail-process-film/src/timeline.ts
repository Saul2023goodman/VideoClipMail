import BEATS from './beat-data.json';
export const FPS=30;
export const beatF=(n:number)=>Math.round((BEATS.t0+n*BEATS.T)*FPS);
export const TOTAL=beatF(220);
export const SHOTS=[
 {id:'intro',label:'A supervision campaign',b0:0,b1:8},
 {id:'classify',label:'Read evidence, then route sources',b0:8,b1:52},
 {id:'dedupe',label:'Three distinct identity checks',b0:52,b1:88},
 {id:'overview',label:'Browse every mail, top to bottom',b0:88,b1:104},
 {id:'files',label:'Resolve each file requirement',b0:104,b1:128},
 {id:'schedule',label:'Try dates, reject conflicts, embed the plan',b0:128,b1:184},
 {id:'execute',label:'Freeze, hand off, verify and save',b0:184,b1:212},
 {id:'outro',label:'SmartMail Ops',b0:212,b1:220},
].map(s=>({...s,from:s.b0===0?0:beatF(s.b0),to:beatF(s.b1),duration:beatF(s.b1)-(s.b0===0?0:beatF(s.b0))}));
export const TOKENS={bg:'#f4f6f8',surface:'#ffffff',ink:'#182230',muted:'#667085',accent:'#1769e0',scan:'#2b4fd8',line:'#dfe5ec',green:'#17836b',amber:'#a96a17'};
export const CARRY={id:'ready-to-schedule',from:beatF(128),duration:beatF(140)-beatF(128),primaryText:'Set the send window',secondaryText:'Institution limits, local time'};
export const SCENE_PROPS:Record<string,{primaryText:string;secondaryText:string}>= {
 intro:{primaryText:'60 supervision enquiries',secondaryText:'Student 001 · 11 universities'},
 classify:{primaryText:'Mail sources',secondaryText:'Fields + mail discourse'},
 dedupe:{primaryText:'Keep the complete version',secondaryText:'Same name + institution → confirm'},
 overview:{primaryText:'Every mail in one batch',secondaryText:'01 → 60'},
 files:{primaryText:'211 requirements matched',secondaryText:'Resolve the reference, then apply its scope'},
 schedule:{primaryText:'60 scheduled · 15 send dates',secondaryText:'Institution limits, local time'},
 execute:{primaryText:'60 draft saves confirmed',secondaryText:'Verify attachments before confirming the save'},
 outro:{primaryText:'SmartMail Ops',secondaryText:'60 enquiries. Prepared as one batch.'},
};
// Optional sidecar captions; these are never burned into a fixed strip.
export const CAPTIONS=[
 [0,8,'Student 001 prepares 60 supervision enquiries for 11 universities.'],
 [8,14,'SHA-256 merges identical source files before parsing.'],
 [14,26,'Recipient, subject, salutation and body evidence identify mail sources.'],
 [26,34,'Repeated name, email and institution columns identify the reference roster.'],
 [34,42,'PDF files enter the attachment pool directly. Uncertain content needs review.'],
 [42,52,'The operator ignores the notes and completes classification.'],
 [52,64,'Recipient addresses normalize to the same email key. Select the complete version.'],
 [64,78,'A same-name, same-institution match needs a separate contact decision.'],
 [78,88,'Check reference identities and existing sent-mail and draft history.'],
 [88,104,'Scroll from the first prepared mail to the last, across all 60.'],
 [104,114,'Try the exact file path, then a unique basename.'],
 [114,128,'Match mail hints: four PDFs fulfil 211 per-mail attachment requirements.'],
 [128,140,'Choose Australia/Sydney, 09:00, weekdays, one per institution per day and a seven-day gap.'],
 [140,146,'The first RMIT enquiry takes Friday 23 October.'],
 [146,162,'The second tries each date. Reject capacity, weekend and interval conflicts.'],
 [162,168,'Friday 30 October passes. A different institution may share the same minute.'],
 [168,174,'Australian holiday dates are skipped in the remaining plan.'],
 [174,184,'Sixty assignments settle into the real schedule matrix, across 15 dates.'],
 [184,196,'Freeze the selected tasks and pass their content, files and schedule through Chrome runtime.'],
 [196,206,'Open compose, fill fields, verify attachments and confirm each draft save.'],
 [206,212,'The offline provider reports 60 saved drafts and 211 verified attachment uploads.'],
 [212,220,'SmartMail Ops. Sixty enquiries, prepared as one batch.'],
].map(([a,b,text],i)=>({id:'sidecar-'+i,from:Number(a)===0?0:beatF(Number(a)),duration:beatF(Number(b))-(Number(a)===0?0:beatF(Number(a))),text:String(text)}));
