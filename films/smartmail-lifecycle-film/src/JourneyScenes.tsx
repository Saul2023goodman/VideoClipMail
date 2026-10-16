import React from 'react';
import {Img,spring,staticFile} from 'remotion';
import {Surface,Capture} from './ui';
import {COLORS as C} from './timeline';
import {EASE,bezier,mix,ramp,softShadow} from './lib/Polish';
import {Type,Kicker,Sheet,Cursor,FileIcon,ScanBracket,place,clamp,quad,words} from './lib/ProcessMotion';
import type {MotionViewProps} from './MotionScenes';
import JOURNEY from './journey-layout-v7.json';
type V=MotionViewProps;
const A='var(--process-accent, #1769e0)';
const rnd=(i:number,salt:number)=>{const q=Math.sin(i*12.9898+salt*78.233)*43758.5453;return q-Math.floor(q);};
const path=(from:{x:number;y:number},to:{x:number;y:number},t:number,arc=0)=>quad(from,{x:mix(from.x,to.x,.5),y:mix(from.y,to.y,.5)-arc},to,t);

// One population opens, shares a reader, and enters persistent output pockets.
// Package recognition precedes semantic purpose. Uncertain notes stop for the operator.
const Intake:React.FC<V>=({f,primaryText})=>{
 const unpack=ramp(f,43,36,EASE.swift),route=ramp(f,169,39,EASE.swift),notesZoom=ramp(f,202,22,EASE.swift),chosen=ramp(f,244,8),notesRoute=ramp(f,278,22,EASE.swift);
 const inspectOp=unpack*(1-route),formatOp=ramp(f,68,14)*(1-ramp(f,164,15));
 const outputs=[{label:'Mail',detail:'61 candidates',y:290,color:A,at:192},{label:'Contacts',detail:'60 rows · 1 sheet',y:470,color:A,at:204},{label:'Attachments',detail:'4 PDF files',y:650,color:A,at:133},{label:'Unused',detail:'1 source',y:830,color:C.amber,at:294}];
 const letter=path({x:490,y:365},{x:1532,y:320},route,120),letterScale=mix(1,.3,route),roster=path({x:490,y:866},{x:1534,y:506},route,40);
 const ns=mix(320,800,notesZoom),nx=mix(1100,555,notesZoom),ny=mix(380,357,notesZoom),note=path({x:nx,y:ny},{x:1535,y:868},notesRoute,120),noteScale=mix(1,.15,notesRoute);
 const scanY=mix(350,1010,clamp((f-89)/75));
 return <Surface>
  <Kicker>ONE MIXED IMPORT</Kicker><Type x={110} y={152} size={74}>{primaryText}</Type>
  <div style={{...place(100,410,280,300),transform:`rotate(${mix(-7,-2,unpack)}deg)`,opacity:1-.32*unpack}}><Sheet x={0} y={0} w={280} h={300}>
   <div style={{...place(204,0,25,300),background:'repeating-linear-gradient(0deg,#d1dae8 0 9px,transparent 9px 18px)',opacity:.8}}/>
   <Type x={28} y={36} size={68}>ZIP</Type><Type x={28} y={146} size={40} weight={400}>68 files</Type><Type x={28} y={218} size={32} color={C.muted} weight={400}>Mixed sources</Type>
  </Sheet></div>
  {f<61?<>{[0,1].map(i=>{const merge=ramp(f,13,25,EASE.swift),fade=ramp(f,40,15);return <div key={i} style={{...place(mix(i?1120:630,870,merge),mix(i?550:405,465,merge),480,170),opacity:1-fade,transform:`rotate(${mix(i?5:-4,0,merge)}deg)`}}><Sheet x={0} y={0} w={480} h={170}><div style={place(22,22)}><FileIcon kind="DOCX" size={56}/></div><Type x={100} y={35} size={34}>{i?'Renamed copy':'Jordan Quinn.docx'}</Type><Type x={100} y={95} size={32} color={C.muted} weight={400}>Same SHA-256</Type></Sheet></div>;})}<Type x={630} y={725} size={56} color={A} style={{opacity:ramp(f,28,10)*(1-ramp(f,48,10))}}>Identical bytes. Import once.</Type></>:null}
  <Type x={100} y={914} size={60} style={{opacity:ramp(f,36,14)}}>67 unique</Type><Type x={100} y={993} size={34} color={C.muted} weight={400} style={{opacity:ramp(f,36,14)}}>sources</Type>
  {Array.from({length:60},(_,i)=>{const up=ramp(f,43+i*.27,29,EASE.swift),rt=ramp(f,165+i*.44,32,EASE.swift),origin={x:190,y:545},spread={x:485+(i%12)*39,y:365+Math.floor(i/12)*33};const p0=path(origin,spread,up,100),p=path(p0,{x:1520+(i%6)*9,y:325+Math.floor(i/6)*3},rt,90);return <div key={i} style={{...place(p.x,p.y,120,157),background:'#fff',border:'1px solid #ccdae9',borderRadius:5,boxShadow:softShadow(5),transform:`rotate(${mix((rnd(i,1)-.5)*12,0,rt)}deg) scale(${mix(1,.62,rt)})`,opacity:up*(1-.86*rt)}}><div style={{...place(14,23,84,2),background:'#bed0e7'}}/><div style={{...place(14,40,64,2),background:'#dce5ee'}}/></div>;})}
  <div style={{...place(mix(190,letter.x,unpack),mix(545,letter.y,unpack),570,419),transformOrigin:'0 0',transform:`scale(${unpack*letterScale})`,opacity:unpack*(1-ramp(f,203,8))}}><Capture name="01-mail-detail.png" x={0} y={0} w={570} h={419} crop={{x:1545,y:478,w:340,h:250}} radius={9}/></div>
  <Type x={490} y={316} size={32} color={C.muted} weight={400} style={{opacity:inspectOp}}>Avery Lane.docx</Type><Type x={490} y={261} size={38} color={A} weight={400} style={{opacity:formatOp}}>word/document.xml → DOCX</Type>
  <div style={{opacity:inspectOp}}>
   {f>=89&&f<=164?<div style={{...place(482,scanY,596,3),background:A,boxShadow:'0 0 13px #1769e044'}}/>:null}
   {[{y:377,h:66,at:100},{y:449,h:68,at:109},{y:527,h:249,at:138}].map((r,i)=><ScanBracket key={i} f={f} at={r.at} x={483} y={r.y} w={584} h={r.h}/>)}
   <Type x={490} y={802} size={42} color={A} style={{opacity:ramp(f,105,8)}}>{words('Recipient',f,105)}{f>=114?' · '+words('Subject',f,114):''}{f>=143?' · '+words('Body',f,143):''}</Type>
  </div>
  <div style={{...place(mix(190,roster.x,unpack),mix(545,roster.y,unpack),570,137),transformOrigin:'0 0',transform:`scale(${unpack*mix(1,.3,route)})`,opacity:unpack*(1-ramp(f,207,8))}}><Capture name="01-roster-detail.png" x={0} y={0} w={570} h={137} crop={{x:1545,y:477,w:340,h:82}} radius={7}/></div>
  <Type x={490} y={1015} size={32} color={A} weight={400} style={{opacity:formatOp}}>xl/workbook.xml → XLSX</Type>
  <div style={{opacity:inspectOp}}><ScanBracket f={f} at={164} x={482} y={859} w={586} h={151}/><Type x={1096} y={870} size={36} w={360} color={A} style={{opacity:ramp(f,169,8)}}>{words('Name / email / institution',f,169)}</Type></div>
  <div style={{...place(mix(190,note.x,unpack),mix(545,note.y,unpack),ns,ns*247/340),transformOrigin:'0 0',transform:`scale(${unpack*noteScale})`,opacity:unpack*(1-ramp(f,299,7))}}><Capture name={f>=244?'03-classified.png':'02-notes.png'} x={0} y={0} w={ns} h={ns*247/340} crop={{x:1545,y:315,w:340,h:247}} radius={9} style={{border:'2px solid #d8a55f'}}/></div>
  <Type x={1100} y={326} size={32} color={C.muted} weight={400} style={{opacity:unpack*(1-notesZoom)}}>Session_notes.docx</Type><Type x={1100} y={270} size={38} color={A} weight={400} style={{opacity:formatOp}}>DOCX</Type>
  <Type x={1100} y={654} size={42} w={320} color={C.amber} style={{opacity:ramp(f,158,12)*(1-notesZoom)}}>No clear mail structure</Type>
  <Type x={555} y={270} size={56} color={C.amber} style={{opacity:notesZoom*(1-notesRoute)}}>{chosen>.5?'Ignore for Now selected.':'Choose the purpose.'}</Type>
  {f>=224&&f<272?<Cursor x={mix(1420,1110,ramp(f,224,17,EASE.swift))} y={mix(850,635,ramp(f,224,17,EASE.swift))} press={Math.sin(Math.PI*clamp((f-241)/7))}/>:null}
  {[0,1,2,3].map(i=>{const u=ramp(f,75+i*5,48,EASE.swift),p=path({x:240,y:755},{x:1535+i*45,y:700},u,-230);return <div key={i} style={{...place(p.x,p.y,85,100),transform:`rotate(${mix(-10+i*6,0,u)}deg)`,opacity:ramp(f,70+i*5,8)*(1-ramp(f,135,15))}}><FileIcon kind="PDF" size={80}/></div>;})}
  <Type x={1097} y={1000} size={32} color={C.muted} weight={400} style={{opacity:ramp(f,86,12)*(1-ramp(f,165,12))}}>PDF → attachment files</Type>
  {outputs.map(o=>{const active=ramp(f,o.at,13),appear=ramp(f,61,24);return <div key={o.label} style={{...place(1492,o.y,330,145),borderLeft:`5px solid ${o.color}`,background:'#fff',borderRadius:9,boxShadow:softShadow(15),opacity:appear*.45+active*.55,transform:`translateX(${mix(60,0,appear)}px)`}}><Type x={24} y={20} size={48} color={active>.5?C.ink:C.muted}>{o.label}</Type><Type x={24} y={87} size={32} color={o.color} weight={400} style={{opacity:active}}>{o.detail}</Type></div>;})}
  <div style={{...place(475,565,900,220),opacity:ramp(f,300,10)}}><Type size={76} color={A}>61 mail candidates</Type><Type y={112} size={40} color={C.muted} weight={400}>Contact decisions come next.</Type></div>
 </Surface>;
};

// Exact overhead-tabletop-drop: locked-angle pan, selection, synchronous three-channel dive.
const DIVE=bezier(.36,0,.12,1),DIVE_SCALE=bezier(.45,-.18,.12,1);
const CARD_W=960,CARD_H=540,RES=2,PITCH=CARD_W+150;
const Page:React.FC<{index:number;f:number}>=({index,f})=>{
 const r=JOURNEY.reviews[index],s=.96,ox=156,oy=16;
 const emphasis=(name:'recipient'|'body'|'requested',start:number,end?:number)=>{const box=r.regions[name];return <div key={name} style={{...place(ox+box.x*s-10,oy+box.y*s-7,box.width*s+20,box.height*s+14),border:`3px solid ${A}`,borderRadius:8,opacity:ramp(f,start,9)*(end?1-ramp(f,end,9):1),pointerEvents:'none'}}/>;};
 return <div style={{...place(0,0,1920,1080),background:'#fff'}}>
  <Img src={staticFile('native/v7/'+r.nativeFile)} style={{...place(ox,oy,r.box.width*s,r.box.height*s),objectFit:'fill'}}/>
  <Type x={28} y={36} size={44} color={A}>{String(r.index).padStart(2,'0')}</Type><Type x={28} y={94} size={32} color={C.muted} weight={400}>/ 60</Type>
  {index===1?<>{emphasis('recipient',98,120)}{emphasis('requested',131)}</>:null}
  <Type x={1160} y={970} size={56} color={A} style={{opacity:index===1?ramp(f,134,12):1}}>{r.task.attachments.length} files requested</Type>
 </div>;
};
const Review:React.FC<V>=({f,primaryText})=>{
 const panX=mix(760,-360,ramp(f,0,50,EASE.smooth)),d=ramp(f,58,28,DIVE),ds=ramp(f,58,28,DIVE_SCALE);
 const rotX=f<86?mix(62,-1.6,d):f<90?mix(-1.6,.5,ramp(f,86,4,EASE.smooth)):mix(.5,0,ramp(f,90,4,EASE.smooth));
 const push=mix(1,1.012,ramp(f,94,46,EASE.smooth)),scale=(f<86?mix(1,2.04,ds):mix(2.04,2,ramp(f,86,8,EASE.smooth)))*push;
 const tx=f<=58?panX:mix(-360,0,d),pick=ramp(f,44,16,EASE.out),lift=16*(pick-ramp(f,70,18,EASE.smooth)),tilt=clamp(rotX/62);
 const pool=(x:number,k:number)=>`radial-gradient(ellipse 820px 620px at ${2800+x}px 3200px,rgba(152,190,233,${.2*k}) 0%,rgba(152,190,233,${.07*k}) 45%,transparent 75%)`;
 return <Surface dark>
  <div style={{...place(0,0,1920,1080),perspective:1600,perspectiveOrigin:'50% 42%',overflow:'hidden'}}><div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transformStyle:'preserve-3d',transform:`translateX(${tx}px) rotateX(${rotX}deg) scale(${scale})`}}>
   <div style={{...place(-2800,-3200,5600,4100),backfaceVisibility:'hidden',background:[pool(-PITCH,1-.65*pick),pool(0,1+.25*pick),pool(PITCH,1-.65*pick),'repeating-linear-gradient(90deg,#ffffff08 0 1px,transparent 1px 400px)','repeating-linear-gradient(0deg,#ffffff08 0 1px,transparent 1px 400px)','repeating-linear-gradient(90deg,#ffffff03 0 1px,transparent 1px 80px)','linear-gradient(180deg,#10253d,#081422)'].join(',')}}/>
   {JOURNEY.reviews.map((r,i)=>{const x=(i-1)*PITCH,lev=i===1?lift:0;return <React.Fragment key={r.index}>
    <div style={{...place(x-CARD_W*RES/2,-CARD_H*RES/2,CARD_W*RES,CARD_H*RES),borderRadius:10*RES,overflow:'hidden',boxSizing:'border-box',background:'#fff',backfaceVisibility:'hidden',transform:`translateZ(${4+lev}px) scale(${1/RES})`,boxShadow:`${softShadow((4+lev*1.6)*RES,{strength:3.2,color:'#000000'})},inset 0 2px 0 #ffffffb3`}}><Page index={i} f={f}/></div>
    <div style={{...place(x-CARD_W/2,CARD_H/2+34,CARD_W),fontSize:32,textAlign:'center',color:i===1?'#c2d9f5':'#a2b4c8',transform:'translateZ(1px)',letterSpacing:'.04em'}}>{String(r.index).padStart(2,'0')} / 60 · {r.task.name.toUpperCase()} · {r.task.attachments.length} FILES</div>
    {i!==1?<div style={{...place(x-CARD_W/2,-CARD_H/2,CARD_W,CARD_H),borderRadius:10,background:C.night,opacity:.08+.34*pick,transform:'translateZ(5px)'}}/>:null}
   </React.Fragment>;})}
  </div></div>
  {[-PITCH,0,PITCH].map((x,i)=>{const k=(i===1?1+.25*pick:1-.65*pick)*tilt,cx=960+tx+x*.92;return k<.02?null:<div key={x} style={{...place(cx-560,-60,1120,560),opacity:k,filter:'blur(26px)',mixBlendMode:'screen',pointerEvents:'none'}}><div style={{position:'absolute',inset:0,clipPath:'polygon(44% 0,56% 0,90% 100%,10% 100%)',background:'linear-gradient(180deg,#bdd9fa30,#bdd9fa12 60%,transparent)'}}/></div>;})}
  <div style={{position:'absolute',inset:0,pointerEvents:'none',background:`linear-gradient(180deg,rgba(8,20,34,${.95*tilt}),rgba(8,20,34,${.55*tilt}) 24%,transparent 48%)`}}/>
  <div style={{opacity:1-ramp(f,44,14)}}><Kicker style={{color:'#a8bdd3'}}>REVIEW THE BATCH · CHOOSE A MESSAGE</Kicker><Type x={110} y={152} size={72} color="#fff">{primaryText}</Type></div>
 </Surface>;
};

// UnitDotSwarmRegroupV2: exact spring and deterministic stagger, one object per actual draft.
// Native destinations join by DOM planTaskKey; the matrix's UI order differs from source order.
const CAL=JOURNEY.calendar,BOARD={x:100,y:365,w:1720},CS=BOARD.w/CAL.box.width,assignments=CAL.assignments;
const institutions=[...new Set(assignments.map(a=>a.institution))],dates=[...new Set(assignments.map(a=>a.scheduleAt.slice(0,10)))].sort();
const slots=assignments.map(a=>{const slot=CAL.slots.find(s=>s.dataset.planTaskKey===a.editKey);if(!slot)throw new Error('Missing native calendar destination: '+a.editKey);return slot;});
const groupOf=(i:number)=>institutions.indexOf(assignments[i].institution),groupMembers=institutions.map(n=>assignments.map((a,i)=>a.institution===n?i:-1).filter(i=>i>=0)),dateMembers=dates.map(d=>assignments.map((a,i)=>a.scheduleAt.startsWith(d)?i:-1).filter(i=>i>=0));
type P2=[number,number];
const lerp2=(a:P2,b:P2,t:number):P2=>[mix(a[0],b[0],t),mix(a[1],b[1],t)];
const scatter=(i:number):P2=>[200+(rnd(i,1)+rnd(i,11))*.5*1520,330+(rnd(i,2)+rnd(i,12))*.5*640];
const center=(g:number):P2=>[250+(g%6)*280,g<6?590:930];
const cluster=(i:number):P2=>{const g=groupOf(i),k=groupMembers[g].indexOf(i)+.5,c=center(g),r=29*Math.sqrt(k),a=k*2.39996+g;return [c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)];};
const calendar=(i:number):P2=>[BOARD.x+(slots[i].x+slots[i].width/2)*CS,BOARD.y+(slots[i].y+slots[i].height/2)*CS];
const column=(i:number):P2=>{const di=dates.indexOf(assignments[i].scheduleAt.slice(0,10)),members=dateMembers[di];return [calendar(i)[0],435+members.indexOf(i)*43];};
const stagOf=(i:number,phase:number)=>phase===0?rnd(i,7)*8:phase===1?Math.sqrt(groupMembers[groupOf(i)].indexOf(i)/Math.max(1,groupMembers[groupOf(i)].length-1))*8+rnd(i,13)*2:((calendar(i)[0]-190)/1630)*12+rnd(i,14)*1.5;
const posAt=(i:number,f:number):P2=>{
 const mig=(start:number,phase:number)=>spring({frame:f-start-stagOf(i,phase),fps:30,config:{damping:13,stiffness:150,mass:.8},durationInFrames:24,durationRestThreshold:.0001});
 const s=scatter(i),drift:P2=[9*Math.sin(f/21+rnd(i,8)*6.28),7*Math.cos(f/27+rnd(i,9)*6.28)];let p:P2=[s[0]+drift[0],s[1]+drift[1]];
 p=lerp2(p,cluster(i),mig(24,0));p=lerp2(p,column(i),mig(62,1));return lerp2(p,calendar(i),mig(100,2));
};
const shortName=(name:string)=>({'RMIT University':'RMIT','Australian National University':'ANU','UNSW Sydney':'UNSW','Monash University':'Monash','University of Melbourne':'Melbourne','Western Sydney University':'Western Sydney','University of Tasmania':'Tasmania'}[name]||name.replace(' University',''));
const Schedule:React.FC<V>=({f,primaryText})=>{
 const native=ramp(f,118,22,EASE.swift),projection=1-ramp(f,132,8),groupOp=ramp(f,38,10)*(1-ramp(f,60,8)),dateOp=ramp(f,77,10),result=ramp(f,132,8);
 return <Surface>
  <Kicker>ONE TILE = ONE DRAFT</Kicker><Type x={100} y={152} size={74}>{primaryText}</Type>
  <Type x={100} y={265} size={38} color={C.muted} weight={400} style={{opacity:1-result}}>Group by institution → place on allowed dates</Type><Type x={100} y={265} size={38} color={C.muted} weight={400} style={{opacity:result}}>Sydney 09:00 · weekdays · AU holidays excluded</Type>
  {institutions.map((name,g)=>{const c=center(g);return <div key={name} style={{...place(c[0]-135,c[1]-29*Math.sqrt(groupMembers[g].length)-145,270),textAlign:'center',opacity:groupOp}}><Type x={0} y={0} w={270} size={32} color={g===0?A:C.muted}>{shortName(name)}</Type><Type x={0} y={44} w={270} size={48} color={g===0?A:C.ink}>{groupMembers[g].length}</Type></div>;})}
  <Img src={staticFile('native/v7/'+CAL.nativeFile)} style={{...place(BOARD.x,BOARD.y,BOARD.w,CAL.box.height*CS),opacity:native,borderRadius:8,boxShadow:softShadow(24)}}/>
  {dates.map((date,di)=>{const slot=slots[dateMembers[di][0]],x=BOARD.x+(slot.x+slot.width/2)*CS;return <React.Fragment key={date}><div style={{...place(x-55,363,110,543),borderLeft:'1px solid #cbd7e7',opacity:dateOp*(1-native)}}/><Type x={x-54} y={323} w={108} size={32} color={C.muted} weight={400} style={{opacity:dateOp,textAlign:'center'}}>{Number(date.slice(8,10))}/{Number(date.slice(5,7))}</Type></React.Fragment>;})}
  {assignments.map((a,i)=>{const p=posAt(i,f),p0=posAt(i,f-.5),p1=posAt(i,f+.5),vx=p1[0]-p0[0],vy=p1[1]-p0[1],speed=Math.hypot(vx,vy),d=Math.hypot(scatter(i)[0]-960,(scatter(i)[1]-650)*1.6)/900;
   const born=spring({frame:f-EASE.out(Math.min(1,d))*10,fps:30,config:{damping:16,stiffness:180}}),landing=ramp(f,100+stagOf(i,2),24,EASE.smooth),slot=slots[i],w=mix(50,slot.width*CS,landing),h=mix(36,slot.height*CS,landing),blue=a.institution==='RMIT University';
   return <div key={a.id} style={{...place(p[0]-w/2,p[1]-h/2,w,h),background:blue?'#d9e9ff':'#e5ebf3',border:`${blue?2:1}px solid ${blue?A:'#94a8c1'}`,borderRadius:4,opacity:projection,overflow:'hidden',boxShadow:softShadow(4),transform:`rotate(${Math.atan2(vy,vx)*180/Math.PI*ramp(speed,2,28)*.12}deg) scale(${born}) scaleX(${1+Math.min(20,speed*.18)/w})`}}><svg width="100%" height="100%" viewBox="0 0 38 27" style={{position:'absolute',inset:0,opacity:1-landing}}><path d="M5 6H33V22H5ZM5 7 19 16 33 7" fill="none" stroke={blue?'#1769e0':'#69819f'} strokeWidth="1.4"/></svg><Img src={staticFile('native/v7/'+slot.nativeFile)} style={{width:'100%',height:'100%',objectFit:'fill',opacity:landing}}/></div>;
  })}
  {assignments.map((a,i)=>a.institution==='RMIT University'?<div key={a.id} style={{...place(BOARD.x+slots[i].x*CS-2,BOARD.y+slots[i].y*CS-2,slots[i].width*CS+4,slots[i].height*CS+4),border:`2px solid ${A}`,borderRadius:5,opacity:result}}/>:null)}
  <Type x={100} y={882} size={72} color={C.green} style={{opacity:result}}>60 drafts · 15 dates</Type><Type x={100} y={987} size={34} color={C.muted} weight={400} style={{opacity:result}}>One per institution / day · minimum 7 days apart</Type><Type x={1085} y={904} size={40} color={A} style={{opacity:result}}>RMIT · 6 drafts</Type>
 </Surface>;
};
export const JOURNEY_VIEWS:Record<string,React.FC<V>>={intake:Intake,review:Review,schedule:Schedule};
