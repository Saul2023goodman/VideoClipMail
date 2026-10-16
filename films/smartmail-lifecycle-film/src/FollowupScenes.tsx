import React from 'react';
import {Img,staticFile,spring} from 'remotion';
import {Surface} from './ui';
import {COLORS as C,SHOTS} from './timeline';
import {EASE,mix,ramp,softShadow,SpeedBlur,velocity} from './lib/Polish';
import {Type,Sheet,Tick,place,clamp,quad} from './lib/ProcessMotion';
import type {MotionViewProps} from './MotionScenes';
import LIFE from './lifecycle-data.json';
import NATIVE from './followup-layout-v8.json';

const BLUE='var(--process-accent, #1769e0)';
const ELLIOT=LIFE.decisions[16],AVERY=LIFE.decisions[0];
const elliotOutbound=ELLIOT.outbounds[0];
const text=(size:number,color=C.ink,weight=700):React.CSSProperties=>({fontFamily:'OpenFilm',fontSize:size,fontWeight:weight,lineHeight:1.18,letterSpacing:'-.025em',color});
const imageSize=(name:string)=>(NATIVE.images as Record<string,{w:number;h:number}>)[name];
const Native:React.FC<{name:string;x:number;y:number;w:number;opacity?:number;style?:React.CSSProperties}>=({name,x,y,w,opacity=1,style})=>{
 const size=imageSize(name);return <Img src={staticFile('native/v8/'+name)} style={{...place(x,y,w,w*size.h/size.w),opacity,...style}}/>;
};
const Mail:React.FC<{x:number;y:number;w?:number;color?:string;closed?:number;scale?:number;opacity?:number}>=({x,y,w=70,color=BLUE,closed=1,scale=1,opacity=1})=><div style={{...place(x-w/2,y-w*.34,w,w*.68),transform:'scale('+scale+')',opacity}}><svg width="100%" height="100%" viewBox="0 0 100 68" style={{overflow:'visible'}}><rect x={2} y={3} width={96} height={62} rx={6} fill="#fff" stroke={color} strokeWidth={3}/><path d={'M4 6L50 '+mix(-24,39,closed)+'L96 6'} fill={closed>.5?'none':'#f0f5fd'} stroke={color} strokeWidth={3} strokeLinejoin="round"/><path d="M4 63L35 34M96 63L65 34" fill="none" stroke={color} strokeWidth={2} opacity={.5}/></svg></div>;

// Exact LineCarryTransition: one world, drawn=LEAD+camera through the 56-frame pan.
const X0=336,LINE_Y=850,BAR=648,LEAD=1144,FX0=2880,FX1=3600,FY0=370;
const SEGMENTS=[[X0,LINE_Y,FX0,LINE_Y],[FX0,LINE_Y,FX0,FY0],[FX0,FY0,FX1,FY0],[FX1,FY0,FX1,LINE_Y],[FX1,LINE_Y,FX0,LINE_Y]];
const LENS=SEGMENTS.map(([a,b,c,d])=>Math.hypot(c-a,d-b)),LENGTH=LENS.reduce((a,b)=>a+b,0);
const carryCamera=(f:number)=>1920*ramp(f,56,56,EASE.smooth);
const carryDraw=(f:number)=>f<46?BAR*ramp(f,4,36,EASE.out):f<56?mix(BAR,LEAD,ramp(f,46,10,EASE.swift)):f<112?LEAD+carryCamera(f):mix(LEAD+1920,LENGTH,ramp(f,112,24,EASE.smooth));
const carryTip=(d:number)=>{let left=Math.max(0,Math.min(d,LENGTH));for(let i=0;i<SEGMENTS.length;i++){const[a,b,c,e]=SEGMENTS[i];if(left<=LENS[i]){const p=left/LENS[i];return{x:mix(a,c,p),y:mix(b,e,p)};}left-=LENS[i];}return{x:FX0,y:LINE_Y};};

// Evidence folio: a designed view of real mailbox fields, not a replica of product UI.
const W=1600,H=1000,PERSP=2400;
const LAYERS=[
 {key:'contact',x:0,y:0,w:288,h:H,z:150},
 {key:'body',x:320,y:410,w:860,h:558,z:270},
 {key:'delay',x:1204,y:410,w:364,h:558,z:400},
 {key:'thread',x:320,y:130,w:1248,h:250,z:520},
 {key:'sender',x:288,y:0,w:1280,h:100,z:640},
];
const FolioLayer:React.FC<{kind:string}>=({kind})=>{
 if(kind==='contact')return <><Type x={26} y={38} size={42} color={C.muted} weight={400}>CONTACT</Type><Type x={26} y={142} w={230} size={76}>{ELLIOT.name.replace(' ','\n')}</Type><Mail x={140} y={450} w={125}/><Type x={26} y={660} w={235} size={40} color={C.muted} weight={400}>{"One recipient\nOne history"}</Type><Type x={26} y={870} size={72} color={BLUE}>017</Type></>;
 if(kind==='sender')return <><Type x={30} y={20} size={42} color={C.muted} weight={400}>FROM</Type><Type x={195} y={18} size={46} color={BLUE}>{ELLIOT.email}</Type></>;
 if(kind==='thread')return <><Type x={34} y={24} size={40} color={C.muted} weight={400}>IN-REPLY-TO / REFERENCES</Type><Type x={34} y={100} size={88} color={BLUE}>{elliotOutbound.providerMessageId}</Type><Type x={780} y={118} size={40} color={C.muted} weight={400}>Matches sent ID</Type></>;
 if(kind==='delay')return <><Type x={30} y={30} w={304} size={40} color={C.muted} weight={400}>{"RETURN\nDELAY"}</Type><Type x={30} y={160} size={166} color={BLUE}>90<span style={{fontSize:70}}>s</span></Type><div style={{...place(30,365,304,3),background:'#c9daef'}}/><Type x={30} y={410} w={304} size={40} color={C.muted} weight={400}>{"Within 3 min\n+ linked thread"}</Type></>;
 return <><Type x={34} y={28} size={40} color={C.muted} weight={400}>INCOMING MESSAGE</Type><Type x={34} y={105} w={790} size={70}>{"Thank you for\nyour email."}</Type><div style={{...place(34,310,790,2),background:'#d7e0eb'}}/><Type x={34} y={350} size={36} color={C.muted} weight={400}>MATCHED OUTBOUND MESSAGE ID</Type><Type x={34} y={415} size={64} color={BLUE}>{elliotOutbound.providerMessageId}</Type><Type x={34} y={510} size={38} color={BLUE} weight={400}>To: supervisor017@example.invalid</Type></>;
};
const FlatFolio:React.FC=()=> <div style={{...place(0,0,W,H),background:'#edf2f9',borderRadius:26}}>{LAYERS.map(ly=><div key={ly.key} style={{...place(ly.x,ly.y,ly.w,ly.h),background:'#fff',border:'2px solid #d6e0ed',borderRadius:ly.key==='sender'?0:22,overflow:'hidden'}}><FolioLayer kind={ly.key}/></div>)}</div>;

const Carry:React.FC<{f:number;primaryText:string}>=({f,primaryText})=>{
 const cam=carryCamera(f),drawn=carryDraw(f),tip=carryTip(drawn),join=ramp(f,8,28,EASE.swift),world:React.CSSProperties={...place(0,0,3840,1080),transform:'translateX('+(-cam)+'px)'};
 return <>
  <SpeedBlur vx={-velocity(carryCamera,f)} amount={.28} max={16}>
   <div style={world}>
    <Type x={110} y={92} size={34} color={C.muted} weight={400}>MAILBOX EVIDENCE · 85 SENT · 24 INCOMING</Type>
    <Type x={110} y={165} w={1200} size={82}>{primaryText}</Type>
    {[0,1].map(i=>{
     const record=AVERY.outbounds[i],x=mix(i?205:110,220+i*32,join),y=mix(i?550:320,335+i*200,join);
     return <Sheet key={record.id} x={x} y={y} w={820} h={190} style={{transform:'rotate('+mix(i?2.5:-2.5,0,join)+'deg)',zIndex:i+2}}>
      <Type x={28} y={20} size={32} color={C.muted} weight={400}>{i?'06 FEB · LATER MANUAL SEND':'23 OCT · INITIAL SENT MAIL'}</Type>
      <Type x={28} y={70} w={760} size={42} style={{whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{record.subject}</Type>
      <Type x={28} y={134} size={34} color={BLUE}>{AVERY.email}</Type>
     </Sheet>;
    })}
    <svg width={1920} height={1080} style={place(0,0)}><path d="M1060 437H1150V540H1180M1072 630H1150V540" fill="none" stroke={C.blue} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-join}/></svg>
    <div style={{...place(1210,350,600,305),opacity:join}}><Type size={36} color={C.muted} weight={400}>CONTACT HISTORY</Type><Type y={72} size={64}>{AVERY.name}</Type><Type y={171} size={46} color={BLUE}>2 sends · 1 follow-up</Type><Type y={255} size={34} color={C.muted} weight={400}>Subjects can change.</Type></div>
    <Type x={336} y={768} size={56} color={BLUE} style={{opacity:ramp(f,26,14)}}>60 contact histories</Type>
    <div style={{...place(X0,LINE_Y-4,BAR,8),background:'#cad5e3'}}/>
    <Type x={336} y={906} size={34} color={C.muted} weight={400}>Match by recipient identity.</Type>
    <Type x={2080} y={265} w={690} size={82} style={{opacity:ramp(f,100,22)}}>{"Read the\nreply evidence."}</Type>
    <Type x={2080} y={540} w={690} size={40} color={C.muted} weight={400} style={{opacity:ramp(f,112,20)*(1-ramp(f,176,14))}}>{ELLIOT.name+'\n'+ELLIOT.email}</Type>
    {f>=136?<div style={{...place(FX0,FY0,720,480),opacity:ramp(f,136,20),boxShadow:softShadow(26),background:'#edf2f9'}}><div style={{...place(0,0,W,H),transform:'scale(.45)',transformOrigin:'0 0'}}><FlatFolio/></div></div>:null}
   </div>
  </SpeedBlur>
  <div style={world}><svg width={3840} height={1080} style={place(0,0)}>
   {Array.from({length:14},(_,i)=>{const x=1200+i*120,on=ramp(X0+drawn,x,40,EASE.out);return on>0?<line key={i} x1={x} x2={x} y1={LINE_Y+12} y2={LINE_Y+(i%4===0?42:26)} opacity={on*.3} stroke={C.ink} strokeWidth={2}/>:null;})}
   <path d={`M${X0} ${LINE_Y}H${FX0}V${FY0}H${FX1}V${LINE_Y}H${FX0}`} fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="square" strokeLinejoin="miter" strokeDasharray={drawn+' '+(LENGTH+20)}/>
   {f<142?<g opacity={1-ramp(f,136,6,EASE.linear)}><circle cx={tip.x} cy={tip.y} r={30} fill={C.blue} opacity={.12}/><circle cx={tip.x} cy={tip.y} r={14} fill={C.blue}/></g>:null}
  </svg></div>
 </>;
};

type Cam={rx:number;rz:number;s:number;cx:number;cy:number};
const evidenceCamera=(f:number):Cam=>{
 const e=Math.max(0,f-212),orbit=ramp(e,30,74,EASE.smooth),tall=ramp(e,22,40,EASE.smooth)*(1-ramp(e,106,30,EASE.smooth)),outro=ramp(e,132,30,EASE.smooth),pre=ramp(f,190,22,EASE.smooth);
 const original={rx:mix(54,50,orbit),rz:mix(-34,-32,ramp(e,0,30,EASE.out))+10*orbit,s:.86*mix(.56,.47,tall)*mix(1,1.04,ramp(e,0,170,EASE.smooth)),cx:mix(140,290,outro),cy:mix(0,140,tall)+60*outro};
 const bridge=ramp(f,390,34,EASE.smooth);
 return{rx:mix(mix(0,original.rx,pre),0,bridge),rz:mix(mix(0,original.rz,pre),0,bridge),s:mix(mix(.45,original.s,pre),.07875,bridge),cx:mix(mix(360,original.cx,pre),301,bridge),cy:mix(mix(55,original.cy,pre),-62,bridge)};
};
const layerP=(e:number,i:number)=>{
 const up=e<24+i*5?0:spring({frame:e-24-i*5,fps:30,config:{damping:15,stiffness:120}});
 return up*(1-ramp(e,108+(4-i)*3,14,EASE.exit));
};
const project=(cam:Cam,x:number,y:number,z:number)=>{
 const X=x-W/2,Y=y-H/2,a=cam.rz*Math.PI/180,b=cam.rx*Math.PI/180,x1=X*Math.cos(a)-Y*Math.sin(a),y1=X*Math.sin(a)+Y*Math.cos(a),y2=y1*Math.cos(b)-z*Math.sin(b),z2=y1*Math.sin(b)+z*Math.cos(b),k=PERSP/(PERSP-z2);
 return{x:960+(x1*cam.s+cam.cx)*k,y:540+(y2*cam.s+cam.cy)*k};
};
const Evidence:React.FC<{f:number}>=({f})=>{
 const e=f-212,cam=evidenceCamera(f),since=e-134,thud=since>=0?8*Math.exp(-since/3)*Math.cos(since*.9):0,crouch=-6*ramp(e,18,6,EASE.out)*(1-ramp(e,24,6,EASE.out));
 const spread=ramp(e,24,30,EASE.out)*(1-ramp(e,108,26,EASE.exit)),out=1-ramp(f,390,34,EASE.smooth),calloutOut=ramp(e,104,10,EASE.exit);
 const notes=[{layer:4,x:110,y:405,elbow:660,title:'Same sender',detail:'From matches a sent recipient',start:52},{layer:3,x:110,y:560,elbow:700,title:'Matching thread',detail:'Reference points to the sent ID',start:58},{layer:2,x:110,y:780,elbow:720,title:'90 seconds',detail:'Linked reply within 3 minutes',start:64}];
 return <>
  <div style={{position:'absolute',inset:0,perspective:PERSP,opacity:f>=424?0:1}}><div style={{...place(160,40,W,H),transformStyle:'preserve-3d',transform:`translate(${cam.cx}px,${cam.cy+thud-crouch}px) scale(${cam.s}) rotateX(${cam.rx}deg) rotateZ(${cam.rz}deg)`}}>
   <div style={{...place(-20,10,W+40,H+40),borderRadius:46,background:'#081422',opacity:.2-.06*spread,filter:'blur(40px)',transform:'translateZ(-30px) translate(30px,40px)'}}/>
   <div style={{position:'absolute',inset:0,borderRadius:26,background:'#c9d3e6',transform:'translateZ(-14px)'}}/>
   <div style={{position:'absolute',inset:0,borderRadius:26,background:'#edf2f9',overflow:'hidden'}}>{LAYERS.map(ly=><div key={ly.key} style={{...place(ly.x+10,ly.y+10,ly.w-20,ly.h-20),border:'3px dashed #1769e045',borderRadius:16,opacity:Math.min(1,spread*2)}}/>)}</div>
   {LAYERS.map((ly,i)=>{const p=layerP(e,i),z=ly.z*p+2,h=Math.max(0,ly.z*p);return <React.Fragment key={ly.key}>
    {h>1?<div style={{...place(ly.x+h*.18,ly.y+h*.26,ly.w,ly.h),borderRadius:22,background:'#081422',filter:'blur('+(10+h*.09)+'px)',opacity:.24*(.8-h/1400),transform:'translateZ(1px)'}}/>:null}
    {h>1?<div style={{...place(ly.x,ly.y,ly.w,ly.h),borderRadius:22,background:'#b9c6de',transform:'translateZ('+(z-8)+'px)'}}/>:null}
    <div style={{...place(ly.x,ly.y,ly.w,ly.h),borderRadius:ly.key==='sender'?0:22,background:'#fff',border:'2px solid #d6e0ed',overflow:'hidden',transform:'translateZ('+(z)+'px)'}}><FolioLayer kind={ly.key}/></div>
   </React.Fragment>;})}
  </div></div>
  <div style={{opacity:out*(1-ramp(f,268,18)),transform:'translateY('+(-24*ramp(f,254,16))+'px)'}}><Type x={mix(160,110,ramp(f,190,22,EASE.smooth))} y={mix(265,105,ramp(f,190,22,EASE.smooth))} w={1100} size={mix(82,78,ramp(f,190,22,EASE.smooth))}>{'Read the\nreply evidence.'}</Type><Type x={110} y={310} size={36} color={C.muted} weight={400} style={{opacity:ramp(f,204,8)}}>{ELLIOT.name} · incoming mail</Type></div>
  {notes.map(n=>{const ly=LAYERS[n.layer],p=layerP(e,n.layer),a=project(cam,ly.x-16,ly.y+ly.h/2,ly.z*p+2),draw=ramp(e,n.start,8,EASE.out),visible=ramp(e,n.start+6,12,EASE.snappy)*(1-calloutOut);return visible>0?<React.Fragment key={n.title}>
   <svg width={1920} height={1080} style={{...place(0,0),opacity:visible}}><path d={`M${a.x} ${a.y}H${n.elbow}V${n.y+30}`} fill="none" stroke={C.blue} strokeWidth={2.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1-draw}/><circle cx={a.x} cy={a.y} r={7} fill={C.blue} stroke="#fff" strokeWidth={3}/></svg>
   <Type x={n.x} y={n.y} w={n.x>1200?380:640} size={58} color={BLUE} style={{opacity:visible}}>{n.title}</Type><Type x={n.x} y={n.y+83} w={n.x>1200?380:640} size={34} color={C.muted} weight={400} style={{opacity:visible}}>{n.detail}</Type>
  </React.Fragment>:null;})}
  <div style={{opacity:ramp(f,350,14)*(1-ramp(f,394,6))}}><Type x={110} y={500} size={68} color={BLUE}>Likely auto-reply.</Type><Type x={110} y={604} w={600} size={38} color={C.muted} weight={400}>{'Heuristic · directly linked\nwithin 3 minutes'}</Type><Native name="automatic-native-proof.png" x={110} y={740} w={1020} style={{borderRadius:24}}/></div>
 </>;
};

// A fixed sixty-contact ledger. Evidence alters the document, not a case slide.
const contactPoint=(i:number)=>({x:373+(i%10)*148,y:378+Math.floor(i/10)*100});
const inbounds=LIFE.decisions.flatMap(d=>d.observations.map(o=>({index:d.index,kind:o.kind,subject:o.subject,rule:o.evidence.rule})));
const arrival=(index:number)=>index<16?430+(index-10)*4:index<20?454+(index-16)*5:index<30?492+(index-20)*5:550+(index-56)*6;
const receiptPoint=(f:number,index:number)=>{
 const point=contactPoint(index),end=index>=56?{x:1830,y:590+(index-56)*77}:point,start={x:150,y:485};
 if(index===10){const q=f-arrival(index),anchor={x:300,y:520};if(q<14)return{...quad(start,{x:190,y:230},anchor,ramp(q,0,14,EASE.swift)),u:.3*ramp(q,0,14,EASE.swift)};if(q<50)return{...anchor,u:.3};const v=ramp(q,50,26,EASE.swift);return{...quad(anchor,{x:470,y:270},end,v),u:.3+.7*v};}
 const u=ramp(f,arrival(index),42,EASE.swift);return{...quad(start,{x:Math.max(380,end.x*.65),y:220+index%3*55},end,u),u};
};
const Field:React.FC<{f:number;primaryText:string;secondaryText:string}>=({f,primaryText,secondaryText})=>{
 const enter=ramp(f,390,34),collapse=ramp(f,748,34,EASE.smooth),late=ramp(f,664,16,EASE.out),headingOut=1-ramp(f,650,10,EASE.linear),native=ramp(f,782,20,EASE.swift);
 const tilt=18*ramp(f,424,52,EASE.smooth)*(1-ramp(f,650,98,EASE.smooth)),roll=-3*ramp(f,424,52,EASE.smooth)*(1-ramp(f,650,98,EASE.smooth));
 const received=inbounds.filter(o=>receiptPoint(f,o.index).u>=.999).length;
 const humanReceived=inbounds.filter(o=>o.kind==='human'&&f>=arrival(o.index)+42).length;
 const review=ramp(f,622,14)*(1-ramp(f,710,14));
 return <div style={{position:'absolute',inset:0,opacity:enter*(1-native),perspective:2400}}>
  <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`rotateX(${tilt}deg) rotateZ(${roll}deg)`,transformOrigin:'50% 65%'}}>
   <div style={{opacity:headingOut}}><Type x={110} y={100} w={1700} size={78}>Replies change the next action.</Type><Type x={110} y={211} size={38} color={C.muted} weight={400}>One mailbox. Sixty contact histories.</Type></div>
   <div style={{opacity:late}}><Type x={110} y={100} w={1700} size={78}>{primaryText}</Type><Type x={110} y={211} size={38} color={C.muted} weight={400}>Skip queued mail, exhausted attempts and contacts still waiting.</Type></div>
   <div style={{...place(70,370,155,240),transformStyle:'preserve-3d',opacity:ramp(f,410,14)}}>
    {[0,1,2].map(i=><div key={i} style={{position:'absolute',inset:0,border:'1px solid #c5d2e3',borderRadius:9,background:'#fff',transform:`translate(${i*5}px,${i*5}px) rotate(${i*2-2}deg)`,boxShadow:softShadow(8)}}/>)}
    <Type x={22} y={28} size={84} color={BLUE}>{24-received}</Type><Type x={22} y={132} w={120} size={32} color={C.muted} weight={400}>incoming</Type>
   </div>
   {LIFE.decisions.map(d=>{
    const point=contactPoint(d.index),slot=NATIVE.due.slots.find(row=>row.index===d.index),target=slot?{x:960,y:410+slot.y*1700/NATIVE.due.w}:point;
    const x=mix(point.x,target.x,collapse),y=mix(point.y,target.y,collapse),reply=d.observations[0],at=arrival(d.index)+(d.index===10?76:42);
    const human=reply?.kind==='human'?ramp(f,at,18,EASE.swift):0,uncertain=reply?.kind==='ambiguous'?ramp(f,at,18,EASE.swift):0,automatic=reply?.kind==='automatic'?ramp(f,at,14,EASE.swift):0;
    const check=ramp(f,650+d.index%7*3,24,EASE.swift),blocked=!d.eligible&&d.reason!=='human-managed-conversation'&&d.reason!=='ambiguous-reply'?check:0;
    const stop=Math.max(human,blocked),lift=d.eligible?28*check:0,open=1-stop,hero=d.index===16;
    const tint=human>.5?C.green:uncertain>.5?C.amber:blocked>.5?C.muted:C.blue;
    const level=Math.min(3,d.outbounds.length),opacity=(hero?ramp(f,422,4):ramp(f,410+(d.index%10+Math.floor(d.index/10))*2,14))*(1-(slot?0:collapse));
    return <div key={d.id} style={{...place(x-63,y-38,126,76),transformStyle:'preserve-3d',opacity}}>
     <div style={{position:'absolute',inset:0,borderRadius:6,background:'#081422',filter:'blur('+(10+lift*.2)+'px)',opacity:.12,transform:'translate(8px,'+(12+lift*.25)+'px)'}}/>
     {Array.from({length:level},(_,j)=><div key={j} style={{position:'absolute',inset:0,borderRadius:6,background:j===0?'#dce5ef':'#fff',border:'1px solid #bdcadb',transform:`translate(${j*3}px,${j*3}px) translateZ(${j*3}px)`}}/>)}
     <div style={{position:'absolute',inset:0,transformStyle:'preserve-3d',transform:`translateZ(${10+lift}px) translateY(${-18*open-lift*.4}px) rotateX(${-28*open}deg)`,transformOrigin:'50% 100%'}}>
      <div style={{position:'absolute',inset:0,borderRadius:6,background:'#fff',border:'2px solid '+tint,boxShadow:softShadow(12*open+lift*.5),overflow:'hidden'}}>
       <Type x={11} y={10} size={32} color={tint}>{d.id.slice(-3)}</Type>
       <div style={{...place(13,54,97,3),background:tint,opacity:.35}}/><div style={{...place(13,63,68,2),background:tint,opacity:.17}}/>
       {human>.1?<div style={{...place(78,19),opacity:human,transform:'scale('+mix(.5,1,human)+')'}}><Tick size={32} color={C.green}/></div>:null}
       {blocked>.1&&d.reason==='scheduled-follow-up-exists'?<Mail x={101} y={27} w={28} color={C.blue} opacity={blocked}/>:null}
       {blocked>.1&&d.reason==='max-attempts-reached'?<Type x={88} y={13} size={32} color={C.muted} style={{opacity:blocked}}>2</Type>:null}
       {blocked>.1&&d.reason==='waiting'?<svg width={28} height={28} viewBox="0 0 28 28" style={{...place(82,15),opacity:blocked}}><circle cx={14} cy={14} r={11} fill="none" stroke={C.muted} strokeWidth={2}/><path d="M14 6V14L20 17" stroke={C.muted} strokeWidth={2} fill="none"/></svg>:null}
      </div>
     </div>
     {automatic>.05?<div style={{...place(78,-30,62,30),borderRadius:4,background:'#e1ecfc',border:'1px solid #83aee5',transform:'translateZ(8px) rotate(7deg)',opacity:automatic}}><Type x={6} y={5} size={18} color={BLUE}>AUTO</Type></div>:null}

    </div>;
   })}
   <svg width={1920} height={1080} style={{...place(0,0),transform:'translateZ(85px)',opacity:1-collapse}}>
    {inbounds.map((o,i)=>{const endpoint=o.index>=56?{x:1830,y:590+(o.index-56)*77}:contactPoint(o.index),p=ramp(f,arrival(o.index),42,EASE.swift);return f>=arrival(o.index)?<path key={i} d={`M150 485Q${Math.max(380,endpoint.x*.65)} ${220+o.index%3*55} ${endpoint.x} ${endpoint.y}`} fill="none" stroke={o.kind==='human'?C.green:o.kind==='ambiguous'?C.amber:C.blue} strokeWidth={o.index===16?3:1.5} opacity={f<arrival(o.index)+50?.35:.05} pathLength={1} strokeDasharray={o.kind==='ambiguous'?'.015 .015':'1 1'} strokeDashoffset={1-p}/>:null;})}
   </svg>
   {inbounds.map((o,i)=>{
    const p=receiptPoint(f,o.index),loose=o.kind==='ambiguous',at=arrival(o.index),active=f>=at&&(p.u<.999||loose),emphasis=o.index===10;
    if(!active)return null;
    const width=mix(emphasis?mix(150,460,ramp(f,at,12,EASE.out)):166,loose?96:76,p.u),height=width*.66,color=o.kind==='human'?C.green:loose?C.amber:C.blue;
    return <div key={i} style={{...place(p.x-width/2,p.y-height/2,width,height),transform:'translateZ('+(loose?mix(90,8,p.u):90)+'px) rotate('+mix(-8,loose?11:0,p.u)+'deg)',opacity:1-collapse,background:'#fff',border:'1.5px solid '+color,borderRadius:6,boxShadow:softShadow(18*(1-p.u)),overflow:'hidden'}}>
     <div style={{...place(width*.08,height*.14,width*.7,3),background:color,opacity:.5}}/><div style={{...place(width*.08,height*.3,width*.84,2),background:color,opacity:.24}}/>
     {emphasis&&p.u<=.31&&f>=at+12?<Type x={24} y={height*.42} size={34} color={BLUE}>autoReply: true</Type>:loose?<><Type x={width*.08} y={height*.25} size={width*.26} color={C.amber}>{String(o.index+1).padStart(3,'0')}</Type><Type x={width*.74} y={height*.23} size={width*.3} color={C.amber}>?</Type></>:null}
    </div>;
   })}
   <div style={{position:'absolute',inset:0,opacity:ramp(f,534,12)*(1-ramp(f,610,10)),transform:'translateZ(28px)'}}><Type x={60} y={675} size={88} color={C.green}>{humanReceived}</Type><Type x={60} y={795} w={230} size={34} color={C.green} weight={400}>{'human replies\nStop automatic\nfollow-up'}</Type></div>
   <div style={{position:'absolute',inset:0,opacity:review,transform:'translateZ(28px)'}}><Type x={310} y={942} w={900} size={44} color={C.amber}>4 sender-only matches need confirmation.</Type><Native name="confirm-human-native-button.png" x={1240} y={906} w={540}/></div>
   <div style={{opacity:ramp(f,710,18)*(1-collapse)}}><Type x={60} y={675} size={88} color={BLUE}>20</Type><Type x={60} y={800} w={220} size={38} color={C.muted} weight={400}>{'need a\nfollow-up'}</Type></div>
  </div>
 </div>;
};

const ROW_CUES=[0,10,19,27,34,40,45,49,53,56,59,62,65,68,71,74,77,80,83,86];
// RowEmbed's actual terminal-velocity bezier, not the generic smooth camera curve.
import {bezier} from './lib/Polish';
const ROW_EASE=bezier(.5,0,.8,.75);
const NativeBatch:React.FC<{f:number;primaryText:string;secondaryText:string}>=({f,primaryText,secondaryText})=>{
 const a=ramp(f,782,20,EASE.swift),s=1700/NATIVE.due.w,scroll=8*ramp(f,782,106,EASE.smooth),selected=ramp(f,900,8,EASE.swift),full=imageSize('due-list.png');
 return <div style={{position:'absolute',inset:0,opacity:a}}>
  <Type x={110} y={100} w={1700} size={78}>{primaryText}</Type><Type x={110} y={211} size={38} color={C.muted} weight={400}>{secondaryText}</Type>
  <div style={{...place(110,320,1700,690),borderRadius:12,background:'#f4f7fa',boxShadow:softShadow(20),overflow:'hidden'}}>
   <div style={{...place(0,-scroll,1700,full.h*s/2)}}>
    <Native name="due-list.png" x={0} y={0} w={1700}/>
    {selected>0?<Native name="due-selected-list.png" x={0} y={0} w={1700} opacity={selected}/>:null}
    {NATIVE.due.slots.map((row,i)=>{
     const cue=796+ROW_CUES[i],land=cue+12,p=ramp(f,cue,12,ROW_EASE),air=1-p,x=row.x*s,y=row.y*s,w=row.w*s,h=row.h*s,patch=1-ramp(f,land,2,EASE.linear);
     const scale=f<land?1.06-.065*p:mix(.995,1,ramp(f,land,4,EASE.out));
     const vy=120*(1-ramp(f-.5,cue,12,ROW_EASE)-(1-ramp(f+.5,cue,12,ROW_EASE))),mb=f<land?Math.min(3.2,Math.abs(vy)*.22):0;
     return <React.Fragment key={row.email}>
      {f>=cue&&f<land+3?<div style={{...place(x+10,y+6,w-20,h-6),borderRadius:10,boxShadow:'0 '+(2+6*air)+'px '+(6+18*air)+'px #18223055',opacity:(f<land?clamp(1-air*2)*.5:.5*(1-ramp(f,land,3,EASE.linear))),zIndex:2}}/>:null}
      {patch>0?<div style={{...place(x-2,y-2,w+4,h+4),background:'#f4f7fa',opacity:patch}}><div style={{position:'absolute',inset:5,border:'1px dashed #b3c4d8',borderRadius:10,opacity:.35}}/></div>:null}
      {f>=cue&&f<land+4?<div style={{...place(x,y,w,h),opacity:ramp(f,cue,3,EASE.linear),transform:`perspective(900px) translateY(${-120*air}px) rotateX(${16*air}deg) scale(${scale})`,filter:mb>.25?'url(#fu-row-blur-'+i+')':undefined,zIndex:3}}>{mb>.25?<svg width={0} height={0} style={place(0,0)}><filter id={'fu-row-blur-'+i} x="-5%" y="-30%" width="110%" height="160%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation={'0 '+mb}/></filter></svg>:null}<Img src={staticFile('native/'+row.file)} style={{width:w,height:h,borderRadius:10,boxShadow:softShadow(34*air),overflow:'hidden'}}/></div>:null}
      {f>=land&&f<land+8?<div style={{...place(x,y,w,h),borderRadius:10,overflow:'hidden',opacity:1-ramp(f,land+2,6,EASE.linear),zIndex:4}}><div style={{...place((w-w*ramp(f,land,5,EASE.out))/2,h-2,w*ramp(f,land,5,EASE.out),2),background:'linear-gradient(90deg,transparent,#1769e0 20%,#1769e0 80%,transparent)'}}/></div>:null}
     </React.Fragment>;
    })}
   </div>
  </div>
  <div style={{...place(1140,890,620,108),background:'#fff',border:'1px solid #b9d1ed',borderRadius:10,boxShadow:softShadow(8),opacity:ramp(f,900,8),transform:'translateY('+mix(15,0,ramp(f,900,8))+'px)'}}><div style={place(22,27)}><Tick color={C.green} size={48}/></div><Type x={92} y={22} size={56} color={C.green}>20 selected</Type></div>
 </div>;
};

const FollowupMaster:React.FC<{f:number;primaryText:string;secondaryText:string;kind:'history'|'eligibility'}>=({f,primaryText,secondaryText,kind})=>{
 const historyTitle=kind==='history'?primaryText:'One history per recipient.';
 const readyTitle=kind==='eligibility'?primaryText:'20 contacts need a follow-up.';
 const readyDetail=kind==='eligibility'?secondaryText:'40 stay monitored.';
 return <Surface>
  {f<190?<Carry f={f} primaryText={historyTitle}/>:null}
  {f>=190&&f<424?<Evidence f={f}/>:null}
  {f>=390&&f<802?<Field f={f} primaryText={readyTitle} secondaryText={readyDetail}/>:null}
  {f>=782?<NativeBatch f={f} primaryText={readyTitle} secondaryText={readyDetail}/>:null}
 </Surface>;
};
export const FOLLOWUP_VIEWS:Record<string,React.FC<MotionViewProps>>={
 history:({f,primaryText,secondaryText})=><FollowupMaster f={f} kind="history" primaryText={primaryText} secondaryText={secondaryText}/>,
 eligibility:({f,primaryText,secondaryText})=><FollowupMaster f={f+SHOTS.find(s=>s.id==='eligibility')!.from-SHOTS.find(s=>s.id==='history')!.from} kind="eligibility" primaryText={primaryText} secondaryText={secondaryText}/>,
};
