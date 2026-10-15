import React from 'react';
import {AbsoluteFill,Html5Video,Img,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {EASE,mix,ramp,velocity} from './lib/Polish';
import {TextReveal} from './lib/Look';
import {Capture,Label,Mark,Surface} from './ui';
import {COLORS as C,SHOTS,beatF} from './timeline';
import DATA from './demo-data.json';
import LIFE from './lifecycle-data.json';
import NATIVE from './native-layout.json';
import {DecisionMosaic} from './DecisionMosaic';
export type ProcessProps={kind?:string;duration?:number;primaryText?:string;secondaryText?:string;accent?:string};
type V={f:number;duration:number;b:(n:number)=>number;primaryText:string;secondaryText:string;accent:string};
const Check:React.FC<{color?:string;size?:number}>=({color=C.green,size=32})=><svg width={size} height={size} viewBox="0 0 30 30"><path d="m5 15 7 7L26 5" fill="none" stroke={color} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round"/></svg>;
const Path:React.FC<{d:string;p:number;color?:string;w?:number;opacity?:number}>=({d,p,color=C.blue,w=3,opacity=1})=><svg width={1920} height={1080} style={{position:'absolute',inset:0,pointerEvents:'none',opacity}}><path d={d} stroke={color} strokeWidth={w} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-Math.min(1,Math.max(0,p))} strokeLinecap="round"/></svg>;
const Paper:React.FC<{x:number;y:number;w:number;h:number;children?:React.ReactNode;style?:React.CSSProperties}>=({x,y,w,h,children,style})=><div style={{position:'absolute',left:x,top:y,width:w,height:h,background:'#fff',border:'1px solid #dfe5ec',borderRadius:12,boxShadow:'0 26px 70px #0814221c',...style}}>{children}</div>;
const Cursor:React.FC<{x:number;y:number;press?:number}>=({x,y,press=0})=><svg width={38} height={44} viewBox="0 0 24 28" style={{position:'absolute',left:x,top:y,transform:`scale(${1-.14*press})`,filter:'drop-shadow(0 3px 3px #08142244)'}}><path d="M2 2v21l5-5 5 9 4-2-5-9h8Z" fill="#182230" stroke="white" strokeWidth={1.6}/></svg>;
const ShortDate=(s:string)=>s?new Intl.DateTimeFormat('en-GB',{day:'2-digit',month:'short',timeZone:'Australia/Sydney'}).format(new Date(s)):'';

const Intake:React.FC<V>=({f,b,primaryText,accent})=>{
 const first=b(3),phase=f<b(11)?0:f<b(16)?1:2,start=[first,b(11),b(16)][phase],p=ramp(f,start,26,EASE.swift);
 const cases=[
  {src:'01-mail-detail.png',head:'Mail structure.',facts:['Recipient + subject','Salutation + request','Closing boundary'],result:'61 mail candidates',tone:C.blue},
  {src:'01-roster-detail.png',head:'Repeated identities.',facts:['Name · email · institution','Repeated contact rows','No subject / body columns'],result:'60 reference entries',tone:C.green},
  {src:'02-notes.png',head:'Insufficient evidence.',facts:['No verified mail structure','No identity table','Choose the purpose manually'],result:'Notes → Unused',tone:C.amber},
 ];const c=cases[phase];
 return <Surface>
  {f<first?<>
   <div style={{position:'absolute',left:140,top:345,transform:`translateY(${mix(25,0,ramp(f,0,24))}px)`}}><Label size={82} color={C.blue}>68 source files.</Label><Label y={112} size={44} weight={400}>One renamed file has identical bytes.</Label></div>
   <Paper x={1080} y={270} w={630} h={360}><Label x={34} y={34} size={38}>Jordan Quinn.docx</Label><Label x={34} y={112} size={38} color={C.muted} weight={400}>Jordan_export_copy.docx</Label><Label x={34} y={224} size={46} color={C.blue} style={{fontFamily:'monospace'}}>36183d85b2d9c2f1…</Label></Paper>
   <Path d="M1080 570H970V750H1520" p={ramp(f,8,24)}/><Label x={1030} y={790} size={52} color={C.green} opacity={ramp(f,22,12)}>Same SHA-256 → parse once</Label>
  </>:<>
   <div style={{position:'absolute',left:0,top:mix(65,0,p),opacity:p}}>
    <Capture name={c.src} x={1025} y={80} w={770} h={920} crop={{x:1524,y:245,w:365,h:436}}/>
   </div>
   <div style={{position:'absolute',left:115,top:155,opacity:p,transform:`translateX(${mix(-30,0,p)}px)`}}><Label size={72} w={840}>{c.head}</Label><Label y={105} size={40} color={C.muted} weight={400}>{phase===0?primaryText:'The content determines the route.'}</Label></div>
   {c.facts.map((t,i)=>{const n=ramp(f,start+8+i*9,20,EASE.swift);return <div key={t} style={{position:'absolute',left:120,top:390+i*105,opacity:n,transform:`translateY(${mix(20,0,n)}px)`,display:'flex',alignItems:'center',gap:24}}><div style={{width:6,height:52,background:c.tone,borderRadius:3}}/><div style={{fontSize:40,fontWeight:700}}>{t}</div></div>})}
   <Path d="M600 705H890V320H1015" p={ramp(f,start+15,30)} color={c.tone}/>
   <div style={{position:'absolute',left:118,top:790,borderLeft:`5px solid ${c.tone}`,padding:'18px 24px',background:'#fff',boxShadow:'0 18px 50px #08142218',opacity:ramp(f,start+30,18)}}><div style={{fontSize:56,fontWeight:700,color:c.tone}}>{c.result}</div><div style={{fontSize:34,marginTop:14,color:C.muted}}>{phase===2?'Uncertain sources stay out of automatic routing.':'PDF assets remain in the attachment pool.'}</div></div>
  </>}
 </Surface>;
};

const Duplicates:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const probable=f>=b(6),q=probable?f-b(6):f,p=ramp(q,9,28,EASE.swift),decide=ramp(q,48,20);
 return <Surface>
  <div style={{position:'absolute',inset:0,opacity:.22,filter:'blur(4px)'}}><Img src={staticFile('native/04-dedupe.png')} style={{width:1920,height:1080}}/></div>
  <Label x={122} y={118} size={76}>{probable?'Same name. Different addresses.':primaryText}</Label>
  <Paper x={120} y={290} w={1680} h={340}>
   <Label x={44} y={38} size={42} color={C.muted}>{probable?'Avery Lane · RMIT University':'Jordan Quinn · version comparison'}</Label>
   {['left','right'].map((side,i)=><div key={side} style={{position:'absolute',left:mix(i?910:44,probable?(i?910:44):i?910:44,p),top:130,opacity:probable?1:i?1-ramp(q,42,12):1}}><div style={{fontSize:probable?40:38,fontWeight:700,color:C.blue,fontFamily:'monospace'}}>{probable?`supervisor00${i+1}@example.invalid`:i&&q<30?'SUPERVISOR007@EXAMPLE.INVALID':'supervisor007@example.invalid'}</div><div style={{fontSize:38,marginTop:28}}>{probable?'Distinct address':i?'Shorter body':'Complete body + required files'}</div></div>)}
   {!probable?<div style={{position:'absolute',left:40,top:286,height:3,width:1540*ramp(q,14,28),background:C.blue}}/>:null}
  </Paper>
  <div style={{position:'absolute',left:mix(250,120,p),top:mix(990,660,p),opacity:p}}><Capture name={probable?'04-dedupe.png':'05-dedupe-1.png'} x={0} y={0} w={1680} h={362} crop={{x:51,y:611,w:1808,h:390}}/></div>
  <div style={{position:'absolute',left:probable?1090:940,top:598,opacity:decide,background:probable?'#e9f2ff':'#e3f3eb',color:probable?C.blue:C.green,padding:'14px 24px',borderRadius:8,fontSize:46,fontWeight:700,boxShadow:'0 12px 35px #08142214'}}>{probable?'Keep both contacts':'Keep the complete version'}</div>
  <Label x={145} y={990} size={36} color={C.muted} weight={400} opacity={ramp(q,45,15)}>{probable?secondaryText:'Lowercase email keys match. The operator chooses the version.'}</Label>
 </Surface>;
};

const Review:React.FC<V>=({f,primaryText,secondaryText})=>{
 const positions=NATIVE.reviewScroll.positions;
 const positionAt=(t:number)=>{const q=Math.max(0,Math.min(positions.length-1,t)),lo=Math.floor(q),hi=Math.min(positions.length-1,lo+1);return mix(positions[lo],positions[hi],q-lo);};
 const v=velocity(positionAt,f),blur=Math.min(23,Math.abs(v)*.04);
 return <Surface dark>
  <div style={{position:'absolute',left:0,top:0,width:1920,height:1080,overflow:'hidden',boxShadow:'0 0 90px #0008'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{width:1920,height:1080,objectFit:'cover'}}/>{blur>.7?<div style={{position:'absolute',left:0,top:120,width:1920,height:930,overflow:'hidden'}}><Html5Video src={staticFile('native/overview-scroll.mp4')} muted style={{position:'absolute',left:0,top:-120,width:1920,height:1080,objectFit:'cover',filter:`blur(0px) url(#review-blur)`}}/></div>:null}</div>
  <svg width={0} height={0}><filter id="review-blur" x="0" y="-10%" width="100%" height="120%"><feGaussianBlur stdDeviation={`0 ${blur.toFixed(2)}`}/></filter></svg>
  {f>139?<div style={{position:'absolute',left:24,top:650,width:480,padding:'20px 24px',background:'#fff',borderLeft:`5px solid ${C.blue}`,boxShadow:'0 18px 60px #08142222',opacity:ramp(f,140,12)}}><div style={{fontSize:56,fontWeight:700,lineHeight:1.15}}>{primaryText}</div><div style={{fontSize:36,color:C.muted,marginTop:12}}>{secondaryText}</div></div>:null}
 </Surface>;
};

const Files:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const resolved=ramp(f,b(3),34,EASE.swift),scope=ramp(f,b(6),30,EASE.swift);
 return <Surface>
  <div style={{position:'absolute',left:0,top:0,opacity:.28,filter:'blur(3px)'}}><Img src={staticFile('native/09-attachments-linked.png')} style={{width:1920,height:1080}}/></div>
  <Paper x={115} y={155} w={1690} h={248}><Label x={36} y={30} size={40} color={C.muted}>TASK-001 · requested file</Label><Label x={36} y={108} size={52} color={C.blue}><span style={{opacity:1-resolved*.8}}>attachments/common/</span>Student_001_CV.pdf</Label></Paper>
  <div style={{position:'absolute',left:140,top:460,opacity:1-scope}}><Label size={44} color={C.muted}>No exact path entry.</Label><Label y={80} size={62} color={C.green} opacity={resolved}>Unique basename resolves the asset.</Label></div>
  <div style={{position:'absolute',left:mix(1800,870,resolved),top:443,opacity:resolved*(1-scope),background:'#fff',border:`2px solid ${C.green}`,borderRadius:9,padding:'26px 35px',boxShadow:'0 16px 45px #08142222'}}><span style={{fontSize:44,fontWeight:700,color:C.green}}>Student_001_CV.pdf</span></div>
  <div style={{opacity:scope,transform:`translateY(${mix(90,0,scope)}px)`}}>
   <Capture name="09-attachments-linked.png" x={115} y={440} w={1010} h={290} crop={{x:42,y:690,w:1826,h:320}}/>
   <div style={{position:'absolute',left:1190,top:485}}><Label size={58} w={610}>{primaryText}</Label><Label y={190} size={100} color={C.green}>211</Label><Label y={310} size={42} color={C.muted} weight={400}>resolved requirements</Label><Label y={390} size={36} color={C.muted} weight={400}>CV 60 · Portfolio 60<br/>Proposal 59 · Writing 32</Label></div>
  </div>
 </Surface>;
};

const Schedule:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const apply=ramp(f,b(4),38,EASE.swift),settle=ramp(f,b(8),20);
 return <Surface dark>
  <div style={{position:'absolute',left:mix(145,-750,apply),top:260,width:1500,transform:`perspective(1800px) rotateY(${mix(0,-8,apply)}deg)`,opacity:1-apply}}><Capture name="11-rules.png" x={0} y={0} w={1500} h={810}/></div>
  <div style={{position:'absolute',left:115,top:45,opacity:ramp(f,0,18)}}><Label size={72} color="#fff">{primaryText}</Label><Label y={100} size={40} color="#a8bdd3" weight={400}>{secondaryText}</Label></div>
  <div style={{position:'absolute',left:mix(1780,80,apply),top:230,opacity:apply}}><Capture name="12-calendar.png" x={0} y={0} w={1760} h={760} crop={{x:8,y:103,w:1904,h:822}}/></div>
  <div style={{position:'absolute',left:130,top:mix(850,870,apply),opacity:ramp(f,b(1),15)*(1-apply),background:'#fff',padding:'20px 28px',borderRadius:9,fontSize:36,color:C.blue,boxShadow:'0 10px 45px #08142224'}}>1 / institution / day · ≥7 days apart · skip weekends &amp; AU holidays</div>
  <div style={{position:'absolute',left:1140,top:130,opacity:settle,background:C.green,padding:'14px 24px',borderRadius:8,fontSize:46,color:'#fff',fontWeight:700}}>60 scheduled · 15 dates</div>
 </Surface>;
};

const Execution:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const packet=ramp(f,b(1),30,EASE.swift),native=ramp(f,b(5),25,EASE.swift);
 return <Surface>
  <div style={{position:'absolute',left:125,top:155,opacity:1-native}}><Label size={74}>{primaryText}</Label></div>
  {['Selected tasks','Chrome runtime','NetEase provider'].map((t,i)=><div key={t} style={{position:'absolute',left:125+i*595,top:320,width:530,height:370,borderTop:`4px solid ${i===2?C.muted:C.blue}`,opacity:1-native}}><Label y={25} size={44}>{t}</Label>{i===2?<Label y={85} size={36} color={C.muted} weight={400}>Offline fixture</Label>:null}</div>)}
  <div style={{position:'absolute',left:mix(155,1320,packet),top:450,opacity:1-native,width:450,height:260,padding:'30px',background:'#fff',border:'1px solid #dfe5ec',borderRadius:12,boxShadow:'0 30px 75px #08142226',transform:`translateZ(0) rotateY(${mix(-6,0,packet)}deg)`}}><div style={{fontSize:44,fontWeight:700,lineHeight:1.15,color:C.blue}}>60-task snapshot</div><div style={{fontSize:32,lineHeight:1.25,color:C.muted,marginTop:20}}>Content · files · send time</div></div>
  <Path d="M650 550H1270" p={packet} opacity={1-native}/>
  <div style={{position:'absolute',left:95,top:mix(1100,110,native),width:1730,height:850,opacity:native,borderRadius:12,overflow:'hidden',boxShadow:'0 35px 90px #08142233'}}><Html5Video src={staticFile('native/execution-progress.mp4')} muted style={{width:1730,height:973,objectFit:'cover'}}/></div>
  <div style={{position:'absolute',left:118,top:865,opacity:ramp(f,b(10),16),background:'#fff',borderLeft:`5px solid ${C.green}`,padding:'20px 26px',boxShadow:'0 15px 45px #08142222'}}><div style={{fontSize:54,fontWeight:700,color:C.green}}>{secondaryText}</div><div style={{fontSize:36,color:C.muted,marginTop:12}}>Verify required uploads before confirming each save.</div></div>
 </Surface>;
};

const scrubAt=(f:number)=>f<14?mix(8,6.5,ramp(f,10,4,EASE.smooth)):f<26?mix(6.5,76,ramp(f,14,12,EASE.out)):f<38?mix(76,70,ramp(f,26,12,EASE.smooth)):f<56?70:mix(70,40,ramp(f,56,48,EASE.smooth));
const VersionEvidence:React.FC<{updated?:boolean}>=({updated=false})=><div style={{position:'absolute',inset:0}}>
 <div style={{position:'absolute',inset:0,opacity:.15,filter:'blur(5px)'}}><Img src={staticFile('native/'+(updated?'17-maintenance-new.png':'16-maintenance-old.png'))} style={{width:1920,height:1080}}/></div>
 <Paper x={150} y={270} w={1620} h={420}>
  <Label x={45} y={32} size={42} color={updated?C.blue:C.muted}>{updated?'Replacement · VERSION 2':'Original attachment'}</Label>
  <Label x={45} y={123} size={56} color={updated?C.blue:C.ink}>Student_001_Research_Proposal{updated?'_v2':''}.pdf</Label>
  <Capture name={updated?'17-maintenance-new.png':'16-maintenance-old.png'} x={45} y={236} w={1530} h={132} crop={updated?{x:847,y:664,w:1037,h:89}:{x:27,y:462,w:771,h:67}} radius={7} style={{boxShadow:'none',border:'1px solid #dfe5ec'}}/>
 </Paper>
</div>;
const Revision:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const x=scrubAt(f)*19.2,complete=ramp(f,b(13),28,EASE.swift);
 return <Surface>
  <div style={{position:'absolute',inset:0,opacity:1-complete}}>
   <VersionEvidence/>
   <div style={{position:'absolute',inset:0,clipPath:`inset(0 ${1920-x}px 0 0)`}}><VersionEvidence updated/></div>
   <div style={{position:'absolute',left:x-2,top:0,width:4,height:1080,background:C.blue,boxShadow:'0 0 20px #08142255'}}/><div style={{position:'absolute',left:x-32,top:510,width:64,height:64,borderRadius:32,background:'#fff',border:'2px solid #dfe5ec',boxShadow:'0 10px 32px #08142233',fontSize:38,textAlign:'center',lineHeight:'58px',color:C.blue}}>↔</div>
   <div style={{position:'absolute',left:150,top:105}}><div style={{fontSize:64,fontWeight:700}}>{primaryText}</div><div style={{fontSize:38,color:C.muted,marginTop:12}}>{secondaryText}</div></div>
   {f>105?<div style={{position:'absolute',left:150,top:780,opacity:ramp(f,105,16),background:'#fff',padding:'24px 32px',borderRadius:9,boxShadow:'0 20px 55px #08142220',display:'flex',gap:40}}>{['Recipients','Subject','Body','Send time'].map(t=><div key={t} style={{display:'flex',alignItems:'center',gap:14,fontSize:40}}><Check/>{t}</div>)}</div>:null}
  </div>
  {complete>0?<div style={{opacity:complete,transform:`translateY(${mix(60,0,complete)}px)`}}><Capture name="18-maintenance-complete.png" x={110} y={100} w={1700} h={880}/><div style={{position:'absolute',left:860,top:778,background:'#fff',borderLeft:`5px solid ${C.green}`,padding:'24px 32px',boxShadow:'0 20px 55px #08142222'}}><div style={{fontSize:64,fontWeight:700,color:C.green}}>59 drafts verified and updated.</div><div style={{fontSize:36,color:C.muted,marginTop:12}}>Clone first. Verify. Swap only on success.</div></div></div>:null}
 </Surface>;
};

const History:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const matchEnd=b(6),q=f-matchEnd,phase=Math.min(3,Math.max(0,Math.floor(q/96))),inAt=phase*96;
 const cases=[
  {who:DATA[10].name,head:'Out of office',fact:'Provider auto-reply flag',value:'Automatic',action:'Follow-up may continue.',color:C.blue},
  {who:DATA[16].name,head:'Thank you for your email.',fact:'90s (<3 min) · linked thread',value:'Automatic · heuristic',action:'Correctable in monitoring.',color:C.blue},
  {who:DATA[20].name,head:'Your proposal connects with my research.',fact:'Sender + subject / reference match',value:'Human reply',action:'Stop follow-up. Respond manually.',color:C.green},
  {who:DATA[56].name,head:'Workshop logistics',fact:'Known sender · unmatched thread',value:'Needs confirmation',action:'Hold for review.',color:C.amber},
 ];
 const c=cases[phase];
 return <Surface>
  {f<matchEnd?<>
   <Capture name="19-monitor-overview.png" x={960} y={80} w={855} h={920} crop={{x:890,y:100,w:980,h:1050}} opacity={.32}/>
   <div style={{position:'absolute',left:120,top:130}}><Label size={76} w={1550}>{primaryText}</Label><Label y={115} size={42} color={C.muted} weight={400}>Later mailbox snapshot · 15 Feb 2027 · {secondaryText}</Label></div>
   <Paper x={120} y={350} w={1680} h={380}><Label x={36} y={30} size={46} color={C.blue} style={{fontFamily:'monospace'}}>supervisor001@example.invalid</Label>
    <Label x={36} y={118} size={40} color={C.muted}>23 Oct · Prospective PhD supervision enquiry</Label>
    <Label x={36} y={202} size={40} color={C.muted} opacity={ramp(f,b(1),18)}>06 Feb · Updated portfolio and doctoral enquiry</Label>
    <div style={{position:'absolute',left:1080,top:116,opacity:ramp(f,b(2),20)}}><Label size={52} color={C.blue}>One contact history.</Label><Label y={91} size={38} color={C.muted} weight={400}>Subject changes stay in this history.</Label></div>
   </Paper>
   <Path d="M300 744V850H1090" p={ramp(f,b(2),25)}/><Label x={1120} y={810} size={64} color={C.blue} opacity={ramp(f,b(3),16)}>85 sends → 60 contacts</Label>
  </>:<>
   <div style={{position:'absolute',left:130,top:105}}><Label size={72}>Incoming mail is evidence.</Label><Label y={100} size={40} color={C.muted} weight={400}>Sender · subject · provider references</Label></div>
   <div style={{position:'absolute',left:0,top:310,width:1920,height:695,overflow:'hidden'}}>
    {cases.map((item,i)=>{const local=q-i*96,enter=ramp(local,0,18,EASE.swift),exit=i===3?0:ramp(local,96,18,EASE.swift);if(local<0||local>114)return null;
     return <div key={i} style={{position:'absolute',left:mix(1940,130,enter)-1940*exit,top:0,width:1650,height:680,transform:`rotate(${mix(2.5,0,enter)-2.5*exit}deg)`,transformOrigin:'80% 50%'}}>
      <Paper x={0} y={0} w={1650} h={380} style={{borderTop:`4px solid ${item.color}`,boxShadow:'0 28px 75px #0814221b'}}>
       <Label x={38} y={28} size={40} color={C.muted}>{item.who} · incoming message</Label>
       <Label x={38} y={110} size={58} w={1500}>{item.head}</Label>
       <div style={{position:'absolute',left:38,top:242,width:1510,height:1,background:'#dfe5ec'}}/>
       <Label x={38} y={275} size={56} color={item.color} opacity={ramp(local,15,18)}>{item.fact}</Label>
      </Paper>
      <div style={{position:'absolute',left:0,top:410,opacity:ramp(local,32,18),display:'flex',flexDirection:'column',gap:12}}><div style={{fontSize:56,fontWeight:700,lineHeight:1.15,color:item.color,borderLeft:`6px solid ${item.color}`,paddingLeft:24}}>{item.value}</div><div style={{fontSize:56,lineHeight:1.15,color:C.muted,maxWidth:1650}}>{item.action}</div></div>
      <div style={{position:'absolute',left:0,top:580,width:1650,height:100,opacity:.9*ramp(local,29,20),overflow:'hidden',borderRadius:8,boxShadow:'0 12px 30px #08142212'}}><Img src={staticFile('native/contact-'+['10','16','20','56'][i]+'.png')} style={{width:1650,height:'auto'}}/></div>
     </div>;
    })}
   </div>
  </>}
 </Surface>;
};

const Eligibility:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const cut=b(16),d=LIFE.decisions[0],p=ramp(f,b(2),35,EASE.swift),pass=ramp(f,b(8),20,EASE.swift);
 if(f>=cut)return <DecisionMosaic frame={f-cut} primaryText={secondaryText}/>;
 return <Surface>
  <Paper x={110} y={110} w={1690} h={860}>
   <Label x={44} y={36} size={40} color={C.blue}>AVERY LANE · FOLLOW-UP #2</Label><Label x={44} y={118} size={76}>{primaryText}</Label>
   <div style={{position:'absolute',left:44,right:44,top:265,height:1,background:'#dfe5ec'}}/>
   {[
    ['Last actual send',ShortDate(d.lastSentAt),C.ink],['Required wait','+ 7 days',C.muted],['Due',ShortDate(d.dueAt),C.blue],['Evaluated','15 Feb',C.ink],
   ].map(([label,value,color],i)=><div key={label} style={{position:'absolute',left:44+i*414,top:313,opacity:i<2?1:p,transform:i>1?`translateX(${mix(28,0,p)}px)`:undefined}}><div style={{fontSize:38,color:C.muted}}>{label}</div><div style={{fontSize:76,color,fontWeight:700,marginTop:28,letterSpacing:'-.03em'}}>{value}</div></div>)}
   <div style={{position:'absolute',left:44,right:44,top:520,height:1,background:'#dfe5ec'}}/>
   <div style={{position:'absolute',left:44,top:554,opacity:pass,display:'flex',flexDirection:'column',gap:24,fontSize:56,lineHeight:1.25,color:C.muted}}>{['No human / uncertain reply','No pending follow-up','1 of 2 attempts used'].map(t=><div key={t} style={{display:'flex',gap:13,alignItems:'center'}}><Check/>{t}</div>)}</div>
   <div style={{position:'absolute',left:960,top:730,background:'#e3f3eb',borderRadius:8,padding:'14px 24px',fontSize:56,fontWeight:700,color:C.green,opacity:ramp(f,b(11),16)}}>Ready to prepare</div>
   <Label x={960} y={554} w={680} size={56} color={C.muted} opacity={ramp(f,b(11),16)}>Auto-replies do not block eligibility.</Label>
  </Paper>
 </Surface>;
};

const Compose:React.FC<V>=({f,b,primaryText,secondaryText})=>{
 const native=ramp(f,b(8),28,EASE.swift),built=ramp(f,b(3),35,EASE.swift),ownership=f>=b(12),task=LIFE.generated.created[0];
 return <Surface>
  <div style={{position:'absolute',left:110,top:115,opacity:1-native}}><Label size={76}>{primaryText}</Label></div>
  {[
   {label:'From the initial mail',text:'Dear Avery Lane,',y:280,color:C.blue},
   {label:'Configured template',text:'I wanted to follow up on my doctoral supervision enquiry…',y:480,color:C.ink},
   {label:'From the initial mail',text:'Kind regards,\nStudent 001',y:720,color:C.blue},
  ].map((s,i)=>{const p=ramp(f,b(i),30,EASE.swift);return <div key={i} style={{position:'absolute',left:mix(110,230,built),top:mix(s.y,s.y-i*20,built),width:1480,padding:'24px 32px',background:'#fff',borderLeft:`5px solid ${s.color}`,borderRadius:8,boxShadow:`0 ${18*(1-built)}px ${55*(1-built)}px #0814221c`,opacity:p*(1-native)}}><div style={{fontSize:34,color:C.muted,opacity:1-built}}>{s.label}</div><div style={{fontSize:i===1?44:50,fontWeight:i===1?400:700,color:s.color,whiteSpace:'pre-line',marginTop:12}}>{s.text}</div></div>})}
  <div style={{position:'absolute',left:110,top:mix(1100,110,native),opacity:native}}><Capture name={ownership?'21-followup-settings.png':'25-followup-review.png'} x={0} y={0} w={1700} h={860}/></div>
  {native>0?<div style={{position:'absolute',left:ownership?240:1050,top:ownership?650:780,width:ownership?1460:740,background:'#fff',borderLeft:`5px solid ${C.green}`,padding:'24px 30px',borderRadius:8,boxShadow:'0 20px 55px #08142226'}}><div style={{fontSize:ownership?58:50,fontWeight:700,color:C.green}}>{ownership?'19 managed bodies update. 1 manual edit stays.':secondaryText}</div><div style={{fontSize:36,color:C.muted,marginTop:13}}>{ownership?'Template ownership protects edited mail.':'Forward original · Reply all · New mail'}</div></div>:null}
 </Surface>;
};

const views:Record<string,React.FC<V>>={intake:Intake,duplicates:Duplicates,review:Review,files:Files,schedule:Schedule,execution:Execution,revision:Revision,history:History,eligibility:Eligibility,compose:Compose};
export const ProcessScene:React.FC<ProcessProps>=({kind='intake',duration=180,primaryText='',secondaryText='',accent=C.blue})=>{
 const f=Math.min(useCurrentFrame(),duration-1),shot=SHOTS.find(s=>s.id===kind)!,b=(n:number)=>beatF(shot.b0+n)-shot.from;
 const View=views[kind];return View?<View f={f} duration={duration} b={b} primaryText={primaryText} secondaryText={secondaryText} accent={accent}/>:null;
};
