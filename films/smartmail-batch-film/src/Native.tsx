import React from 'react';
import {AbsoluteFill,Img,Html5Video,staticFile,useCurrentFrame} from 'remotion';
import {cameraEase,mix,ramp,swift} from './motion';
import {beatF,TOTAL,TOKENS as T} from './timeline';
import MEDIA from './media.json';
import LAYOUT from './native-layout.json';
type Cam={f:number;x:number;y:number;s:number};
const KEYS:Cam[]=[
 [0,720,470,1.13],[beatF(13),720,245,1.24],
 [beatF(16),625,465,1.24],[beatF(20)-22,700,510,1.38],[beatF(24)-22,940,500,1.31],[beatF(28)-24,1120,790,1.34],
 [beatF(31),725,610,1.2],[beatF(47),725,600,1.2],
 [beatF(48),590,480,1.44],[beatF(55),740,540,1.2],[beatF(60),720,395,1.35],
 [beatF(64),780,500,1.16],[beatF(68),780,570,1.26],[beatF(72),770,545,1.30],[beatF(77),715,495,1.16],
 [beatF(80),720,450,1.15],[beatF(84)-22,1100,415,1.63],[beatF(89),1110,555,1.61],[beatF(94),1110,560,1.61],
 [beatF(96),725,400,1.18],[beatF(99),770,470,1.13],[beatF(104),580,460,1.55],[beatF(112),780,570,1.45],[beatF(116),715,450,1.14],
 [beatF(122),730,525,1.27],[beatF(128),890,825,1.46],[beatF(132),910,850,1.46],
 [beatF(144),910,850,1.46],[beatF(151),800,765,1.27],
 [beatF(154),715,490,1.17],[beatF(158),930,555,1.22],[beatF(164),805,685,1.44],[beatF(172),805,710,1.41],[beatF(179),805,690,1.41],
 [beatF(180)-1,805,690,1.41],[beatF(180),720,255,1.22],
 [beatF(184),720,470,1.17],[beatF(191),500,490,1.60],[beatF(195),740,440,1.20],
 [beatF(201),730,540,1.22],[beatF(207),980,480,1.32],[beatF(208),720,470,1.12],
].map(([f,x,y,s])=>({f,x,y,s}));
export const cameraAt=(f:number):Cam=>{
 const i=KEYS.findIndex(k=>k.f>f);if(i<0)return KEYS[KEYS.length-1];if(i===0)return KEYS[0];
 const a=KEYS[i-1],b=KEYS[i],u=(f-a.f)/(b.f-a.f),p=cameraEase(u),hop=Math.hypot(b.x-a.x,b.y-a.y)>200?.08*Math.sin(Math.PI*u):0;
 return {f,x:mix(a.x,b.x,p),y:mix(a.y,b.y,p),s:mix(a.s,b.s,p)*(1-hop)};
};
const EVENTS=Object.entries(LAYOUT.targets).map(([id,e])=>({id,...e})).filter(e=>!['replacement-file'].includes(e.id)).sort((a,b)=>a.frame-b.frame);
const cursorAt=(f:number)=>{
 let p={x:740,y:250};
 for(const e of EVENTS){const start=e.frame-22;if(f<start)break;const u=ramp(f,start,16,swift),x=e.x+e.width/2,y=e.y+e.height/2,dx=x-p.x,dy=y-p.y,len=Math.max(1,Math.hypot(dx,dy)),bow=Math.sin(Math.PI*u)*Math.min(60,len*.08);p={x:mix(p.x,x,u)-dy/len*bow,y:mix(p.y,y,u)+dx/len*bow};}
 return p;
};
export const Native:React.FC<{frame:number;cache?:boolean;opacity?:number;blur?:number;cursor?:boolean}>=({frame,cache=MEDIA.cache,opacity=1,blur=0,cursor=true})=>{
 const ownFrame=useCurrentFrame();
 const c=cameraAt(frame),pos=cursorAt(frame),x=960+(pos.x-c.x)*c.s,y=480+(pos.y-c.y)*c.s;
 const event=EVENTS.find(e=>frame>=e.frame&&frame<e.frame+18),q=event?frame-event.frame:99,press=q<3?1:q<8?1-ramp(q,3,5):0;
 const stillFrame=Math.max(0,Math.min(TOTAL-1,frame));
 return <AbsoluteFill style={{overflow:'hidden',opacity}}>
  <div style={{position:'absolute',left:0,top:0,width:1440,height:1000,transformOrigin:'0 0',transform:`translate(${960-c.x*c.s}px,${480-c.y*c.s}px) scale(${c.s})`,filter:blur?`blur(${blur}px)`:undefined}}>
   {cache?<Img src={staticFile(`native/frames/f${String(stillFrame).padStart(5,'0')}.jpg`)} style={{width:1440,height:1000}}/>:<Html5Video src={staticFile('native/batch-native.mp4')} trimBefore={frame-ownFrame} muted style={{width:1440,height:1000}}/>}
  </div>
  {cursor&&frame<beatF(208)?<div style={{position:'absolute',left:x,top:y}}>
   {event?<div style={{position:'absolute',left:-40,top:-40,width:80,height:80,border:`3px solid ${T.accent}`,borderRadius:40,opacity:.36*(1-q/18),transform:`scale(${mix(.3,1.5,q/18)})`}}/>:null}
   <svg width={40} height={40} viewBox="0 0 24 24" style={{overflow:'visible',transform:`scale(${1-.16*press})`,transformOrigin:'3px 2px',filter:'drop-shadow(0 3px 3px #18223044)'}}><path d="M4.5 2.5L4.5 19.2 8.9 15 11.9 21.6 14.9 20.3 11.9 13.8 18.2 13.4Z" fill={T.ink} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round"/></svg>
  </div>:null}
 </AbsoluteFill>;
};
