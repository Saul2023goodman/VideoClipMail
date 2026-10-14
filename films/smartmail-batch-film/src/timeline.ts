import BEATS from './beat-data.json';
export const FPS=30;
export const SOURCE_BEAT0=BEATS.t0;
export const BEAT_INT=BEATS.T;
export const OUTPUT_AUDIO_OFFSET_SEC=0;
export const beatT=(n:number)=>SOURCE_BEAT0+OUTPUT_AUDIO_OFFSET_SEC+n*BEAT_INT;
export const beatF=(n:number)=>Math.round(beatT(n)*FPS);
export const TOTAL=beatF(220);
export const SHOTS=[
 {id:'input',label:'One student, sixty enquiries',b0:0,b1:16},
 {id:'classify',label:'Classify the sources',b0:16,b1:32},
 {id:'schema',label:'Normalize task fields',b0:32,b1:48},
 {id:'match',label:'Reconcile roster identities',b0:48,b1:64},
 {id:'review',label:'Review across the batch',b0:64,b1:80},
 {id:'files',label:'Resolve 211 file requirements',b0:80,b1:96},
 {id:'schedule',label:'Schedule by institution',b0:96,b1:128},
 {id:'execute',label:'Run the frozen queue',b0:128,b1:152},
 {id:'replace',label:'Safely replace 59 proposals',b0:152,b1:180},
 {id:'monitor',label:'Reply-aware follow-up decisions',b0:180,b1:208},
 {id:'outro',label:'SmartMail Ops',b0:208,b1:220},
].map(s=>({...s,from:s.b0===0?0:beatF(s.b0),to:beatF(s.b1),duration:beatF(s.b1)-(s.b0===0?0:beatF(s.b0))}));
export const CAPTIONS=[
 [0,8,'One student. 60 supervision enquiries.'],
 [8,16,'Prepared mail, a roster and four PDFs.'],
 [16,24,'Classify mail, roster and attachment sources.'],
 [24,32,'Inspect the detected role before continuing.'],
 [32,40,'Different formats. One normalized task schema.'],
 [40,48,'Keep recipient, subject, body and file requirements linked.'],
 [48,56,'Cross-check each recipient against the reference roster.'],
 [56,64,'Different people at one university stay separate.'],
 [64,72,'Review the batch. Open any mail in place.'],
 [72,80,'Keep subjects and bodies specific to the research direction.'],
 [80,88,"Resolve filenames against each mail's requirements."],
 [88,96,'Four source files fulfil 211 attachment requirements.'],
 [96,104,"Set the recipient's local send time."],
 [104,112,'Limit each institution to one enquiry per day.'],
 [112,120,'Keep at least seven days between colleagues.'],
 [120,128,'60 enquiries resolve into 15 send dates.'],
 [128,136,'Freeze the 60 selected tasks before execution.'],
 [136,144,'Pass content and file references through Chrome runtime.'],
 [144,152,'Verify attachments. Confirm each draft save.'],
 [152,160,'A revised proposal affects 59 scheduled drafts.'],
 [160,168,'Read. Clone. Replace. Verify. Then swap.'],
 [168,176,'Preserve recipients, body, subject and scheduled time.'],
 [176,180,'59 replacements verified. Clean up the source draft.'],
 [180,188,'Later, sync sent-mail and inbox history.'],
 [188,196,'Eight human replies move to manual handling.'],
 [196,204,'52 contacts remain eligible for follow-up.'],
 [204,208,'Select only contacts whose next step is due.'],
].map(([a,b,text],i)=>({id:'caption-'+i,from:Number(a)===0?0:beatF(Number(a)),duration:beatF(Number(b))-(Number(a)===0?0:beatF(Number(a))),text:String(text)}));
export const TOKENS={bg:'#f4f6f8',surface:'#ffffff',ink:'#182230',muted:'#667085',accent:'#1769e0',line:'#dfe5ec',green:'#17836b',amber:'#a96a17'};
