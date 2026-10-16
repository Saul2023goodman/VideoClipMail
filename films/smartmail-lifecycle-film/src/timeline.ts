import BEATS from './beat-data.json';
export const FPS=30,beatF=(n:number)=>Math.round((BEATS.t0+n*BEATS.T)*FPS),TOTAL=beatF(220);
export const SHOTS=[
 {id:'hero',b0:0,b1:12,label:'Import to follow-up'},
 {id:'intake',b0:12,b1:34,label:'Sort imported files by content'},
 {id:'duplicates',b0:34,b1:46,label:'Two distinct contact decisions'},
 {id:'batch',b0:46,b1:58,label:'60 emails. Ready for review.'},
 {id:'review',b0:58,b1:70,label:'Review the complete batch'},
 {id:'files',b0:70,b1:82,label:'Resolve each file requirement'},
 {id:'schedule',b0:82,b1:94,label:'Schedule 60 drafts'},
 {id:'execution',b0:94,b1:108,label:'Check files and save 60 drafts'},
 {id:'revision',b0:108,b1:128,label:'Revise attachments without losing the mail'},
 {id:'history',b0:128,b1:160,label:'Bind mailbox history and read reply evidence'},
 {id:'eligibility',b0:160,b1:192,label:'Derive the eligible contact batch'},
 {id:'compose',b0:192,b1:208,label:'Personalize, review and prepare'},
 {id:'outro',b0:208,b1:220,label:'SmartMail Ops'},
].map(s=>({...s,from:s.b0===0?0:beatF(s.b0),duration:beatF(s.b1)-(s.b0===0?0:beatF(s.b0))}));
export const DEFAULTS:Record<string,{primaryText:string;secondaryText:string}>={
 hero:{primaryText:'60 enquiries.',secondaryText:'Import to\nfollow-up.'},
 intake:{primaryText:'Import mixed files together.',secondaryText:'Mail · contacts · attachments'},
 duplicates:{primaryText:'Choose which version to keep.',secondaryText:'The operator decides what stays.'},
 batch:{primaryText:'60 emails.',secondaryText:'Ready for review.'},
 review:{primaryText:'Check recipient, message and files.',secondaryText:'Check recipients, text and files.'},
 files:{primaryText:'Match the requested files.',secondaryText:'211 file links · 60 emails'},
 schedule:{primaryText:'Schedule the whole batch.',secondaryText:'Australia/Sydney · 09:00'},
 execution:{primaryText:'Save 60 drafts.',secondaryText:'60 drafts saved · 211 file links'},
 revision:{primaryText:'Replace the proposal safely.',secondaryText:'Check unchanged fields, then replace.'},
 history:{primaryText:'One history per recipient.',secondaryText:'85 sent · 8 scheduled · 24 incoming'},
 eligibility:{primaryText:'20 contacts need a follow-up.',secondaryText:'40 stay monitored.'},
 compose:{primaryText:'Build 20 follow-ups.',secondaryText:'20 follow-ups ready for review'},
 outro:{primaryText:'SmartMail Ops',secondaryText:'Import. Review. Schedule. Follow up.'},
};
export const COLORS={bg:'#f4f6f8',ink:'#182230',muted:'#667085',blue:'#1769e0',edge:'#9bc4ff',green:'#17836b',amber:'#a96a17',night:'#081422'};
// Exact demo timing retimed at the major musical anchors; the locked-to-land arc is longer than the reference.
export const heroFrame=(f:number)=>{
 const a=[0,beatF(2),beatF(4),beatF(5),beatF(6.5),beatF(8.5),beatF(10)-1,beatF(12)],v=[0,34,56,68,88,124,142,172];
 if(f<=0)return 0;if(f>=a[7])return 172;
 const i=a.findIndex((x,k)=>k<7&&f>=x&&f<a[k+1]);return v[i]+(v[i+1]-v[i])*(f-a[i])/(a[i+1]-a[i]);
};
export const SIDECAR=SHOTS.map(s=>({from:s.from,duration:s.duration,text:DEFAULTS[s.id].primaryText.replace(/\n/g,' ')+' '+DEFAULTS[s.id].secondaryText.replace(/\n/g,' ')}));
