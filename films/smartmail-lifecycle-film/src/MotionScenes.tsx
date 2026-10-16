import React from 'react';
import {Html5Video,Img,interpolate,staticFile,spring,Easing,Sequence} from 'remotion';
import {Capture,Surface} from './ui';
import {COLORS as C} from './timeline';
import {EASE,bezier,mix,ramp,SpeedBlur,velocity,softShadow} from './lib/Polish';
import {Sheet,Type,Kicker,Line,Tick,Cursor,FileIcon,ScanBracket,GroundShadows,NativeImage,clamp,pop,outCubic,outQuad,outBack,inOutCubic,makeCurve,quad,place,words} from './lib/ProcessMotion';
import DATA from './demo-data.json';
import LIFE from './lifecycle-data.json';

export type MotionViewProps={f:number;duration:number;b:(n:number)=>number;primaryText:string;secondaryText:string;accent:string};
type V=MotionViewProps;
const A='var(--process-accent, #1769e0)';
const Divider:React.FC<{x:number;y:number;w:number}>=({x,y,w})=><div style={{...place(x,y,w,1),background:'#dfe5ec'}}/>;
const Heading:React.FC<{tag:string;title:string}>=({tag,title})=><><Kicker>{tag}</Kicker><Type x={110} y={152} size={74}>{title}</Type></>;
const Duplicates:React.FC<V>=({f,primaryText})=>{
 const phase=f<94?0:1,q=phase?f-94:f,select=pop(q,28,16,120);
 const apart=ramp(q,12,30,EASE.swift),done=ramp(q,53,14);
 const w=760,h=510,y=370;
 return <Surface>
  <Heading tag="IMPORT · OPERATOR DECISION" title={phase?'Same name. Different emails.':primaryText}/>
  <Type x={110} y={264} size={38} color={C.muted} weight={400}>{phase?'Avery Lane · RMIT University':'Jordan Quinn · one email address after lowercasing'}</Type>
  <div style={{...place(0,0),width:1920,height:1080,perspective:2600}}>
   <div style={{...place(0,0,1920,1080),transformStyle:'preserve-3d',transform:'rotateX('+mix(24,20,ramp(q,0,80))+'deg)',transformOrigin:'50% 55%'}}>
    {[0,1].map(i=>{
     const x=phase?mix(i?920:240,i?1040:110,apart):i?1040:110,lift=phase?0:i===0?select:0,discard=phase?0:i===1?ramp(q,48,24,EASE.exit):0;
     return <div key={i} style={{...place(x+discard*1000,y+discard*250,w,h),transformStyle:'preserve-3d',transform:'rotateZ('+(discard*9)+'deg)',opacity:1-discard}}>
      <GroundShadows x={0} y={0} w={w} h={h} lift={lift}/>
      <Sheet x={0} y={0} w={w} h={h} shadow={false} style={{transformStyle:'preserve-3d',transform:'translateZ('+(96*lift)+'px) scale('+(1+.05*lift)+')'}}>
       <Type x={32} y={28} size={36} color={C.muted} weight={400}>{phase?'Avery Lane':i?'Short version · 93 characters':'Complete version · 603 characters'}</Type>
       <Type x={32} y={103} size={35} color={A} style={{fontFamily:'monospace',letterSpacing:'-.035em'}}>{phase?'supervisor00'+(i+1)+'@example.invalid':i&&q<20?'SUPERVISOR007@EXAMPLE.INVALID':'supervisor007@example.invalid'}</Type>
       <Divider x={32} y={180} w={695}/>
       <Capture name={phase?'04-dedupe.png':'05-dedupe-1.png'} x={32} y={205} w={695} h={210} crop={{x:i?963:57,y:650,w:820,h:248}} style={{boxShadow:'none',border:'1px solid #e5eaf0'}}/>
       {!phase&&i===0?<div style={{...place(32,435),display:'flex',alignItems:'center',gap:20,opacity:done}}><Tick size={42}/><Type x={60} y={-7} size={56} color={C.green}>Keep this version</Type></div>:null}
       {phase?<div style={{...place(32,435),display:'flex',alignItems:'center',gap:20,opacity:done}}><Tick size={42} color={A}/><Type x={60} y={-7} size={56} color={A}>Keep this contact</Type></div>:null}
      </Sheet>
     </div>;
    })}
   </div>
  </div>
  <Type x={110} y={986} size={36} color={C.muted} weight={400} style={{opacity:ramp(q,phase?53:44,12)}}>{phase?'The operator keeps both contacts.':'The operator keeps the complete version.'}</Type>
 </Surface>;
};

const FILES=[
 {name:'CV',full:'Student_001_CV.pdf',y:365,required:true},
 {name:'Portfolio',full:'Student_001_Portfolio.pdf',y:515,required:true},
 {name:'Research proposal',full:'Student_001_Research_Proposal.pdf',y:665,required:true},
 {name:'Writing sample',full:'Student_001_Writing_Sample.pdf',y:815,required:false},
];
const FILE_CURVES=FILES.map(s=>makeCurve({x:310,y:s.y+60},{x:1410,y:605}));
const Files:React.FC<V>=({f,primaryText})=>{
 const t=clamp(f/154),conv=ramp(t,.34,.4,inOutCubic),erase=ramp(t,.78,.12,outQuad);
 const pan=ramp(t,.76,.17,EASE.smooth),receiptScale=(1+ramp(t,.7,.08,outBack)*.12-ramp(t,.78,.08,outQuad)*.12);
 const match=ramp(f,14,20,EASE.swift),native=ramp(f,123,18,EASE.swift),scope=ramp(f,125,14);
 return <Surface>
  <Heading tag="ATTACHMENTS · MATCH MAIL HINTS" title={primaryText}/>
  <div style={{...place(110,265),display:'flex',gap:0,fontSize:36,fontWeight:400,color:C.muted,opacity:1-native}}>
   <span style={{display:'inline-block',width:410*(1-match),overflow:'hidden',opacity:1-match,whiteSpace:'nowrap'}}>attachments/common/</span><span style={{color:A,fontWeight:700}}>Student_001_CV.pdf</span><span style={{marginLeft:26,opacity:match}}>→ one matching file name</span>
  </div>
  <div style={{...place(0,0,1920,1080),transform:'translateX('+(-140*pan)+'px)',opacity:1-native}}>
   <svg width={1920} height={1080} style={place(0,0)}>
    {FILES.map((s,i)=>{const g=FILE_CURVES[i],draw=ramp(t,.04+i*.045,.17,outQuad);return <path key={s.name} d={g.d} fill="none" stroke={s.required?'#8fb1dd':'#d5dce6'} strokeWidth={s.required?3:2} strokeDasharray={g.len} strokeDashoffset={erase>0?-erase*g.len:g.len*(1-draw)} opacity={s.required?1-erase*.9:.35*(1-ramp(f,50,20))}/>;})}
   </svg>
   <Sheet x={1160} y={363} w={620} h={505} style={{transform:'scale('+receiptScale+')'}}>
    <Type x={34} y={30} size={34} color={C.muted} weight={400}>AVERY LANE · TASK-001</Type>
    <Type x={34} y={112} size={56}>Requested files</Type>
    <Divider x={34} y={196} w={552}/>
    {['CV','Portfolio','Research proposal'].map((v,i)=><div key={v} style={{...place(34,230+i*76),display:'flex',alignItems:'center',gap:20}}><Tick p={ramp(f,102+i*4,9)}/><div style={{fontSize:42,color:conv>.9?C.green:C.muted}}>{v}</div></div>)}
   </Sheet>
   {FILES.map((s,i)=>{
    const g=FILE_CURVES[i],u=s.required?conv:0,pt=g.pointAt(g.len*(g.f0+(1-g.f0)*u)),size=u<.75?mix(1,.34,u/.75):mix(.34,0,(u-.75)/.25);
    const appear=ramp(t,.02+i*.04,.1,EASE.overshoot),op=ramp(t,.02+i*.04,.06);
    return <React.Fragment key={s.name}>
     <div style={{...place(pt.x-260,pt.y-60,520,120),transform:'scale('+(size*appear)+')',opacity:op*(s.required?1:1-ramp(f,46,20)*.7),transformOrigin:'50% 50%'}}>
      <Sheet x={0} y={0} w={520} h={120}><div style={place(24,21)}><FileIcon size={56}/></div><Type x={108} y={33} size={42}>{s.name}</Type></Sheet>
     </div>
     {s.required?Array.from({length:9},(_,j)=>{const phase=((ramp(t,.1,.64,EASE.linear)*2+i*.13)%1)-j*.0055,point=g.pointAt(g.len*clamp(phase));return <div key={j} style={{...place(point.x-4,point.y-4,8,8),borderRadius:5,background:A,opacity:ramp(t,.1,.06)*(1-ramp(t,.7,.06))*(1-j/10),transform:'scale('+(1-j*.07)+')'}}/>;}):<Type x={90} y={950} size={34} color={C.muted} weight={400} style={{opacity:ramp(f,43,12)*(1-scope)}}>Writing sample is not requested by this email.</Type>}
    </React.Fragment>;
   })}
  </div>
  <div style={{opacity:native,transform:'translateY('+mix(100,0,native)+'px)'}}>
   <Capture name="09-attachments-linked.png" x={110} y={320} w={1700} h={475} crop={{x:30,y:530,w:1835,h:512}}/>
   <Type x={110} y={855} size={70} color={C.green}>211 file links · 60 emails</Type>
   <Type x={110} y={955} size={34} color={C.muted} weight={400}>CV 60 · Portfolio 60 · Proposal 59 · Writing sample 32</Type>
  </div>
 </Surface>;
};

const Execution:React.FC<V>=({f,primaryText})=>{
 const travel=ramp(f,10,56,EASE.swift),native=ramp(f,68,24,EASE.swift),done=ramp(f,165,20);
 const at=(n:number)=>{const u=ramp(n,10,56,EASE.swift);return{x:mix(185,1190,u),y:475-Math.sin(Math.PI*u)*110};};
 const p=at(f),v={x:velocity(n=>at(n).x,f),y:velocity(n=>at(n).y,f)},checked=ramp(f,50,12),saved=ramp(f,63,5);
 return <Surface dark>
  <Kicker style={{color:'#a8bdd3'}}>BATCH EXECUTION · OFFLINE PROVIDER</Kicker><Type x={110} y={152} size={74} color="#fff">{primaryText}</Type>
  <div style={{opacity:1-native}}>
   <div style={{...place(-400,350,1150,650),opacity:.24,transform:'perspective(1800px) rotateY(16deg)'}}><Capture name="10-unscheduled.png" x={0} y={0} w={1150} h={650}/></div>
   <Type x={110} y={287} size={36} color="#aec2d8" weight={400}>60 selected · one job at a time</Type>
   <Type x={850} y={337} size={34} color="#aec2d8" weight={400}>Chrome runtime</Type>
   <Type x={1395} y={337} size={34} color="#aec2d8" weight={400}>Offline provider</Type>
   <div style={{...place(1025,408,32,450),background:'linear-gradient(90deg,#5f7894,#d7e6f6,#637f9e)',borderRadius:10,boxShadow:'12px 20px 35px #0005'}}/>
   <Line d="M1065 623H1840" p={ramp(f,37,29,EASE.swift)} color="#5b7fa7" width={2}/>
   <SpeedBlur vx={v.x} vy={v.y} amount={.32} max={14}><Sheet x={p.x} y={p.y} w={620} h={395} style={{transform:'perspective(1600px) rotateY('+(-8*Math.sin(Math.PI*travel))+'deg) rotate('+mix(-4,0,travel)+'deg)',boxShadow:'0 35px 65px #0005'}}>
    <Type x={30} y={22} size={32} color={C.muted} weight={400}>JOB 01 / 60</Type><Type x={30} y={82} size={62} color={A}>Avery Lane</Type>
    <Type x={30} y={171} size={34} color={C.muted} weight={400}>Content · files · send time</Type><Divider x={30} y={237} w={560}/>
    {['CV','Portfolio','Proposal'].map((name,i)=><div key={name} style={{...place(30+i*187,268,170,80),display:'flex',gap:10,alignItems:'center',color:checked>.8?C.green:C.muted}}><Tick p={ramp(f,49+i*3,8)} size={30}/><span style={{fontSize:32}}>{name}</span></div>)}
   </Sheet></SpeedBlur>
   <div style={{...place(1038,408,13,450),borderRadius:8,background:'linear-gradient(90deg,#c5d8ed,#617b96)',boxShadow:'8px 0 15px #08142250'}}/>
   <div style={{...place(1430,795,370,106),opacity:saved,transform:'rotate('+mix(-8,-3,pop(f,63,18,180))+'deg) scale('+mix(.9,1,pop(f,63,18,180))+')',border:'3px solid #8cd6b5',borderRadius:8,color:'#b5e8d0',display:'flex',gap:20,alignItems:'center',justifyContent:'center',background:'#173b36'}}><Tick size={42} color="#b5e8d0"/><span style={{fontSize:56,fontWeight:700}}>Saved</span></div>
  </div>
  <div style={{opacity:native,transform:'translateY('+mix(110,0,native)+'px)'}}>
   <div style={{...place(110,300,1700,580),overflow:'hidden',borderRadius:12,boxShadow:'0 35px 90px #0005'}}>
    {f<165?<Sequence from={68} durationInFrames={97} layout="none"><Html5Video src={staticFile('native/execution-progress.mp4')} muted playbackRate={1.7} style={{width:1700,height:956,position:'absolute',top:-70}}/></Sequence>:<NativeImage name="14-complete.png" style={{width:1700,height:956,position:'absolute',top:-70}}/>}
   </div>
   <Type x={110} y={916} size={64} color="#8cd6b5" style={{opacity:done}}>60 drafts saved · 211 file links</Type>
   <Type x={110} y={1000} size={34} color="#aec2d8" weight={400}>Required uploads are checked before each save.</Type>
  </div>
 </Surface>;
};

const flipAngle=(f:number)=>{
 if(f<62)return -10*ramp(f,58,4,EASE.out);
 if(f<78)return mix(-10,194,ramp(f,62,16,bezier(.55,0,.3,1)));
 return 194-14*pop(f,78,15,190);
};
const ProposalFace:React.FC<{back?:boolean;f:number;angle?:number}>=({back=false,f,angle=0})=>{
 const face=Math.abs(Math.cos(angle*Math.PI/180)),band=Math.max(0,1-Math.abs(angle-90)/34),pos=mix(-20,120,clamp((angle-56)/68));
 return <div style={{position:'absolute',inset:0,backfaceVisibility:'hidden',WebkitBackfaceVisibility:'hidden',transform:back?'rotateY(180deg)':undefined,borderRadius:10,overflow:'hidden',background:back?'#f8fbff':'#fff',border:'1px solid #dfe5ec'}}>
  <Type x={34} y={29} size={34} color={back?A:C.muted} weight={400}>{back?'REPLACEMENT COPY · VERSION 2':'ORIGINAL DRAFT'}</Type>
  <Type x={34} y={108} w={698} size={56} color={back?A:C.ink}>Student_001_{'\n'}Research_Proposal{back?'_v2':''}.pdf</Type>
  <Capture name={back?'17-maintenance-new.png':'16-maintenance-old.png'} x={34} y={285} w={698} h={108} crop={back?{x:847,y:664,w:1037,h:160}:{x:27,y:462,w:771,h:119}} style={{boxShadow:'none',border:'1px solid #dfe5ec'}}/>
  <Type x={34} y={440} size={34} color={C.muted} weight={400}>{back?'Original kept until checks pass.':'Copy this draft before changing its file.'}</Type>
  <div style={{position:'absolute',inset:0,background:'#000',opacity:(1-face)*.4,pointerEvents:'none'}}/>
  <div style={{position:'absolute',inset:0,background:'linear-gradient(110deg,transparent '+(pos-15)+'%,#fff '+pos+'%,transparent '+(pos+15)+'%)',opacity:band*.5,pointerEvents:'none'}}/>
 </div>;
};
const Revision:React.FC<V>=({f,primaryText})=>{
 const copy=ramp(f,10,36,EASE.swift),angle=flipAngle(f),lift=60*Math.sin(Math.PI*clamp(angle/180));
 const verify=ramp(f,130,45,EASE.swift),swap=ramp(f,190,32,EASE.swift),native=ramp(f,240,20,EASE.swift);
 const x=mix(110,1040,copy)-930*swap;
 return <Surface>
  <Heading tag="DRAFT ATTACHMENTS · 59 PROPOSALS" title={primaryText}/>
  <div style={{opacity:1-native}}>
   <div style={{...place(110,347,766,526),opacity:1-swap,transform:'translateX('+(-500*swap)+'px) rotate('+(-8*swap)+'deg)'}}><Sheet x={0} y={0} w={766} h={526}><ProposalFace f={f}/></Sheet></div>
   <div style={{...place(x,347,766,526),perspective:1600,opacity:ramp(f,7,8)}}>
    <div style={{...place(0,14,766,526),background:C.night,borderRadius:10,opacity:.12*(1-clamp(lift/120)),filter:'blur('+(12+lift*.4)+'px)',transform:'scaleX('+(.3+.7*Math.abs(Math.cos(angle*Math.PI/180)))+')'}}/>
    <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:'translateZ('+lift+'px) rotateY('+angle+'deg)'}}><ProposalFace f={f} angle={angle}/><ProposalFace back f={f} angle={angle}/></div>
    <div style={{...place(0,536,766,160),overflow:'hidden',opacity:.13,maskImage:'linear-gradient(#000,transparent)',WebkitMaskImage:'linear-gradient(#000,transparent)',transform:'scaleY(-1)',pointerEvents:'none'}}><div style={{...place(0,-366,766,526),transform:'rotateY('+angle+'deg)'}}><ProposalFace back={angle>90} f={f}/></div></div>
   </div>
   <Line d="M890 610H1015" p={copy} opacity={1-swap}/>
   <Type x={110} y={930} size={56} color={C.muted} style={{opacity:(1-ramp(f,118,12))}}>Copy draft → change attachment</Type>
   {f>=118?<Type x={110} y={267} size={40} color={C.muted} weight={400} style={{opacity:ramp(f,118,8)*(1-ramp(f,188,12))}}>Verify the original content and send time.</Type>:null}
   {f>=118?<div style={{...place(mix(1080,1040,verify),910),display:'flex',gap:18,alignItems:'center',opacity:ramp(f,178,10)*(1-swap)}}><Tick p={verify} size={54}/><Type x={74} y={-6} size={56} color={verify>.95?C.green:A}>Checks passed</Type></div>:null}
   {['Recipients','Subject','Body','Send time'].map((s,i)=>{
    const a=130+i*10,p=ramp(f,a,16,EASE.swift),target={x:1210,y:890};
    return <div key={s} style={{...place(mix(120+i*440,target.x,p),mix(913,target.y,p),420,96),opacity:ramp(f,118+i*3,10)*(1-ramp(f,a+14,8)),transform:'scale('+(1-.48*p)+')',background:'#fff',borderBottom:'3px solid '+C.green,boxShadow:softShadow(8)}}><Type x={24} y={16} size={56}>{s}</Type></div>;
   })}
   <Type x={1050} y={455} w={725} size={70} color={C.green} style={{opacity:swap}}>Replace only after{'\n'}checks pass.</Type>
   <Type x={1050} y={680} w={700} size={40} color={C.muted} weight={400} style={{opacity:swap}}>Recipients, subject, body and send time stay the same.</Type>
  </div>
  <div style={{opacity:native,transform:'translateY('+mix(80,0,native)+'px)'}}>
   <Capture name="18-maintenance-complete.png" x={110} y={305} w={1700} h={550} crop={{x:10,y:100,w:1900,h:615}}/>
   <Type x={110} y={918} size={66} color={C.green}>59 drafts checked and updated.</Type>
  </div>
 </Surface>;
};

const PARTS=[
 {label:'Greeting from the original',row:'Dear Avery Lane,',body:'Dear Avery Lane,',y:350,h:106,ty:372,th:96,rot:-2.5},
 {label:'Configured template',row:'Follow-up template',body:'I wanted to follow up on my doctoral supervision enquiry…',y:530,h:106,ty:492,th:245,rot:1.8},
 {label:'Signature from the original',row:'Kind regards, Student 001',body:'Kind regards,\nStudent 001',y:710,h:106,ty:752,th:153,rot:-1.2},
];
const partU=(f:number,i:number)=>f<60+i*6?0:spring({frame:f-60-i*6,fps:30,config:{damping:17,stiffness:95,mass:.9}});
const partGeom=(f:number,i:number)=>{
 const s=PARTS[i],u=partU(f,i),us=partU(f-3,i),q=clamp(u);
 const a={x:470,y:s.y+s.h/2},z={x:1420,y:s.ty+s.th/2},c={x:(a.x+z.x)/2,y:Math.min(a.y,z.y)-220},p=quad(a,c,z,q);
 return{u,us,cx:p.x+(u-q)*(z.x-c.x)*.6,cy:p.y+(u-q)*(z.y-c.y)*.6,w:mix(720,690,us),h:mix(s.h,s.th,us),arc:Math.sin(Math.PI*q)};
};
const Compose:React.FC<V>=({f,primaryText})=>{
 const unify=ramp(f,120,18,EASE.swift),native=ramp(f,145,14,EASE.swift),ownership=ramp(f,174,16,EASE.swift);
 const original=ramp(f,1,18),update=ramp(f,188,24,EASE.swift);
 const cursorKeys=[{f:3,x:830,y:880},{f:13,x:134,y:392},{f:23,x:134,y:572},{f:33,x:134,y:752},{f:50,x:685,y:955}];
 let cursor={x:830,y:880};for(let i=1;i<cursorKeys.length;i++){const a=cursorKeys[i-1],z=cursorKeys[i];if(f>=a.f){const u=ramp(f,a.f+1,z.f-a.f-1,EASE.swift);cursor={x:mix(a.x,z.x,u),y:mix(a.y,z.y,u)-26*Math.sin(Math.PI*u)};}}
 const press=Math.max(...[14,24,34,52].map(at=>f>=at-1&&f<at+6?Math.sin(Math.PI*(f-at+1)/7):0));
 return <Surface>
  <Heading tag={f<174?'FOLLOW-UP · USE THE ORIGINAL GREETING AND SIGNATURE':'FOLLOW-UP · TEMPLATE CHANGE'} title={f<174?primaryText:'Keep manual edits.'}/>
  <div style={{position:'absolute',inset:0,opacity:1-native}}>
   <Type x={110} y={252} size={34} color={C.muted} weight={400}>Copied parts from the original email.</Type>
   <Type x={1045} y={265} size={32} color={C.muted} weight={400}>Forward original · Reply all · New mail</Type>
   <Sheet x={1045} y={310} w={770} h={630} style={{opacity:ramp(f,22,20),borderColor:'#cadcf2'}}><Type x={30} y={20} size={32} color={A} weight={400}>FOLLOW-UP #2 · FORWARD ORIGINAL</Type></Sheet>
   {PARTS.map((s,i)=>{
    const at=56+i*6,lift=ramp(f,at,4,EASE.out),g=partGeom(f,i),go=f>=at,check=ramp(f,14+i*10,7,EASE.out);
    const vx=velocity(n=>partGeom(n,i).cx,f),vy=velocity(n=>partGeom(n,i).cy,f);
    return <React.Fragment key={s.label}>
     <Type x={110} y={s.y-42} size={32} color={C.muted} weight={400} style={{opacity:ramp(f,3+i*4,10)}}>{s.label}</Type>
     <div style={{...place(110,s.y,720,106),border:go?'2px dashed #b9cce5':'1px solid #dfe5ec',borderRadius:8,background:go?'transparent':'#fff',boxShadow:go?undefined:softShadow(4),opacity:original}}>
      {go?<Type x={26} y={31} size={36} color={C.muted} weight={400}>Copied to follow-up</Type>:<><div style={place(24,32)}><Tick p={check} color={A}/></div><Type x={82} y={29} size={42}>{s.row}</Type></>}
     </div>
     {go?<SpeedBlur vx={vx} vy={vy} amount={.32} max={14}>
      <div style={{...place(g.cx-g.w/2,g.cy-g.h/2,g.w,g.h),borderRadius:mix(8,9,clamp(g.us)),background:'#fff',border:'1px solid '+(unify>.99?'transparent':'#d5e1ef'),overflow:'hidden',transform:'rotate('+(s.rot*g.u*(1-unify))+'deg) scale('+(1+.02*lift*(1-clamp(g.u)))+','+(1-.03*ramp(f,at+40,3)*(1-ramp(f,at+43,3)))+')',boxShadow:unify>.99?'none':softShadow(8+46*g.arc)}}>
       <div style={{opacity:1-ramp(g.us,.08,.32),...place(0,0)}}><div style={place(24,32)}><Tick color={A}/></div><Type x={82} y={29} size={42}>{s.row}</Type></div>
       <div style={{opacity:ramp(g.us,.5,.3),...place(0,0)}}><Type x={20} y={14} w={650} size={56} weight={i===1?400:700} color={i===1?C.ink:A}>{s.body}</Type></div>
      </div>
     </SpeedBlur>:null}
    </React.Fragment>;
   })}
   <div style={{...place(110,916,684,128),transform:'scale('+(1-.06*ramp(f,52,3)*(1-ramp(f,55,9)))+')',opacity:1-ramp(f,82,15)}}><Capture name="v6/prepare-button.png" x={0} y={0} w={684} h={128} radius={8} style={{boxShadow:softShadow(4)}}/></div>
   {f<78?<div style={{opacity:ramp(f,3,8)*(1-ramp(f,68,10))}}><Cursor x={cursor.x} y={cursor.y} press={press}/></div>:null}
  </div>
  <div style={{position:'absolute',inset:0,opacity:native*(1-ownership)}}>
   <Capture name="v6/followup-preview.png" x={110} y={310} w={1700} h={580} crop={{x:310,y:100,w:1480,h:505}}/>
   <Type x={110} y={936} size={64} color={C.green}>20 follow-ups ready for review.</Type>
  </div>
  <div style={{position:'absolute',inset:0,opacity:ownership}}>
   <div style={{...place(1120,315,670,610),overflow:'hidden',borderRadius:10,boxShadow:softShadow(20),background:'#fff'}}><Capture name="v6/manual-followup.png" x={0} y={0} w={670} h={196} crop={{x:590,y:127,w:980,h:286}} radius={0} style={{boxShadow:'none',opacity:.65}}/><Divider x={34} y={218} w={602}/><Type x={34} y={250} size={34} color={C.muted} weight={400}>MANUAL ADDITION</Type><Type x={34} y={320} w={600} size={56}>I will be in Melbourne in March.</Type><Type x={34} y={500} size={56} color={A}>Kept unchanged</Type></div>
   <div style={{...place(1120,300,670,28),background:'linear-gradient(#adb9ca,#f4f8ff,#8395ad)',borderRadius:8,boxShadow:'0 5px 12px #08142224',transform:'translateY('+mix(-32,0,pop(f,182,17,160))+'px)'}}/>
   <Type x={1120} y={938} size={56} color={A}>1 manual edit kept</Type>
   {Array.from({length:7},(_,i)=>{
    const p=ramp(f,185+i*2,26,EASE.swift),x=mix(110+i*45,390+i*40,p),y=330+i*24-Math.sin(p*Math.PI)*100;
    return <Sheet key={i} x={x} y={y} w={410} h={320} style={{transform:'rotate('+mix(-6+i*2,-4+i,p)+'deg)',zIndex:8-i,borderColor:p>.5?'#9acabb':'#dfe5ec'}}><Type x={25} y={24} size={32} color={C.muted} weight={400}>TEMPLATE BODY</Type><Divider x={25} y={90} w={360}/><Type x={25} y={125} w={360} size={42} color={p>.5?C.green:C.ink}>{p>.5?'Updated template':'Previous template'}</Type><div style={place(25,250)}><Tick p={p} size={45}/></div></Sheet>;
   })}
   <Type x={110} y={875} size={96} color={C.green}>{Math.round(19*update)}</Type>
   <Type x={260} y={915} size={56} color={C.green}>bodies updated</Type>
  </div>
 </Surface>;
};

export const MOTION_VIEWS:Record<string,React.FC<V>>={duplicates:Duplicates,files:Files,execution:Execution,revision:Revision,compose:Compose};
