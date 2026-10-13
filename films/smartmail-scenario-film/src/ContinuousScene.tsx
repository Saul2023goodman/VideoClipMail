import React,{useEffect,useState} from 'react';
import {AbsoluteFill,Easing,Img,OffthreadVideo,Sequence,continueRender,delayRender,getRemotionEnvironment,staticFile,useCurrentFrame} from 'remotion';
import {CAMERA,EVENTS,PROOFS,TOTAL,type Cam} from './timeline';
import HIRES from './native-hires.json';

export const TOKENS={bg:'#f4f6f8',surface:'#ffffff',ink:'#182230',muted:'#667085',accent:'#1769e0',line:'#dfe5ec'};
export const FontStyles:React.FC=()=> <style>{`@font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-Regular.ttf')})} @font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-Bold.ttf')});font-weight:700} @font-face{font-family:Film;src:url(${staticFile('fonts/OpenSans-ExtraBold.ttf')});font-weight:800}`}</style>;
export const ramp=(f:number,from:number,duration:number,ease=(x:number)=>x)=>ease(Math.max(0,Math.min(1,(f-from)/duration)));
export const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const CAMERA_EASE=Easing.bezier(.55,0,.18,1);
const SWIFT=Easing.bezier(.16,1,.3,1);
export const cameraAt=(frame:number):Cam=>{
 const first=CAMERA[0],last=CAMERA[CAMERA.length-1];
 if(frame<=first.frame)return first;if(frame>=last.frame)return last;
 const i=CAMERA.findIndex(p=>p.frame>frame),a=CAMERA[i-1],b=CAMERA[i];
 const raw=(frame-a.frame)/(b.frame-a.frame),u=CAMERA_EASE(raw);
 const distance=Math.hypot(b.x-a.x,b.y-a.y);
 const hop=distance>300?.08*Math.sin(Math.PI*raw):0;
 return {frame,x:mix(a.x,b.x,u),y:mix(a.y,b.y,u),s:mix(a.s,b.s,u)*(1-hop)};
};
const eventPoint=(e:typeof EVENTS[number])=>({x:e.id==='greeting'?e.x+65:e.x+e.width/2,y:e.id==='greeting'?e.y+15:e.y+e.height/2});
export const cursorAt=(f:number)=>{
 let p={x:590,y:185};
 for(const e of EVENTS){
  const to=eventPoint(e),start=e.frame-23,u=ramp(f,start,17,SWIFT);
  if(f<start)break;
  const dx=to.x-p.x,dy=to.y-p.y,len=Math.max(1,Math.hypot(dx,dy));
  const bow=Math.sin(Math.PI*u)*Math.min(60,len*.08);
  p={x:mix(p.x,to.x,u)-dy/len*bow,y:mix(p.y,to.y,u)+dx/len*bow};
 }
 return p;
};
const Cursor:React.FC<{frame:number;camera:Cam;accent:string}>=({frame,camera,accent})=>{
 const p=cursorAt(frame),x=960+(p.x-camera.x)*camera.s,y=485+(p.y-camera.y)*camera.s;
 const clicked=EVENTS.find(e=>frame>=e.frame&&frame<e.frame+18);
 const q=clicked?frame-clicked.frame:-99;
 const press=q>=0&&q<3?1:q>=3&&q<8?1-ramp(q,3,5,Easing.out(Easing.cubic)):0;
 const opacity=ramp(frame,3,15)*(1-ramp(frame,2390,25));
 return <div style={{position:'absolute',left:x,top:y,opacity,pointerEvents:'none'}}>
  {clicked?<div style={{position:'absolute',left:-40,top:-40,width:80,height:80,border:`3px solid ${accent}`,borderRadius:'50%',opacity:.36*(1-q/18),transform:`scale(${mix(.3,1.5,q/18)})`}}/>:null}
  <svg width={42} height={42} viewBox="0 0 24 24" style={{position:'absolute',left:-3,top:-2,overflow:'visible',transform:`scale(${1-.16*press})`,transformOrigin:'3px 2px',filter:'drop-shadow(0 2px 2px #18223055)'}}><path d="M4.5 2.5 L4.5 19.2 L8.9 15 L11.9 21.6 L14.9 20.3 L11.9 13.8 L18.2 13.4 Z" fill="#182230" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round"/></svg>
 </div>;
};
// Narrative prop, not a recreation of a product screen: the three actual input
// files are represented as physical sheets, then land in the native drop area.
const InputBundle:React.FC<{frame:number;camera:Cam;accent:string}>=({frame,camera,accent})=>{
 if(frame>=102)return null;
 const move=ramp(frame,12,72,Easing.bezier(.45,0,.2,1)),land=ramp(frame,84,14,SWIFT);
 const wx=mix(600,715,move),wy=mix(320,183,move);
 const x=960+(wx-camera.x)*camera.s,y=485+(wy-camera.y)*camera.s;
 const names=['Project brief v1.pdf','Partner contacts.csv','Partner invitations.csv'];
 return <div style={{position:'absolute',left:x,top:y,transform:`translate(-50%,-50%) scale(${mix(1,.38,land)}) rotate(${mix(-5,0,move)}deg)`,opacity:1-ramp(frame,92,10),width:750,height:240}}>
  {names.map((name,i)=>{const show=ramp(frame,i*8,24,SWIFT);return <div key={name} style={{position:'absolute',left:mix(50,22*(2-i),show),top:mix(90,45*(2-i),show),width:700,height:98,display:'flex',alignItems:'center',gap:24,padding:'0 30px',boxSizing:'border-box',borderRadius:12,background:TOKENS.surface,border:`1px solid ${TOKENS.line}`,boxShadow:`0 ${6+5*i}px ${20+6*i}px #18223020`,transform:`translateY(${(1-show)*48}px)`,opacity:show}}>
   <svg width={44} height={52} viewBox="0 0 44 52"><path d="M4 2H28L40 14V48H4Z" fill={i===0?'#fdf2f0':'#eaf2ff'} stroke={i===0?'#b85243':accent} strokeWidth="2"/><path d="M28 2V14H40" fill="none" stroke={i===0?'#b85243':accent} strokeWidth="2"/><path d="M12 25H32M12 33H32M12 41H24" stroke={i===0?'#b85243':accent} strokeWidth="2"/></svg>
   <div style={{fontSize:40,fontWeight:700,letterSpacing:'-.025em',color:TOKENS.ink}}>{name}</div>
  </div>;})}
 </div>;
};

// The real scheduled Nora card leaves the same-day stack and lands in the
// actual later-day slot. Its displayed date and recipient come from native UI.
const CalendarHandoff:React.FC<{frame:number}>=({frame})=>{
 if(frame<1428||frame>=1496)return null;
 const u=ramp(frame,1428,60,Easing.bezier(.65,0,.35,1)),fade=1-ramp(frame,1490,6);
 const x=mix(294,842,u),y=mix(390,369,u)-34*Math.sin(Math.PI*u);
 return <>
  <div style={{position:'absolute',left:842,top:369,width:531,height:98,background:'#ffffff',opacity:fade}}/>
  <Img src={staticFile('native/hires-1500.png')} style={{position:'absolute',left:x,top:y,width:531,height:98,opacity:fade,transform:`rotate(${3.5*Math.sin(Math.PI*u)}deg)`,transformOrigin:'50% 50%',boxShadow:`0 ${9*Math.sin(Math.PI*u)}px ${22*Math.sin(Math.PI*u)}px #18223022`}}/>
 </>;
};

// A narrative illustration of the frozen inbox reply, attached to the same
// page plane as Alex's native state. It resolves into the real Yes decision.
const IncomingReply:React.FC<{frame:number}>=({frame})=>{
 if(frame<2055||frame>=2167)return null;
 const arrive=ramp(frame,2055,25,SWIFT),resolve=ramp(frame,2125,40,CAMERA_EASE);
 const x=mix(mix(950,330,arrive),690,resolve),y=mix(mix(705,760,arrive),944,resolve);
 const w=mix(250,80,resolve),h=mix(134,25,resolve);
 const opacity=arrive*(1-ramp(frame,2155,12));
 return <div style={{position:'absolute',left:x,top:y,width:w,height:h,padding:18,boxSizing:'border-box',background:'#f5fbf8',color:TOKENS.ink,border:'1px solid #b9d7c5',borderRadius:12,boxShadow:'0 9px 24px #1822301b',overflow:'hidden',opacity,transform:`rotate(${(1-arrive)*7}deg)`}}>
  <div style={{fontSize:12,fontWeight:700,color:'#2f7453',marginBottom:9,whiteSpace:'nowrap'}}>Alex Morgan’s reply</div>
  <div style={{fontSize:20,lineHeight:1.24,letterSpacing:'-.02em',opacity:1-resolve}}>“Let us find a time to talk.”</div>
 </div>;
};

export type CampaignProps={sourceFrom?:number;campaignName?:string;accent?:string;closingLine?:string;proof?:boolean};
export const ContinuousCampaign:React.FC<CampaignProps>=({sourceFrom=0,campaignName='Partner invitations',accent=TOKENS.accent,closingLine='Plan the campaign. Follow the conversation.',proof=false})=>{
 const local=useCurrentFrame(),frame=local+sourceFrom,camera=cameraAt(frame);
 const rendering=getRemotionEnvironment().isRendering;
 const [mediaMode,setMediaMode]=useState<'pending'|'frames'|'video'>(rendering&&!proof?'pending':'video');
 const [mediaHandle]=useState(()=>rendering&&!proof?delayRender('Resolve optional native frame cache'):null);
 useEffect(()=>{
  if(mediaHandle===null)return;
  let active=true;
  fetch(staticFile('render-frames/source.json')).then(r=>r.ok?r.json():null).then(data=>{if(active)setMediaMode(data?.frames===2520?'frames':'video');}).catch(()=>{if(active)setMediaMode('video');}).finally(()=>continueRender(mediaHandle));
  return ()=>{active=false;};
 },[mediaHandle]);
 const proofFrame=PROOFS.reduce((p,n)=>Math.abs(n-frame)<Math.abs(p-frame)?n:p,PROOFS[0]);
 const finishing=ramp(frame,2400,50,CAMERA_EASE),windowY=mix(120,90,finishing),windowH=mix(730,920,finishing);
 const progress=Math.min(1,frame/TOTAL);
 return <AbsoluteFill style={{background:TOKENS.bg,color:TOKENS.ink,fontFamily:'Film,Arial,sans-serif',overflow:'hidden'}}>
  <FontStyles/>
  <div style={{position:'absolute',left:64,top:38,fontSize:32,fontWeight:700,letterSpacing:'.07em',textTransform:'uppercase',opacity:1-finishing}}>{campaignName}</div>
  <div style={{position:'absolute',right:64,top:38,fontSize:32,color:TOKENS.muted,opacity:1-finishing}}>8 people · 4 organizations</div>
  <div style={{position:'absolute',left:64,top:windowY,width:1792,height:windowH,overflow:'hidden',borderRadius:18,background:TOKENS.surface,border:`1px solid ${TOKENS.line}`,boxShadow:'0 18px 46px #18223012'}}>
   {/* Layout zoom rasterizes the media at its displayed size. The only camera
       plane is shared by the native take and all page-space evidence. */}
   <div style={{position:'absolute',left:0,top:0,width:1440,height:1000,zoom:camera.s,transform:`translate(${(960-64)/camera.s-camera.x}px,${(485-windowY)/camera.s-camera.y}px)`,transformOrigin:'0 0'}}>
    {proof?<Img src={staticFile(`native/f${String(proofFrame).padStart(4,'0')}.png`)} style={{width:1440,height:1000}}/>:mediaMode==='pending'?null:mediaMode==='frames'?<Img src={staticFile(`render-frames/f${String(Math.min(2519,Math.max(0,frame))).padStart(4,'0')}.jpg`)} style={{width:1440,height:1000}}/>:frame>=1530&&frame<1890?<Sequence from={1530-sourceFrom} durationInFrames={360} layout="none"><OffthreadVideo src={staticFile('native/maintenance-native.mp4')} muted style={{width:1440,height:1000}}/></Sequence>:<OffthreadVideo src={staticFile('native/campaign-native.mp4')} startFrom={sourceFrom} muted style={{width:1440,height:1000}}/>}
    {HIRES.filter(p=>p.captureFrame!==1500&&frame>=p.from&&frame<p.to).map(p=><Img key={p.src} src={staticFile(p.src)} style={{position:'absolute',left:p.x,top:p.y,width:p.w,height:p.h,opacity:ramp(frame,p.from,5)*(1-ramp(frame,p.to-5,5))}}/>)}
    <CalendarHandoff frame={frame}/>
    <IncomingReply frame={frame}/>
   </div>
  </div>
  <InputBundle frame={frame} camera={camera} accent={accent}/>
  <div style={{position:'absolute',inset:0,overflow:'hidden',clipPath:`inset(${windowY}px 64px ${1080-windowY-windowH}px 64px round 18px)`}}><Cursor frame={frame} camera={camera} accent={accent}/></div>
  <div style={{position:'absolute',left:64,right:64,top:866,height:3,background:TOKENS.line,opacity:1-finishing}}><div style={{width:`${100*progress}%`,height:3,background:accent}}/></div>
  {frame>=2400?<div style={{position:'absolute',left:mix(230,300,finishing),top:mix(700,752,finishing),padding:'24px 40px',background:'#ffffffee',border:`1px solid ${TOKENS.line}`,borderRadius:18,opacity:ramp(frame,2412,32),boxShadow:'0 16px 42px #18223015'}}>
   <div style={{fontSize:102,fontWeight:800,letterSpacing:'-.055em',lineHeight:1.05}}>SmartMail Ops</div>
   <div style={{fontSize:56,marginTop:14,color:TOKENS.muted,letterSpacing:'-.025em'}}>{closingLine}</div>
  </div>:null}
  <div style={{position:'absolute',inset:0,background:TOKENS.bg,opacity:ramp(frame,2507,12),pointerEvents:'none'}}/>
 </AbsoluteFill>;
};
